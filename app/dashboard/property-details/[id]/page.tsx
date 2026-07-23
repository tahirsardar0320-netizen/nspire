"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { propertiesAPI, authAPI, inspectionsAPI } from "@/lib/api"
import { toast } from "react-toastify"
import { ChevronLeft, CheckCircle2, Clock, X, ChevronRight, Pencil, Check, RefreshCw } from "lucide-react"
import { generateRandomUnitSample, getUnitsToInspect, getSamplingExplanation } from "@/lib/unitSamplingService"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// ---- Unit inspection state persistence (localStorage) ----
interface UnitStatus {
    unitName: string
    completed: boolean
    completedAt?: string
}

interface BuildingInspectionState {
    propertyId: string
    buildingId: string
    units: UnitStatus[]
    lastUpdated: string
}

const STORAGE_PREFIX = 'web_unit_inspection_'

function getStorageKey(propertyId: string, buildingId: string) {
    return `${STORAGE_PREFIX}${propertyId}_${buildingId}`
}

function loadBuildingState(propertyId: string, buildingId: string): BuildingInspectionState | null {
    try {
        const raw = localStorage.getItem(getStorageKey(propertyId, buildingId))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

function saveBuildingState(state: BuildingInspectionState) {
    localStorage.setItem(getStorageKey(state.propertyId, state.buildingId), JSON.stringify(state))
}

function initBuildingState(propertyId: string, buildingId: string, unitNames: string[]): BuildingInspectionState {
    const existing = loadBuildingState(propertyId, buildingId)
    const units: UnitStatus[] = unitNames.map(name => {
        const prev = existing?.units.find(u => u.unitName === name)
        return prev || { unitName: name, completed: false }
    })
    const state: BuildingInspectionState = { propertyId, buildingId, units, lastUpdated: new Date().toISOString() }
    saveBuildingState(state)
    return state
}

function markUnitCompleted(propertyId: string, buildingId: string, unitName: string) {
    const state = loadBuildingState(propertyId, buildingId)
    if (!state) return
    const unit = state.units.find(u => u.unitName === unitName)
    if (unit) {
        unit.completed = true
        unit.completedAt = new Date().toISOString()
    }
    state.lastUpdated = new Date().toISOString()
    saveBuildingState(state)
}

function getCompletedUnits(propertyId: string, buildingId: string): string[] {
    const state = loadBuildingState(propertyId, buildingId)
    return state?.units.filter(u => u.completed).map(u => u.unitName) || []
}

// Generate unit names for a building
function generateUnitNames(buildingId: string, count: number): string[] {
    const names: string[] = []
    for (let i = 1; i <= count; i++) {
        names.push(`Unit ${String(i).padStart(3, '0')}`)
    }
    return names
}

export default function PropertyDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = params.id as string
    const [property, setProperty] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)

    // Unit selection popup state
    const [unitPopupOpen, setUnitPopupOpen] = useState(false)
    const [selectedBuilding, setSelectedBuilding] = useState<{ buildingId: string; totalUnits: number; unitsForInspection: number } | null>(null)
    const [completedUnitsMap, setCompletedUnitsMap] = useState<Record<string, string[]>>({})

    // Editable inspection units per building
    const [editableInspectionUnits, setEditableInspectionUnits] = useState<Record<string, number>>({})


    // CRITICAL: Clear stale inspection data if navigating to a different property
    useEffect(() => {
        if (!id) return;
        const storedDataRaw = localStorage.getItem('currentInspectionData');
        if (storedDataRaw) {
            try {
                const data = JSON.parse(storedDataRaw);
                const storageId = data.propertyId || data.inspectionId;
                if (storageId && storageId !== id) {
                    console.log('Detected property change. Clearing stale local inspection data.');
                    localStorage.removeItem('currentInspectionData');
                    localStorage.removeItem('currentInspectionProperty');
                    localStorage.removeItem('currentInspectionUnit');
                    // Also clear specific OD form snapshots to be thorough
                    setCompletedUnitsMap({});
                }
            } catch (e) {}
        }
    }, [id]);

    // Editable column header name
    const [columnHeaderName, setColumnHeaderName] = useState('Building Unique ID')
    const [editColumnHeaderOpen, setEditColumnHeaderOpen] = useState(false)
    const [tempColumnHeaderName, setTempColumnHeaderName] = useState('Building Unique ID')
    const columnHeaderInputRef = useRef<HTMLInputElement>(null)

    // Editable building names (B1 → custom label)
    const [editableBuildingNames, setEditableBuildingNames] = useState<Record<string, string>>({})
    const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null)
    const [tempBuildingName, setTempBuildingName] = useState('')
    const buildingNameInputRef = useRef<HTMLInputElement>(null)

    // Coverage params from query string or localStorage fallback
    const coverage = useMemo(() => {
        if (typeof window !== 'undefined') {
            const queryCoverage = searchParams.get('coverage')
            if (queryCoverage) return queryCoverage
            const saved = localStorage.getItem(`property_coverage_${id}`)
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    if (parsed && parsed.coverage) return parsed.coverage
                } catch (e) {}
            }
        }
        return searchParams.get('coverage') || '100'
    }, [searchParams, id])

    const calculatedUnitsParam = useMemo(() => {
        if (typeof window !== 'undefined') {
            const queryUnits = searchParams.get('calculatedUnits')
            if (queryUnits) return parseInt(queryUnits)
            const saved = localStorage.getItem(`property_coverage_${id}`)
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    if (parsed && parsed.calculatedUnits) return parseInt(parsed.calculatedUnits)
                } catch (e) {}
            }
        }
        const param = searchParams.get('calculatedUnits')
        return param ? parseInt(param) : 0
    }, [searchParams, id])

    // Load column header name from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(`buildingColHeader_${id}`)
        if (saved) setColumnHeaderName(saved)
        const savedNames = localStorage.getItem(`buildingNames_${id}`)
        if (savedNames) { try { setEditableBuildingNames(JSON.parse(savedNames)) } catch {} }
    }, [id])

    // Focus input when edit modal opens
    useEffect(() => {
        if (editColumnHeaderOpen) {
            setTimeout(() => columnHeaderInputRef.current?.focus(), 50)
        }
    }, [editColumnHeaderOpen])

    const handleSaveColumnHeader = () => {
        const name = tempColumnHeaderName.trim() || 'Building Unique ID'
        setColumnHeaderName(name)
        localStorage.setItem(`buildingColHeader_${id}`, name)
        setEditColumnHeaderOpen(false)
        toast.success('Column name updated!', { position: 'top-right', autoClose: 1500 })
    }

    const handleStartBuildingEdit = (buildingId: string) => {
        setTempBuildingName(editableBuildingNames[buildingId] || buildingId)
        setEditingBuildingId(buildingId)
        setTimeout(() => buildingNameInputRef.current?.focus(), 30)
    }

    const handleSaveBuildingName = (buildingId: string) => {
        const newName = tempBuildingName.trim() || buildingId
        const updated = { ...editableBuildingNames, [buildingId]: newName }
        setEditableBuildingNames(updated)
        localStorage.setItem(`buildingNames_${id}`, JSON.stringify(updated))
        setEditingBuildingId(null)
    }

    const getBuildingDisplayName = (buildingId: string) =>
        editableBuildingNames[buildingId] || buildingId

    useEffect(() => {
        if (id) {
            fetchData()
        }
    }, [id])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [propRes, userRes] = await Promise.all([
                propertiesAPI.getById(id),
                authAPI.getMe()
            ])

            if (propRes.success) {
                setProperty(propRes.property)
            }
            if (userRes.success) {
                setUser(userRes.user)
            }
        } catch (error: any) {
            console.error('Error fetching data:', error)
            toast.error("Failed to load details")
        } finally {
            setLoading(false)
        }
    }

    // Total inspection units (fixed, must not change)
    const totalInspectionUnits = useMemo(() => {
        if (!property) return 0
        return calculatedUnitsParam || property.units || 1
    }, [property, calculatedUnitsParam])

    // Calculate initial buildings with unit distribution
    const initialBuildings = useMemo(() => {
        if (!property) return []

        const totalBuildings = property.buildings || 1
        const totalUnits = property.units || 1
        const unitsToInspect = calculatedUnitsParam || totalUnits

        // Distribute total units across buildings
        const baseTotalPerBuilding = Math.floor(totalUnits / totalBuildings)
        const remainderTotal = totalUnits % totalBuildings

        // Distribute inspection units across buildings
        const baseInspectionPerBuilding = Math.floor(unitsToInspect / totalBuildings)
        const remainderInspection = unitsToInspect % totalBuildings

        const rows = []
        for (let i = 0; i < totalBuildings; i++) {
            rows.push({
                buildingId: `B${i + 1}`,
                totalUnits: baseTotalPerBuilding + (i < remainderTotal ? 1 : 0),
                unitsForInspection: baseInspectionPerBuilding + (i < remainderInspection ? 1 : 0),
            })
        }
        return rows
    }, [property, calculatedUnitsParam])

    // Initialize editable inspection units from computed defaults
    useEffect(() => {
        if (initialBuildings.length > 0 && Object.keys(editableInspectionUnits).length === 0) {
            const map: Record<string, number> = {}
            initialBuildings.forEach(b => {
                map[b.buildingId] = b.unitsForInspection
            })
            setEditableInspectionUnits(map)
        }
    }, [initialBuildings])

    // Final buildings array that uses editable inspection units
    const buildings = useMemo(() => {
        return initialBuildings.map(b => ({
            ...b,
            unitsForInspection: editableInspectionUnits[b.buildingId] ?? b.unitsForInspection,
        }))
    }, [initialBuildings, editableInspectionUnits])

    const overallProgress = useMemo(() => {
        if (!buildings.length) return 0
        
        let totalPossible = 0
        let totalCompleted = 0
        
        buildings.forEach(b => {
            // Each building has:
            // 1) Inside category
            // 2) Outside category
            // 3) N units
            const possible = 2 + b.unitsForInspection
            totalPossible += possible
            
            const completed = completedUnitsMap[b.buildingId] || []
            const hasOutside = completed.includes('Outside')
            const hasInside = completed.includes('Inside')
            const unitsDone = completed.filter(u => u !== 'Outside' && u !== 'Inside').length
            
            totalCompleted += (hasOutside ? 1 : 0) + (hasInside ? 1 : 0) + Math.min(unitsDone, b.unitsForInspection)
        })
        
        if (totalPossible === 0) return 0
        return Math.round((totalCompleted / totalPossible) * 100)
    }, [buildings, completedUnitsMap])

    // Handler: when user edits a building's unit-for-inspection value
    const handleInspectionUnitChange = (buildingId: string, newValue: number) => {
        const totalBuildings = initialBuildings.length
        if (totalBuildings === 0) return

        const building = initialBuildings.find(b => b.buildingId === buildingId)
        if (!building) return

        // Clamp: min 0, max = total inspection units (user can assign all to one building)
        const clampedValue = Math.max(0, Math.min(newValue, totalInspectionUnits))

        // Current editable map
        const currentMap = { ...editableInspectionUnits }
        const oldValue = currentMap[buildingId] ?? building.unitsForInspection
        const delta = clampedValue - oldValue

        if (delta === 0) return

        // Set new value for this building
        currentMap[buildingId] = clampedValue

        // Redistribute the delta across other buildings to maintain the total
        let remaining = -delta // amount we need to distribute to others
        const otherBuildingIds = initialBuildings
            .filter(b => b.buildingId !== buildingId)
            .map(b => b.buildingId)

        // Sort buildings: when reducing others (delta > 0), take from those with the most first
        // When adding to others (delta < 0), give to those with the least first
        if (remaining > 0) {
            // Need to add units to other buildings (current building was reduced)
            otherBuildingIds.sort((a, b) => (currentMap[a] ?? 0) - (currentMap[b] ?? 0))
        } else {
            // Need to remove units from other buildings (current building was increased)
            otherBuildingIds.sort((a, b) => (currentMap[b] ?? 0) - (currentMap[a] ?? 0))
        }

        for (const otherId of otherBuildingIds) {
            if (remaining === 0) break
            const otherBuilding = initialBuildings.find(b => b.buildingId === otherId)!
            const otherCurrent = currentMap[otherId] ?? otherBuilding.unitsForInspection

            if (remaining > 0) {
                // Add units: no upper cap (inspection units can exceed building's default total)
                const toAdd = remaining
                currentMap[otherId] = otherCurrent + toAdd
                remaining -= toAdd
            } else {
                // Remove units: cap at 0 (can't go negative)
                const maxCanRemove = otherCurrent
                const toRemove = Math.min(-remaining, maxCanRemove)
                currentMap[otherId] = otherCurrent - toRemove
                remaining += toRemove
            }
        }

        // If we couldn't fully redistribute (edge case), revert the change
        if (remaining !== 0) {
            toast.error("Cannot redistribute units: some buildings would exceed their limits", { position: "top-right" })
            return
        }

        setEditableInspectionUnits(currentMap)
    }

    // Load completed units for all buildings — reads the same progress records
    // (API + local cache) that the inspection-category page actually writes to,
    // so this summary stays in sync with the live inspection progress.
    const refreshCompletedUnits = useCallback(async () => {
        if (!property || buildings.length === 0) return
        const propId = property._id || id
        const map: Record<string, string[]> = {}

        for (const b of buildings) {
            let records: any[] = []
            try {
                const res = await inspectionsAPI.getProgress({ property_id: propId, building_id: b.buildingId })
                if (res && Array.isArray(res.progress)) records = res.progress
            } catch (error) {
                console.error("Error fetching progress from API:", error)
            }

            // Merge in the local cache the inspection-category page writes to,
            // so progress still shows up even when the backend is unreachable.
            try {
                const cached = localStorage.getItem(`cached_progress_${propId}_${b.buildingId}`)
                if (cached) {
                    const cachedList = JSON.parse(cached)
                    if (Array.isArray(cachedList)) records = [...records, ...cachedList]
                }
            } catch (e) {}

            const completed: string[] = []
            const outsideRec = records.find((p: any) => p.inspectionType === 'Outside')
            const insideRec = records.find((p: any) => p.inspectionType === 'Inside')
            if (outsideRec?.inspectionData?.isComplete) completed.push('Outside')
            if (insideRec?.inspectionData?.isComplete) completed.push('Inside')

            const seenUnits = new Set<string>()
            records.forEach((p: any) => {
                const type = String(p.inspectionType || '').toLowerCase()
                if (type.startsWith('unit_') && p.inspectionData?.isComplete && p.unitId && !seenUnits.has(p.unitId)) {
                    seenUnits.add(p.unitId)
                    completed.push(p.unitId)
                }
            })

            map[b.buildingId] = completed
        }

        setCompletedUnitsMap(map)
    }, [property, buildings, id])

    useEffect(() => {
        refreshCompletedUnits()
    }, [refreshCompletedUnits])

    // Also refresh when window regains focus (coming back from inspection)
    useEffect(() => {
        const handleFocus = () => refreshCompletedUnits()
        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [refreshCompletedUnits])

    // Check for returning from inspection (localStorage flag)
    useEffect(() => {
        const returnFlag = localStorage.getItem('inspectionReturnToProperty')
        if (returnFlag) {
            const data = JSON.parse(returnFlag)
            localStorage.removeItem('inspectionReturnToProperty')
            // Mark the unit as completed
            if (data.propertyId && data.buildingId && data.unitName) {
                markUnitCompleted(data.propertyId, data.buildingId, data.unitName)
                refreshCompletedUnits()
                toast.success(`${data.unitName} inspection completed!`, { position: "top-right" })
            }
        }
    }, [refreshCompletedUnits])

    const getCoverageLabel = () => {
        if (coverage === '100') return '100% - All Units'
        if (coverage === '50') return '50% - Half Units'
        if (coverage === 'random') return 'Random Sample'
        return '-'
    }

    const handleBuildingClick = (building: typeof buildings[0]) => {
        const propId = property._id || id
        // Store column header name so inspection-category can read it
        localStorage.setItem(`buildingColHeader_${propId}`, columnHeaderName)
        // Store custom building display name
        const displayName = getBuildingDisplayName(building.buildingId)
        localStorage.setItem(`buildingDisplayName_${propId}_${building.buildingId}`, displayName)
        router.push(
            `/dashboard/inspection-category/${propId}?building=${building.buildingId}&totalUnits=${building.unitsForInspection}&coverage=${coverage}`
        )
    }

    const handleStartUnitInspection = (buildingId: string, unitName: string) => {
        const propId = property._id || id
        const completed = completedUnitsMap[buildingId] || []

        if (completed.includes(unitName)) {
            // Unit already inspected - ask if they want to re-inspect
            if (!confirm(`${unitName} has already been inspected. Do you want to re-inspect it?`)) {
                return
            }
        }

        // Store context for the inspection flow
        localStorage.setItem('currentInspectionUnit', JSON.stringify({
            propertyId: propId,
            buildingId,
            unitName,
            propertyDetailsUrl: window.location.href
        }))

        toast.success(`Starting inspection for ${buildingId} → ${unitName}`, { position: "top-right" })
        router.push(`/dashboard/inspection-category/${property._id}?building=${buildingId}&unit=${encodeURIComponent(unitName)}&units=1`)
    }

    const getCompletedCount = (buildingId: string) => {
        const completed = completedUnitsMap[buildingId] || []
        // Return only the unit count for the progress column (X/Y)
        return completed.filter(u => u !== 'Outside' && u !== 'Inside').length
    }

    const isAllCompleted = (building: typeof buildings[0]) => {
        const completed = completedUnitsMap[building.buildingId] || []
        const hasOutside = completed.includes('Outside')
        const hasInside = completed.includes('Inside')
        const unitCompletedCount = getCompletedCount(building.buildingId)
        
        return hasOutside && hasInside && unitCompletedCount >= building.unitsForInspection && building.unitsForInspection > 0
    }

    const normalizeToken = (value: unknown): string => String(value ?? '').trim().toLowerCase()

    const looksLikeBuildingLabel = (value: unknown): boolean => {
        const label = String(value ?? '').trim()
        if (!label) return false
        return /^b\d+$/i.test(label) || /^building[\s_-]?[a-z0-9]+$/i.test(label)
    }

    const mapDraftDeficienciesToFindings = (items: any[] = [], fallbackBuilding = ''): any[] => {
        return items.map((f: any, idx: number) => {
            const areaToken = String(f?._area || f?.area || f?.category || f?.inspectionType || '').trim().toLowerCase()
            const resolvedArea = areaToken.includes('outside')
                ? 'Outside'
                : areaToken.includes('inside')
                    ? 'Inside'
                    : areaToken.includes('unit')
                        ? 'Unit'
                        : 'General'

            const resolvedBuilding = String(
                f?.buildingInspectionId ||
                f?.building_id ||
                f?.building ||
                f?.buildingName ||
                f?.buildingId ||
                (looksLikeBuildingLabel(f?.unit) ? f?.unit : '') ||
                (looksLikeBuildingLabel(f?._unit) ? f?._unit : '') ||
                fallbackBuilding ||
                'Building'
            ).trim() || 'Building'

            const unitCandidate = String(f?.unit || f?._unit || f?.unitId || '').trim()

            return {
                id: String(f?.id || f?._id || `draft-${idx + 1}`),
                title: f?.title || f?.deficiency?.name || f?.deficiencyName || 'Deficiency',
                deficiencyName: f?.deficiencyName || f?.deficiency?.name || f?.title || f?.name || 'Deficiency',
                deficiencyDetails:
                    f?.deficiencyDetails ||
                    f?.description ||
                    f?.detail ||
                    f?.deficiency?.detail ||
                    f?.title ||
                    f?.deficiency?.title ||
                    f?.name ||
                    f?.deficiency?.name ||
                    'Issue recorded',
                severity: f?.severity || f?.deficiency?.severity || f?.deficiency?.aiSeverity || 'Moderate',
                area: resolvedArea,
                category: resolvedArea,
                location: f?.location || f?.room || f?.itemName || f?.module || 'General',
                building: resolvedBuilding,
                unit: unitCandidate && !/^b\d+$/i.test(unitCandidate) ? unitCandidate : '-',
                imageUri:
                    f?.imageUri ||
                    f?.imageUrl ||
                    f?.deficiency?.imageUri ||
                    f?.deficiency?.imageUrl ||
                    f?.photos?.[0]?.url ||
                    '',
                nspireCode: f?.nspireCode || f?.deficiency?.code || '-',
                codeReference: f?.codeReference || f?.deficiency?.codeReference || '',
                comments: f?.comments || f?.note || f?.deficiency?.aiAnalysis || '',
                status: f?.status || 'Open',
                timestamp: f?.timestamp || new Date().toISOString(),
            }
        })
    }

    const dedupeFindings = (findings: any[]): any[] => {
        const deduped = new Map<string, any>()

        findings.forEach((finding) => {
            if (!finding) return

            // ONLY deduplicate by unique ID, or fallback to exact same item+title if missing ID
            const key = finding.id || [
                normalizeToken(finding?.building),
                normalizeToken(finding?.area),
                normalizeToken(finding?.unit),
                normalizeToken(finding?.deficiencyName),
            ].join('|')

            if (!deduped.has(key)) {
                deduped.set(key, finding)
            }
        })

        return Array.from(deduped.values())
    }

    const handleExportInProgress = async () => {
        if (!property) return

        setIsExporting(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                toast.error('Please login to export in-progress report.', { position: 'top-right' })
                router.push('/login')
                return
            }

            const propertyId = String(property?._id || id)
            const propertyTokenSet = new Set<string>([
                normalizeToken(property?._id),
                normalizeToken(property?.id),
                normalizeToken(property?.propertyId),
                normalizeToken(property?.name),
            ].filter(Boolean))

            let inspectorName = user?.fullName || 'Inspector'
            try {
                const me = await authAPI.getMe()
                if (me?.success && me?.user?.fullName) {
                    inspectorName = me.user.fullName
                }
            } catch {
                // Fallback to already loaded user name
            }

            const fetchProgress = async (queryParams: Record<string, string>) => {
                const query = new URLSearchParams(queryParams).toString()
                const response = await fetch(`${API_URL}/api/inspections/progress?${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Progress fetch failed (${response.status})`)
                }

                const data = await response.json()
                return Array.isArray(data?.progress) ? data.progress : []
            }

            let progressRecords: any[] = []
            let findings: any[] = []
            let notes = ''

            // 1) Mobile parity source: backend draft records first
            try {
                const draftProgress = await fetchProgress({
                    property_id: propertyId,
                    draft_only: 'true',
                    include_property: 'true',
                })

                progressRecords = draftProgress

                const latestDraft = draftProgress
                    .filter((record: any) => {
                        const inspectionType = String(record?.inspectionType || '')
                        if (!inspectionType.startsWith('REPORT_DRAFT_')) return false

                        const draftFindings = record?.inspectionData?.deficiencies || record?.inspectionData?.findings || []
                        if (!Array.isArray(draftFindings) || draftFindings.length === 0) return false

                        const recordTokens = [
                            normalizeToken(record?.propertyId?._id),
                            normalizeToken(record?.propertyId?.id),
                            normalizeToken(record?.propertyId?.propertyId),
                            normalizeToken(record?.propertyId),
                            normalizeToken(record?.inspectionData?.property?._id),
                            normalizeToken(record?.inspectionData?.property?.id),
                            normalizeToken(record?.inspectionData?.property?.propertyId),
                            normalizeToken(record?.inspectionData?.property?.name),
                            normalizeToken(record?.propertyId?.name),
                        ].filter(Boolean)

                        return recordTokens.some((tokenValue) => propertyTokenSet.has(tokenValue))
                    })
                    .sort((a: any, b: any) => {
                        const tA = Date.parse(String(a?.updatedAt || a?.createdAt || a?.inspectionData?.savedAt || 0))
                        const tB = Date.parse(String(b?.updatedAt || b?.createdAt || b?.inspectionData?.savedAt || 0))
                        return (Number.isFinite(tB) ? tB : 0) - (Number.isFinite(tA) ? tA : 0)
                    })[0]

                if (latestDraft) {
                    const rawDraftFindings = latestDraft?.inspectionData?.deficiencies || latestDraft?.inspectionData?.findings || []
                    findings = mapDraftDeficienciesToFindings(
                        rawDraftFindings,
                        String(latestDraft?.buildingId || latestDraft?.inspectionData?.buildingId || latestDraft?.unitId || '')
                    )
                    notes = String(latestDraft?.inspectionData?.notes || '')
                }
            } catch (error) {
                console.warn('Draft progress fetch failed:', error)
            }

            // 2) Local storage fallback removed per user request: summary is now strictly server-side


            // 3) Final fallback: non-draft progress records with answered responses
            if (findings.length === 0) {
                try {
                    const allProgress = progressRecords.length > 0
                        ? progressRecords
                        : await fetchProgress({ property_id: propertyId })

                    progressRecords = allProgress

                    const collected = allProgress.flatMap((record: any) => {
                        const inspectionType = String(record?.inspectionType || '').toLowerCase()
                        const responses = (record?.responses && typeof record.responses === 'object') ? record.responses : {}
                        const answeredCount = Object.values(responses).filter((value) => value !== null && value !== undefined && String(value).trim() !== '').length

                        const shouldInclude = inspectionType.startsWith('report_draft_') || answeredCount > 0
                        if (!shouldInclude) return []

                        const rawRecordFindings = record?.inspectionData?.deficiencies || record?.inspectionData?.findings || []
                        if (!Array.isArray(rawRecordFindings) || rawRecordFindings.length === 0) return []

                        return mapDraftDeficienciesToFindings(
                            rawRecordFindings,
                            String(record?.buildingId || record?.inspectionData?.buildingId || record?.unitId || '')
                        )
                    })

                    findings = collected
                } catch (error) {
                    console.warn('Full progress fallback failed:', error)
                }
            }

            const dedupedFindings = dedupeFindings(findings)

            const buildingProgressMap = buildings.reduce((acc: Record<string, any>, building) => {
                const completedUnits = completedUnitsMap[building.buildingId] || []
                acc[building.buildingId] = {
                    out: 0,
                    in: 0,
                    un: completedUnits.length,
                    totalUnits: building.totalUnits,
                    unitsForInspection: building.unitsForInspection,
                    inspectedUnits: [...completedUnits],
                }
                return acc
            }, {})

            progressRecords.forEach((record: any) => {
                const inspectionType = String(record?.inspectionType || '').toLowerCase()
                const responses = (record?.responses && typeof record.responses === 'object') ? record.responses : {}
                const answeredCount = Object.values(responses).filter((value) => value !== null && value !== undefined && String(value).trim() !== '').length
                if (answeredCount === 0 && !inspectionType.startsWith('report_draft_')) return

                const buildingCandidate = String(
                    record?.buildingId ||
                    record?.inspectionData?.buildingId ||
                    record?.inspectionData?.buildingInspectionId ||
                    (looksLikeBuildingLabel(record?.unitId) ? record?.unitId : '') ||
                    'B1'
                ).trim() || 'B1'

                if (!buildingProgressMap[buildingCandidate]) {
                    buildingProgressMap[buildingCandidate] = {
                        out: 0,
                        in: 0,
                        un: 0,
                        totalUnits: 0,
                        unitsForInspection: 0,
                        inspectedUnits: [],
                    }
                }

                if (inspectionType.startsWith('outside')) {
                    buildingProgressMap[buildingCandidate].out = Math.max(buildingProgressMap[buildingCandidate].out, answeredCount)
                } else if (inspectionType.startsWith('inside')) {
                    buildingProgressMap[buildingCandidate].in = Math.max(buildingProgressMap[buildingCandidate].in, answeredCount)
                } else if (inspectionType.startsWith('unit_')) {
                    const unitLabel = inspectionType.split('_').slice(1).join('_').trim()
                    if (unitLabel && !buildingProgressMap[buildingCandidate].inspectedUnits.includes(unitLabel)) {
                        buildingProgressMap[buildingCandidate].inspectedUnits.push(unitLabel)
                    }
                    buildingProgressMap[buildingCandidate].un = buildingProgressMap[buildingCandidate].inspectedUnits.length
                }
            })

            const progressRows = Object.values(buildingProgressMap)
            const progressData = {
                outsideProgress: progressRows.reduce((sum: number, row: any) => sum + Number(row.out || 0), 0),
                insideProgress: progressRows.reduce((sum: number, row: any) => sum + Number(row.in || 0), 0),
                unitProgress: progressRows.reduce((sum: number, row: any) => sum + Number(row.un || 0), 0),
                outsideTotal: 29,
                insideTotal: 36,
                unitTotal: 35,
                buildingRows: buildings.map((building) => ({
                    buildingId: building.buildingId,
                    totalUnits: building.totalUnits,
                    unitsForInspection: building.unitsForInspection,
                })),
                buildingProgressMap,
            }

            const inspectionDataForSummary = {
                inspectionId: `INPROG-${Date.now()}`,
                inspectionNo: `INSP-${Date.now().toString(36).toUpperCase()}`,
                propertyId,
                propertyName: property?.name || '-',
                propertyAddress: property?.address || '-',
                inspectorId: user?.id || user?._id || 'INS-001',
                inspectorName,
                inspectionType: 'In-Progress Inspection',
                status: 'in-progress',
                building: buildings.map((building) => getBuildingDisplayName(building.buildingId)).join(', '),
                buildingColumnHeader: columnHeaderName,
                findings: dedupedFindings,
                deficiencies: dedupedFindings,
                notes: notes || `In-progress export generated on ${new Date().toLocaleString()}`,
                selectedUnits: Object.values(completedUnitsMap).flat(),
                complianceScore: Math.max(0, 100 - Math.min(dedupedFindings.length * 3, 100)),
                startDate: new Date().toLocaleDateString(),
                startTime: new Date().toLocaleTimeString(),
                progressData,
            }

            localStorage.setItem('currentInspectionData', JSON.stringify(inspectionDataForSummary))
            localStorage.setItem('currentInspectionProperty', JSON.stringify(property))

            toast.success('In-progress report prepared. Opening summary...', {
                position: 'top-right',
                autoClose: 1800,
            })

            router.push(`/dashboard/inspection/summary?propertyId=${id}`)
        } catch (error: any) {
            console.error('Export in-progress failed:', error)
            toast.error(`Failed to export in-progress report: ${error?.message || 'Unknown error'}`, {
                position: 'top-right',
            })
        } finally {
            setIsExporting(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh] font-lexend">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    if (!property) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-slate-500 font-bold font-lexend">Property not found.</div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8 font-lexend">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl border border-slate-200 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-gradient tracking-tight">Property Details</h1>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">View and customize inspection sampling for this property</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inspector:</span>
                        <span className="text-xs font-extrabold text-slate-800">{user?.fullName || "Guest User"}</span>
                    </div>
                </div>

                {/* Property Meta Card */}
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 shadow-sm p-6 sm:p-8 rounded-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property ID</span>
                            <p className="text-sm font-extrabold text-teal-600">{property.propertyId || property._id?.slice(-8)?.toUpperCase()}</p>
                            <div className="pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</span>
                                <p className="text-sm font-bold text-slate-700">{property.state || "-"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zip Code</span>
                            <p className="text-sm font-bold text-slate-700">{property.zipCode || "-"}</p>
                            <div className="pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</span>
                                <p className="text-sm font-bold text-slate-700 truncate" title={property.address}>{property.address || "-"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buildings</span>
                            <p className="text-sm font-extrabold text-slate-900">{property.buildings || 1}</p>
                            <div className="pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coverage Mode</span>
                                <p className="text-sm font-bold text-slate-700">{getCoverageLabel()}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Name</span>
                            <p className="text-sm font-extrabold text-slate-900 truncate" title={property.name}>{property.name || "-"}</p>
                            <div className="pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</span>
                                <p className="text-sm font-bold text-slate-700">{property.city || "-"}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress Summary Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 px-1">Unit Status Summary</h2>
                    <Card className="bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 rounded-2xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Inspection Progress</span>
                                    <span className="text-xl font-extrabold text-teal-600">{overallProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200/50">
                                    <div 
                                        className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-inner"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Not Started</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-6 md:border-l md:pl-8 border-slate-150">
                                <div className="text-center px-2">
                                    <p className="text-2xl font-extrabold text-slate-950">
                                        {Object.values(completedUnitsMap).flat().length}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tasks Done</p>
                                </div>
                                <div className="text-center px-2">
                                    <p className="text-2xl font-extrabold text-slate-950">
                                        {buildings.reduce((sum, b) => sum + (2 + b.unitsForInspection), 0)}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Tasks</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Building Table Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-slate-900">Building Breakdown</h2>
                        <span className="text-xs font-bold text-slate-400">Total units required: {totalInspectionUnits}</span>
                    </div>

                    {/* Edit Column Header Modal */}
                    {editColumnHeaderOpen && (
                        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-950">Edit Column Name</h3>
                                    <button onClick={() => setEditColumnHeaderOpen(false)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Column Name</label>
                                    <input
                                        ref={columnHeaderInputRef}
                                        type="text"
                                        value={tempColumnHeaderName}
                                        onChange={(e) => setTempColumnHeaderName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveColumnHeader()}
                                        className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                                        placeholder="Building Unique ID"
                                    />
                                </div>
                                <div className="flex gap-3 p-5 border-t border-slate-100 bg-slate-50/50">
                                    <button
                                        onClick={() => setEditColumnHeaderOpen(false)}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveColumnHeader}
                                        className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors border-0 shadow-sm shadow-teal-600/10"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-slate-50/80 border-b border-slate-150">
                                <tr>
                                    <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="inline-flex items-center gap-2">
                                            {columnHeaderName}
                                            <button
                                                onClick={() => { setTempColumnHeaderName(columnHeaderName); setEditColumnHeaderOpen(true) }}
                                                className="p-1 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors"
                                                title="Edit column name"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    </th>
                                    <th className="text-center py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Units</th>
                                    <th className="text-center py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Units for Inspection</th>
                                    <th className="text-center py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</th>
                                    <th className="py-4 px-6 w-56"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {buildings.map((building) => {
                                    const completed = getCompletedCount(building.buildingId)
                                    const allDone = isAllCompleted(building)
                                    return (
                                        <tr key={building.buildingId} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="py-5 px-6">
                                                {editingBuildingId === building.buildingId ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <input
                                                            ref={buildingNameInputRef}
                                                            value={tempBuildingName}
                                                            onChange={e => setTempBuildingName(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') handleSaveBuildingName(building.buildingId); if (e.key === 'Escape') setEditingBuildingId(null) }}
                                                            className="w-24 text-sm font-bold text-slate-900 border border-teal-500 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                                        />
                                                        <button onClick={() => handleSaveBuildingName(building.buildingId)} className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors border-0">
                                                            <Check className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button onClick={() => setEditingBuildingId(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border-0">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 group">
                                                        <span className="text-sm text-slate-900 font-extrabold">{getBuildingDisplayName(building.buildingId)}</span>
                                                        <button onClick={() => handleStartBuildingEdit(building.buildingId)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-teal-50 text-teal-600 transition-all">
                                                            <Pencil className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-5 px-6 text-sm text-slate-600 text-center font-bold">{building.totalUnits}</td>
                                            <td className="py-5 px-6 text-center">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={totalInspectionUnits}
                                                    value={building.unitsForInspection}
                                                    onChange={(e) => handleInspectionUnitChange(building.buildingId, parseInt(e.target.value) || 0)}
                                                    className="w-20 text-center text-sm font-extrabold text-slate-800 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                                />
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                {completed > 0 ? (
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${allDone ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                        {allDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                                                        {completed}/{building.unitsForInspection}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-bold">Not started</span>
                                                )}
                                            </td>
                                            <td className="py-5 px-6">
                                                <Button
                                                    onClick={() => handleBuildingClick(building)}
                                                    className={`w-full font-bold py-2 rounded-xl text-xs shadow-sm transition-all border-0 ${
                                                        allDone
                                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                                                            : completed > 0
                                                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10'
                                                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10'
                                                    }`}
                                                >
                                                    {allDone ? 'Completed ✓' : completed > 0 ? 'Continue Inspection' : 'Start Inspection'}
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot className="bg-slate-50/60 border-t-2 border-slate-200">
                                <tr>
                                    <td className="py-4 px-6 text-sm font-extrabold text-slate-900">Total</td>
                                    <td className="py-4 px-6 text-sm font-bold text-slate-700 text-center">
                                        {buildings.reduce((sum, b) => sum + b.totalUnits, 0)}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-black text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                                            buildings.reduce((sum, b) => sum + b.unitsForInspection, 0) === totalInspectionUnits
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-rose-50 text-rose-700 border-rose-100'
                                        }`}>
                                            {buildings.reduce((sum, b) => sum + b.unitsForInspection, 0)} / {totalInspectionUnits}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6"></td>
                                    <td className="py-4 px-6"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {buildings.map((building) => {
                        const completed = getCompletedCount(building.buildingId)
                        const allDone = isAllCompleted(building)
                        return (
                            <div key={building.buildingId} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1">
                                        {columnHeaderName}
                                        <button onClick={() => { setTempColumnHeaderName(columnHeaderName); setEditColumnHeaderOpen(true) }} className="p-1 rounded-lg hover:bg-teal-50 text-teal-600" title="Edit column name">
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                    </span>
                                    {editingBuildingId === building.buildingId ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                ref={buildingNameInputRef}
                                                value={tempBuildingName}
                                                onChange={e => setTempBuildingName(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') handleSaveBuildingName(building.buildingId); if (e.key === 'Escape') setEditingBuildingId(null) }}
                                                className="w-20 text-xs font-bold text-slate-900 border border-teal-500 rounded-lg py-1 px-1.5 focus:outline-none"
                                            />
                                            <button onClick={() => handleSaveBuildingName(building.buildingId)} className="p-1 rounded-lg bg-teal-600 text-white transition-colors border-0">
                                                <Check className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setEditingBuildingId(null)} className="p-1 rounded-lg bg-slate-100 text-slate-500 transition-colors border-0">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 group">
                                            <span className="text-sm text-slate-900 font-extrabold">{getBuildingDisplayName(building.buildingId)}</span>
                                            <button onClick={() => handleStartBuildingEdit(building.buildingId)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-teal-50 text-teal-600 transition-opacity">
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs font-medium">
                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Total Units</span>
                                    <span className="text-slate-800 font-extrabold">{building.totalUnits}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs font-medium">
                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Units for Inspection</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={totalInspectionUnits}
                                        value={building.unitsForInspection}
                                        onChange={(e) => handleInspectionUnitChange(building.buildingId, parseInt(e.target.value) || 0)}
                                        className="w-16 text-center text-xs font-extrabold text-slate-800 border border-slate-200 bg-slate-50/50 rounded-lg py-1 px-1 focus:outline-none"
                                    />
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 text-xs font-medium">
                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Progress</span>
                                    {completed > 0 ? (
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${allDone ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {allDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                                            {completed}/{building.unitsForInspection}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 font-bold">Not started</span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => handleBuildingClick(building)}
                                    className={`w-full font-bold py-2.5 rounded-xl text-xs shadow-sm transition-all border-0 ${
                                        allDone
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                                            : completed > 0
                                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10'
                                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10'
                                    }`}
                                >
                                    {allDone ? 'Completed ✓' : completed > 0 ? 'Continue Inspection' : 'Start Inspection'}
                                </Button>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex justify-center">
                    <Button
                        onClick={handleExportInProgress}
                        disabled={isExporting}
                        className="w-full md:w-auto min-w-[220px] bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-emerald-600/10 transition-all duration-200 border-0"
                    >
                        {isExporting ? 'Preparing Report...' : 'Export In Progress'}
                    </Button>
                </div>
            </div>

            {/* ====== Unit Selection Popup ====== */}
            {unitPopupOpen && selectedBuilding && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setUnitPopupOpen(false)}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Popup Header */}
                        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-extrabold text-white tracking-tight">
                                    {selectedBuilding.buildingId} — Select Unit
                                </h3>
                                <p className="text-xs text-white/80 mt-0.5 font-medium">
                                    {getCompletedCount(selectedBuilding.buildingId)} of {selectedBuilding.unitsForInspection} units completed
                                </p>
                            </div>
                            <button
                                onClick={() => setUnitPopupOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white border-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Sampling Information & Random Selection */}
                        <div className="px-5 pt-4 flex-shrink-0">
                            <div className="bg-teal-50/50 border border-teal-100/70 rounded-xl p-4">
                                <p className="text-xs text-teal-800 font-bold leading-relaxed">
                                    {getSamplingExplanation(selectedBuilding.totalUnits)}
                                </p>
                                <button
                                    onClick={() => {
                                        const sample = generateRandomUnitSample(selectedBuilding.totalUnits, property._id || id);
                                        toast.info(`Randomly selected: ${sample.selectedUnits.join(', ')}`, { position: 'top-right' });
                                    }}
                                    className="mt-3 flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors bg-transparent border-0 cursor-pointer p-0"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                                    Generate Random Sample
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-5 pt-4 pb-2 flex-shrink-0">
                            <div className="w-full bg-slate-100 border border-slate-200/50 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(getCompletedCount(selectedBuilding.buildingId) / selectedBuilding.unitsForInspection) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Unit List */}
                        <div className="p-5 overflow-y-auto flex-1 min-h-0 space-y-2.5">
                            {generateUnitNames(selectedBuilding.buildingId, selectedBuilding.unitsForInspection).map((unitName, idx) => {
                                const completed = (completedUnitsMap[selectedBuilding.buildingId] || []).includes(unitName)
                                return (
                                    <div
                                        key={unitName}
                                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                                            completed
                                                ? 'border-emerald-200 bg-emerald-50/40'
                                                : 'border-slate-100 bg-white hover:border-teal-500/20 hover:bg-teal-50/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                                                completed ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/10' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${completed ? 'text-emerald-800' : 'text-slate-900'}`}>
                                                    {unitName}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    {completed ? 'Inspection completed' : 'Pending inspection'}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleStartUnitInspection(selectedBuilding.buildingId, unitName)}
                                            size="sm"
                                            className={`font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all border-0 shadow-sm ${
                                                completed
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-250'
                                                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10'
                                            }`}
                                        >
                                            {completed ? (
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Done
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    Start <ChevronRight className="w-3.5 h-3.5" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Popup Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 flex-shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => setUnitPopupOpen(false)}
                                className="flex-1 font-bold rounded-xl py-2.5 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                            >
                                Close
                            </Button>
                            {isAllCompleted(selectedBuilding) && (
                                <Button
                                    onClick={() => {
                                        setUnitPopupOpen(false)
                                        toast.success(`All units in ${selectedBuilding.buildingId} are completed!`, { position: "top-right" })
                                    }}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-2.5 text-xs border-0 shadow-sm shadow-emerald-600/10"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All Done
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
