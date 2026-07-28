"use client"

import { useMemo } from "react"
import { NSPIREInspectionReport } from "@/lib/nspireReport"

interface ReportPreviewModalProps {
  report: NSPIREInspectionReport
  onClose: () => void
}

export function ReportPreviewModal({ report, onClose }: ReportPreviewModalProps) {
  const AREA_SECTIONS = [
    { label: 'Outside', subtitle: 'Areas affected by Rain, Snow, Wind', match: (a: string) => a.includes('outside') },
    { label: 'Inside', subtitle: 'Interior Common area, Utility closet, Mechanical rooms', match: (a: string) => a.includes('inside') },
    { label: 'Units', subtitle: 'Individual unit inspections', match: (a: string) => a.includes('unit') },
  ]

  const deficiencySummaryByArea = useMemo(() => {
    return AREA_SECTIONS.map(({ label, match }) => {
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

  // Each building gets its own Outside/Inside/Units breakdown — a single Outside
  // table combining every building's exterior deficiencies made it impossible to
  // tell which building a deficiency belonged to.
  const deficienciesByBuildingAndArea = useMemo(() => {
    const buildings = Array.from(
      new Set((report.deficiencies || []).map(d => d.building || 'Unassigned'))
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    return buildings.map(building => ({
      building,
      areas: AREA_SECTIONS.map(({ label, subtitle, match }) => ({
        label,
        subtitle,
        items: (report.deficiencies || []).filter(d =>
          (d.building || 'Unassigned') === building && match(String(d.area || '').toLowerCase())
        ),
      })),
    }))
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
          <div className="overflow-x-auto mb-6">
            <table className="w-full min-w-[420px] border-collapse border border-gray-400 text-xs">
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
          </div>

          <p className="font-bold underline mb-2">Deficiency Summary</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full min-w-[420px] border-collapse border border-gray-400 text-xs">
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
          </div>

          <p className="font-bold underline mb-2">Inspectable Areas Deficiencies</p>
          {report.deficiencies.length === 0 ? (
            <p className="italic text-center text-gray-500 my-6">No deficiencies found during this inspection.</p>
          ) : (
            <div className="mb-6 space-y-8">
              {deficienciesByBuildingAndArea.map(({ building, areas }) => (
                <div key={building}>
                  <p className="font-bold text-xs text-[#006795] bg-[#006795]/10 border border-[#006795] px-2 py-1 mb-3">Building: {building}</p>
                  <div className="space-y-6 pl-1">
                    {areas.map(({ label, items }) => (
                      <div key={label}>
                        <p className="font-bold underline mb-1">{label === 'Units' ? 'Unit' : label} Deficiencies</p>
                        {items.length === 0 ? (
                          <p className="italic text-gray-400 text-xs pl-1">No deficiencies found.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] border-collapse border border-gray-400 text-xs">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="border border-gray-400 p-2 text-left">Deficiency Details</th>
                                  <th className="border border-gray-400 p-2 text-left">Deficiency Name/Location</th>
                                  <th className="border border-gray-400 p-2 text-left">Comments</th>
                                  <th className="border border-gray-400 p-2">Deficiency Picture</th>
                                  <th className="border border-gray-400 p-2">Deduction Pts</th>
                                  <th className="border border-gray-400 p-2">Repeat Indicator</th>
                                  <th className="border border-gray-400 p-2">Severity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((d) => (
                                  <tr key={d.id}>
                                    <td className="border border-gray-400 p-2">{d.deficiencyDetails || 'No details provided'}</td>
                                    <td className="border border-gray-400 p-2">
                                      <p className="font-bold">{d.deficiencyName}</p>
                                      <p className="italic text-gray-500">{d.nspireCode}</p>
                                      <p className="text-gray-500">{d.building || '-'} | {d.unit || d.room || '-'}</p>
                                    </td>
                                    <td className="border border-gray-400 p-2">{d.comments || 'Wait for Input'}</td>
                                    <td className="border border-gray-400 p-2 text-center">
                                      {d.imageUri ? (
                                        <img src={d.imageUri} alt="Proof" className="w-16 h-16 object-cover mx-auto" />
                                      ) : (
                                        <span className="text-gray-400">No Image</span>
                                      )}
                                    </td>
                                    <td className="border border-gray-400 p-2 text-center">{d.deductionPts}</td>
                                    <td className="border border-gray-400 p-2 text-center">{d.repeatIndicator ? 'Repeat' : 'Not Repeat'}</td>
                                    <td className="border border-gray-400 p-2 text-center">{d.severity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
