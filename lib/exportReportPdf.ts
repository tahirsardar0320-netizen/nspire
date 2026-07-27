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
  iframe.style.height = '0px'
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
  const iframe = await renderReportIframe(report)
  try {
    const [{ jsPDF }, html2canvasModule] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ])
    const html2canvas = html2canvasModule.default

    const doc = iframe.contentDocument!
    const canvas = await html2canvas(doc.body, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      foreignObjectRendering: false,
      windowWidth: 800,
      width: 800,
      height: doc.body.scrollHeight,
    })

    const pdf = new jsPDF('p', 'pt', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Slice the full-page canvas into A4-height chunks and add each as its own PDF page.
    const scaledPageHeightPx = (canvas.width / pageWidth) * pageHeight
    let renderedHeight = 0
    let firstPage = true

    while (renderedHeight < canvas.height) {
      const sliceHeight = Math.min(scaledPageHeightPx, canvas.height - renderedHeight)

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
  const blob = await generateNSPIREReportPDFBlob(report)
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
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
