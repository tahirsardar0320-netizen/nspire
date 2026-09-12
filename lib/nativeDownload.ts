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

  if (Share) {
    await Share.share({ title: filename, url: written.uri })
  }
}
