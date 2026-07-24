/**
 * NSPIRE Report Types for Web Frontend
 * HUD National Standards for the Physical Inspection of Real Estate
 * Ported from mobile app types for web/mobile parity
 */

// Severity levels per NSPIRE standards
export type DeficiencySeverity = 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';

// Inspection type
export type InspectionType = 'General NSPIRE' | 'Follow-up' | 'Complaint' | 'Special';

// Building/Unit type for inspection data
export type InspectionUnitType = 'Building' | 'Unit' | 'Site' | 'Common Area';

// Deficiency status
export type DeficiencyStatus = 'Open' | 'In Progress' | 'Resolved' | 'Verified';

/**
 * Inspection Header & Metadata
 */
export interface InspectionMetadata {
    inspectionNo: string;
    inspectionType: InspectionType;
    escortName: string;
    propertyAddress: string;
    propertyName: string;
    propertyId: string;

    // Timeline
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    reportCreatedDate: string;

    // Scores
    preliminaryScore: number;
    finalScore: number;
    calculatedScore: number;
    healthSafetyThreshold: number;
    physicalConditionThreshold: number;

    // Inspector Information
    inspectorName: string;
    inspectorId: string;
    inspectorSignature?: string;
}

/**
 * Building/Unit Inspection Data Table
 */
export interface InspectionDataRow {
    type: InspectionUnitType;
    propertyTotal: number;
    sampleSize: number;
    totalUnitsInspected: number;
}

/**
 * Occupancy Information
 */
export interface OccupancyInfo {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    occupancyRate: number;
    assistedUnits?: number;
    marketRateUnits?: number;
}

/**
 * Deficiency Entry - Main Table Row (HUD NSPIRE Format)
 */
export interface DeficiencyEntry {
    id: string;

    // Deficiency Picture
    imageUri?: string;
    imagePlaceholder?: boolean;

    // Location Details
    building: string;
    unit: string;
    room: string;
    area: string;

    // Deficiency Information
    deficiencyName: string;
    nspireCode: string;
    codeReference?: string;
    note?: string;

    // Technical Details
    deficiencyDetails: string;

    // Inspector Notes
    comments: string;
    isGeneralComment?: boolean;

    // Scoring Impact
    deductionPts: number;

    // History
    repeatIndicator: boolean;
    previousInspectionDate?: string;

    // Severity Classification
    severity: DeficiencySeverity;

    // Health & Safety Classification (HUD required)
    healthAndSafety: string;

    // Required Repair Timeline (HUD required)
    repairTimeline: string;

    // Code and Compliance Reference
    codeAndCompliance?: string;

    // Additional metadata
    inspectedDate: string;
    inspectedTime: string;
    inspectorId: string;

    // Corrective Action
    correctiveAction?: string;
    dueDate?: string;
    status: DeficiencyStatus;
}

/**
 * Deficiency Summary by Severity
 */
export interface DeficiencySummary {
    lifeThreatening: number;
    severe: number;
    moderate: number;
    low: number;
    total: number;

    // Additional breakdowns
    byBuilding: Record<string, number>;
    byCategory: Record<string, number>;
    repeatDeficiencies: number;
    newDeficiencies: number;
}

/**
 * Category Breakdown
 */
export interface CategoryBreakdown {
    category: string;
    nspireSection: string;
    deficiencyCount: number;
    totalDeductions: number;
    lifeThreatening: number;
    severe: number;
    moderate: number;
    low: number;
}

/**
 * Complete NSPIRE Inspection Report
 */
export interface NSPIREInspectionReport {
    // Report Identification
    reportId: string;
    version: string;
    generatedAt: string;

    // Header & Metadata
    metadata: InspectionMetadata;

    // Inspection Data Tables
    inspectionData: InspectionDataRow[];
    occupancyInfo: OccupancyInfo;

    // Deficiency Summary (shown at beginning)
    summary: DeficiencySummary;
    categoryBreakdown: CategoryBreakdown[];

    // Main Deficiency Table
    deficiencies: DeficiencyEntry[];

    // Additional Information
    generalComments?: string;
    recommendations?: string[];

    // Certification
    certification?: ReportCertification;
}

/**
 * Report Certification
 */
export interface ReportCertification {
    certifiedBy: string;
    certificationDate: string;
    digitalSignature?: string;
    certificationStatement: string;
}

/**
 * PDF Generation Options
 */
export interface PDFGenerationOptions {
    includeImages: boolean;
    imageQuality: 'low' | 'medium' | 'high';
    colorCodingSeverity: boolean;
    includeSummaryPage: boolean;
    includeDetailedDeficiencies: boolean;
    includeCertification: boolean;
    pageSize: 'letter' | 'a4' | 'legal';
    orientation: 'portrait' | 'landscape';
    headerLogo?: string;
    footerText?: string;
}

/**
 * NSPIRE Standard Codes Reference
 */
export const NSPIRE_CODES: Record<string, string> = {
    // Site
    'S-1': 'Fencing/Gates',
    'S-2': 'Grounds/Walkways',
    'S-3': 'Lighting - Exterior',
    'S-4': 'Mailboxes',
    'S-5': 'Parking Lots/Driveways',
    'S-6': 'Play Areas',
    'S-7': 'Refuse Disposal',
    'S-8': 'Retaining Walls',
    'S-9': 'Signs',
    'S-10': 'Storm Drainage',

    // Building Exterior
    'BE-1': 'Doors',
    'BE-2': 'Fire Escapes',
    'BE-3': 'Foundations',
    'BE-4': 'Lighting - Exterior',
    'BE-5': 'Roofs',
    'BE-6': 'Walls',
    'BE-7': 'Windows',

    // Building Systems
    'BS-1': 'Domestic Water',
    'BS-2': 'Electrical System',
    'BS-3': 'Elevators',
    'BS-4': 'Emergency/Fire',
    'BS-5': 'HVAC',
    'BS-6': 'Sanitary System',

    // Common Areas
    'CA-1': 'Basement/Garage',
    'CA-2': 'Closets/Utility',
    'CA-3': 'Community Room',
    'CA-4': 'Day Care',
    'CA-5': 'Halls/Corridors',
    'CA-6': 'Kitchens',
    'CA-7': 'Laundry Room',
    'CA-8': 'Lobby',
    'CA-9': 'Office',
    'CA-10': 'Other',
    'CA-11': 'Patio/Porch/Balcony',
    'CA-12': 'Restrooms',
    'CA-13': 'Stairs',
    'CA-14': 'Storage',

    // Unit
    'U-1': 'Bathroom',
    'U-2': 'Call-for-Aid',
    'U-3': 'Ceiling',
    'U-4': 'Doors',
    'U-5': 'Electrical',
    'U-6': 'Floors',
    'U-7': 'GFI/AFCI',
    'U-8': 'Hot Water Heater',
    'U-9': 'HVAC',
    'U-10': 'Kitchen',
    'U-11': 'Lighting',
    'U-12': 'Outlets/Switches',
    'U-13': 'Patio/Porch/Balcony',
    'U-14': 'Smoke Detectors',
    'U-15': 'Stairs',
    'U-16': 'Walls',
    'U-17': 'Windows',

    // Health & Safety
    'HS-1': 'Air Quality - Mold',
    'HS-2': 'Air Quality - Propane/Gas',
    'HS-3': 'Air Quality - Sewer Odor',
    'HS-4': 'Electrical Hazards',
    'HS-5': 'Emergency/Fire - CO Detectors',
    'HS-6': 'Emergency/Fire - Fire Extinguisher',
    'HS-7': 'Emergency/Fire - Smoke Detectors',
    'HS-8': 'Flammable Materials',
    'HS-9': 'Garbage/Debris - Inside',
    'HS-10': 'Garbage/Debris - Outside',
    'HS-11': 'Handrail',
    'HS-12': 'Hazards - Other',
    'HS-13': 'Hazards - Sharp Edges',
    'HS-14': 'Hazards - Tripping',
    'HS-15': 'Infestation - Insects',
    'HS-16': 'Infestation - Rodents',
    'HS-17': 'Lead Paint',
};

/**
 * Severity Colors for PDF and UI
 */
export const SEVERITY_COLORS: Record<DeficiencySeverity, string> = {
    'Life-Threatening': '#DC2626', // Red
    'Severe': '#F59E0B',           // Orange/Yellow
    'Moderate': '#3B82F6',         // Blue
    'Low': '#6B7280',              // Gray
};

/**
 * Repair Timeline per HUD NSPIRE Standards
 */
export const REPAIR_TIMELINES: Record<DeficiencySeverity, string> = {
    'Life-Threatening': '24 Hours',
    'Severe': '24 Hours',
    'Moderate': '30 Days',
    'Low': '60 Days',
};

/**
 * Map severity string to DeficiencySeverity type
 */
export function mapSeverityToNSPIRE(severity: string): DeficiencySeverity {
    const mapping: Record<string, DeficiencySeverity> = {
        'critical': 'Life-Threatening',
        'life-threatening': 'Life-Threatening',
        'life threatening': 'Life-Threatening',
        'lifethreatening': 'Life-Threatening',
        'major': 'Severe',
        'severe': 'Severe',
        'high': 'Severe',
        'medium': 'Moderate',
        'moderate': 'Moderate',
        'minor': 'Low',
        'low': 'Low',
        'observation': 'Low',
    };
    return mapping[severity?.toLowerCase()] || 'Moderate';
}

/**
 * Calculate deduction points based on severity
 */
export function calculateDeductionPoints(severity: string): number {
    const points: Record<string, number> = {
        'critical': 10,
        'life-threatening': 10,
        'life threatening': 10,
        'lifethreatening': 10,
        'major': 6,
        'severe': 6,
        'high': 6,
        'medium': 3,
        'moderate': 3,
        'minor': 1,
        'low': 1,
        'observation': 1,
    };
    return points[severity?.toLowerCase()] || 3;
}

/**
 * Map category to NSPIRE code
 */
export function mapCategoryToNSPIRECode(category: string): string {
    const mapping: Record<string, string> = {
        'structural': 'BE-3',
        'electrical': 'BS-2',
        'plumbing': 'BS-1',
        'safety': 'HS-12',
        'hvac': 'BS-5',
        'exterior': 'BE-6',
        'interior': 'U-16',
        'appliances': 'U-10',
        'site': 'S-2',
        'building': 'BE-6',
        'unit': 'U-16',
        'common': 'CA-5',
        'fire safety': 'HS-7',
        'hazard': 'HS-12',
    };
    return mapping[category?.toLowerCase()] || 'HS-12';
}

/**
 * Default PDF Generation Options
 */
export const DEFAULT_PDF_OPTIONS: PDFGenerationOptions = {
    includeImages: true,
    imageQuality: 'medium',
    colorCodingSeverity: true,
    includeSummaryPage: true,
    includeDetailedDeficiencies: true,
    includeCertification: true,
    pageSize: 'letter',
    orientation: 'portrait',
    footerText: 'Generated by NSPIRE Inspection System',
};

/**
 * Convert raw inspection findings + property data into a full NSPIRE report object.
 */
export function buildNSPIREReport(data: any, property: any): NSPIREInspectionReport {
    const now = new Date()

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

    deficiencies.forEach(d => {
        const cat = d.area || 'General';
        summary.byCategory[cat] = (summary.byCategory[cat] || 0) + 1;
    });

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

/**
 * Fetch a property's progress + completed inspections and build an NSPIRE report from them.
 * Shared by the summary page and the inspection-category "View Summary" preview.
 */
export async function fetchNSPIREReportForProperty(propertyId: string): Promise<NSPIREInspectionReport | null> {
    const { propertiesAPI, inspectionsAPI } = await import('@/lib/api')

    const propRes = await propertiesAPI.getById(propertyId)
    const propertyData = propRes.success ? propRes.property : null

    const [progData, inspectionsRes] = await Promise.all([
        inspectionsAPI.getProgress({ property_id: propertyId, draft_only: 'false' }),
        inspectionsAPI.getAll({ property: propertyId, status: 'completed' }),
    ])

    const allFindings: any[] = []

    if (progData && progData.progress) {
        progData.progress.forEach((record: any) => {
            const recordFindings = record.inspectionData?.findings || record.inspectionData?.deficiencies || []
            if (Array.isArray(recordFindings)) {
                const building = record.buildingId || record.inspectionData?.buildingId || ''
                const unit = record.unitId || record.inspectionData?.currentUnit || '-'
                const rawArea = record.inspectionType || (unit === 'Outside' ? 'Outside' : unit === 'Inside' ? 'Inside' : 'Unit')
                const area = rawArea.charAt(0).toUpperCase() + rawArea.slice(1).toLowerCase()

                recordFindings.forEach((f: any) => {
                    allFindings.push({
                        ...f,
                        building: f.building || building,
                        unit: f.unit || unit,
                        area: f.area || area,
                    })
                })
            }
        })
    }

    if (inspectionsRes.success && inspectionsRes.inspections) {
        inspectionsRes.inspections.forEach((insp: any) => {
            const inspFindings = insp.findings || insp.deficiencies || []
            if (Array.isArray(inspFindings)) {
                inspFindings.forEach((f: any) => {
                    allFindings.push({
                        ...f,
                        building: f.building || insp.building?.name || '',
                        unit: f.unit || insp.unit?.name || insp.unit || '-',
                        area: f.area || insp.inspectionType || 'Final',
                        isFinalized: true,
                    })
                })
            }
        })
    }

    const deduped = new Map<string, any>()
    allFindings.forEach(f => {
        const normBuilding = String(f.building || '').replace(/^Building\s+/i, 'B').toUpperCase().trim()
        const normUnit = String(f.unit || '').replace(/^Unit\s+/i, '').replace(/^-$/, '').toUpperCase().trim()
        const normName = String(f.deficiencyName || f.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const key = [normName, normBuilding, normUnit].filter(Boolean).join('|')

        const existing = deduped.get(key)
        const isNewerOrBetter = !existing || (f.isFinalized && !existing.isFinalized) || (!existing.imageUri && f.imageUri)
        if (isNewerOrBetter) {
            deduped.set(key, f)
        }
    })

    const finalFindings = Array.from(deduped.values())

    const inspectionData = {
        propertyId,
        propertyName: propertyData?.name || 'Property',
        propertyAddress: propertyData?.address || '-',
        findings: finalFindings,
        deficiencies: finalFindings,
    }

    return buildNSPIREReport(inspectionData, propertyData)
}
