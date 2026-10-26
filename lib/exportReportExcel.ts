/**
 * Client-side Excel (.xlsx) generation for the NSPIRE report.
 * Mirrors the format previously produced by the (now-removed) backend
 * /api/inspections/generate-excel route. No backend dependency.
 */
import { NSPIREInspectionReport, SEVERITY_COLORS } from './nspireReport'
import { fetchWithTimeout } from './httpFetch'

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const EMU_PER_PX = 9525
const EMU_PER_PT = 12700

/**
 * Fill in each picture's absolute position and size (a:xfrm) after ExcelJS
 * has written the workbook. ExcelJS leaves xfrm at 0,0/0x0 — real Excel
 * ignores it and uses the cell anchor, but Apple's previewers (iPhone Quick
 * Look, macOS Preview) and other lightweight viewers read ONLY the absolute
 * values, so every photo and the logo rendered as a zero-size nothing there
 * while the Excel apps showed them fine.
 */
async function patchDrawingAbsolutes(buffer: ArrayBuffer, sheet: import('exceljs').Worksheet): Promise<Blob> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)
    const entry = zip.file('xl/drawings/drawing1.xml')
    if (!entry) return new Blob([buffer], { type: XLSX_MIME })
    let xml = await entry.async('string')

    // Left edge of a column / top edge of a row, in EMU, from the sheet's
    // real metrics (width in characters ≈ width*7+5 px; height in points).
    const colLeftEmu = (col: number, off: number) => {
      let px = 0
      for (let i = 0; i < col; i++) {
        const w = sheet.getColumn(i + 1)?.width || 8.43
        px += Math.round(w * 7 + 5)
      }
      return px * EMU_PER_PX + off
    }
    const rowTopEmu = (row: number, off: number) => {
      let pt = 0
      for (let i = 0; i < row; i++) pt += sheet.getRow(i + 1)?.height || 15
      return Math.round(pt * EMU_PER_PT) + off
    }
    const nth = (block: string, tag: string, which: number) => {
      const matches = [...block.matchAll(new RegExp(`<xdr:${tag}>(-?\\d+)</xdr:${tag}>`, 'g'))]
      return matches[which] ? parseInt(matches[which][1], 10) : 0
    }

    xml = xml.replace(/<xdr:(oneCellAnchor|twoCellAnchor)[\s\S]*?<\/xdr:\1>/g, (block) => {
      const x = colLeftEmu(nth(block, 'col', 0), nth(block, 'colOff', 0))
      const y = rowTopEmu(nth(block, 'row', 0), nth(block, 'rowOff', 0))
      let cx = 0
      let cy = 0
      const ext = block.match(/<xdr:ext cx="(\d+)" cy="(\d+)"\/>/)
      if (ext) {
        cx = parseInt(ext[1], 10)
        cy = parseInt(ext[2], 10)
      } else {
        cx = colLeftEmu(nth(block, 'col', 1), nth(block, 'colOff', 1)) - x
        cy = rowTopEmu(nth(block, 'row', 1), nth(block, 'rowOff', 1)) - y
      }
      return block.replace(
        /<a:xfrm>[\s\S]*?<\/a:xfrm>/,
        `<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`
      )
    })

    zip.file('xl/drawings/drawing1.xml', xml)
    return await zip.generateAsync({ type: 'blob', mimeType: XLSX_MIME })
  } catch {
    // A failed patch must never cost the report itself — the unpatched file
    // is still perfect in every real Excel app.
    return new Blob([buffer], { type: XLSX_MIME })
  }
}

const HEADER_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFD1D5DB' } }
const THIN_BORDER = { style: 'thin' as const, color: { argb: 'FF000000' } }
const ALL_BORDERS = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER }

/**
 * The repair window NSPIRE allows for a deficiency of this severity — what the
 * client wants the H&S column to say: the deadline, not the severity repeated.
 */
const repairWindow = (severity?: string) => {
  const s = String(severity || '').toLowerCase()
  if (!s || s === '-') return ''
  if (s.includes('life') || s.includes('critical') || s.includes('severe') || s.includes('major') || s.includes('high')) return '24 hrs'
  if (s.includes('low') || s.includes('minor') || s.includes('observation')) return '60 Days'
  return '30 Days'
}

/** '#DC2626' → ExcelJS 'FFDC2626'. The same palette the PDF uses. */
const severityFill = (severity: string | undefined) => {
  const hex = SEVERITY_COLORS[(severity || '') as keyof typeof SEVERITY_COLORS]
  if (!hex) return null
  return { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: `FF${hex.slice(1)}` } }
}

/**
 * The photo itself, ready to drop into the sheet. Hosted URLs are fetched,
 * offline captures are already data URLs; either way Excel wants raw base64.
 * Null when the image cannot be had (offline and not cached) — the cell then
 * falls back to the old "Photo" hyperlink.
 */
async function imageBase64(uri: string): Promise<{ base64: string; extension: 'jpeg' | 'png' } | null> {
  try {
    if (uri.startsWith('data:')) {
      const m = uri.match(/^data:image\/(png|jpe?g);base64,(.+)$/i)
      if (!m) return null
      return { base64: m[2], extension: m[1].toLowerCase() === 'png' ? 'png' : 'jpeg' }
    }
    // With no connection there is nothing to fetch, and on iOS a doomed
    // request can hang rather than fail — each stalled photo held the export
    // on "Generating..." with no end. Skip straight to the hyperlink fallback
    // offline, and give the online path a hard stop per photo.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return null
    const res = await fetchWithTimeout(uri, {}, 10000)
    if (!res.ok) return null
    const blob = await res.blob()
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(String(r.result))
      r.onerror = reject
      r.readAsDataURL(blob)
    })
    const m = dataUrl.match(/^data:image\/(png|jpe?g);base64,(.+)$/i)
    if (!m) return null
    return { base64: m[2], extension: m[1].toLowerCase() === 'png' ? 'png' : 'jpeg' }
  } catch {
    return null
  }
}

const COLUMNS = [
  { header: '#', key: 'num', width: 5 },
  { header: 'Image', key: 'image', width: 14 },
  { header: 'Building', key: 'building', width: 10 },
  { header: 'Unit', key: 'unit', width: 10 },
  { header: 'Area/Item', key: 'areaItem', width: 16 },
  { header: 'Deficiency Details', key: 'details', width: 42 },
  { header: 'Severity', key: 'severity', width: 14 },
  { header: 'H&S', key: 'healthSafety', width: 14 },
  { header: 'Pts', key: 'pts', width: 8 },
  { header: 'Status', key: 'status', width: 10 },
  { header: 'Inspection Date', key: 'dateCompleted', width: 14 },
  { header: 'Completed By', key: 'initials', width: 10 },
  { header: 'Work Order', key: 'notes', width: 24 },
  { header: 'Standard', key: 'standard', width: 14 },
  { header: 'Completion Date', key: 'protocol', width: 16 },
]

export async function generateNSPIREReportExcelBlob(report: NSPIREInspectionReport): Promise<Blob> {
  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'NSPIRE Inspection System'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Inspection Report', {
    views: [{ state: 'frozen', ySplit: 0 }],
  })
  // Keys and widths only: handing ExcelJS the headers here makes it write
  // them into row 1 immediately, leaving a stray duplicate header above the
  // title in every export. The styled header row below is the real one.
  sheet.columns = COLUMNS.map(({ key, width }) => ({ key, width }))

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US')

  const addLabelValueRow = (label: string, value: string) => {
    const row = sheet.addRow([label, value])
    row.getCell(1).font = { bold: true }
  }

  // The NSPIRE logo, same as the PDF carries. It floats over the first rows'
  // left columns; the title is merged to its right so they share the band.
  const logo = await imageBase64('/logo.png?v=2')
  const titleRow = sheet.addRow(['', '', 'NSPIRE INSPECTION REPORT'])
  titleRow.height = 64
  sheet.mergeCells(titleRow.number, 3, titleRow.number, COLUMNS.length)
  const titleCell = titleRow.getCell(3)
  titleCell.font = { bold: true, size: 18, color: { argb: 'FF1E3A8A' } }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  if (logo) {
    const logoId = workbook.addImage({ base64: logo.base64, extension: logo.extension })
    // INTEGER tl+br spanning whole cells: with zero offsets every viewer lays
    // the picture over its own grid, so it lands inside the box everywhere —
    // Excel apps, iPhone preview, all of them. (Fractional anchors go through
    // ExcelJS's default column metrics and render as crushed slivers; ext
    // sizing is exact in Excel but absolute-only viewers then need xfrm
    // coordinates that can drift from their own grid math.)
    sheet.addImage(logoId, {
      tl: { col: 0, row: titleRow.number - 1 } as any,
      br: { col: 2, row: titleRow.number } as any,
      editAs: 'oneCell',
    })
  }

  addLabelValueRow('Property Name:', report.metadata.propertyName || '-')
  addLabelValueRow('Property Address:', report.metadata.propertyAddress || '-')
  addLabelValueRow('Inspection Date:', report.metadata.startDate || dateStr)
  addLabelValueRow('Inspector:', report.metadata.inspectorName || 'Inspector')
  addLabelValueRow('Final Score:', String(report.metadata.finalScore ?? '-'))

  sheet.addRow([])

  const summaryHeaderRow = sheet.addRow(['SUMMARY BY SEVERITY'])
  summaryHeaderRow.getCell(1).font = { bold: true, size: 12 }
  const addSeverityRow = (label: string, value: string) => {
    const row = sheet.addRow([label, value])
    const cell = row.getCell(1)
    const fill = severityFill(label)
    if (fill) {
      cell.fill = fill
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    } else {
      cell.font = { bold: true }
    }
    row.getCell(2).font = { bold: true }
  }
  addSeverityRow('Life-Threatening', String(report.summary.lifeThreatening))
  addSeverityRow('Severe', String(report.summary.severe))
  addSeverityRow('Moderate', String(report.summary.moderate))
  addSeverityRow('Low', String(report.summary.low))

  sheet.addRow([])

  const headerRow = sheet.addRow(COLUMNS.map(c => c.header))
  headerRow.eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = HEADER_FILL
    cell.border = ALL_BORDERS
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
  })

  // Fetch photos first, a couple at a time — a big report can carry dozens.
  const images: (null | { base64: string; extension: 'jpeg' | 'png' })[] =
    new Array(report.deficiencies.length).fill(null)
  {
    let cursor = 0
    const worker = async () => {
      while (cursor < report.deficiencies.length) {
        const i = cursor++
        const uri = report.deficiencies[i]?.imageUri
        if (uri) images[i] = await imageBase64(uri)
      }
    }
    await Promise.all(Array.from({ length: 3 }, worker))
  }

  report.deficiencies.forEach((def, index) => {
    const embedded = images[index]
    const row = sheet.addRow({
      num: index + 1,
      // The photo itself when we have it — but keep the hyperlink in the cell
      // regardless: iOS Quick Look and Google Sheets' importer don't render
      // embedded images, and the link is all those viewers get. Desktop Excel
      // draws the photo over the cell, so the link never shows there. Data
      // URLs are no use as links (and megabytes big), so only http(s) counts.
      image: def.imageUri && /^https?:/i.test(def.imageUri)
        ? { text: 'Photo', hyperlink: def.imageUri }
        : embedded ? '' : '',
      building: def.building || '-',
      unit: def.unit || '-',
      areaItem: `${def.area || ''} / ${def.room || ''}`.trim(),
      details: `${def.deficiencyName || ''}\n${def.deficiencyDetails || ''}`.trim(),
      severity: def.severity,
      // The correction deadline, not the severity twice over: 24 hrs for
      // Life-Threatening/Severe, 30 Days for Moderate, 60 Days for Low.
      healthSafety: repairWindow(def.healthAndSafety || def.severity),
      pts: Number(def.deductionPts ?? 0).toFixed(2),
      status: def.status || 'Open',
      dateCompleted: def.inspectedDate || dateStr,
      initials: '',
      notes: def.comments || '',
      standard: def.codeAndCompliance || def.nspireCode || '',
      protocol: '',
    })
    row.eachCell((cell) => {
      cell.border = ALL_BORDERS
      cell.alignment = { vertical: 'top', wrapText: true }
    })

    // Severity reads at a glance, same palette as the PDF.
    const fill = severityFill(def.severity)
    if (fill) {
      const cell = row.getCell('severity')
      cell.fill = fill
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true }
    }
    const hsFill = severityFill(def.healthAndSafety || def.severity)
    if (hsFill) {
      const cell = row.getCell('healthSafety')
      cell.fill = hsFill
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true }
    }

    if (embedded) {
      const imageId = workbook.addImage({ base64: embedded.base64, extension: embedded.extension })
      row.height = 70
      // tl is zero-based: the image fills column B's cell on this row exactly,
      // corner to corner — see the logo above for why only integer anchors.
      sheet.addImage(imageId, {
        tl: { col: 1, row: row.number - 1 } as any,
        br: { col: 2, row: row.number } as any,
        editAs: 'oneCell',
      })
    }
  })

  sheet.addRow([])
  addLabelValueRow('DIGITAL SIGNATURE:', report.certification?.certifiedBy || report.metadata.inspectorName || 'Inspector')
  addLabelValueRow('DATE:', dateStr)

  const buffer = await workbook.xlsx.writeBuffer()
  return patchDrawingAbsolutes(buffer as ArrayBuffer, sheet)
}

export async function downloadNSPIREReportExcel(report: NSPIREInspectionReport, filename: string): Promise<void> {
  const { saveAndShareBlob } = await import('./nativeDownload')
  const blob = await generateNSPIREReportExcelBlob(report)
  await saveAndShareBlob(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}
