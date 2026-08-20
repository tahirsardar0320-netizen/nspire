/**
 * Client-side Excel (.xlsx) generation for the NSPIRE report.
 * Mirrors the format previously produced by the (now-removed) backend
 * /api/inspections/generate-excel route. No backend dependency.
 */
import { NSPIREInspectionReport } from './nspireReport'

const HEADER_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFD1D5DB' } }
const THIN_BORDER = { style: 'thin' as const, color: { argb: 'FF000000' } }
const ALL_BORDERS = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER }

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
  sheet.columns = COLUMNS

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US')

  const addLabelValueRow = (label: string, value: string) => {
    const row = sheet.addRow([label, value])
    row.getCell(1).font = { bold: true }
  }

  const titleRow = sheet.addRow(['NSPIRE INSPECTION REPORT'])
  sheet.mergeCells(titleRow.number, 1, titleRow.number, COLUMNS.length)
  titleRow.getCell(1).font = { bold: true, size: 16 }
  titleRow.getCell(1).alignment = { horizontal: 'center' }

  addLabelValueRow('Property Name:', report.metadata.propertyName || '-')
  addLabelValueRow('Property Address:', report.metadata.propertyAddress || '-')
  addLabelValueRow('Inspection Date:', report.metadata.startDate || dateStr)
  addLabelValueRow('Inspector:', report.metadata.inspectorName || 'Inspector')
  addLabelValueRow('Final Score:', String(report.metadata.finalScore ?? '-'))

  sheet.addRow([])

  const summaryHeaderRow = sheet.addRow(['SUMMARY BY SEVERITY'])
  summaryHeaderRow.getCell(1).font = { bold: true }
  addLabelValueRow('Life-Threatening', String(report.summary.lifeThreatening))
  addLabelValueRow('Severe', String(report.summary.severe))
  addLabelValueRow('Moderate', String(report.summary.moderate))
  addLabelValueRow('Low', String(report.summary.low))

  sheet.addRow([])

  const headerRow = sheet.addRow(COLUMNS.map(c => c.header))
  headerRow.eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = HEADER_FILL
    cell.border = ALL_BORDERS
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
  })

  report.deficiencies.forEach((def, index) => {
    const row = sheet.addRow({
      num: index + 1,
      image: def.imageUri ? { text: 'Photo', hyperlink: def.imageUri } : '',
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
  })

  sheet.addRow([])
  addLabelValueRow('DIGITAL SIGNATURE:', report.certification?.certifiedBy || report.metadata.inspectorName || 'Inspector')
  addLabelValueRow('DATE:', dateStr)

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export async function downloadNSPIREReportExcel(report: NSPIREInspectionReport, filename: string): Promise<void> {
  const blob = await generateNSPIREReportExcelBlob(report)
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
