// Outside Inspection Module Scoring Calculations
// Specialized scoring logic for NSPIRE Outside inspection categories
// Handles category-based and deficiency-based severity/points lost mapping

export interface OutsideSeverityConfig {
  severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  pointsLostFormula: number; // The numerator in the formula Pts Lost = X / n
}

export const OUTSIDE_LOCATION_OPTIONS = [
  'Building Site S',
  'Building Site N',
  'Building Site E',
  'Building Site W',
  'Parking Lot',
  'Driveway',
  'Sidewalk',
  'Roof',
  'Common Area',
  'Other'
];

// Category-based severity mapping for Outside inspection
// Maps category number to severity level and points lost numerator

// Moderate: Categories 1, 4, 5, 8, 10, 11, 17, 18, 20, 21, 22, 24
// Formula: Pts Lost = 4.5 / n
const MODERATE_CATEGORIES = [1, 4, 5, 8, 10, 11, 17, 18, 20, 21, 22, 24];

// Life-Threatening Set 1: Categories 6, 7, 9, 12, 13, 19, 23, 25
// Formula: Pts Lost = 49.60 / n
const LIFE_THREATENING_SET1_CATEGORIES = [6, 7, 9, 12, 13, 19, 23, 25];

// Life-Threatening Set 2: Categories 2, 3
// Formula: Pts Lost = 49.60 / n
const LIFE_THREATENING_SET2_CATEGORIES = [2, 3];

// Low: Category 15
// Formula: Pts Lost = 2.00 / n
const LOW_CATEGORIES = [15];

// Severe: Categories 14, 16
// Formula: Pts Lost = 12.20 / n
const SEVERE_CATEGORIES = [14, 16];

// Deficiency-based severity overrides (take precedence over category-based)
// These are partial text matches for deficiency descriptions

// Severe severity deficiencies: Pts Lost = 12.20 / n
const SEVERE_DEFICIENCY_PATTERNS = [
  // AFCI patterns
  'afci outlet or afci breaker does not reset',
  'afci outlet or afci breaker does not have visible damage',
  'afci outlet or afci breaker does not have visible damage, and the test or reset button is inoperable',
  'afci outlet or afci breaker does not have visible damage and the test or reset button is inoperable',
  'test or reset button is inoperable',
  // GFCI patterns
  'unprotected outlet is present within six feet of a water source',
  'outlet is not gfci protected',
  'gfci outlet or gfci breaker does not have visible damage',
  'gfci outlet or gfci breaker does not have visible damage and the test or reset button is inoperable',
  'an outlet, not gfci-protected, is present within six feet of a water source',
  'outlet deigned for major appliances',
  // Overcurrent protection
  'overcurrent protection device is contaminated',
  'overcurrent protection device (i.e., fuse or breaker) is contaminated',
  'contaminated by infestation, paint, or other foreign materials',
  'contaminated (e.g., water, rust, corrosion)',
  // Sharp edges
  'sharp edge that can result in a cut or puncture hazard',
  'sharp edge that can result in a cut or puncture hazard that is likely to require emergency care',
  'shrp edge that can result in a cut or puncture hazard', // typo variant
];

// Low severity deficiencies: Pts Lost = 2.00 / n
const LOW_DEFICIENCY_PATTERNS = [
  // Prior installation
  'evidence of prior installation, but is now not present or is incomplete',
  // Airflow
  'airflow component is damaged or incomplete',
  'airflow component is dmaged or incomplete', // typo variant
  // Site drainage / water runoff
  'water runoff is unable to flow through the site drainage system',
  'standing water is present at the entrance of the outflow pipe',
  'drainage is blocked such that the inspector believes water is unable to drain',
  'water is unable to drain in the event of precipitation',
  // Litter
  'litter is accumulated in an undesignated area',
  'litter is considered deficient if 10 or more small items',
  '10 or more small items or any large discarded items',
  'found in a 10×10 ft area not designated for garbage disposal',
  '10x10 ft area not designated for garbage disposal',
];

// Moderate severity deficiencies: Pts Lost = 4.5 / n
// These override category-based severity (e.g., category 14 default is Severe but some deficiencies are Moderate)
const MODERATE_DEFICIENCY_PATTERNS = [
  // Leak - Sewage System (Category 14) - Moderate deficiencies
  'cleanout cap or riser is damaged',
  'cap to the cleanout or pump cover is detached or missing',
  'cap to the cleanout or pump cover is detached',
  'pump cover is detached or missing',
  'visibly defective, impacts functionality',
  // Electrical Service Panel (Category 7) - Moderate deficiencies
  'electrical service panel is not reasonably accessible',
  'panel is not reasonably accessible',
  'cannot be reached and opened without moving obstructions',
  'cannot be reached without moving obstructions',
];

/**
 * Get severity configuration based on category number
 * @param categoryNumber The NSPIRE Outside category number (1-26)
 * @returns Severity configuration with severity level and points lost formula numerator
 */
export function getSeverityByCategoryNumber(categoryNumber: number): OutsideSeverityConfig {
  if (MODERATE_CATEGORIES.includes(categoryNumber)) {
    return { severity: 'Moderate', pointsLostFormula: 4.5 };
  }
  if (LIFE_THREATENING_SET1_CATEGORIES.includes(categoryNumber)) {
    return { severity: 'Life-Threatening', pointsLostFormula: 49.60 };
  }
  if (LIFE_THREATENING_SET2_CATEGORIES.includes(categoryNumber)) {
    return { severity: 'Life-Threatening', pointsLostFormula: 49.60 };
  }
  if (LOW_CATEGORIES.includes(categoryNumber)) {
    return { severity: 'Low', pointsLostFormula: 2.00 };
  }
  if (SEVERE_CATEGORIES.includes(categoryNumber)) {
    return { severity: 'Severe', pointsLostFormula: 12.20 };
  }

  // Default to Moderate if category not found
  return { severity: 'Moderate', pointsLostFormula: 4.5 };
}

/**
 * Check if deficiency description matches any severe deficiency patterns
 * @param deficiencyDescription The deficiency description or detail text
 * @returns True if matches severe pattern
 */
function matchesSevereDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SEVERE_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency description matches any low severity deficiency patterns
 * @param deficiencyDescription The deficiency description or detail text
 * @returns True if matches low severity pattern
 */
function matchesLowDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LOW_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency description matches any moderate severity deficiency patterns
 * @param deficiencyDescription The deficiency description or detail text
 * @returns True if matches moderate severity pattern
 */
function matchesModerateDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return MODERATE_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Get severity configuration with deficiency-based override
 * Deficiency-based rules take precedence over category-based rules
 * 
 * @param categoryNumber The NSPIRE Outside category number (1-26)
 * @param deficiencyDescription Optional deficiency description for override checking
 * @returns Severity configuration with severity level and points lost formula numerator
 */
export function getOutsideSeverityConfig(
  categoryNumber: number,
  deficiencyDescription?: string
): OutsideSeverityConfig {
  // Check deficiency-based overrides first (they take precedence)
  if (deficiencyDescription) {
    // Check for severe deficiency patterns
    if (matchesSevereDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Severe', pointsLostFormula: 12.20 };
    }

    // Check for moderate deficiency patterns (overrides category defaults like Severe or Life-Threatening)
    if (matchesModerateDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Moderate', pointsLostFormula: 4.5 };
    }

    // Check for low severity deficiency patterns
    if (matchesLowDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Low', pointsLostFormula: 2.00 };
    }
  }

  // Fall back to category-based severity
  return getSeverityByCategoryNumber(categoryNumber);
}

export interface OutsideScoringInput {
  categoryNumber: number;       // NSPIRE Outside category number (1-26)
  totalSamples: number;         // n - number of sample units
  deficiencyDescription?: string; // Optional deficiency description for override checking
  deficiencyCount?: number;     // Number of deficiencies (default: 1)
  deficiencyPointsFormula?: string; // Direct points formula from deficiency (e.g., "4.5/n", "12.20/n")
  deficiencySeverity?: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'; // Direct severity from deficiency
}

export interface OutsideScoringResult {
  categoryNumber: number;       // Category number
  totalSamples: number;         // n - total sample units
  severity: string;             // Resolved severity level
  pointsLostRaw: number;        // Pts Lost (Raw) = base formula numerator (4.5, 24.8, 49.60, 2.00, or 12.20)
  pointsLost: number;           // Pts Lost = numerator / n (calculated points lost)
  deficiencyCount: number;      // Number of deficiencies
  possibleScore: number;        // Fixed at 25
  maxPtsLost: number;           // Max Pts Lost = Pts Lost / n
  score: number;                // Score = 25 - maxPtsLost
  formulaNumerator: number;     // The numerator used in the formula
  isDeficiencyOverride: boolean; // Whether deficiency-based override was applied
  // Backward compatibility aliases
  allSample: number;
  ptsLostRaw: number;
  ptsLost: number;
}

const POSSIBLE_SCORE = 25;

/**
 * Calculate scoring for Outside inspection
 * 
 * Formulas:
 *   Points Lost (Raw) = formulaNumerator (base value)
 *   Points Lost = formulaNumerator / n
 *   Max Points Lost = Points Lost / n
 *   Score = Possible Score (25) − Max Points Lost
 * 
 * @param input Scoring input with category number, samples, and optional deficiency description
 * @returns Complete scoring result
 */
export function calculateOutsideScore(input: OutsideScoringInput): OutsideScoringResult {
  const {
    categoryNumber,
    totalSamples,
    deficiencyDescription,
    deficiencyCount = 1,
    deficiencyPointsFormula,
    deficiencySeverity,
  } = input;

  // Ensure we don't divide by zero - minimum 1 sample
  const n = Math.max(totalSamples, 1);
  const count = Math.max(deficiencyCount, 0);

  // PRIORITY 1: Use direct deficiency points formula if provided (from deficiency data)
  let pointsLostRaw: number;
  let severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  let isDeficiencyOverride = false;

  if (deficiencyPointsFormula) {
    // Parse formula like "4.5/n", "12.20/n", "49.60/n", "24.8/n", "2.00/n"
    const match = deficiencyPointsFormula.match(/^([\d.]+)/);
    if (match) {
      pointsLostRaw = parseFloat(match[1]);
      severity = deficiencySeverity || 'Moderate';
      isDeficiencyOverride = true;
    } else {
      // Fallback to category-based if parsing fails
      const severityConfig = getOutsideSeverityConfig(categoryNumber, deficiencyDescription);
      pointsLostRaw = severityConfig.pointsLostFormula;
      severity = severityConfig.severity;
    }
  } else {
    // PRIORITY 2: Use category-based and deficiency description pattern matching
    const severityConfig = getOutsideSeverityConfig(categoryNumber, deficiencyDescription);
    const categoryOnlyConfig = getSeverityByCategoryNumber(categoryNumber);

    pointsLostRaw = severityConfig.pointsLostFormula;
    severity = severityConfig.severity;
    isDeficiencyOverride = deficiencyDescription !== undefined &&
      (severityConfig.severity !== categoryOnlyConfig.severity ||
        severityConfig.pointsLostFormula !== categoryOnlyConfig.pointsLostFormula);
  }

  // Pts Lost = numerator / n (calculated points lost)
  // This is the NSPIRE formula: Pts Lost = X / n where X is the severity points (e.g., 12.20 for Severe)
  const pointsLost = pointsLostRaw / n;

  // Max Points Lost = Same as Points Lost (X / n)
  // NOT divided by n again - that was a bug causing severe to show as moderate
  const maxPtsLost = pointsLost;

  // Calculate Score = Possible Score (25) - Points Lost
  // For example: Severe with n=1: Score = 25 - 12.20 = 12.80
  const score = POSSIBLE_SCORE - pointsLost;

  return {
    categoryNumber,
    totalSamples: n,
    allSample: n,
    severity,
    pointsLostRaw: parseFloat(pointsLostRaw.toFixed(4)),
    ptsLostRaw: parseFloat(pointsLostRaw.toFixed(4)),
    pointsLost: parseFloat(pointsLost.toFixed(4)),
    ptsLost: parseFloat(pointsLost.toFixed(4)),
    deficiencyCount: count,
    possibleScore: POSSIBLE_SCORE,
    maxPtsLost: parseFloat(maxPtsLost.toFixed(4)),
    score: parseFloat(score.toFixed(2)),
    formulaNumerator: pointsLostRaw,
    isDeficiencyOverride,
  };
}

/**
 * Extract category number from item ID or name
 * @param itemId The item ID (e.g., "1", "2", etc.)
 * @param itemName Optional item name to extract number from prefix
 * @returns The category number
 */
export function extractCategoryNumber(itemId?: string, itemName?: string): number {
  // Try to get from itemId first
  if (itemId) {
    const num = parseInt(itemId, 10);
    if (!isNaN(num) && num >= 1 && num <= 26) {
      return num;
    }
  }

  // Try to extract from item name (e.g., "1. Address and Signage")
  if (itemName) {
    const match = itemName.match(/^(\d+)\./);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num >= 1 && num <= 26) {
        return num;
      }
    }
  }

  // Default to category 1 if not found
  return 1;
}

// Export category constants for external use
export const OUTSIDE_SCORING_CATEGORIES = {
  MODERATE: MODERATE_CATEGORIES,
  LIFE_THREATENING_SET1: LIFE_THREATENING_SET1_CATEGORIES,
  LIFE_THREATENING_SET2: LIFE_THREATENING_SET2_CATEGORIES,
  LOW: LOW_CATEGORIES,
  SEVERE: SEVERE_CATEGORIES,
};

export const DEFICIENCY_OVERRIDE_PATTERNS = {
  SEVERE: SEVERE_DEFICIENCY_PATTERNS,
  LOW: LOW_DEFICIENCY_PATTERNS,
};

// Export the possible score constant
export const OUTSIDE_POSSIBLE_SCORE = POSSIBLE_SCORE;
