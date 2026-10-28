/**
 * Client-side PDF generation for the NSPIRE report.
 * Renders the existing HUD-format HTML template (lib/nspirePDFService.ts) into a
 * hidden iframe, then rasterizes it into a real, downloadable PDF via jsPDF + html2canvas.
 * No backend dependency — works entirely in the browser.
 */
import { NSPIREInspectionReport } from './nspireReport'

async function renderReportIframe(report: NSPIREInspectionReport): Promise<HTMLIFrameElement> {
  const { generateNSPIREReportHTML } = await import('./nspirePDFService')
  const { DEFAULT_PDF_OPTIONS } = await import('./nspireReport')
  const html = generateNSPIREReportHTML(report, DEFAULT_PDF_OPTIONS)

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.left = '-10000px'
  iframe.style.top = '0'
  iframe.style.width = '800px'
  // A zero-height iframe gives html2canvas a zero-height viewport to clone into, so it
  // rasterized only the first screenful and the export came out truncated to ~2 pages.
  // The iframe is off-screen anyway, so it can be as tall as the report needs.
  iframe.style.height = '2000px'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  if (!doc) throw new Error('Unable to prepare report for PDF export.')
  doc.open()
  doc.write(html)
  doc.close()

  await new Promise<void>((resolve) => {
    const images = Array.from(doc.images)
    if (images.length === 0) {
      resolve()
      return
    }
    let settled = 0
    const done = () => {
      settled++
      if (settled >= images.length) resolve()
    }
    images.forEach((img) => {
      if (img.complete) done()
      else {
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
      }
    })
    setTimeout(resolve, 4000)
  })

  return iframe
}

export async function generateNSPIREReportPDFBlob(report: NSPIREInspectionReport): Promise<Blob> {
  // The true text PDF (crisp, small, selectable, breaks that can never cut a
  // row — the clean layout the client asked for). The rasterized path below
  // stays only as a fallback if vector generation ever throws.
  try {
    const { generateVectorReportPdfBlob } = await import('./exportReportPdfVector')
    return await generateVectorReportPdfBlob(report)
  } catch (e) {
    console.error('Vector PDF failed, falling back to rasterized export:', e)
  }
  return generateRasterReportPdfBlob(report)
}

async function generateRasterReportPdfBlob(report: NSPIREInspectionReport): Promise<Blob> {
  const iframe = await renderReportIframe(report)
  try {
    const [{ jsPDF }, html2canvasModule] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ])
    const html2canvas = html2canvasModule.default

    const doc = iframe.contentDocument!
    const fullHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight)
    // Grow the iframe to the whole report so the cloned viewport html2canvas renders
    // into is tall enough to hold every section.
    iframe.style.height = `${fullHeight}px`

    // Browsers cap canvas dimensions (~16k px); past that the canvas comes back blank,
    // which would silently drop the tail of a long report. Scale down to stay under it.
    const MAX_CANVAS_PX = 16000
    const scale = fullHeight * 1.5 > MAX_CANVAS_PX ? Math.max(1, MAX_CANVAS_PX / fullHeight) : 1.5

    // Photos used to be inline base64 and were therefore always ready the moment
    // the markup existed. They are hosted now, so they load over the network and
    // a capture taken too early would produce a report with blank photo cells.
    // Wait for every image to settle (a failed one must not block the export).
    await Promise.all(
      Array.from(doc.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const done = () => resolve()
              img.addEventListener('load', done, { once: true })
              img.addEventListener('error', done, { once: true })
              setTimeout(done, 15000)
            })
      )
    )

    const canvas = await html2canvas(doc.body, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      foreignObjectRendering: false,
      windowWidth: 800,
      windowHeight: fullHeight,
      width: 800,
      height: fullHeight,
    })

    const pdf = new jsPDF('p', 'pt', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Slice the full-page canvas into A4-height chunks and add each as its own PDF page.
    const scaledPageHeightPx = (canvas.width / pageWidth) * pageHeight

    // A cut at an arbitrary pixel row lands mid-heading or mid-table-row —
    // the tester's PDF had "Outside Deficiencies" sliced in half across a
    // page break. Look a little way back up from the ideal cut for a row of
    // near-uniform background and cut there instead, so breaks fall in the
    // whitespace between sections.
    // The client wants the deficiency detail to ALWAYS open on page 2 — a
    // mandatory break right where "Inspectable Areas Deficiencies" begins.
    // Deterministic, so iPhone and Android paginate identically.
    const pxScale = canvas.width / 800
    const startEl = doc.getElementById('inspectable-areas-start') as HTMLElement | null
    const forcedCuts: number[] = []
    if (startEl) {
      let y = 0
      let el: HTMLElement | null = startEl
      while (el) { y += el.offsetTop; el = el.offsetParent as HTMLElement | null }
      const cut = Math.floor((y - 8) * pxScale)
      if (cut > 0 && cut < canvas.height) forcedCuts.push(cut)
    }

    const ctx0 = canvas.getContext('2d', { willReadFrequently: true })!
    const isBlankRow = (y: number): boolean => {
      if (y <= 0 || y >= canvas.height) return false
      const row = ctx0.getImageData(0, y, canvas.width, 1).data
      // Sample every 8th pixel; anything meaningfully darker than the page
      // background means content crosses this row.
      for (let i = 0; i < row.length; i += 32) {
        if (row[i] < 235 || row[i + 1] < 235 || row[i + 2] < 235) return false
      }
      return true
    }
    const findCut = (ideal: number): number => {
      if (ideal >= canvas.height) return canvas.height
      const searchUp = Math.min(Math.floor(scaledPageHeightPx * 0.25), ideal - 1)
      for (let back = 0; back <= searchUp; back += 4) {
        if (isBlankRow(ideal - back)) return ideal - back
      }
      return ideal // No whitespace nearby — dense table; the plain cut stands.
    }

    let renderedHeight = 0
    let firstPage = true

    while (renderedHeight < canvas.height) {
      const ideal = Math.min(renderedHeight + scaledPageHeightPx, canvas.height)
      const forced = forcedCuts.find((f) => f > renderedHeight + 20 && f < ideal)
      const cutAt = ideal >= canvas.height && forced === undefined
        ? canvas.height
        : (forced ?? findCut(ideal))
      const sliceHeight = cutAt - renderedHeight

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sliceHeight
      const ctx = pageCanvas.getContext('2d')!
      ctx.drawImage(canvas, 0, renderedHeight, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

      if (!firstPage) pdf.addPage()
      firstPage = false

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.92)
      const imgHeightPt = (sliceHeight / canvas.width) * pageWidth
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeightPt)

      renderedHeight += sliceHeight
    }

    return pdf.output('blob')
  } finally {
    document.body.removeChild(iframe)
  }
}

export async function downloadNSPIREReportPDF(report: NSPIREInspectionReport, filename: string): Promise<void> {
  const { saveAndShareBlob } = await import('./nativeDownload')
  const blob = await generateNSPIREReportPDFBlob(report)
  await saveAndShareBlob(blob, filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1] || '')
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
