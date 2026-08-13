// Inside Inspection Module Scoring Calculations
// Specialized scoring logic for NSPIRE Inside inspection categories
// Handles category-based and deficiency-based severity/points lost mapping
// Organized by Category for clean mapping
// EXACT MAPPING FROM NSPIRE TABLE - Categories 1-35

export interface InsideSeverityConfig {
  severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  pointsLostFormula: number; // The numerator in the formula Pts Lost = X / n
  specialFormula?: 'divide_50n' | 'zero'; // Special formula types
}

// NSPIRE_public source sheet — "Inside-Locations" tab
export const INSIDE_LOCATION_OPTIONS = [
  'Basement',
  'Business Space',
  'Classroom',
  'Closet/Utility',
  'Day Care',
  'Halls/Corridors/Stairs',
  'Kitchen',
  'Laundry Room',
  'Leased Commercial',
  'Library',
  'Lobby',
  'Maintenance Shop',
  'Mechanical Room',
  'Office',
  'Other Community Space',
  'Parking Garage',
  'Patio/Porch/Balcony',
  'Reception Room',
  'Recreation Room',
  'Refuse/Compactor Room',
  'Restrooms',
  'Salon',
  'Store',
  'Workout Room'
];

// ============================================================================
// CATEGORY-BASED DEFICIENCY PATTERNS - EXACT TABLE MAPPING
// Each category maps deficiency criteria to severity and formula exactly
// ============================================================================

// ----------------------------------------------------------------------------
// Category 1: Cabinet and Storage (Pantry, Laundry) - Low - 2.20/n
// ----------------------------------------------------------------------------
const CAT_1_CABINET_STORAGE_PATTERNS = [
  'stowed items, including food, sanitation, and household supplies',
  'stowed items',
  'food, sanitation, and household supplies',
  'food storage space is not present',
  'evidence of previously installed, damaged or missing components',
];

// ----------------------------------------------------------------------------
// Category 2: Call-for-Aid System
// - Life-Threatening: 27.25/(50*n) (annunciator does not indicate)
// - Severe: 13.40/(50*n) (pull cord higher than 6 inches)
// ----------------------------------------------------------------------------
const CAT_2_CALL_FOR_AID_LIFE_THREATENING_PATTERNS = [
  'annunciator does not indicate the correct corresponding room',
  'does not indicate the correct corresponding room',
  'call-for-aid system does not emit sound or light or send signal to annunciator',
  'does not emit sound or light or send signal',
];

const CAT_2_CALL_FOR_AID_SEVERE_PATTERNS = [
  'pull cord end is positioned more than 6 inches above the floor',
  'positioned more than 6 inches above the floor',
  'pull cord is higher than 6 inches off the floor',
  'call-for-aid system is blocked',
  'system is blocked',
];

// ----------------------------------------------------------------------------
// Category 3: Carbon Monoxide Alarm - Life-Threatening - 0.000 (ZERO)
// All CO alarm deficiencies result in 0 points formula
// ----------------------------------------------------------------------------
const CAT_3_CARBON_MONOXIDE_ALARM_PATTERNS = [
  'with or without a battery, including low-volume',
  'with or without a battery',
  'including low-volume',
  'carbon monoxide alarm, inoperable',
  'carbon monoxide alarm does not produce audio or visual alarm when tested',
  'unit or sleeping area is located one (1) story or less above or below an attached private garage that does not have natural ventilation',
  'attached private garage that does not have natural ventilation',
  'does not have a ventilation system for vehicle exhaust',
  'enclosed and does not have a ventilation system for vehicle exhaust',
  'carbon monoxide alarm is missing',
  'evidence of prior installation but is now not present or is incomplete',
  'carbon monoxide alarm is covered by a foreign object',
  'carbon monoxide alarm is obstructed',
  'plastic bag, shower cap, zip tie, paint, tape, decorative stickers',
];

// ----------------------------------------------------------------------------
// Category 4: Ceiling
// - Severe: 13.40/n (not functionally adequate)
// - Moderate: 5.0/n (hole, unstable surface)
// ----------------------------------------------------------------------------
const CAT_4_CEILING_SEVERE_PATTERNS = [
  'ceiling component is not functionally adequate',
  'does not allow ceiling to enclose a room',
  'protect shaft or circulation space',
  'create enclosure of and separation between spaces',
  'control the diffusion of light and sound around a room',
];

const CAT_4_CEILING_MODERATE_PATTERNS = [
  'opens directly to the outside light regardless of the size',
  'ceiling has a damaged opening>2',
  'ceiling has a damaged opening',
  'hole is present that opens directly to the outside environment',
  'hole is present that is 2 inches or greater in diameter',
  'unstable surfaces',
  'drywall, gypsum, or ceiling tiles are missing or detached',
  'presence of bubbling, deflection, loose joint tape, or loose panels',
  'cracking and/or small circles or blisters',
  'nail pops',
  'plasterboard sheeting may be pulling away from the nails or screws',
];

// ----------------------------------------------------------------------------
// Category 5: Chimney - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_5_CHIMNEY_PATTERNS = [
  'fireplace or fire burning appliance is not intentionally decommissioned',
  'not intentionally decommissioned',
  'chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged',
  'may not safely contain the fire and convey smoke and combustion gases to the exterior',
];

// ----------------------------------------------------------------------------
// Category 6: Clothes Dryer Exhaust Ventilation - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_6_CLOTHES_DRYER_EXHAUST_PATTERNS = [
  'dryer is being used indoor',
  'dryer transition duct is not securely attached',
  'transition duct is not securely attached',
  'dryer transition duct is not constructed of metal or an approved material',
  'constructed of unsuitable material',
  'electric dryer exhaust ventilation system is blocked or damaged',
  'gas dryer exhaust ventilation system is blocked or damaged',
  'airflow may be restricted',
  'electric dryer transition duct is detached or missing',
  'gas dryer transition duct is detached or missing',
  'evidence of prior installation but is now not present or is incomplete',
];

// ----------------------------------------------------------------------------
// Category 7: Door - Entry
// - Moderate: 13.40/n (cannot be secured)
// - Low: 2.20/n (hole/crack component damage)
// - Moderate: 5.0/n (frame/threshold damage, seal/gasket, self-closing, delamination, does not open)
// - Severe: 13.40/n (missing, does not close)
// ----------------------------------------------------------------------------
const CAT_7_DOOR_ENTRY_MODERATE_13_40_PATTERNS = [
  'entry door cannot be secured',
  'installed locks can not be engaged from both sides',
  'cannot be secured by at least one installed lock',
];

const CAT_7_DOOR_ENTRY_LOW_PATTERNS = [
  'hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door',
  'hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom',
  'glass is missing within the door, side lights, or transom',
  'a hole ¼ inch or greater in diameter',
  'a split or crack ¼ inch or greater in width',
  'entry door component is inoperable, missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation',
];

const CAT_7_DOOR_ENTRY_MODERATE_5_0_PATTERNS = [
  'observed evidence of prior installation, now missing',
  'entry door frame, threshold, or trim is damaged or missing',
  'seal, gasket, or stripping is damaged, inoperable, or missing',
  'gap of ¼ inch or more that allows light through',
  'evidence of water penetration such as damage or dry rot',
  'self-closing mechanism is damaged',
  'self-closing mechanism does not pull the door closed and engage the latch',
  'self-closing mechanism is missing',
  'delamination or separation of the door surface 2 inches wide or greater',
  'delamination or separation that affects the integrity of the door',
  'entry door does not open',
  'crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door',
  'crack, split, separation, or hole 1/4 inch or greater',
];

const CAT_7_DOOR_ENTRY_SEVERE_PATTERNS = [
  'entry door is missing',
  'not present or is incomplete',
  'entry door does not close',
  'door seats in frame',
];

// ----------------------------------------------------------------------------
// Category 7: Door – Fire Labeled
// - Severe: 13.40/n (object preventing, hole, cannot be secured, does not close/latch, does not open, seal/gasket damaged)
// - Life-Threatening: 27.25/n (fire-labeled door is missing)
// ----------------------------------------------------------------------------
const CAT_7_DOOR_FIRE_LABELED_SEVERE_PATTERNS = [
  'object is present that may prevent the fire-labeled door from closing and latching',
  'object is present that may prevent the fire-labeled door from self-closing and latching',
  'fire-labeled door assembly has a hole of any size',
  'fire-labeled door assembly is damaged such that its integrity may be compromised',
  'fire-labeled door that serves as an entry door cannot be secured',
  'fire-labeled door cannot be secured by at least one installed lock',
  'fire-labeled door does not close and latch',
  'fire-labeled door self-closing hardware is damaged or missing',
  'fire-labeled door does not self-close and latch',
  'fire-labeled door does not open',
  'limit access between spaces',
  'fire-labeled door seal or gasket is damaged',
  'fire labeled door seal or gasket is missing',
];

const CAT_7_DOOR_FIRE_LABELED_LIFE_THREATENING_PATTERNS = [
  'fire-labeled door is missing',
  'fire labeled door is missing',
  'evidence of prior installation, but now not present or is incomplete',
];

// ----------------------------------------------------------------------------
// Category 7: Door - General (Passage Door)
// - Low: 2.20/n (privacy/separation issues)
// - Moderate: 5.0/n (does not open)
// ----------------------------------------------------------------------------
const CAT_7_DOOR_GENERAL_LOW_PATTERNS = [
  'passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere',
  'cannot adequately provide privacy, room separation, or control the physical atmosphere',
  'non-access passage door is damaged, inoperable, or missing a component—affecting its intended function',
  'non-access passage door is damaged, inoperable, or missing a component',
  'affecting its intended function',
];

const CAT_7_DOOR_GENERAL_MODERATE_PATTERNS = [
  'passage door does not open such that it may limit access when needed',
  'passage door does not open',
];

// ----------------------------------------------------------------------------
// Category 7: Garage Door - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_7_GARAGE_DOOR_PATTERNS = [
  'door will not open and remain open, does not function adequately',
  'garage door does not open, close, or remains closed',
  'garage door has a hole of any size that penetrates through to the interior',
  'broken panel or window',
];

// ----------------------------------------------------------------------------
// Category 8: Drainage - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_8_DRAINAGE_PATTERNS = [
  'there is a problem with the drainage',
  'problem with the drainage',
  'drain is fully blocked',
];

// ----------------------------------------------------------------------------
// Category 9: Egress - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_9_EGRESS_PATTERNS = [
  'double-key cylinder deadbolt locks or security features requiring a key, tool, or special effort',
  'not allowed on exit doors, exit access doors, or egress windows',
  'fixed or movable security bars must not block designated egress points',
  'no furniture or items may obstruct the means of egress',
  'security features requiring a key, tool, or special effort from the stress side',
  'exit access or exit is obstructed',
  'obstructed means of egress',
];

// ----------------------------------------------------------------------------
// Category 10: Electrical - Conductor, Outlet, and Switch
// - Life-Threatening: 27.25/n (exposed wiring, damaged outlet/switch, water contact)
// - Severe: 13.40/n (outlet not energized, not wired correctly)
// ----------------------------------------------------------------------------
const CAT_10_ELECTRICAL_LIFE_THREATENING_PATTERNS = [
  'electrical conductors must be enclosed and insulated',
  'electrical conductor is not enclosed or properly insulated',
  'no exposed wiring, open ports, missing covers, or gaps over 1/2',
  'exposed wiring',
  'open ports',
  'missing covers',
  'gaps over 1/2',
  'damaged or missing sheathing that exposes the insulated wiring or conductor',
  'missing knockout',
  'missing outlet or switch cover',
  'missing breaker or fuse',
  'opening or gap is present and measures greater than 1/2',
  'outlet or switch is damaged',
  'may not safely carry or control electrical current',
  'water is currently in contact with an electrical conductor',
  'water infiltration from the ceiling or inside of the wall',
];

const CAT_10_ELECTRICAL_SEVERE_PATTERNS = [
  'outlet does not have visible damage, and testing indicates that it is not energized',
  'outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized',
  'testing of a three-pronged outlet indicates that it is not wired correctly or grounded',
  'three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded',
];

// ----------------------------------------------------------------------------
// Category 10: Electrical - GFCI/AFCI - Severe - 13.40/n
// ----------------------------------------------------------------------------
const CAT_10_ELECTRICAL_GFCI_AFCI_SEVERE_PATTERNS = [
  'afci outlet or afci breaker does not have visible damage and the test or reset button is inoperable',
  'afci outlet or afci breaker does not reset',
  'test or reset button is inoperable',
  'unprotected outlet is present within six feet of a water source',
  'outlet, not gfci-protected, is present within six feet of a water source',
  'gfci outlet or gfci breaker does not have visible damage and the test or reset button is inoperable',
];

// ----------------------------------------------------------------------------
// Category 10: Electrical Service Panel
// - Life-Threatening: 27.25/n (overcurrent device damaged)
// - Severe: 13.40/n (overcurrent device contaminated)
// - Moderate: 5.0/n (not accessible)
// ----------------------------------------------------------------------------
const CAT_10_ELECTRICAL_PANEL_LIFE_THREATENING_PATTERNS = [
  'overcurrent protection device (i.e., fuse or breaker) is damaged',
  'overcurrent protection device is damaged',
  'fuse or breaker is damaged',
  'may not interrupt the circuit during an over current condition',
  'paint, or other foreign materials',
];

const CAT_10_ELECTRICAL_PANEL_SEVERE_PATTERNS = [
  'overcurrent protection device is contaminated',
  'overcurrent protection device (i.e., fuse or breaker) is contaminated',
  'water, rust, corrosion, infestation, or foreign materials',
];

const CAT_10_ELECTRICAL_PANEL_MODERATE_PATTERNS = [
  'electrical service panel is not reasonably accessible',
  'cannot be reached and opened without moving obstructions',
  'it is looked or in locked location, no key to access',
  'locked or in locked location',
  'dismantling, destructive measures, or actions that may pose a risk',
];

// ----------------------------------------------------------------------------
// Category 11: Elevator - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_11_ELEVATOR_PATTERNS = [
  'more than 3/4 inch difference in level between the elevator cab and the building floor',
  'all elevators must be in working condition',
  'elevator system or component thereof not meeting function or purpose',
  'system or a component thereof is not meeting its function or purpose',
  'elevator door does not fully open or close',
  'elevator door does not fully open',
  'elevator is inoperable',
  'safety edge device has malfunctioned or is inoperable',
  'safety edge device is not functionally adequate',
  'poses tripping hazards',
];

// ----------------------------------------------------------------------------
// Category 12: Fire Safety - Exit Sign - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_12_FIRE_EXIT_SIGN_PATTERNS = [
  'exit sign is deficient',
  'exit is not clearly visible',
  'exit isn\'t clearly visible',
  'not adequately illuminated',
  'exit sign is damaged',
  'exit sign is missing',
  'exit sign is obstructed',
  'exit sign is damaged, missing, obstructed, or not adequately illuminated',
];

// ----------------------------------------------------------------------------
// Category 12: Fire Safety - Fire Extinguisher - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_12_FIRE_EXTINGUISHER_PATTERNS = [
  'fire extinguisher is damaged or missing',
  'fire extinguisher is damaged',
  'fire extinguisher is missing',
  'pressure gauge indicates that the fire extinguisher is over or under charged',
  'over or under charged',
  'date on the service tag of any fire extinguisher has exceeded one year',
  'fire extinguisher tag is missing or illegible',
  'fire extinguisher tag is missing or illegible or expired',
  'non-chargeable or disposable fire extinguisher is more than 12 years old',
  'based on manufacture date',
];

// ----------------------------------------------------------------------------
// Category 12: Fire Safety - Flammable and Combustible Item - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_12_FLAMMABLE_COMBUSTIBLE_PATTERNS = [
  'excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the unit',
  'propane, gasoline, kerosene should never be stored',
  'flammable or combustible item',
  'flammable or combustible material is on or within 3 feet of an appliance that provides heat',
  'improperly stored chemical',
];

// ----------------------------------------------------------------------------
// Category 12: Fire Safety - Smoke Alarm - Life-Threatening - 0.000 (ZERO)
// All smoke alarm deficiencies result in 0 points formula
// ----------------------------------------------------------------------------
const CAT_12_SMOKE_ALARM_PATTERNS = [
  'required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing',
  'does not emit visual or audio alarm',
  'alarm does not cease after testing',
  'required smoke alarm does not produce an audio or visual alarm when tested',
  'smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level',
  'not installed within a hallway in the vicinity of multiple units',
  'smoke alarm not installed where required',
  'smoke alarm is covered by a foreign object',
  'smoke alarm is obstructed',
  'plastic bag, shower cap, zip tie, paint, tape, decorative stickers',
  'unable to determine if a required smoke alarm meets the requirement of this standard',
  'consider the condition a deficiency',
  'required smoke alarm is not hardwired',
  '10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device',
];

// ----------------------------------------------------------------------------
// Category 12: Fire Safety - Sprinkler Assembly - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_12_SPRINKLER_ASSEMBLY_PATTERNS = [
  'sprinkler assembly component is damaged, inoperable or missing',
  'detrimental to performance',
  'sprinkler head assembly has evidence of corrosion',
  'evidence of corrosion',
  'foreign material covers 50% or more of the sprinkler assembly',
  '50% or more of the glass bulb on the sprinkler assembly',
  'evidence of debris, paint, or foreign material detrimental to performance',
  '18 inches clearance is not due to feature within built',
  'sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches',
];

// ----------------------------------------------------------------------------
// Category 13: Floor - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_13_FLOOR_PATTERNS = [
  'surface abnormalities may indicate the presence of deficiency',
  'lifting tiles',
  'hardwood cupping',
  'linoleum bubbling',
  'repair is needed',
  'floor component(s) is not functionally adequate',
  'wood rot, sloping, deflection',
  '10% or more of the floor substrate area is exposed',
];

// ----------------------------------------------------------------------------
// Category 14: Foundation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_14_FOUNDATION_PATTERNS = [
  'foundation exhibits a sign of failure, and it is not structural',
  'foundation cracks',
  'cracks in walls, no functioning doors, unlevel floors or windows',
  'excessive dampness, collected water, stains, or mineral deposits',
  'foundation damage',
  'rot on support posts, columns, or girders',
  'foundation exposed rebar or foundation is spalling, flaking, or chipping',
  'affected area is 12x12 inches or greater',
  'goes into the foundation at a depth of ¾ inch or greater',
  'crack is present with a width of ¼ inch or greater and a length of 12 inches or greater',
  'evidence of water infiltration through the foundation',
  'support post, column, or girder area is damaged',
];

// ----------------------------------------------------------------------------
// Category 15: Grab Bar - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_15_GRAB_BAR_PATTERNS = [
  'damaged, loose, or missing',
  'grab bar is damaged',
  'grab bar is loose',
  'grab bar is missing',
  'grab bar is not secured',
  'any movement whatsoever is detected in the grab bar',
];

// ----------------------------------------------------------------------------
// Category 16: Hazard - Infestation
// - Moderate: 5.0/n (most infestations)
// - Severe: 13.40/n (extensive live cockroach infestation)
// ----------------------------------------------------------------------------
const CAT_16_INFESTATION_MODERATE_PATTERNS = [
  'evidence of bedbugs is found',
  'live or dead bedbugs, feces, eggs, or blood trail',
  'evidence of cockroaches is found',
  'dead or live cockroaches, shed skins, droppings',
  'evidence of cockroaches(dead)',
  'evidence of mice is found',
  'live or dead mouse or mice, droppings, chewed holes, or urine trails',
  'evidence is present of other pest infestations',
  'trail of ants, wasps/beehives, squirrels, birds, and bats',
  'evidence of other pests',
  'evidence of rats is found',
  'live or dead rat or droppings, chewed holes',
  'sighting of at least one live bedbug in two or more units',
  'extensive bedbugs infestation',
  'sighting of at least one live mouse in two or more, units',
  'extensive mouse infestation',
  'live rat is seen in the unit',
  'extensive rat infestation',
];

const CAT_16_INFESTATION_SEVERE_PATTERNS = [
  'extensive cockroach infestation (live)',
  'sighting of one or more live cockroaches in two or more area observed simultaneously',
];

// ----------------------------------------------------------------------------
// Category 16: Hazard - LITTER - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_16_LITTER_PATTERNS = [
  'litter is accumulated in an unassigned area',
  'litter is accumulated in an undesignated area',
  'litter is considered deficient if 10 or more small items',
  '10×10 ft area not designated for garbage',
  '10 or more small items',
  'any large discarded items',
];

// ----------------------------------------------------------------------------
// Category 16: Hazard - Sharp edges - Severe - 13.40/n
// ----------------------------------------------------------------------------
const CAT_16_SHARP_EDGES_PATTERNS = [
  'sharp edge that can result in a cut or puncture hazard',
  'sharp edge that can result in a cut or puncture hazard that is likely to require emergency care',
  'stitches',
  'broken glass, damaged tile with exposed edges, or a damaged handrail',
];

// ----------------------------------------------------------------------------
// Category 16: Hazard - Trip hazard - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_16_TRIP_HAZARD_PATTERNS = [
  'abrupt change in vertical elevation or horizontal separation',
  'unintended ¾ inch or greater vertical difference',
  'unintended 2-inch horizontal separation perpendicular to the path of travel',
  'trip hazard on walking surface',
];

// ----------------------------------------------------------------------------
// Category 17: Heating, Ventilation, and Air Conditioning
// - Low: 2.20/n (AC system not operational)
// - Life-Threatening: 27.25/n (combustion chamber, fuel-burning exhaust, unvented space heater, Oct-Mar not working)
// - Severe: 13.40/n (safety shield)
// - Moderate: 13.40/n (Apr-Sep heating damaged/inoperable)
// ----------------------------------------------------------------------------
const CAT_17_HVAC_LOW_PATTERNS = [
  'a window unit or central air system',
  'window unit or central air system',
  'air conditioning system or device is not operational',
  'system or device does not turn on',
  'system or device only produces hot or room temperature air',
];

const CAT_17_HVAC_LIFE_THREATENING_PATTERNS = [
  'combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance',
  'combustion chamber cover or gas shutoff valve was previously installed and is now not present or is incomplete',
  'combustion chamber cover',
  'gas shutoff valve was previously installed and is now not present',
  'fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing',
  'exhaust vent is misaligned, blocked, disconnected, or improperly connected',
  'not properly connected through to the ceiling or wall',
  'metal tape of any kind is not a substitute for improperly connected flue vent',
  'exhaust vent is damaged',
  'exhaust vent is missing',
  'inspection date is on or between october 1 and march 31 and the permanently installed heating source is not working',
  'permanally installed heating source is not working',
  'interior temperature is below 64 degrees fahrenheit',
  'permanently installed heating source is not working to create heat',
  'unvented space heater is present',
  'unvented space heater that burns gas, oil, or kerosene is present',
  'inside, include any and all common areas',
];

const CAT_17_HVAC_SEVERE_PATTERNS = [
  'heating system or device safety shield is damaged or missing',
  'safety shield was previously installed and is now not present or is incomplete',
  'safety shield is damaged',
  'safety shield is missing',
];

const CAT_17_HVAC_MODERATE_PATTERNS = [
  'inspection date is on or between april 1 and september 30, and a heating source is damaged, inoperable, missing, or not installed',
  'permanently installed heating source is damaged',
  'permanently installed heating source is inoperable',
  'permanently installed heating source is missing',
  'permanently installed heating source is not installed',
  'outside temperature is below 68 degrees fahrenheit',
];

// ----------------------------------------------------------------------------
// Category 18: Kitchen - Cabinet and Storage - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_18_KITCHEN_CABINET_PATTERNS = [
  'kitchen cabinet doors, drawers, or shelves are missing',
  'storage component is damaged, inoperable, or missing',
  'evidence of prior installation, but now not present or incomplete',
  'visibly defective; impacts the functionality',
  'does not meet the functionality or serve the purpose',
];

// ----------------------------------------------------------------------------
// Category 18: Kitchen - Cooking Appliance
// - Moderate: 5.0/n (one burner not working, component missing)
// - Severe: 13.40/n (no burner produces heat, oven does not produce heat)
// ----------------------------------------------------------------------------
const CAT_18_KITCHEN_COOKING_APPLIANCE_MODERATE_PATTERNS = [
  'burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat',
  'burner does not produce heat, but at least one other burner is present',
  'cooking range, cooktop, or oven component is missing',
  'cooking range, cooktop, or oven component, including the oven door seal is damaged or missing',
  'device is unsafe for use',
];

const CAT_18_KITCHEN_COOKING_APPLIANCE_SEVERE_PATTERNS = [
  'cooking range, cooktop, or oven does not ignite or produce heat',
  'no burner on the cooking range or cooktop produces heat',
  'oven does not produce heat temperature',
  'oven does not produce heat',
];

// ----------------------------------------------------------------------------
// Category 18: Kitchen - Food preparation Area - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_18_KITCHEN_FOOD_PREP_PATTERNS = [
  'kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate',
  '10% or more of the surface is exposed substrate',
  'countertop is missing',
  'food preparation area is damaged or is not functionally adequate',
  'food preparation area is not present',
  'space does not reasonably support adequate food preparation',
];

// ----------------------------------------------------------------------------
// Category 18: Kitchen - MOLD-LIKE SUBSTANCE
// - Moderate: 5.0/n (elevated moisture, 4" to 1 sq ft)
// - Severe: 13.40/n (1 to 9 sq ft)
// - Life-Threatening: 27.25/n (>9 sq ft)
// ----------------------------------------------------------------------------
const CAT_18_KITCHEN_MOLD_MODERATE_PATTERNS = [
  'elevated moisture level',
  'peeling paint or wallpaper, a wall that is warped or stained',
  'peeling paint-elevated moisture level',
  'buckled, cracked, or water-stained ceiling, carpet, or wooden floor',
  'cumulative area of patches is more than 4 square inches and less than one square foot',
  'cumulative area of patches is more than 4 square inches and less than 1 square foot',
  '4" or less-- presence of mold-like substance at moderate level observed visually',
];

const CAT_18_KITCHEN_MOLD_SEVERE_PATTERNS = [
  'cumulative area of patches is more than 1 square foot and less than 9 square feet in a room',
  '1\' to 9\' sf-presence of mold-like substance at high levels is observed visually',
];

const CAT_18_KITCHEN_MOLD_LIFE_THREATENING_PATTERNS = [
  'cumulative area of patches is more than 9 square foot in a room',
  'cumulative area of patches is more than 9 square feet in a room',
  'more than 9\'sf- presence of mold-like substance at extremely high levels is observed visually',
];

// ----------------------------------------------------------------------------
// Category 18: Kitchen - Refrigerator - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_18_KITCHEN_REFRIGERATOR_PATTERNS = [
  'refrigerator component is damaged',
  'refrigerator component is damaged such that it impacts functionality',
  'visibly defective',
  'impacts functionality',
  'refrigerator is inoperable',
  'unable to safely and adequately store food',
  'refrigerator is inoperable such that it may be unable to safely and adequately store food',
];

// ----------------------------------------------------------------------------
// Category 18: Kitchen - Sink
// - Moderate: 5.0/n (control knobs, missing component, separation, drain)
// - Low: 2.20/n (damaged but functionally adequate, water pressure)
// ----------------------------------------------------------------------------
const CAT_18_KITCHEN_SINK_MODERATE_PATTERNS = [
  'control knobs do not activate or deactivate hot and cold water',
  'cannot activate or deactivate hot and cold water',
  'sink component is missing',
  'sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete)',
  'sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall',
  'signs of separation at the seams of a sink or vanity is pulling away from the wall',
  'sink is not draining, not functioning adequately',
  'water is not draining from the basin of the sink',
  'slow or clogged drain',
];

const CAT_18_KITCHEN_SINK_LOW_PATTERNS = [
  'sink component is damaged and the sink is functionally adequate',
  'sink component is damaged or missing, and the sink is functionally adequate',
  'sink is functionally adequate',
  'water pressure, direction is not adequately functional',
  'water pressure, direction',
  'direction is not adequately functional',
];

// ----------------------------------------------------------------------------
// Category 18: Kitchen - Ventilation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_18_KITCHEN_VENTILATION_PATTERNS = [
  'exhaust fan, window, or adequate means of ventilation is not present and operable',
  'kitchen does not have ventilation, not present and operable',
  'exhaust system component is damaged',
  'exhaust system component is missing',
  'exhaust system does not respond to the control switch',
  'exhaust vent inoperable',
  'exhaust system has restricted air flow',
  'exhaust system is blocked such that airflow may be restricted',
];

// ----------------------------------------------------------------------------
// Category 19: LEAK – Gas or Oil - Life-Threatening - 54.50/n
// ----------------------------------------------------------------------------
const CAT_19_GAS_OIL_LEAK_PATTERNS = [
  'natural gas, propane, or oil leak',
  'natural gas leak',
  'propane leak',
  'oil leak',
  'gas leak',
  'evidence of a gas, propane, or oil leak',
  'uncapped gas or fuel supply line',
];

// ----------------------------------------------------------------------------
// Category 20: Leak-sewage system (Clogged drain)(Missing drain cap)
// - Severe: 13.40/n (blocked sewage system, leak in sewage system)
// - Moderate: 5.0/n (cap detached/missing, riser damaged)
// ----------------------------------------------------------------------------
const CAT_20_SEWAGE_LEAK_SEVERE_PATTERNS = [
  'blocked sewage system',
  'wastewater is unable to drain resulting in sewer backup',
  'sewer backup',
  'leak in sewage system',
  'evidence of a sewer line or fitting leaking',
];

const CAT_20_SEWAGE_LEAK_MODERATE_PATTERNS = [
  'cap to the cleanout or pump cover is detached or missing',
  'protective cap to drain',
  'cleanout cap or riser is damaged',
  'protective cap or riser is damaged',
];

// ----------------------------------------------------------------------------
// Category 21: Leak - water - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_21_WATER_LEAK_PATTERNS = [
  'environmental water intrusion',
  'water from the exterior environment is leaking into the interior',
  'fluid is leaking from the sprinkler assembly',
  'plumbing leak',
  'failure of a plumbing system that allows for water intrusion in unintended areas',
];

// ----------------------------------------------------------------------------
// Category 22: Lighting
// - Severe: 13.40/n (auxiliary lighting)
// - Moderate: 5.0/n (interior lighting)
// ----------------------------------------------------------------------------
const CAT_22_LIGHTING_AUXILIARY_SEVERE_PATTERNS = [
  'auxiliary lighting is damaged, missing or fail to illuminate when tested',
  'auxiliary lighting is not present or not installed',
  'fails to illuminate when tested',
];

const CAT_22_LIGHTING_INTERIOR_MODERATE_PATTERNS = [
  'permanently installed light fixture is inoperable',
  'permanently installed light fixture is not secure',
  'permanently installed light fixture is not secure to the designed attachment point',
  'attachment point is not stable',
  'permanent lighting fixtures are missing or not functioning',
  'at least one (1) permanently installed light fixture is not present in the kitchen or restroom',
];

// ----------------------------------------------------------------------------
// Category 23: Mold - Like Substance
// - Moderate: 5.0/n (elevated moisture, 4" to 1 sq ft)
// - Severe: 13.40/n (1 to 9 sq ft)
// - Life-Threatening: 27.25/n (>9 sq ft)
// ----------------------------------------------------------------------------
const CAT_23_MOLD_MODERATE_PATTERNS = [
  'elevated moisture level',
  'peeling paint, elevated moisture level',
  'peeling paint or wallpaper, a wall that is warped or stained',
  'buckled, cracked, or water-stained ceiling, carpet, or wooden floor',
  'cumulative area of patches is more than 4 square inches and less than 1 square foot',
  '4" or less-- presence of mold-like substance at moderate level observed visually',
];

const CAT_23_MOLD_SEVERE_PATTERNS = [
  'cumulative area of patches is more than 1 square foot and less than 9 square feet in a room',
  'cumulative area of patches is more than one square foot and less than 9 square feet',
  '1\' to 9\' sf-presence of mold-like substance at high levels is observed visually',
];

const CAT_23_MOLD_LIFE_THREATENING_PATTERNS = [
  'cumulative area of patches is more than 9 square foot in a room',
  'cumulative area of patches is more than 9 square feet in a room',
  'more than 9\'sf- presence of mold-like substance at extremely high levels is observed visually',
];

// ----------------------------------------------------------------------------
// Category 24: Paint - Potential Lead-Based Paint Hazards – Visual Assessment
// - Moderate: 5.0/n (less than 2 sq ft per room)
// - Severe: 13.40/n (more than 2 sq ft per room)
// ----------------------------------------------------------------------------
const CAT_24_PAINT_HAZARD_MODERATE_PATTERNS = [
  'less than 2 square feet per room deteriorated paint',
  'less than or equal to 2 square feet, per room',
  'for small surface areas, less than or equal to 10% per component',
  'de minimis',
  'paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate)',
  'damage to the surface such as holes that expose paint layers',
  'friction on painted surfaces',
];

const CAT_24_PAINT_HAZARD_SEVERE_PATTERNS = [
  'more than 2 square feet per room deteriorated paint',
  'more than 2\' sf-paint in a unit or inside the target property is deteriorated',
  'for large surface areas in the unit, deteriorated paint is more than 2 square feet',
  'greater than 10% per component',
  'significant',
];

// ----------------------------------------------------------------------------
// Category 25: Railings - Guardrail - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_25_GUARDRAIL_PATTERNS = [
  'guardrail is missing',
  'guardrail is not installed',
  'evidence of prior installation but is now not present or is incomplete',
  'not installed along a walking surface that is more than 30 inches above the floor or grade below',
  'guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height',
  'guard rail component, missing, damaged',
  'not securely attached to effectively prevent fall hazards',
];

// ----------------------------------------------------------------------------
// Category 25: Railings - Handrail
// - Moderate: 27.25/n (handrail is missing)
// - Moderate: 5.0/n (not functionally adequate, not secured)
// - Severe: 13.40/n (not installed where required)
// ----------------------------------------------------------------------------
const CAT_25_HANDRAIL_MODERATE_27_25_PATTERNS = [
  'handrail is missing',
  'handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete)',
];

const CAT_25_HANDRAIL_MODERATE_5_0_PATTERNS = [
  'handrail is not functionally adequate',
  'handrail is deficient if it can\'t be reasonably grasped for support',
  'isn\'t continuous along the full stair flight',
  'falls outside the required height range of 28 to 42 inches',
  'handrail is not secured',
  'movement in the anchors of the handrail',
  'there is movement in the anchors of the handrail',
];

const CAT_25_HANDRAIL_SEVERE_PATTERNS = [
  'handrail is not installed where required',
  '4 or more stair risers are present, and a handrail is not installed',
  'ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides',
];

// ----------------------------------------------------------------------------
// Category 26: Restroom - Bathtub and Shower
// - Low: 2.20/n (common area inoperable, water fixture, personal hygiene)
// - Moderate: 5.0/n (privacy - cannot be used in private)
// ----------------------------------------------------------------------------
const CAT_26_RESTROOM_BATHTUB_LOW_PATTERNS = [
  'common area bathtub or shower is present, and it is inoperable',
  'common area, the bathtub or shower is inoperable or does not drain',
  'not meeting function or purpose, with or without visible damage',
  'standing water is present such that water is unable to drain',
  'common area bathtub or shower water fixture is damaged or inoperable',
  'common area bathtub or shower hardware and water fixtures',
  'may not limit the resident\'s ability to maintain personal hygiene',
  'bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to maintain personal hygiene',
  'bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene',
  'limits the resident\'s ability to maintain personal hygiene',
];

const CAT_26_RESTROOM_BATHTUB_MODERATE_PATTERNS = [
  'bathtub or shower cannot be used in private',
  'hole in the door and damaged hardware, missing door',
  'resident should be able to use the bathtub or shower without being observed',
  'use the bathtub or shower without being observed from an adjacent area or exterior space',
];

// ----------------------------------------------------------------------------
// Category 26: Restroom - Cabinet and Storage - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_26_RESTROOM_CABINET_PATTERNS = [
  'restroom cabinet doors, drawers, or shelves are missing',
  'storage component is damaged, inoperable, or missing',
];

// ----------------------------------------------------------------------------
// Category 26: Restroom - Grab Bar - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_26_RESTROOM_GRAB_BAR_PATTERNS = [
  'grab bar is not secure',
  'any movement whatever is detected in the grab bar',
  'any movement whatsoever is detected in the grab bar',
];

// ----------------------------------------------------------------------------
// Category 26: Restroom - Mold - Like Substance
// - Moderate: 5.0/n (elevated moisture, 4" to 1 sq ft)
// - Severe: 13.40/n (1 to 9 sq ft)
// - Life-Threatening: 27.25/n (>9 sq ft)
// ----------------------------------------------------------------------------
const CAT_26_RESTROOM_MOLD_MODERATE_PATTERNS = [
  'elevated moisture level',
  'peeling paint-elevated moisture level',
  'peeling paint or wallpaper, a wall that is warped or stained',
  'buckled, cracked, or water-stained ceiling, carpet, or wooden floor',
  'cumulative area of patches is more than 4 square inches and less than 1 square foot',
  '4" or less presence of a mold-like substance at a moderate level observed visually',
];

const CAT_26_RESTROOM_MOLD_SEVERE_PATTERNS = [
  'cumulative area of patches is more than one square foot and less than 9 square feet in a room',
  '1\' to 9\' sf-presence of mold-like substance at high levels is observed visually',
];

const CAT_26_RESTROOM_MOLD_LIFE_THREATENING_PATTERNS = [
  'cumulative area of patches is more than 9 square foot in a room',
  'cumulative area of patches is more than 9 square feet in a room',
  'more than 9\'sf- presence of mold-like substance at extremely high levels is observed visually',
];

// ----------------------------------------------------------------------------
// Category 26: Restroom - Sink
// - Moderate: 5.0/n (control knobs, missing, separation, drain, damaged)
// - Low: 2.20/n (water directed outside basin)
// ----------------------------------------------------------------------------
const CAT_26_RESTROOM_SINK_MODERATE_PATTERNS = [
  'control knobs do not activate or deactivate hot and cold water',
  'cannot activate or deactivate hot and cold water',
  'sink component is missing',
  'sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete)',
  'sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall',
  'signs of separation at the seams of a sink or vanity is pulling away from the wall',
  'sink is not draining, not functioning adequately',
  'water is not draining from the basin of the sink',
  'slow or clogged drain',
  'sink component is damaged or missing, and the sink is not functionally adequate',
];

const CAT_26_RESTROOM_SINK_LOW_PATTERNS = [
  'when in use, water is directed outside of the basin',
  'water is directed outside of the basin',
];

// ----------------------------------------------------------------------------
// Category 26: Restroom - Toilet - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_26_RESTROOM_TOILET_PATTERNS = [
  'toilet is deficient if it\'s damaged or inoperable',
  'toilet is damaged or inoperable and at least 1 toilet is installed elsewhere that is operational',
  'another operational toilet exists elsewhere in the building',
  'toilet is missing',
  'toilet is missing and at least 1 toilet is installed elsewhere',
  'only 1 toilet was installed, and it is damaged or inoperable',
  'single installed toilet is deficient if it\'s damaged or inoperable',
  'only 1 toilet was installed, and it is missing',
  'toilet can not be used in private',
  'hole in the door and damaged hardware, missing door',
  'toilet is deficient if any component is damaged, inoperable, or missing',
  'limits the resident\'s ability to discharge human waste safely',
  'toilet component is deficient if it\'s damaged, inoperable, or missing',
  'does not limit the resident\'s ability to discharge human waste',
  'toilet is not secured at the base',
];

// ----------------------------------------------------------------------------
// Category 26: Restroom - Ventilation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_26_RESTROOM_VENTILATION_PATTERNS = [
  'restroom does not have ventilation, not present and operable',
  'effecting the restroom',
  'exhaust system component is missing or damaged, affecting the function adequately',
  'exhaust system component is damaged or missing',
  'exhaust system does not respond to the control switch',
  'exhaust fan, inoperable',
  'exhaust system has restricted air flow',
  'exhaust system is blocked such that airflow may be restricted',
];

// ----------------------------------------------------------------------------
// Category 27: Sink (Laundry, Garage, or patio)
// - Moderate: 5.0/n (control knobs, missing, separation, drain)
// - Low: 2.20/n (stopper missing/damaged)
// ----------------------------------------------------------------------------
const CAT_27_LAUNDRY_SINK_MODERATE_PATTERNS = [
  'control knobs do not activate or deactivate hot and cold water',
  'sink component is missing',
  'sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete)',
  'sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall',
  'signs of separation at the seams of a sink or vanity is pulling away from the wall',
  'sink is missing',
  'not present or incomplete',
  'sink not draining',
  'water is not draining from the basin of the sink',
];

const CAT_27_LAUNDRY_SINK_LOW_PATTERNS = [
  'sink component is damaged (i.e., stopper missing, damaged or inoperable)',
  'stopper missing, damaged or inoperable',
  'component is damaged',
];

// ----------------------------------------------------------------------------
// Category 28: Steps and Stairs - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_28_STEPS_STAIRS_PATTERNS = [
  'stringer is damaged',
  'instability is detected while walking on the stair',
  'tread on a set of stairs damaged',
  'tread on a set of stairs is missing',
  'portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide',
  'secure accessory treads are not present',
];

// ----------------------------------------------------------------------------
// Category 29: Structural System - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CAT_29_STRUCTURAL_SYSTEM_PATTERNS = [
  'structural system exhibits signs of serious failure',
  'significant structural damage that affects occupants\' safety',
  'may threaten the residents\' safety',
];

// ----------------------------------------------------------------------------
// Category 30: Trash Chute - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_30_TRASH_CHUTE_PATTERNS = [
  'chute door does not open, self-close, or latch',
  'chute door does not open or self-close and latch',
  'chute door is damaged',
  'chute is clogged',
  'trash is overflowing or backed up inside chute',
  'garbage is backing up into the chute',
];

// ----------------------------------------------------------------------------
// Category 31: Ventilation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_31_VENTILATION_PATTERNS = [
  'ventilation (with or without a fan)',
  'it is not functioning adequately',
  'effecting the room',
  'exhaust system component is damaged',
  'exhaust system component is missing',
  'exhaust system does not respond to the control switch',
  'exhaust fan, inoperable',
  'exhaust system has restricted air flow',
  'exhaust system is blocked such that airflow may be restricted',
];

// ----------------------------------------------------------------------------
// Category 32: Wall - Interior - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CAT_32_WALL_INTERIOR_PATTERNS = [
  'interior wall component(s) is not functionally adequate',
  'interior wall component(s), severe cracks, not functionally adequate',
  'impacts the integrity of the interior wall',
  'does not allow interior wall to provide vertical separation between rooms or spaces',
  'damaged trim greater than 10% to 50% of the wall area',
  'hole is greater than 2 inches in diameter',
  'accumulation of holes in any one wall is greater than 6 inches by 6 inches',
  'wall is damaged, and repairs still need to be completed appropriately',
  'interior wall has a loose or detached surface covering',
  'loose or detached surface coverings',
  'drywall, plaster, paneling',
];

// ----------------------------------------------------------------------------
// Category 33: Water Heater
// - Life-Threatening: 27.25/n (chimney/flue blocked, gas shutoff valve damaged/missing)
// - Severe: 13.40/n (no hot water, TPRV issues)
// - Moderate: 5.0/n (relief valve discharge piping termination)
// ----------------------------------------------------------------------------
const CAT_33_WATER_HEATER_LIFE_THREATENING_PATTERNS = [
  'chimney or flue piping is blocked, misaligned, or missing',
  'the vent is damaged/misaligned/not connected properly',
  'vent is damaged',
  'vent is misaligned',
  'vent is not connected properly',
  'gas shutoff valve is damaged, missing or not installed',
  'gas shutoff valve is deficient if it\'s damaged, missing, or not installed where required',
  'gas shutoff valve is damaged',
  'gas shutoff valve is missing',
  'gas shutoff valve is not installed',
];

const CAT_33_WATER_HEATER_SEVERE_PATTERNS = [
  'no hot water',
  'hot water does not dispense after handle is engaged',
  'no hot water after several minutes',
  'tprv has an active leak',
  'tprv is obstructed such that the tprv cannot be fully actuated',
  'relief valve discharge piping is damaged',
  'relief valve discharge piping is capped, has an upward slope, or is constructed of unsuitable material',
  'the tprv valve is not functioning adequately',
];

const CAT_33_WATER_HEATER_MODERATE_PATTERNS = [
  'relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level',
  'relief valve discharge piping is missing',
  'not properly installed',
];

// ----------------------------------------------------------------------------
// Category 34: Window
// - Moderate: 5.0/n (cannot be secured, not functionally adequate, will not stay open)
// - Severe: 13.40/n (will not close)
// ----------------------------------------------------------------------------
const CAT_34_WINDOW_MODERATE_PATTERNS = [
  'window cannot be secured',
  'only one lock present, and it is damaged, inoperable',
  'cannot be secured by at least 1 installed lock',
  'window component is damaged or missing, and the window is not functionally adequate',
  'window is not functionally adequate',
  'missing or damaged window seals',
  'cannot protect from the elements',
  'window screen has a hole, tear, or cut that is 1 inch or greater',
  'can not protect from bugs, or debris',
  'window will not open or stay open',
  'window will not open',
  'will not stay open without the use of a tool or item',
];

const CAT_34_WINDOW_SEVERE_PATTERNS = [
  'window will not close',
  'window does not close completely',
  'at least one window lock is not present',
  'window can be opened once the lock is engaged',
  'window lock does not keep the window closed',
];

// ============================================================================
// AGGREGATED PATTERN ARRAYS FOR MATCHING
// ============================================================================

// Zero formula patterns - 0.000 (Smoke Alarm, CO Alarm)
const ZERO_FORMULA_PATTERNS = [
  ...CAT_3_CARBON_MONOXIDE_ALARM_PATTERNS,
  ...CAT_12_SMOKE_ALARM_PATTERNS,
];

// Gas/Oil Leak patterns - 54.50/n
const GAS_LEAK_PATTERNS = [
  ...CAT_19_GAS_OIL_LEAK_PATTERNS,
];

// Special formula patterns - 27.25/(50*n) for Call-for-Aid annunciator
const SPECIAL_FORMULA_LIFE_THREATENING_50N_PATTERNS = [
  ...CAT_2_CALL_FOR_AID_LIFE_THREATENING_PATTERNS,
];

// Special formula patterns - 13.40/(50*n) for Call-for-Aid pull cord
const SPECIAL_FORMULA_SEVERE_50N_PATTERNS = [
  ...CAT_2_CALL_FOR_AID_SEVERE_PATTERNS,
];

// Low severity patterns - 2.20/n
const LOW_DEFICIENCY_PATTERNS = [
  ...CAT_1_CABINET_STORAGE_PATTERNS,
  ...CAT_7_DOOR_ENTRY_LOW_PATTERNS,
  ...CAT_7_DOOR_GENERAL_LOW_PATTERNS,
  ...CAT_17_HVAC_LOW_PATTERNS,
  ...CAT_18_KITCHEN_SINK_LOW_PATTERNS,
  ...CAT_26_RESTROOM_BATHTUB_LOW_PATTERNS,
  ...CAT_26_RESTROOM_SINK_LOW_PATTERNS,
  ...CAT_27_LAUNDRY_SINK_LOW_PATTERNS,
];

// Severe patterns - 13.40/n
const SEVERE_DEFICIENCY_PATTERNS = [
  ...CAT_4_CEILING_SEVERE_PATTERNS,
  ...CAT_7_DOOR_ENTRY_SEVERE_PATTERNS,
  ...CAT_7_DOOR_FIRE_LABELED_SEVERE_PATTERNS,
  ...CAT_10_ELECTRICAL_SEVERE_PATTERNS,
  ...CAT_10_ELECTRICAL_GFCI_AFCI_SEVERE_PATTERNS,
  ...CAT_10_ELECTRICAL_PANEL_SEVERE_PATTERNS,
  ...CAT_16_INFESTATION_SEVERE_PATTERNS,
  ...CAT_16_SHARP_EDGES_PATTERNS,
  ...CAT_17_HVAC_SEVERE_PATTERNS,
  ...CAT_18_KITCHEN_COOKING_APPLIANCE_SEVERE_PATTERNS,
  ...CAT_18_KITCHEN_MOLD_SEVERE_PATTERNS,
  ...CAT_20_SEWAGE_LEAK_SEVERE_PATTERNS,
  ...CAT_22_LIGHTING_AUXILIARY_SEVERE_PATTERNS,
  ...CAT_23_MOLD_SEVERE_PATTERNS,
  ...CAT_24_PAINT_HAZARD_SEVERE_PATTERNS,
  ...CAT_25_HANDRAIL_SEVERE_PATTERNS,
  ...CAT_26_RESTROOM_MOLD_SEVERE_PATTERNS,
  ...CAT_33_WATER_HEATER_SEVERE_PATTERNS,
  ...CAT_34_WINDOW_SEVERE_PATTERNS,
];

// Life-Threatening patterns - 27.25/n
const LIFE_THREATENING_DEFICIENCY_PATTERNS = [
  ...CAT_5_CHIMNEY_PATTERNS,
  ...CAT_6_CLOTHES_DRYER_EXHAUST_PATTERNS,
  ...CAT_7_DOOR_FIRE_LABELED_LIFE_THREATENING_PATTERNS,
  ...CAT_9_EGRESS_PATTERNS,
  ...CAT_10_ELECTRICAL_LIFE_THREATENING_PATTERNS,
  ...CAT_10_ELECTRICAL_PANEL_LIFE_THREATENING_PATTERNS,
  ...CAT_12_FIRE_EXIT_SIGN_PATTERNS,
  ...CAT_12_FIRE_EXTINGUISHER_PATTERNS,
  ...CAT_12_FLAMMABLE_COMBUSTIBLE_PATTERNS,
  ...CAT_12_SPRINKLER_ASSEMBLY_PATTERNS,
  ...CAT_17_HVAC_LIFE_THREATENING_PATTERNS,
  ...CAT_18_KITCHEN_MOLD_LIFE_THREATENING_PATTERNS,
  ...CAT_23_MOLD_LIFE_THREATENING_PATTERNS,
  ...CAT_25_GUARDRAIL_PATTERNS,
  ...CAT_25_HANDRAIL_MODERATE_27_25_PATTERNS,
  ...CAT_26_RESTROOM_MOLD_LIFE_THREATENING_PATTERNS,
  ...CAT_29_STRUCTURAL_SYSTEM_PATTERNS,
  ...CAT_33_WATER_HEATER_LIFE_THREATENING_PATTERNS,
];

// Moderate patterns - 5.0/n
const MODERATE_DEFICIENCY_PATTERNS = [
  ...CAT_4_CEILING_MODERATE_PATTERNS,
  ...CAT_7_DOOR_ENTRY_MODERATE_5_0_PATTERNS,
  ...CAT_7_DOOR_GENERAL_MODERATE_PATTERNS,
  ...CAT_7_GARAGE_DOOR_PATTERNS,
  ...CAT_8_DRAINAGE_PATTERNS,
  ...CAT_10_ELECTRICAL_PANEL_MODERATE_PATTERNS,
  ...CAT_11_ELEVATOR_PATTERNS,
  ...CAT_13_FLOOR_PATTERNS,
  ...CAT_14_FOUNDATION_PATTERNS,
  ...CAT_15_GRAB_BAR_PATTERNS,
  ...CAT_16_INFESTATION_MODERATE_PATTERNS,
  ...CAT_16_LITTER_PATTERNS,
  ...CAT_16_TRIP_HAZARD_PATTERNS,
  ...CAT_17_HVAC_MODERATE_PATTERNS,
  ...CAT_18_KITCHEN_CABINET_PATTERNS,
  ...CAT_18_KITCHEN_COOKING_APPLIANCE_MODERATE_PATTERNS,
  ...CAT_18_KITCHEN_FOOD_PREP_PATTERNS,
  ...CAT_18_KITCHEN_MOLD_MODERATE_PATTERNS,
  ...CAT_18_KITCHEN_REFRIGERATOR_PATTERNS,
  ...CAT_18_KITCHEN_SINK_MODERATE_PATTERNS,
  ...CAT_18_KITCHEN_VENTILATION_PATTERNS,
  ...CAT_20_SEWAGE_LEAK_MODERATE_PATTERNS,
  ...CAT_21_WATER_LEAK_PATTERNS,
  ...CAT_22_LIGHTING_INTERIOR_MODERATE_PATTERNS,
  ...CAT_23_MOLD_MODERATE_PATTERNS,
  ...CAT_24_PAINT_HAZARD_MODERATE_PATTERNS,
  ...CAT_25_HANDRAIL_MODERATE_5_0_PATTERNS,
  ...CAT_26_RESTROOM_BATHTUB_MODERATE_PATTERNS,
  ...CAT_26_RESTROOM_CABINET_PATTERNS,
  ...CAT_26_RESTROOM_GRAB_BAR_PATTERNS,
  ...CAT_26_RESTROOM_MOLD_MODERATE_PATTERNS,
  ...CAT_26_RESTROOM_SINK_MODERATE_PATTERNS,
  ...CAT_26_RESTROOM_TOILET_PATTERNS,
  ...CAT_26_RESTROOM_VENTILATION_PATTERNS,
  ...CAT_27_LAUNDRY_SINK_MODERATE_PATTERNS,
  ...CAT_28_STEPS_STAIRS_PATTERNS,
  ...CAT_30_TRASH_CHUTE_PATTERNS,
  ...CAT_31_VENTILATION_PATTERNS,
  ...CAT_32_WALL_INTERIOR_PATTERNS,
  ...CAT_33_WATER_HEATER_MODERATE_PATTERNS,
  ...CAT_34_WINDOW_MODERATE_PATTERNS,
];

// Moderate 13.40/n patterns
const MODERATE_13_40_PATTERNS = [
  ...CAT_7_DOOR_ENTRY_MODERATE_13_40_PATTERNS,
];

const POSSIBLE_SCORE = 25;

/**
 * Get default severity configuration for Inside inspection
 * @param categoryNumber The NSPIRE Inside category number (not used for default, patterns determine severity)
 * @returns Default severity configuration
 */
export function getDefaultInsideSeverityConfig(categoryNumber: number): InsideSeverityConfig {
  // Default to Moderate with formula 5.0/n
  return { severity: 'Moderate', pointsLostFormula: 5.0 };
}

/**
 * Check if deficiency matches zero formula patterns (CO Alarm, Smoke Alarm) - 0.000
 */
function matchesZeroFormulaPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return ZERO_FORMULA_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches gas leak patterns - Life-Threatening with 54.50/n
 */
function matchesGasLeakPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return GAS_LEAK_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches special formula 27.25/(50*n) patterns (Call-for-Aid annunciator)
 */
function matchesSpecialFormulaLifeThreatening50nPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SPECIAL_FORMULA_LIFE_THREATENING_50N_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches special formula 13.40/(50*n) patterns (Call-for-Aid pull cord)
 */
function matchesSpecialFormulaSevere50nPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SPECIAL_FORMULA_SEVERE_50N_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Severe patterns - 13.40/n
 */
function matchesSevereDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SEVERE_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Low severity patterns - 2.20/n
 */
function matchesLowDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LOW_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Life-Threatening patterns - 27.25/n
 */
function matchesLifeThreateningDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LIFE_THREATENING_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Moderate severity patterns - 5.0/n
 */
function matchesModerateDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return MODERATE_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Moderate 13.40/n patterns
 */
function matchesModerate13_40Pattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return MODERATE_13_40_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

export function getInsideSeverityConfig(
  categoryNumber: number,
  deficiencyDescription?: string,
  selectedSeverity?: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'
): InsideSeverityConfig {
  // Check deficiency-based overrides first (they take precedence)
  // All patterns apply to ALL items regardless of category number
  if (deficiencyDescription) {
    // Check for zero formula patterns (CO Alarm, Smoke Alarm) - highest priority
    if (matchesZeroFormulaPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 0, specialFormula: 'zero' };
    }

    // Check for gas leak patterns - Life-Threatening with 54.50/n
    if (matchesGasLeakPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 54.50 };
    }

    // Check for special formula patterns (Call-for-Aid annunciator) - Life-Threatening with 54.50/(50*n)
    if (matchesSpecialFormulaLifeThreatening50nPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 54.50, specialFormula: 'divide_50n' };
    }

    // Check for special formula patterns (Call-for-Aid pull cord) - Severe with 13.40/(50*n)
    if (matchesSpecialFormulaSevere50nPattern(deficiencyDescription)) {
      return { severity: 'Severe', pointsLostFormula: 13.40, specialFormula: 'divide_50n' };
    }

    // Check for Severe deficiency patterns - 13.40/n
    if (matchesSevereDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Severe', pointsLostFormula: 13.40 };
    }

    // Check for Life-Threatening patterns - 54.50/n
    if (matchesLifeThreateningDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 54.50 };
    }

    // Check for Moderate 13.40/n patterns (Door Entry cannot be secured)
    if (matchesModerate13_40Pattern(deficiencyDescription)) {
      return { severity: 'Moderate', pointsLostFormula: 13.40 };
    }

    // Check for Moderate patterns - 5.0/n
    if (matchesModerateDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Moderate', pointsLostFormula: 5.0 };
    }

    // Check for Low severity patterns - 2.20/n
    if (matchesLowDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Low', pointsLostFormula: 2.20 };
    }
  }

  // If no pattern matched but we have a selected severity, use it with appropriate formula
  if (selectedSeverity) {
    switch (selectedSeverity) {
      case 'Life-Threatening':
        return { severity: 'Life-Threatening', pointsLostFormula: 54.50 };
      case 'Severe':
        return { severity: 'Severe', pointsLostFormula: 13.40 };
      case 'Low':
        return { severity: 'Low', pointsLostFormula: 2.20 };
      case 'Moderate':
      default:
        return { severity: 'Moderate', pointsLostFormula: 5.0 };
    }
  }

  // Fall back to default configuration
  return getDefaultInsideSeverityConfig(categoryNumber);
}

export interface InsideScoringInput {
  categoryNumber: number;       // NSPIRE Inside category number
  totalSamples: number;         // n - number of sample units
  deficiencyDescription?: string; // Optional deficiency description for override checking
  deficiencyCount?: number;     // Number of deficiencies (default: 1)
  severity?: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'; // Optional severity from deficiency selection
  deficiencyPointsFormula?: string; // Direct points formula from deficiency (e.g., "5.0/n", "13.40/n")
}

export interface InsideScoringResult {
  categoryNumber: number;       // Category number
  totalSamples: number;         // n - total sample units
  severity: string;             // Resolved severity level
  pointsLostRaw: number;        // Pts Lost (Raw) = base formula numerator
  pointsLost: number;           // Pts Lost = numerator / n (or special formula)
  deficiencyCount: number;      // Number of deficiencies
  possibleScore: number;        // Fixed at 25
  maxPtsLost: number;           // Max Pts Lost = Pts Lost / n
  score: number;                // Score = 25 - maxPtsLost
  formula: string;             // Resulting formula string (e.g. "27.25 / (50 * n)")
  formulaNumerator: number;     // The numerator used in the formula
  isDeficiencyOverride: boolean; // Whether deficiency-based override was applied
  specialFormula?: string;      // Special formula type if applicable
  // Aliases for backward compatibility
  allSample: number;
  ptsLostRaw: number;
  ptsLost: number;
}

/**
 * Calculate scoring for Inside inspection
 * 
 * Formulas:
 *   Points Lost (Raw) = formulaNumerator (base value)
 *   Points Lost = formulaNumerator / n (or special formula like 27.25/(50*n) or 0)
 *   Max Points Lost = Points Lost / n
 *   Score = Possible Score (25) − Max Points Lost
 * 
 * @param input Scoring input with category number, samples, and optional deficiency description
 * @returns Complete scoring result
 */
export function calculateInsideScore(input: InsideScoringInput): InsideScoringResult {
  const {
    categoryNumber,
    totalSamples,
    deficiencyDescription,
    deficiencyCount = 1,
    severity: selectedSeverity,
    deficiencyPointsFormula,
  } = input;

  // Ensure we don't divide by zero - minimum 1 sample
  const n = Math.max(totalSamples, 1);
  const count = Math.max(deficiencyCount, 0);

  // PRIORITY 1: Use direct deficiency points formula if provided (from deficiency data)
  let pointsLostRaw: number;
  let severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  let isDeficiencyOverride = false;
  let specialFormula: 'divide_50n' | 'zero' | undefined;

  if (deficiencyPointsFormula) {
    // Parse formula like "5.0/n", "13.40/n", "27.25/(50*n)", "0.000", etc.
    const match = deficiencyPointsFormula.match(/^([\d.]+)/);
    if (match) {
      pointsLostRaw = parseFloat(match[1]);
      severity = selectedSeverity || 'Moderate';
      isDeficiencyOverride = true;
      // Check for special formula types
      if (deficiencyPointsFormula.includes('/50')) {
        specialFormula = 'divide_50n';
      } else if (pointsLostRaw === 0 || deficiencyPointsFormula.includes('0.000')) {
        specialFormula = 'zero';
      }
    } else {
      // Fallback to category-based if parsing fails
      const severityConfig = getInsideSeverityConfig(categoryNumber, deficiencyDescription, selectedSeverity);
      pointsLostRaw = severityConfig.pointsLostFormula;
      severity = severityConfig.severity;
      specialFormula = severityConfig.specialFormula;
    }
  } else {
    // PRIORITY 2: Use category-based and deficiency description pattern matching
    const severityConfig = getInsideSeverityConfig(categoryNumber, deficiencyDescription, selectedSeverity);
    const categoryOnlyConfig = getDefaultInsideSeverityConfig(categoryNumber);

    pointsLostRaw = severityConfig.pointsLostFormula;
    severity = severityConfig.severity;
    specialFormula = severityConfig.specialFormula;
    isDeficiencyOverride = deficiencyDescription !== undefined &&
      (severityConfig.severity !== categoryOnlyConfig.severity ||
        severityConfig.pointsLostFormula !== categoryOnlyConfig.pointsLostFormula);
  }

  // Calculate Pts Lost based on formula type
  let pointsLost: number;
  let formula: string;
  if (specialFormula === 'zero') {
    // Zero formula for smoke alarm and CO alarm: 0.000
    pointsLost = 0;
    formula = '0.000';
  } else if (specialFormula === 'divide_50n') {
    // Special formula: numerator / (50 * n)
    pointsLost = pointsLostRaw / (50 * n);
    formula = `${pointsLostRaw.toFixed(2)} / (50 * n)`;
  } else {
    // Standard formula: numerator / n
    pointsLost = pointsLostRaw / n;
    formula = `${pointsLostRaw.toFixed(2)} / n`;
  }

  // Max Points Lost = Same as Points Lost (X / n)
  // NOT divided by n again - that was a bug causing incorrect severity display
  const maxPtsLost = pointsLost;

  // Calculate Score = Possible Score (25) - Points Lost
  // For example: Severe (13.40/n) with n=1: Score = 25 - 13.40 = 11.60
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
    formula,
    isDeficiencyOverride,
    specialFormula,
  };
}

/**
 * Extract category number from item ID or name
 * @param itemId The item ID (e.g., "1", "2", etc.)
 * @param itemName Optional item name to extract number from prefix
 * @returns The category number
 */
export function extractInsideCategoryNumber(itemId?: string, itemName?: string): number {
  // Try to get from itemId first
  if (itemId) {
    const num = parseInt(itemId, 10);
    if (!isNaN(num) && num >= 1) {
      return num;
    }
  }

  // Try to extract from item name (e.g., "1. Call for Aid")
  if (itemName) {
    const match = itemName.match(/^(\d+)\./);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num >= 1) {
        return num;
      }
    }
  }

  // Default to category 1 if not found
  return 1;
}

// Export deficiency pattern constants for external use
export const INSIDE_DEFICIENCY_PATTERNS = {
  ZERO_FORMULA: ZERO_FORMULA_PATTERNS,
  GAS_LEAK: GAS_LEAK_PATTERNS,
  SPECIAL_FORMULA_LIFE_THREATENING_50N: SPECIAL_FORMULA_LIFE_THREATENING_50N_PATTERNS,
  SPECIAL_FORMULA_SEVERE_50N: SPECIAL_FORMULA_SEVERE_50N_PATTERNS,
  SEVERE: SEVERE_DEFICIENCY_PATTERNS,
  LOW: LOW_DEFICIENCY_PATTERNS,
  LIFE_THREATENING: LIFE_THREATENING_DEFICIENCY_PATTERNS,
  MODERATE: MODERATE_DEFICIENCY_PATTERNS,
  MODERATE_13_40: MODERATE_13_40_PATTERNS,
  // Category-specific patterns for detailed access
  CAT_1_CABINET_STORAGE: CAT_1_CABINET_STORAGE_PATTERNS,
  CAT_2_CALL_FOR_AID_LIFE_THREATENING: CAT_2_CALL_FOR_AID_LIFE_THREATENING_PATTERNS,
  CAT_2_CALL_FOR_AID_SEVERE: CAT_2_CALL_FOR_AID_SEVERE_PATTERNS,
  CAT_3_CARBON_MONOXIDE_ALARM: CAT_3_CARBON_MONOXIDE_ALARM_PATTERNS,
  CAT_4_CEILING_SEVERE: CAT_4_CEILING_SEVERE_PATTERNS,
  CAT_4_CEILING_MODERATE: CAT_4_CEILING_MODERATE_PATTERNS,
  CAT_5_CHIMNEY: CAT_5_CHIMNEY_PATTERNS,
  CAT_6_CLOTHES_DRYER_EXHAUST: CAT_6_CLOTHES_DRYER_EXHAUST_PATTERNS,
  CAT_7_DOOR_ENTRY_MODERATE_13_40: CAT_7_DOOR_ENTRY_MODERATE_13_40_PATTERNS,
  CAT_7_DOOR_ENTRY_LOW: CAT_7_DOOR_ENTRY_LOW_PATTERNS,
  CAT_7_DOOR_ENTRY_MODERATE_5_0: CAT_7_DOOR_ENTRY_MODERATE_5_0_PATTERNS,
  CAT_7_DOOR_ENTRY_SEVERE: CAT_7_DOOR_ENTRY_SEVERE_PATTERNS,
  CAT_7_DOOR_FIRE_LABELED_SEVERE: CAT_7_DOOR_FIRE_LABELED_SEVERE_PATTERNS,
  CAT_7_DOOR_FIRE_LABELED_LIFE_THREATENING: CAT_7_DOOR_FIRE_LABELED_LIFE_THREATENING_PATTERNS,
  CAT_7_DOOR_GENERAL_LOW: CAT_7_DOOR_GENERAL_LOW_PATTERNS,
  CAT_7_DOOR_GENERAL_MODERATE: CAT_7_DOOR_GENERAL_MODERATE_PATTERNS,
  CAT_7_GARAGE_DOOR: CAT_7_GARAGE_DOOR_PATTERNS,
  CAT_8_DRAINAGE: CAT_8_DRAINAGE_PATTERNS,
  CAT_9_EGRESS: CAT_9_EGRESS_PATTERNS,
  CAT_10_ELECTRICAL_LIFE_THREATENING: CAT_10_ELECTRICAL_LIFE_THREATENING_PATTERNS,
  CAT_10_ELECTRICAL_SEVERE: CAT_10_ELECTRICAL_SEVERE_PATTERNS,
  CAT_10_ELECTRICAL_GFCI_AFCI_SEVERE: CAT_10_ELECTRICAL_GFCI_AFCI_SEVERE_PATTERNS,
  CAT_10_ELECTRICAL_PANEL_LIFE_THREATENING: CAT_10_ELECTRICAL_PANEL_LIFE_THREATENING_PATTERNS,
  CAT_10_ELECTRICAL_PANEL_SEVERE: CAT_10_ELECTRICAL_PANEL_SEVERE_PATTERNS,
  CAT_10_ELECTRICAL_PANEL_MODERATE: CAT_10_ELECTRICAL_PANEL_MODERATE_PATTERNS,
  CAT_11_ELEVATOR: CAT_11_ELEVATOR_PATTERNS,
  CAT_12_FIRE_EXIT_SIGN: CAT_12_FIRE_EXIT_SIGN_PATTERNS,
  CAT_12_FIRE_EXTINGUISHER: CAT_12_FIRE_EXTINGUISHER_PATTERNS,
  CAT_12_FLAMMABLE_COMBUSTIBLE: CAT_12_FLAMMABLE_COMBUSTIBLE_PATTERNS,
  CAT_12_SMOKE_ALARM: CAT_12_SMOKE_ALARM_PATTERNS,
  CAT_12_SPRINKLER_ASSEMBLY: CAT_12_SPRINKLER_ASSEMBLY_PATTERNS,
  CAT_13_FLOOR: CAT_13_FLOOR_PATTERNS,
  CAT_14_FOUNDATION: CAT_14_FOUNDATION_PATTERNS,
  CAT_15_GRAB_BAR: CAT_15_GRAB_BAR_PATTERNS,
  CAT_16_INFESTATION_MODERATE: CAT_16_INFESTATION_MODERATE_PATTERNS,
  CAT_16_INFESTATION_SEVERE: CAT_16_INFESTATION_SEVERE_PATTERNS,
  CAT_16_LITTER: CAT_16_LITTER_PATTERNS,
  CAT_16_SHARP_EDGES: CAT_16_SHARP_EDGES_PATTERNS,
  CAT_16_TRIP_HAZARD: CAT_16_TRIP_HAZARD_PATTERNS,
  CAT_17_HVAC_LOW: CAT_17_HVAC_LOW_PATTERNS,
  CAT_17_HVAC_LIFE_THREATENING: CAT_17_HVAC_LIFE_THREATENING_PATTERNS,
  CAT_17_HVAC_SEVERE: CAT_17_HVAC_SEVERE_PATTERNS,
  CAT_17_HVAC_MODERATE: CAT_17_HVAC_MODERATE_PATTERNS,
  CAT_18_KITCHEN_CABINET: CAT_18_KITCHEN_CABINET_PATTERNS,
  CAT_18_KITCHEN_COOKING_APPLIANCE_MODERATE: CAT_18_KITCHEN_COOKING_APPLIANCE_MODERATE_PATTERNS,
  CAT_18_KITCHEN_COOKING_APPLIANCE_SEVERE: CAT_18_KITCHEN_COOKING_APPLIANCE_SEVERE_PATTERNS,
  CAT_18_KITCHEN_FOOD_PREP: CAT_18_KITCHEN_FOOD_PREP_PATTERNS,
  CAT_18_KITCHEN_MOLD_MODERATE: CAT_18_KITCHEN_MOLD_MODERATE_PATTERNS,
  CAT_18_KITCHEN_MOLD_SEVERE: CAT_18_KITCHEN_MOLD_SEVERE_PATTERNS,
  CAT_18_KITCHEN_MOLD_LIFE_THREATENING: CAT_18_KITCHEN_MOLD_LIFE_THREATENING_PATTERNS,
  CAT_18_KITCHEN_REFRIGERATOR: CAT_18_KITCHEN_REFRIGERATOR_PATTERNS,
  CAT_18_KITCHEN_SINK_MODERATE: CAT_18_KITCHEN_SINK_MODERATE_PATTERNS,
  CAT_18_KITCHEN_SINK_LOW: CAT_18_KITCHEN_SINK_LOW_PATTERNS,
  CAT_18_KITCHEN_VENTILATION: CAT_18_KITCHEN_VENTILATION_PATTERNS,
  CAT_19_GAS_OIL_LEAK: CAT_19_GAS_OIL_LEAK_PATTERNS,
  CAT_20_SEWAGE_LEAK_SEVERE: CAT_20_SEWAGE_LEAK_SEVERE_PATTERNS,
  CAT_20_SEWAGE_LEAK_MODERATE: CAT_20_SEWAGE_LEAK_MODERATE_PATTERNS,
  CAT_21_WATER_LEAK: CAT_21_WATER_LEAK_PATTERNS,
  CAT_22_LIGHTING_AUXILIARY_SEVERE: CAT_22_LIGHTING_AUXILIARY_SEVERE_PATTERNS,
  CAT_22_LIGHTING_INTERIOR_MODERATE: CAT_22_LIGHTING_INTERIOR_MODERATE_PATTERNS,
  CAT_23_MOLD_MODERATE: CAT_23_MOLD_MODERATE_PATTERNS,
  CAT_23_MOLD_SEVERE: CAT_23_MOLD_SEVERE_PATTERNS,
  CAT_23_MOLD_LIFE_THREATENING: CAT_23_MOLD_LIFE_THREATENING_PATTERNS,
  CAT_24_PAINT_HAZARD_MODERATE: CAT_24_PAINT_HAZARD_MODERATE_PATTERNS,
  CAT_24_PAINT_HAZARD_SEVERE: CAT_24_PAINT_HAZARD_SEVERE_PATTERNS,
  CAT_25_GUARDRAIL: CAT_25_GUARDRAIL_PATTERNS,
  CAT_25_HANDRAIL_MODERATE_27_25: CAT_25_HANDRAIL_MODERATE_27_25_PATTERNS,
  CAT_25_HANDRAIL_MODERATE_5_0: CAT_25_HANDRAIL_MODERATE_5_0_PATTERNS,
  CAT_25_HANDRAIL_SEVERE: CAT_25_HANDRAIL_SEVERE_PATTERNS,
  CAT_26_RESTROOM_BATHTUB_LOW: CAT_26_RESTROOM_BATHTUB_LOW_PATTERNS,
  CAT_26_RESTROOM_BATHTUB_MODERATE: CAT_26_RESTROOM_BATHTUB_MODERATE_PATTERNS,
  CAT_26_RESTROOM_CABINET: CAT_26_RESTROOM_CABINET_PATTERNS,
  CAT_26_RESTROOM_GRAB_BAR: CAT_26_RESTROOM_GRAB_BAR_PATTERNS,
  CAT_26_RESTROOM_MOLD_MODERATE: CAT_26_RESTROOM_MOLD_MODERATE_PATTERNS,
  CAT_26_RESTROOM_MOLD_SEVERE: CAT_26_RESTROOM_MOLD_SEVERE_PATTERNS,
  CAT_26_RESTROOM_MOLD_LIFE_THREATENING: CAT_26_RESTROOM_MOLD_LIFE_THREATENING_PATTERNS,
  CAT_26_RESTROOM_SINK_MODERATE: CAT_26_RESTROOM_SINK_MODERATE_PATTERNS,
  CAT_26_RESTROOM_SINK_LOW: CAT_26_RESTROOM_SINK_LOW_PATTERNS,
  CAT_26_RESTROOM_TOILET: CAT_26_RESTROOM_TOILET_PATTERNS,
  CAT_26_RESTROOM_VENTILATION: CAT_26_RESTROOM_VENTILATION_PATTERNS,
  CAT_27_LAUNDRY_SINK_MODERATE: CAT_27_LAUNDRY_SINK_MODERATE_PATTERNS,
  CAT_27_LAUNDRY_SINK_LOW: CAT_27_LAUNDRY_SINK_LOW_PATTERNS,
  CAT_28_STEPS_STAIRS: CAT_28_STEPS_STAIRS_PATTERNS,
  CAT_29_STRUCTURAL_SYSTEM: CAT_29_STRUCTURAL_SYSTEM_PATTERNS,
  CAT_30_TRASH_CHUTE: CAT_30_TRASH_CHUTE_PATTERNS,
  CAT_31_VENTILATION: CAT_31_VENTILATION_PATTERNS,
  CAT_32_WALL_INTERIOR: CAT_32_WALL_INTERIOR_PATTERNS,
  CAT_33_WATER_HEATER_LIFE_THREATENING: CAT_33_WATER_HEATER_LIFE_THREATENING_PATTERNS,
  CAT_33_WATER_HEATER_SEVERE: CAT_33_WATER_HEATER_SEVERE_PATTERNS,
  CAT_33_WATER_HEATER_MODERATE: CAT_33_WATER_HEATER_MODERATE_PATTERNS,
  CAT_34_WINDOW_MODERATE: CAT_34_WINDOW_MODERATE_PATTERNS,
  CAT_34_WINDOW_SEVERE: CAT_34_WINDOW_SEVERE_PATTERNS,
};

export const INSIDE_POSSIBLE_SCORE = POSSIBLE_SCORE;
