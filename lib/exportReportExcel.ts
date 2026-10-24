/**
 * Client-side Excel (.xlsx) generation for the NSPIRE report.
 * Mirrors the format previously produced by the (now-removed) backend
 * /api/inspections/generate-excel route. No backend dependency.
 */
import { NSPIREInspectionReport, SEVERITY_COLORS } from './nspireReport'

const HEADER_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFD1D5DB' } }
const THIN_BORDER = { style: 'thin' as const, color: { argb: 'FF000000' } }
const ALL_BORDERS = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER }

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
    const res = await fetch(uri)
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
  { header: 'Date Completed', key: 'dateCompleted', width: 14 },
  { header: 'Completed By', key: 'initials', width: 10 },
  { header: 'Notes', key: 'notes', width: 24 },
  { header: 'Standard', key: 'standard', width: 14 },
  { header: 'Inspection Protocol', key: 'protocol', width: 16 },
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
    sheet.addImage(logoId, {
      tl: { col: 0, row: titleRow.number - 1 },
      ext: { width: 180, height: 82 },
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
      // The photo itself when we have it; the old hyperlink when we don't
      // (offline with nothing cached is better served by a link than a blank).
      image: embedded ? '' : def.imageUri ? { text: 'Photo', hyperlink: def.imageUri } : '',
      building: def.building || '-',
      unit: def.unit || '-',
      areaItem: `${def.area || ''} / ${def.room || ''}`.trim(),
      details: `${def.deficiencyName || ''}\n${def.deficiencyDetails || ''}`.trim(),
      severity: def.severity,
      healthSafety: def.healthAndSafety,
      pts: def.deductionPts,
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
    const hsFill = severityFill(def.healthAndSafety)
    if (hsFill) {
      const cell = row.getCell('healthSafety')
      cell.fill = hsFill
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true }
    }

    if (embedded) {
      const imageId = workbook.addImage({ base64: embedded.base64, extension: embedded.extension })
      row.height = 70
      // tl is zero-based: column B of this row.
      sheet.addImage(imageId, {
        tl: { col: 1, row: row.number - 1 },
        ext: { width: 92, height: 92 },
        editAs: 'oneCell',
      })
    }
  })

  sheet.addRow([])
  addLabelValueRow('DIGITAL SIGNATURE:', report.certification?.certifiedBy || report.metadata.inspectorName || 'Inspector')
  addLabelValueRow('DATE:', dateStr)

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export async function downloadNSPIREReportExcel(report: NSPIREInspectionReport, filename: string): Promise<void> {
  const { saveAndShareBlob } = await import('./nativeDownload')
  const blob = await generateNSPIREReportExcelBlob(report)
  await saveAndShareBlob(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}
