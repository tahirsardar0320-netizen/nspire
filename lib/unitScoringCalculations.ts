// Unit Scoring Calculations for NSPIRE Unit-Level Inspections
// This is SEPARATE from Inside scoring - Unit scoring uses severity DIRECTLY from the deficiency mapping
// No pattern-based overrides - the severity is determined by the deficiency data itself
// Formula: Pts Lost = X / n where X is the base points for the severity level

import {
    SEVERITY_LEVELS,
    parsePointsFormula,
    LIFE_THREATENING_60_POINTS,
    LIFE_THREATENING_30_POINTS,
} from './scoringCalculations';

// Unit-level inspectable areas use a 50-point base score (distinct from the
// 25-point base used for Inside/Outside areas).
const POSSIBLE_SCORE = 50;

export interface UnitScoringInput {
    totalSamples: number;           // n - total number of inspected units/samples
    deficiencyCount: number;        // Number of deficiencies found
    severity?: string;              // Severity from deficiency mapping (Life-Threatening, Severe, Moderate, Low)
    deficiencyPointsFormula?: string; // Points formula string (e.g., "2.4/n", "30/n")
}

export interface UnitScoringResult {
    allSample: number;              // Total samples (n)
    deficiencyCount: number;        // Number of deficiencies
    pointsLostRaw: number;          // Base points for severity (X in X/n formula)
    pointsLost: number;             // Pts Lost = X / n
    maxPtsLost: number;             // Same as pointsLost per deficiency
    possibleScore: number;          // Fixed at 50
    score: number;                  // Section Score = 50 - pointsLost
    severity: string;               // Severity level from deficiency mapping
}

// Base points for each severity level (the X in X/n formula)
// These values are from the NSPIRE Unit Excel data
const UNIT_SEVERITY_BASE_POINTS: { [key: string]: number } = {
    'Life-Threatening': 30.00,  // Default, but can be 60 or 0 depending on deficiency
    'Severe': 14.80,
    'Moderate': 5.50,
    'Low': 2.40,
};

/**
 * Get base points for a unit deficiency
 * Uses the points formula if provided, otherwise falls back to severity-based lookup
 * 
 * @param severity The severity level from deficiency mapping
 * @param pointsFormula Optional points formula string (e.g., "2.4/n", "60/n")
 * @returns Base points value
 */
export function getUnitBasePoints(severity: string, pointsFormula?: string): number {
    // If a points formula is provided, parse it to get the exact base points
    if (pointsFormula) {
        const parsed = parsePointsFormula(pointsFormula);
        if (parsed > 0) {
            return parsed;
        }
    }

    // Otherwise use the standard base points for the severity level
    return UNIT_SEVERITY_BASE_POINTS[severity] || UNIT_SEVERITY_BASE_POINTS['Moderate'];
}

/**
 * Calculate scoring for a unit inspection deficiency
 * 
 * CRITICAL: This function uses the severity DIRECTLY from the deficiency mapping.
 * Unlike Inside/Outside scoring, there are NO pattern-based overrides.
 * The severity and points are determined entirely by the unitDeficiencyMapping.ts data.
 * 
 * Formula:
 *   Points Lost (Raw) = X (base points for the severity)
 *   Pts Lost = X / n (where n = total samples)
 *   Score = 50 - Pts Lost
 *
 * @param input Unit scoring input parameters
 * @returns Complete scoring result
 */
export function calculateUnitInspectionScore(input: UnitScoringInput): UnitScoringResult {
    const {
        totalSamples,
        deficiencyCount,
        severity = 'Moderate',
        deficiencyPointsFormula,
    } = input;

    // Ensure we don't divide by zero - minimum 1 sample
    const n = Math.max(totalSamples, 1);
    const v = Math.max(deficiencyCount, 0);

    // Get base points from the points formula or severity
    const basePoints = getUnitBasePoints(severity, deficiencyPointsFormula);

    // Points Lost (Raw) = Base Points (the numerator X)
    const pointsLostRaw = basePoints;

    // Pts Lost = X / n
    const pointsLost = basePoints / n;

    // Max Pts Lost = X / n (same as pointsLost)
    const maxPtsLost = basePoints / n;

    // Score = 50 - Pts Lost
    const score = POSSIBLE_SCORE - pointsLost;

    return {
        allSample: n,
        deficiencyCount: v,
        pointsLostRaw: parseFloat(pointsLostRaw.toFixed(2)),
        pointsLost: parseFloat(pointsLost.toFixed(2)),
        maxPtsLost: parseFloat(maxPtsLost.toFixed(2)),
        possibleScore: POSSIBLE_SCORE,
        score: parseFloat(score.toFixed(2)),
        severity: severity,
    };
}

/**
 * Extract category number from item name for unit deficiencies
 * Maps NSPIRE unit categories to their category numbers (1-32)
 * 
 * @param itemName The inspection item name
 * @returns Category number (1-32) or 0 if not found
 */
export function extractUnitCategoryNumber(itemId: string, itemName: string): number {
    const name = itemName.toLowerCase();
    const id = itemId?.toLowerCase() || '';

    // Unit category mappings (1-32)
    const categoryMappings: { [key: string]: number } = {
        // Category 1 - Bathroom
        'bathroom': 1,
        'bath': 1,

        // Category 2 - Cabinets
        'cabinets': 2,
        'cabinet': 2,

        // Category 3 - Call-for-Aid
        'call-for-aid': 3,
        'call for aid': 3,
        'emergency pull cord': 3,

        // Category 4 - CO Alarm
        'co alarm': 4,
        'carbon monoxide': 4,
        'co detector': 4,

        // Category 5 - Ceiling
        'ceiling': 5,

        // Category 6 - Chimney
        'chimney': 6,
        'fireplace': 6,

        // Category 7 - Dryer Exhaust
        'dryer exhaust': 7,
        'dryer vent': 7,

        // Category 8 - Doors
        'doors': 8,
        'door': 8,

        // Category 9 - Drainage
        'drainage': 9,
        'drain': 9,

        // Category 10 - Egress
        'egress': 10,
        'exit': 10,

        // Category 11 - Electrical
        'electrical': 11,
        'outlet': 11,
        'receptacle': 11,

        // Category 12 - Fire Safety
        'fire safety': 12,
        'smoke alarm': 12,
        'smoke detector': 12,
        'fire extinguisher': 12,

        // Category 13 - Floor
        'floor': 13,
        'flooring': 13,

        // Category 14 - Foundation
        'foundation': 14,

        // Category 15 - Hazard
        'hazard': 15,
        'sharp edge': 15,

        // Category 16 - HVAC
        'hvac': 16,
        'heating': 16,
        'cooling': 16,
        'air conditioning': 16,
        'furnace': 16,

        // Category 17 - Kitchen
        'kitchen': 17,
        'range': 17,
        'stove': 17,
        'oven': 17,
        'refrigerator': 17,

        // Category 18 - Leak-Gas
        'leak-gas': 18,
        'gas leak': 18,

        // Category 19 - Leak-Sewage
        'leak-sewage': 19,
        'sewage leak': 19,

        // Category 20 - Leak-Water
        'leak-water': 20,
        'water leak': 20,

        // Category 21 - Lighting
        'lighting': 21,
        'light': 21,

        // Category 22 - Mold
        'mold': 22,

        // Category 23 - Paint
        'paint': 23,
        'peeling paint': 23,

        // Category 24 - Railings (Guardrail)
        'railings': 24,
        'railing': 24,
        'guardrail': 24,
        'handrail': 24,

        // Category 25 - Sink
        'sink': 25,

        // Category 26 - Steps/Stairs
        'steps/stairs': 26,
        'steps': 26,
        'stairs': 26,
        'stairway': 26,

        // Category 27 - Structural
        'structural': 27,

        // Category 28 - Ventilation
        'ventilation': 28,
        'vent': 28,

        // Category 29 - Wall
        'wall': 29,
        'walls': 29,

        // Category 30 - Water Heater
        'water heater': 30,

        // Category 31 - Window
        'window': 31,
        'windows': 31,

        // Category 32 - General Comment
        'general comment': 32,
        'comment': 32,
    };

    // Check for exact matches first
    for (const [key, categoryNum] of Object.entries(categoryMappings)) {
        if (name === key || name.includes(key) || id === key || id.includes(key)) {
            return categoryNum;
        }
    }

    return 0; // Not found
}

/**
 * Check if a location is a unit location
 * Unit locations are specific rooms within a dwelling unit
 * 
 * @param location The location string
 * @returns True if it's a unit location
 */
export function isUnitLocation(location: string): boolean {
    if (!location) return false;

    const loc = location.toLowerCase();

    // Outside and Inside are NOT unit locations
    if (loc === 'outside' || loc === 'inside') {
        return false;
    }

    // Unit locations from inspectionData.ts
    const unitLocations = [
        'attic/loft',
        'basement',
        'bathroom1',
        'bathroom2',
        'bathroom3',
        'bedroom 1',
        'bedroom 2',
        'bedroom 3',
        'bedroom 4',
        'bedroom 5',
        'closet',
        'dinning area',
        'entryway(front/rear',
        'garage',
        'hallway/stairs',
        'home office/study',
        'kitchen',
        'laundry room',
        'living room',
        'location',
        'mechanical room',
        'office',
        'other',
        'patio/porch/balcony',
        'storage room',
    ];

    return unitLocations.some(unitLoc => loc.includes(unitLoc) || unitLoc.includes(loc));
}
