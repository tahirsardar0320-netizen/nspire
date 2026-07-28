// Scoring Calculations for NSPIRE Unit-Level Inspections
// Based on NSPIRE official standards with exact formulas from Excel data
// Formula: Pts Lost = X / n where X is the base points for severity
// Score = Possible Score - Pts Lost

export interface SeverityConfig {
    name: string;
    basePoints: number; // The X in formula Pts Lost = X / n
}

// Severity levels with their BASE POINTS values (numerator in X/n formula)
// These are the exact values from NSPIRE Table
export const SEVERITY_LEVELS: { [key: string]: SeverityConfig } = {
    'Life-Threatening': { name: 'Life-Threatening', basePoints: 30.00 }, // Can be 60, 30, or 0 depending on deficiency
    'Severe': { name: 'Severe', basePoints: 14.80 },
    'Moderate': { name: 'Moderate', basePoints: 5.50 },
    'Low': { name: 'Low', basePoints: 2.40 },
};

// Life-Threatening has variable base points depending on the specific deficiency
// These are the 3 formulas used for Life-Threatening:
// - 60/n: Fire extinguisher damaged/missing, overcurrent device issues, dryer vent unsuitable, water heater issues
// - 30/n: Most Life-Threatening deficiencies (toilet missing, egress blocked, electrical exposed, etc.)
// - 0.000: Smoke alarms and CO alarms (fail immediately - not calculated per sample)
export const LIFE_THREATENING_60_POINTS = 60.00;
export const LIFE_THREATENING_30_POINTS = 30.00;
export const LIFE_THREATENING_ZERO = 0.000;

export const POSSIBLE_SCORE = 25; // Fixed 25-point base score per NSPIRE standards

export interface ScoringInput {
    totalSamples: number;      // n - total number of inspected units/samples
    deficiencies: number;      // v - number of selected deficiencies
    severity?: string;         // Severity level (defaults to Moderate)
}

export interface ScoringResult {
    allSample: number;         // Total samples (n)
    deficiencies: number;      // Number of deficiencies (v) - renamed from violations
    violations: number;        // Alias for deficiencies (for backward compatibility)
    ptsLostRaw: number;        // Points Lost (Raw) = maxPtsLost / n
    ptsLost: number;           // Total Points Lost = (maxPtsLost / n) × v
    possibleScore: number;     // Fixed at 50
    maxPtsLost: number;        // Max Points Lost based on severity
    score: number;             // Section Score = possibleScore - ptsLost (dynamic, not always 50)
    severity: string;          // Severity level
}

/**
 * Calculate scoring for a single unit/section inspection
 * NSPIRE Formula:
 *   Points Lost (Raw) = Base Points for severity (X in X/n formula)
 *   Pts Lost = X / n (where X is base points, n is total samples)
 *   Max Pts Lost = X / n (same as Pts Lost for single deficiency)
 *   Section Score = 25 − Pts Lost
 * 
 * Example for Severe with 50 samples:
 *   Pts Lost (Raw) = 14.80
 *   Pts Lost = 14.80 / 50 = 0.296
 *   Max Pts Lost = 0.296
 *   Score = 25 - 0.296 = 24.704
 * 
 * @param input Scoring input parameters
 * @returns Complete scoring result with all intermediate values
 */
export function calculateUnitScore(input: ScoringInput): ScoringResult {
    const { totalSamples, deficiencies, severity = 'Moderate' } = input;

    // Get base points based on severity (the X in X/n formula)
    const severityConfig = SEVERITY_LEVELS[severity] || SEVERITY_LEVELS['Moderate'];
    const basePoints = severityConfig.basePoints;

    // Ensure we don't divide by zero - minimum 1 sample
    const n = Math.max(totalSamples, 1);
    const v = Math.max(deficiencies, 0);

    // Points Lost (Raw) = Base Points (the numerator X in X/n formula)
    const ptsLostRaw = basePoints;

    // Pts Lost = X / n (formula from NSPIRE table)
    const ptsLost = basePoints / n;

    // Max Pts Lost = X / n (same as ptsLost for each deficiency)
    const maxPtsLost = basePoints / n;

    // Calculate Section Score = 25 − Pts Lost
    const score = POSSIBLE_SCORE - ptsLost;

    return {
        allSample: n,
        deficiencies: v,
        violations: v, // Backward compatibility alias
        ptsLostRaw: parseFloat(ptsLostRaw.toFixed(2)),
        ptsLost: parseFloat(ptsLost.toFixed(2)),
        possibleScore: POSSIBLE_SCORE,
        maxPtsLost: parseFloat(maxPtsLost.toFixed(2)),
        score: parseFloat(score.toFixed(2)),
        severity: severityConfig.name,
    };
}

/**
 * Calculate scoring with custom base points
 * Use this when the deficiency has a specific point value (e.g., Life-Threatening can be 60, 30, or 0)
 * 
 * @param totalSamples n - total number of inspected units/samples
 * @param customBasePoints The specific base points for this deficiency (e.g., 60, 30, 14.8, 5.5, 2.4)
 * @param severity The severity level name
 * @returns Complete scoring result with all intermediate values
 */
export function calculateUnitScoreWithCustomPoints(
    totalSamples: number,
    customBasePoints: number,
    severity: string = 'Moderate'
): ScoringResult {
    const n = Math.max(totalSamples, 1);

    // Handle zero-point deficiencies (e.g., 0.000 for some Life-Threatening)
    if (customBasePoints === 0) {
        return {
            allSample: n,
            deficiencies: 1,
            violations: 1,
            ptsLostRaw: 0,
            ptsLost: 0,
            possibleScore: POSSIBLE_SCORE,
            maxPtsLost: 0,
            score: POSSIBLE_SCORE, // No points lost for 0.000 deficiencies
            severity: severity,
        };
    }

    // Points Lost (Raw) = Base Points (the numerator X)
    const ptsLostRaw = customBasePoints;

    // Pts Lost = X / n (NSPIRE formula)
    const ptsLost = customBasePoints / n;

    // Max Pts Lost = X / n
    const maxPtsLost = customBasePoints / n;

    // Score = 25 - Pts Lost
    const score = POSSIBLE_SCORE - ptsLost;

    return {
        allSample: n,
        deficiencies: 1,
        violations: 1,
        ptsLostRaw: parseFloat(ptsLostRaw.toFixed(2)),
        ptsLost: parseFloat(ptsLost.toFixed(2)),
        possibleScore: POSSIBLE_SCORE,
        maxPtsLost: parseFloat(maxPtsLost.toFixed(2)),
        score: parseFloat(score.toFixed(2)),
        severity: severity,
    };
}

/**
 * Parse the points formula string and extract base points
 * Handles formats like: "5.5/n", "14.8/n", "30/n", "60/n", "0.000", "60/50xn", "14.8/50xn"
 * 
 * @param pointsFormula The points formula string from deficiency mapping
 * @returns The base points value (numerator)
 */
export function parsePointsFormula(pointsFormula: string): number {
    if (!pointsFormula) return 5.5; // Default to Moderate

    const formula = pointsFormula.trim();

    // Handle "0.000" or "0"
    if (formula === '0.000' || formula === '0') {
        return 0;
    }

    // Handle special formula "X/50xn" (for Call-for-Aid)
    const special50Match = formula.match(/^([\d.]+)\/50xn$/i);
    if (special50Match) {
        return parseFloat(special50Match[1]);
    }

    // Handle standard formula "X/n"
    const standardMatch = formula.match(/^([\d.]+)\/n$/i);
    if (standardMatch) {
        return parseFloat(standardMatch[1]);
    }

    // Handle just a number
    const numMatch = formula.match(/^([\d.]+)$/);
    if (numMatch) {
        return parseFloat(numMatch[1]);
    }

    // Default to moderate severity base points
    return 5.5;
}

// Backward compatible function that accepts 'violations' parameter
export function calculateUnitScoreWithViolations(input: {
    totalSamples: number;
    violations: number;
    severity?: string;
}): ScoringResult {
    return calculateUnitScore({
        totalSamples: input.totalSamples,
        deficiencies: input.violations,
        severity: input.severity,
    });
}

export interface InspectionAreaScore {
    inside?: ScoringResult;
    outside?: ScoringResult;
}

export interface FinalInspectionScore {
    insideScore?: ScoringResult;
    outsideScore?: ScoringResult;
    finalScore: number;
    averageMethod: 'simple' | 'weighted';
    totalSamples: number;
    totalDeficiencies: number;
    // Breakdown for display
    insideContribution?: number;
    outsideContribution?: number;
}

/**
 * Calculate the final inspection score by combining Inside and Outside scores
 * 
 * Simple Average: (InsideScore + OutsideScore) / 2
 * Weighted Average: ((InsideScore × n_inside) + (OutsideScore × n_outside)) / (n_inside + n_outside)
 * 
 * @param areaScores Object containing inside and/or outside scoring results
 * @param useWeightedAverage If true, uses weighted average based on sample sizes; if false, uses simple average
 * @returns Final inspection score with breakdown
 */
export function calculateFinalInspectionScore(
    areaScores: InspectionAreaScore,
    useWeightedAverage: boolean = false
): FinalInspectionScore {
    const { inside, outside } = areaScores;

    let finalScore: number;
    let totalSamples = 0;
    let totalDeficiencies = 0;
    let insideContribution: number | undefined;
    let outsideContribution: number | undefined;

    if (inside) {
        totalSamples += inside.allSample;
        totalDeficiencies += inside.deficiencies;
    }

    if (outside) {
        totalSamples += outside.allSample;
        totalDeficiencies += outside.deficiencies;
    }

    if (inside && outside) {
        if (useWeightedAverage) {
            // Weighted average based on sample sizes
            // Formula: ((InsideScore × n_inside) + (OutsideScore × n_outside)) / (n_inside + n_outside)
            const totalWeight = inside.allSample + outside.allSample;
            insideContribution = (inside.score * inside.allSample) / totalWeight;
            outsideContribution = (outside.score * outside.allSample) / totalWeight;
            finalScore = insideContribution + outsideContribution;
        } else {
            // Simple average: (InsideScore + OutsideScore) / 2
            finalScore = (inside.score + outside.score) / 2;
            insideContribution = inside.score / 2;
            outsideContribution = outside.score / 2;
        }
    } else if (inside) {
        finalScore = inside.score;
        insideContribution = inside.score;
    } else if (outside) {
        finalScore = outside.score;
        outsideContribution = outside.score;
    } else {
        // No scores available - return base score
        finalScore = POSSIBLE_SCORE;
    }

    return {
        insideScore: inside,
        outsideScore: outside,
        finalScore: parseFloat(finalScore.toFixed(2)),
        averageMethod: useWeightedAverage ? 'weighted' : 'simple',
        totalSamples,
        totalDeficiencies,
        insideContribution: insideContribution !== undefined ? parseFloat(insideContribution.toFixed(2)) : undefined,
        outsideContribution: outsideContribution !== undefined ? parseFloat(outsideContribution.toFixed(2)) : undefined,
    };
}

/**
 * Format score for display
 * @param score Numeric score
 * @returns Formatted string with 2 decimal places
 */
export function formatScore(score: number): string {
    return score.toFixed(2);
}

/**
 * Get score status based on the score value
 * @param score Numeric score (out of 50)
 * @returns Status object with label and color
 */
export function getScoreStatus(score: number): { label: string; color: string } {
    if (score >= 45) {
        return { label: 'Excellent', color: '#10B981' };  // Green
    } else if (score >= 40) {
        return { label: 'Good', color: '#3B82F6' };       // Blue
    } else if (score >= 30) {
        return { label: 'Fair', color: '#F59E0B' };       // Orange/Yellow
    } else if (score >= 20) {
        return { label: 'Poor', color: '#F97316' };       // Orange
    } else if (score >= 0) {
        return { label: 'Critical', color: '#EF4444' };   // Red
    } else {
        return { label: 'Failed', color: '#7F1D1D' };     // Dark Red (negative score)
    }
}

/**
 * Get severity color for display
 * @param severity Severity level string
 * @returns Color code
 */
export function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'Life-Threatening':
            return '#DC2626'; // Red
        case 'Severe':
            return '#EA580C'; // Orange
        case 'Moderate':
            return '#CA8A04'; // Yellow/Amber
        case 'Low':
            return '#16A34A'; // Green
        default:
            return '#6B7280'; // Gray
    }
}

/**
 * Get base points for a severity level (the X in X/n formula)
 * @param severity Severity level string
 * @returns Base points value
 */
export function getMaxPointsLost(severity: string): number {
    return SEVERITY_LEVELS[severity]?.basePoints || SEVERITY_LEVELS['Moderate'].basePoints;
}

/**
 * Alias for getMaxPointsLost - returns base points for severity
 */
export function getBasePoints(severity: string): number {
    return getMaxPointsLost(severity);
}

// Deficiency count options for dropdown (0-20)
export const DEFICIENCY_OPTIONS = Array.from({ length: 21 }, (_, i) => ({
    value: i,
    label: i.toString(),
}));

// Alias for backward compatibility
export const VIOLATION_OPTIONS = DEFICIENCY_OPTIONS;

// Re-export Outside-specific scoring utilities
export {
    calculateOutsideScore,
    getOutsideSeverityConfig,
    extractCategoryNumber,
    OUTSIDE_SCORING_CATEGORIES,
    DEFICIENCY_OVERRIDE_PATTERNS,
} from './outsideScoringCalculations';
export type {
    OutsideSeverityConfig,
    OutsideScoringInput,
    OutsideScoringResult,
} from './outsideScoringCalculations';

// Re-export Unit-specific scoring utilities (separate from Inside scoring)
export {
    calculateUnitInspectionScore,
    extractUnitCategoryNumber,
    isUnitLocation,
    getUnitBasePoints,
    UNIT_POSSIBLE_SCORE,
} from './unitScoringCalculations';
export type {
    UnitScoringInput,
    UnitScoringResult,
} from './unitScoringCalculations';
