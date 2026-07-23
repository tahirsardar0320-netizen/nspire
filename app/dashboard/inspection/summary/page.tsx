"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, FileText } from "lucide-react"
import { toast } from "react-toastify"
import { propertiesAPI, inspectionsAPI, paymentsAPI } from "@/lib/api"
import { SummaryModal } from "@/components/PropertyModals"
import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySummary,
  InspectionMetadata,
  DeficiencySeverity,
  SEVERITY_COLORS,
  REPAIR_TIMELINES,
  DEFAULT_PDF_OPTIONS,
  mapSeverityToNSPIRE,
  calculateDeductionPoints,
  mapCategoryToNSPIRECode,
} from "@/lib/nspireReport"


// Icons
// Icons

const Download = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const Excel = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3h7l5 5v12a1 1 0 01-1 1H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3v6h6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 16l4-4m0 4l-4-4" />
  </svg>
)

const Lock = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2 .896 2 2v1a2 2 0 01-4 0v-1c0-1.104.896-2 2-2zm6 8H6a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a5 5 0 1110 0v2h1a2 2 0 012 2v6a2 2 0 01-2 2zM9 9h6V7a3 3 0 10-6 0v2z" />
  </svg>
)

const Unlock = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0m10 4H8a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" />
  </svg>
)


const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

// Loading fallback component
function LoadingFallback() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
      </div>
    </DashboardLayout>
  )
}

/**
 * NSPIRE-Compliant Inspection Summary Page
 * Follows HUD NSPIRE Inspection Summary structure exactly
 */
export default function NSPIREInspectionSummaryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NSPIREInspectionSummaryContent />
    </Suspense>
  )
}

function NSPIREInspectionSummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [report, setReport] = useState<NSPIREInspectionReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportingExcel, setExportingExcel] = useState(false)
  const [checkingUnlock, setCheckingUnlock] = useState(true)
  const [isReportUnlocked, setIsReportUnlocked] = useState(false)
  const [purchasingUnlock, setPurchasingUnlock] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [showReportPreview, setShowReportPreview] = useState(false)
  const [showUnlockSummaryModal, setShowUnlockSummaryModal] = useState(false)
  const [fullReportEmail, setFullReportEmail] = useState('')
  const [property, setProperty] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'deficiencies' | 'preview'>('summary')
  // Custom column header from the building table (editable in property-details)
  const [buildingColumnHeader, setBuildingColumnHeader] = useState('Building')

  // Unit-based inspection context
  const [inspectionContext, setInspectionContext] = useState<{
    propertyId: string
    buildingId: string
    unitName: string
    propertyDetailsUrl: string
  } | null>(null)

  // Load unit inspection context
  useEffect(() => {
    try {
      const ctx = localStorage.getItem('currentInspectionUnit')
      if (ctx) setInspectionContext(JSON.parse(ctx))
    } catch {}
  }, [])

  const inspectionIdentifier = useMemo(() => {
    const id = searchParams.get('id') || searchParams.get('inspectionId') || searchParams.get('propertyId')
    return id || null
  }, [searchParams])

  const visibleDeficiencies = useMemo(() => {
    if (!report) return []
    // If we're just previewing progress (not finalizing), show everything so they can review
    const isFinalizing = searchParams.get('finalize') === 'true';
    if (isReportUnlocked || !isFinalizing) return report.deficiencies
    return report.deficiencies.slice(0, 2)
  }, [report, isReportUnlocked, searchParams])

  // Deficiency counts by inspectable area, for the "Deficiency Summary" table in the report preview
  const deficiencySummaryByArea = useMemo(() => {
    const areas = [
      { label: 'Inside', match: (a: string) => a.includes('inside') },
      { label: 'Outside', match: (a: string) => a.includes('outside') },
      { label: 'Units', match: (a: string) => a.includes('unit') },
    ]
    return areas.map(({ label, match }) => {
      const items = (report?.deficiencies || []).filter(d => match(String(d.area || '').toLowerCase()))
      return {
        label,
        lifeThreatening: items.filter(d => d.severity === 'Life-Threatening').length,
        severe: items.filter(d => d.severity === 'Severe').length,
        moderate: items.filter(d => d.severity === 'Moderate').length,
        low: items.filter(d => d.severity === 'Low').length,
      }
    })
  }, [report])

  // Handle "Back to Inspection" - return to the active inspection screen
  const handleBackToInspection = () => {
    const propertyId = searchParams.get('propertyId') || searchParams.get('id');
    if (propertyId) {
      router.push(`/dashboard/inspection-category/${propertyId}`);
      return;
    }
    
    // Priority 1: Current unit context from localStorage
    if (inspectionContext) {
      router.push(`/dashboard/inspection-category/${inspectionContext.propertyId}`);
      return;
    }

    // Priority 2: Fallback to currentInspectionData
    try {
      const storedDataRaw = localStorage.getItem('currentInspectionData');
      if (storedDataRaw) {
        const parsed = JSON.parse(storedDataRaw);
        const propertyId = parsed.propertyId || parsed.inspectionId;
        const building = parsed.building || parsed.buildingId || '';
        const unit = parsed.currentUnit || parsed.unitId || '';
        
        if (propertyId) {
          let url = `/dashboard/inspection-category/${propertyId}`;
          const params = new URLSearchParams();
          if (building) params.append('building', building);
          if (unit) params.append('unit', unit);
          params.append('units', '1');
          
          url += `?${params.toString()}`;
          router.push(url);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse inspection data for return URL', e);
    }

    // Priority 3: Try to find any progress record to go back to
    const storedPropertyRaw = localStorage.getItem('currentInspectionProperty');
    if (storedPropertyRaw) {
      try {
        const prop = JSON.parse(storedPropertyRaw);
        const pid = prop._id || prop.id;
        if (pid) {
          router.push(`/dashboard/inspection-category/${pid}?building=B1&unit=Outside&units=1`);
          return;
        }
      } catch {}
    }

    // Priority 4: Dashboard
    router.push('/dashboard');
  }

  // Load inspection data from URL params or localStorage
  useEffect(() => {
    const loadInspectionData = async () => {
      try {
        setLoading(true);
        // IGNORE localStorage - fetch everything from server to ensure fresh data
        let inspectionData: any = null;
        let propertyData = null;

        const propertyId = searchParams.get('propertyId') || searchParams.get('id');
        const token = localStorage.getItem('token');

        if (propertyId && token) {
          try {
            // Fetch property details
            const propRes = await propertiesAPI.getById(propertyId);
            if (propRes.success) {
              propertyData = propRes.property;
              setProperty(propRes.property);
            }

            // Fetch current progress (drafts)
            const progData = await inspectionsAPI.getProgress({
              property_id: propertyId,
              draft_only: 'false'
            });

            // Fetch finalized inspections (completed)
            const inspectionsRes = await inspectionsAPI.getAll({
              property: propertyId,
              status: 'completed'
            });

            let allFindings: any[] = [];
            let serverUnlocked = false;

            // 1. Collect findings from all progress (draft) records
            if (progData && progData.progress) {
              const allProgress = progData.progress || [];
              allProgress.forEach((record: any) => {
                const recordFindings = record.inspectionData?.findings || record.inspectionData?.deficiencies || [];
                if (Array.isArray(recordFindings)) {
                  const building = record.buildingId || record.inspectionData?.buildingId || '';
                  const unit = record.unitId || record.inspectionData?.currentUnit || '-';
                  const rawArea = record.inspectionType || (unit === 'Outside' ? 'Outside' : unit === 'Inside' ? 'Inside' : 'Unit');
                  const area = rawArea.charAt(0).toUpperCase() + rawArea.slice(1).toLowerCase();
                  
                  recordFindings.forEach((f: any) => {
                    allFindings.push({
                      ...f,
                      building: f.building || building,
                      unit: f.unit || unit,
                      area: f.area || area
                    });
                  });
                }
              });
            }

            // 2. Collect findings from finalized (completed) inspections
            if (inspectionsRes.success && inspectionsRes.inspections) {
              inspectionsRes.inspections.forEach((insp: any) => {
                const inspFindings = insp.findings || insp.deficiencies || [];
                if (insp.isReportUnlocked) serverUnlocked = true;
                
                if (Array.isArray(inspFindings)) {
                  inspFindings.forEach((f: any) => {
                    allFindings.push({
                      ...f,
                      building: f.building || insp.building?.name || '',
                      unit: f.unit || insp.unit?.name || insp.unit || '-',
                      area: f.area || insp.inspectionType || 'Final',
                      isFinalized: true
                    });
                  });
                }
              });
            }

            // 3. Smart aggregation: deduplicate findings by a unique key
            const deduped = new Map<string, any>();
            allFindings.forEach(f => {
              // Normalize common identifiers to ensure matches
              const normBuilding = String(f.building || '').replace(/^Building\s+/i, 'B').toUpperCase().trim();
              const normUnit = String(f.unit || '').replace(/^Unit\s+/i, '').replace(/^-$/, '').toUpperCase().trim();
              const normName = String(f.deficiencyName || f.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');

              // Create a key that identifies the SAME physical deficiency across different states
              const key = [normName, normBuilding, normUnit].filter(Boolean).join('|');
              
              // If we have duplicates, prefer the one that came from a finalized inspection or has an image
              const existing = deduped.get(key);
              const isNewerOrBetter = !existing || 
                                     (f.isFinalized && !existing.isFinalized) || 
                                     (!existing.imageUri && f.imageUri);
                                     
              if (isNewerOrBetter) {
                deduped.set(key, f);
              }
            });

            const finalFindings = Array.from(deduped.values());
            console.log(`Summary Aggregation: Raw=${allFindings.length}, Deduped=${finalFindings.length}`);

            // Update local unlock state if server reports any inspection is unlocked
            if (serverUnlocked) setIsReportUnlocked(true);

            // 4. Update inspectionData with combined findings
            inspectionData = {
              ...(inspectionData || {}),
              propertyId,
              propertyName: propertyData?.name || 'Property',
              propertyAddress: propertyData?.address || '-',
              findings: finalFindings,
              deficiencies: finalFindings
            };
          } catch (fetchError) {
            console.error('Error fetching property-wide progress:', fetchError);
          }
        }

        if (inspectionData) {
          // Load custom column header if present
          if (inspectionData.buildingColumnHeader) {
            setBuildingColumnHeader(inspectionData.buildingColumnHeader)
          }
          // Convert to NSPIRE report format
          const nspireReport = convertToNSPIREReport(inspectionData, propertyData)
          setReport(nspireReport)
        } else if (propertyId) {
          // If we have an ID but no data, don't show demo data - show error
          toast.error("Property data not found on server.", { position: "top-right" });
          setReport(null);
        } else {
          // Only show demo data if explicitly requested or no ID provided at all
          setReport(getDemoReport())
        }
      } catch (error: any) {
        console.error('Error loading inspection data:', error)
        toast.error(`Failed to load inspection: ${error.message}`, { position: "top-right" });
        setReport(null);
      } finally {
        setLoading(false)
      }
    }

    loadInspectionData()
  }, [searchParams])

  useEffect(() => {
    const checkUnlockStatus = async () => {
      if (!inspectionIdentifier) {
        setCheckingUnlock(false)
        setIsReportUnlocked(false)
        return
      }

      try {
        setCheckingUnlock(true)
        const data = await paymentsAPI.checkReportUnlock(inspectionIdentifier);
        setIsReportUnlocked(!!data?.isReportUnlocked)
      } catch (error) {
        console.error('Unlock status check error:', error)
        setIsReportUnlocked(false)
      } finally {
        setCheckingUnlock(false)
      }
    }

    checkUnlockStatus()
  }, [inspectionIdentifier])

  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')

    if (!paymentStatus) {
      return
    }

    const cleanUrl = () => {
      const cleanParams = new URLSearchParams(searchParams.toString())
      cleanParams.delete('payment')
      cleanParams.delete('session_id')
      const nextUrl = cleanParams.toString()
        ? `/dashboard/inspection/summary?${cleanParams.toString()}`
        : '/dashboard/inspection/summary'
      router.replace(nextUrl)
    }

    const verifyStripeSession = async () => {
      try {
        if (paymentStatus === 'cancelled') {
          toast.info('Payment was cancelled. Report remains locked.', { position: 'top-right' })
          cleanUrl()
          return
        }

        if (paymentStatus === 'success' && sessionId) {
          const data = await paymentsAPI.getStripeSessionStatus(sessionId);
          
          if (!data?.success) {
            throw new Error((data as any)?.message || 'Unable to verify Stripe payment status.')
          }

          if (data?.isReportUnlocked) {
            setIsReportUnlocked(true)
            toast.success('Payment confirmed. Report unlocked!', { position: 'top-right' })
          } else {
            toast.warning('Payment is not completed yet. Please try again in a moment.', { position: 'top-right' })
          }
        }
      } catch (error: any) {
        console.error('Stripe payment verification error:', error)
        toast.error(`Payment verification failed: ${error.message}`, { position: 'top-right' })
      } finally {
        cleanUrl()
      }
    }

    verifyStripeSession()
  }, [searchParams, router])

  // Convert inspection data to NSPIRE report format
  const convertToNSPIREReport = (data: any, property: any): NSPIREInspectionReport => {
    const now = new Date()

    // Convert findings to deficiency entries
    const deficiencies: DeficiencyEntry[] = (data.findings || data.deficiencies || []).map((finding: any, index: number) => {
      const severity = mapSeverityToNSPIRE(finding.severity || finding.healthAndSafety || 'Moderate')
      return {
        id: finding.id || `DEF-${index + 1}`,
        imageUri: finding.imageUri || finding.imageUrl || finding.photos?.[0]?.url || '',
        building: finding.building || property?.building || 'A',
        unit: finding.unit || property?.unit || '-',
        room: finding.location || finding.room || '-',
        area: finding.area || finding.category || '-',
        deficiencyName: finding.title || finding.selected || finding.deficiencyName || 'Unnamed Deficiency',
        nspireCode: finding.nspireCode || mapCategoryToNSPIRECode(finding.category || finding.area),
        deficiencyDetails: finding.description || finding.detail || finding.deficiencyDetails || '',
        comments: finding.notes || finding.comments || finding.recommendation || '',
        deductionPts: calculateDeductionPoints(finding.severity || 'moderate'),
        repeatIndicator: finding.repeat || false,
        severity,
        healthAndSafety: finding.healthAndSafety || severity,
        repairTimeline: finding.repairBy || finding.repairTimeline || REPAIR_TIMELINES[severity],
        codeAndCompliance: finding.codeAndCompliance || '',
        inspectedDate: now.toLocaleDateString(),
        inspectedTime: finding.timestamp ? new Date(finding.timestamp).toLocaleTimeString() : now.toLocaleTimeString(),
        inspectorId: data.inspectorId || 'INS-001',
        status: finding.status || 'Open',
      }
    })

    // Calculate summary
    const summary: DeficiencySummary = {
      lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening').length,
      severe: deficiencies.filter(d => d.severity === 'Severe').length,
      moderate: deficiencies.filter(d => d.severity === 'Moderate').length,
      low: deficiencies.filter(d => d.severity === 'Low').length,
      total: deficiencies.length,
      byBuilding: {},
      byCategory: {},
      repeatDeficiencies: deficiencies.filter(d => d.repeatIndicator).length,
      newDeficiencies: deficiencies.filter(d => !d.repeatIndicator).length,
    }

    // Populate category breakdown
    deficiencies.forEach(d => {
      const cat = d.area || 'General';
      summary.byCategory[cat] = (summary.byCategory[cat] || 0) + 1;
    });

    // Calculate score
    const totalDeductions = deficiencies.reduce((sum, d) => sum + d.deductionPts, 0)
    const preliminaryScore = Math.max(0, 100 - totalDeductions)
    const finalScore = Math.max(0, preliminaryScore - 5)

    return {
      reportId: `RPT-${Date.now()}`,
      version: '1.0',
      generatedAt: now.toISOString(),
      metadata: {
        inspectionNo: data?.inspectionNo || data?.inspectionId || `INSP-${Date.now().toString(36).toUpperCase()}`,
        inspectionType: data.inspectionType || 'General NSPIRE',
        escortName: data.escortName || property?.contactName || '-',
        propertyAddress: property?.address || data.address || data.propertyAddress || '-',
        propertyName: property?.name || data.propertyName || '-',
        propertyId: property?._id || property?.propertyId || data.propertyId || '-',
        startDate: data.startDate || now.toLocaleDateString(),
        startTime: data.startTime || '09:00 AM',
        endDate: data.endDate || now.toLocaleDateString(),
        endTime: data.endTime || now.toLocaleTimeString(),
        reportCreatedDate: now.toLocaleDateString(),
        preliminaryScore: preliminaryScore,
        finalScore: finalScore,
        calculatedScore: finalScore,
        healthSafetyThreshold: 60,
        physicalConditionThreshold: 60,
        inspectorName: data.inspectorName || 'Inspector',
        inspectorId: data.inspectorId || 'INS-001',
      },
      inspectionData: [
        { type: 'Building', propertyTotal: property?.buildings || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Unit', propertyTotal: property?.units || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Site', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Common Area', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
      ],
      occupancyInfo: {
        totalUnits: property?.units || 1,
        occupiedUnits: property?.occupiedUnits || property?.units || 1,
        vacantUnits: property?.vacantUnits || 0,
        occupancyRate: property?.occupancyRate || 100,
      },
      summary,
      categoryBreakdown: [],
      deficiencies,
      generalComments: data.notes || data.generalComments || '',
      recommendations: data.recommendations || [],
      certification: {
        certifiedBy: data.inspectorName || 'Inspector',
        certificationDate: now.toLocaleDateString(),
        certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.',
      },
    }
  }

  // Demo report for testing
  const getDemoReport = (): NSPIREInspectionReport => {
    const now = new Date()
    return {
      reportId: 'RPT-DEMO-001',
      version: '1.0',
      generatedAt: now.toISOString(),
      metadata: {
        inspectionNo: 'INSP-2026-001',
        inspectionType: 'General NSPIRE',
        escortName: 'Property Manager',
        propertyAddress: '123 Main Street, New York, NY 10001',
        propertyName: 'Sunset Apartments',
        propertyId: 'PROP-001',
        startDate: now.toLocaleDateString(),
        startTime: '09:00 AM',
        endDate: now.toLocaleDateString(),
        endTime: '02:30 PM',
        reportCreatedDate: now.toLocaleDateString(),
        preliminaryScore: 82,
        finalScore: 82,
        calculatedScore: 82,
        healthSafetyThreshold: 60,
        physicalConditionThreshold: 60,
        inspectorName: 'John Smith',
        inspectorId: 'INS-001',
      },
      inspectionData: [
        { type: 'Building', propertyTotal: 2, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Unit', propertyTotal: 24, sampleSize: 5, totalUnitsInspected: 5 },
        { type: 'Site', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Common Area', propertyTotal: 4, sampleSize: 2, totalUnitsInspected: 2 },
      ],
      occupancyInfo: {
        totalUnits: 24,
        occupiedUnits: 22,
        vacantUnits: 2,
        occupancyRate: 91.7,
      },
      summary: {
        lifeThreatening: 1,
        severe: 0,
        moderate: 1,
        low: 1,
        total: 3,
        byBuilding: {},
        byCategory: {},
        repeatDeficiencies: 0,
        newDeficiencies: 3,
      },
      categoryBreakdown: [],
      deficiencies: [
        {
          id: 'DEF-001',
          imageUri: '',
          building: 'A',
          unit: '101',
          room: 'Kitchen',
          area: 'Fire Safety',
          deficiencyName: 'Smoke Detector - Non-Functional',
          nspireCode: 'HS-7',
          deficiencyDetails: 'Smoke detector is not responding to test button. Battery appears to be dead or detector is malfunctioning.',
          comments: 'Requires immediate replacement. Tenant reported issue last week.',
          deductionPts: 10,
          repeatIndicator: false,
          severity: 'Life-Threatening',
          healthAndSafety: 'Life-Threatening',
          repairTimeline: '24 Hours',
          codeAndCompliance: 'NFPA 72',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '10:15 AM',
          inspectorId: 'INS-001',
          status: 'Open',
        },
        {
          id: 'DEF-002',
          imageUri: '',
          building: 'A',
          unit: '101',
          room: 'Kitchen',
          area: 'Plumbing',
          deficiencyName: 'Kitchen Faucet - Minor Leak',
          nspireCode: 'BS-1',
          deficiencyDetails: 'Slow drip detected under the kitchen sink. Washer may need replacement.',
          comments: 'Schedule maintenance for repair within 30 days.',
          deductionPts: 3,
          repeatIndicator: false,
          severity: 'Moderate',
          healthAndSafety: 'Moderate',
          repairTimeline: '30 Days',
          codeAndCompliance: 'IPC Section 701',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '10:30 AM',
          inspectorId: 'INS-001',
          status: 'Open',
        },
        {
          id: 'DEF-003',
          imageUri: '',
          building: 'A',
          unit: '101',
          room: 'Hallway',
          area: 'Interior',
          deficiencyName: 'Wall Paint - Peeling',
          nspireCode: 'U-16',
          deficiencyDetails: 'Minor paint peeling observed on hallway wall near entrance. Cosmetic issue only.',
          comments: 'Low priority. Schedule during next unit turnover.',
          deductionPts: 1,
          repeatIndicator: false,
          severity: 'Low',
          healthAndSafety: 'Low',
          repairTimeline: '60 Days',
          codeAndCompliance: 'UPCS',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '10:45 AM',
          inspectorId: 'INS-001',
          status: 'Open',
        },
      ],
      generalComments: 'Overall unit condition is good. All electrical systems functioning properly. Minor plumbing issue requires attention within 30 days. Smoke detector must be replaced immediately for safety compliance.',
      recommendations: [
        'Replace smoke detector in Unit 101 immediately',
        'Schedule plumbing maintenance for kitchen faucet',
        'Include wall repainting in next maintenance cycle',
      ],
      certification: {
        certifiedBy: 'John Smith',
        certificationDate: now.toLocaleDateString(),
        certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.',
      },
    }
  }

  // Handlers
  const handleUnlockWithStripe = async () => {
    try {
      if (!inspectionIdentifier) {
        toast.error('Inspection ID is missing. Please refresh and try again.', { position: 'top-right' })
        return
      }

      setPurchasingUnlock(true)
      const data = await paymentsAPI.createStripeCheckoutSession(inspectionIdentifier);

      if (data?.isReportUnlocked || data?.alreadyUnlocked) {
        setIsReportUnlocked(true)
        toast.success('Report is already unlocked.', { position: 'top-right' })
        return
      }

      if (!data?.checkoutUrl) {
        throw new Error('Stripe checkout URL is missing.')
      }

      window.location.href = data.checkoutUrl
    } catch (error: any) {
      console.error('Stripe checkout start error:', error)
      toast.error(`Unable to start payment: ${error.message}`, { position: 'top-right' })
    } finally {
      setPurchasingUnlock(false)
    }
  }

  const handleSendFullReportLink = () => {
    if (!fullReportEmail.trim() || !/^\S+@\S+\.\S+$/.test(fullReportEmail.trim())) {
      toast.error('Please enter a valid email address.', { position: 'top-right' })
      return
    }
    setShowUnlockSummaryModal(false)
    handleUnlockWithStripe()
  }

  const handleExportPDF = async () => {
    if (!report) return

    // If not unlocked, redirect to payment — no preview download allowed
    if (!isReportUnlocked) {
      toast.info('This report is locked. Redirecting to unlock checkout...', { position: 'top-right' })
      await handleUnlockWithStripe()
      return
    }

    setExporting(true)
    try {
      toast.info("Generating PDF through Puppeteer service...", { position: "top-right" })

      const token = localStorage.getItem('token')

      // Prepare the payload matching backend expectations
      let payloadData;
      let mergedInspectionPayload: any = null;

      const storedData = localStorage.getItem('currentInspectionData');
      const storedProperty = localStorage.getItem('currentInspectionProperty');

      // First persist/update the inspection in backend to obtain merged property-level data
      // (prevents previous building details from being dropped when exporting after partial updates)
      if (storedData && storedProperty) {
        mergedInspectionPayload = await markInspectionAsCompleted({
          silentToast: true,
          returnInspection: true,
        });
      }

      if (mergedInspectionPayload) {
        const propertyData = storedProperty ? JSON.parse(storedProperty) : null;
        
        // PHOTO FIX: Prefer `findings` (raw data with imageUri strings) over
        // `deficiencies` (transformed objects where imageUri is nested inside photos[].url)
        const rawItems = mergedInspectionPayload.findings || mergedInspectionPayload.deficiencies || [];

        // Deep-scan helper: extract the first valid image URL from any field
        const extractImageUrl = (d: any): string => {
          // 1. Direct string fields
          if (typeof d.imageUri === 'string' && d.imageUri.startsWith('http')) return d.imageUri;
          if (typeof d.imageUrl === 'string' && d.imageUrl.startsWith('http')) return d.imageUrl;
          if (typeof d.photo === 'string' && d.photo.startsWith('http')) return d.photo;
          if (typeof d.image === 'string' && d.image.startsWith('http')) return d.image;
          // 2. photos array (could be strings or {url} objects)
          if (Array.isArray(d.photos) && d.photos.length > 0) {
            const first = d.photos[0];
            if (typeof first === 'string' && first.startsWith('http')) return first;
            if (first?.url && typeof first.url === 'string' && first.url.startsWith('http')) return first.url;
          }
          // 3. Fallback: scan all keys for any http URL
          for (const key of Object.keys(d)) {
            const val = d[key];
            if (typeof val === 'string' && val.startsWith('http') && (val.includes('cloudinary') || val.includes('.jpg') || val.includes('.png') || val.includes('.jpeg') || val.includes('.webp'))) {
              return val;
            }
          }
          return '';
        };

        // MAPPING FIX: Ensure photos are correctly formatted for the generator
        const exportDeficiencies = rawItems.map((d: any) => {
          const img = extractImageUrl(d);
          return {
            ...d,
            title: d.deficiencyName || d.title,
            description: d.deficiencyDetails || d.description,
            notes: d.comments || d.notes,
            category: d.area || d.category,
            imageUri: img,
            imageUrl: img,
            photos: img ? [img] : []
          };
        });

        payloadData = {
          ...mergedInspectionPayload,
          property: propertyData || mergedInspectionPayload.property,
          findings: exportDeficiencies,
          deficiencies: exportDeficiencies,
          inspectionNo: mergedInspectionPayload.inspectionId || report.metadata.inspectionNo,
          propertyName: propertyData?.name || report.metadata.propertyName,
          propertyAddress: propertyData?.address || report.metadata.propertyAddress,
        };
      }

      if (!payloadData && storedData) {
        // Use raw data if available (best for metadata preservation)
        const rawData = JSON.parse(storedData);
        if (storedProperty) {
          rawData.property = JSON.parse(storedProperty);
        }
        
        payloadData = rawData;
      } else if (!payloadData) {
        // Fallback: Reconstruct compatible object from current report state
        // The backend expects flat properties for metadata (e.g. propertyName)
        // or a nested property object.
        // Limit deficiencies for preview export if locked
        const exportDeficiencies = report.deficiencies;

        payloadData = {
          ...report.metadata, // Spread metadata (inspectionNo, propertyName, etc.) to root
          deficiencies: exportDeficiencies.map((d: any) => {
            const img = d.imageUri || d.imageUrl || (Array.isArray(d.photos) && d.photos.length > 0 ? (typeof d.photos[0] === 'string' ? d.photos[0] : d.photos[0].url) : '') || '';
            return {
              ...d,
              title: d.deficiencyName,
              description: d.deficiencyDetails,
              notes: d.comments,
              category: d.area,
              imageUri: img,
              imageUrl: img,
              photos: [img]
            };
          }),
          findings: exportDeficiencies.map((d: any) => {
            const img = d.imageUri || d.imageUrl || (Array.isArray(d.photos) && d.photos.length > 0 ? (typeof d.photos[0] === 'string' ? d.photos[0] : d.photos[0].url) : '') || '';
            return {
              ...d,
              imageUri: img,
              imageUrl: img,
              photos: [img]
            };
          })
        };

        const imageCount = payloadData.deficiencies.filter((d: any) => d.imageUri || (d.photos && d.photos.length > 0)).length;
        console.log(`FINAL PDF PAYLOAD: ${payloadData.deficiencies.length} items, ${imageCount} have images.`);
        console.log("PAYLOAD SAMPLE:", JSON.stringify(payloadData.deficiencies[0]).substring(0, 500));
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inspections/generate-pdf?includeImages=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inspectionData: payloadData,
          reportType: 'nspire'
        })
      })

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (possible fallback or error)
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate PDF');
        }

        if (data.html) {
          // Fallback: Backend returned HTML because PDF generation failed
          console.log('Received HTML fallback from backend');
          toast.info("Backend PDF generation unavailable. Printing report locally...", { position: "top-right" });

          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(data.html);
            printWindow.document.close();
            // Wait for images to load before printing
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          } else {
            const htmlBlob = new Blob([data.html], { type: 'text/html' });
            const htmlUrl = window.URL.createObjectURL(htmlBlob);
            const htmlLink = document.createElement('a');
            htmlLink.href = htmlUrl;
            htmlLink.download = (data.filename || `INSPIRE_Report_${report.metadata.inspectionNo}.html`).replace(/\.pdf$/i, '.html');
            document.body.appendChild(htmlLink);
            htmlLink.click();
            document.body.removeChild(htmlLink);
            window.URL.revokeObjectURL(htmlUrl);
            toast.warning('Popup blocked. Downloaded HTML backup instead—open it and print to PDF.', { position: 'top-right' });
          }
          
          // Still mark as completed even with HTML fallback
          await markInspectionAsCompleted();
          return; // Exit, handled
        }
      }

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Handle standard PDF Blob download
      const blob = await response.blob()

      if (blob.size < 100 || blob.type.includes('json')) {
        console.warn("Received suspicious blob", blob);
        // Attempt to read as text to see error
        const text = await blob.text();
        try {
          const errJson = JSON.parse(text);
          throw new Error(errJson.message || "Invalid PDF response");
        } catch (e) {
          // Not JSON, just small blob?
        }
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `INSPIRE_Report_${report.metadata.inspectionNo}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("PDF downloaded successfully", { position: "top-right" })

      // If pre-update did not run/succeed, attempt completion now
      if (!mergedInspectionPayload) {
        await markInspectionAsCompleted();
      }
      
    } catch (error: any) {
      console.error('PDF export error:', error)
      toast.error(`Failed to export PDF: ${error.message}`, { position: "top-right" })
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = async () => {
    if (!report) return

    if (!isReportUnlocked) {
      toast.info('This report is locked. Redirecting to unlock checkout...', { position: 'top-right' })
      await handleUnlockWithStripe()
      return
    }

    setExportingExcel(true)
    try {
      const blob = await inspectionsAPI.generateExcel(report);

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `NSPIRE_Report_${report.metadata.inspectionNo || 'Export'}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Professional Excel report downloaded!', { position: 'top-right' })
      await markInspectionAsCompleted({ silentToast: true })
    } catch (error: any) {
      console.error('Excel export error:', error)
      toast.error(`Failed to export Excel: ${error.message}`, { position: 'top-right' })
    } finally {
      setExportingExcel(false)
    }
  }

  // Mark inspection as completed in the backend
  const markInspectionAsCompleted = async (options?: { silentToast?: boolean; returnInspection?: boolean }) => {
    const { silentToast = false, returnInspection = false } = options || {};

    try {
      // Also mark the unit as completed in localStorage for property-details tracking
      if (inspectionContext) {
        const storageKey = `web_unit_inspection_${inspectionContext.propertyId}_${inspectionContext.buildingId}`
        const raw = localStorage.getItem(storageKey)
        if (raw) {
          const state = JSON.parse(raw)
          const unit = state.units?.find((u: any) => u.unitName === inspectionContext.unitName)
          if (unit) {
            unit.completed = true
            unit.completedAt = new Date().toISOString()
            state.lastUpdated = new Date().toISOString()
            localStorage.setItem(storageKey, JSON.stringify(state))
          }
        }
      }

      const token = localStorage.getItem('token')
      const storedData = localStorage.getItem('currentInspectionData');
      const storedProperty = localStorage.getItem('currentInspectionProperty');

      if (!storedData || !storedProperty) {
        console.log('No inspection data to save');
        return null;
      }

      const inspectionData = JSON.parse(storedData);
      const propertyData = JSON.parse(storedProperty);

      // Update or create inspection record as completed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspections/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: propertyData._id,
          inspectionData: {
            ...inspectionData,
            status: 'in-progress',
            completedAt: new Date().toISOString(),
            pdfExported: true
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inspection marked as completed:', data);
        if (!silentToast) {
          toast.success("Inspection saved and marked as completed!", { position: "top-right" });
        }
        return returnInspection ? (data?.inspection || null) : null;
      } else {
        console.error('Failed to mark inspection as completed');
        return null;
      }
    } catch (error) {
      console.error('Error marking inspection as completed:', error);
      // Don't show error to user as PDF was still downloaded successfully
      return null;
    }
  }

  // Get severity badge styling
  const getSeverityBadgeClass = (severity: DeficiencySeverity): string => {
    const classes: Record<DeficiencySeverity, string> = {
      'Life-Threatening': 'bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold shadow-sm',
      'Severe': 'bg-amber-50 text-amber-700 border border-amber-100 rounded-xl font-bold shadow-sm',
      'Moderate': 'bg-sky-50 text-sky-700 border border-sky-100 rounded-xl font-bold shadow-sm',
      'Low': 'bg-slate-50 text-slate-705 border border-slate-200 rounded-xl font-bold shadow-sm',
    }
    return classes[severity] || 'bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold shadow-sm'
  }

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      'Open': 'bg-rose-50 text-rose-700 border border-rose-100/60 rounded-xl font-bold px-2 py-1',
      'In Progress': 'bg-amber-50 text-amber-800 border border-amber-100/60 rounded-xl font-bold px-2 py-1',
      'Resolved': 'bg-emerald-50 text-emerald-700 border border-emerald-100/60 rounded-xl font-bold px-2 py-1',
      'Verified': 'bg-sky-50 text-sky-700 border border-sky-100/60 rounded-xl font-bold px-2 py-1',
    }
    return classes[status] || 'bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold px-2 py-1'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-lexend">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-600 border-t-transparent mx-auto"></div>
            <p className="text-slate-500 text-sm font-semibold">Loading inspection summary...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-lexend p-6">
          <div className="text-center space-y-4">
            <p className="text-slate-600 font-bold">No inspection data found</p>
            <Button 
              onClick={() => router.push('/dashboard/my-inspection')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl border-0 shadow-sm shadow-teal-600/10 text-xs sm:text-sm"
            >
              Back to Inspections
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gradient tracking-tight">
                  {searchParams.get('finalize') === 'true' ? 'HUD NSPIRE Inspection Report' : 'HUD NSPIRE Inspection Progress'}
                </h1>
              </div>
              <p className="text-slate-700 text-sm sm:text-base font-extrabold">{report.metadata.propertyName}</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">{report.metadata.propertyAddress}</p>
              <p className="text-xs text-slate-400 font-bold mt-1">
                Inspection #{report.metadata.inspectionNo} | {report.metadata.startDate}
              </p>
              {inspectionContext?.unitName && (
                <p className="text-xs sm:text-sm font-bold text-teal-600 mt-1">
                  {buildingColumnHeader}: {inspectionContext.buildingId} &rarr; {inspectionContext.unitName}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {checkingUnlock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-450 border-t-transparent"></span>
                    Checking report access...
                  </span>
                ) : isReportUnlocked ? (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
                    <Unlock className="w-3.5 h-3.5" />
                    Report Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm">
                    <Lock className="w-3.5 h-3.5" />
                    Report Locked
                  </span>
                )}

                {!checkingUnlock && !isReportUnlocked && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-250 mt-4 w-full">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100/80 text-amber-700 rounded-xl flex-shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                          REPORT LOCKED
                        </h3>
                        <p className="text-xs text-amber-700 font-semibold mt-0.5">Pay once to unlock full export access</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={() => setShowUnlockSummaryModal(true)}
                        disabled={purchasingUnlock}
                        className="h-11 gap-1.5 bg-amber-500 hover:bg-amber-600 px-5 text-xs font-bold text-white rounded-xl border-0 shadow-sm shadow-amber-600/10 flex items-center justify-center shrink-0"
                      >
                        <Lock className="w-4 h-4" />
                        {purchasingUnlock ? 'Redirecting...' : 'Unlock Report - $49'}
                      </Button>
                      <Button
                        onClick={() => setShowReportPreview(true)}
                        variant="outline"
                        className="h-11 gap-1.5 border-2 border-amber-500 hover:bg-amber-50 text-amber-600 font-bold px-5 rounded-xl text-xs flex items-center justify-center shrink-0 bg-white"
                      >
                        <FileText className="w-4 h-4" />
                        View Summary
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button
                onClick={handleExportPDF}
                disabled={exporting || checkingUnlock || purchasingUnlock}
                className={`font-bold px-5 py-2.5 rounded-xl border-0 shadow-sm text-xs flex items-center justify-center gap-1.5 ${
                  isReportUnlocked
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10'
                    : 'bg-gray-200 hover:bg-amber-500 hover:text-white text-gray-500 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                {exporting ? 'Generating...' : isReportUnlocked ? 'Export PDF' : 'Unlock to Export'}
              </Button>
              <Button
                onClick={handleExportExcel}
                disabled={exportingExcel || checkingUnlock || purchasingUnlock}
                className={`font-bold px-5 py-2.5 rounded-xl border-0 shadow-sm text-xs flex items-center justify-center gap-1.5 ${
                  isReportUnlocked
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                    : 'bg-gray-200 hover:bg-amber-500 hover:text-white text-gray-500 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                {exportingExcel ? 'Generating...' : isReportUnlocked ? 'Export Excel' : 'Unlock to Export Excel'}
              </Button>
              <Button
                onClick={handleBackToInspection}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl border-0 shadow-sm shadow-amber-600/10 text-xs flex items-center justify-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                {searchParams.get('finalize') === 'true' ? 'Back to Inspection' : 'Continue Inspection'}
              </Button>
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 shadow-sm text-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            <div className="py-2 sm:py-0">
              <p className="text-[10px] font-bold text-teal-100 uppercase tracking-wider mb-1">Preliminary Score</p>
              <p className="text-3xl sm:text-4xl font-extrabold">{report.metadata.preliminaryScore}</p>
            </div>
            <div className="py-2 sm:py-0">
              <p className="text-[10px] font-bold text-teal-100 uppercase tracking-wider mb-1">Calculated Score</p>
              <p className="text-3xl sm:text-4xl font-extrabold">{report.metadata.calculatedScore}</p>
            </div>
            <div className="py-2 sm:py-0">
              <p className="text-[10px] font-bold text-teal-100 uppercase tracking-wider mb-1">Final Score</p>
              <p className="text-3xl sm:text-4xl font-extrabold">{report.metadata.finalScore}</p>
              <p className="text-xs font-bold text-teal-200 mt-1.5 flex items-center justify-center gap-1">
                {report.metadata.finalScore >= 60 ? (
                  <span className="bg-emerald-500/35 border border-emerald-450 px-2 py-0.5 rounded-md">✓ Passing</span>
                ) : (
                  <span className="bg-rose-500/35 border border-rose-450 px-2 py-0.5 rounded-md">✗ Below Threshold</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none">
          {(['summary', 'deficiencies'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-sm flex-1 text-center ${activeTab === tab
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary Tab */}
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Deficiency Summary */}
              <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Deficiency Summary</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                  <div className="bg-rose-50/50 border-l-4 border-l-rose-500 border border-rose-100 rounded-r-2xl p-4 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-rose-700">{report.summary.lifeThreatening}</p>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mt-0.5">Life-Threat</p>
                  </div>
                  <div className="bg-amber-50/50 border-l-4 border-l-amber-500 border border-amber-100 rounded-r-2xl p-4 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-amber-700">{report.summary.severe}</p>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">Severe</p>
                  </div>
                  <div className="bg-sky-50/50 border-l-4 border-l-sky-500 border border-sky-100 rounded-r-2xl p-4 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-sky-700">{report.summary.moderate}</p>
                    <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">Moderate</p>
                  </div>
                  <div className="bg-slate-50 border-l-4 border-l-slate-400 border border-slate-200 rounded-r-2xl p-4 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-slate-700">{report.summary.low}</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">Low</p>
                  </div>
                  <div className="bg-teal-50/50 border-l-4 border-l-teal-600 border border-teal-100 rounded-r-2xl p-4 text-center shadow-sm">
                    <p className="text-3xl font-extrabold text-teal-700">{report.summary.total}</p>
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mt-0.5">Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl text-center shadow-sm">
                    <p className="text-2xl font-extrabold text-amber-800">{report.summary.repeatDeficiencies}</p>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">Repeat Deficiencies</p>
                  </div>
                  <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-2xl text-center shadow-sm">
                    <p className="text-2xl font-extrabold text-sky-800">{report.summary.newDeficiencies}</p>
                    <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">New Deficiencies</p>
                  </div>
                </div>
              </Card>

              {/* Property & Occupancy Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Property Information</h2>
                  </div>
                  <div className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-450 font-semibold text-xs uppercase tracking-wider">Property Name</span>
                      <span className="font-extrabold text-slate-800">{report.metadata.propertyName}</span>
                    </div>
                    <div className="flex justify-between py-2.5 gap-4">
                      <span className="text-slate-450 font-semibold text-xs uppercase tracking-wider">Address</span>
                      <span className="font-extrabold text-slate-800 text-right">{report.metadata.propertyAddress}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-450 font-semibold text-xs uppercase tracking-wider">Property ID</span>
                      <span className="font-extrabold text-slate-800">{report.metadata.propertyId}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-450 font-semibold text-xs uppercase tracking-wider">Inspector</span>
                      <span className="font-extrabold text-slate-800">{report.metadata.inspectorName}</span>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Occupancy Information</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-slate-800">{report.occupancyInfo.totalUnits}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Units</p>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-emerald-700">{report.occupancyInfo.occupiedUnits}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Occupied</p>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-rose-700">{report.occupancyInfo.vacantUnits}</p>
                      <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mt-0.5">Vacant</p>
                    </div>
                    <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-2xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-sky-700">{report.occupancyInfo.occupancyRate.toFixed(0)}%</p>
                      <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">Occupancy Rate</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Inspection Data Table */}
              <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Inspection Data Breakdown</h2>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-705 font-bold border-b border-slate-200">
                        <th className="text-left p-4">Type</th>
                        <th className="text-center p-4">Property Total</th>
                        <th className="text-center p-4">Sample Size</th>
                        <th className="text-center p-4">Units Inspected</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-medium text-slate-700">
                      {report.inspectionData.map((row, index) => (
                        <tr key={index} className="hover:bg-slate-50/40">
                          <td className="p-4 font-extrabold text-slate-800">{row.type}</td>
                          <td className="p-4 text-center">{row.propertyTotal}</td>
                          <td className="p-4 text-center">{row.sampleSize}</td>
                          <td className="p-4 text-center">{row.totalUnitsInspected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {report.inspectionData.map((row, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <div className="font-extrabold text-slate-800 text-sm">{row.type}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Property Total</div>
                          <div className="font-extrabold text-slate-700 mt-0.5">{row.propertyTotal}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Sample Size</div>
                          <div className="font-extrabold text-slate-700 mt-0.5">{row.sampleSize}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Inspected</div>
                          <div className="font-extrabold text-slate-700 mt-0.5">{row.totalUnitsInspected}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Deficiencies Tab */}
          {activeTab === 'deficiencies' && (
            <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Deficiency Details</h2>
              </div>

              {!checkingUnlock && !isReportUnlocked && report.deficiencies.length > visibleDeficiencies.length && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs sm:text-sm text-amber-900 font-semibold shadow-sm leading-relaxed">
                  <span className="text-sm font-extrabold block mb-1">Unlock to Export PDF</span>
                  <span className="italic">Locked preview:</span> showing {visibleDeficiencies.length} of {report.deficiencies.length} deficiencies. Unlock for $99.00 to view all items and export full PDF.
                </div>
              )}

              {/* Unit header banner */}
              {inspectionContext?.unitName && (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4 border border-teal-100/80 shadow-sm text-teal-800">
                  <h3 className="text-sm font-extrabold tracking-tight">
                    {inspectionContext.unitName} — Inspection Details
                  </h3>
                  <p className="text-[10px] text-teal-600 font-bold mt-0.5">{buildingColumnHeader}: {inspectionContext.buildingId}</p>
                </div>
              )}

              {report.deficiencies.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-emerald-800">No Deficiencies Found</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1">This property passed inspection with no issues identified.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Group by Area (Outside, Inside, Unit) */}
                  {['Outside', 'Inside', 'Unit', 'General'].map(area => {
                    const areaDeficiencies = visibleDeficiencies.filter(d => d.area === area);
                    if (areaDeficiencies.length === 0) return null;

                    return (
                      <div key={area} className="space-y-4">
                        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl w-fit font-extrabold text-xs">
                          <span className="text-slate-550 uppercase tracking-wider">{area} Summary</span>
                          <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {areaDeficiencies.length}
                          </span>
                        </div>
                        
                        {/* Desktop Table View for this Area */}
                        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-100">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-50 text-slate-705 font-bold border-b border-slate-200">
                                <th className="p-3 text-left w-12">#</th>
                                <th className="p-3 text-center w-24">Proof</th>
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-left">Deficiency</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-center">Severity</th>
                                <th className="p-3 text-center">H&S</th>
                                <th className="p-3 text-center">Repair By</th>
                                <th className="p-3 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150 text-xs font-semibold text-slate-700">
                              {areaDeficiencies.map((def, idx) => (
                                <tr key={def.id} className="hover:bg-slate-50/40">
                                  <td className="p-3 font-bold text-center text-slate-400">{idx + 1}</td>
                                  <td className="p-3 text-center">
                                    {def.imageUri ? (
                                      <div className="relative w-14 h-14 mx-auto group">
                                        <img
                                          src={def.imageUri}
                                          alt="Deficiency Proof"
                                          className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm cursor-zoom-in group-hover:scale-150 transition-transform z-10 relative"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-14 h-14 mx-auto bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center text-slate-350">
                                        <ImageIcon className="w-5 h-5" />
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3 min-w-[120px]">
                                    <div className="space-y-0.5">
                                      {area === 'Unit' && (
                                        <>
                                          <div><span className="text-slate-400 font-bold">Bldg:</span> <span className="font-extrabold text-slate-700">{def.building}</span></div>
                                          <div><span className="text-slate-400 font-bold">Unit:</span> <span className="font-extrabold text-slate-700">{def.unit}</span></div>
                                        </>
                                      )}
                                      {area !== 'Unit' && (
                                        <div><span className="text-slate-400 font-bold">Loc:</span> <span className="font-extrabold text-slate-700">{def.building}</span></div>
                                      )}
                                      <div><span className="text-slate-400 font-bold">Area:</span> <span className="font-extrabold text-slate-700">{def.room}</span></div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="font-extrabold text-slate-800 text-sm mb-1">{def.deficiencyName}</div>
                                    <span className="inline-block bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">
                                      {def.nspireCode}
                                    </span>
                                  </td>
                                  <td className="p-3 max-w-[250px] leading-relaxed">
                                    <div className="text-slate-600 text-xs mb-2">{def.deficiencyDetails}</div>
                                    {def.comments && (
                                      <div className="text-[10px] text-slate-500 italic bg-slate-50 border border-slate-100 p-2 rounded-xl">
                                        <span className="font-extrabold uppercase text-[8px] text-slate-400 block mb-0.5">Inspector Notes:</span>
                                        {def.comments}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className={`inline-block px-2.5 py-1 text-[10px] ${getSeverityBadgeClass(def.severity)}`}>
                                      {def.severity}
                                    </span>
                                    <div className="text-[10px] text-slate-400 mt-1 font-bold">-{def.deductionPts} PTS</div>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="text-[10px] font-extrabold text-rose-600 uppercase">{def.healthAndSafety}</span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="inline-block bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-xl">
                                      {def.repairTimeline}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className={`inline-block ${getStatusBadgeClass(def.status)}`}>
                                      {def.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile View for this Area */}
                        <div className="lg:hidden space-y-4">
                          {areaDeficiencies.map((def, idx) => (
                            <div key={def.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 shadow-sm space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                                  {idx + 1}
                                </div>
                                {def.imageUri ? (
                                  <img
                                    src={def.imageUri}
                                    alt="Deficiency Proof"
                                    className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-350 border border-slate-150">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-extrabold text-slate-900 text-sm mb-1 break-words leading-tight">{def.deficiencyName}</h3>
                                  <div className="flex flex-wrap gap-1">
                                    <span className="inline-block bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">
                                      {def.nspireCode}
                                    </span>
                                    <span className={`inline-block px-2 py-0.5 text-[10px] ${getSeverityBadgeClass(def.severity)}`}>
                                      {def.severity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-slate-200/60 text-xs font-semibold space-y-2">
                                 <p className="text-slate-650 leading-relaxed">{def.deficiencyDetails}</p>
                                 <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-450">
                                    <div><span className="font-bold text-slate-500">Location:</span> {def.building} {def.unit !== '-' ? `| Unit ${def.unit}` : ''}</div>
                                    <div><span className="font-bold text-slate-500">Room:</span> {def.room}</div>
                                    <div><span className="font-bold text-slate-500">Repair By:</span> {def.repairTimeline}</div>
                                    <div><span className="font-bold text-slate-500">Status:</span> <span className="text-slate-700 font-extrabold">{def.status}</span></div>
                                 </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}

          {/* General Comments */}
          {report.generalComments && (
            <div className="bg-white border border-slate-200/80 border-l-4 border-l-teal-600 rounded-2xl p-6 shadow-sm mt-6">
              <h3 className="font-extrabold text-teal-800 text-sm uppercase tracking-wider mb-2">General Comments</h3>
              <p className="text-slate-650 text-sm font-semibold leading-relaxed">{report.generalComments}</p>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="bg-white border border-slate-200/80 border-l-4 border-l-emerald-600 rounded-2xl p-6 shadow-sm mt-6">
              <h3 className="font-extrabold text-emerald-800 text-sm uppercase tracking-wider mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-650 text-sm font-semibold">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 mb-12">
            <Button
              onClick={handleBackToInspection}
              className="px-10 py-3.5 w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm border-0"
            >
              <ChevronLeft className="w-5 h-5" />
              BACK TO INSPECTION
            </Button>
            <Button
              onClick={() => router.push('/dashboard/my-inspection')}
              variant="outline"
              className="px-10 py-3.5 w-full sm:w-auto border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm text-xs sm:text-sm"
            >
              MY INSPECTIONS
            </Button>
          </div>
          {showSummaryModal && (
            <SummaryModal
              isOpen={showSummaryModal}
              onClose={() => setShowSummaryModal(false)}
              hideFullReportButton={true}
              propertyData={property || {
                name: report.metadata.propertyName,
                propertyName: report.metadata.propertyName,
                address: report.metadata.propertyAddress,
                _id: report.metadata.propertyId
              }}
            />
          )}

          {showUnlockSummaryModal && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setShowUnlockSummaryModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-lg font-bold text-[#006795]">Deficiency Summary</h2>
                  <button
                    onClick={() => setShowUnlockSummaryModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-5">
                  <div className="bg-[#E8F4F8] border border-[#006795]/10 rounded-2xl p-4">
                    <p className="font-bold text-[#006795]">{report.metadata.propertyName}</p>
                    <p className="text-sm text-gray-600">{report.metadata.propertyAddress}</p>
                    <p className="text-xs text-gray-500 mt-1">Inspection #{report.metadata.inspectionNo}</p>
                  </div>

                  <div>
                    <p className="font-bold text-[#006795] mb-3">Deficiency Breakdown</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-l-4 border-rose-500 bg-rose-50 rounded-r-xl p-3 text-center">
                        <p className="text-2xl font-black text-rose-600">{report.summary.lifeThreatening}</p>
                        <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mt-0.5">Life-Threat</p>
                      </div>
                      <div className="border-l-4 border-orange-500 bg-orange-50 rounded-r-xl p-3 text-center">
                        <p className="text-2xl font-black text-orange-600">{report.summary.severe}</p>
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-0.5">Severe</p>
                      </div>
                      <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-3 text-center">
                        <p className="text-2xl font-black text-blue-600">{report.summary.moderate}</p>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">Moderate</p>
                      </div>
                      <div className="border-l-4 border-gray-400 bg-gray-50 rounded-r-xl p-3 text-center">
                        <p className="text-2xl font-black text-gray-600">{report.summary.low}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Low</p>
                      </div>
                      <div className="border-l-4 border-emerald-500 bg-emerald-50 rounded-r-xl p-3 text-center">
                        <p className="text-2xl font-black text-emerald-600">{report.summary.total}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Total</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-amber-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-black text-amber-600">{report.summary.repeatDeficiencies}</p>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">Repeat</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-black text-blue-600">{report.summary.newDeficiencies}</p>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">New</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#006795] to-[#0a5670] rounded-2xl p-4 text-white">
                    <p className="font-bold mb-3">Inspection Score</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/70">Preliminary</p>
                        <p className="text-2xl font-black">{report.metadata.preliminaryScore}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/70">Calculated</p>
                        <p className="text-2xl font-black">{report.metadata.calculatedScore}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/70">Final Score</p>
                        <p className="text-2xl font-black">{report.metadata.finalScore}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Get Full Report via Email
                    </p>
                    <p className="text-xs text-amber-700 mb-3">Enter your email to receive the complete inspection report with all deficiency details, photos, and recommendations.</p>
                    <input
                      type="email"
                      value={fullReportEmail}
                      onChange={(e) => setFullReportEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSendFullReportLink}
                        disabled={purchasingUnlock}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl border-0"
                      >
                        {purchasingUnlock ? 'Redirecting...' : 'Send Full Report Link'}
                      </Button>
                      <Button
                        onClick={() => setShowUnlockSummaryModal(false)}
                        variant="outline"
                        className="border border-gray-300 text-gray-600 font-bold rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 flex items-start gap-2">
                    <span>💡</span>
                    <span><span className="font-bold">Note:</span> The full report includes detailed photos, inspector comments, repair timelines, and compliance codes for each deficiency.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showReportPreview && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setShowReportPreview(false)}
            >
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-lg font-bold text-[#006795]">Report PDF Preview</h2>
                  <button
                    onClick={() => setShowReportPreview(false)}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

