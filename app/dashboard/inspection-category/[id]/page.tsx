"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import PortalLayout from "@/components/PortalLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { propertiesAPI, authAPI, inspectionsAPI } from "@/lib/api"
import { outsideDeficiencyMapping, insideDeficiencyMapping, DeficiencyDetail } from "@/lib/deficiencyMapping"
import { unitDeficiencyMapping } from "@/lib/unitDeficiencyMapping"
import { calculateUnitInspectionScore, calculateUnitScore, ScoringResult, POSSIBLE_SCORE, SEVERITY_LEVELS, UNIT_POSSIBLE_SCORE } from "@/lib/scoringCalculations"
import { lookupCodeReference } from "@/lib/appDeficiencyLookup"
import { captureInspectionPhoto, captureInspectionPhotoNative, uploadQueuedPhotos } from "@/lib/imageCapture"
import {
    calculateOutsideScore,
    extractCategoryNumber,
    OutsideScoringResult,
    OUTSIDE_LOCATION_OPTIONS,
    OUTSIDE_POSSIBLE_SCORE
} from "@/lib/outsideScoringCalculations"
import {
    calculateInsideScore,
    extractInsideCategoryNumber,
    InsideScoringResult,
    INSIDE_POSSIBLE_SCORE,
    INSIDE_LOCATION_OPTIONS
} from "@/lib/insideScoringCalculations"
import { UNIT_LOCATION_OPTIONS } from "@/lib/unitScoringCalculations"
import { getSamplingRequirements } from "@/lib/unitSamplingService"
import { toast } from "react-toastify"
import { Search, ChevronDown, ChevronUp, ChevronRight, Plus, Filter, MoreHorizontal, Camera, X, ChevronLeft, CheckCircle2, FileText, User, Grid, Clock, Video, Monitor, Image as ImageIcon, Laptop, Tablet, Pencil, Check, Mail, CloudRain, Home, LayoutGrid, Building2, ArrowLeft, ShieldCheck } from "lucide-react";

import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS } from "@/lib/inspectionData";
import { ReportPreviewModal } from "@/components/ReportPreviewModal";
import { fetchNSPIREReportForProperty, NSPIREInspectionReport } from "@/lib/nspireReport";
import { safeSetItem } from "@/lib/safeStorage"
import { durableGet, durableRemove, durableSet, ensureHydrated } from '@/lib/durableStore'
import { watchReachability } from "@/lib/reachability"


const outsideItemsList = OUTSIDE_ITEMS.map(item => `${item.id}. ${item.name}`);
const insideItemsList = INSIDE_ITEMS.map(item => `${item.id}. ${item.name}`);
const unitItemsList = UNIT_ITEMS.map(item => `${item.id}. ${item.name}`);

// Map frontend categories to valid backend enum values
const mapToBackendCategory = (category: string): string => {
    const lowerCategory = category.toLowerCase();

    // Site-related items (outside)
    if (lowerCategory.includes('address') || lowerCategory.includes('signage') ||
        lowerCategory.includes('parking') || lowerCategory.includes('sidewalk') ||
        lowerCategory.includes('fencing') || lowerCategory.includes('gate') ||
        lowerCategory.includes('retaining wall') || lowerCategory.includes('driveway')) {
        return 'site';
    }

    // Building exterior items
    if (lowerCategory.includes('roof') || lowerCategory.includes('chimney') ||
        lowerCategory.includes('foundation') || lowerCategory.includes('structural') ||
        lowerCategory.includes('door') || lowerCategory.includes('window') ||
        lowerCategory.includes('paint') || lowerCategory.includes('railings')) {
        return 'building-exterior';
    }

    // Building systems
    if (lowerCategory.includes('electrical') || lowerCategory.includes('hvac') ||
        lowerCategory.includes('heating') || lowerCategory.includes('ventilation') ||
        lowerCategory.includes('water heater') || lowerCategory.includes('elevator') ||
        lowerCategory.includes('fire safety') || lowerCategory.includes('carbon monoxide') ||
        lowerCategory.includes('leak') || lowerCategory.includes('drain')) {
        return 'building-systems';
    }

    // Common areas
    if (lowerCategory.includes('lighting') || lowerCategory.includes('egress') ||
        lowerCategory.includes('step') || lowerCategory.includes('stair') ||
        lowerCategory.includes('trash chute')) {
        return 'common-areas';
    }

    // Unit-specific items
    if (lowerCategory.includes('cabinet') || lowerCategory.includes('kitchen') ||
        lowerCategory.includes('bathroom') || lowerCategory.includes('restroom') || lowerCategory.includes('sink') ||
        lowerCategory.includes('ceiling') || lowerCategory.includes('floor') ||
        lowerCategory.includes('wall') || lowerCategory.includes('mold') ||
        lowerCategory.includes('grab bar') || lowerCategory.includes('call-for-aid')) {
        return 'unit';
    }

    // Default to General
    return 'General';
};

type ItemStatus = 'No OD' | 'OD' | 'N/A' | null;

export default function InspectionCategoryPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    // A screen restored from the offline cache may have been rendered by the
    // server for a different id — there is no saved copy for a property created
    // in the field, so a sibling stands in. The address bar is the authority.
    const idFromUrl =
        typeof window !== 'undefined'
            ? decodeURIComponent(window.location.pathname.split('/').filter(Boolean).pop() || '')
            : ''
    const id = idFromUrl || (params.id as string)
    const [property, setProperty] = useState<any>(null)
    // True once the saved progress (cache or server) has been applied — the
    // seed below stops standing in and may be overwritten from live figures.
    const [progressHydrated, setProgressHydrated] = useState(false)
    // Last visit's counters, read on mount so the section headers show the
    // inspector's real standing the instant the screen opens instead of 0%
    // climbing a few seconds later ("do not fill the % again and again").
    const [counterSeed, setCounterSeed] = useState<{ o: number; i: number; u: number; ut: number } | null>(null)
    const [user, setUser] = useState<any>(null)
    const [units, setUnits] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [reportPreviewData, setReportPreviewData] = useState<NSPIREInspectionReport | null>(null)
    const [loadingReportPreview, setLoadingReportPreview] = useState(false)
    const [expandedSection, setExpandedSection] = useState<string | null>(null)
    const [outsideStatuses, setOutsideStatuses] = useState<Record<string, ItemStatus>>({})
    const [insideStatuses, setInsideStatuses] = useState<Record<string, ItemStatus>>({})
    const [unitStatuses, setUnitStatuses] = useState<Record<string, ItemStatus>>({})
    // The debounced save in saveCurrentProgress fires ~2s after being scheduled. Switching
    // units updates activeInspectionUnit on one render while unitStatuses (still Unit A's
    // answers) hasn't been reset yet — if that render's closure is what ends up saving,
    // Unit A's responses get written under Unit B's id. Refs stay current up to the exact
    // moment the save actually runs, so the payload always reflects the real active unit.
    const activeInspectionUnitRef = useRef('')
    const unitStatusesRef = useRef<Record<string, ItemStatus>>({})
    const [propertyFindings, setPropertyFindings] = useState<any[]>([])
    // A later empty attempt must not raise an error over a property already shown.
    const loadedPropertyRef = useRef<any>(null)
    /** Raise the error only if the screen is still empty a moment later.
     *  fetchData can run more than once for a screen — an early attempt that
     *  finds nothing was reporting failure over a property that a later one
     *  then loaded, so the inspector saw an error sitting on top of the data. */
    const reportLoadFailure = () => {
        setTimeout(() => {
            if (!loadedPropertyRef.current) {
                toast.error("Couldn't load this property. Check your connection and try again.")
            }
        }, 1800)
    }

    const [currentSection, setCurrentSection] = useState<'outside' | 'inside' | 'unit'>('outside')
    const [completedUnits, setCompletedUnits] = useState<string[]>([])
    const [isOnline, setIsOnline] = useState(true)
    const [offlineChangesCount, setOfflineChangesCount] = useState(0)

    // Read building & unit from URL query params (set by property-details page)
    // Read the query from the address bar, not from the hydrated router state.
    // A screen restored from the offline cache hydrates with the query of
    // whichever copy was cached — which has no building — so every building
    // fell back to 'B1'. Findings are keyed by building, so one building's
    // photos then showed up under all of them.
    const liveQuery = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null
    const qp = (key: string) => liveQuery?.get(key) ?? searchParams.get(key)

    const urlBuilding = qp('building') || 'B1'

    // NSPIRE.ai-style navigation: '' = the categories list; 'outside' |
    // 'inside' | 'unit' = that section as its own full page. State drives the
    // view (instant, immune to a slow route payload); the URL mirrors it so
    // the hardware/browser back button walks page → categories naturally.
    // A ?unit= link (the per-unit Start/View buttons on property-details) means
    // the inspector asked for that unit's page, not the categories screen.
    const [sectionView, setSectionView] = useState<'' | 'outside' | 'inside' | 'unit'>(
        () => (qp('section') || (qp('unit') ? 'unit' : '')) as '' | 'outside' | 'inside' | 'unit'
    )
    useEffect(() => {
        const fromUrl = (searchParams?.get('section') || (searchParams?.get('unit') ? 'unit' : '')) as '' | 'outside' | 'inside' | 'unit'
        setSectionView(fromUrl)
    }, [searchParams])
    const gotoSection = (sec: '' | 'outside' | 'inside' | 'unit') => {
        setSectionView(sec)
        // Landing back on categories must show fresh unit counts, not stale zeros.
        if (sec === '') void refreshCompletedUnits()
        const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : (searchParams?.toString() || ''))
        if (sec) sp.set('section', sec); else { sp.delete('section'); sp.delete('unit') }
        router.replace(`/dashboard/inspection-category/${id}?${sp.toString()}`)
    }
    const urlUnit = qp('unit') || ''
    const urlTotalUnits = parseInt(qp('totalUnits') || '0')
    const currentUnitName = decodeURIComponent(urlUnit)

    // Unit selection popup (shown when user clicks Units section and no unit is pre-selected)
    const [unitSelectionPopupOpen, setUnitSelectionPopupOpen] = useState(false)
    const [activeInspectionUnit, setActiveInspectionUnit] = useState(currentUnitName)

    // Kept in sync every render (not via a separate effect) so they're always current
    // by the time the debounced save in saveCurrentProgress actually executes.
    activeInspectionUnitRef.current = activeInspectionUnit
    unitStatusesRef.current = unitStatuses

    const refreshCompletedUnits = async () => {
        if (!id || !urlBuilding) return;
        try {
            let records: any[] = [];
            try {
                // slim: completion counts need answers only, not every finding and photo.
                const res = await inspectionsAPI.getProgress({ property_id: id, building_id: urlBuilding, slim: '1' });
                if (res && Array.isArray(res.progress)) records = res.progress;
            } catch (error) {
                console.error("Error fetching progress from API:", error);
            }

            // Merge in the local cache so this still works when the backend is unreachable
            try {
                const cached = durableGet(`cached_progress_${id}_${urlBuilding}`);
                if (cached) {
                    const cachedList = JSON.parse(cached);
                    if (Array.isArray(cachedList)) records = [...records, ...cachedList];
                }
            } catch (e) {}

            const completed: string[] = [];
            const seen = new Set<string>();
            const bId = String(urlBuilding || '').toLowerCase();
            records.forEach((p: any) => {
                const type = String(p.inspectionType || '').toLowerCase();
                if (!type.startsWith('unit_') || !p.inspectionData?.isComplete || !p.unitId || seen.has(p.unitId)) return;
                // The API answers with the whole property's records — it does not
                // filter by building — so Building 1's finished units were counted
                // for Building 2 as well: "2 units inspected" on a building never
                // touched. Only count a unit that belongs to this building. A
                // legacy record with no building in its type or fields can only
                // have come from the first building (same rule applyProgressData
                // already applies).
                const pBldg = String(p.buildingId || '').toLowerCase();
                const belongsHere = type.startsWith(`unit_${bId}_`) ||
                    pBldg === bId ||
                    (!pBldg && !/^unit_b\d+_/.test(type) && (bId === 'b1' || bId === 'building 1'));
                if (!belongsHere) return;
                seen.add(p.unitId);
                completed.push(p.unitId);
            });

            setCompletedUnits(completed);
        } catch (error) {
            console.error("Error fetching completed units:", error);
        }
    };

    useEffect(() => {
        refreshCompletedUnits();
    }, [id, urlBuilding]);

    // Set initial section based on URL param
    useEffect(() => {
        if (currentUnitName === 'Outside') {
            setCurrentSection('outside');
        } else if (currentUnitName === 'Inside') {
            setCurrentSection('inside');
        } else if (currentUnitName) {
            setCurrentSection('unit');
        }
    }, [currentUnitName]);

    // Custom column header name (set from property-details building table)
    const [columnHeaderName, setColumnHeaderName] = useState('Building Unique ID')

    // Load column header from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`buildingColHeader_${id}`)
        if (saved) setColumnHeaderName(saved)
    }, [id])

    // Generate building unit names from totalUnits URL param (or fallback to API units)
    const buildingUnitNames = useMemo(() => {
        const count = urlTotalUnits
        if (count > 0) {
            return Array.from({ length: count }, (_, i) => `Unit ${String(i + 1).padStart(3, '0')}`)
        }
        return []
    }, [urlTotalUnits])

    // Building & Unit name editing
    const [buildingName, setBuildingName] = useState(urlBuilding);
    const [editBuildingModalOpen, setEditBuildingModalOpen] = useState(false);
    const [tempBuildingName, setTempBuildingName] = useState(urlBuilding);
    const [unitNames, setUnitNames] = useState<Record<string, string>>({});
    const [editUnitsModalOpen, setEditUnitsModalOpen] = useState(false);
    const [tempUnitNames, setTempUnitNames] = useState<Record<string, string>>({});

    // Inline unit name editing inside the unit selection popup
    const [popupUnitCustomNames, setPopupUnitCustomNames] = useState<Record<string, string>>({});
    const [editingUnitIdx, setEditingUnitIdx] = useState<number | null>(null);
    const [editingUnitValue, setEditingUnitValue] = useState('');

    // Load custom building name from localStorage
    useEffect(() => {
        if (id && urlBuilding) {
            const savedName = localStorage.getItem(`buildingDisplayName_${id}_${urlBuilding}`)
            if (savedName) {
                setBuildingName(savedName)
                setTempBuildingName(savedName)
            }
        }
    }, [id, urlBuilding])

    // Modal State
    const [isODModalOpen, setIsODModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track items that have actual saved OD findings (to protect from accidental Select All overwrite)
    const [savedODItems, setSavedODItems] = useState<Set<string>>(new Set());

    // A saved deficiency's identity. Building and section alone are not enough:
    // Unit 001's "1. Bathroom" and Unit 002's "1. Bathroom" hashed to the same
    // key, so one unit's saved deficiency showed up in — and was overwritten
    // by — every other unit's copy of the same item. Unit records therefore
    // carry the unit in the key; outside/inside have no unit and never did.
    const odSavedKey = (section: 'outside' | 'inside' | 'unit', itemName: string, unit?: string) =>
        section === 'unit'
            ? `${urlBuilding}:${section}:${unit ?? activeInspectionUnit}:${itemName}`
            : `${urlBuilding}:${section}:${itemName}`;

    // Store previously saved OD form data per item key (see odSavedKey) for pre-filling when re-opened
    const [savedODFormData, setSavedODFormData] = useState<Record<string, {
        odForm: { category: string; note: string; location: string; healthAndSafety: string; repairBy: string; codeAndCompliance: string };
        selectedDeficiency: DeficiencyDetail | null;
        photos: string[];
        modalStep: number;
    }>>({});

    // General Comment modal state
    const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
    const [generalNote, setGeneralNote] = useState('');
    const [generalImages, setGeneralImages] = useState<string[]>([]);
    const [currentGeneralSection, setCurrentGeneralSection] = useState<'outside' | 'inside' | 'unit' | null>(null);
    const [currentGeneralItem, setCurrentGeneralItem] = useState<string | null>(null);
    const [isUploadingGeneralImage, setIsUploadingGeneralImage] = useState(false);
    const generalFileInputRef = useRef<HTMLInputElement>(null);
    const generalGalleryInputRef = useRef<HTMLInputElement>(null);
    const [modalStep, setModalStep] = useState(1); // 1: Add New, 2: Form, 3: Selection (Selected/Detail/Criteria)
    const [isHowToInspectOpen, setIsHowToInspectOpen] = useState(false);
    const [isStandardModalOpen, setIsStandardModalOpen] = useState(false);
    const [isInspectionProtocolModalOpen, setIsInspectionProtocolModalOpen] = useState(false);
    const [currentModalItem, setCurrentModalItem] = useState<string | null>(null);
    const [selectionType, setSelectionType] = useState<'selected' | 'detail' | 'criteria'>('selected');
    const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyDetail | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [odForm, setOdForm] = useState({
        category: "",
        note: "",
        location: "Building Site S",
        healthAndSafety: "",
        repairBy: "",
        codeAndCompliance: ""
    });

    // Auto-scoring state - calculated based on deficiency selection
    const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
    const [outsideScoringResult, setOutsideScoringResult] = useState<OutsideScoringResult | null>(null);
    const [insideScoringResult, setInsideScoringResult] = useState<InsideScoringResult | null>(null);

    // Get total samples based on NSPIRE Sampling Table (same as app)
    const totalSamples = useMemo(() => {
        // Use the total units from URL or property to find required sample size 'n'
        const sampling = getSamplingRequirements(urlTotalUnits || property?.units || units?.length || 0);
        return sampling.requiredSize || 20;
    }, [urlTotalUnits, property?.units, units?.length]);

    // Auto-count deficiencies: 1 if a deficiency is selected, 0 otherwise
    const deficiencyCount = selectedDeficiency ? 1 : 0;

    // Update scoring dynamically when deficiency is selected/changed
    useEffect(() => {
        // Check if we're in the Outside inspection section
        const isOutsideSection = currentSection === 'outside';

        if (isOutsideSection && currentModalItem) {
            // Use Outside-specific scoring with category-based and deficiency-based rules
            const categoryNumber = extractCategoryNumber(undefined, currentModalItem);
            // Include category name, selected deficiency name, detail, AND criteria fields for pattern matching
            const deficiencyDescription = [
                currentModalItem,  // Include category name for fixed-severity categories
                selectedDeficiency?.selected,
                selectedDeficiency?.criteria,
                odForm.note,
            ].filter(Boolean).join(' ');

            const outsideResult = calculateOutsideScore({
                categoryNumber,
                totalSamples,
                deficiencyDescription: deficiencyDescription || undefined,
                deficiencyCount,
            });

            setOutsideScoringResult(outsideResult);

            // Update the health & safety based on outside scoring (always, to show category-based severity)
            setOdForm(prev => ({
                ...prev,
                healthAndSafety: outsideResult.severity,
            }));

            // Set a compatible result for the UI
            setScoringResult({
                allSample: outsideResult.allSample,
                deficiencies: outsideResult.deficiencyCount,
                violations: outsideResult.deficiencyCount,
                ptsLostRaw: outsideResult.ptsLostRaw,
                ptsLost: outsideResult.ptsLost,
                possibleScore: outsideResult.possibleScore,
                maxPtsLost: outsideResult.maxPtsLost,
                score: outsideResult.score,
                severity: outsideResult.severity,
            });
        } else if (currentSection === 'unit') {
            // Use Unit-specific scoring logic
            const unitResult = calculateUnitInspectionScore({
                totalSamples,
                deficiencyCount,
                severity: selectedDeficiency?.healthAndSafety || odForm.healthAndSafety || 'Moderate',
                deficiencyPointsFormula: selectedDeficiency?.pointsFormula,
            });

            setScoringResult({
                allSample: unitResult.allSample,
                deficiencies: unitResult.deficiencyCount,
                violations: unitResult.deficiencyCount,
                ptsLostRaw: unitResult.pointsLostRaw,
                ptsLost: unitResult.pointsLost,
                possibleScore: unitResult.possibleScore,
                maxPtsLost: unitResult.maxPtsLost,
                score: unitResult.score,
                severity: unitResult.severity,
            });

            // Update the health & safety based on unit scoring
            setOdForm(prev => ({
                ...prev,
                healthAndSafety: unitResult.severity,
            }));
            setOutsideScoringResult(null);
            setInsideScoringResult(null);
        } else {
            // Use Inside-specific scoring with category-based and deficiency-based rules
            const categoryNumber = extractInsideCategoryNumber(undefined, currentModalItem || '');
            // Include category name, selected deficiency name, detail, AND criteria fields for pattern matching
            // The category name (e.g., "Chimney") is crucial for categories with fixed severity
            const deficiencyDescription = [
                currentModalItem,  // Include category name for fixed-severity categories like Chimney
                selectedDeficiency?.selected,
                selectedDeficiency?.criteria,
                odForm.note,
            ].filter(Boolean).join(' ');

            const insideResult = calculateInsideScore({
                categoryNumber,
                totalSamples,
                deficiencyDescription: deficiencyDescription || undefined,
                deficiencyCount,
            });

            setInsideScoringResult(insideResult);

            // Update the health & safety based on inside scoring (always, to show category-based severity)
            setOdForm(prev => ({
                ...prev,
                healthAndSafety: insideResult.severity,
            }));

            // Set a compatible result for the UI
            setScoringResult({
                allSample: insideResult.allSample,
                deficiencies: insideResult.deficiencyCount,
                violations: insideResult.deficiencyCount,
                ptsLostRaw: insideResult.ptsLostRaw,
                ptsLost: insideResult.ptsLost,
                possibleScore: insideResult.possibleScore,
                maxPtsLost: insideResult.maxPtsLost,
                score: insideResult.score,
                severity: insideResult.severity,
            });
            setOutsideScoringResult(null);
        }
    }, [selectedDeficiency, deficiencyCount, totalSamples, odForm.healthAndSafety, odForm.note, currentSection, currentModalItem]);

    const prevBuildingRef = useRef(urlBuilding);
    useEffect(() => {
        if (id) {
            // CRITICAL: Reset building/unit specific states when location changes
            // This prevents findings from B1 leaking into B2 if the page isn't refreshed
            setOutsideStatuses({});
            setInsideStatuses({});
            setUnitStatuses({});
            setSavedODItems(new Set());
            setSavedODFormData({});
            // Findings too, but only when the BUILDING changes — on a unit
            // switch they are this building's outside/inside work and must
            // survive. Without this, an empty building inherited the previous
            // building's findings (applyProgressData only replaces them when
            // the new building has at least one) and the next autosave wrote
            // them into the wrong building's records.
            if (prevBuildingRef.current !== urlBuilding) {
                prevBuildingRef.current = urlBuilding;
                setPropertyFindings([]);
            }

            fetchData();
            loadSavedProgress();
        }
    }, [id, urlBuilding, activeInspectionUnit]);

    const applyProgressData = (progressList: any[]) => {
        if (!progressList) return;
        const outsideRec = progressList.find((p: any) => {
            const typeMatch = p.inspectionType === 'Outside';
            const bId = String(urlBuilding || '').toUpperCase();
            const pUnitId = String(p.unitId || '').toUpperCase();
            const pBldgId = String(p.buildingId || '').toUpperCase();
            const isB1Match = (bId === 'B1' || bId === 'BUILDING 1') && (pUnitId === 'B1' || pUnitId === 'BUILDING 1' || pBldgId === 'B1' || pBldgId === 'BUILDING 1');
            return typeMatch && (pUnitId === bId || pBldgId === bId || isB1Match);
        });

        const insideRec = progressList.find((p: any) => {
            const typeMatch = p.inspectionType === 'Inside';
            const bId = String(urlBuilding || '').toUpperCase();
            const pUnitId = String(p.unitId || '').toUpperCase();
            const pBldgId = String(p.buildingId || '').toUpperCase();
            const isB1Match = (bId === 'B1' || bId === 'BUILDING 1') && (pUnitId === 'B1' || pUnitId === 'BUILDING 1' || pBldgId === 'B1' || pBldgId === 'BUILDING 1');
            return typeMatch && (pUnitId === bId || pBldgId === bId || isB1Match);
        });
        
        if (outsideRec && outsideRec.responses) setOutsideStatuses(outsideRec.responses);
        if (insideRec && insideRec.responses) setInsideStatuses(insideRec.responses);

        if (activeInspectionUnit) {
            const unitRec = progressList.find((p: any) => {
                const pType = String(p.inspectionType || '').toLowerCase();
                const typeMatch = pType === 'unit' 
                    || pType === `unit_${activeInspectionUnit}`.toLowerCase()
                    || pType === `unit_${urlBuilding}_${activeInspectionUnit}`.toLowerCase();
                const uId = String(activeInspectionUnit).toUpperCase();
                const pUnitId = String(p.unitId).toUpperCase();
                const bId = String(urlBuilding || '').toUpperCase();
                const pBldgId = String(p.buildingId || '').toUpperCase();
                // A record saved before buildingId existed carries none, and
                // accepting that for *any* building made Building 1's unit 001
                // load as Building 2's unit 001 as well — which is why work
                // recorded in one building appeared in all of them. Those
                // legacy records can only have come from the first building,
                // so match them there and nowhere else, exactly as the
                // outside/inside lookup above already does.
                const isLegacyFirstBuilding = !pBldgId && (bId === 'B1' || bId === 'BUILDING 1');
                return typeMatch && pUnitId === uId && (pBldgId === bId || isLegacyFirstBuilding);
            });
            if (unitRec && unitRec.responses) setUnitStatuses(unitRec.responses);
        }

        const allFindings: any[] = [];
        progressList.forEach((p: any) => {
            if (p.inspectionData && Array.isArray(p.inspectionData.findings)) {
                allFindings.push(...p.inspectionData.findings);
            }
        });

        if (allFindings.length > 0) {
            const seen = new Set();
            const uniqueFindings = allFindings.filter((f: any) => {
                // Each saved deficiency carries its own id, and that id is the
                // only safe identity: most items offer a single deficiency
                // type, so any key built from names collapses two instances of
                // it — "saved three, only one survived". Copies of the same
                // finding (cache + server) share the id, so they still dedup.
                if (f.id) {
                    const key = `id:${f.id}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                }
                const bldg = (f.building && !['unknown', 'UNKNOWN-BUILDING'].includes(f.building)) ? f.building : (urlBuilding || 'unknown');
                const area = f.area || f.category || 'unknown';
                const unit = f.unit || '-';
                const item = f.item || f.deficiencyName || f.title || 'unknown';
                const title = f.title || f.description || f.deficiencyName || '';
                const key = `${bldg}|${area}|${unit}|${item}|${title}`.toLowerCase().trim();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            setPropertyFindings(uniqueFindings);
        }

        const restoredSnapshots: Record<string, any> = {};
        const restoredSavedODKeys = new Set<string>();
        progressList.forEach((p: any) => {
            if (p.inspectionData && p.inspectionData.odFormSnapshots) {
                const pType = String(p.inspectionType || '').toLowerCase();
                Object.entries(p.inspectionData.odFormSnapshots).forEach(([key, val]) => {
                    // Snapshots saved before keys carried the unit are
                    // `building:unit:item` (3 parts). They can only have come
                    // from the unit record they were stored in, so scope them
                    // to that record's unit rather than letting them answer
                    // for every unit's copy of the item.
                    let scopedKey = key;
                    const parts = key.split(':');
                    if (pType.startsWith('unit') && p.unitId && parts.length === 3 && parts[1] === 'unit') {
                        scopedKey = `${parts[0]}:unit:${p.unitId}:${parts[2]}`;
                    }
                    restoredSnapshots[scopedKey] = val;
                    restoredSavedODKeys.add(scopedKey);
                });
            }
        });
        if (Object.keys(restoredSnapshots).length > 0) {
            setSavedODFormData(restoredSnapshots);
            setSavedODItems(restoredSavedODKeys);
        }
    };

    const updateLocalCache = (type: string, responses: any, isComplete: boolean, unitId?: string, findings?: any[]) => {
        const localCacheKey = `cached_progress_${id}_${urlBuilding}`;
        let cachedList: any[] = [];
        try {
            const cachedDataStr = durableGet(localCacheKey);
            if (cachedDataStr) {
                cachedList = JSON.parse(cachedDataStr);
            }
        } catch (e) {
            console.error("Cache read error:", e);
        }

        let recordIndex = cachedList.findIndex((p: any) => {
            if (type === 'Outside' || type === 'Inside') {
                return p.inspectionType === type;
            } else {
                return String(p.inspectionType || '').toLowerCase().includes('unit_') && p.unitId === unitId;
            }
        });

        const newRecord = {
            propertyId: id,
            buildingId: urlBuilding,
            unitId: unitId || urlBuilding,
            inspectionType: type,
            responses: responses,
            inspectionData: {
                isComplete,
                // Live state is the truth here. This used to prefer the record's
                // previous findings, which meant a deficiency added after the
                // record first existed never reached the cache — offline, where
                // the cache is all there is, the second deficiency on an item
                // simply disappeared. It also resurrected removed ones.
                findings: findings ?? propertyFindings,
                // Only this record's slice (restore unions the slices): the
                // full map put every unit's photos into every cached record,
                // which is what made each 2-second cache write multi-MB.
                odFormSnapshots: snapshotsFor(
                    type === 'Outside' ? `${urlBuilding}:outside:`
                    : type === 'Inside' ? `${urlBuilding}:inside:`
                    : `${urlBuilding}:unit:${unitId}:`
                )
            }
        };

        if (recordIndex >= 0) {
            // Live state is the truth for snapshots too: merging the previous
            // record's snapshots over the current ones resurrected snapshots
            // the inspector had deleted with Remove, and after a reload the
            // item came back as 'OD' with the removed deficiency prefilled.
            cachedList[recordIndex] = newRecord;
        } else {
            cachedList.push(newRecord);
        }

        durableSet(localCacheKey, JSON.stringify(cachedList));
    };

    /**
     * After a save whose photos were uploaded, adopt the hosted URLs into
     * local state. The upload used to swap URLs only in the outgoing payload,
     * so a photo captured offline stayed a multi-megabyte data URL on the
     * device forever: every later save re-uploaded it and re-serialized it
     * into the cache, and the app ground to a halt once a property or two of
     * real photos had accumulated. One successful upload now retires the
     * data URL everywhere.
     */
    const adoptHostedPhotos = (original: any[] | undefined, swapped: any[] | undefined) => {
        if (!Array.isArray(original) || !Array.isArray(swapped)) return;
        const mapping = new Map<string, string>();
        original.forEach((f: any, i: number) => {
            const before = f?.imageUri;
            const after = swapped[i]?.imageUri;
            if (typeof before === 'string' && before.startsWith('data:') &&
                typeof after === 'string' && !after.startsWith('data:')) {
                mapping.set(before, after);
            }
        });
        if (mapping.size === 0) return;

        setPropertyFindings(prev => prev.map((f: any) =>
            mapping.has(f?.imageUri) ? { ...f, imageUri: mapping.get(f.imageUri) } : f));
        setSavedODFormData(prev => {
            let changed = false;
            const next: typeof prev = {};
            for (const [k, snap] of Object.entries(prev)) {
                const photos = Array.isArray((snap as any)?.photos)
                    ? (snap as any).photos.map((p: string) => {
                        if (mapping.has(p)) { changed = true; return mapping.get(p)!; }
                        return p;
                    })
                    : (snap as any)?.photos;
                next[k] = changed ? { ...(snap as any), photos } : snap;
            }
            return changed ? next : prev;
        });
        setPhotos(prev => prev.map(p => mapping.get(p) || p));
    };

    const queueForOfflineSync = (payload: any) => {
        try {
            const syncKey = `pending_sync_${id}`;
            const existingSyncStr = durableGet(syncKey);
            // An unreadable or non-array queue must not take the save down with
            // it: the deficiency itself is already stored, and failing here
            // told the inspector their work was lost when it was not.
            let existingSync: any[] = [];
            if (existingSyncStr) {
                try {
                    const parsed = JSON.parse(existingSyncStr);
                    if (Array.isArray(parsed)) existingSync = parsed;
                } catch {
                    // Start the queue again rather than refuse to queue at all.
                }
            }
            const filteredSync = existingSync.filter((item: any) => 
                !(item.inspection_type === payload.inspection_type && item.unit_id === payload.unit_id)
            );
            filteredSync.push(payload);
            durableSet(syncKey, JSON.stringify(filteredSync));
            setOfflineChangesCount(filteredSync.length);
        } catch (e: any) {
            console.error("Error queueing offline sync:", e);
            // Offline photos are stored inline as base64, so the queue can
            // outgrow the storage quota. Silently swallowing that loses the
            // inspector's work without them ever knowing.
            const quotaHit = e?.name === 'QuotaExceededError' || /quota/i.test(e?.message || '');
            // Only the sync queue failed here. The deficiency itself was
            // written before this runs, so say what is actually true rather
            // than telling an inspector their work is gone.
            toast.warning(
                quotaHit
                    ? "Device storage is full. Your work is saved on this device, but reconnect soon so it can sync."
                    : "Saved on this device, but it could not be queued for sync. Reconnect when you can.",
                { autoClose: 6000 }
            );
        }
    };

    const syncPendingChanges = async (showToastOnError = true) => {
        // The queue lives in the durable store's memory (no localStorage
        // mirror for bulky keys) — reading before hydration lands mistook
        // "not loaded yet" for "nothing queued" and skipped the sync.
        await ensureHydrated();
        const syncKey = `pending_sync_${id}`;
        let queue: any[] = [];
        try {
            const existingSyncStr = durableGet(syncKey);
            if (!existingSyncStr) return;
            queue = JSON.parse(existingSyncStr);
        } catch {
            // Never delete the queue because it could not be read. A truncated
            // write — easy to hit once photos are inline — would otherwise
            // throw away every deficiency waiting to sync, which is exactly
            // how a day's offline work could vanish on reconnecting.
            console.error('Offline queue is unreadable; leaving it in place for recovery.');
            toast.error('Some offline work could not be read. It has been kept on this device — please contact support before reinstalling.', { autoClose: 10000 });
            return;
        }
        if (!Array.isArray(queue) || queue.length === 0) return;

        toast.info(`Syncing ${queue.length} offline change${queue.length === 1 ? '' : 's'}...`);

        // One at a time: firing every queued save at once saturated the
        // connection and, with no timeout on any of them, hung the whole app.
        const remaining: any[] = [];
        let synced = 0;
        for (const payload of queue) {
            try {
                const swappedQueued = await uploadQueuedPhotos(payload);
                const res: any = await inspectionsAPI.saveProgress(swappedQueued);
                adoptHostedPhotos(payload?.inspectionData?.findings, swappedQueued?.inspectionData?.findings);
                // A 200 that says success:false is still a failure. Treating it
                // as synced dropped the record from the queue while the server
                // never kept it.
                if (res && res.success === false) throw new Error(res.message || 'Server rejected the change');
                synced++;
            } catch (error) {
                console.error('Error syncing an offline change:', error);
                remaining.push(payload);
            }
        }

        if (remaining.length === 0) {
            durableRemove(syncKey);
        } else {
            durableSet(syncKey, JSON.stringify(remaining));
        }
        setOfflineChangesCount(remaining.length);

        if (remaining.length === 0) {
            toast.success('All offline changes synced successfully!');
        } else if (showToastOnError) {
            toast.error(`${synced} synced, ${remaining.length} still pending. Will retry later.`);
        }

        try {
            await refreshCompletedUnits();
        } catch (e) {
            console.error('Could not refresh completed units after sync:', e);
        }
    };

    useEffect(() => {
        // Driven by whether the server actually answers, not by
        // navigator.onLine — which stays true in a dead spot and left the
        // offline warning on screen long after the signal came back.
        let first = true;
        const stopWatching = watchReachability((reachable) => {
            setIsOnline(reachable);
            if (first) { first = false; if (reachable) return; }
            if (reachable) {
                toast.success("Connection restored! Syncing offline changes...");
                syncPendingChanges(true);
            } else {
                toast.warn("You are offline. Progress will be saved locally.");
            }
        });
        
        // After hydration, or the queue (durable memory only now) reads empty
        // on a fresh launch and the pending work never syncs.
        void ensureHydrated().then(() => {
            try {
                const syncKey = `pending_sync_${id}`;
                const existingSyncStr = durableGet(syncKey);
                if (existingSyncStr) {
                    const existingSync = JSON.parse(existingSyncStr);
                    setOfflineChangesCount(existingSync.length);
                    if (navigator.onLine && existingSync.length > 0) {
                        syncPendingChanges(false);
                    }
                }
            } catch (e) {}
        });

        return () => {
            stopWatching();
        };
    }, [id]);

    const loadSavedProgress = async () => {
        // The cache lives in the durable store's memory now (no localStorage
        // mirror for photo-bearing keys), and that memory fills from
        // IndexedDB/the native file asynchronously — reading before it lands
        // mistook "not loaded yet" for "nothing saved" and opened the screen
        // empty offline.
        await ensureHydrated();
        const localCacheKey = `cached_progress_${id}_${urlBuilding}`;
        let cachedRecords: any[] = [];
        try {
            const cachedDataStr = durableGet(localCacheKey);
            if (cachedDataStr) {
                cachedRecords = JSON.parse(cachedDataStr);
                applyProgressData(cachedRecords);
            }
        } catch (e) {
            console.error("Cache load error:", e);
        }

        try {
            const res = await inspectionsAPI.getProgress({
                property_id: id,
                building_id: urlBuilding
            });

            // The server's answer must never wipe out richer local progress. The
            // old guard compared list lengths — but the API ignores building_id
            // and answers with every building's records, so its list was almost
            // always "longer" and overwrote the cache even when the local copy
            // held offline work the server had never seen. Coming back online
            // then showed the inspection empty while the queued findings later
            // synced into the report: present in the report, gone on screen.
            //
            // So merge per record instead: match records by identity and keep
            // whichever side knows more.
            if (res.progress && res.progress.length > 0) {
                const belongsHere = (p: any) => {
                    const type = String(p.inspectionType || '').toLowerCase();
                    const bId = String(urlBuilding || '').toLowerCase();
                    const pBldg = String(p.buildingId || '').toLowerCase();
                    const pUnit = String(p.unitId || '').toLowerCase();
                    if (type.startsWith('unit_') && /^unit_b\d+_/.test(type)) return type.startsWith(`unit_${bId}_`);
                    if (pBldg) return pBldg === bId;
                    // Older Outside/Inside saves carried the building in unit_id.
                    if (/^b\d+$/.test(pUnit) || pUnit.startsWith('building ')) return pUnit === bId;
                    // A record with no building anywhere can only predate
                    // multi-building support — it belongs to the first building.
                    return bId === 'b1' || bId === 'building 1';
                };
                const recKey = (p: any) =>
                    `${String(p.inspectionType || '').toLowerCase()}|${String(p.unitId || '').toLowerCase()}`;
                const richness = (p: any) =>
                    (p?.responses ? Object.values(p.responses).filter((v: any) => v !== null && v !== undefined).length : 0) +
                    (Array.isArray(p?.inspectionData?.findings) ? p.inspectionData.findings.length : 0) +
                    Object.keys(p?.inspectionData?.odFormSnapshots || {}).length;

                const merged = new Map<string, any>();
                res.progress.filter(belongsHere).forEach((p: any) => merged.set(recKey(p), p));
                (Array.isArray(cachedRecords) ? cachedRecords : []).filter(belongsHere).forEach((p: any) => {
                    const existing = merged.get(recKey(p));
                    if (!existing || richness(p) > richness(existing)) merged.set(recKey(p), p);
                });

                const mergedList = Array.from(merged.values());
                durableSet(localCacheKey, JSON.stringify(mergedList));
                applyProgressData(mergedList);
            }
        } catch (error) {
            console.error("Error loading progress from API:", error);
        }
        setProgressHydrated(true);
    };

    // One save at a time. The debounce only spaces out STARTS — with a photo
    // backlog a save can run long, the next debounced save piles on top, and
    // soon several rounds of uploads run at once: the phone freezes, and left
    // long enough the WebView is killed to a black screen. A save that fires
    // while one is in flight waits its turn instead; one queued re-run is
    // enough, since it reads the latest state when it finally runs.
    const saveInFlightRef = useRef(false);
    // Signature of the last successfully stored payload set. The debounce
    // fires on every render of its deps — including the setState a successful
    // save itself performs — so identical back-to-back saves were common:
    // each one re-serialized and re-POSTed everything. Identical data is a
    // no-op now.
    const lastSavedSignatureRef = useRef('');
    const saveQueuedRef = useRef(false);

    const saveCurrentProgress = async () => {
        if (!id || !user) return;
        if (saveInFlightRef.current) {
            saveQueuedRef.current = true;
            return;
        }
        saveInFlightRef.current = true;
        try {
            // Through the ref, never the closure: this function is recreated
            // every render, and the queued re-run below would otherwise call
            // the render it was created in — re-saving statuses from before
            // the save started and silently skipping everything answered
            // while it ran.
            await doSaveRef.current();
        } finally {
            saveInFlightRef.current = false;
            if (saveQueuedRef.current) {
                saveQueuedRef.current = false;
                void saveCurrentProgress();
            }
        }
    };

    // The slice of the snapshot map belonging to one record (see odSavedKey).
    const snapshotsFor = (prefix: string) => {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(savedODFormData)) {
            if (k.startsWith(prefix)) out[k] = v;
        }
        return out;
    };

    const doSaveCurrentProgress = async () => {
        if (!id || !user) return;
        
        try {
            const payloads = [];
            
            // Saving inspectionData here REPLACES the whole field on the backend (no deep
            // merge), so we must carry forward any findings already recorded for each
            // section — otherwise this debounced/auto save silently wipes out deficiencies
            // added via the Add-Deficiency modal. The same goes for odFormSnapshots:
            // leaving them out meant this autosave, firing two seconds after a
            // deficiency was recorded, erased the server's copy of it — the item
            // re-opened as "no existing deficiency record".
            const outsideFindings = propertyFindings.filter((f: any) => f.area === 'outside');
            const insideFindings = propertyFindings.filter((f: any) => f.area === 'inside');
            // Read the unit portion from refs, not the closed-over unitStatuses/activeInspectionUnit —
            // those reflect whichever unit was active when THIS debounce cycle was scheduled, which
            // can be stale by the time this actually runs a couple seconds later.
            const currentUnitId = activeInspectionUnitRef.current
            const currentUnitStatuses = unitStatusesRef.current
            const unitFindings = propertyFindings.filter((f: any) => f.area === 'unit' && f.unit === currentUnitId);

            if (Object.keys(outsideStatuses).length > 0) {
                const isComplete = outsideItemsList.every(item => outsideStatuses[item] !== null && outsideStatuses[item] !== undefined);
                const payload = {
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Outside',
                    responses: outsideStatuses,
                    building_id: urlBuilding,
                    // Only this record's slice of the snapshot map. The whole
                    // map used to ride in every record — three copies of every
                    // unit's photos on every save, growing without bound.
                    // Restore unions the slices back together.
                    inspectionData: { isComplete, findings: outsideFindings, odFormSnapshots: snapshotsFor(`${urlBuilding}:outside:`) }
                };
                payloads.push({ type: 'Outside', isComplete, payload });
            }

            if (Object.keys(insideStatuses).length > 0) {
                const isComplete = insideItemsList.every(item => insideStatuses[item] !== null && insideStatuses[item] !== undefined);
                const payload = {
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Inside',
                    responses: insideStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete, findings: insideFindings, odFormSnapshots: snapshotsFor(`${urlBuilding}:inside:`) }
                };
                payloads.push({ type: 'Inside', isComplete, payload });
            }

            if (Object.keys(currentUnitStatuses).length > 0 && currentUnitId) {
                const isComplete = unitItemsList.every(item => {
                    const status = currentUnitStatuses[item];
                    return status !== null && status !== undefined;
                });
                const payload = {
                    property_id: id,
                    unit_id: currentUnitId,
                    inspection_type: `unit_${urlBuilding}_${currentUnitId}`,
                    responses: currentUnitStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete, findings: unitFindings, odFormSnapshots: snapshotsFor(`${urlBuilding}:unit:${currentUnitId}:`) }
                };
                payloads.push({ type: `unit_${urlBuilding}_${currentUnitId}`, isComplete, payload, unitId: currentUnitId });
            }
            
            // Nothing changed since the last stored save? Then there is
            // nothing to write or send — this also swallows the echo save the
            // debounce schedules off a successful save's own setState.
            const signature = JSON.stringify(payloads);
            if (signature === lastSavedSignatureRef.current) return;

            payloads.forEach((p: any) => updateLocalCache(p.type, p.payload.responses, p.isComplete, p.unitId, p.payload.inspectionData.findings));

            if (navigator.onLine) {
                const promises = payloads.map(async p => {
                    const swapped = await uploadQueuedPhotos(p.payload);
                    const res = await inspectionsAPI.saveProgress(swapped);
                    adoptHostedPhotos(p.payload?.inspectionData?.findings, swapped?.inspectionData?.findings);
                    return res;
                });
                await Promise.all(promises);
                lastSavedSignatureRef.current = signature;
                await refreshCompletedUnits();
            } else {
                payloads.forEach(p => queueForOfflineSync(p.payload));
                lastSavedSignatureRef.current = signature;
            }
        } catch (error) {
            console.error("Error saving progress:", error);
            const currentUnitId = activeInspectionUnitRef.current
            const currentUnitStatuses = unitStatusesRef.current
            const outsideFindings = propertyFindings.filter((f: any) => f.area === 'outside');
            const insideFindings = propertyFindings.filter((f: any) => f.area === 'inside');
            const unitFindings = propertyFindings.filter((f: any) => f.area === 'unit' && f.unit === currentUnitId);

            if (Object.keys(outsideStatuses).length > 0) {
                const isComplete = outsideItemsList.every(item => outsideStatuses[item] !== null && outsideStatuses[item] !== undefined);
                queueForOfflineSync({
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Outside',
                    responses: outsideStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete, findings: outsideFindings, odFormSnapshots: snapshotsFor(`${urlBuilding}:outside:`) }
                });
            }
            if (Object.keys(insideStatuses).length > 0) {
                const isComplete = insideItemsList.every(item => insideStatuses[item] !== null && insideStatuses[item] !== undefined);
                queueForOfflineSync({
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Inside',
                    responses: insideStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete, findings: insideFindings, odFormSnapshots: snapshotsFor(`${urlBuilding}:inside:`) }
                });
            }
            if (Object.keys(currentUnitStatuses).length > 0 && currentUnitId) {
                const isComplete = unitItemsList.every(item => {
                    const status = currentUnitStatuses[item];
                    return status !== null && status !== undefined;
                });
                queueForOfflineSync({
                    property_id: id,
                    unit_id: currentUnitId,
                    inspection_type: `unit_${urlBuilding}_${currentUnitId}`,
                    responses: currentUnitStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete, findings: unitFindings, odFormSnapshots: snapshotsFor(`${urlBuilding}:unit:${currentUnitId}:`) }
                });
            }
        }
    };

    // Latest render's save, for the single-flight re-run, the unit-switch
    // flush, and the unmount flush below.
    const doSaveRef = useRef<() => Promise<void>>(() => Promise.resolve());
    doSaveRef.current = doSaveCurrentProgress;

    // A pending debounced save dies with the component — its timer is cleared
    // in the cleanup below. The cache writes inside the save are synchronous,
    // so one last call here lands the final two seconds of taps in durable
    // storage before the screen goes away.
    useEffect(() => {
        return () => { try { void doSaveRef.current(); } catch { /* best effort */ } };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            saveCurrentProgress();
        }, 2000); // Debounce save

        return () => clearTimeout(timer);
    }, [outsideStatuses, insideStatuses, unitStatuses, urlBuilding, activeInspectionUnit, propertyFindings, savedODFormData]);

    useEffect(() => {
        if (activeInspectionUnit) {
            loadSavedProgress();
        }
    }, [activeInspectionUnit]);

    /** The property may exist only in the offline queue, with no server record. */
    const propertyFromLocalCache = () => {
        try {
            const raw = durableGet('inspire_local_properties')
            const list = raw ? JSON.parse(raw) : []
            if (!Array.isArray(list)) return null
            return list.find((p: any) => String(p?._id || p?.id) === String(id)) || null
        } catch {
            return null
        }
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            // Settled, not all: offline the profile call always fails, and with
            // Promise.all that rejection took the property down with it and put
            // "Failed to load details" on screen even though the inspection had
            // loaded perfectly well from the local cache.
            const [propRes, userRes] = await Promise.allSettled([
                propertiesAPI.getById(id),
                authAPI.getMe()
            ])

            const prop = propRes.status === 'fulfilled' && propRes.value?.success && propRes.value.property
                ? propRes.value.property
                : propertyFromLocalCache()

            if (prop) {
                loadedPropertyRef.current = prop
                setProperty(prop)
            } else {
                reportLoadFailure()
            }

            if (userRes.status === 'fulfilled' && userRes.value?.success) {
                setUser(userRes.value.user)
            } else {
                try {
                    const cached = localStorage.getItem('user')
                    if (cached) setUser(JSON.parse(cached))
                } catch {}
            }
        } catch (error: any) {
            console.error('Error fetching data:', error)
            const prop = propertyFromLocalCache()
            if (prop) {
                loadedPropertyRef.current = prop
                setProperty(prop)
            } else {
                reportLoadFailure()
            }
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (section: 'outside' | 'inside' | 'unit', itemName: string, status: ItemStatus) => {
        // Intercept General Comment items → open simple note+image modal
        if (itemName.toLowerCase().includes('general comment')) {
            setCurrentGeneralSection(section);
            setCurrentGeneralItem(itemName);
            setGeneralNote('');
            setGeneralImages([]);
            setIsGeneralModalOpen(true);
            return;
        }

        if (status === 'OD') {
            const cleanCategory = itemName.split('. ')[1] || itemName;
            setCurrentSection(section);
            setCurrentModalItem(itemName);

            // If this item was previously saved, pre-fill the form with saved data
            const savedKey = odSavedKey(section, itemName);
            const previousData = savedODFormData[savedKey];
            if (previousData) {
                setOdForm(previousData.odForm);
                setSelectedDeficiency(previousData.selectedDeficiency);
                setSelectedSubcategory(null);
                setPhotos(previousData.photos);
                // Jump to step 4 (saved deficiency review) since this item already has one recorded
                setModalStep(4);
            } else {
                setOdForm(prev => ({
                    ...prev,
                    category: cleanCategory,
                    note: "",
                    location: getDefaultLocation(section),
                    healthAndSafety: "",
                    repairBy: "",
                    codeAndCompliance: ""
                }));
                setSelectedDeficiency(null);
                setSelectedSubcategory(null);
                setPhotos([]);
                setModalStep(1);
            }
            setIsODModalOpen(true);
            return;
        }

        if (section === 'outside') {
            setOutsideStatuses(prev => ({
                ...prev,
                [itemName]: prev[itemName] === status ? null : status
            }));
        } else if (section === 'inside') {
            setInsideStatuses(prev => ({
                ...prev,
                [itemName]: prev[itemName] === status ? null : status
            }));
        } else {
            setUnitStatuses(prev => ({
                ...prev,
                [itemName]: prev[itemName] === status ? null : status
            }));
        }

        // If status is being changed away from OD, clean up the saved finding
        if ((status as any) !== 'OD') {
            const savedKey = odSavedKey(section, itemName);
            setSavedODItems(prev => {
                const next = new Set(prev);
                next.delete(savedKey);
                return next;
            });
            // Also remove from state to keep summary in sync
            setPropertyFindings(prev => {
                const unitVal = section === 'unit' ? (activeInspectionUnit || unitsString) : '-';
                return prev.filter((f: any) => 
                    !(f.item === itemName && f.area === section && f.unit === unitVal && (f.building === urlBuilding || f.building === buildingName))
                );
            });
        }
    };
    const handleOpenReportPreview = async () => {
        setLoadingReportPreview(true)
        try {
            const propId = property?._id || id
            const reportData = await fetchNSPIREReportForProperty(propId)
            if (reportData) {
                setReportPreviewData(reportData)
            } else {
                toast.error("Unable to load report preview.")
            }
        } catch (error) {
            console.error("Error loading report preview:", error)
            toast.error("Unable to load report preview.")
        } finally {
            setLoadingReportPreview(false)
        }
    }

    const selectAll = (section: 'outside' | 'inside' | 'unit', status: ItemStatus) => {
        const list = section === 'outside' ? outsideItemsList : section === 'inside' ? insideItemsList : unitItemsList;
        const currentStatuses = section === 'outside' ? outsideStatuses : section === 'inside' ? insideStatuses : unitStatuses;

        // Items with saved OD findings are always locked to 'OD'. Matched via
        // odSavedKey — the old `section:` prefix never matched the stored keys
        // (they start with the building), so nothing was ever locked.
        const itemsWithFindings = new Set(
            list.filter(item => savedODItems.has(odSavedKey(section, item)))
        );

        // IMPORTANT: Only touch items that are either:
        // 1. Currently unset (null) — so we never overwrite user's existing selections
        // 2. Already set to THIS same status — so the toggle (undo) still works
        // This prevents "Select All OD" from wiping existing No OD / N/A selections
        const itemsToToggle = list.filter(item =>
            !itemsWithFindings.has(item) &&
            (currentStatuses[item] === null || currentStatuses[item] === undefined || currentStatuses[item] === status)
        );

        const allSelected = itemsToToggle.length > 0 && itemsToToggle.every(item => currentStatuses[item] === status);

        const newStatuses: Record<string, ItemStatus> = { ...currentStatuses };

        itemsToToggle.forEach(item => {
            newStatuses[item] = allSelected ? null : status;
        });

        // Always keep saved OD items as 'OD'
        itemsWithFindings.forEach(item => {
            newStatuses[item] = 'OD';
        });

        if (section === 'outside') setOutsideStatuses(newStatuses);
        else if (section === 'inside') setInsideStatuses(newStatuses);
        else setUnitStatuses(newStatuses);
    };

    const handleODModalClose = () => {
        setIsODModalOpen(false);
        setSelectedDeficiency(null);
        setSelectedSubcategory(null);
        setPhotos([]);
        setOdForm({ category: "", note: "", location: getDefaultLocation(currentSection), healthAndSafety: "", repairBy: "", codeAndCompliance: "" });
    };

    /** True when a finding belongs to the item the modal is open on. */
    const isCurrentItemFinding = (f: any) => {
        const unitVal = currentSection === 'unit' ? (activeInspectionUnit || unitsString) : '-';
        return f.item === currentModalItem && f.area === currentSection && f.unit === unitVal &&
            (f.building === urlBuilding || f.building === buildingName);
    };

    /**
     * Removes one deficiency, not the whole item. An item can carry several
     * deficiencies now, so the item only reverts to unanswered — and the modal
     * only closes — when the last one goes.
     */
    const handleRemoveODDeficiency = (target?: any) => {
        if (!currentSection || !currentModalItem) return;
        const savedKey = odSavedKey(currentSection, currentModalItem);

        const matchesTarget = (f: any) => !target ||
            (f.id && target.id ? f.id === target.id
                : f.title === target.title && f.nspireCode === target.nspireCode);

        const remaining = propertyFindings.filter((f: any) => !(isCurrentItemFinding(f) && matchesTarget(f)));
        const itemStillHasFindings = remaining.some(isCurrentItemFinding);
        setPropertyFindings(remaining);

        if (itemStillHasFindings) {
            toast.success('Deficiency removed.', { position: 'top-right' });
            return;
        }

        if (currentSection === 'outside') {
            setOutsideStatuses(prev => ({ ...prev, [currentModalItem]: null }));
        } else if (currentSection === 'inside') {
            setInsideStatuses(prev => ({ ...prev, [currentModalItem]: null }));
        } else {
            setUnitStatuses(prev => ({ ...prev, [currentModalItem]: null }));
        }

        setSavedODItems(prev => {
            const next = new Set(prev);
            next.delete(savedKey);
            return next;
        });
        setSavedODFormData(prev => {
            const next = { ...prev };
            delete next[savedKey];
            return next;
        });

        toast.success('Deficiency removed.', { position: 'top-right' });
        handleODModalClose();
    };

    const handleGeneralModalClose = () => {
        setIsGeneralModalOpen(false);
        setGeneralNote('');
        setGeneralImages([]);
        setCurrentGeneralSection(null);
        setCurrentGeneralItem(null);
    };

    const handleSaveGeneralComment = () => {
        if (currentGeneralSection && currentGeneralItem) {
            if (currentGeneralSection === 'outside') {
                setOutsideStatuses(prev => ({ ...prev, [currentGeneralItem!]: 'OD' }));
            } else if (currentGeneralSection === 'inside') {
                setInsideStatuses(prev => ({ ...prev, [currentGeneralItem!]: 'OD' }));
            } else {
                setUnitStatuses(prev => ({ ...prev, [currentGeneralItem!]: 'OD' }));
            }
            // The note and photo used to be discarded right here while the
            // toast said "saved" — they appeared in no payload, no cache and
            // no report. They are a finding like any other now, so the
            // autosave persists them and the report shows them.
            const unitVal = currentGeneralSection === 'unit' ? (activeInspectionUnit || unitsString) : '-';
            const gcPhotos = generalImages.length > 0 ? generalImages : [''];
            setPropertyFindings(prev => ([...prev, ...gcPhotos.map((photo, pi) => ({
                id: `DEF-${Date.now()}-${pi}`,
                imageUri: photo,
                title: `General Comment — ${currentGeneralItem}`,
                description: generalNote || currentGeneralItem,
                category: currentGeneralItem,
                building: buildingName,
                unit: unitVal,
                location: getDefaultLocation(currentGeneralSection),
                severity: 'Low',
                healthAndSafety: 'Low',
                repairBy: '30 Days',
                notes: generalNote,
                nspireCode: 'GEN-NOTE',
                status: 'Open',
                timestamp: new Date().toISOString(),
                area: currentGeneralSection,
                item: currentGeneralItem,
            }))]));
            const savedKey = odSavedKey(currentGeneralSection, currentGeneralItem);
            setSavedODItems(prev => new Set(prev).add(savedKey));
        }
        toast.success('General comment saved!', { position: 'top-right' });
        handleGeneralModalClose();
    };

    const handleGeneralImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setIsUploadingGeneralImage(true);
        try {
            for (const file of files) {
                const photo = await captureInspectionPhoto(file);
                setGeneralImages(prev => [...prev, photo]);
            }
        } catch (error) {
            console.error('Could not attach the photo:', error);
            toast.error('Could not attach that photo. Please try again.', { position: 'top-right' });
        } finally {
            setIsUploadingGeneralImage(false);
            if (generalFileInputRef.current) generalFileInputRef.current.value = '';
            if (generalGalleryInputRef.current) generalGalleryInputRef.current.value = '';
        }
    };

    const handleOpenSelection = (type: 'selected' | 'detail' | 'criteria') => {
        setSelectionType(type);
        if (type === 'selected') setSelectedSubcategory(null);
        setModalStep(3);
    };

    const handleDeficiencySelect = (def: DeficiencyDetail) => {
        setSelectedDeficiency(def);
        setSelectedSubcategory(null);
        setOdForm(prev => ({
            ...prev,
            healthAndSafety: def.healthAndSafety,
            repairBy: def.repairBy,
            codeAndCompliance: def.codeAndCompliance,
            location: def.location || prev.location // Auto-fill location if available
        }));
        setModalStep(2);
    };

    const [reportUrl, setReportUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // Every run of handleProceed records a new deficiency instance, so a tap
    // that lands while a save is still in flight must not run it again.
    // Offline the save takes long enough that an inspector taps Proceed three
    // or four times waiting for something to happen — each tap used to save
    // another copy ("10 deficiencies on this item", all identical). A ref, not
    // state: taps in the same frame beat a re-render.
    const proceedingRef = useRef(false);

    const handleProceed = async () => {
        if (proceedingRef.current) return;
        if (!selectedDeficiency) {
            toast.error("Please select a deficiency first");
            return;
        }
        proceedingRef.current = true;
        setIsAnalyzing(true);
        try {

        const analysisResult = {
            defect: selectedDeficiency?.selected || odForm.category,
            description: selectedDeficiency?.detail || selectedDeficiency?.selected || odForm.category,
            severity: odForm.healthAndSafety || 'Moderate',
            nspireCode: selectedDeficiency?.id || 'HS-12',
            complianceScore: 85
        };

        if (currentModalItem) {
            if (currentSection === 'outside') {
                setOutsideStatuses(prev => ({ ...prev, [currentModalItem]: 'No OD' }));
            } else if (currentSection === 'inside') {
                setInsideStatuses(prev => ({ ...prev, [currentModalItem]: 'No OD' }));
            } else {
                setUnitStatuses(prev => ({ ...prev, [currentModalItem]: 'No OD' }));
            }
        }

        const inspectionDataForSummary = {
            inspectionId: params.id,
            propertyId: property?._id,
            propertyName: property?.name,
            address: property?.address,
            inspectorId: user?.id || user?._id,
            inspectorName: user?.fullName,
            building: buildingName,
            buildingColumnHeader: columnHeaderName,
            currentUnit: currentSection === 'unit' ? activeInspectionUnit : '',
            unitNames: Object.keys(unitNames).length > 0 ? unitNames : undefined,
            findings: [{
                id: `DEF-${Date.now()}`,
                imageUri: photos[0],
                title: selectedDeficiency?.selected || odForm.category,
                description: selectedDeficiency?.detail || selectedDeficiency?.selected || odForm.category,
                category: odForm.category,
                building: buildingName,
                unit: currentSection === 'unit' ? (activeInspectionUnit || unitsString) : '-',
                location: odForm.location,
                severity: odForm.healthAndSafety || 'Moderate',
                healthAndSafety: odForm.healthAndSafety || 'Moderate',
                repairBy: odForm.repairBy || '30 Days',
                codeAndCompliance: odForm.codeAndCompliance,
                notes: odForm.note,
                nspireCode: selectedDeficiency?.id || 'HS-12',
                status: 'Open',
                timestamp: new Date().toISOString(),
                area: currentSection,
                item: currentModalItem
            }],
            reportUrl: null,
            complianceScore: 85,
            notes: odForm.note,
            startDate: new Date().toLocaleDateString(),
            startTime: new Date().toLocaleTimeString()
        };

        const type = currentSection === 'unit' ? `unit_${urlBuilding}_${activeInspectionUnit}` : (currentSection.charAt(0).toUpperCase() + currentSection.slice(1));
        const currentStatuses = currentSection === 'outside' ? outsideStatuses 
                             : currentSection === 'inside' ? insideStatuses 
                             : unitStatuses;

        const updatedStatuses: Record<string, any> = {
            ...currentStatuses,
            [(currentModalItem as string) || '']: 'OD'
        };

        if (currentSection === 'outside') setOutsideStatuses(updatedStatuses as Record<string, ItemStatus>);
        else if (currentSection === 'inside') setInsideStatuses(updatedStatuses as Record<string, ItemStatus>);
        else setUnitStatuses(updatedStatuses as Record<string, ItemStatus>);

        const isComplete = currentSection === 'outside'
            ? outsideItemsList.every(item => updatedStatuses[item] !== null && updatedStatuses[item] !== undefined)
            : currentSection === 'inside'
                ? insideItemsList.every(item => updatedStatuses[item] !== null && updatedStatuses[item] !== undefined)
                : currentSection === 'unit'
                    ? unitItemsList.every(item => updatedStatuses[item] !== null && updatedStatuses[item] !== undefined)
                    : false;

        const newFinding = inspectionDataForSummary.findings[0];
        // Always a new record. Matching "the same" deficiency and updating it
        // in place sounded right, but most items offer exactly one deficiency
        // type — so recording it twice (two broken signs on one building, each
        // with its own photo) silently replaced the first. In the field every
        // Proceed is a separate observed instance; it gets its own id, and
        // everything downstream dedups on that id.
        const mergedFindings = [...propertyFindings, newFinding];

        setPropertyFindings(mergedFindings);

        // Only this record's findings. Writing ALL areas' findings into
        // whichever record was being saved parked stale copies in inactive
        // unit records, and a deficiency removed elsewhere rose from those
        // copies on the next load. Declared outside the try so the offline
        // path below can cache and queue the very same payload.
        const unitScope = activeInspectionUnit || unitsString;
        const scopedProceedFindings = currentSection === 'unit'
            ? mergedFindings.filter((f: any) => f.area === 'unit' && f.unit === unitScope)
            : mergedFindings.filter((f: any) => f.area === currentSection);
        const proceedPayload = {
                property_id: property?._id || id || params.id,
                unit_id: currentSection === 'unit' ? activeInspectionUnit : urlBuilding,
                building_id: urlBuilding,
                inspection_type: type,
                responses: updatedStatuses,
                inspectionData: {
                    findings: scopedProceedFindings,
                    isComplete,
                    odFormSnapshots: {
                        ...(savedODFormData),
                        [odSavedKey(currentSection, currentModalItem as string)]: {
                            odForm: { ...odForm },
                            selectedDeficiency: selectedDeficiency,
                            photos: [...photos],
                            modalStep: 2
                        }
                    }
                }
            };

        try {
            // Any photo whose upload did not land stays a data URL; host it now
            // rather than carrying it inline in the inspection record.
            const swappedPayload = await uploadQueuedPhotos(proceedPayload);
            await inspectionsAPI.saveProgress(swappedPayload);
            adoptHostedPhotos(proceedPayload.inspectionData.findings, swappedPayload?.inspectionData?.findings);
        } catch (saveError) {
            console.warn("Failed to sync manual finding to server, caching and queueing locally:", saveError);
            // The deficiency must not live only in React state until a
            // debounce happens to fire — cache it and queue it right now, so
            // closing the screen in the next two seconds cannot lose it.
            try {
                queueForOfflineSync(proceedPayload);
                const cacheUnitId = currentSection === 'unit' ? (activeInspectionUnit || undefined) : undefined;
                updateLocalCache(type, updatedStatuses, isComplete, cacheUnitId, scopedProceedFindings);
            } catch (persistError) {
                console.error("Could not persist the finding locally:", persistError);
            }
        }

        toast.info("Item saved. You can continue with other items or view summary.", { position: "top-right" });
        
        setAnalysisResult(analysisResult);
        
        if (currentSection && currentModalItem) {
            const savedKey = odSavedKey(currentSection, currentModalItem);
            setSavedODItems(prev => new Set(prev).add(savedKey));
            setSavedODFormData(prev => ({
                ...prev,
                [savedKey]: {
                    odForm: { ...odForm },
                    selectedDeficiency: selectedDeficiency,
                    photos: [...photos],
                    modalStep: 2
                }
            }));
        }
        setModalStep(4);
        } finally {
            proceedingRef.current = false;
            setIsAnalyzing(false);
        }
    };

    // In the app the camera is opened natively: <input capture> opens the photo
    // library on iOS, and on Android it backgrounds the WebView, which can be
    // reclaimed and reload the page mid-capture. On the web these fall straight
    // through to the hidden file input.
    const pickDeficiencyPhoto = async (source: 'camera' | 'gallery') => {
        try {
            const url = await captureInspectionPhotoNative(source);
            if (url) { setPhotos([...photos, url]); return; }
        } catch (e) { console.error('Native capture failed:', e); }
        // The deficiency modal only has the one (camera) input to fall back on.
        fileInputRef.current?.click();
    };

    const pickGeneralPhoto = async (source: 'camera' | 'gallery') => {
        try {
            const url = await captureInspectionPhotoNative(source);
            if (url) { setGeneralImages(prev => [...prev, url]); return; }
        } catch (e) { console.error('Native capture failed:', e); }
        if (source === 'camera') generalFileInputRef.current?.click();
        else generalGalleryInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const photo = await captureInspectionPhoto(file);
            setPhotos([...photos, photo]);
        } catch (error) {
            console.error('Could not attach the photo:', error);
            toast.error('Could not attach that photo. Please try again.', { position: 'top-right' });
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Koke: the dropdown must open blank, not pre-filled with Basement/first entry.
    const getDefaultLocation = (_section: 'outside' | 'inside' | 'unit' | null) => '';

    const getFilteredDeficiencies = () => {
        if (!currentModalItem) return [];
        // Remove "1. " prefix and any trailing extra text
        const baseName = currentModalItem.replace(/^\d+\.\s+/, '').trim();

        // Mapping assignment — despite their names, insideDeficiencyMapping is built
        // from unitAppData.ts (Unit-tab data) and unitDeficiencyMapping is built from
        // insideAppData.ts (Inside-tab data), so the section→mapping wiring below is
        // intentionally crossed to match what each variable actually contains.
        // outside → outsideDeficiencyMapping
        // inside  → unitDeficiencyMapping (built from insideAppData.ts)
        // unit    → insideDeficiencyMapping (built from unitAppData.ts)
        const mapping = currentSection === 'outside'
            ? outsideDeficiencyMapping
            : currentSection === 'inside'
                ? unitDeficiencyMapping
                : insideDeficiencyMapping;

        // Try exact match first (case-insensitive)
        const exactKey = Object.keys(mapping).find(k => k.toLowerCase() === baseName.toLowerCase());
        if (exactKey) return mapping[exactKey];

        // Fallback to fuzzy match
        const matchedKey = Object.keys(mapping).find(k => {
            const nk = k.toLowerCase();
            const nb = baseName.toLowerCase();
            if (nb.includes(nk) || nk.includes(nb)) return true;
            
            // Special case for Paint to be more resilient
            if (nb.includes('paint') && nk.includes('paint')) return true;
            
            // Other keywords could be added here if needed
            return false;
        });

        return matchedKey ? mapping[matchedKey] : [];
    };

    const getDisplayDeficiencies = () => {
        const allDefs = getFilteredDeficiencies();
        if (selectionType === 'selected') {
            const seen = new Set();
            return allDefs.filter(def => {
                if (seen.has(def.selected)) return false;
                seen.add(def.selected);
                return true;
            });
        }
        if (selectionType === 'detail' && selectedDeficiency) {
            return allDefs.filter(def => def.selected === selectedDeficiency.selected);
        }
        return allDefs;
    };

    // Distinct subcategory names for the current item (e.g. Bathroom -> Bathtub and
    // Shower, Cabinet and Storage, Grab Bar...). Only meaningful for the top-level
    // "selected" picker — items with a single subcategory (or none) skip this step.
    const getSubcategoryOptions = () => {
        if (selectionType !== 'selected') return [];
        const seen = new Set<string>();
        const opts: string[] = [];
        getDisplayDeficiencies().forEach(def => {
            if (def.subcategory && !seen.has(def.subcategory)) {
                seen.add(def.subcategory);
                opts.push(def.subcategory);
            }
        });
        return opts;
    };

    const renderTable = (section: 'outside' | 'inside' | 'unit', items: string[], statuses: Record<string, ItemStatus>) => (
        <div className="bg-white p-3 sm:p-6 animate-in slide-in-from-top duration-300">
            {/* Mobile View - Card Layout - Bulk Actions */}
            <div className="block md:hidden mb-4 p-2 bg-gray-50 rounded-xl border border-gray-100">
                <div className="space-y-2">
                    <Button 
                        onClick={() => selectAll(section, 'No OD')} 
                        className={`w-full text-[10px] h-10 font-bold flex items-center justify-center gap-2 uppercase rounded-lg shadow-sm transition-all ${
                            (() => {
                                const toggleableItems = items.filter(i => !savedODItems.has(odSavedKey(section, i)));
                                return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'No OD');
                            })() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white'
                        }`}
                    >
                        <div className="w-4 h-4 bg-white/20 border border-white/40 flex items-center justify-center rounded">
                            {(() => {
                                const toggleableItems = items.filter(i => !savedODItems.has(odSavedKey(section, i)));
                                return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'No OD') ? <Check className="w-3 h-3 text-white" strokeWidth={4} /> : null;
                            })()}
                        </div>
                        Select All No OD
                    </Button>
                    {/* No bulk "Observe Deficiency": a deficiency needs its own
                        photo and details, so marking every item OD in one tap
                        only ever produced meaningless rows. OD is set per item. */}
                    <div className="grid grid-cols-1 gap-2 font-lexend">
                        <Button
                            onClick={() => selectAll(section, 'N/A')}
                            className={`w-full text-xs h-10 font-bold flex items-center justify-center gap-2 uppercase rounded-lg shadow-sm transition-all ${
                                (() => {
                                    const toggleableItems = items.filter(i => !savedODItems.has(odSavedKey(section, i)));
                                    return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'N/A');
                                })() ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white'
                            }`}
                        >
                            <div className="w-4 h-4 bg-white/20 border border-white/40 flex items-center justify-center rounded">
                                {(() => {
                                    const toggleableItems = items.filter(i => !savedODItems.has(odSavedKey(section, i)));
                                    return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'N/A') ? <Check className="w-3 h-3 text-white" strokeWidth={4} /> : null;
                                })()}
                            </div>
                            Select All N/A
                        </Button>
                    </div>
                </div>
            </div>

            <div className="block md:hidden space-y-3">
                {items.map((item, index) => {
                    const isGeneral = item.toLowerCase().includes('general comment');
                    return (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="font-bold text-xs text-gray-800 mb-3 text-left">{item}</div>
                            {isGeneral ? (
                                <button
                                    onClick={() => handleStatusChange(section, item, 'OD')}
                                    className="w-full py-3 rounded text-[11px] font-bold bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white shadow-sm transition-all uppercase tracking-wider"
                                >
                                    General Button
                                </button>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => handleStatusChange(section, item, 'No OD')}
                                        className={`py-2 px-2 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'No OD'
                                            ? 'bg-green-50 border-green-500 text-green-700'
                                            : 'bg-white border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        No OD
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(section, item, 'OD')}
                                        className={`py-2 px-2 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'OD'
                                            ? 'bg-red-50 border-red-500 text-red-700'
                                            : 'bg-white border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        OD
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(section, item, 'N/A')}
                                        className={`py-2 px-2 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'N/A'
                                            ? 'bg-gray-50 border-gray-400 text-gray-700'
                                            : 'bg-white border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        N/A
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto font-sans">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-100">
                            <th className="text-center py-4 px-4 text-xs font-black text-gray-900 uppercase">Outline Items</th>
                            <th className="py-2 px-2">
                                <Button onClick={() => selectAll(section, 'No OD')} className="w-full bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white text-[10px] h-8 font-bold flex items-center gap-1.5 px-3 uppercase">
                                    <div className="w-3 h-3 bg-white border border-cyan-800 flex items-center justify-center">
                                        {(() => {
                                            const toggleableItems = items.filter(i => !savedODItems.has(odSavedKey(section, i)));
                                            const isChecked = toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'No OD');
                                            return isChecked ? <Check className="w-2.5 h-2.5 text-cyan-800" strokeWidth={4} /> : null;
                                        })()}
                                    </div>
                                    Select All No OD
                                </Button>
                            </th>
                            {/* No bulk "Observe Deficiency" — OD is set per item,
                                with its own photo and details. */}
                            <th className="py-2 px-2"></th>
                            <th className="py-2 px-2">
                                <Button onClick={() => selectAll(section, 'N/A')} className="w-full bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white text-[10px] h-8 font-bold flex items-center gap-1.5 px-3 uppercase">
                                    <div className="w-3 h-3 bg-white border border-cyan-800 flex items-center justify-center">
                                        {(() => {
                                            const toggleableItems = items.filter(i => !savedODItems.has(odSavedKey(section, i)));
                                            const isChecked = toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'N/A');
                                            return isChecked ? <Check className="w-2.5 h-2.5 text-cyan-800" strokeWidth={4} /> : null;
                                        })()}
                                    </div>
                                    Select All N/A
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.map((item, index) => {
                            const isGeneral = item.toLowerCase().includes('general comment');
                            return (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4 text-xs font-bold text-gray-800 text-left">{item}</td>
                                    {isGeneral ? (
                                        <td colSpan={3} className="py-2 px-2 text-center">
                                            <button
                                                onClick={() => handleStatusChange(section, item, 'OD')}
                                                className="w-full py-2.5 rounded text-[11px] font-bold bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white shadow-sm transition-all uppercase tracking-wider"
                                            >
                                                General Button
                                            </button>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="py-1 px-2 text-center">
                                                <button onClick={() => handleStatusChange(section, item, 'No OD')} className={`w-full py-1.5 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'No OD' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                                    No OD
                                                </button>
                                            </td>
                                            <td className="py-1 px-2 text-center">
                                                <button onClick={() => handleStatusChange(section, item, 'OD')} className={`w-full py-1.5 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'OD' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                                    OD
                                                </button>
                                            </td>
                                            <td className="py-1 px-2 text-center">
                                                <button onClick={() => handleStatusChange(section, item, 'N/A')} className={`w-full py-1.5 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'N/A' ? 'bg-gray-50 border-gray-400 text-gray-700' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                                    N/A
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    useEffect(() => {
        try {
            const raw = localStorage.getItem(`counter_seed_${id}_${urlBuilding}`)
            if (raw) setCounterSeed(JSON.parse(raw))
        } catch { /* no seed yet */ }
    }, [id, urlBuilding])

    const outsideProgress = useMemo(() => {
        let completed = Object.values(outsideStatuses).filter(s => s !== null).length;
        if (!progressHydrated && completed === 0 && counterSeed) completed = counterSeed.o || 0;
        return { completed, percentage: Math.round((completed / (outsideItemsList.length || 1)) * 100) };
    }, [outsideStatuses, progressHydrated, counterSeed]);

    const insideProgress = useMemo(() => {
        let completed = Object.values(insideStatuses).filter(s => s !== null).length;
        if (!progressHydrated && completed === 0 && counterSeed) completed = counterSeed.i || 0;
        return { completed, percentage: Math.round((completed / (insideItemsList.length || 1)) * 100) };
    }, [insideStatuses, progressHydrated, counterSeed]);



    // Build the raw unit identifiers list
    const rawUnitIds = useMemo(() => {
        // How many units this building should hold according to the property
        // itself. The totalUnits query parameter is only a hint: it is lost when
        // a screen is restored from the offline cache, and it is written as 1
        // when an inspection is started before the property has finished
        // loading. Either way the unit picker then offered a single unit for a
        // building that has several. The property is the authority.
        // The unit list deliberately carries the building's WHOLE unit count,
        // not the coverage sample. The client's flow: with 12 units at 50%
        // coverage the sample is 2 per building, but an inspector may well do
        // a third — a picker capped at the sample blocked that in the field.
        // The % here reads against the total by the same decision ("pehle wala
        // sahi tha"); the property-wide engine stays sample-based.
        const buildingCount = Number(property?.buildings) || 0;
        const totalUnits = Number(property?.units) || 0;
        let expectedForThisBuilding = 0;
        if (buildingCount > 0 && totalUnits > 0) {
            const index = Math.max(0, parseInt(String(urlBuilding).replace(/\D/g, ''), 10) - 1) || 0;
            const base = Math.floor(totalUnits / buildingCount);
            const remainder = totalUnits % buildingCount;
            expectedForThisBuilding = base + (index < remainder ? 1 : 0);
        }

        const count = Math.max(urlTotalUnits, expectedForThisBuilding);
        if (count > 0) {
            return Array.from({ length: count }, (_, i) => `Unit ${String(i + 1).padStart(3, '0')}`);
        }
        if (units && units.length > 0) {
            return units.map(u => u.unitNumber || u.unitId || String(u));
        }
        return [];
    }, [urlTotalUnits, units, property, urlBuilding]);

    // Under Random/50% coverage the DENOMINATOR is this building's share of
    // the sample: pick Random on 6 units, get 3, finish 3 -> 100%, even though
    // the list keeps offering all 6 (inspecting beyond the sample is allowed,
    // it just can't be required). Full coverage (or none saved) keeps the
    // whole unit count.
    const sampledUnitsForBuilding = useMemo(() => {
        const buildingCount = Number(property?.buildings) || 0;
        const totalUnits = Number(property?.units) || 0;
        if (buildingCount <= 0 || totalUnits <= 0) return 0;
        let calculated = 0;
        try {
            const saved = durableGet(`property_coverage_${id}`);
            if (saved) calculated = Number(JSON.parse(saved)?.calculatedUnits) || 0;
        } catch { /* fall through to the server copy */ }
        if (!(calculated > 0)) calculated = Number(property?.calculatedUnits) || 0;
        if (!(calculated > 0) || calculated >= totalUnits) return 0;
        const index = Math.max(0, parseInt(String(urlBuilding).replace(/\D/g, ''), 10) - 1) || 0;
        const base = Math.floor(totalUnits / buildingCount);
        const remainder = totalUnits % buildingCount;
        const totals = Array.from({ length: buildingCount }, (_, i) => base + (i < remainder ? 1 : 0));
        const rawShares = totals.map(t => (t * calculated) / totalUnits);
        const floors = rawShares.map(Math.floor);
        let remaining = calculated - floors.reduce((sum, v) => sum + v, 0);
        const order = rawShares
            .map((r, i) => ({ i, frac: r - floors[i] }))
            .sort((a, b) => b.frac - a.frac);
        let guard = 0;
        while (remaining > 0 && guard < order.length * 3) {
            const { i } = order[guard % order.length];
            if (floors[i] < totals[i]) { floors[i]++; remaining--; }
            guard++;
        }
        return floors[index] || 0;
    }, [property, id, urlBuilding]);

    const unitProgress = useMemo(() => {
        // The active unit's completion is derived from live local state so this updates
        // instantly (same as Outside/Inside) instead of waiting on the debounced save + refetch.
        const activeUnitDone = !!activeInspectionUnit && unitItemsList.length > 0 &&
            unitItemsList.every(item => unitStatuses[item] !== null && unitStatuses[item] !== undefined);

        const completedSet = new Set(completedUnits.filter(u => u !== 'Outside' && u !== 'Inside'));
        if (activeUnitDone && activeInspectionUnit) completedSet.add(activeInspectionUnit);

        let completed = completedSet.size;
        const total = sampledUnitsForBuilding > 0
            ? sampledUnitsForBuilding
            : rawUnitIds.length;

        if (!progressHydrated && completed === 0 && counterSeed) completed = counterSeed.u || 0;

        // Outside and Inside move with every item answered; units counted only
        // whole units, so working through a unit showed 0% until the last item
        // and then jumped straight to 100%. Count the unit in progress as the
        // fraction of its items that have been answered.
        let partial = 0;
        if (activeInspectionUnit && !completedSet.has(activeInspectionUnit) && unitItemsList.length > 0) {
            const answered = unitItemsList.filter(
                item => unitStatuses[item] !== null && unitStatuses[item] !== undefined
            ).length;
            partial = answered / unitItemsList.length;
        }

        const percentage = total > 0 ? Math.min(100, Math.round(((completed + partial) / total) * 100)) : 0;
        // Inspecting beyond the sample must not read as "7 of 3".
        return { completed: Math.min(completed, total), percentage, total };
    }, [completedUnits, rawUnitIds, unitStatuses, activeInspectionUnit, unitItemsList, sampledUnitsForBuilding, progressHydrated, counterSeed]);

    // Persist the live counters for the next visit's instant header.
    useEffect(() => {
        if (!progressHydrated) return;
        try {
            safeSetItem(`counter_seed_${id}_${urlBuilding}`, JSON.stringify({
                o: Object.values(outsideStatuses).filter(s => s !== null).length,
                i: Object.values(insideStatuses).filter(s => s !== null).length,
                u: unitProgress.completed,
                ut: unitProgress.total,
            }));
        } catch { /* seed is a nicety, never worth failing over */ }
    }, [progressHydrated, outsideStatuses, insideStatuses, unitProgress, id, urlBuilding]);

    // Display unit names (edited names take priority)
    const unitsString = useMemo(() => {
        if (rawUnitIds.length === 0) return "No units found";
        return rawUnitIds.map(uid => unitNames[uid] || uid).join(", ");
    }, [rawUnitIds, unitNames]);

    // Open unit edit modal
    const openUnitEditModal = () => {
        const temp: Record<string, string> = {};
        rawUnitIds.forEach(uid => { temp[uid] = unitNames[uid] || uid; });
        setTempUnitNames(temp);
        setEditUnitsModalOpen(true);
    };

    // Save unit names
    const handleSaveUnitNames = () => {
        setUnitNames({ ...tempUnitNames });
        setEditUnitsModalOpen(false);
        toast.success('Unit names updated successfully!', { position: 'top-right' });
    };

    // Open building edit modal
    const openBuildingEditModal = () => {
        setTempBuildingName(buildingName);
        setEditBuildingModalOpen(true);
    };

    // Save building name
    const handleSaveBuildingName = () => {
        setBuildingName(tempBuildingName.trim() || 'B1');
        setEditBuildingModalOpen(false);
        toast.success('Building name updated successfully!', { position: 'top-right' });
    };

    if (loading) {
        return (
            <PortalLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
                </div>
            </PortalLayout>
        )
    }

    return (
        <PortalLayout>
            <div className="p-4 sm:p-6 lg:px-16 lg:py-4 w-full font-sans overflow-x-hidden">
                {/* The page chrome belongs to the categories screen only — a
                    section open means its own clean page, nothing stacked above. */}
                {sectionView === '' && (
                    <>
                        <div className="rounded-2xl bg-gradient-to-r from-[#0090C0] to-[#005E92] px-4 py-3.5 lg:py-4 mb-3 flex items-center justify-between gap-3 shadow-md">
                            <button onClick={() => router.back()} className="w-10 h-10 rounded-full hover:bg-white/15 flex items-center justify-center text-white shrink-0 transition-colors">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="bg-white rounded-2xl px-5 sm:px-7 py-2.5 flex items-center gap-2.5 shadow-lg min-w-0">
                                <ShieldCheck className="w-6 h-6 text-[#005E92] shrink-0" />
                                <span className="text-lg sm:text-2xl font-black text-[#0C3A5C] tracking-wide uppercase truncate">Inspection Categories</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    onClick={handleOpenReportPreview}
                                    disabled={loadingReportPreview}
                                    className="h-12 px-5 bg-[#003A66] hover:bg-[#072f52] text-white font-black rounded-xl uppercase tracking-wider text-sm flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    {loadingReportPreview ? '...' : 'Summary'}
                                </Button>
                                <Button
                                    onClick={() => router.push(`/dashboard/inspection/summary?propertyId=${property?._id || id}`)}
                                    className="h-12 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl uppercase tracking-wider text-sm flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                        {!isOnline && (
                            <div className="mb-3 flex justify-center">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                    Offline {offlineChangesCount > 0 && `(${offlineChangesCount} local)`}
                                </span>
                            </div>
                        )}
                    </>
                )}


                {/* Edit Building Name Modal */}
                {editBuildingModalOpen && (
                    <div className="fixed inset-0 bg-slate-100 z-50">
                        <div className="bg-white w-full h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                            <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-[#0E7490] to-[#006795] shadow-md shrink-0">
                                <button onClick={() => setEditBuildingModalOpen(false)} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-black text-white tracking-tight flex-1 min-w-0">Edit Building Name</h3>
                            </div>
                            <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />
                            <div className="p-5 flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Building Name</label>
                                <input
                                    type="text"
                                    value={tempBuildingName}
                                    onChange={(e) => setTempBuildingName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent text-sm"
                                    placeholder="Enter building name"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3 p-5 border-t bg-gray-50">
                                <button
                                    onClick={() => setEditBuildingModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveBuildingName}
                                    className="flex-1 px-4 py-3 bg-[#006795] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Unit Names Modal */}
                {editUnitsModalOpen && (
                    <div className="fixed inset-0 bg-slate-100 z-50">
                        <div className="bg-white w-full h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                            <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-[#0E7490] to-[#006795] shadow-md shrink-0">
                                <button onClick={() => setEditUnitsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-black text-white tracking-tight flex-1 min-w-0">Edit Unit Names</h3>
                            </div>
                            <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />
                            <div className="p-5 flex-1 overflow-y-auto space-y-3 max-w-2xl mx-auto w-full">
                                {rawUnitIds.map((uid) => (
                                    <div key={uid} className="flex items-center gap-3">
                                        <label className="text-sm font-semibold text-gray-500 w-20 shrink-0">Unit {uid}</label>
                                        <input
                                            type="text"
                                            value={tempUnitNames[uid] || ''}
                                            onChange={(e) => setTempUnitNames(prev => ({ ...prev, [uid]: e.target.value }))}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent text-sm"
                                            placeholder={`Unit ${uid}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 p-5 border-t bg-gray-50">
                                <button
                                    onClick={() => setEditUnitsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUnitNames}
                                    className="flex-1 px-4 py-3 bg-[#006795] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Save All
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ——— NSPIRE.ai-style flow: categories list ⇄ full-page sections ——— */}
                {sectionView === '' ? (
                    <>
                        <div className="rounded-2xl bg-gradient-to-r from-[#0E7490] to-[#006795] text-white px-4 py-3 lg:px-6 lg:py-3 mb-3 flex items-center gap-2.5 shadow-md">
                            <Building2 className="w-5 h-5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base font-extrabold tracking-wide uppercase truncate">Building No: {buildingName}</h2>
                                {property?.name && <p className="text-[11px] text-white/85 font-semibold truncate">{property.name}</p>}
                            </div>
                            <button
                                onClick={openBuildingEditModal}
                                className="p-1.5 rounded-full hover:bg-white/15 text-white/90 transition-colors shrink-0"
                                title="Edit building name"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>

                        {([
                            { sec: 'outside', title: 'OUTSIDE', subtitle: 'Areas affected by rain, snow, wind', icon: <CloudRain className="w-5 h-5 lg:w-8 lg:h-8 text-[#0E7490]" />, prog: outsideProgress, total: outsideItemsList.length },
                            { sec: 'inside', title: 'INSIDE', subtitle: 'Interior common area, utility closet, mechanical rooms', icon: <Home className="w-5 h-5 lg:w-8 lg:h-8 text-[#0E7490]" />, prog: insideProgress, total: insideItemsList.length },
                            { sec: 'unit', title: 'UNITS', subtitle: 'Individual unit inspections', icon: <LayoutGrid className="w-5 h-5 lg:w-8 lg:h-8 text-[#0E7490]" />, prog: unitProgress, total: unitProgress.total },
                        ] as const).map(({ sec, title, subtitle, icon, prog, total }) => (
                            <button
                                key={sec}
                                onClick={() => {
                                    if (sec === 'unit' && rawUnitIds.length === 0) {
                                        toast.info('This building has no units to inspect.', { position: 'top-right' })
                                        return
                                    }
                                    if (sec === 'unit' && !activeInspectionUnit) { setUnitSelectionPopupOpen(true); return }
                                    gotoSection(sec)
                                }}
                                className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 mb-3 lg:p-4 lg:mb-3 flex items-center gap-3 lg:gap-5 text-left hover:shadow-md active:scale-[0.99] transition-all"
                            >
                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">{icon}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm lg:text-xl font-extrabold text-slate-900 tracking-wide">{title}</p>
                                    <p className="text-xs lg:text-base text-slate-500 font-medium leading-snug">{subtitle}</p>
                                    <div className="mt-1.5 lg:mt-3 w-full h-1 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#0E7490] to-[#00C6D7] rounded-full transition-all duration-500" style={{ width: `${prog.percentage}%` }} />
                                    </div>
                                    <p className="mt-1 lg:mt-2 text-[11px] lg:text-sm font-bold text-[#0E7490]">{prog.completed}/{total} • {prog.percentage}% Complete</p>
                                </div>
                                <ChevronRight className="w-7 h-7 lg:w-9 lg:h-9 text-red-600 shrink-0" strokeWidth={3} />
                            </button>
                        ))}

                    </>
                ) : (
                    <div className="-mx-4 sm:mx-0 pb-6">
                        {/* Section page header */}
                        <div className="bg-gradient-to-r from-[#0E7490] to-[#006795] text-white px-4 sm:px-6 py-3 sm:rounded-2xl flex items-center gap-3 shadow-md">
                            <button onClick={() => gotoSection('')} className="p-1.5 -ml-1 rounded-full hover:bg-white/15 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="min-w-0 flex-1 text-center">
                                <h2 className="text-xl lg:text-2xl font-black leading-tight uppercase tracking-wide">
                                    {sectionView === 'outside' ? 'Outside' : sectionView === 'inside' ? 'Inside' : (activeInspectionUnit || 'Units')}
                                </h2>
                                <p className="text-xs text-white/80 font-medium">{buildingName} • {rawUnitIds.length} Units</p>
                            </div>
                            <Button
                                onClick={handleOpenReportPreview}
                                disabled={loadingReportPreview}
                                className="h-12 px-6 bg-[#003A66] hover:bg-[#072f52] text-white font-black rounded-xl uppercase tracking-wider text-sm flex items-center gap-2 shrink-0"
                            >
                                <FileText className="w-4 h-4" />
                                {loadingReportPreview ? '...' : 'Summary'}
                            </Button>
                        </div>

                        {/* Progress row */}
                        <div className="bg-white px-4 sm:px-6 py-3 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-base font-black text-slate-900 uppercase tracking-wide">Progress</p>
                                <p className="text-sm font-black text-[#0E7490]">
                                    {(sectionView === 'outside' ? outsideProgress : sectionView === 'inside' ? insideProgress : unitProgress).completed}
                                    /{sectionView === 'outside' ? outsideItemsList.length : sectionView === 'inside' ? insideItemsList.length : unitProgress.total}
                                    {' • '}
                                    {(sectionView === 'outside' ? outsideProgress : sectionView === 'inside' ? insideProgress : unitProgress).percentage}%
                                </p>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#0E7490] to-[#00C6D7] rounded-full transition-all duration-500" style={{ width: `${(sectionView === 'outside' ? outsideProgress : sectionView === 'inside' ? insideProgress : unitProgress).percentage}%` }} />
                            </div>
                        </div>

                        {/* Unit context strip */}
                        {sectionView === 'unit' && (
                            <div className="bg-white px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
                                {activeInspectionUnit && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E7490]/10 text-[#0E7490] text-xs font-bold">
                                        <User className="w-3.5 h-3.5" /> Inspecting: {activeInspectionUnit}
                                    </span>
                                )}
                                <button
                                    onClick={() => setUnitSelectionPopupOpen(true)}
                                    className="text-xs font-bold text-[#0E7490] bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Change Unit
                                </button>
                                {activeInspectionUnit && (
                                    <button
                                        onClick={() => {
                                            toast.success(`${activeInspectionUnit} saved!`, { position: 'top-right' });
                                            setUnitSelectionPopupOpen(true);
                                            void saveCurrentProgress()
                                                .then(() => refreshCompletedUnits())
                                                .catch((e) => console.error('Background submit sync failed:', e));
                                        }}
                                        className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Submit
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Select-all / legend bar */}
                        {(sectionView !== 'unit' || !!activeInspectionUnit) && (() => {
                            const sec = sectionView as 'outside' | 'inside' | 'unit'
                            const items = sec === 'outside' ? outsideItemsList : sec === 'inside' ? insideItemsList : unitItemsList
                            const statuses = sec === 'outside' ? outsideStatuses : sec === 'inside' ? insideStatuses : unitStatuses
                            const toggleable = items.filter(i => !savedODItems.has(odSavedKey(sec, i)))
                            const allNoOd = toggleable.length > 0 && toggleable.every(i => statuses[i] === 'No OD')
                            const allNa = toggleable.length > 0 && toggleable.every(i => statuses[i] === 'N/A')
                            return (
                                <div className="bg-white mx-4 sm:mx-0 mt-3 rounded-xl border border-slate-200 px-8 lg:px-12 py-2.5 flex items-center justify-between gap-4">
                                    <button onClick={() => selectAll(sec, 'No OD')} className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase tracking-wide">
                                        <span className={`w-7 h-7 rounded-md border-2 flex items-center justify-center ${allNoOd ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                            {allNoOd && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                                        </span>
                                        All No OD
                                    </button>
                                    <span className="flex items-center gap-2 text-lg font-black text-red-600 uppercase tracking-wide">
                                        Observe Deficiency
                                    </span>
                                    <button onClick={() => selectAll(sec, 'N/A')} className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase tracking-wide">
                                        <span className={`w-7 h-7 rounded-md border-2 flex items-center justify-center ${allNa ? 'bg-slate-600 border-slate-600' : 'border-slate-300'}`}>
                                            {allNa && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                                        </span>
                                        All NA
                                    </button>
                                </div>
                            )
                        })()}

                        {/* Item cards */}
                        <div className="px-4 sm:px-0 mt-3 space-y-2.5">
                            {sectionView === 'unit' && !activeInspectionUnit ? (
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-500 font-semibold">
                                    Select a unit first — <button onClick={() => setUnitSelectionPopupOpen(true)} className="text-[#0E7490] underline font-bold">Select Unit</button>
                                </div>
                            ) : (
                                (sectionView === 'outside' ? outsideItemsList : sectionView === 'inside' ? insideItemsList : unitItemsList).map((item, index) => {
                                    const sec = sectionView as 'outside' | 'inside' | 'unit'
                                    const statuses = sec === 'outside' ? outsideStatuses : sec === 'inside' ? insideStatuses : unitStatuses
                                    const isGeneral = item.toLowerCase().includes('general comment')
                                    return (
                                        <div key={item} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5">
                                            <div className="flex items-center gap-2.5 mb-3">
                                                <span className="w-7 h-7 rounded-full bg-sky-100 text-[#0E7490] flex items-center justify-center text-xs font-extrabold shrink-0">{index + 1}</span>
                                                <p className="text-base font-extrabold text-slate-900 leading-snug">{item}</p>
                                            </div>
                                            {isGeneral ? (
                                                <button
                                                    onClick={() => handleStatusChange(sec, item, 'OD')}
                                                    className="w-full py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#0E7490] to-[#006795] text-white shadow-sm active:scale-[0.99] transition-all"
                                                >
                                                    General Comment
                                                </button>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-3">
                                                    <button
                                                        onClick={() => handleStatusChange(sec, item, 'No OD')}
                                                        className={`py-2.5 rounded-lg text-base font-black border-2 transition-all active:scale-[0.98] ${statuses[item] === 'No OD' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                                                    >
                                                        No OD
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(sec, item, 'OD')}
                                                        className={`py-2.5 rounded-lg text-base font-black border-2 transition-all active:scale-[0.98] ${statuses[item] === 'OD' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                                                    >
                                                        OD
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(sec, item, 'N/A')}
                                                        className={`py-2.5 rounded-lg text-base font-black border-2 transition-all active:scale-[0.98] ${statuses[item] === 'N/A' ? 'bg-slate-100 border-slate-400 text-slate-700' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                                                    >
                                                        N/A
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Sticky Save Progress */}
                        <div className="px-4 mt-8 mb-6">
                            <div className="w-full max-w-2xl mx-auto flex gap-3">
                                <button
                                    onClick={() => {
                                        toast.success('Progress saved!', { position: 'top-right', autoClose: 1500 })
                                        void saveCurrentProgress().catch((e) => console.error('Save failed:', e))
                                        // Saving a section means you are done here — land back on
                                        // the categories screen, like the client asked.
                                        gotoSection('')
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-[#0E7490] to-[#006795] text-white text-base font-extrabold shadow-lg active:scale-[0.99] transition-all"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Save Progress
                                </button>
                                <button
                                    onClick={() => {
                                        void saveCurrentProgress().catch((e) => console.error('Save failed:', e))
                                        router.push(`/dashboard/inspection/summary?propertyId=${property?._id || id}`)
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-base font-extrabold shadow-lg active:scale-[0.99] transition-all"
                                >
                                    <FileText className="w-4 h-4" /> Export In Progress
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Unit Selection Popup - shown when user clicks Units section without a unit selected */}
            {unitSelectionPopupOpen && (
                <div className="fixed inset-0 bg-slate-100 lg:bg-slate-950/60 lg:backdrop-blur-sm z-50 flex flex-col lg:items-center lg:justify-center lg:p-8">
                    <div className="bg-white w-full h-full lg:h-auto lg:max-h-[85vh] lg:max-w-xl lg:rounded-3xl lg:border lg:border-slate-100 lg:shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#0E7490] to-[#006795] px-4 py-4 flex items-center gap-3 shadow-md">
                            <button
                                onClick={() => setUnitSelectionPopupOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors shrink-0"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-black text-white tracking-tight truncate">
                                    Select Unit
                                </h3>
                                <p className="text-xs text-white/80 mt-0.5 font-medium">
                                    {buildingName} • {buildingUnitNames.length > 0
                                        ? `${buildingUnitNames.length} units available`
                                        : 'Select a unit to inspect'}
                                </p>
                            </div>
                        </div>
                        <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />

                        {/* Progress bar placeholder */}
                        <div className="px-5 pt-4 pb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] h-2 rounded-full transition-all duration-500" style={{ width: '0%' }} />
                            </div>
                        </div>

                        {/* Unit List */}
                        <div className="p-5 overflow-y-auto flex-1 space-y-2 max-w-2xl mx-auto w-full">
                            {buildingUnitNames.length === 0 && (
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-600 font-bold">
                                    This building has no units to inspect.
                                </div>
                            )}
                            {buildingUnitNames.map((unitName, idx) => {
                                const displayName = popupUnitCustomNames[unitName] || unitName;
                                const isEditing = editingUnitIdx === idx;
                                return (
                                    <div
                                        key={unitName}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${activeInspectionUnit === displayName
                                            ? 'border-[#006795] bg-[#F1F7FE]'
                                            : 'border-gray-100 bg-white hover:border-[#006795]/30 hover:bg-[#F1F7FE]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${activeInspectionUnit === displayName ? 'bg-gradient-to-br from-[#00C6D7] to-[#006795] text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={editingUnitValue}
                                                            onChange={(e) => setEditingUnitValue(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    setPopupUnitCustomNames(prev => ({ ...prev, [unitName]: editingUnitValue.trim() || unitName }));
                                                                    setEditingUnitIdx(null);
                                                                }
                                                                if (e.key === 'Escape') setEditingUnitIdx(null);
                                                            }}
                                                            className="flex-1 px-2 py-1 border border-[#006795] rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006795]/30"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                setPopupUnitCustomNames(prev => ({ ...prev, [unitName]: editingUnitValue.trim() || unitName }));
                                                                setEditingUnitIdx(null);
                                                            }}
                                                            className="p-1 rounded-full bg-[#006795] text-white hover:bg-[#0a5670]"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setEditingUnitIdx(idx); setEditingUnitValue(displayName); }}
                                                            className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-[#006795] transition-colors shrink-0"
                                                            title="Rename unit"
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <p className={`text-[11px] font-medium ${completedUnits.includes(displayName) ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {completedUnits.includes(displayName) ? 'Completed' : 'Pending inspection'}
                                                </p>
                                            </div>
                                        </div>
                                        {!isEditing && (
                                            <button
                                                onClick={() => {
                                                    // Land anything still inside the 2s debounce window
                                                    // BEFORE the unit switches — the switch effect clears
                                                    // every status map and cancels the pending save, which
                                                    // silently reverted taps made in the last two seconds.
                                                    // Here the refs are still consistent (old unit + its
                                                    // statuses), and the cache writes are synchronous.
                                                    void doSaveRef.current()
                                                    setActiveInspectionUnit(displayName)
                                                    setUnitSelectionPopupOpen(false)
                                                    gotoSection('unit')
                                                }}
                                                className="bg-[#006795] hover:bg-[#00567a] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1 ml-3 shrink-0"
                                            >
                                                Start <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setUnitSelectionPopupOpen(false)}
                                className="w-full py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* General Comment Modal */}
            {isGeneralModalOpen && currentGeneralItem && (
                <div className="fixed inset-0 bg-slate-100 z-[1000]">
                    <div className="bg-white w-full h-full overflow-hidden animate-in slide-in-from-right duration-300 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-[#0E7490] to-[#006795] shadow-md shrink-0">
                            <button onClick={handleGeneralModalClose} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-black text-white tracking-tight truncate">{currentGeneralItem}</h3>
                                <p className="text-[11px] text-white/80 font-semibold">General Comment</p>
                            </div>
                        </div>
                        <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />

                        {/* Body */}
                        <div className="p-5 space-y-7 flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
                            {/* Note text area */}
                            <div>
                                <label className="block text-base font-black text-slate-900 uppercase tracking-wide mb-3">Note</label>
                                <textarea
                                    value={generalNote}
                                    onChange={(e) => setGeneralNote(e.target.value)}
                                    placeholder="Write your observation..."
                                    rows={5}
                                    className="w-full px-5 py-4 border-2 border-slate-700/70 rounded-2xl text-base text-gray-800 focus:outline-none focus:border-[#006795] resize-none transition-all"
                                />
                            </div>

                            {/* Image upload */}
                            <div>
                                <label className="block text-base font-black text-slate-900 uppercase tracking-wide mb-5">Pic</label>
                                {generalImages.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mb-5">
                                        {generalImages.map((img, i) => (
                                            <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                                                <img src={img} alt={`Photo ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setGeneralImages(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(
                                    <div className="flex items-start justify-evenly gap-4">
                                        {/* Take Photo */}
                                        <button
                                            onClick={() => pickGeneralPhoto('camera')}
                                            disabled={isUploadingGeneralImage}
                                            className="flex flex-col items-center gap-4 group"
                                        >
                                            <span className="w-28 h-28 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                                                {isUploadingGeneralImage ? (
                                                    <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E7490]" />
                                                ) : (
                                                    <Camera className="w-10 h-10 text-[#0E7490]" />
                                                )}
                                            </span>
                                            <span className="text-sm font-extrabold text-slate-900">Take Photo</span>
                                        </button>
                                        {/* Upload from Gallery */}
                                        <button
                                            onClick={() => pickGeneralPhoto('gallery')}
                                            disabled={isUploadingGeneralImage}
                                            className="flex flex-col items-center gap-4 group"
                                        >
                                            <span className="w-28 h-28 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                                                <ImageIcon className="w-10 h-10 text-[#0E7490]" />
                                            </span>
                                            <span className="text-sm font-extrabold text-slate-900">Choose from Gallery</span>
                                        </button>
                                    </div>
                                )}
                                {/* Camera capture input */}
                                <input
                                    ref={generalFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleGeneralImageUpload}
                                />
                                {/* Gallery / file picker input */}
                                <input
                                    ref={generalGalleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleGeneralImageUpload}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-4 p-5 border-t border-slate-100 bg-white shrink-0">
                            <button
                                onClick={handleGeneralModalClose}
                                className="flex-1 h-14 border-2 border-slate-800 bg-white rounded-full text-sm font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveGeneralComment}
                                className="flex-1 h-14 bg-[#0E7490] hover:bg-[#0c617a] text-white rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-[#0E7490]/20 transition-colors"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OD Modal - BULLETPROOF SCROLLING AND POSITIONING */}
            {isODModalOpen && (
                <div className="fixed inset-0 bg-slate-100 lg:bg-slate-950/60 lg:backdrop-blur-sm z-[1000] overflow-hidden isolate lg:flex lg:items-center lg:justify-center lg:p-8">
                    <Card className="font-lexend w-full h-full max-w-none bg-white rounded-none border-0 shadow-none lg:h-auto lg:max-h-[88vh] lg:max-w-2xl lg:rounded-3xl lg:border lg:border-slate-100 lg:shadow-2xl overflow-hidden animate-in slide-in-from-right lg:slide-in-from-top-4 duration-300 flex flex-col">
                        <div className="flex items-center gap-3 px-4 py-4 shrink-0 bg-gradient-to-r from-[#0E7490] to-[#006795] sticky top-0 z-20 shadow-md">
                            <button onClick={handleODModalClose} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-extrabold text-white tracking-tight truncate font-lexend">{currentModalItem}</h3>
                                <p className="text-[11px] text-white/80 font-semibold tracking-wide capitalize">{currentSection === 'unit' ? `Unit • ${activeInspectionUnit || ''}` : currentSection} — NSPIRE Inspection</p>
                            </div>
                            <span className="shrink-0 px-3 py-1.5 rounded-full bg-[#F84B5F] text-white text-[10px] font-black uppercase tracking-widest shadow-md">Observe Deficiency</span>
                        </div>
                        <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />

                        {(modalStep === 1 || modalStep === 2 || modalStep === 3) && (
                        <div className="flex-1 overflow-y-auto w-full custom-scrollbar overscroll-contain">
                        <div className="max-w-2xl mx-auto p-5 md:p-8 space-y-6">
                            {modalStep === 1 && (
                                <div className="relative min-h-[300px] py-8 px-6 flex flex-col items-center justify-between text-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#E8F4F8] via-[#F1F7FE] to-white">
                                    {/* Colorful accent strip */}
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00C6D7] via-[#006795] to-[#F84B5F]" />
                                    {/* Trust shield watermark */}
                                    <img
                                        src="/nationalstandard.png"
                                        alt=""
                                        aria-hidden="true"
                                        className="absolute inset-0 w-full h-full object-contain opacity-[0.32] scale-125 -translate-y-6 pointer-events-none select-none"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4F8]/40 via-white/30 to-white/70 pointer-events-none" />
                                    {/* Decorative color blooms, matching the marketing site's About section */}
                                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#006795]/10 rounded-full blur-3xl pointer-events-none" />
                                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#F84B5F]/10 rounded-full blur-3xl pointer-events-none" />

                                    <p className="relative z-10 text-lg font-extrabold text-slate-800 max-w-sm">{`No existing deficiency record for this item.`}</p>
                                    <Button onClick={() => setModalStep(2)} className="relative z-10 bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white font-black px-14 h-16 rounded-2xl shadow-lg shadow-[#006795]/20 uppercase tracking-widest text-base font-lexend border-0">Add New</Button>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300 pb-6">
                                    {/* 1. DEFICIENCY SELECTED - Full width dropdown */}
                                    <div>
                                        <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Deficiency Selected</label>
                                        <div onClick={() => handleOpenSelection('selected')} className={`w-full border rounded-2xl p-4 text-sm font-bold cursor-pointer transition-all flex justify-between items-center group font-lexend ${selectedDeficiency ? 'border-[#0E7490] border-2 bg-white text-slate-900 font-extrabold hover:border-[#0E7490]' : 'border-2 border-rose-300 bg-rose-50/40 text-[#7F1D1D] font-black hover:border-rose-400 hover:bg-rose-50 hover:scale-[1.01] hover:shadow-sm'}`}>
                                            <span>
                                                {selectedDeficiency ? selectedDeficiency.selected : "--Select--"}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 ${selectedDeficiency ? 'text-slate-400 group-hover:text-[#0E7490]' : 'text-rose-400'}`} />
                                        </div>
                                        {selectedDeficiency && (
                                            <button onClick={() => setSelectedDeficiency(null)} className="flex items-center gap-1 mt-2 text-xs font-semibold text-rose-500 hover:text-rose-600 font-lexend">
                                                <X className="w-3 h-3" /> Clear Selection
                                            </button>
                                        )}
                                    </div>

                                    {/* 2. DEFICIENCY DETAIL - Clickable Dropdown */}
                                    <div>
                                        <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Deficiency Detail</label>
                                        <div onClick={() => selectedDeficiency && handleOpenSelection('detail')} className={`w-full border rounded-2xl p-4 text-sm font-bold transition-all flex justify-between items-center group font-lexend ${selectedDeficiency ? 'cursor-pointer border-[#0E7490] border-2 bg-white text-slate-900 font-extrabold hover:border-[#0E7490]' : 'cursor-not-allowed border-2 border-rose-200 bg-rose-50/30 text-[#7F1D1D] font-black'}`}>
                                            <span>
                                                {selectedDeficiency ? selectedDeficiency.detail : "-- Select deficiency first --"}
                                            </span>
                                            {selectedDeficiency && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#0E7490]" />}
                                        </div>
                                      </div>

                                    {/* 4. PIC - Photo section (camera capture only) */}
                                    <div>
                                        <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Pic</label>

                                        {/* Image Grid */}
                                        {photos.length > 0 && (
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                {photos.map((p, i) => (
                                                    <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md group border-2 border-white">
                                                        <img src={p} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={`Photo ${i + 1}`} />
                                                        <button
                                                            onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                                                            className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="text-white w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div
                                            onClick={() => pickDeficiencyPhoto('camera')}
                                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#0E7490] hover:bg-cyan-50/30 transition-all cursor-pointer group"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mb-3 group-hover:bg-[#0E7490] transition-colors">
                                                <Camera className="w-7 h-7 text-[#0E7490] group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#0E7490]">Take Photo</span>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleFileUpload}
                                        />
                                    </div>

                                    {/* 5. NOTE - Text area */}
                                    <div>
                                        <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Work Order</label>
                                        <textarea
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-2xl p-4 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#0E7490] outline-none transition-all h-24 resize-none font-lexend"
                                            value={odForm.note}
                                            onChange={(e) => setOdForm({ ...odForm, note: e.target.value })}
                                            placeholder="Write your observation..."
                                        />
                                    </div>

                                    {/* 6. LOCATION + HEALTH & SAFETY - Side by side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Location</label>
                                            <select
                                                className="w-full border border-slate-100 bg-slate-50/50 rounded-2xl p-4 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#0E7490] transition-all cursor-pointer font-lexend"
                                                value={odForm.location}
                                                onChange={(e) => setOdForm({ ...odForm, location: e.target.value })}
                                            >
                                                <option value="">-- Select Location --</option>
                                                {(currentSection === 'outside' ? OUTSIDE_LOCATION_OPTIONS : currentSection === 'inside' ? INSIDE_LOCATION_OPTIONS : UNIT_LOCATION_OPTIONS).map((loc: string) => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Health & Safety</label>
                                            <div className={`w-full rounded-2xl p-4 text-xs font-semibold flex items-center min-h-[50px] font-lexend ${odForm.healthAndSafety === 'Life-Threatening' ? 'bg-rose-500 text-white border-rose-500 font-bold' :
                                                odForm.healthAndSafety === 'Severe' ? 'bg-orange-500 text-white border-orange-500 font-bold' :
                                                    odForm.healthAndSafety === 'Moderate' ? 'bg-amber-500 text-white border-amber-500 font-bold' :
                                                        odForm.healthAndSafety === 'Low' ? 'bg-emerald-500 text-white border-emerald-500 font-bold' :
                                                            'bg-slate-50/50 text-slate-700 border-slate-150'
                                                } border`}>
                                                {odForm.healthAndSafety || "Low"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 7. INSPECTION SCORING - Auto-calculated card */}
                                    <div>
                                        <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Inspection Scoring</label>
                                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm font-lexend">
                                            {/* Row 1: All Sample and Pts Lost (Raw) */}
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs font-black text-[#064B5E] uppercase tracking-wide mb-1">All Sample</p>
                                                    <div className="bg-slate-50/50 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-100">
                                                        {scoringResult?.allSample || totalSamples}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-extrabold text-[#064B5E] uppercase tracking-wide mb-1">Pts Lost (Raw)</p>
                                                    <div className="bg-slate-50/50 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-100">
                                                        {scoringResult?.ptsLostRaw?.toFixed(2) || '0.00'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2: Pts Lost and Possible Score */}
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs font-extrabold text-[#064B5E] uppercase tracking-wide mb-1">Pts Lost</p>
                                                    <div className="bg-slate-50/50 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-100">
                                                        {scoringResult?.ptsLost?.toFixed(2) || '0.00'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-extrabold text-[#064B5E] uppercase tracking-wide mb-1">Possible Score</p>
                                                    <div className="bg-slate-50/50 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-100">
                                                        {currentSection === 'outside' ? OUTSIDE_POSSIBLE_SCORE : currentSection === 'unit' ? UNIT_POSSIBLE_SCORE : INSIDE_POSSIBLE_SCORE}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 3: Max Pts Lost and Score */}
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs font-extrabold text-[#064B5E] uppercase tracking-wide mb-1">Max Pts Lost</p>
                                                    <div className="bg-slate-50/50 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-100">
                                                        {scoringResult?.maxPtsLost?.toFixed(2) || (currentSection === 'outside' ? '0.01' : '5.50')}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-extrabold text-[#064B5E] uppercase tracking-wide mb-1">Score</p>
                                                    <div className="bg-cyan-50/30 border border-cyan-150 rounded-xl px-3 py-2 text-sm font-extrabold text-[#0E7490]">
                                                        {scoringResult?.score?.toFixed(2) || (currentSection === 'outside' ? OUTSIDE_POSSIBLE_SCORE.toFixed(2) : currentSection === 'unit' ? UNIT_POSSIBLE_SCORE.toFixed(2) : INSIDE_POSSIBLE_SCORE.toFixed(2))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 4: # of Deficiencies */}
                                            <div>
                                                <p className="text-xs font-extrabold text-[#064B5E] uppercase tracking-wide mb-1"># of Deficiencies</p>
                                                <div className="bg-slate-50/50 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-100">
                                                    {scoringResult?.deficiencies || deficiencyCount}
                                                </div>
                                            </div>

                                            {/* Show override indicator for Outside inspections */}
                                            {currentSection === 'outside' && outsideScoringResult?.isDeficiencyOverride && (
                                                <div className="mt-2 pt-2 border-t border-slate-100">
                                                    <p className="text-[10px] font-semibold text-[#0E7490] uppercase tracking-wide">
                                                        * Severity determined by deficiency description override
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* STANDARD & INSPECTION PROTOCOL - visible when scrolled to bottom */}
                                    <div className="space-y-3 pt-2 pb-2">
                                        <div>
                                            <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Standard ✅</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsStandardModalOpen(true)}
                                                className="w-full bg-[#006795] hover:bg-[#005580] text-white font-black py-4 rounded-2xl uppercase text-base tracking-widest transition-colors shadow-md font-lexend"
                                            >
                                                Standard
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-[#7F1D1D] uppercase mb-2 tracking-wider font-lexend">Protocols</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsInspectionProtocolModalOpen(true)}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl uppercase text-base tracking-widest transition-colors shadow-md font-lexend"
                                            >
                                                Protocols
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalStep === 3 && (() => {
                                const subcategoryOptions = getSubcategoryOptions();
                                const showSubcategoryPicker = subcategoryOptions.length > 1 && !selectedSubcategory;
                                const visibleDefs = showSubcategoryPicker
                                    ? []
                                    : getDisplayDeficiencies().filter(def => !selectedSubcategory || def.subcategory === selectedSubcategory);
                                return (
                                <div className="space-y-4 animate-in slide-in-from-right duration-300 pb-10">
                                    <div className="flex items-center gap-4 mb-8 sticky top-0 bg-white/95 backdrop-blur-sm p-1 z-10">
                                        <button
                                            onClick={() => selectedSubcategory ? setSelectedSubcategory(null) : setModalStep(2)}
                                            className="w-10 h-10 border border-gray-100 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all text-blue-600 shadow-sm"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div>
                                            <label className="text-xs font-black text-[#064B5E] uppercase tracking-widest">Step 3 of 3</label>
                                            <h4 className="text-sm font-black text-gray-900 truncate">
                                                {showSubcategoryPicker ? 'Select Deficiency' : selectedSubcategory ? selectedSubcategory : `Select ${selectionType === 'selected' ? 'Deficiency' : selectionType}`}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {showSubcategoryPicker ? (
                                            subcategoryOptions.map((sub) => (
                                                <button
                                                    key={sub}
                                                    onClick={() => setSelectedSubcategory(sub)}
                                                    className="w-full p-5 text-left border rounded-2xl transition-all text-[11px] font-bold leading-relaxed flex items-center justify-between group shadow-sm border-gray-50 hover:border-blue-200 hover:bg-gray-50 text-gray-700"
                                                >
                                                    <span className="flex-1 pr-4">{sub}</span>
                                                    <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all text-blue-500" />
                                                </button>
                                            ))
                                        ) : visibleDefs.length > 0 ? visibleDefs.map((def: DeficiencyDetail) => (
                                            <button
                                                key={def.id}
                                                onClick={() => handleDeficiencySelect(def)}
                                                className={`w-full p-5 text-left border rounded-2xl transition-all text-[11px] font-bold leading-relaxed flex items-center justify-between group shadow-sm ${selectedDeficiency?.id === def.id ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-gray-50 hover:border-blue-200 hover:bg-gray-50 text-gray-700'}`}
                                            >
                                                <span className="flex-1 pr-4">{selectionType === 'selected' ? def.selected : selectionType === 'detail' ? def.detail : def.criteria}</span>
                                                <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all text-blue-500" />
                                            </button>
                                        )) : (
                                            <div className="py-20 text-center">
                                                <p className="text-sm font-bold text-gray-300 italic">No options found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                );
                            })()}
                        </div>
                        </div>
                        )}

                        {modalStep === 4 && (() => {
                            // Every deficiency saved on this item, not just the
                            // last one — Add Deficiency can stack several, and
                            // hiding all but the latest read as them being lost.
                            const itemFindings = propertyFindings.filter(isCurrentItemFinding);
                            const cards = itemFindings.length > 0 ? itemFindings : [{
                                imageUri: photos[0],
                                description: analysisResult?.description || analysisResult?.defect || selectedDeficiency?.detail || odForm.note || "Deficiency recorded",
                                severity: analysisResult?.severity || odForm.healthAndSafety || "Moderate",
                            }];
                            const severityClass = (sev: string) =>
                                sev.toLowerCase().includes('life') ? 'text-red-600' :
                                    sev.toLowerCase().includes('severe') ? 'text-orange-600' :
                                        sev.toLowerCase().includes('low') ? 'text-emerald-600' :
                                            'text-blue-600';
                            return (
                            <div className="flex-1 overflow-y-auto flex flex-col p-6 md:p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-0 bg-gradient-to-b from-[#CBEEFF] via-[#E8F6FD] to-[#D7F0FC]">
                                <div className="text-center mb-1">
                                    <img src="/logo.png?v=3" alt="NSPIRE" className="h-16 mx-auto mb-3 object-contain" />
                                    <h4 className="text-slate-900 font-black text-2xl font-lexend uppercase tracking-wide">Saved for Summary Report</h4>
                                    <p className="text-[#064B5E] text-sm font-bold mt-1">{cards.length} deficienc{cards.length === 1 ? 'y' : 'ies'} on this item</p>
                                </div>
                                {cards.map((f: any, idx: number) => (
                                <div key={f.id || idx} className="w-full bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-start gap-4 text-left">
                                    {f.imageUri && (
                                        <img src={f.imageUri} alt="Deficiency" loading="lazy" decoding="async" className="w-20 h-20 rounded-xl object-cover shrink-0 border-2 border-white shadow-sm" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-bold text-gray-800 text-sm leading-snug">
                                                {f.description || f.title || "Deficiency recorded"}
                                            </p>
                                            <button
                                                onClick={() => handleRemoveODDeficiency(f)}
                                                className="shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <p className={`mt-2 text-[11px] font-black uppercase tracking-widest ${severityClass(String(f.severity || f.healthAndSafety || ''))}`}>
                                            {f.severity || f.healthAndSafety || "Moderate"}
                                        </p>
                                    </div>
                                </div>
                                ))}

                                <Button
                                    onClick={() => {
                                        setOdForm(prev => ({ ...prev, note: "", location: getDefaultLocation(currentSection), healthAndSafety: "", repairBy: "", codeAndCompliance: "" }));
                                        setSelectedDeficiency(null);
                                        setPhotos([]);
                                        setModalStep(2);
                                    }}
                                    className="w-full bg-gradient-to-r from-[#00C6D7] to-[#006795] hover:opacity-90 text-white font-black h-14 rounded-xl shadow-lg uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Deficiency
                                </Button>

                                <Button
                                    onClick={() => {
                                        handleOpenReportPreview();
                                        handleODModalClose();
                                    }}
                                    disabled={loadingReportPreview}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black h-14 rounded-xl shadow-lg shadow-rose-600/20 uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
                                >
                                    <FileText className="w-4 h-4" />
                                    {loadingReportPreview ? 'Loading...' : 'View NSPIRE Summary'}
                                </Button>

                                {reportUrl && (
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL || ''}${reportUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button variant="outline" className="w-full font-black h-14 rounded-xl border-2 border-[#0E7490]/40 bg-white hover:bg-sky-50 text-[#064B5E] uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
                                            <FileText className="w-4 h-4" />
                                            Download Official Report
                                        </Button>
                                    </a>
                                )}

                                <Button onClick={handleODModalClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-14 rounded-xl shadow-lg shadow-emerald-600/20 uppercase text-[10px] tracking-widest">
                                    Continue Inspection
                                </Button>
                            </div>
                            );
                        })()}

                        {/* Only show modalStep 2 footer if not in step 4 */}
                        {modalStep === 2 && (
                            <div className="p-5 border-t bg-gray-50 shrink-0 flex gap-4 sticky bottom-0 z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
                                <Button variant="outline" onClick={handleODModalClose} className="flex-1 font-black h-14 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">Cancel</Button>
                                <Button
                                    onClick={handleProceed}
                                    disabled={isAnalyzing || !selectedDeficiency}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-xl shadow-lg shadow-blue-100 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Proceed'}
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* How to Inspect Popup */}
            {/* ====== Standard Modal ====== */}
            {isStandardModalOpen && (
                <div className="fixed inset-0 bg-slate-100 z-[1200]">
                    <Card className="relative w-full h-full max-w-none bg-white rounded-none border-0 shadow-none overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="px-4 py-4 flex items-center gap-3 bg-gradient-to-r from-[#0E7490] to-[#006795] shadow-md shrink-0 sticky top-0 z-10">
                            <button onClick={() => setIsStandardModalOpen(false)} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2 flex-1 min-w-0">
                                Standard <span>✅</span>
                            </h3>
                        </div>
                        <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />
                        <div className="p-6 md:p-8 overflow-y-auto space-y-4 custom-scrollbar flex-1 max-w-2xl mx-auto w-full">
                            {selectedDeficiency?.criteria ? (
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                    {selectedDeficiency.criteria.split('\n').map((line: string, i: number) => {
                                        const trimmed = line.trim()
                                        if (!trimmed) return <div key={i} className="h-2" />
                                        return <p key={i} className="text-sm text-gray-700 font-medium leading-relaxed">{trimmed}</p>
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic text-center py-12">No standard criteria available. Select a deficiency first.</p>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <Button variant="outline" onClick={() => setIsStandardModalOpen(false)} className="w-full font-black h-12 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-600 uppercase text-[10px] tracking-widest">
                                Close
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* ====== Inspection Protocol (International) Modal ====== */}
            {isInspectionProtocolModalOpen && (
                <div className="fixed inset-0 bg-slate-100 z-[1200]">
                    <Card className="relative w-full h-full max-w-none bg-white rounded-none border-0 shadow-none overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="px-4 py-4 flex items-center gap-3 bg-gradient-to-r from-[#0E7490] to-[#006795] shadow-md shrink-0 sticky top-0 z-10">
                            <button onClick={() => setIsInspectionProtocolModalOpen(false)} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2 flex-1 min-w-0">
                                Inspection Protocol <span>✅</span>
                            </h3>
                        </div>
                        <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />
                        <div className="p-6 md:p-8 overflow-y-auto space-y-3 custom-scrollbar flex-1 max-w-2xl mx-auto w-full">
                            {selectedDeficiency ? (() => {
                                const protocolText = lookupCodeReference(currentSection, currentModalItem || '', selectedDeficiency.selected)
                                    || selectedDeficiency.codeAndCompliance
                                    || 'No inspection protocol available.'
                                return (
                                    <>
                                        <p className="font-black text-green-700 text-sm flex items-center gap-2">✅ INSPECTION PROTOCOL</p>
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
                                            {protocolText.split('\n').map((line: string, i: number) => {
                                                const trimmed = line.trim()
                                                if (!trimmed) return <div key={i} className="h-1" />
                                                const isHeader = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]/u.test(trimmed) || /^\d+\.\s/.test(trimmed)
                                                if (isHeader) return <p key={i} className="font-black text-gray-900 mt-3 first:mt-0 text-sm">{trimmed}</p>
                                                if (trimmed.startsWith('•') || trimmed.startsWith('-')) return <p key={i} className="text-gray-700 ml-3 font-medium text-sm">{trimmed}</p>
                                                return <p key={i} className="text-gray-600 font-normal text-sm leading-relaxed">{trimmed}</p>
                                            })}
                                        </div>
                                    </>
                                )
                            })() : (
                                <p className="text-sm text-gray-400 italic text-center py-12">No protocol available. Select a deficiency first.</p>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <Button variant="outline" onClick={() => setIsInspectionProtocolModalOpen(false)} className="w-full font-black h-12 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-600 uppercase text-[10px] tracking-widest">
                                Close
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {isHowToInspectOpen && (
                <div className="fixed inset-0 bg-slate-100 z-[1100]">
                    <Card className="relative w-full h-full max-w-none bg-white rounded-none border-0 shadow-none overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="px-4 py-4 flex items-center gap-3 bg-gradient-to-r from-[#0E7490] to-[#006795] shadow-md shrink-0 sticky top-0 z-10">
                            <button onClick={() => setIsHowToInspectOpen(false)} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-base font-black text-white uppercase tracking-tight flex-1 min-w-0 truncate">How To Inspect IRU, BRU, Local</h3>
                        </div>
                        <div className="h-1 shrink-0 bg-gradient-to-r from-[#F84B5F] via-[#00C6D7] to-[#006795]" />
                        <div className="p-6 md:p-8 overflow-y-auto space-y-2 custom-scrollbar flex-1 max-w-2xl mx-auto w-full">
                            {(() => {
                                const guideText = selectedDeficiency
                                    ? lookupCodeReference(currentSection, currentModalItem || '', selectedDeficiency.selected)
                                    : ''
                                const fallbackText = selectedDeficiency?.codeAndCompliance || 'No inspection guide available.'
                                const content = guideText || fallbackText

                                return content.split('\n').map((line, i) => {
                                    const trimmed = line.trim()
                                    if (!trimmed) return <div key={i} className="h-1" />

                                    const isHeader = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]/u.test(trimmed)
                                    if (isHeader) {
                                        return (
                                            <p key={i} className="font-black text-[#0E7490] mt-3 first:mt-0 text-sm">
                                                {trimmed}
                                            </p>
                                        )
                                    }

                                    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                                        return (
                                            <p key={i} className="text-gray-700 ml-3 font-medium text-sm">
                                                {trimmed}
                                            </p>
                                        )
                                    }

                                    return (
                                        <p key={i} className="text-gray-600 font-normal text-sm">
                                            {trimmed}
                                        </p>
                                    )
                                })
                            })()}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsHowToInspectOpen(false)}
                                className="flex-1 font-black h-12 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-600 uppercase text-[10px] tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setIsHowToInspectOpen(false)}
                                className="flex-1 font-black h-12 rounded-xl bg-[#6B8ED6] hover:bg-[#5a7dc4] text-white uppercase text-[10px] tracking-widest shadow-md border-0"
                            >
                                Proceed
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {reportPreviewData && (
                <ReportPreviewModal report={reportPreviewData} onClose={() => setReportPreviewData(null)} />
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                body.modal-open {
                    overflow: hidden !important;
                }
            `}</style>
        </PortalLayout>
    )
}
