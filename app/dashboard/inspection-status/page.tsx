"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { propertiesAPI, authAPI, inspectionsAPI } from "@/lib/api"
import { fetchPropertyProgressMap, getActiveInspectionId } from "@/lib/inspectionProgress"
import { fetchNSPIREReportForProperty, NSPIREInspectionReport } from "@/lib/nspireReport"
import { ReportPreviewModal } from "@/components/ReportPreviewModal"
import { toast } from "react-toastify"
import { Download, FileText, Calendar, MapPin, User, CheckCircle2, Loader2, Trash2, AlertCircle, Building2, RefreshCw, Lock } from "lucide-react"

interface Property {
  _id: string
  name: string
  address: string
  city?: string
  state?: string
  buildings?: number
  units?: number
  createdAt: string
}

interface Inspection {
  _id: string
  propertyId: {
    _id: string
    name: string
    address: string
    city?: string
    state?: string
  }
  inspector: {
    _id: string
    fullName: string
  }
  status: string
  inspectionDate: string
  createdAt: string
  findings?: any[]
  deficiencies?: any[]
}

interface PropertyWithInspection extends Property {
  inspection?: Inspection
  hasInspection: boolean
}

export default function InspectionStatusPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<PropertyWithInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({})
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null)
  const [reportPreviewData, setReportPreviewData] = useState<NSPIREInspectionReport | null>(null)
  const [loadingReportId, setLoadingReportId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      const token = localStorage.getItem('token')
      
      let userRes: any = { success: false, user: null };
      let propertiesRes: any = { success: false, properties: [] as Property[] };
      let completedInspections: Inspection[] = [];

      try {
        const [uR, pR, iR] = await Promise.all([
          authAPI.getMe().catch(() => ({ success: false, user: null })),
          propertiesAPI.getAll().catch(() => ({ success: false, properties: [] })),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspections`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(res => res.json()).catch(() => ({ success: false, inspections: [] }))
        ]);
        userRes = uR;
        propertiesRes = pR;
        if (iR && iR.success) {
          completedInspections = iR.inspections || [];
        }
      } catch (e) {
        console.warn('API connection failed during promise, using cache fallbacks:', e);
      }

      if (userRes.success) {
        setUser(userRes.user)
      }

      let allProperties: Property[] = []
      if (propertiesRes.success && propertiesRes.properties && propertiesRes.properties.length > 0) {
        allProperties = propertiesRes.properties
        localStorage.setItem('cached_properties', JSON.stringify(propertiesRes.properties))
      } else {
        const cached = localStorage.getItem('cached_properties')
        if (cached) {
          try {
            allProperties = JSON.parse(cached)
          } catch (e) {}
        }
      }

      if (completedInspections && completedInspections.length > 0) {
        localStorage.setItem('cached_completed_inspections', JSON.stringify(completedInspections))
      } else {
        const cachedInspections = localStorage.getItem('cached_completed_inspections')
        if (cachedInspections) {
          try {
            completedInspections = JSON.parse(cachedInspections)
          } catch (e) {}
        }
      }

      // Map properties with their inspection status
      const propertiesWithStatus: PropertyWithInspection[] = allProperties.map(property => {
        const inspection = completedInspections.find(
          insp => insp.propertyId?._id === property._id || insp.propertyId?._id?.toString() === property._id?.toString()
        )
        
        return {
          ...property,
          inspection,
          hasInspection: !!inspection && (inspection.status?.toLowerCase() === 'completed')
        }
      })

      // Sort: properties without inspections first (red), then with inspections (green)
      propertiesWithStatus.sort((a, b) => {
        if (a.hasInspection === b.hasInspection) return 0
        return a.hasInspection ? 1 : -1
      })

      setProperties(propertiesWithStatus)
      setActiveInspectionId(getActiveInspectionId())
      if (allProperties.length > 0) {
        const progressMap = await fetchPropertyProgressMap(allProperties, process.env.NEXT_PUBLIC_API_URL || '')
        setPropertyProgress(progressMap)
      }
    } catch (error: any) {
      console.error('Error fetching data:', error)
      const cached = localStorage.getItem('cached_properties')
      if (cached) {
        try {
          const allProperties = JSON.parse(cached)
          const propertiesWithStatus: PropertyWithInspection[] = allProperties.map((property: any) => ({
            ...property,
            hasInspection: false
          }))
          setProperties(propertiesWithStatus)
          setActiveInspectionId(getActiveInspectionId())
        } catch (e) {}
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    toast.info("Refreshing inspection status...", { position: "top-right" })
    fetchData(true)
  }

  // A property can read 100% complete locally (propertyProgress) before the initial
  // /api/inspections fetch has a matching completed Inspection record for it (pagination,
  // or the record finalizing slightly after progress hits 100%). Those cards fell into the
  // "isCompleted but !hasInspection" branch, which only rendered "View Summary" — no
  // Pay-to-Unlock/Download button at all. Backfill the real inspection record so they flow
  // through the same hasInspection branch as everything else.
  useEffect(() => {
    const targets = properties.filter((p) => !p.inspection && propertyProgress[p._id] === 100)
    if (targets.length === 0) return

    let cancelled = false
    ;(async () => {
      const found = await Promise.all(
        targets.map(async (p) => {
          try {
            const res = await inspectionsAPI.getAll({ property: p._id, status: 'completed' })
            const match = res?.success ? res.inspections?.[0] : null
            return match ? ([p._id, match] as const) : null
          } catch {
            return null
          }
        })
      )
      if (cancelled) return
      const resolved = found.filter((f): f is readonly [string, Inspection] => !!f)
      if (resolved.length === 0) return
      setProperties((prev) =>
        prev.map((p) => {
          const match = resolved.find(([id]) => id === p._id)
          return match ? { ...p, inspection: match[1], hasInspection: true } : p
        })
      )
    })()

    return () => {
      cancelled = true
    }
  }, [properties, propertyProgress])

  const handleDownloadPDF = async (property: PropertyWithInspection) => {
    if (!property.inspection) {
      toast.error("No inspection completed for this property")
      return
    }

    setDownloadingId(property._id)
    try {
      toast.info("Generating PDF report...", { position: "top-right" })

      const report = await fetchNSPIREReportForProperty(property._id)
      if (!report) {
        throw new Error('Unable to load report data for this property.')
      }

      const { downloadNSPIREReportPDF } = await import('@/lib/exportReportPdf')
      await downloadNSPIREReportPDF(report, `NSPIRE_Report_${property.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)

      toast.success("PDF downloaded successfully", { position: "top-right" })
    } catch (error: any) {
      console.error('PDF download error:', error)
      toast.error(`Failed to download PDF: ${error.message}`, { position: "top-right" })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleViewSummary = async (propertyId: string) => {
    setLoadingReportId(propertyId)
    try {
      const reportData = await fetchNSPIREReportForProperty(propertyId)
      if (reportData) {
        setReportPreviewData(reportData)
      } else {
        toast.error("Unable to load report preview.")
      }
    } catch (error) {
      console.error("Error loading report preview:", error)
      toast.error("Unable to load report preview.")
    } finally {
      setLoadingReportId(null)
    }
  }

  const handleStartInspection = (propertyId: string) => {
    const saved = localStorage.getItem(`property_coverage_${propertyId}`)
    if (saved) {
      try {
        const { coverage, calculatedUnits } = JSON.parse(saved)
        router.push(`/dashboard/property-details/${propertyId}?coverage=${coverage}&calculatedUnits=${calculatedUnits}`)
        return
      } catch (e) {}
    }
    // No coverage selected yet — send them through the normal setup flow
    router.push('/dashboard')
  }

  const isPropertyCompleted = (p: PropertyWithInspection) => p.hasInspection || propertyProgress[p._id] === 100
  const completedCount = properties.filter(isPropertyCompleted).length
  const pendingCount = properties.filter(p => !isPropertyCompleted(p)).length
  const thisMonthCount = properties.filter(p => {
    if (!p.inspection) return false
    const inspDate = new Date(p.inspection.inspectionDate)
    const now = new Date()
    return inspDate.getMonth() === now.getMonth() && inspDate.getFullYear() === now.getFullYear()
  }).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-gradient mb-2 truncate">Inspection Status</h1>
            <p className="text-sm sm:text-base text-gray-600">View all properties and their inspection status</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wide">Total Properties</p>
                <p className="text-2xl sm:text-3xl font-black text-blue-900 mt-1 sm:mt-2">{properties.length}</p>
              </div>
              <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-green-600 uppercase tracking-wide">Completed</p>
                <p className="text-2xl sm:text-3xl font-black text-green-900 mt-1 sm:mt-2">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wide">Pending</p>
                <p className="text-2xl sm:text-3xl font-black text-red-900 mt-1 sm:mt-2">{pendingCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-purple-600 uppercase tracking-wide">This Month</p>
                <p className="text-2xl sm:text-3xl font-black text-purple-900 mt-1 sm:mt-2">{thisMonthCount}</p>
              </div>
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add a property to start inspections.</p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-[#006795] hover:bg-blue-700 text-white text-sm sm:text-base"
            >
              Add Property
            </Button>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {properties.map((property) => {
              const pid = property._id
              const pct = propertyProgress[pid] || 0
              const isCompleted = property.hasInspection || pct === 100
              const isActive = !isCompleted && activeInspectionId === pid
              const isLocked = !isCompleted && !isActive && !!activeInspectionId && activeInspectionId !== pid
              return (
              <Card
                key={pid}
                className={`p-4 sm:p-6 hover:shadow-lg transition-all overflow-hidden ${
                  isCompleted
                    ? 'border-2 border-green-500 bg-green-50/30'
                    : isActive
                      ? 'border-2 border-amber-400 bg-amber-50/30'
                      : 'border-2 border-red-500 bg-red-50/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-green-100' : isActive ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        ) : isActive ? (
                          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate min-w-0">
                            {property.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold w-fit flex-shrink-0 whitespace-nowrap ${
                            isCompleted
                              ? 'bg-green-100 text-green-800'
                              : isActive
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {isCompleted
                              ? 'Completed'
                              : isActive
                                ? `In Progress (${pct}%)`
                                : 'Pending'}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-none">{property.address}</span>
                            {property.city && <span className="hidden sm:inline whitespace-nowrap">, {property.city}</span>}
                            {property.state && <span className="hidden sm:inline whitespace-nowrap">, {property.state}</span>}
                          </div>
                          <button
                            onClick={() => handleViewSummary(property._id)}
                            disabled={loadingReportId === property._id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-[#006795] border border-[#006795]/30 hover:bg-[#006795]/10 transition-colors flex-shrink-0 disabled:opacity-50"
                          >
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            {loadingReportId === property._id ? 'Loading...' : 'View Report Summary'}
                          </button>
                          {property.inspection && (
                            <>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="whitespace-nowrap">
                                  {(() => {
                                    const raw: any = property.inspection
                                    const d = raw.inspectionDate || raw.completedAt || raw.createdAt
                                    const parsed = d ? new Date(d) : null
                                    return parsed && !isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : '-'
                                  })()}
                                </span>
                              </div>
                              {(() => {
                                const raw: any = property.inspection
                                const inspectorName = raw.inspector?.fullName
                                return inspectorName ? (
                                  <div className="flex items-center gap-1 min-w-0">
                                    <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="truncate max-w-[150px] sm:max-w-none">{inspectorName}</span>
                                  </div>
                                ) : null
                              })()}
                            </>
                          )}
                        </div>
                        {property.inspection && (() => {
                          const raw: any = property.inspection
                          const count = raw.findings?.length || raw.deficiencies?.length || raw.inspectionData?.findings?.length || raw.inspectionData?.deficiencies?.length || 0
                          return count > 0 ? (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 whitespace-nowrap">
                                {count} Deficiencies
                              </span>
                            </div>
                          ) : null
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 sm:flex-shrink-0">
                    {property.hasInspection ? (
                      <Button
                        onClick={() => handleDownloadPDF(property)}
                        disabled={downloadingId === property._id}
                        className="bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap"
                      >
                        {downloadingId === property._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            <span className="hidden sm:inline">Generating...</span>
                            <span className="sm:hidden">Loading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="sm:hidden">Download</span>
                          </>
                        )}
                      </Button>
                    ) : isCompleted ? (
                      <Button
                        onClick={() => handleViewSummary(property._id)}
                        disabled={loadingReportId === property._id}
                        className="bg-[#006795] hover:bg-[#0a5670] text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        {loadingReportId === property._id ? 'Loading...' : 'View Summary'}
                      </Button>
                    ) : isActive ? (
                      <Button
                        onClick={() => handleStartInspection(property._id)}
                        className="bg-[#006795] hover:bg-[#0a5670] text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        Continue Inspection
                      </Button>
                    ) : isLocked ? (
                      <Button
                        disabled
                        className="bg-rose-400 hover:bg-rose-400 text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4 flex-shrink-0" />
                        Locked
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartInspection(property._id)}
                        className="bg-[#006795] hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        Start Inspection
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
              )
            })}
          </div>
        )}
      </div>
      {reportPreviewData && (
        <ReportPreviewModal report={reportPreviewData} onClose={() => setReportPreviewData(null)} />
      )}
    </DashboardLayout>
  )
}

