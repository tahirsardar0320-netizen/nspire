"use client"

import { useMemo } from "react"
import { NSPIREInspectionReport } from "@/lib/nspireReport"

interface ReportPreviewModalProps {
  report: NSPIREInspectionReport
  onClose: () => void
}

export function ReportPreviewModal({ report, onClose }: ReportPreviewModalProps) {
  const deficiencySummaryByArea = useMemo(() => {
    const areas = [
      { label: 'Inside', match: (a: string) => a.includes('inside') },
      { label: 'Outside', match: (a: string) => a.includes('outside') },
      { label: 'Units', match: (a: string) => a.includes('unit') },
    ]
    return areas.map(({ label, match }) => {
      const items = (report.deficiencies || []).filter(d => match(String(d.area || '').toLowerCase()))
      return {
        label,
        lifeThreatening: items.filter(d => d.severity === 'Life-Threatening').length,
        severe: items.filter(d => d.severity === 'Severe').length,
        moderate: items.filter(d => d.severity === 'Moderate').length,
        low: items.filter(d => d.severity === 'Low').length,
      }
    })
  }, [report])

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-[#006795]">Report PDF Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-8 text-black text-sm">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="NSPIRE Inspection" className="h-14 mx-auto object-contain" />
          </div>
          <h1 className="text-center text-lg font-bold mb-6 uppercase">
            NSPIRE - National Standards for the Physical Inspection of Real Estate
          </h1>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mb-6">
            <p><span className="font-bold">Inspection No:</span> {report.metadata.inspectionNo}</p>
            <p><span className="font-bold">Inspection Start Date:</span> {report.metadata.startDate}</p>
            <p><span className="font-bold">Inspection Type:</span> {report.metadata.inspectionType}</p>
            <p><span className="font-bold">Inspection End Date:</span> {report.metadata.endDate}</p>
            <p><span className="font-bold">Escort Name:</span> {report.metadata.escortName}</p>
            <p><span className="font-bold">Report Created Date:</span> {report.metadata.reportCreatedDate}</p>
            <p><span className="font-bold">Property Type:</span> Multifamily</p>
          </div>

          <div className="border border-black grid grid-cols-2 divide-x divide-black mb-6">
            <div className="p-4">
              <p className="font-bold underline mb-2">Preliminary Scores</p>
              <div className="space-y-1">
                <p className="flex justify-between"><span>Preliminary Inspection Score:</span><span className="font-bold">{report.metadata.preliminaryScore}</span></p>
                <p className="flex justify-between"><span>Calculated Score:</span><span className="font-bold">{report.metadata.calculatedScore}</span></p>
                <p className="flex justify-between"><span>Health &amp; Safety Threshold:</span><span className="font-bold">{report.metadata.healthSafetyThreshold}</span></p>
                <p className="flex justify-between"><span>Property Threshold:</span><span className="font-bold">{report.metadata.physicalConditionThreshold}</span></p>
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold underline mb-2">Final Scores</p>
              <div className="space-y-1">
                <p className="flex justify-between"><span>Final Inspection Score:</span><span className="font-bold">{report.metadata.finalScore}</span></p>
                <p className="flex justify-between"><span>Calculated Score:</span><span className="font-bold">{report.metadata.calculatedScore}</span></p>
                <p className="flex justify-between"><span>Health &amp; Safety Threshold:</span><span className="font-bold">{report.metadata.healthSafetyThreshold}</span></p>
                <p className="flex justify-between"><span>Property Threshold:</span><span className="font-bold">{report.metadata.physicalConditionThreshold}</span></p>
              </div>
            </div>
          </div>

          <p className="font-bold underline mb-2">Building/Unit Inspection Data</p>
          <table className="w-full border-collapse border border-gray-400 mb-6 text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 p-2 text-left">Type</th>
                <th className="border border-gray-400 p-2">Property Total</th>
                <th className="border border-gray-400 p-2">Sample Size</th>
                <th className="border border-gray-400 p-2">Total Units Inspected</th>
              </tr>
            </thead>
            <tbody>
              {report.inspectionData.map((row) => (
                <tr key={row.type}>
                  <td className="border border-gray-400 p-2">{row.type}</td>
                  <td className="border border-gray-400 p-2 text-center">{row.propertyTotal}</td>
                  <td className="border border-gray-400 p-2 text-center">{row.sampleSize}</td>
                  <td className="border border-gray-400 p-2 text-center">{row.totalUnitsInspected}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="font-bold underline mb-2">Deficiency Summary</p>
          <table className="w-full border-collapse border border-gray-400 mb-6 text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 p-2 text-left">Inspectable Area</th>
                <th className="border border-gray-400 p-2">Life-Threatening</th>
                <th className="border border-gray-400 p-2">Severe</th>
                <th className="border border-gray-400 p-2">Moderate</th>
                <th className="border border-gray-400 p-2">Low</th>
              </tr>
            </thead>
            <tbody>
              {deficiencySummaryByArea.map((row) => (
                <tr key={row.label}>
                  <td className="border border-gray-400 p-2">{row.label}</td>
                  <td className="border border-gray-400 p-2 text-center">{row.lifeThreatening}</td>
                  <td className="border border-gray-400 p-2 text-center">{row.severe}</td>
                  <td className="border border-gray-400 p-2 text-center">{row.moderate}</td>
                  <td className="border border-gray-400 p-2 text-center">{row.low}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="font-bold underline mb-2">Inspectable Areas Deficiencies</p>
          {report.deficiencies.length === 0 ? (
            <p className="italic text-center text-gray-500 my-6">No deficiencies found during this inspection.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 mb-6 text-xs">
              {report.deficiencies.map((d) => (
                <li key={d.id}>
                  <span className="font-bold">{d.deficiencyName}</span> — {d.area} ({d.severity})
                </li>
              ))}
            </ul>
          )}

          {report.certification && (
            <div className="border border-black p-4 mt-6">
              <p className="font-bold underline mb-2">Inspector Certification</p>
              <p className="text-xs mb-6">{report.certification.certificationStatement}</p>
              <div className="flex justify-between text-xs">
                <div className="w-40">
                  <div className="border-t border-black pt-1">Inspector Signature</div>
                </div>
                <div className="w-32 text-right">
                  <div className="border-t border-black pt-1">Date</div>
                  <p className="font-bold">{report.certification.certificationDate}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-[10px] text-gray-500 mt-8 pt-4 border-t border-gray-300">
            <p>Generated by NSPIRE Inspection System</p>
            <p>Report generated on {new Date().toLocaleString()}</p>
            <p>This document is confidential and intended for authorized use only.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
