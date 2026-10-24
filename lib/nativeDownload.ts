/**
 * Saving a file via <a download> silently no-ops inside the Capacitor WebView —
 * there's no browser download manager to hand it to, so the "success" toast fires
 * but nothing ever reaches the device. Inside the native app, write the blob to
 * the app's cache dir via the Filesystem plugin and hand it to the OS share sheet
 * (Save to Files / Drive / email, etc.) instead. In a normal browser, the existing
 * <a download> flow works fine and is left untouched.
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

export async function saveAndShareBlob(blob: Blob, filename: string): Promise<void> {
  if (!isNativeApp()) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    return
  }

  const Plugins = (window as any).Capacitor?.Plugins
  const Filesystem = Plugins?.Filesystem
  const Share = Plugins?.Share
  if (!Filesystem) {
    // Older installed app without the Filesystem plugin bundled — nothing we can
    // do from the web side alone. Let the caller's existing UI report failure.
    throw new Error('This app version cannot save files. Please update the app.')
  }

  const base64Data = await blobToBase64(blob)
  const written = await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: 'CACHE',
    recursive: true,
  })

  // Open the file directly in the device's default viewer (Excel, Sheets,
  // PDF viewer) when the binary carries the FileOpener plugin — exporting
  // used to land on the share sheet only, and reaching the actual report
  // meant hunting through Files or a share target. Older binaries without
  // the plugin keep the share sheet.
  const FileOpener = Plugins?.FileOpener
  if (FileOpener) {
    const mime = filename.endsWith('.xlsx')
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : filename.endsWith('.pdf')
        ? 'application/pdf'
        : undefined
    try {
      await FileOpener.openFile({ path: written.uri, contentType: mime })
      return
    } catch {
      // No app can open it, or the user backed out — fall through to Share.
    }
  }

  if (Share) {
    await Share.share({ title: filename, url: written.uri })
  }
}
