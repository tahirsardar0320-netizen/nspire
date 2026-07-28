/**
 * NSPIRE PDF Report Service for Web
 * Generates HUD-compliant NSPIRE inspection reports
 * Ported from mobile nspirePDFService.ts for web/mobile parity
 */

import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySummary,
  InspectionMetadata,
  InspectionDataRow,
  OccupancyInfo,
  CategoryBreakdown,
  PDFGenerationOptions,
  SEVERITY_COLORS,
  DEFAULT_PDF_OPTIONS,
  DeficiencySeverity,
  REPAIR_TIMELINES,
} from './nspireReport';
import { NSPIRE_LOGO_DATA_URI } from './reportAssets';

/** Build a clickable data URI link showing the short NSPIRE code; clicking opens a clean HTML page with the full codeReference text */
function makeCodeRefLink(nspireCode: string, codeReference?: string): string {
  const shortCode = (nspireCode || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (!codeReference) return shortCode;
  const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/code-ref?code=${encodeURIComponent(nspireCode)}&ref=${encodeURIComponent(codeReference)}`;
  return `<a href="${url}" style="color:#0E7490;font-weight:600;text-decoration:underline;">${shortCode}</a>`;
}

/**
 * Generate CSS Styles for PDF (identical to mobile for pixel-perfect output)
 */
function generateStyles(options: PDFGenerationOptions): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1F2937;
      padding: 20px;
      background: #FFFFFF;
    }

    /* Keep table rows and section headers intact when paginating (print or PDF export) */
    tr, .avoid-break, .section-header {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    thead {
      display: table-header-group;
    }

    .report-container {
      max-width: 100%;
      margin: 0 auto;
    }
    
    /* Header Styles */
    .report-header {
      border-bottom: 3px solid #0E7490;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .header-title {
      font-size: 18pt;
      font-weight: bold;
      color: #0E7490;
      text-align: center;
      margin-bottom: 5px;
    }
    
    .header-subtitle {
      font-size: 12pt;
      color: #6B7280;
      text-align: center;
      margin-bottom: 15px;
    }
    
    .header-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .header-section {
      background: #F9FAFB;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #E5E7EB;
      min-width: 0;
    }
    
    .header-section h3 {
      font-size: 9pt;
      font-weight: bold;
      color: #374151;
      margin-bottom: 6px;
      border-bottom: 1px solid #D1D5DB;
      padding-bottom: 4px;
    }
    
    .header-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
      font-size: 8pt;
      gap: 8px;
    }
    
    .header-label {
      color: #6B7280;
      font-weight: 500;
      flex-shrink: 0;
    }
    
    .header-value {
      color: #1F2937;
      font-weight: 600;
      text-align: right;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    
    /* Scores Section */
    .scores-container {
      display: flex;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, #0E7490 0%, #0891B2 100%);
      padding: 12px 16px;
      border-radius: 6px;
      margin: 16px 0;
    }
    
    .score-box {
      text-align: center;
      color: #FFFFFF;
      padding: 6px 16px;
      min-width: 80px;
    }
    
    .score-box:not(:last-child) {
      border-right: 1px solid rgba(255,255,255,0.3);
    }
    
    .score-label {
      font-size: 7pt;
      opacity: 0.9;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .score-value {
      font-size: 18pt;
      font-weight: bold;
      line-height: 1.1;
    }
    
    .score-threshold {
      font-size: 7pt;
      opacity: 0.8;
      margin-top: 2px;
    }
    
    /* HUD NSPIRE Specific Styles */
    .header-logos {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: none;
    }

    .nspire-logo {
      width: 240px;
      height: auto;
      max-width: 100%;
      object-fit: contain;
      display: block;
    }
    
    .report-meta-header {
      text-align: center;
      font-size: 9pt;
      margin-bottom: 20px;
      font-weight: bold;
    }
    
    .inspection-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 8pt;
      margin-bottom: 20px;
    }
    
    .meta-row {
      margin-bottom: 4px;
    }
    
    .meta-label {
      font-weight: bold;
      color: #000;
    }
    
    /* Red Box Summary Section */
    .summary-box-container {
      border: 2px solid #DC2626; /* Red border as requested */
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .scores-wrapper {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 0 40px;
    }
    
    .score-column {
      text-align: right;
    }
    
    .score-column.left {
      text-align: right;
      padding-right: 20px;
    }
    
    .score-row {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      font-size: 9pt;
      margin-bottom: 2px;
    }
    
    .score-row.bold {
      font-weight: bold;
    }
    
    /* Data Tables in Summary */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 8pt;
    }
    
    .summary-table th {
      background-color: #D1D5DB;
      color: #000;
      font-weight: bold;
      padding: 4px;
      border: 1px solid #9CA3AF;
      text-align: center;
    }
    
    .summary-table td {
      border: 1px solid #9CA3AF;
      padding: 4px;
      text-align: center;
    }
    
    .summary-table td.left-align {
      text-align: left;
    }
    
    .section-header {
      font-weight: bold;
      font-size: 10pt;
      margin-bottom: 5px;
      text-decoration: underline;
    }

    /* Deficiency Table Specifics */
    .deficiency-details-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    
    .deficiency-details-table th {
      background-color: #FFFF00; /* Yellow header */
      color: #000;
      border: 1px solid #000;
      padding: 5px;
      vertical-align: top;
    }
    
    .deficiency-details-table td {
      border: 1px solid #000;
      padding: 5px;
      vertical-align: top;
    }
    
    .deficiency-pic {
      width: 100px;
      height: 80px;
      object-fit: cover;
      display: block;
    }
  `;
}

/**
 * Generate Report Header HTML
 */
/**
 * Generate Report Header HTML
 */
function generateHeader(metadata: InspectionMetadata, options: PDFGenerationOptions): string {
  return `
    <div class="report-meta-header">Report Created: ${new Date().toLocaleDateString()}</div>
    
    <div class="header-logos">
       <img src="${NSPIRE_LOGO_DATA_URI}" class="nspire-logo" alt="NSPIRE - U.S. Department of Housing and Urban Development" />
    </div>

    <div class="inspection-meta-grid">
      <div>
        <div class="meta-row"><span class="meta-label">Inspection No:</span> ${metadata.inspectionNo}</div>
        <div class="meta-row"><span class="meta-label">Inspection Type:</span> ${metadata.inspectionType}</div>
      </div>
      <div>
        <div class="meta-row"><span class="meta-label">Property:</span> ${metadata.propertyName} - ${metadata.propertyAddress}</div>
        <div class="meta-row"><span class="meta-label">Inspector:</span> ${metadata.inspectorName}</div>
        <div class="meta-row"><span class="meta-label">Inspection Date:</span> ${metadata.startDate}</div>
      </div>
    </div>
  `;
}

/**
 * Generate Summary Page HTML (Red Box Layout)
 */
function generateSummaryPage(
  summary: DeficiencySummary,
  categoryBreakdown: CategoryBreakdown[],
  metadata: InspectionMetadata,
  inspectionData: InspectionDataRow[],
  occupancyInfo: OccupancyInfo,
  deficiencies: DeficiencyEntry[] = []
): string {

  return `
    <div class="summary-section">
      <div class="summary-box-container">
        <!-- Scores -->
        <div class="scores-wrapper">
          <div class="score-column left">
             <div class="section-header">Preliminary Scores</div>
             <div class="score-row"><span class="score-label">Preliminary Inspection Score:</span> <span class="score-val">${metadata.preliminaryScore}</span></div>
             <div class="score-row"><span class="score-label">Preliminary Calculated Score:</span> <span class="score-val">${metadata.calculatedScore}</span></div>
             <div class="score-row"><span class="score-label">Preliminary Units Threshold:</span> <span class="score-val">10.79</span></div>
             <div class="score-row"><span class="score-label">Preliminary Property Threshold:</span> <span class="score-val">${metadata.physicalConditionThreshold}</span></div>
             <div class="score-row"><span class="score-label">Preliminary Projected Inspection Score:</span> <span class="score-val">${metadata.preliminaryScore}</span></div>
             <div class="score-row"><span class="score-label">Preliminary Non-Scored Symbolic:</span> <span class="score-val">**</span></div>
          </div>
          <div class="score-column">
             <div class="section-header">Final Scores</div>
             <div class="score-row bold"><span class="score-label">Final Inspection Score:</span> <span class="score-val">${metadata.finalScore}</span></div>
             <div class="score-row"><span class="score-label">Final Calculated Score:</span> <span class="score-val">${metadata.calculatedScore}</span></div>
             <div class="score-row"><span class="score-label">Final Units Threshold:</span> <span class="score-val">10.79</span></div>
             <div class="score-row"><span class="score-label">Final Property Threshold:</span> <span class="score-val">${metadata.physicalConditionThreshold}</span></div>
             <div class="score-row"><span class="score-label">Final Projected Inspection Score:</span> <span class="score-val">${metadata.finalScore}</span></div>
             <div class="score-row"><span class="score-label">Final Non-Scored Symbolic:</span> <span class="score-val">**</span></div>
             <div class="score-row bold"><span class="score-label">Final Review:</span> <span class="score-val">${metadata.finalScore >= 60 ? 'Accept' : 'Review'}</span></div>
          </div>
        </div>

        <!-- Building/Unit Inspection Data -->
        <div class="section-header">Building/Unit Inspection Data</div>
        <table class="summary-table">
          <thead>
            <tr>
              <th rowspan="2" class="left-align">Type</th>
              <th rowspan="2">Property Total</th>
              <th rowspan="2">Sample Size</th>
              <th colspan="2">Inspection</th>
            </tr>
            <tr>
              <th>Total Units Inspected</th>
            </tr>
          </thead>
          <tbody>
             ${inspectionData.map(row => `
            <tr>
              <td class="left-align">${row.type}</td>
              <td>${row.propertyTotal}</td>
              <td>${row.sampleSize}</td>
              <td>${row.totalUnitsInspected}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Occupancy Information -->
        <div class="section-header">Occupancy Information</div>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Occupancy Rate(%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${occupancyInfo.occupancyRate.toFixed(0)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Deficiency Summary -->
        <div class="section-header">Deficiency Summary</div>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Inspectable Area</th>
              <th>Life-Threatening</th>
              <th>Severe</th>
              <th>Moderate</th>
              <th>Low</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="left-align">Inside</td>
              <td>${deficiencies.filter(d => d.area === 'Inside').filter(d => d.severity === 'Life-Threatening').length}</td>
              <td>${deficiencies.filter(d => d.area === 'Inside').filter(d => d.severity === 'Severe').length}</td>
              <td>${deficiencies.filter(d => d.area === 'Inside').filter(d => d.severity === 'Moderate').length}</td>
              <td>${deficiencies.filter(d => d.area === 'Inside').filter(d => d.severity === 'Low').length}</td>
            </tr>
            <tr>
              <td class="left-align">Outside</td>
              <td>${deficiencies.filter(d => d.area === 'Outside').filter(d => d.severity === 'Life-Threatening').length}</td>
              <td>${deficiencies.filter(d => d.area === 'Outside').filter(d => d.severity === 'Severe').length}</td>
              <td>${deficiencies.filter(d => d.area === 'Outside').filter(d => d.severity === 'Moderate').length}</td>
              <td>${deficiencies.filter(d => d.area === 'Outside').filter(d => d.severity === 'Low').length}</td>
            </tr>
             <tr>
              <td class="left-align">Units</td>
              <td>${deficiencies.filter(d => d.area !== 'Inside' && d.area !== 'Outside').filter(d => d.severity === 'Life-Threatening').length}</td>
              <td>${deficiencies.filter(d => d.area !== 'Inside' && d.area !== 'Outside').filter(d => d.severity === 'Severe').length}</td>
              <td>${deficiencies.filter(d => d.area !== 'Inside' && d.area !== 'Outside').filter(d => d.severity === 'Moderate').length}</td>
              <td>${deficiencies.filter(d => d.area !== 'Inside' && d.area !== 'Outside').filter(d => d.severity === 'Low').length}</td>
            </tr>
          </tbody>
        </table>

         <!-- Scoring Summary -->
        <div class="section-header">Scoring Summary</div>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Inspectable Area</th>
              <th>Life-Threatening</th>
              <th>Severe</th>
              <th>Moderate</th>
              <th>Low</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="left-align">Inside</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="left-align">Outside</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
             <tr>
              <td class="left-align">Units</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
             <tr>
              <td class="left-align">Total</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
           <tfoot>
            <tr>
                <td colspan="3" style="border:none;"></td>
                <td style="border:1px solid #9CA3AF; background:#F3F4F6;">Overall</td>
                <td style="border:1px solid #9CA3AF;">${metadata.finalScore}</td>
            </tr>
           </tfoot>
        </table>

      </div>
    </div>
  `;
}

/**
 * Get severity badge HTML
 */
function getSeverityBadge(severity: DeficiencySeverity): string {
  const severityClass = severity.toLowerCase().replace('-', '-');
  return `<span class="severity-badge severity-${severityClass}">${severity}</span>`;
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status: string): string {
  const statusClass = status.toLowerCase().replace(' ', '-');
  return `<span class="status-badge status-${statusClass}">${status}</span>`;
}

/**
 * Generate Deficiency Table HTML (HUD NSPIRE Format)
 */
const DEFICIENCY_AREA_SECTIONS: { label: string; subtitle: string; match: (area: string) => boolean }[] = [
  { label: 'Outside', subtitle: 'Areas affected by Rain, Snow, Wind', match: (a) => a.includes('outside') || a.includes('site') || a.includes('exterior') },
  { label: 'Inside', subtitle: 'Interior Common area, Utility closet, Mechanical rooms', match: (a) => a.includes('inside') },
  { label: 'Units', subtitle: 'Individual unit inspections', match: (a) => a.includes('unit') },
];

function generateDeficiencyRow(def: DeficiencyEntry): string {
  const isGC = !!(def as any).isGeneralComment;
  return `
    <tr class="avoid-break">
      <td>
        <div>${isGC ? '-' : (def.deficiencyDetails || 'No details provided')}</div>
      </td>
      <td>
        <div style="font-weight:bold;">${isGC ? '-' : (def.deficiencyName || '-')}</div>
        ${isGC ? '' : `<div style="font-style:italic; color:#6B7280; font-size:8pt;">${def.nspireCode || ''}</div>`}
        <div style="font-size:8pt; color:#6B7280;">${def.building || '-'} | ${def.unit || def.room || '-'}</div>
      </td>
      <td style="vertical-align:top;padding:4px 6px;">${isGC ? '-' : (def.comments || 'Wait for Input')}</td>
       <td>
         ${def.imageUri ?
      `<img src="${def.imageUri}" class="deficiency-pic" alt="Proof" />` :
      `<div style="text-align:center; color:#ccc;">No Image</div>`
    }
      </td>
       <td style="text-align:center;">
        ${isGC ? '-' : def.deductionPts}
      </td>
       <td style="text-align:center;">
        ${isGC ? '-' : (def.repeatIndicator ? 'Repeat' : 'Not Repeat')}
      </td>
      <td style="text-align:center;">
         ${isGC ? '-' : def.severity}
      </td>
    </tr>
  `;
}

function generateDeficiencyAreaTable(label: string, subtitle: string, items: DeficiencyEntry[]): string {
  const headingLabel = label === 'Units' ? 'Unit' : label;
  return `
    <p style="font-weight:bold; text-decoration:underline; font-size:10pt; margin-top:14px; margin-bottom:4px;">${headingLabel} Deficiencies</p>
    ${items.length === 0 ? `
      <div style="padding:8px; border:1px solid #000; border-top:none; font-style:italic; color:#666; font-size:9pt;">No deficiencies found.</div>
    ` : `
      <table class="deficiency-details-table">
        <thead>
          <tr style="background-color: #D1D5DB;">
            <th style="width: 18%; background-color:#D1D5DB;">Deficiency Details</th>
            <th style="width: 18%; background-color:#D1D5DB;">Deficiency Name/Location</th>
            <th style="width: 14%; background-color:#D1D5DB;">Comments</th>
            <th style="width: 16%; background-color:#D1D5DB;">Deficiency Picture</th>
            <th style="width: 10%; background-color:#D1D5DB;">Deduction Pts.</th>
            <th style="width: 12%; background-color:#D1D5DB;">Repeat Indicator</th>
            <th style="width: 12%; background-color:#D1D5DB;">Severity</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(generateDeficiencyRow).join('')}
        </tbody>
      </table>
    `}
  `;
}

function generateDeficiencyTable(deficiencies: DeficiencyEntry[], options: PDFGenerationOptions): string {
  // Each building gets its own Outside/Inside/Units breakdown — a single Outside
  // table combining every building's exterior deficiencies made it impossible to
  // tell which building a deficiency belonged to.
  const buildings = Array.from(new Set(deficiencies.map(d => d.building || 'Unassigned')))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const buildingSections = buildings.map(building => {
    const buildingDeficiencies = deficiencies.filter(d => (d.building || 'Unassigned') === building);
    const areaSections = DEFICIENCY_AREA_SECTIONS.map(({ label, subtitle, match }) => ({
      label,
      subtitle,
      items: buildingDeficiencies.filter(d => match(String(d.area || '').toLowerCase())),
    }));

    return `
      <div class="avoid-break" style="margin-top:16px;">
        <p style="font-weight:bold; font-size:9pt; color:#006795; background-color:#E6F0F5; border:1px solid #006795; padding:4px 6px; margin-bottom:6px;">Building: ${building}</p>
        ${areaSections.map(s => generateDeficiencyAreaTable(s.label, s.subtitle, s.items)).join('')}
      </div>
    `;
  });

  return `
    <div class="summary-section">
      <h2 class="section-header">Inspectable Areas Deficiencies:</h2>
      ${buildingSections.join('')}
    </div>
  `;
}

/**
 * Generate Comments Section HTML
 */
function generateCommentsSection(comments: string): string {
  return `
    <div class="comments-section">
      <h3 style="font-size: 10pt; font-weight: bold; color: #0E7490; margin-bottom: 8px;">General Comments</h3>
      <p style="font-size: 9pt; line-height: 1.5;">${comments}</p>
    </div>
  `;
}

/**
 * Generate Recommendations Section HTML  
 */
function generateRecommendationsSection(recommendations: string[]): string {
  return `
    <div class="recommendations-section">
      <h3 style="font-size: 10pt; font-weight: bold; color: #0E7490; margin-bottom: 8px;">Recommendations</h3>
      <ul class="recommendations-list">
        ${recommendations.map(rec => `<li style="font-size: 9pt;">${rec}</li>`).join('')}
      </ul>
    </div>
  `;
}

/**
 * Generate Certification Section HTML
 */
function generateCertificationSection(certification: { certifiedBy: string; certificationDate: string; certificationStatement: string }): string {
  return `
    <div class="certification-section">
      <h3 class="certification-title">INSPECTOR CERTIFICATION</h3>
      <p style="font-size: 9pt; line-height: 1.6; margin-bottom: 20px;">
        ${certification.certificationStatement}
      </p>
      <div style="display: flex; gap: 40px;">
        <div>
          <div class="signature-line"></div>
          <div class="signature-label">Inspector Signature</div>
        </div>
        <div>
          <div style="font-weight: bold; font-size: 10pt; margin-bottom: 5px;">${certification.certifiedBy}</div>
          <div class="signature-label">Inspector Name</div>
        </div>
        <div>
          <div style="font-weight: bold; font-size: 10pt; margin-bottom: 5px;">${certification.certificationDate}</div>
          <div class="signature-label">Date</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate Footer HTML
 */
function generateFooter(options: PDFGenerationOptions): string {
  return `
    <div class="report-footer">
      <p>${options.footerText || 'Generated by NSPIRE Inspection System'}</p>
      <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      <p style="margin-top: 5px;">This document is confidential and intended for authorized use only.</p>
    </div>
  `;
}

/**
 * Generate complete NSPIRE Report HTML
 */
export function generateNSPIREReportHTML(
  report: NSPIREInspectionReport,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NSPIRE Inspection Report - ${report.metadata.inspectionNo}</title>
  <style>${generateStyles(options)}</style>
</head>
<body>
  <div class="report-container">
    ${generateHeader(report.metadata, options)}
    
    ${options.includeSummaryPage ? generateSummaryPage(
    report.summary,
    report.categoryBreakdown,
    report.metadata,
    report.inspectionData,
    report.occupancyInfo,
    report.deficiencies
  ) : ''}
    
    ${options.includeDetailedDeficiencies ? generateDeficiencyTable(report.deficiencies, options) : ''}
    
    ${report.generalComments ? generateCommentsSection(report.generalComments) : ''}
    
    ${report.recommendations?.length ? generateRecommendationsSection(report.recommendations) : ''}
    
    ${options.includeCertification && report.certification ? generateCertificationSection(report.certification) : ''}
    
    ${generateFooter(options)}
  </div>
</body>
</html>
  `;
}

/**
 * Export PDF using browser print dialog
 */
export function exportPDF(report: NSPIREInspectionReport, options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS): void {
  const html = generateNSPIREReportHTML(report, options);

  // Open a new window with the report
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Download PDF as file (alternative approach using iframe)
 */
export function downloadPDFAsHTML(report: NSPIREInspectionReport, filename: string, options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS): void {
  const html = generateNSPIREReportHTML(report, options);

  // Create a blob with the HTML content
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Create download link
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Preview report in a new tab
 */
export function previewReport(report: NSPIREInspectionReport, options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS): void {
  const html = generateNSPIREReportHTML(report, options);

  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(html);
    previewWindow.document.close();
  }
}

/**
 * Get report HTML string (for embedding or backend processing)
 */
export function getReportHTML(report: NSPIREInspectionReport, options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS): string {
  return generateNSPIREReportHTML(report, options);
}

export default {
  generateNSPIREReportHTML,
  exportPDF,
  downloadPDFAsHTML,
  previewReport,
  getReportHTML,
};
