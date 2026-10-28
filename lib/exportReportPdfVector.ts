/**
 * True text PDF for the NSPIRE report — the clean layout the client pointed
 * at (nspireinspection.ai's output): crisp selectable text, plain bordered
 * tables, underlined section headings, photos inside their cells, automatic
 * page breaks that can never slice a row or heading. Replaces the rasterized
 * screenshot-PDF whose pages were fuzzy, heavy, and cut wherever the pixel
 * math landed. This module is loaded lazily, so its static imports stay out
 * of every page bundle.
 */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { NSPIREInspectionReport, DeficiencyEntry } from './nspireReport'
import { NSPIRE_LOGO_DATA_URI } from './reportAssets'
import { fetchWithTimeout } from './httpFetch'

const PAGE_W = 595.28
const MARGIN = 46
const CONTENT_W = PAGE_W - MARGIN * 2

type Img = { dataUrl: string; w: number; h: number }

/** Photo as a JPEG data URL with its natural size — null when unavailable. */
async function loadImage(uri: string | undefined): Promise<Img | null> {
  if (!uri) return null
  try {
    let dataUrl = uri
    if (!uri.startsWith('data:')) {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return null
      const res = await fetchWithTimeout(uri, {}, 10000)
      if (!res.ok) return null
      const blob = await res.blob()
      dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(String(r.result))
        r.onerror = reject
        r.readAsDataURL(blob)
      })
    }
    const dim = await new Promise<{ w: number; h: number } | null>((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = () => resolve(null)
      img.src = dataUrl
    })
    if (!dim) return null
    return { dataUrl, w: dim.w, h: dim.h }
  } catch {
    return null
  }
}

const sectionHeading = (doc: jsPDF, text: string, y: number): number => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0)
  doc.text(text, MARGIN, y)
  const w = doc.getTextWidth(text)
  doc.setDrawColor(0)
  doc.setLineWidth(0.8)
  doc.line(MARGIN, y + 2.5, MARGIN + w, y + 2.5)
  return y + 16
}

export async function generateVectorReportPdfBlob(report: NSPIREInspectionReport): Promise<Blob> {
  const doc = new jsPDF('p', 'pt', 'a4')
  const meta = report.metadata
  const deficiencies = report.deficiencies || []

  // Every photo resolved up front, two at a time (phone-friendly).
  const images = new Map<string, Img>()
  {
    const uris = Array.from(new Set(deficiencies.map(d => d.imageUri).filter(Boolean))) as string[]
    let cursor = 0
    const worker = async () => {
      while (cursor < uris.length) {
        const uri = uris[cursor++]
        const img = await loadImage(uri)
        if (img) images.set(uri, img)
      }
    }
    await Promise.all(Array.from({ length: Math.min(2, uris.length) }, worker))
  }

  // ── Page 1: header, scores, inspection data ─────────────────────────────
  let y = 36
  const logo = await loadImage(NSPIRE_LOGO_DATA_URI)
  if (logo) {
    const w = 150
    const h = (logo.h / logo.w) * w
    doc.addImage(logo.dataUrl, 'PNG', (PAGE_W - w) / 2, y, w, h)
    y += h + 18
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  const title = doc.splitTextToSize('NSPIRE - NATIONAL STANDARDS FOR THE PHYSICAL INSPECTION OF REAL ESTATE', CONTENT_W)
  doc.text(title, PAGE_W / 2, y, { align: 'center' })
  y += title.length * 17 + 10

  doc.setFontSize(8.5)
  const metaLeft: Array<[string, string]> = [
    ['Inspection No:', meta.inspectionNo || '-'],
    ['Inspection Type:', String(meta.inspectionType || '-')],
    ['Escort Name:', meta.escortName || '-'],
    ['Property Type:', 'Multifamily'],
  ]
  const metaRight: Array<[string, string]> = [
    ['Inspection Start Date:', meta.startDate || '-'],
    ['Inspection End Date:', meta.endDate || '-'],
    ['Report Created Date:', meta.reportCreatedDate || '-'],
  ]
  const colX = [MARGIN, PAGE_W / 2 + 10]
  const metaTop = y
  ;[metaLeft, metaRight].forEach((rows, c) => {
    let yy = metaTop
    rows.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(label, colX[c], yy)
      doc.setFont('helvetica', 'normal')
      doc.text(String(value), colX[c] + 92, yy)
      yy += 13
    })
  })
  y = metaTop + Math.max(metaLeft.length, metaRight.length) * 13 + 14

  // Score boxes, side by side, like the reference.
  const boxW = (CONTENT_W - 14) / 2
  const boxH = 74
  const scores = (x: number, heading: string, rows: Array<[string, string]>) => {
    doc.setDrawColor(60)
    doc.setLineWidth(0.9)
    doc.rect(x, y, boxW, boxH)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text(heading, x + 10, y + 15)
    doc.setLineWidth(0.6)
    doc.line(x + 10, y + 17.5, x + 10 + doc.getTextWidth(heading), y + 17.5)
    doc.setFontSize(8.5)
    let yy = y + 30
    rows.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal')
      doc.text(label, x + 10, yy)
      doc.setFont('helvetica', 'bold')
      doc.text(String(value), x + boxW - 10, yy, { align: 'right' })
      yy += 12.5
    })
  }
  const fx = (n: unknown) => Number(n ?? 0).toFixed(2)
  scores(MARGIN, 'Preliminary Scores', [
    ['Preliminary Inspection Score:', fx(meta.preliminaryScore)],
    ['Calculated Score:', fx(meta.calculatedScore)],
    ['Health & Safety Threshold:', fx(meta.healthSafetyThreshold)],
    ['Property Threshold:', fx(meta.physicalConditionThreshold)],
  ])
  scores(MARGIN + boxW + 14, 'Final Scores', [
    ['Final Inspection Score:', fx(meta.finalScore)],
    ['Calculated Score:', fx(meta.calculatedScore)],
    ['Health & Safety Threshold:', fx(meta.healthSafetyThreshold)],
    ['Property Threshold:', fx(meta.physicalConditionThreshold)],
  ])
  y += boxH + 24

  y = sectionHeading(doc, 'Building/Unit Inspection Data', y)
  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Type', 'Property Total', 'Sample Size', 'Total Units Inspected']],
    body: (report.inspectionData || []).map(r => [r.type, String(r.propertyTotal), String(r.sampleSize), String(r.totalUnitsInspected)]),
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8.5, textColor: 0, lineColor: 60, lineWidth: 0.6, cellPadding: 5, halign: 'center' },
    headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold' },
    columnStyles: { 0: { halign: 'left' } },
  })

  // ── Page 2 onward: deficiency detail, always on its own page ────────────
  doc.addPage()
  y = 46
  y = sectionHeading(doc, 'Deficiency Summary', y)

  const areaOf = (d: DeficiencyEntry) => String(d.area || '').toLowerCase()
  const counts = (pred: (d: DeficiencyEntry) => boolean, severity: string) =>
    deficiencies.filter(d => pred(d) && d.severity === severity).length
  const summaryRow = (label: string, pred: (d: DeficiencyEntry) => boolean) => [
    label,
    String(counts(pred, 'Life-Threatening')),
    String(counts(pred, 'Severe')),
    String(counts(pred, 'Moderate')),
    String(counts(pred, 'Low')),
  ]
  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Inspectable Area', 'Life-Threatening', 'Severe', 'Moderate', 'Low']],
    body: [
      summaryRow('Inside', d => areaOf(d).includes('inside')),
      summaryRow('Outside', d => areaOf(d).includes('outside')),
      summaryRow('Units', d => areaOf(d).includes('unit')),
    ],
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8.5, textColor: 0, lineColor: 60, lineWidth: 0.6, cellPadding: 5, halign: 'center' },
    headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold' },
    columnStyles: { 0: { halign: 'left' } },
  })
  y = (doc as any).lastAutoTable.finalY + 24

  // One deficiency table, reference-style columns.
  const PHOTO_W = 78
  const PHOTO_PAD = 4
  const deficiencyTable = (items: DeficiencyEntry[], startY: number): number => {
    if (items.length === 0) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8.5)
      doc.setTextColor(100)
      doc.text('No deficiencies found.', MARGIN, startY + 4)
      doc.setTextColor(0)
      return startY + 20
    }
    autoTable(doc, {
      startY,
      margin: { left: MARGIN, right: MARGIN },
      head: [['Deficiency Details', 'Deficiency Name/Location', 'Note', 'Deficiency Picture', 'Pts', 'Repeat', 'Severity']],
      body: items.map(d => [
        d.deficiencyDetails || d.deficiencyName || '-',
        `${d.deficiencyName || '-'}\n${d.nspireCode || ''}\n${d.building || '-'} | ${d.unit || d.room || '-'}`,
        d.comments || 'Wait for Input',
        '', // photo drawn in the cell hook
        Number(d.deductionPts ?? 0).toFixed(2),
        d.repeatIndicator ? 'true' : 'false',
        d.severity || '-',
      ]),
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 7.5, textColor: 0, lineColor: 60, lineWidth: 0.6, cellPadding: 4, valign: 'top', overflow: 'linebreak' },
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 92 },
        1: { cellWidth: 96 },
        2: { cellWidth: 84 },
        3: { cellWidth: PHOTO_W + PHOTO_PAD * 2 },
        4: { cellWidth: 32, halign: 'center' },
        5: { cellWidth: 40, halign: 'center' },
        6: { cellWidth: 52, halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 3) {
          const img = images.get(items[data.row.index]?.imageUri || '')
          if (img) {
            const h = (img.h / img.w) * PHOTO_W
            data.cell.styles.minCellHeight = Math.min(Math.max(h, 44), 96) + PHOTO_PAD * 2
          }
        }
        if (data.section === 'body' && data.column.index === 1) {
          data.cell.styles.fontStyle = 'bold'
        }
      },
      didDrawCell: (data) => {
        if (data.section !== 'body' || data.column.index !== 3) return
        const img = images.get(items[data.row.index]?.imageUri || '')
        if (!img) return
        const maxH = data.cell.height - PHOTO_PAD * 2
        let w = PHOTO_W
        let h = (img.h / img.w) * w
        if (h > maxH) { h = maxH; w = (img.w / img.h) * h }
        try {
          doc.addImage(img.dataUrl, 'JPEG', data.cell.x + (data.cell.width - w) / 2, data.cell.y + PHOTO_PAD, w, h)
        } catch { /* a bad image must not kill the report */ }
      },
    })
    return (doc as any).lastAutoTable.finalY + 20
  }

  const ensureRoom = (needed: number) => {
    if (y + needed > 800) { doc.addPage(); y = 46 }
  }

  const buildings = Array.from(new Set(deficiencies.map(d => d.building || 'Unassigned')))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  for (const building of buildings.length > 0 ? buildings : []) {
    const inBuilding = deficiencies.filter(d => (d.building || 'Unassigned') === building)
    ensureRoom(60)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setFillColor(230, 240, 245)
    doc.setDrawColor(0, 103, 149)
    doc.rect(MARGIN, y - 10, CONTENT_W, 18, 'FD')
    doc.setTextColor(0, 103, 149)
    doc.text(`Building: ${building}`, MARGIN + 6, y + 2.5)
    doc.setTextColor(0)
    y += 22

    for (const [label, pred] of [
      ['Outside Deficiencies', (d: DeficiencyEntry) => areaOf(d).includes('outside')],
      ['Inside Deficiencies', (d: DeficiencyEntry) => areaOf(d).includes('inside')],
    ] as Array<[string, (d: DeficiencyEntry) => boolean]>) {
      ensureRoom(70)
      y = sectionHeading(doc, label, y)
      y = deficiencyTable(inBuilding.filter(pred), y)
    }

    const unitItems = inBuilding.filter(d => areaOf(d).includes('unit'))
    ensureRoom(70)
    y = sectionHeading(doc, 'Unit Deficiencies', y)
    if (unitItems.length === 0) {
      y = deficiencyTable([], y)
    } else {
      const byUnit = new Map<string, DeficiencyEntry[]>()
      unitItems.forEach(d => {
        const unit = String(d.unit || '').trim() || 'Unassigned'
        if (!byUnit.has(unit)) byUnit.set(unit, [])
        byUnit.get(unit)!.push(d)
      })
      for (const unit of Array.from(byUnit.keys()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
        ensureRoom(70)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text(unit.toUpperCase().startsWith('UNIT') ? unit : `Unit ${unit}`, MARGIN, y)
        y += 12
        y = deficiencyTable(byUnit.get(unit)!, y)
      }
    }
  }

  if (report.generalComments) {
    ensureRoom(60)
    y = sectionHeading(doc, 'General Comments', y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    const lines = doc.splitTextToSize(String(report.generalComments), CONTENT_W)
    doc.text(lines, MARGIN, y)
    y += lines.length * 11 + 14
  }

  // ── Certification & footer ───────────────────────────────────────────────
  ensureRoom(120)
  y = sectionHeading(doc, 'Inspector Certification', y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  const cert = doc.splitTextToSize(
    report.certification?.certificationStatement ||
    'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.',
    CONTENT_W,
  )
  doc.text(cert, MARGIN, y)
  y += cert.length * 11 + 22

  doc.setFont('helvetica', 'bold')
  doc.text(report.certification?.certifiedBy || meta.inspectorName || 'Inspector', MARGIN, y)
  doc.text(meta.reportCreatedDate || '', MARGIN + 220, y)
  y += 11
  doc.setLineWidth(0.6)
  doc.setDrawColor(120)
  doc.line(MARGIN, y, MARGIN + 160, y)
  doc.line(MARGIN + 220, y, MARGIN + 320, y)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100)
  doc.text('Inspector Name', MARGIN, y)
  doc.text('Date', MARGIN + 220, y)
  y += 20
  doc.text('Generated by NSPIRE Inspection System', MARGIN, y)
  y += 10
  doc.text('This document is confidential and intended for authorized use only.', MARGIN, y)
  doc.setTextColor(0)

  return doc.output('blob')
}
