/**
 * Saving a file via <a download> silently no-ops inside the Capacitor WebView —
 * there's no browser download manager to hand it to, so the "success" toast fires
 * but nothing ever reaches the device. Inside the native app the blob is written
 * via the Filesystem plugin and then either saved to the device's Documents
 * folder, opened in the default viewer, or handed to the OS share sheet — the
 * caller decides (the export screens ask the user). In a normal browser, the
 * existing <a download> flow works fine and is left untouched.
 */
export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.()
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve((reader.result as string).split(',')[1] || '')
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function requireFilesystem() {
  const Plugins = (window as any).Capacitor?.Plugins
  const Filesystem = Plugins?.Filesystem
  if (!Filesystem) {
    // Older installed app without the Filesystem plugin bundled — nothing we can
    // do from the web side alone. Let the caller's existing UI report failure.
    throw new Error('This app version cannot save files. Please update the app.')
  }
  return { Plugins, Filesystem }
}

const mimeFor = (filename: string) =>
  filename.endsWith('.xlsx')
    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : filename.endsWith('.pdf')
      ? 'application/pdf'
      : undefined

/**
 * Whether a file written to Documents will actually be visible to the user.
 * On Android, Documents is public. On iOS it only appears in the Files app
 * once the binary ships UIFileSharingEnabled — the same build generation that
 * bundles FileOpener, so the plugin's presence stands in for the plist flag.
 * Older iOS builds must route "save" through the share sheet's Save to Files.
 */
export function canSaveVisibly(): boolean {
  const Capacitor = (window as any).Capacitor
  if (Capacitor?.getPlatform?.() !== 'ios') return true
  return !!Capacitor?.Plugins?.FileOpener
}

/** Browser-only path: the ordinary download manager. */
function browserDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Write the blob into the device's Documents folder and return where it went.
 * On Android that is the public Documents directory, visible to any Files app.
 * On iOS it is the app's own Documents folder — visible in the Files app under
 * "On My iPhone" once the binary ships with UIFileSharingEnabled (set in
 * Info.plist; builds before that can only reach files through the share sheet).
 */
export async function saveBlobToDevice(blob: Blob, filename: string): Promise<{ uri: string; location: string }> {
  const { Filesystem } = requireFilesystem()
  const base64Data = await blobToBase64(blob)
  const written = await Filesystem.writeFile({
    path: `NSPIRE/${filename}`,
    data: base64Data,
    directory: 'DOCUMENTS',
    recursive: true,
  })
  return { uri: written.uri, location: `Documents/NSPIRE/${filename}` }
}

/** Hand the blob to the OS share sheet (WhatsApp, email, Save to Files…). */
export async function shareBlob(blob: Blob, filename: string): Promise<void> {
  const { Plugins, Filesystem } = requireFilesystem()
  const Share = Plugins?.Share
  const base64Data = await blobToBase64(blob)
  const written = await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: 'CACHE',
    recursive: true,
  })
  if (Share) {
    await Share.share({ title: filename, url: written.uri })
  }
}

/** Open the blob straight in the device's default viewer, if the binary can. */
export async function openBlob(blob: Blob, filename: string): Promise<boolean> {
  const { Plugins, Filesystem } = requireFilesystem()
  const FileOpener = Plugins?.FileOpener
  if (!FileOpener) return false
  const base64Data = await blobToBase64(blob)
  const written = await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: 'CACHE',
    recursive: true,
  })
  try {
    await FileOpener.openFile({ path: written.uri, contentType: mimeFor(filename) })
    return true
  } catch {
    return false
  }
}

/**
 * Default flow, kept for every existing caller: browser → download manager;
 * native → the OS share sheet, exactly as before the direct-open experiment
 * (the tester found the viewer popping up on its own more confusing than the
 * sheet). The summary screen offers Download/Share as explicit choices.
 */
export async function saveAndShareBlob(blob: Blob, filename: string): Promise<void> {
  if (!isNativeApp()) {
    browserDownload(blob, filename)
    return
  }
  await shareBlob(blob, filename)
}
