// Comprehensive NSPIRE Deficiency Mapping for All 32 UNIT Categories
// Possible Points = 50 for Units

export interface InsideDeficiencyOption {
    id: string;
    name: string;
    detail: string;
    criteria: string;
    severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
    repairBy: string;
    points: string;
    code?: string;
    codeReference?: string;
}

export interface InsideSubcategory {
    name: string;
    deficiencies: InsideDeficiencyOption[];
}

export interface InsideItemDeficiencies {
    itemName: string;
    subcategories?: InsideSubcategory[];
    deficiencies?: InsideDeficiencyOption[];
}

// ==========================================
// 1. BATHROOM
// ==========================================
export const BATHROOM_BATHTUB_SHOWER: InsideSubcategory = {
    name: 'Bathtub and Shower',
    deficiencies: [
        {
            id: 'bath_tub_1',
            name: 'Bathtub/shower inoperable with backup',
            detail: 'Only 1 bathtub or shower is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
            criteria: 'A bathtub or shower is inoperable, or standing water is present, such that the inspector believes water is unable to drain or drains very slowly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TUB-01',
            codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
        },
        {
            id: 'bath_tub_2',
            name: 'Component limits hygiene (minor)',
            detail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
            criteria: 'component , inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts like a stopper or discoloration affecting less than 50% of the surface.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-TUB-02',
            codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
        },
        {
            id: 'bath_tub_3',
            name: 'Component limits hygiene',
            detail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
            criteria: 'Bathtub or shower is inoperable or missing, limiting the resident\'s ability to maintain personal hygiene. This includes nonfunctional fixtures, absent components with signs of prior installation, or severe discoloration affecting over 50% of the surface.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TUB-03',
            codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
        },
        {
            id: 'bath_tub_4',
            name: 'Lack of privacy',
            detail: 'Bathtub or shower cannot be used in private.',
            criteria: 'For the purpose of this standard, the resident should be able to use the bathtub or shower without being observed from an adjacent room or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TUB-04',
            codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
        },
        {
            id: 'bath_tub_5',
            name: 'Only one bathtub/shower inoperable',
            detail: 'Only one bathtub or shower is present, and it is inoperable or does not drain.',
            criteria: 'Only one bathtub or shower is present within the unit and it is inoperable (i.e., overall system is not meeting function or purpose, with or without visible damage). Or, standing water is present such that the inspector believes water is unable to drain.',
            severity: 'Severe',
            repairBy: '24Hrs',
            points: '14.8/n',
            code: 'BATH-TUB-05',
            codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
        }
    ]
};

export const BATHROOM_CABINET_STORAGE: InsideSubcategory = {
    name: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'bath_cab_1',
            name: 'Storage component is damaged, inoperable, or missing.',
            detail: 'Storage component is damaged, inoperable, or missing.',
            criteria: 'Some of the bathroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-CAB-01',
            codeReference: `🧭 Step 1: Identify Storage Areas to Inspect
• NSPIRE does not require bathroom cabinets to be present. However, if installed, they must be functional and safe.
• IBU overlays – Local habitability, accessibility, and sanitation codes
• Exclude: Freestanding furniture or resident-owned storage unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Interior: Must be free of grime, mold, pest droppings, or biohazards.
• Odor check: Foul smells may indicate hidden moisture or pest activity.
🧪 Step 3: Functional Testing
• Open/Close All Doors and Drawers: Confirm smooth operation and alignment
• Check Shelving Stability: Apply light pressure to test for sagging or detachment
• Inspect for Moisture or Infestation: Especially under sinks and near laundry plumbing
• Pantry Useability: Ensure shelves are clean, secure, and accessible
📏 Step 4: Accessibility & Local Requirements
• Reach range: Shelves and handles should be within accessibility-compliant height (typically 15–48" AFF)
• Clearance: Doors and drawers must not obstruct egress or accessible paths
• IBU Overlay: May require rounded edges, soft-close hardware, or tactile indicators in elderly housing
⚒️ Step 5: Installation & Safety (IRC)
• Secure Mounting: Cabinets must be anchored to wall studs (IRC R602.3)
• No Sharp Edges: Corners should be finished and safe
• No Electrical Obstruction: Cabinets must not block outlets, switches, or ventilation`
        }
    ]
};

export const BATHROOM_GRAB_BAR: InsideSubcategory = {
    name: 'Grab Bar',
    deficiencies: [
        {
            id: 'bath_grab_1',
            name: 'Grab Bar is not secure.',
            detail: 'Grab Bar is not secure.',
            criteria: 'Any movement, whatsoever, is detected in the grab bar.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-GRAB-01',
            codeReference: `🧭 Step 1: Identify Grab Bar Location
• Valid locations: Inside bathrooms—adjacent to toilets, tubs, or showers.
• Invalid locations: Living rooms, bedrooms, or hallways
🔍 Visual Inspection
• Material: Stainless steel, coated metal, compliant plastic
• Cleanliness: Must be free of grime, mold, or residue
🧪 Step 3: Stability Test
• Grip the Bar in the Middle
• Apply Moderate Force: Push and pull back and forth
• Deficiency Criteria: Any movement whatsoever is considered a moderate deficiency under NSPIRE
📏 Step 4: Accessibility & Local Requirements
• Height: Typically 33–36" AFF (above finished floor) for side wall bars
• Length: ≥36" for side wall, ≥42" for rear wall in showers
• Clearance: Minimum 1½" between bar and wall
• IBU Overlay: May require dual bars, textured grip, visual contrast, or tactile indicators for low-vision users
⚒️ Step 5: Structural Safety (IRC)
• Anchoring: Must be secured to wall studs or blocking (IRC R307.2)
• No Drywall-Only Mounting: Anchors must support 250 lbs minimum
• No Electrical Conflict: Ensure the grab bar does not interfere with switches or outlets`
        }
    ]
};

export const BATHROOM_MOLD: InsideSubcategory = {
    name: 'MOLD-LIKE SUBSTANCE',
    deficiencies: [
        {
            id: 'bath_mold_1',
            name: 'Peeling Paint-Elevated moisture level.',
            detail: 'Peeling Paint-Elevated moisture level.',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-MOLD-01',
            codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation: Confirm exhaust fan is functional (IRC R303.3)
• If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
        },
        {
            id: 'bath_mold_2',
            name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'BATH-MOLD-02',
            codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation: Confirm exhaust fan is functional (IRC R303.3)
• If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
        },
        {
            id: 'bath_mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'BATH-MOLD-03',
            codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation: Confirm exhaust fan is functional (IRC R303.3)
• If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
        },
        {
            id: 'bath_mold_4',
            name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            detail: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-MOLD-04',
            codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation: Confirm exhaust fan is functional (IRC R303.3)
• If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
        }
    ]
};

export const BATHROOM_SINK: InsideSubcategory = {
    name: 'Sink',
    deficiencies: [
        {
            id: 'bath_sink_1',
            name: 'Hot and cold water cannot be activated or deactivated.',
            detail: 'Hot and cold water cannot be activated or deactivated.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-01',
            codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4: Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
        },
        {
            id: 'bath_sink_2',
            name: 'Sink component is damaged or missing, and the sink is not functionally adequate',
            detail: 'Sink component is damaged or missing, and the sink is not functionally adequate',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-02',
            codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4: Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
        },
        {
            id: 'bath_sink_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-03',
            codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4: Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
        },
        {
            id: 'bath_sink_4',
            name: 'Sink is not draining.',
            detail: 'Sink is not draining.',
            criteria: 'Water is not draining from the basin of the sink.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-04',
            codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4: Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
        },
        {
            id: 'bath_sink_5',
            name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-SINK-05',
            codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4: Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
        },
        {
            id: 'bath_sink_6',
            name: 'Water is directed outside of the basin.',
            detail: 'Water is directed outside of the basin.',
            criteria: 'Confirm that water is directed into the basin and not outside when in use.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-SINK-06',
            codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4: Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
        }
    ]
};

export const BATHROOM_TOILET: InsideSubcategory = {
    name: 'Toilet',
    deficiencies: [
        {
            id: 'bath_toilet_1',
            name: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
            detail: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
            criteria: 'A toilet is damaged or inoperable, but another functional toilet exists within the unit. Defect may be visible or affect overall usability.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-01',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        },
        {
            id: 'bath_toilet_2',
            name: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
            detail: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
            criteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete), and at least one toilet is installed elsewhere within the unit that is operational.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-02',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        },
        {
            id: 'bath_toilet_3',
            name: 'Only one toilet was installed, and it is damaged or inoperable.',
            detail: 'Only one toilet was installed, and it is damaged or inoperable.',
            criteria: 'Only one toilet is present, and it\'s either damaged or inoperable—preventing proper use.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'BATH-TOILET-03',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        },
        {
            id: 'bath_toilet_4',
            name: 'Only one toilet was installed, and it is missing.',
            detail: 'Only one toilet was installed, and it is missing.',
            criteria: 'Only one toilet was installed, and it is now missing (i.e., there is evidence of prior installation, but it is no longer present or is incomplete).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'BATH-TOILET-04',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        },
        {
            id: 'bath_toilet_5',
            name: 'Toilet can not be used in private',
            detail: 'Toilet can not be used in private',
            criteria: 'Hole in the door and damaged hardware, missing door The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-05',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        },
        {
            id: 'bath_toilet_6',
            name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
            detail: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
            criteria: 'A toilet component may be damaged, inoperable, or missing—whether visibly defective, functionally impaired, or absent despite evidence of prior installation.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-TOILET-06',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        },
        {
            id: 'bath_toilet_7',
            name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
            detail: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
            criteria: 'Toilet component is damaged or inoperable, potentially limiting safe waste discharge.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-07',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        },
        {
            id: 'bath_toilet_8',
            name: 'Toilet is not secured at the base.',
            detail: 'Toilet is not secured at the base.',
            criteria: 'Toilet is not secured at the base.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-08',
            codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat; Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee); Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
        }
    ]
};

export const BATHROOM_VENTILATION: InsideSubcategory = {
    name: 'Ventilation',
    deficiencies: [
        {
            id: 'bath_vent_1',
            name: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-01',
            codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation: Turn on the switch and listen for the motor; Use tissue test: hold paper near grill to confirm suction
• Window Test: Open and close the window fully; Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
        },
        {
            id: 'bath_vent_2',
            name: 'The exhaust system component is missing and damaged, affecting the function adequately.',
            detail: 'The exhaust system component is missing and damaged, affecting the function adequately.',
            criteria: 'Exhaust system component is damaged OR Exhaust system component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-02',
            codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation: Turn on the switch and listen for the motor; Use tissue test: hold paper near grill to confirm suction
• Window Test: Open and close the window fully; Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
        },
        {
            id: 'bath_vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust vent inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-03',
            codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation: Turn on the switch and listen for the motor; Use tissue test: hold paper near grill to confirm suction
• Window Test: Open and close the window fully; Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
        },
        {
            id: 'bath_vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system has restricted air flow.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-04',
            codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation: Turn on the switch and listen for the motor; Use tissue test: hold paper near grill to confirm suction
• Window Test: Open and close the window fully; Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
        }
    ]
};

export const BATHROOM_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Bathroom',
    subcategories: [
        BATHROOM_BATHTUB_SHOWER,
        BATHROOM_CABINET_STORAGE,
        BATHROOM_GRAB_BAR,
        BATHROOM_MOLD,
        BATHROOM_SINK,
        BATHROOM_TOILET,
        BATHROOM_VENTILATION
    ]
};

// ==========================================
// 2. CABINETS AND STORAGE (PANTRY/LAUNDRY)
// ==========================================
export const CABINETS_STORAGE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Cabinets and Storage (Pantry/Laundry)',
    deficiencies: [
        {
            id: 'cab_1',
            name: 'Pantry, Food Storage Space Not Present',
            detail: 'Food storage space is not present.',
            criteria: 'Storage for essential food items is damaged, inoperable, or missing—affecting over 50% of cabinet doors, drawers, or shelves.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CAB-01',
            codeReference: `🧭 Step 1: Identify Storage Areas to Inspect
• Kitchen Cabinets: Wall-mounted and base units
• Pantry: Built-in or closet-style food storage
• Laundry Cabinets: Overhead or base cabinets near washer/dryer
• Exclude: Freestanding furniture or resident-owned storage unless permanently installed
🔍 Step 2: Presence & Identification
• Required if: The space is designated for kitchen or bathroom use.
• Cabinet types: Wall-mounted, base cabinets, vanities, pantry units, and under-sink storage.
🧪 Step 3: Functionality Test
• Open and close all doors and drawers—confirm smooth operation and full extension.
• Check shelves for sagging, missing supports, or instability.
• Hardware: Inspect knobs, handles, hinges, and drawer slides for looseness or failure.
📏 Step 4: Accessibility & Local Requirements
• Reach range: Shelves and handles should be within ADA-compliant height (typically 15–48" AFF)
• Clearance: Doors and drawers must not obstruct egress or accessible paths
• IBU Overlay: May require rounded edges, soft-close hardware, or tactile indicators in elderly housing
⚒️ Step 5: Installation & Safety (IRC)
• Secure Mounting: Cabinets must be anchored to wall studs (IRC R602.3)
• NSPIRE Cabinet Standard v3.0 – NSPIRE Protocol Guide
• IBU overlays – Local habitability, accessibility, and sanitation codes
• No Electrical Obstruction: Cabinets must not block outlets, switches, or ventilation`
        },
        {
            id: 'cab_2',
            name: 'Laundry Storage Component damaged, Inoperable, Missing.',
            detail: '50% or more of laundry cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation).',
            criteria: '50% or more  of cabinet doors, or 50%or more of drawers, or 50% or more of shelves are missing or damaged.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CAB-02',
            codeReference: `🧭 Step 1: Identify Storage Areas to Inspect
• Kitchen Cabinets: Wall-mounted and base units
• Pantry: Built-in or closet-style food storage
• Laundry Cabinets: Overhead or base cabinets near washer/dryer
• Exclude: Freestanding furniture or resident-owned storage unless permanently installed
🔍 Step 2: Presence & Identification
• Required if: The space is designated for kitchen or bathroom use.
• Cabinet types: Wall-mounted, base cabinets, vanities, pantry units, and under-sink storage.
🧪 Step 3: Functionality Test
• Open and close all doors and drawers—confirm smooth operation and full extension.
• Check shelves for sagging, missing supports, or instability.
• Hardware: Inspect knobs, handles, hinges, and drawer slides for looseness or failure.
📏 Step 4: Accessibility & Local Requirements
• Reach range: Shelves and handles should be within ADA-compliant height (typically 15–48" AFF)
• Clearance: Doors and drawers must not obstruct egress or accessible paths
• IBU Overlay: May require rounded edges, soft-close hardware, or tactile indicators in elderly housing
⚒️ Step 5: Installation & Safety (IRC)
• Secure Mounting: Cabinets must be anchored to wall studs (IRC R602.3)
• NSPIRE Cabinet Standard v3.0 – NSPIRE Protocol Guide
• IBU overlays – Local habitability, accessibility, and sanitation codes
• No Electrical Obstruction: Cabinets must not block outlets, switches, or ventilation`
        }
    ]
};

// ==========================================
// 3. CALL-FOR-AID SYSTEM
// ==========================================
export const CALL_FOR_AID_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Call-for-Aid System',
    deficiencies: [
        {
            id: 'cfa_1',
            name: 'System does not function properly.',
            detail: 'A call-for-aid system does not emit sound or light or send signal to annunciator.',
            criteria: 'The annunciator does not indicate the correct corresponding room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/50xn',
            code: 'CFA-01',
            codeReference: `🧭 Step 1: Presence & Identification
• NSPIRE does not mandate Call-For-Aid systems, but if present, they must be functional and accessible.
• Valid locations: Bathrooms, bedrooms, and hallways.
• System types: Pull cords, wall-mounted buttons, annunciator panels, audible alarms, and visual indicators.
• Exclusions: Personal wearable devices
🔍 Step 2: Visual Accessibility
• Pull cord, Wall-mounted button, Annunciator panel, Audible alarm or flashing light
🧪 Step 3: Operability Test
• Activation: Gently pull the cord or press the button—confirm the system triggers an audible and/or visual alert.
• Response check: Verify that the signal reaches the annunciator panel or designated alert system.
• NSPIRE Deficiency: System does not function properly = Life-threatening
• IBU Overlay: May require integration with on-site staff alert systems or third-party monitoring
📏 Step 4: Accessibility & Mounting Height
• Pull cord height: The end of the cord must be ≤6 inches above the finished floor.
• NSPIRE Deficiency 1: If the cord is missing or mounted too high = Moderate
• IBU Overlay: May require dual-height activation points for seated and standing users
⚡ Step 5: IRC Electrical Safety
• Wiring: Must be enclosed and compliant with IRC Chapter E3900
• Power Source: Confirm backup power or battery if system is hardwired
• No exposed conductors: Any exposed wiring is a code violation`
        },
        {
            id: 'cfa_2',
            name: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
            detail: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.',
            criteria: 'The pull cord end is positioned more than 6 inches above the floor.',
            severity: 'Severe',
            repairBy: '24Hrs',
            points: '14.8/50xn',
            code: 'CFA-02',
            codeReference: `🧭 Step 1: Presence & Identification
• NSPIRE does not mandate Call-For-Aid systems, but if present, they must be functional and accessible.
• Valid locations: Bathrooms, bedrooms, and hallways.
• System types: Pull cords, wall-mounted buttons, annunciator panels, audible alarms, and visual indicators.
• Exclusions: Personal wearable devices
🔍 Step 2: Visual Accessibility
• Pull cord, Wall-mounted button, Annunciator panel, Audible alarm or flashing light
🧪 Step 3: Operability Test
• Activation: Gently pull the cord or press the button—confirm the system triggers an audible and/or visual alert.
• Response check: Verify that the signal reaches the annunciator panel or designated alert system.
• NSPIRE Deficiency: System does not function properly = Life-threatening
• IBU Overlay: May require integration with on-site staff alert systems or third-party monitoring
📏 Step 4: Accessibility & Mounting Height
• Pull cord height: The end of the cord must be ≤6 inches above the finished floor.
• NSPIRE Deficiency 1: If the cord is missing or mounted too high = Moderate
• IBU Overlay: May require dual-height activation points for seated and standing users
⚡ Step 5: IRC Electrical Safety
• Wiring: Must be enclosed and compliant with IRC Chapter E3900
• Power Source: Confirm backup power or battery if system is hardwired
• No exposed conductors: Any exposed wiring is a code violation`
        }
    ]
};

// ==========================================
// 4. CARBON MONOXIDE ALARM
// ==========================================
export const CARBON_MONOXIDE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Carbon Monoxide Alarm',
    deficiencies: [
        {
            id: 'co_1',
            name: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
            detail: 'Carbon monoxide alarm is inoperable(dead batteries) or the alarm does not cease after testing.',
            criteria: 'A required Carbon monoxide alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-01',
            codeReference: `🧭 Step 1: Location Requirements
• IRC and NSPIRE require alarms to be installed outside each sleeping area and on each level of the unit
• In the immediate vicinity of each sleeping area
• Inside each bedroom if it contains or is adjacent to a fuel-burning source
• In the room with the first duct register if served by a remote furnace
• On the ceiling of any room containing a fuel-burning appliance
• IBU Overlay: May require CO alarms in hallways, near garages, or in mechanical rooms
🔍 Step 2: Obstruction & Visibility
• Mounting height: Typically 5–6 feet AFF (above finished floor) unless manufacturer specifies otherwise
• Obstruction check: Alarm must not be blocked by furniture, drapes, or fixtures, etc.
Step 3: Functional Testing
- Press Test Button: Confirm audible alarm sounds; If a visual alarm is required (e.g., for hearing-impaired residents), confirm strobe or display activates
- Battery Check: If battery-powered, confirm battery is present and not expired
- Hardwired Units: Confirm backup battery is installed and functional
NSPIRE cites non-functional alarms as a life-threatening deficiency requiring correction within 24 hours
📏 Step 4: Accessibility & Local Requirement
- Mounting Height: Typically 5–6 feet AFF (above finished floor) for visibility and access
- Reach Range: Must be operable within 15"–48" AFF in accessible units
- IBU Overlay: May require UL 2034 compliance, multilingual signage, or integration with building-wide alert systems
⚒️ Step 5: IRC Installation & Safety
- IRC Section R315: CO alarms must be listed to UL 2034`
        },
        {
            id: 'co_2',
            name: 'Carbon monoxide alarm is missing, not installed or not installed in the proper location.',
            detail: 'The location of the previous installation is not relevant. Unit/building contains a fuel-burning appliance or fuel-burning fireplace. Carbon monoxide alarm is missing.',
            criteria: 'Units with fuel-burning appliances or fireplaces must have carbon monoxide alarms in required locations. Missing alarms near sleeping areas, bathrooms, remote furnaces, or garages makes the unit noncompliant.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-02',
            codeReference: `🧭 Step 1: Location Requirements
• IRC and NSPIRE require alarms to be installed outside each sleeping area and on each level of the unit
• In the immediate vicinity of each sleeping area
• Inside each bedroom if it contains or is adjacent to a fuel-burning source
• In the room with the first duct register if served by a remote furnace
• On the ceiling of any room containing a fuel-burning appliance
• IBU Overlay: May require CO alarms in hallways, near garages, or in mechanical rooms
🔍 Step 2: Obstruction & Visibility
• Mounting height: Typically 5–6 feet AFF (above finished floor) unless manufacturer specifies otherwise
• Obstruction check: Alarm must not be blocked by furniture, drapes, or fixtures, etc.
Step 3: Functional Testing
- Press Test Button: Confirm audible alarm sounds; If a visual alarm is required (e.g., for hearing-impaired residents), confirm strobe or display activates
- Battery Check: If battery-powered, confirm battery is present and not expired
- Hardwired Units: Confirm backup battery is installed and functional
NSPIRE cites non-functional alarms as a life-threatening deficiency requiring correction within 24 hours
📏 Step 4: Accessibility & Local Requirement
- Mounting Height: Typically 5–6 feet AFF (above finished floor) for visibility and access
- Reach Range: Must be operable within 15"–48" AFF in accessible units
- IBU Overlay: May require UL 2034 compliance, multilingual signage, or integration with building-wide alert systems
⚒️ Step 5: IRC Installation & Safety
- IRC Section R315: CO alarms must be listed to UL 2034`
        },
        {
            id: 'co_3',
            name: 'Carbon monoxide alarm is obstructed.',
            detail: 'Carbon monoxide alarm is obstructed.',
            criteria: 'Carbon monoxide is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-03',
            codeReference: `🧭 Step 1: Location Requirements
• IRC and NSPIRE require alarms to be installed outside each sleeping area and on each level of the unit
• In the immediate vicinity of each sleeping area
• Inside each bedroom if it contains or is adjacent to a fuel-burning source
• In the room with the first duct register if served by a remote furnace
• On the ceiling of any room containing a fuel-burning appliance
• IBU Overlay: May require CO alarms in hallways, near garages, or in mechanical rooms
🔍 Step 2: Obstruction & Visibility
• Mounting height: Typically 5–6 feet AFF (above finished floor) unless manufacturer specifies otherwise
• Obstruction check: Alarm must not be blocked by furniture, drapes, or fixtures, etc.
Step 3: Functional Testing
- Press Test Button: Confirm audible alarm sounds; If a visual alarm is required (e.g., for hearing-impaired residents), confirm strobe or display activates
- Battery Check: If battery-powered, confirm battery is present and not expired
- Hardwired Units: Confirm backup battery is installed and functional
NSPIRE cites non-functional alarms as a life-threatening deficiency requiring correction within 24 hours
📏 Step 4: Accessibility & Local Requirement
- Mounting Height: Typically 5–6 feet AFF (above finished floor) for visibility and access
- Reach Range: Must be operable within 15"–48" AFF in accessible units
- IBU Overlay: May require UL 2034 compliance, multilingual signage, or integration with building-wide alert systems
⚒️ Step 5: IRC Installation & Safety
- IRC Section R315: CO alarms must be listed to UL 2034`
        }
    ]
};

// ==========================================
// 5. CEILING
// ==========================================
export const CEILING_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Ceiling',
    deficiencies: [
        {
            id: 'ceil_1',
            name: 'The ceiling component(s) is not functionally adequate.',
            detail: 'The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under structural deficiency.',
            criteria: 'Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'CEIL-01',
            codeReference: `🧭 Step 1: Identify Ceiling Type & Location
• Ceiling type: Drywall, plaster, acoustic tile, concrete, or drop ceiling
• Areas to Inspect: All rooms, especially bathrooms, kitchens, and utility spaces
• Include: Lofted ceilings, drop ceilings, and soffits
• Exclude: Decorative elements unless they affect safety or function
🔍 Step 2: Visual Identification & Coverage
• Scan entire ceiling in living areas, bedrooms, bathrooms, and kitchens
• Minimum height: IRC requires ≥7′ for habitable spaces (≥6′8″ for bathrooms and hallways)
🧪 Step 3: Functional Testing (if applicable)
• Touch Test: Gently press on sagging areas to check for movement or softness
• Ventilation Check: Ensure ceiling-mounted exhaust fans are functional (especially in bathrooms)
📏 Step 4: Accessibility & Local Requirement
• Ceiling-Mounted Devices (e.g., alarms, fans, lights): Must be operable via accessible controls (15"–48" AFF)
• IBU Overlay: May require seismic bracing, compliant lighting controls, or visual contrast for low-vision residents
• Clear Headroom: Minimum 80 inches required in accessible paths
⚒️ Step 5: IRC Structural & Safety Checks
• IRC R702.3: Ceilings must be covered with approved materials (e.g., gypsum board)
• IRC R703.3: Moisture-resistant materials required in wet areas
• IRC R302.6: Fire-resistance required between dwelling units and garages
• IRC P2601: Leaks from above must be repaired and properly drained`
        },
        {
            id: 'ceil_2',
            name: 'Ceiling has a hole.',
            detail: 'Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.',
            criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening>2".',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CEIL-02',
            codeReference: `🧭 Step 1: Identify Ceiling Type & Location
• Ceiling type: Drywall, plaster, acoustic tile, concrete, or drop ceiling
• Areas to Inspect: All rooms, especially bathrooms, kitchens, and utility spaces
• Include: Lofted ceilings, drop ceilings, and soffits
• Exclude: Decorative elements unless they affect safety or function
🔍 Step 2: Visual Identification & Coverage
• Scan entire ceiling in living areas, bedrooms, bathrooms, and kitchens
• Minimum height: IRC requires ≥7′ for habitable spaces (≥6′8″ for bathrooms and hallways)
🧪 Step 3: Functional Testing (if applicable)
• Touch Test: Gently press on sagging areas to check for movement or softness
• Ventilation Check: Ensure ceiling-mounted exhaust fans are functional (especially in bathrooms)
📏 Step 4: Accessibility & Local Requirement
• Ceiling-Mounted Devices (e.g., alarms, fans, lights): Must be operable via accessible controls (15"–48" AFF)
• IBU Overlay: May require seismic bracing, compliant lighting controls, or visual contrast for low-vision residents
• Clear Headroom: Minimum 80 inches required in accessible paths
⚒️ Step 5: IRC Structural & Safety Checks
• IRC R702.3: Ceilings must be covered with approved materials (e.g., gypsum board)
• IRC R703.3: Moisture-resistant materials required in wet areas
• IRC R302.6: Fire-resistance required between dwelling units and garages
• IRC P2601: Leaks from above must be repaired and properly drained`
        },
        {
            id: 'ceil_3',
            name: 'The ceiling has an unstable surface (bulging, buckling).',
            detail: 'There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws).',
            criteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category. Deficiency.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CEIL-03',
            codeReference: `🧭 Step 1: Identify Ceiling Type & Location
• Ceiling type: Drywall, plaster, acoustic tile, concrete, or drop ceiling
• Areas to Inspect: All rooms, especially bathrooms, kitchens, and utility spaces
• Include: Lofted ceilings, drop ceilings, and soffits
• Exclude: Decorative elements unless they affect safety or function
🔍 Step 2: Visual Identification & Coverage
• Scan entire ceiling in living areas, bedrooms, bathrooms, and kitchens
• Minimum height: IRC requires ≥7′ for habitable spaces (≥6′8″ for bathrooms and hallways)
🧪 Step 3: Functional Testing (if applicable)
• Touch Test: Gently press on sagging areas to check for movement or softness
• Ventilation Check: Ensure ceiling-mounted exhaust fans are functional (especially in bathrooms)
📏 Step 4: Accessibility & Local Requirement
• Ceiling-Mounted Devices (e.g., alarms, fans, lights): Must be operable via accessible controls (15"–48" AFF)
• IBU Overlay: May require seismic bracing, compliant lighting controls, or visual contrast for low-vision residents
• Clear Headroom: Minimum 80 inches required in accessible paths
⚒️ Step 5: IRC Structural & Safety Checks
• IRC R702.3: Ceilings must be covered with approved materials (e.g., gypsum board)
• IRC R703.3: Moisture-resistant materials required in wet areas
• IRC R302.6: Fire-resistance required between dwelling units and garages
• IRC P2601: Leaks from above must be repaired and properly drained`
        }
    ]
};

// ==========================================
// 6. CHIMNEY
// ==========================================
export const CHIMNEY_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Chimney',
    deficiencies: [
        {
            id: 'chim_1',
            name: 'Visually accessible and observable.',
            detail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.',
            criteria: 'Contains a fuel-burning appliance or fuel-burning fireplace.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'CHIM-01',
            codeReference: `🧭 Step 1: Identify Chimney Type & Location
• Appliance Connection: Confirm chimney is connected to a fireplace, wood-burning stove, or gas appliance
• Interior Components: Firebox, Flue, Damper, Hearth
• Exclude: Ventless fireplaces (not scored under NSPIRE)
🔍 Step 2: Visual Condition Assessment
• Check for unsealed penetrations: Around light fixtures, smoke alarms, or HVAC vents
🧪 Step 3: Functional Testing (if safe and permitted)
• Damper Operation: Open and close to confirm movement
• Visual Flue Check: Shine flashlight up flue to check for blockage or daylight
• Smoke Test: Only performed by certified professionals—NSPIRE does not require this
📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or rooftop access required
• Labeling: Chimney systems should be clearly marked if serving multiple units
• IBU Overlay: May require signage, emergency shutoff access, or integration with fire suppression systems
⚒️ Step 5: IRC Structural & Fire Safety Checks
• IRC R1001–R1005: Chimney must be constructed of approved masonry or metal
• Flue must be continuous and properly sized
• Clearance from combustibles must meet code (typically 2 inches)
• Hearth extension must be noncombustible and appropriately sized
• IBU overlays – Local fire safety, seismic, and ventilation codes`
        }
    ]
};

// ==========================================
// 7. CLOTHES DRYER EXHAUST VENTILATION
// ==========================================
export const CLOTHES_DRYER_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Clothes Dryer Exhaust Ventilation',
    deficiencies: [
        {
            id: 'dryer_1',
            name: 'Dryer transition duct is constructed of unsuitable material.',
            detail: 'Dryer transition duct is not constructed of metal or an approved material.',
            criteria: 'Dryer is being used indoor.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DRYER-01',
            codeReference: `🧭 Step 1: Identify Dryer Type & Location
- Electric or Gas Dryer: Inspection requirements differ slightly
- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent
- Location: Typically in laundry rooms, closets, or utility spaces
🔍 Step 2: Presence & Applicability
• Required if: A dryer is installed and positioned for use
NSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards
🧪 Step 3: Functional Testing
- Visual Airflow Check: Run dryer briefly (if permitted) and observe airflow at exterior vent
- Lint Inspection: Check behind the dryer and inside the duct for lint accumulation
- Secure Connections: Confirm transition duct is tightly clamped to both dryer and wall outlet
📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or appliance movement required
• Labeling: Duct and termination should be identifiable and traceable
• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers
⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled
• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace
• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs`
        },
        {
            id: 'dryer_2',
            name: 'Electrical dryer exhaust ventilation has restricted airflow.',
            detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DRYER-02',
            codeReference: `🧭 Step 1: Identify Dryer Type & Location
- Electric or Gas Dryer: Inspection requirements differ slightly
- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent
- Location: Typically in laundry rooms, closets, or utility spaces
🔍 Step 2: Presence & Applicability
• Required if: A dryer is installed and positioned for use
NSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards
🧪 Step 3: Functional Testing
- Visual Airflow Check: Run dryer briefly (if permitted) and observe airflow at exterior vent
- Lint Inspection: Check behind the dryer and inside the duct for lint accumulation
- Secure Connections: Confirm transition duct is tightly clamped to both dryer and wall outlet
📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or appliance movement required
• Labeling: Duct and termination should be identifiable and traceable
• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers
⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled
• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace
• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs`
        },
        {
            id: 'dryer_3',
            name: 'Electric dryer transition duct is detached or missing.',
            detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
            criteria: 'Dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DRYER-03',
            codeReference: `🧭 Step 1: Identify Dryer Type & Location
- Electric or Gas Dryer: Inspection requirements differ slightly
- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent
- Location: Typically in laundry rooms, closets, or utility spaces
🔍 Step 2: Presence & Applicability
• Required if: A dryer is installed and positioned for use
NSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards
🧪 Step 3: Functional Testing
- Visual Airflow Check: Run dryer briefly (if permitted) and observe airflow at exterior vent
- Lint Inspection: Check behind the dryer and inside the duct for lint accumulation
- Secure Connections: Confirm transition duct is tightly clamped to both dryer and wall outlet
📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or appliance movement required
• Labeling: Duct and termination should be identifiable and traceable
• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers
⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled
• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace
• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs`
        },
        {
            id: 'dryer_4',
            name: 'Gas dryer exhaust ventilation system has restricted airflow.',
            detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DRYER-04',
            codeReference: `🧭 Step 1: Identify Dryer Type & Location
- Electric or Gas Dryer: Inspection requirements differ slightly
- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent
- Location: Typically in laundry rooms, closets, or utility spaces
🔍 Step 2: Presence & Applicability
• Required if: A dryer is installed and positioned for use
NSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards
🧪 Step 3: Functional Testing
- Visual Airflow Check: Run dryer briefly (if permitted) and observe airflow at exterior vent
- Lint Inspection: Check behind the dryer and inside the duct for lint accumulation
- Secure Connections: Confirm transition duct is tightly clamped to both dryer and wall outlet
📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or appliance movement required
• Labeling: Duct and termination should be identifiable and traceable
• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers
⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled
• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace
• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs`
        },
        {
            id: 'dryer_5',
            name: 'Gas dryer transition duct is detached or missing.',
            detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
            criteria: 'The dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DRYER-05',
            codeReference: `🧭 Step 1: Identify Dryer Type & Location
- Electric or Gas Dryer: Inspection requirements differ slightly
- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent
- Location: Typically in laundry rooms, closets, or utility spaces
🔍 Step 2: Presence & Applicability
• Required if: A dryer is installed and positioned for use
NSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards
🧪 Step 3: Functional Testing
- Visual Airflow Check: Run dryer briefly (if permitted) and observe airflow at exterior vent
- Lint Inspection: Check behind the dryer and inside the duct for lint accumulation
- Secure Connections: Confirm transition duct is tightly clamped to both dryer and wall outlet
📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or appliance movement required
• Labeling: Duct and termination should be identifiable and traceable
• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers
⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled
• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace
• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs`
        }
    ]
};

// ==========================================
// 8. DOORS
// ==========================================
export const DOOR_ENTRY: InsideSubcategory = {
    name: 'Door- Entry',
    deficiencies: [
        {
            id: 'door_entry_1',
            name: 'Entry door cannot be secured adequately, missing, damaged hardware.',
            detail: 'Entry door cannot be secured adequately, missing, damaged hardware.',
            criteria: 'Installed locks can not be engaged from both sides.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DOOR-ENTRY-01',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_2',
            name: 'Entry door component is damaged, missing, inoperable',
            detail: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or A hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
            criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or A hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'DOOR-ENTRY-02',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_3',
            name: 'Entry door frame, threshold, or trim is damaged.',
            detail: 'Entry door frame, threshold, or trim is damaged.',
            criteria: 'Evidence of prior installation, now missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-03',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_4',
            name: 'Entry door is missing.',
            detail: 'Entry door is missing.',
            criteria: 'Not present or is incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24 Hrs.',
            points: '60/n',
            code: 'DOOR-ENTRY-04',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_5',
            name: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
            detail: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
            criteria: 'Entry door seal is damaged, missing, or nonfunctional—causing a gap ≥¼ inch that lets in light or shows signs of water damage or dry rot.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-05',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_6',
            name: 'Self-closing mechanism is damaged, inoperable or damaged.',
            detail: 'Self-closing mechanism is damaged, inoperable or damaged.',
            criteria: 'Self-closing mechanism is damaged, missing, or fails to close and latch the door properly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-06',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_7',
            name: 'Entry door surface is delaminated or separated.',
            detail: 'Entry door surface is delaminated or separated.',
            criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. OR There is delamination or separation that affects the integrity of the door.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-07',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_8',
            name: 'Entry door will not close properly.',
            detail: 'Entry door will not close properly.',
            criteria: 'Entry door does not close (i.e., door seats in frame).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-ENTRY-08',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_9',
            name: 'Entry door will not open properly.',
            detail: 'Entry door will not open properly.',
            criteria: 'Entry door does not open.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-09',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        },
        {
            id: 'door_entry_10',
            name: 'Hole, split, or crack that penetrates completely through the entry door.',
            detail: 'Hole, split, or crack that penetrates completely through the entry door.',
            criteria: 'Crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door or door sides.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-10',
            codeReference: `🧭 Step 1: Sanitation & Weather Protection
• Inspect for gaps around door edges that allow moisture, drafts, or pests.
• Check for signs of water intrusion, mold, or rust near the threshold and frame.
• IBU Overlay: May require weather stripping, pest barriers, and sealed thresholds in coastal or high-humidity zones
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have a functional entry door providing access from the exterior or common corridor.
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Lock Test: Engage and disengage locks from both sides (if accessible)
• Latch Test: Ensure door latches securely when closed
• Weather Seal Check: Inspect for light gaps or air drafts around edges
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or automatic door closers in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Entry doors must provide safe egress
• No double-keyed deadbolts on required egress doors
• IRC R612.3: Exterior doors must be weather-resistant and properly flashed
• IRC R302.5.1: Fire-rated doors required between the garage and dwelling`
        }
    ]
};

export const DOOR_FIRE_LABELED: InsideSubcategory = {
    name: 'Door – Fire Labeled',
    deficiencies: [
        {
            id: 'door_fire_1',
            name: 'An object is present that may prevent the fire-labeled door from closing and latching.',
            detail: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
            criteria: 'An object blocks the fire-labeled door from closing or self-closing and latching properly.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required if: Door is part of a passive fire protection system (e.g., between unit and corridor, garage, or stairwell).
• Label location: Fire label or plug typically found on the hinge edge of the door slab or frame.
🔍 Step 2: Visual Label Location
• Metal tag or embossed stamp on door edge (near top hinge or top of door)
• If the label is missing but the door appears fire-rated, inspect using NSPIRE fire door standards
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm door opens freely and closes fully
• Latch Test: Ensure door latches automatically when released
• Self-Closing Test: Open the door halfway and release; it should close and latch without assistance
• Seal Check: Inspect perimeter for intact fire/smoke seals or gaskets
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress
• Threshold height: doors must have a ≤½″ beveled threshold
• Handle type: Lever-style preferred for accessibility
• IBU Overlay: May require tactile signage, visual contrast, or audible indicators in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• IRC R302.5.1: Door between garage and dwelling must be: Solid wood ≥1⅜" thick; Steel door ≥1⅜" thick; Fire-rated for ≥20 minutes
• IRC R311.2–R311.4: Must allow safe egress
• No double-keyed deadbolts on egress doors`
        },
        {
            id: 'door_fire_2',
            name: 'A fire-labeled door assembly has a hole of any size.',
            detail: 'A fire-labeled door assembly has a hole of any size.',
            criteria: 'A fire-labeled door assembly has a hole of any size. Or assembly is damaged such that its integrity may be compromised.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required if: Door is part of a passive fire protection system (e.g., between unit and corridor, garage, or stairwell).
• Label location: Fire label or plug typically found on the hinge edge of the door slab or frame.
🔍 Step 2: Visual Label Location
• Metal tag or embossed stamp on door edge (near top hinge or top of door)
• If the label is missing but the door appears fire-rated, inspect using NSPIRE fire door standards
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm door opens freely and closes fully
• Latch Test: Ensure door latches automatically when released
• Self-Closing Test: Open the door halfway and release; it should close and latch without assistance
• Seal Check: Inspect perimeter for intact fire/smoke seals or gaskets
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress
• Threshold height: doors must have a ≤½″ beveled threshold
• Handle type: Lever-style preferred for accessibility
• IBU Overlay: May require tactile signage, visual contrast, or audible indicators in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• IRC R302.5.1: Door between garage and dwelling must be: Solid wood ≥1⅜" thick; Steel door ≥1⅜" thick; Fire-rated for ≥20 minutes
• IRC R311.2–R311.4: Must allow safe egress
• No double-keyed deadbolts on egress doors`
        },
        {
            id: 'door_fire_3',
            name: 'Fire-labeled door can not be secured.',
            detail: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required if: Door is part of a passive fire protection system (e.g., between unit and corridor, garage, or stairwell).
• Label location: Fire label or plug typically found on the hinge edge of the door slab or frame.
🔍 Step 2: Visual Label Location
• Metal tag or embossed stamp on door edge (near top hinge or top of door)
• If the label is missing but the door appears fire-rated, inspect using NSPIRE fire door standards
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm door opens freely and closes fully
• Latch Test: Ensure door latches automatically when released
• Self-Closing Test: Open the door halfway and release; it should close and latch without assistance
• Seal Check: Inspect perimeter for intact fire/smoke seals or gaskets
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress
• Threshold height: doors must have a ≤½″ beveled threshold
• Handle type: Lever-style preferred for accessibility
• IBU Overlay: May require tactile signage, visual contrast, or audible indicators in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• IRC R302.5.1: Door between garage and dwelling must be: Solid wood ≥1⅜" thick; Steel door ≥1⅜" thick; Fire-rated for ≥20 minutes
• IRC R311.2–R311.4: Must allow safe egress
• No double-keyed deadbolts on egress doors`
        },
        {
            id: 'door_fire_4',
            name: 'Fire labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
            detail: 'Fire labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
            criteria: 'Fire-labeled door fails to close and latch due to missing or damaged self-closing hardware.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required if: Door is part of a passive fire protection system (e.g., between unit and corridor, garage, or stairwell).
• Label location: Fire label or plug typically found on the hinge edge of the door slab or frame.
🔍 Step 2: Visual Label Location
• Metal tag or embossed stamp on door edge (near top hinge or top of door)
• If the label is missing but the door appears fire-rated, inspect using NSPIRE fire door standards
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm door opens freely and closes fully
• Latch Test: Ensure door latches automatically when released
• Self-Closing Test: Open the door halfway and release; it should close and latch without assistance
• Seal Check: Inspect perimeter for intact fire/smoke seals or gaskets
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress
• Threshold height: doors must have a ≤½″ beveled threshold
• Handle type: Lever-style preferred for accessibility
• IBU Overlay: May require tactile signage, visual contrast, or audible indicators in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• IRC R302.5.1: Door between garage and dwelling must be: Solid wood ≥1⅜" thick; Steel door ≥1⅜" thick; Fire-rated for ≥20 minutes
• IRC R311.2–R311.4: Must allow safe egress
• No double-keyed deadbolts on egress doors`
        },
        {
            id: 'door_fire_5',
            name: 'Fire-labeled door does not open.',
            detail: 'Fire labeled door does not open such that it may limit access between spaces.',
            criteria: 'Fire labeled door does not open such that it may limit access between spaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-05',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required if: Door is part of a passive fire protection system (e.g., between unit and corridor, garage, or stairwell).
• Label location: Fire label or plug typically found on the hinge edge of the door slab or frame.
🔍 Step 2: Visual Label Location
• Metal tag or embossed stamp on door edge (near top hinge or top of door)
• If the label is missing but the door appears fire-rated, inspect using NSPIRE fire door standards
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm door opens freely and closes fully
• Latch Test: Ensure door latches automatically when released
• Self-Closing Test: Open the door halfway and release; it should close and latch without assistance
• Seal Check: Inspect perimeter for intact fire/smoke seals or gaskets
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress
• Threshold height: doors must have a ≤½″ beveled threshold
• Handle type: Lever-style preferred for accessibility
• IBU Overlay: May require tactile signage, visual contrast, or audible indicators in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• IRC R302.5.1: Door between garage and dwelling must be: Solid wood ≥1⅜" thick; Steel door ≥1⅜" thick; Fire-rated for ≥20 minutes
• IRC R311.2–R311.4: Must allow safe egress
• No double-keyed deadbolts on egress doors`
        },
        {
            id: 'door_fire_6',
            name: 'Fire-labeled door is missing.',
            detail: '(i.e., evidence of prior installation, but now not present or is incomplete.',
            criteria: '(i.e., evidence of prior installation, but now not present or is incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '14.8/n',
            code: 'DOOR-FIRE-06',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required if: Door is part of a passive fire protection system (e.g., between unit and corridor, garage, or stairwell).
• Label location: Fire label or plug typically found on the hinge edge of the door slab or frame.
🔍 Step 2: Visual Label Location
• Metal tag or embossed stamp on door edge (near top hinge or top of door)
• If the label is missing but the door appears fire-rated, inspect using NSPIRE fire door standards
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm door opens freely and closes fully
• Latch Test: Ensure door latches automatically when released
• Self-Closing Test: Open the door halfway and release; it should close and latch without assistance
• Seal Check: Inspect perimeter for intact fire/smoke seals or gaskets
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress
• Threshold height: doors must have a ≤½″ beveled threshold
• Handle type: Lever-style preferred for accessibility
• IBU Overlay: May require tactile signage, visual contrast, or audible indicators in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• IRC R302.5.1: Door between garage and dwelling must be: Solid wood ≥1⅜" thick; Steel door ≥1⅜" thick; Fire-rated for ≥20 minutes
• IRC R311.2–R311.4: Must allow safe egress
• No double-keyed deadbolts on egress doors`
        },
        {
            id: 'door_fire_7',
            name: 'Fire-labeled door seal or gasket is damaged.',
            detail: 'Fire-labeled door seal or gasket is damaged or missing, affecting proper function.',
            criteria: 'Fire-labeled door seal or gasket is damaged or missing, affecting proper function.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-07',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required if: Door is part of a passive fire protection system (e.g., between unit and corridor, garage, or stairwell).
• Label location: Fire label or plug typically found on the hinge edge of the door slab or frame.
🔍 Step 2: Visual Label Location
• Metal tag or embossed stamp on door edge (near top hinge or top of door)
• If the label is missing but the door appears fire-rated, inspect using NSPIRE fire door standards
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm door opens freely and closes fully
• Latch Test: Ensure door latches automatically when released
• Self-Closing Test: Open the door halfway and release; it should close and latch without assistance
• Seal Check: Inspect perimeter for intact fire/smoke seals or gaskets
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress
• Threshold height: doors must have a ≤½″ beveled threshold
• Handle type: Lever-style preferred for accessibility
• IBU Overlay: May require tactile signage, visual contrast, or audible indicators in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• IRC R302.5.1: Door between garage and dwelling must be: Solid wood ≥1⅜" thick; Steel door ≥1⅜" thick; Fire-rated for ≥20 minutes
• IRC R311.2–R311.4: Must allow safe egress
• No double-keyed deadbolts on egress doors`
        }
    ]
};

export const DOOR_GENERAL: InsideSubcategory = {
    name: 'Door-General',
    deficiencies: [
        {
            id: 'door_gen_1',
            name: 'A passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
            detail: 'whether visibly defective, nonfunctional, or incomplete— the door fails to provide adequate privacy, separation between rooms, or control over the physical atmosphere within a space.',
            criteria: 'whether visibly defective, nonfunctional, or incomplete— the door fails to provide adequate privacy, separation between rooms, or control over the physical atmosphere within a space.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'DOOR-GEN-01',
            codeReference: `🧭 Step 1: Identify Door Type & Location
• General Doors Include:
• Interior passage doors (bedroom, bathroom, closet, utility)
• Exterior doors not used as primary entry (e.g., patio, mechanical room)
🔍 Step 2: Sanitation & Environmental Control
• Check for water damage near bathroom or kitchen doors
• IBU Overlay: May require sealed surfaces, pest barriers, or mold-resistant finishes in high-humidity zones
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Latch Test: Ensure door latches securely when closed
• Privacy Check: For bathroom/bedroom doors, confirm locking mechanism works (if present)
• Swing Clearance: Ensure the door opens fully without obstruction
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or soft-close hardware in elderly housing
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Doors must allow safe movement between rooms
• IRC R302.5.1: Doors between garage and dwelling must meet fire separation requirements (if applicable)`
        },
        {
            id: 'door_gen_2',
            name: 'A passage door does not open.',
            detail: 'A passage door does not open such that it may limit access when needed.',
            criteria: 'A passage door does not open such that it may limit access when needed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GEN-02',
            codeReference: `🧭 Step 1: Identify Door Type & Location
• General Doors Include:
• Interior passage doors (bedroom, bathroom, closet, utility)
• Exterior doors not used as primary entry (e.g., patio, mechanical room)
🔍 Step 2: Sanitation & Environmental Control
• Check for water damage near bathroom or kitchen doors
• IBU Overlay: May require sealed surfaces, pest barriers, or mold-resistant finishes in high-humidity zones
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Latch Test: Ensure door latches securely when closed
• Privacy Check: For bathroom/bedroom doors, confirm locking mechanism works (if present)
• Swing Clearance: Ensure the door opens fully without obstruction
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or soft-close hardware in elderly housing
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Doors must allow safe movement between rooms
• IRC R302.5.1: Doors between garage and dwelling must meet fire separation requirements (if applicable)`
        },
        {
            id: 'door_gen_3',
            name: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
            detail: 'A passage door not intended for room access has a component that is either damaged, inoperable, or missing—each condition affecting its function or indicating prior installation.',
            criteria: 'A passage door not intended for room access has a component that is either damaged, inoperable, or missing—each condition affecting its function or indicating prior installation.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GEN-03',
            codeReference: `🧭 Step 1: Identify Door Type & Location
• General Doors Include:
• Interior passage doors (bedroom, bathroom, closet, utility)
• Exterior doors not used as primary entry (e.g., patio, mechanical room)
🔍 Step 2: Sanitation & Environmental Control
• Check for water damage near bathroom or kitchen doors
• IBU Overlay: May require sealed surfaces, pest barriers, or mold-resistant finishes in high-humidity zones
🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without sticking, dragging, or excessive force
• Latch Test: Ensure door latches securely when closed
• Privacy Check: For bathroom/bedroom doors, confirm locking mechanism works (if present)
• Swing Clearance: Ensure the door opens fully without obstruction
📏 Step 4: Accessibility & Local Requirements
• Clear Width: Minimum 32 inches clear opening when door is open 90°
• Thresholds: ≤½" for accessible routes
• Hardware: Operable with one hand, no tight grasping or twisting
• IBU Overlay: May require tactile signage, visual contrast, or soft-close hardware in elderly housing
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R311.2–R311.4: Doors must allow safe movement between rooms
• IRC R302.5.1: Doors between garage and dwelling must meet fire separation requirements (if applicable)`
        }
    ]
};

export const DOOR_GARAGE: InsideSubcategory = {
    name: 'Garage Door',
    deficiencies: [
        {
            id: 'door_garage_1',
            name: 'Garage door does not open, close, or remain closed.',
            detail: 'Door will not open and remain open, does not function adequately.',
            criteria: 'Door will not open and remain open, does not function adequately.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GARAGE-01',
            codeReference: `🧭 Step 1: Identify Garage Door Type
• Manual or Motorized: Overhead sectional, tilt-up, roll-up, or swing-out
• Location: Attached garage serving the residential unit
🔍 Step 2: Presence & Applicability
• Required if: The unit includes a garage space with a door intended for vehicle or occupant access.
🧪 Step 3: Functional Testing
• Manual test: Open and close the door fully—confirm smooth movement and secure closure.
• Motorized test (if present): Activate using wall switch or remote—door must respond and fully cycle.
• Latch check: Door must remain closed and latched when not in use.
• Confirm auto-reverse activates (IRC M1307.3.1)
📏 Step 4: Accessibility & Local Requirements
• Control height: Wall-mounted switches must be within ADA reach range (typically 15–48″ AFF)
• Emergency release: Must be accessible and clearly labeled
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R302.5.1: Garage doors must maintain fire separation from dwelling; No openings into sleeping rooms
• IRC R609.1: Doors must be weather-resistant and securely mounted`
        },
        {
            id: 'door_garage_2',
            name: 'Garage door has a hole.',
            detail: 'Garage door has a hole of any size that penetrates through to the interior.',
            criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GARAGE-02',
            codeReference: `🧭 Step 1: Identify Garage Door Type
• Manual or Motorized: Overhead sectional, tilt-up, roll-up, or swing-out
• Location: Attached garage serving the residential unit
🔍 Step 2: Presence & Applicability
• Required if: The unit includes a garage space with a door intended for vehicle or occupant access.
🧪 Step 3: Functional Testing
• Manual test: Open and close the door fully—confirm smooth movement and secure closure.
• Motorized test (if present): Activate using wall switch or remote—door must respond and fully cycle.
• Latch check: Door must remain closed and latched when not in use.
• Confirm auto-reverse activates (IRC M1307.3.1)
📏 Step 4: Accessibility & Local Requirements
• Control height: Wall-mounted switches must be within ADA reach range (typically 15–48″ AFF)
• Emergency release: Must be accessible and clearly labeled
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Safety & Structural Checks
• IRC R302.5.1: Garage doors must maintain fire separation from dwelling; No openings into sleeping rooms
• IRC R609.1: Doors must be weather-resistant and securely mounted`
        }
    ]
};

export const DOORS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Doors',
    subcategories: [
        DOOR_ENTRY,
        DOOR_FIRE_LABELED,
        DOOR_GENERAL,
        DOOR_GARAGE
    ]
};

// ==========================================
// 9. DRAINAGE (FLOOR DRAIN)
// ==========================================
export const DRAINAGE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Drainage (floor drain)',
    deficiencies: [
        {
            id: 'drain_1',
            name: 'Drain is fully blocked.',
            detail: 'There is a problem with the drainage.',
            criteria: 'There is a problem with the drainage.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DRAIN-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• Required in: All wet areas—bathrooms, kitchens, laundry rooms, utility closets
• Drain types: Floor drains, sink drains, shower/tub drains, appliance drains
• NSPIRE Scope: Focuses on operability, sanitation, and safety of visible drain components
🔍 Step 2: Visual Condition Assessment
• Odor check: Musty or sewer-like smells may indicate dry trap or venting failure
• Visual inspection: Look for mold, mildew, biofilm, or pest attractant
🧪 Step 3: Sanitation & Odor Control
• NSPIRE Overlay: Unsanitary drain conditions = Moderate
• IBU Overlay: May require trap primers, sealed penetrations, or pest-proof grates
📏 Step 4: Accessibility & Local Requirements
• Reachability: Drain access must not be obstructed by fixed cabinetry or appliances
• Clearance: Floor drains must be unobstructed and accessible for cleaning
• IBU Overlay: May require tactile indicators, visual contrast
⚒️ Step 5: IRC Plumbing & Safety Checks
• IRC Chapter 30 – Sanitary Drainage:
• Drain must connect to an approved DWV (Drainage, Waste, Vent) system
• Trap seal must be maintained to prevent sewer gas infiltration
• Drainage piping must be protected from freezing (IRC P3001.2)
• Flood-Resistant: In flood-prone areas, the drain must prevent backflow or infiltration (IRC P3001.3)`
        }
    ]
};

// ==========================================
// 10. EGRESS
// ==========================================
export const EGRESS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Egress',
    deficiencies: [
        {
            id: 'egress_1',
            name: 'Fire escape access to exteriors - doors and windows.',
            detail: 'Double-key cylinder deadbolts and any locks or security features requiring a key, tool, or special effort from the street side are prohibited on exit doors, exit access doors, and egress windows.',
            criteria: 'Double-key cylinder deadbolts and any locks or security features requiring a key, tool, or special effort from the street side are prohibited on exit doors, exit access doors, and egress windows.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'EGRESS-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• Egress definition: A safe, continuous, and unobstructed path from any point in the unit to a public way
🔍 Step 2: Visual Obstruction & Clearance
• Pathway check: Ensure hallways, doors, and windows are free of furniture, boxes, or debris
• Security bars: Must have quick-release mechanisms from the inside
• Locks: No double-keyed deadbolts or keyed window locks on egress routes
• NSPIRE Deficiency: Obstructed or locked egress = Life-Threatening
🧪 Step 3: Functional Testing
• Open All Exit Doors: Confirm they open easily from the inside without tools or keys
• Test Bedroom Windows: Open fully without excessive force
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress doors
• Window sill height: Emergency escape windows must be ≤44″ AFF (IRC §R310.2.2)
• Operation: Egress components must be operable without tools, keys, or special knowledge
• IBU Overlay: May require tactile signage, lever-style handles, Thresholds: ≤½" for accessible routes
⚒️ Step 5: IRC Egress Requirements
• IRC R311.1–R311.4: Every dwelling unit must have at least one egress door to the exterior
• Egress doors must be side-hinged, with a minimum 32" clear width
• IRC R310.1: Every sleeping room must have at least one emergency escape/rescue opening
• Minimum opening area: 5.7 sq ft (or 5.0 sq ft for ground floor)
• Max sill height: 44 inches above finished floor`
        },
        {
            id: 'egress_2',
            name: 'Obstructed means of egress. Interior, closets, bedroom, bathroom., hallway and corridors.',
            detail: 'Exit paths—including doors, stairways, and egress windows—must remain clear and operable without keys, tools, or special effort.',
            criteria: 'Exit paths—including doors, stairways, and egress windows—must remain clear and operable without keys, tools, or special effort.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'EGRESS-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• Egress definition: A safe, continuous, and unobstructed path from any point in the unit to a public way
🔍 Step 2: Visual Obstruction & Clearance
• Pathway check: Ensure hallways, doors, and windows are free of furniture, boxes, or debris
• Security bars: Must have quick-release mechanisms from the inside
• Locks: No double-keyed deadbolts or keyed window locks on egress routes
• NSPIRE Deficiency: Obstructed or locked egress = Life-Threatening
🧪 Step 3: Functional Testing
• Open All Exit Doors: Confirm they open easily from the inside without tools or keys
• Test Bedroom Windows: Open fully without excessive force
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress doors
• Window sill height: Emergency escape windows must be ≤44″ AFF (IRC §R310.2.2)
• Operation: Egress components must be operable without tools, keys, or special knowledge
• IBU Overlay: May require tactile signage, lever-style handles, Thresholds: ≤½" for accessible routes
⚒️ Step 5: IRC Egress Requirements
• IRC R311.1–R311.4: Every dwelling unit must have at least one egress door to the exterior
• Egress doors must be side-hinged, with a minimum 32" clear width
• IRC R310.1: Every sleeping room must have at least one emergency escape/rescue opening
• Minimum opening area: 5.7 sq ft (or 5.0 sq ft for ground floor)
• Max sill height: 44 inches above finished floor`
        },
        {
            id: 'egress_3',
            name: 'Sleeping room is located on the 3rd floor or below and has an obtrude rescue opening.',
            detail: 'If the egress door is the unit entry, see Deficiency 1; if near a fire escape, see Deficiency 3. Egress may be blocked by locks, bars, or obstructions.',
            criteria: 'If the egress door is the unit entry, see Deficiency 1; if near a fire escape, see Deficiency 3. Egress may be blocked by locks, bars, or obstructions.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'EGRESS-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• Egress definition: A safe, continuous, and unobstructed path from any point in the unit to a public way
🔍 Step 2: Visual Obstruction & Clearance
• Pathway check: Ensure hallways, doors, and windows are free of furniture, boxes, or debris
• Security bars: Must have quick-release mechanisms from the inside
• Locks: No double-keyed deadbolts or keyed window locks on egress routes
• NSPIRE Deficiency: Obstructed or locked egress = Life-Threatening
🧪 Step 3: Functional Testing
• Open All Exit Doors: Confirm they open easily from the inside without tools or keys
• Test Bedroom Windows: Open fully without excessive force
📏 Step 4: Accessibility & Local Requirements
• Clear width: IRC requires ≥32″ clear opening for egress doors
• Window sill height: Emergency escape windows must be ≤44″ AFF (IRC §R310.2.2)
• Operation: Egress components must be operable without tools, keys, or special knowledge
• IBU Overlay: May require tactile signage, lever-style handles, Thresholds: ≤½" for accessible routes
⚒️ Step 5: IRC Egress Requirements
• IRC R311.1–R311.4: Every dwelling unit must have at least one egress door to the exterior
• Egress doors must be side-hinged, with a minimum 32" clear width
• IRC R310.1: Every sleeping room must have at least one emergency escape/rescue opening
• Minimum opening area: 5.7 sq ft (or 5.0 sq ft for ground floor)
• Max sill height: 44 inches above finished floor`
        }
    ]
};

// ==========================================
// 11. ELECTRICAL
// ==========================================
export const ELECTRICAL_CONDUCTOR: InsideSubcategory = {
    name: 'Conductor-Outlet, and Switch',
    deficiencies: [
        {
            id: 'elec_cond_1',
            name: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
            detail: 'Electrical conductors must be properly enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2". Missing light bulbs should be assessed under interior or exterior lighting.',
            criteria: 'Electrical conductors must be properly enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2". Missing light bulbs should be assessed under interior or exterior lighting.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-COND-01',
            codeReference: `🧭 Step 1: Identify Components to Inspect
- Electrical Outlets: Standard, GFCI, AFCI, and specialty outlets
- Switches: Light switches, fan controls, appliance switches
- Conductors: Visible wiring, junction boxes, flexible cords (if exposed)
NSPIRE requires inspection of all accessible electrical components connected to the unit's power supply
🔍 Step 2: Visual Identification & Coverage
• 	Inspect all visible outlets, switches, and conductors in living areas, bedrooms, kitchens, bathrooms, and utility spaces
• 	Include: Standard outlets, GFCI outlets, light switches, junction boxes, and exposed wiring
🧪 Step 3: Functional Testing
- Outlet Test: Use UL-approved outlet tester
- Confirm correct wiring, grounding, and polarity
- For GFCI outlets: press TEST, verify trip, then RESET
- Switch Test: Toggle each switch to confirm it activates the connected fixture
- Conductors: Inspect visible wiring for secure termination and enclosure
- Confirm no flexible cords are used as permanent wiring
📏 Step 4: Accessibility, Sanitation & Environmental Safety
• 	Check for burn marks, soot, or melted plastic—indicates overheating or arcing
• 	IBU Overlay: May require tamper-resistant outlets, sealed faceplates, or moisture-rated components in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Checks
- IRC E3901–E3902: Outlets required in all habitable rooms, spaced ≤12 feet apart
- IRC E3905: All wiring must be enclosed in approved boxes, No exposed conductors or open splices allowed`
        },
        {
            id: 'elec_cond_2',
            name: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
            detail: 'An outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized.',
            criteria: 'An outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-COND-02',
            codeReference: `🧭 Step 1: Identify Components to Inspect
- Electrical Outlets: Standard, GFCI, AFCI, and specialty outlets
- Switches: Light switches, fan controls, appliance switches
- Conductors: Visible wiring, junction boxes, flexible cords (if exposed)
NSPIRE requires inspection of all accessible electrical components connected to the unit's power supply
🔍 Step 2: Visual Identification & Coverage
• 	Inspect all visible outlets, switches, and conductors in living areas, bedrooms, kitchens, bathrooms, and utility spaces
• 	Include: Standard outlets, GFCI outlets, light switches, junction boxes, and exposed wiring
🧪 Step 3: Functional Testing
- Outlet Test: Use UL-approved outlet tester
- Confirm correct wiring, grounding, and polarity
- For GFCI outlets: press TEST, verify trip, then RESET
- Switch Test: Toggle each switch to confirm it activates the connected fixture
- Conductors: Inspect visible wiring for secure termination and enclosure
- Confirm no flexible cords are used as permanent wiring
📏 Step 4: Accessibility, Sanitation & Environmental Safety
• 	Check for burn marks, soot, or melted plastic—indicates overheating or arcing
• 	IBU Overlay: May require tamper-resistant outlets, sealed faceplates, or moisture-rated components in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Checks
- IRC E3901–E3902: Outlets required in all habitable rooms, spaced ≤12 feet apart
- IRC E3905: All wiring must be enclosed in approved boxes, No exposed conductors or open splices allowed`
        },
        {
            id: 'elec_cond_3',
            name: 'The outlet or switch is damaged.',
            detail: 'Any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current at the outlet or switch.',
            criteria: 'Any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current at the outlet or switch.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-COND-03',
            codeReference: `🧭 Step 1: Identify Components to Inspect
- Electrical Outlets: Standard, GFCI, AFCI, and specialty outlets
- Switches: Light switches, fan controls, appliance switches
- Conductors: Visible wiring, junction boxes, flexible cords (if exposed)
NSPIRE requires inspection of all accessible electrical components connected to the unit's power supply
🔍 Step 2: Visual Identification & Coverage
• 	Inspect all visible outlets, switches, and conductors in living areas, bedrooms, kitchens, bathrooms, and utility spaces
• 	Include: Standard outlets, GFCI outlets, light switches, junction boxes, and exposed wiring
🧪 Step 3: Functional Testing
- Outlet Test: Use UL-approved outlet tester
- Confirm correct wiring, grounding, and polarity
- For GFCI outlets: press TEST, verify trip, then RESET
- Switch Test: Toggle each switch to confirm it activates the connected fixture
- Conductors: Inspect visible wiring for secure termination and enclosure
- Confirm no flexible cords are used as permanent wiring
📏 Step 4: Accessibility, Sanitation & Environmental Safety
• 	Check for burn marks, soot, or melted plastic—indicates overheating or arcing
• 	IBU Overlay: May require tamper-resistant outlets, sealed faceplates, or moisture-rated components in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Checks
- IRC E3901–E3902: Outlets required in all habitable rooms, spaced ≤12 feet apart
- IRC E3905: All wiring must be enclosed in approved boxes, No exposed conductors or open splices allowed`
        },
        {
            id: 'elec_cond_4',
            name: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
            detail: 'Testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded.',
            criteria: 'Testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'ELEC-COND-04',
            codeReference: `🧭 Step 1: Identify Components to Inspect
- Electrical Outlets: Standard, GFCI, AFCI, and specialty outlets
- Switches: Light switches, fan controls, appliance switches
- Conductors: Visible wiring, junction boxes, flexible cords (if exposed)
NSPIRE requires inspection of all accessible electrical components connected to the unit's power supply
🔍 Step 2: Visual Identification & Coverage
• 	Inspect all visible outlets, switches, and conductors in living areas, bedrooms, kitchens, bathrooms, and utility spaces
• 	Include: Standard outlets, GFCI outlets, light switches, junction boxes, and exposed wiring
🧪 Step 3: Functional Testing
- Outlet Test: Use UL-approved outlet tester
- Confirm correct wiring, grounding, and polarity
- For GFCI outlets: press TEST, verify trip, then RESET
- Switch Test: Toggle each switch to confirm it activates the connected fixture
- Conductors: Inspect visible wiring for secure termination and enclosure
- Confirm no flexible cords are used as permanent wiring
📏 Step 4: Accessibility, Sanitation & Environmental Safety
• 	Check for burn marks, soot, or melted plastic—indicates overheating or arcing
• 	IBU Overlay: May require tamper-resistant outlets, sealed faceplates, or moisture-rated components in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Checks
- IRC E3901–E3902: Outlets required in all habitable rooms, spaced ≤12 feet apart
- IRC E3905: All wiring must be enclosed in approved boxes, No exposed conductors or open splices allowed`
        },
        {
            id: 'elec_cond_5',
            name: 'water is currently in contact with an electrical conductor.',
            detail: 'Water is currently in contact with an electrical conductor.',
            criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-COND-05',
            codeReference: `🧭 Step 1: Identify Components to Inspect
- Electrical Outlets: Standard, GFCI, AFCI, and specialty outlets
- Switches: Light switches, fan controls, appliance switches
- Conductors: Visible wiring, junction boxes, flexible cords (if exposed)
NSPIRE requires inspection of all accessible electrical components connected to the unit's power supply
🔍 Step 2: Visual Identification & Coverage
• 	Inspect all visible outlets, switches, and conductors in living areas, bedrooms, kitchens, bathrooms, and utility spaces
• 	Include: Standard outlets, GFCI outlets, light switches, junction boxes, and exposed wiring
🧪 Step 3: Functional Testing
- Outlet Test: Use UL-approved outlet tester
- Confirm correct wiring, grounding, and polarity
- For GFCI outlets: press TEST, verify trip, then RESET
- Switch Test: Toggle each switch to confirm it activates the connected fixture
- Conductors: Inspect visible wiring for secure termination and enclosure
- Confirm no flexible cords are used as permanent wiring
📏 Step 4: Accessibility, Sanitation & Environmental Safety
• 	Check for burn marks, soot, or melted plastic—indicates overheating or arcing
• 	IBU Overlay: May require tamper-resistant outlets, sealed faceplates, or moisture-rated components in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Checks
- IRC E3901–E3902: Outlets required in all habitable rooms, spaced ≤12 feet apart
- IRC E3905: All wiring must be enclosed in approved boxes, No exposed conductors or open splices allowed`
        }
    ]
};

export const ELECTRICAL_GFCI_AFCI: InsideSubcategory = {
    name: 'Electrical-Ground Fault Circuit Interrupter(GFCI) Or Arc-Fault Circuit interrupter(AFCI)-Outlet or Breaker',
    deficiencies: [
        {
            id: 'elec_gfci_1',
            name: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-GFCI-01',
            codeReference: `🧭 Step 1: Identify GFCI-Protected Locations
• 	Labeling: GFCI/AFCI devices should be clearly marked
• 	IBU Overlay: May require tactile indicators, audible feedback, or visual contrast in accessible units
🔍 Step 2: Identification & Applicability
• 	GFCI required: Within 6 feet of water sources (sinks, tubs, showers, laundry hookups)
• 	In kitchens, bathrooms, garages, crawlspaces, and exterior outlets
• 	AFCI required: In living rooms, bedrooms, hallways, and other habitable spaces
🧪 Step 3: Operability Test
• 	GFCI outlets: Press TEST button—outlet should trip and stop supplying power
• 	Press RESET button—outlet should restore power
• 	AFCI breakers: Press TEST button on breaker—should trip and disable circuit
• 	Reset breaker to restore power
📏 Step 4: Sanitation & Environmental Safety
• 	Inspect for moisture intrusion around GFCI outlets near sinks or tubs
• 	Check for mold, rust, or corrosion on outlet face or box
• 	IBU Overlay: May require moisture-rated covers, sealed boxes, or tamper-resistant GFCIs in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Requirements
• 	IRC E3902.1–E3902.12:
• 	GFCI protection required in all wet or damp locations`
        },
        {
            id: 'elec_gfci_2',
            name: 'An unprotected outlet is present within six feet of a water source.',
            detail: 'An outlet, not GFCI-protected, is present within six feet of a water source located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
            criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-GFCI-02',
            codeReference: `🧭 Step 1: Identify GFCI-Protected Locations
• 	Labeling: GFCI/AFCI devices should be clearly marked
• 	IBU Overlay: May require tactile indicators, audible feedback, or visual contrast in accessible units
🔍 Step 2: Identification & Applicability
• 	GFCI required: Within 6 feet of water sources (sinks, tubs, showers, laundry hookups)
• 	In kitchens, bathrooms, garages, crawlspaces, and exterior outlets
• 	AFCI required: In living rooms, bedrooms, hallways, and other habitable spaces
🧪 Step 3: Operability Test
• 	GFCI outlets: Press TEST button—outlet should trip and stop supplying power
• 	Press RESET button—outlet should restore power
• 	AFCI breakers: Press TEST button on breaker—should trip and disable circuit
• 	Reset breaker to restore power
📏 Step 4: Sanitation & Environmental Safety
• 	Inspect for moisture intrusion around GFCI outlets near sinks or tubs
• 	Check for mold, rust, or corrosion on outlet face or box
• 	IBU Overlay: May require moisture-rated covers, sealed boxes, or tamper-resistant GFCIs in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Requirements
• 	IRC E3902.1–E3902.12:
• 	GFCI protection required in all wet or damp locations`
        },
        {
            id: 'elec_gfci_3',
            name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
            detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
            criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-GFCI-03',
            codeReference: `🧭 Step 1: Identify GFCI-Protected Locations
• 	Labeling: GFCI/AFCI devices should be clearly marked
• 	IBU Overlay: May require tactile indicators, audible feedback, or visual contrast in accessible units
🔍 Step 2: Identification & Applicability
• 	GFCI required: Within 6 feet of water sources (sinks, tubs, showers, laundry hookups)
• 	In kitchens, bathrooms, garages, crawlspaces, and exterior outlets
• 	AFCI required: In living rooms, bedrooms, hallways, and other habitable spaces
🧪 Step 3: Operability Test
• 	GFCI outlets: Press TEST button—outlet should trip and stop supplying power
• 	Press RESET button—outlet should restore power
• 	AFCI breakers: Press TEST button on breaker—should trip and disable circuit
• 	Reset breaker to restore power
📏 Step 4: Sanitation & Environmental Safety
• 	Inspect for moisture intrusion around GFCI outlets near sinks or tubs
• 	Check for mold, rust, or corrosion on outlet face or box
• 	IBU Overlay: May require moisture-rated covers, sealed boxes, or tamper-resistant GFCIs in high-humidity zones
⚒️ Step 5: IRC Electrical Safety Requirements
• 	IRC E3902.1–E3902.12:
• 	GFCI protection required in all wet or damp locations`
        }
    ]
};

export const ELECTRICAL_SERVICE_PANEL: InsideSubcategory = {
    name: 'Electrical Service Panel',
    deficiencies: [
        {
            id: 'elec_panel_1',
            name: 'Electrical service panel is not reasonably accessible.',
            detail: 'The electrical service panel is not reasonably accessible. Or it is loked or in locked location, no key to access.',
            criteria: 'The electrical service panel is not reasonably accessible. Or it is loked or in locked location, no key to access.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'ELEC-PANEL-01',
            codeReference: `🧭 Step 1: Locate the Service Panel
• 	Common Locations: Closet, hallway, garage, utility room, or exterior wall
• 	Panel Types: Breaker box, fuse box, disconnect box
• 	Accessibility Check: Panel must be readily accessible without moving furniture or using tools
• 	If blocked or hidden, it's a moderate deficiency under NSPIRE
🔍 Step 2: Visual Condition Assessment
• 	Accessibility Check: Panel must be readily accessible without moving furniture or using tools
• 	If blocked or hidden, it's a moderate deficiency under NSPIRE
🧪 Step 3: Functional Testing (Visual Only)
• 	Breaker test: Visually confirm breakers are seated and not tripped (do not reset tripped breakers)
• 	Inspect Breaker Alignment: All breakers should be seated properly
• 	Dead Front Cover: Must be present to prevent contact with energized parts
• 	Check for Gaps: No open slots or missing knockouts exposing live components
📏 Step 4: Sanitation, Contamination & Environmental Control
• 	Inspect for pest intrusion: Look for droppings, nesting, or chewed insulation
• 	Moisture check: Signs of water entry, rust, or mold around the panel
• 	Ventilation: Panel must not be located in damp or high-humidity zones without protection
• 	IBU Overlay: May require sealed penetrations, moisture-rated enclosures, or pest-proof gaskets
⚒️ Step 5: IRC Electrical Safety Requirements
• 	IRC E3405–E3606:
• 	Overcurrent protection devices must be listed and properly rated`
        },
        {
            id: 'elec_panel_2',
            name: 'The overcurrent protection device is contaminated.',
            detail: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
            criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-PANEL-02',
            codeReference: `🧭 Step 1: Locate the Service Panel
• 	Common Locations: Closet, hallway, garage, utility room, or exterior wall
• 	Panel Types: Breaker box, fuse box, disconnect box
• 	Accessibility Check: Panel must be readily accessible without moving furniture or using tools
• 	If blocked or hidden, it's a moderate deficiency under NSPIRE
🔍 Step 2: Visual Condition Assessment
• 	Accessibility Check: Panel must be readily accessible without moving furniture or using tools
• 	If blocked or hidden, it's a moderate deficiency under NSPIRE
🧪 Step 3: Functional Testing (Visual Only)
• 	Breaker test: Visually confirm breakers are seated and not tripped (do not reset tripped breakers)
• 	Inspect Breaker Alignment: All breakers should be seated properly
• 	Dead Front Cover: Must be present to prevent contact with energized parts
• 	Check for Gaps: No open slots or missing knockouts exposing live components
📏 Step 4: Sanitation, Contamination & Environmental Control
• 	Inspect for pest intrusion: Look for droppings, nesting, or chewed insulation
• 	Moisture check: Signs of water entry, rust, or mold around the panel
• 	Ventilation: Panel must not be located in damp or high-humidity zones without protection
• 	IBU Overlay: May require sealed penetrations, moisture-rated enclosures, or pest-proof gaskets
⚒️ Step 5: IRC Electrical Safety Requirements
• 	IRC E3405–E3606:
• 	Overcurrent protection devices must be listed and properly rated`
        },
        {
            id: 'elec_panel_3',
            name: 'The overcurrent protection device is damaged.',
            detail: 'The overcurrent protection device (i.e., fuse or breaker) is damaged such that it may not interrupt the circuit during an over current condition.',
            criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged such that it may not interrupt the circuit during an over current condition.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-PANEL-03',
            codeReference: `🧭 Step 1: Locate the Service Panel
• 	Common Locations: Closet, hallway, garage, utility room, or exterior wall
• 	Panel Types: Breaker box, fuse box, disconnect box
• 	Accessibility Check: Panel must be readily accessible without moving furniture or using tools
• 	If blocked or hidden, it's a moderate deficiency under NSPIRE
🔍 Step 2: Visual Condition Assessment
• 	Accessibility Check: Panel must be readily accessible without moving furniture or using tools
• 	If blocked or hidden, it's a moderate deficiency under NSPIRE
🧪 Step 3: Functional Testing (Visual Only)
• 	Breaker test: Visually confirm breakers are seated and not tripped (do not reset tripped breakers)
• 	Inspect Breaker Alignment: All breakers should be seated properly
• 	Dead Front Cover: Must be present to prevent contact with energized parts
• 	Check for Gaps: No open slots or missing knockouts exposing live components
📏 Step 4: Sanitation, Contamination & Environmental Control
• 	Inspect for pest intrusion: Look for droppings, nesting, or chewed insulation
• 	Moisture check: Signs of water entry, rust, or mold around the panel
• 	Ventilation: Panel must not be located in damp or high-humidity zones without protection
• 	IBU Overlay: May require sealed penetrations, moisture-rated enclosures, or pest-proof gaskets
⚒️ Step 5: IRC Electrical Safety Requirements
• 	IRC E3405–E3606:
• 	Overcurrent protection devices must be listed and properly rated`
        }
    ]
};

export const ELECTRICAL_MINIMUM: InsideSubcategory = {
    name: 'Minimum Electrical and Lighting',
    deficiencies: [
        {
            id: 'elec_min_1',
            name: 'At least two (2) working outlets are not present within each habitable room. OR at least one (1) working outlet and one (1) permanently installed light fixture is not present within each habitable room.',
            detail: 'Habitable rooms includes rooms that are in a building for living, sleeping, eating, or cooking.',
            criteria: 'Habitable rooms includes rooms that are in a building for living, sleeping, eating, or cooking.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'ELEC-MIN-01',
            codeReference: `🧭 Step 1: Identify Habitable Rooms
- Include: Living rooms, bedrooms, dining areas, kitchens
NSPIRE defines habitable rooms as those used for living, sleeping, eating, or cooking
🔍 Step 2: Outlet & Fixture Presence
• 	Visual check: Confirm outlet and fixture presence in each habitable room
🧪 Step 3: Functional Testing
- Outlet Test: Use UL-listed outlet tester to confirm power, polarity, and grounding
- Light Fixture Test: Turn on switch and confirm fixture illuminates
- Replace bulb if needed to verify fixture functionality
- Check Mounting: Ensure fixture is securely attached to the wall or ceiling
📏 Step 4: Accessibility & Local Requirements
• 	Height: Outlets ≥15″ AFF; switches ≤48″ AFF for ADA compliance
• 	Reachability: Must be unobstructed by furniture or fixed cabinetry
• 	Labeling: Multi-gang switches should be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Electrical Requirements
- IRC §E3901.1–E3901.12 – Receptacle outlet requirements: Outlets required in all habitable rooms, spaced ≤12 feet apart`
        }
    ]
};

export const ELECTRICAL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Electrical',
    subcategories: [
        ELECTRICAL_CONDUCTOR,
        ELECTRICAL_GFCI_AFCI,
        ELECTRICAL_SERVICE_PANEL,
        ELECTRICAL_MINIMUM
    ]
};

// ==========================================
// 12. FIRE SAFETY
// ==========================================
export const FIRE_EXTINGUISHER: InsideSubcategory = {
    name: 'Fire Extinguisher',
    deficiencies: [
        {
            id: 'fire_ext_1',
            name: 'A fire extinguisher is damaged or missing.',
            detail: 'Fire extinguisher is damaged (i.e., visibly defective; impacts functionality). Or Fire extinguisher is missing.',
            criteria: 'Fire extinguisher is damaged (i.e., visibly defective; impacts functionality). Or Fire extinguisher is missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'FIRE-EXT-01',
            codeReference: `🧭 Step 1: Determine Applicability
• 	IRC §R313.1–R313.2 – Fire protection systems (note: IRC does not mandate extinguishers in individual units)
• 	IRC: Recommends extinguishers in kitchens, garages, and near fuel-burning appliances
• 	IBU: Applies if the extinguisher is in an accessible unit or common area
🔍 Step 2: Visual Condition Assessment & Pressure Check
• 	Gauge inspection: Confirm needle is in the green zone
• 	Inspection tag: Must be present, legible, and dated within the last 12 months
🧪 Step 3: Functional Readiness Check
• 	Do not discharge the extinguisher
• 	Confirm: Locking pin is in place, Handle is intact, Hose/nozzle is connected
• 	Check Tag: Date of last inspection must be within 12 months
• 	If tag is missing but a valid service report is available, do not cite
📏 Step 4: Accessibility Compliance (IBU)
• 	Mounting Height: Top of extinguisher ≤48" AFF (above finished floor)
• 	Reach Range: Must be reachable from a seated position
• 	IBU Overlay: May require compliant reach range, tactile indicators, or audible alerts in accessible units
⚒️ Step 5: IRC Sanitation & Environmental Safety
• 	Surface condition: Must be free of grease, dust, mold, or pest droppings
• 	Accessibility: Extinguisher must be visible and reachable—no obstructions
• 	IBU Overlay: May require sealed cabinets, tamper indicators, or multilingual signage`
        },
        {
            id: 'fire_ext_2',
            name: 'The fire extinguisher pressure gauge reads over or undercharged.',
            detail: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
            criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'FIRE-EXT-02',
            codeReference: `🧭 Step 1: Determine Applicability
• 	IRC §R313.1–R313.2 – Fire protection systems (note: IRC does not mandate extinguishers in individual units)
• 	IRC: Recommends extinguishers in kitchens, garages, and near fuel-burning appliances
• 	IBU: Applies if the extinguisher is in an accessible unit or common area
🔍 Step 2: Visual Condition Assessment & Pressure Check
• 	Gauge inspection: Confirm needle is in the green zone
• 	Inspection tag: Must be present, legible, and dated within the last 12 months
🧪 Step 3: Functional Readiness Check
• 	Do not discharge the extinguisher
• 	Confirm: Locking pin is in place, Handle is intact, Hose/nozzle is connected
• 	Check Tag: Date of last inspection must be within 12 months
• 	If tag is missing but a valid service report is available, do not cite
📏 Step 4: Accessibility Compliance (IBU)
• 	Mounting Height: Top of extinguisher ≤48" AFF (above finished floor)
• 	Reach Range: Must be reachable from a seated position
• 	IBU Overlay: May require compliant reach range, tactile indicators, or audible alerts in accessible units
⚒️ Step 5: IRC Sanitation & Environmental Safety
• 	Surface condition: Must be free of grease, dust, mold, or pest droppings
• 	Accessibility: Extinguisher must be visible and reachable—no obstructions
• 	IBU Overlay: May require sealed cabinets, tamper indicators, or multilingual signage`
        },
        {
            id: 'fire_ext_3',
            name: 'The fire extinguisher tag is missing or illegible or expired.',
            detail: 'Fire extinguisher is noncompliant if the service tag is over a year old, missing, illegible, or if a disposable unit is over 12 years old.',
            criteria: 'Fire extinguisher is noncompliant if the service tag is over a year old, missing, illegible, or if a disposable unit is over 12 years old.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'FIRE-EXT-03',
            codeReference: `🧭 Step 1: Determine Applicability
• 	IRC §R313.1–R313.2 – Fire protection systems (note: IRC does not mandate extinguishers in individual units)
• 	IRC: Recommends extinguishers in kitchens, garages, and near fuel-burning appliances
• 	IBU: Applies if the extinguisher is in an accessible unit or common area
🔍 Step 2: Visual Condition Assessment & Pressure Check
• 	Gauge inspection: Confirm needle is in the green zone
• 	Inspection tag: Must be present, legible, and dated within the last 12 months
🧪 Step 3: Functional Readiness Check
• 	Do not discharge the extinguisher
• 	Confirm: Locking pin is in place, Handle is intact, Hose/nozzle is connected
• 	Check Tag: Date of last inspection must be within 12 months
• 	If tag is missing but a valid service report is available, do not cite
📏 Step 4: Accessibility Compliance (IBU)
• 	Mounting Height: Top of extinguisher ≤48" AFF (above finished floor)
• 	Reach Range: Must be reachable from a seated position
• 	IBU Overlay: May require compliant reach range, tactile indicators, or audible alerts in accessible units
⚒️ Step 5: IRC Sanitation & Environmental Safety
• 	Surface condition: Must be free of grease, dust, mold, or pest droppings
• 	Accessibility: Extinguisher must be visible and reachable—no obstructions
• 	IBU Overlay: May require sealed cabinets, tamper indicators, or multilingual signage`
        }
    ]
};

export const FLAMMABLE_COMBUSTIBLE: InsideSubcategory = {
    name: 'Flammable and Combustible Item',
    deficiencies: [
        {
            id: 'flam_1',
            name: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or a fuel-burning water heater. Or an improperly stored chemical.',
            detail: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place is not a deficiency.',
            criteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place is not a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'FLAM-01',
            codeReference: `🧭 Step 1: Identify Inspection Zones
Focus on areas where ignition sources and flammable materials may coexist
🔍 Step 2: Visual Condition
• 	Improper storage: Items stored loosely, stacked near heat, or leaking = Severe
• 	IBU Overlay: May require fire-rated cabinets or ventilated enclosures for volatile chemicals
🧪 Step 3: Proximity & Safety Check
• 	Measure Distance: Confirm flammable items are at least 3 feet away from:
• 	Fuel-burning water heaters, Furnaces, Stoves, and ovens, Fireplaces
• 	Inspect Containers: Must be original, sealed, and labeled, No leaking, rusted, or bulging containers
• 	Check for Ignition Sources: Open flames, pilot lights, heating elements, or electrical sparks
📏 Step 4: Prohibited Items & Locations
• 	Petroleum products (gasoline, kerosene, propane) must not be stored inside units
• 	Gas-powered equipment (e.g., lawnmowers, generators) must be stored outside or in exterior-access storage
• 	IBU Overlay: May prohibit indoor storage of oxygen tanks or require signage and ventilation
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC Section R302 & R315: Fuel-burning appliances must have clearances from combustibles
• 	No flammable storage in mechanical closets or near ignition sources`
        }
    ]
};

export const SMOKE_ALARM: InsideSubcategory = {
    name: 'Smoke Alarm',
    deficiencies: [
        {
            id: 'smoke_1',
            name: 'Smoke alarm does not produce an audio or visual alarm when tested.',
            detail: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            criteria: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-01',
            codeReference: `🧭 Step 1: Location & Coverage Requirements
Smoke alarms must be installed in the following locations:
• 	Inside each sleeping room
• 	Outside each sleeping room (e.g., hallway)
• 	On every level of the unit, including basements
🔍 Step 2: Visual Condition
• 	Not within 10 feet of cooking appliances
• 	Not within 3 feet of ceiling fans, ducts, windows, or exterior doors
🧪 Step 3: Functional Testing
• 	Press Test Button: Confirm audible alarm sounds
• 	Battery Check: If battery-powered, confirm battery is present and not expired
NSPIRE will require sealed, tamper-proof batteries in all battery-only units
📏 Step 4: Accessibility & Local Requirements
• 	Mounting Height: Typically 4"–12" from ceiling if wall-mounted; ceiling-mounted alarms must be >4" from wall
• 	Labeling: Must include manufacturer info and expiration date
• 	IBU Overlay: May require visual strobe alarms, tactile indicators, or audible alerts ≥75 dB for accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC R314: Smoke alarms required in all sleeping areas, outside sleeping areas, and on each level
• 	Must be interconnected in new construction, Must be listed to UL 217
• 	IRC R315: CO alarms required if fuel-burning appliances or attached garages are present`
        },
        {
            id: 'smoke_2',
            name: 'Smoke alarm not installed where required.',
            detail: 'Smoke alarm not installed inside each bedroom and Smoke alarm not installed outside the bedroom(s) and in each bedroom or on each level.',
            criteria: 'Smoke alarm not installed inside each bedroom and Smoke alarm not installed outside the bedroom(s) and in each bedroom or on each level.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-02',
            codeReference: `🧭 Step 1: Location & Coverage Requirements
Smoke alarms must be installed in the following locations:
• 	Inside each sleeping room
• 	Outside each sleeping room (e.g., hallway)
• 	On every level of the unit, including basements
🔍 Step 2: Visual Condition
• 	Not within 10 feet of cooking appliances
• 	Not within 3 feet of ceiling fans, ducts, windows, or exterior doors
🧪 Step 3: Functional Testing
• 	Press Test Button: Confirm audible alarm sounds
• 	Battery Check: If battery-powered, confirm battery is present and not expired
NSPIRE will require sealed, tamper-proof batteries in all battery-only units
📏 Step 4: Accessibility & Local Requirements
• 	Mounting Height: Typically 4"–12" from ceiling if wall-mounted; ceiling-mounted alarms must be >4" from wall
• 	Labeling: Must include manufacturer info and expiration date
• 	IBU Overlay: May require visual strobe alarms, tactile indicators, or audible alerts ≥75 dB for accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC R314: Smoke alarms required in all sleeping areas, outside sleeping areas, and on each level
• 	Must be interconnected in new construction, Must be listed to UL 217
• 	IRC R315: CO alarms required if fuel-burning appliances or attached garages are present`
        },
        {
            id: 'smoke_3',
            name: 'Smoke alarm is obstructed.',
            detail: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            criteria: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-03',
            codeReference: `🧭 Step 1: Location & Coverage Requirements
Smoke alarms must be installed in the following locations:
• 	Inside each sleeping room
• 	Outside each sleeping room (e.g., hallway)
• 	On every level of the unit, including basements
🔍 Step 2: Visual Condition
• 	Not within 10 feet of cooking appliances
• 	Not within 3 feet of ceiling fans, ducts, windows, or exterior doors
🧪 Step 3: Functional Testing
• 	Press Test Button: Confirm audible alarm sounds
• 	Battery Check: If battery-powered, confirm battery is present and not expired
NSPIRE will require sealed, tamper-proof batteries in all battery-only units
📏 Step 4: Accessibility & Local Requirements
• 	Mounting Height: Typically 4"–12" from ceiling if wall-mounted; ceiling-mounted alarms must be >4" from wall
• 	Labeling: Must include manufacturer info and expiration date
• 	IBU Overlay: May require visual strobe alarms, tactile indicators, or audible alerts ≥75 dB for accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC R314: Smoke alarms required in all sleeping areas, outside sleeping areas, and on each level
• 	Must be interconnected in new construction, Must be listed to UL 217
• 	IRC R315: CO alarms required if fuel-burning appliances or attached garages are present`
        },
        {
            id: 'smoke_4',
            name: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
            detail: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
            criteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-04',
            codeReference: `🧭 Step 1: Location & Coverage Requirements
Smoke alarms must be installed in the following locations:
• 	Inside each sleeping room
• 	Outside each sleeping room (e.g., hallway)
• 	On every level of the unit, including basements
🔍 Step 2: Visual Condition
• 	Not within 10 feet of cooking appliances
• 	Not within 3 feet of ceiling fans, ducts, windows, or exterior doors
🧪 Step 3: Functional Testing
• 	Press Test Button: Confirm audible alarm sounds
• 	Battery Check: If battery-powered, confirm battery is present and not expired
NSPIRE will require sealed, tamper-proof batteries in all battery-only units
📏 Step 4: Accessibility & Local Requirements
• 	Mounting Height: Typically 4"–12" from ceiling if wall-mounted; ceiling-mounted alarms must be >4" from wall
• 	Labeling: Must include manufacturer info and expiration date
• 	IBU Overlay: May require visual strobe alarms, tactile indicators, or audible alerts ≥75 dB for accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC R314: Smoke alarms required in all sleeping areas, outside sleeping areas, and on each level
• 	Must be interconnected in new construction, Must be listed to UL 217
• 	IRC R315: CO alarms required if fuel-burning appliances or attached garages are present`
        }
    ]
};

export const SPRINKLER_ASSEMBLY: InsideSubcategory = {
    name: 'Sprinkler Assembly',
    deficiencies: [
        {
            id: 'sprink_1',
            name: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
            detail: 'The sprinkler assembly component is damaged, inoperable, or missing.',
            criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'SPRINK-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required only if installed: NSPIRE does not mandate sprinkler systems in all units, but if present, they must be fully functional and unobstructed
• 	Common locations: Bedrooms, living rooms, kitchens, hallways, closets, stairwells
🔍 Step 2: Visual Condition Assessment
• 	NSPIRE Scope: Applies to visible sprinkler head assemblies and cover plates
🧪 Step 3: Sanitation & Environmental Safety
• 	Inspect for foreign material: Paint, dust, grease, rust, or mold on sprinkler head or escutcheon
• 	NSPIRE Deficiency 4: ≥75% of head or bulb covered by foreign material = Life-Threatening
• 	IBU Overlay: May require corrosion-resistant heads, sealed penetrations, or pest-proof escutcheons
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual—no disassembly or activation
• 	Labeling: Sprinkler heads should be identifiable by type and rating
• 	IBU Overlay: May require signage, multilingual instructions, or compliant reach zones in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC Section P2904: Sprinkler systems must be listed and installed per manufacturer specs
• 	Minimum coverage and spacing must be maintained
• 	Heads must be rated for the space they serve (e.g., quick-response in living areas)
• 	No obstructions within spray pattern radius`
        },
        {
            id: 'sprink_2',
            name: 'Sprinkler head assembly has evidence of corrosion.',
            detail: 'Sprinkler head assembly has evidence of corrosion.',
            criteria: 'Sprinkler head assembly has evidence of corrosion.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'SPRINK-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required only if installed: NSPIRE does not mandate sprinkler systems in all units, but if present, they must be fully functional and unobstructed
• 	Common locations: Bedrooms, living rooms, kitchens, hallways, closets, stairwells
🔍 Step 2: Visual Condition Assessment
• 	NSPIRE Scope: Applies to visible sprinkler head assemblies and cover plates
🧪 Step 3: Sanitation & Environmental Safety
• 	Inspect for foreign material: Paint, dust, grease, rust, or mold on sprinkler head or escutcheon
• 	NSPIRE Deficiency 4: ≥75% of head or bulb covered by foreign material = Life-Threatening
• 	IBU Overlay: May require corrosion-resistant heads, sealed penetrations, or pest-proof escutcheons
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual—no disassembly or activation
• 	Labeling: Sprinkler heads should be identifiable by type and rating
• 	IBU Overlay: May require signage, multilingual instructions, or compliant reach zones in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC Section P2904: Sprinkler systems must be listed and installed per manufacturer specs
• 	Minimum coverage and spacing must be maintained
• 	Heads must be rated for the space they serve (e.g., quick-response in living areas)
• 	No obstructions within spray pattern radius`
        },
        {
            id: 'sprink_3',
            name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
            detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'SPRINK-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required only if installed: NSPIRE does not mandate sprinkler systems in all units, but if present, they must be fully functional and unobstructed
• 	Common locations: Bedrooms, living rooms, kitchens, hallways, closets, stairwells
🔍 Step 2: Visual Condition Assessment
• 	NSPIRE Scope: Applies to visible sprinkler head assemblies and cover plates
🧪 Step 3: Sanitation & Environmental Safety
• 	Inspect for foreign material: Paint, dust, grease, rust, or mold on sprinkler head or escutcheon
• 	NSPIRE Deficiency 4: ≥75% of head or bulb covered by foreign material = Life-Threatening
• 	IBU Overlay: May require corrosion-resistant heads, sealed penetrations, or pest-proof escutcheons
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual—no disassembly or activation
• 	Labeling: Sprinkler heads should be identifiable by type and rating
• 	IBU Overlay: May require signage, multilingual instructions, or compliant reach zones in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC Section P2904: Sprinkler systems must be listed and installed per manufacturer specs
• 	Minimum coverage and spacing must be maintained
• 	Heads must be rated for the space they serve (e.g., quick-response in living areas)
• 	No obstructions within spray pattern radius`
        },
        {
            id: 'sprink_4',
            name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
            detail: '18 inches of clearance is not due to features within the built (e.g., closet, utility closet).',
            criteria: '18 inches of clearance is not due to features within the built (e.g., closet, utility closet).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'SPRINK-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required only if installed: NSPIRE does not mandate sprinkler systems in all units, but if present, they must be fully functional and unobstructed
• 	Common locations: Bedrooms, living rooms, kitchens, hallways, closets, stairwells
🔍 Step 2: Visual Condition Assessment
• 	NSPIRE Scope: Applies to visible sprinkler head assemblies and cover plates
🧪 Step 3: Sanitation & Environmental Safety
• 	Inspect for foreign material: Paint, dust, grease, rust, or mold on sprinkler head or escutcheon
• 	NSPIRE Deficiency 4: ≥75% of head or bulb covered by foreign material = Life-Threatening
• 	IBU Overlay: May require corrosion-resistant heads, sealed penetrations, or pest-proof escutcheons
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual—no disassembly or activation
• 	Labeling: Sprinkler heads should be identifiable by type and rating
• 	IBU Overlay: May require signage, multilingual instructions, or compliant reach zones in accessible units
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC Section P2904: Sprinkler systems must be listed and installed per manufacturer specs
• 	Minimum coverage and spacing must be maintained
• 	Heads must be rated for the space they serve (e.g., quick-response in living areas)
• 	No obstructions within spray pattern radius`
        }
    ]
};

export const FIRE_SAFETY_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Fire Safety',
    subcategories: [
        FIRE_EXTINGUISHER,
        FLAMMABLE_COMBUSTIBLE,
        SMOKE_ALARM,
        SPRINKLER_ASSEMBLY
    ]
};

// ==========================================
// 13. FLOOR
// ==========================================
export const FLOOR_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Floor',
    deficiencies: [
        {
            id: 'floor_1',
            name: 'Floor component(s) is not functionally adequate.',
            detail: 'Floor component(s) are not functionally adequate (i.e., do not allow the floor to separate levels or to be walked on), functionality (e.g., wood rot, sloping, defelection).',
            criteria: 'Surface abnormalities may indicate the presence of deficiency (i.e. lifting tiles, hardwood cupping, linoleum bubbling, etc.).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FLOOR-01',
            codeReference: `🧭 Step 1: Identify Flooring Types and Locations
• 	IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest-proof transitions
🔍 Step 2: Tripping Hazards & Transitions
• 	Thresholds: Must be beveled and ≤½″ high for accessibility
• 	Carpet edges: Must be secured and not frayed or lifted
🧪 Step 3: Functional Testing
• 	Walk Test: Walk across each room to detect soft spots, movement, or uneven transitions
• 	Edge Check: Inspect thresholds and transitions between rooms for raised edges or gaps
• 	Moisture Check: In bathrooms and kitchens, look for signs of water intrusion or softness underfoot
📏 Step 4: Accessibility & Local Requirements
• 	Surface firmness: Must be stable, firm, and slip-resistant (CBC §11B-302)
• 	Clear floor space: Required in accessible units for maneuverability
• 	IBU Overlay: May require low-pile carpet, non-slip finishes, or visual contrast for low-vision residents
⚒️ Step 5: IRC Structural & Safety Requirements
• 	IRC R301.1 & R502: Subfloor must support live loads and be fastened appropriately
• 	IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'floor_2',
            name: 'Floor substrate is exposed.',
            detail: '10% or more of the floor substrate area is exposed in any room.',
            criteria: 'Repair is needed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FLOOR-02',
            codeReference: `🧭 Step 1: Identify Flooring Types and Locations
• 	IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest-proof transitions
🔍 Step 2: Tripping Hazards & Transitions
• 	Thresholds: Must be beveled and ≤½″ high for accessibility
• 	Carpet edges: Must be secured and not frayed or lifted
🧪 Step 3: Functional Testing
• 	Walk Test: Walk across each room to detect soft spots, movement, or uneven transitions
• 	Edge Check: Inspect thresholds and transitions between rooms for raised edges or gaps
• 	Moisture Check: In bathrooms and kitchens, look for signs of water intrusion or softness underfoot
📏 Step 4: Accessibility & Local Requirements
• 	Surface firmness: Must be stable, firm, and slip-resistant (CBC §11B-302)
• 	Clear floor space: Required in accessible units for maneuverability
• 	IBU Overlay: May require low-pile carpet, non-slip finishes, or visual contrast for low-vision residents
⚒️ Step 5: IRC Structural & Safety Requirements
• 	IRC R301.1 & R502: Subfloor must support live loads and be fastened appropriately
• 	IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        }
    ]
};

// ==========================================
// 14. FOUNDATION
// ==========================================
export const FOUNDATION_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Foundation',
    deficiencies: [
        {
            id: 'found_1',
            name: 'Foundation exposed rebar or Foundation is spalling, flaking, or chipping.',
            detail: 'The structure has any exposed rebar. OR Foundation is spalling, flaking, or chipping and the affected area is 12x12 inches or greater and goes into the foundation at a depth of ¾ inch or greater.',
            criteria: 'Foundation exhibits a sign of serious failure.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUND-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: Visible portions of the foundation system accessible from inside the unit (e.g., slab edges, crawlspace access, basement walls, utility closets)
🔍 Step 2: Sanitation & Pest Control
• 	Check for pest droppings, nests, or burrowing near foundation edges
• 	IBU Overlay: May require sealed penetrations, pest-proof vents, or exclusion mesh
🧪 Step 3: Moisture Intrusion & Drainage
• 	Inspect for water stains, efflorescence, or mold on foundation surfaces
• 	Look for rusted fasteners or corroded rebar near exposed concrete
• 	IBU Overlay: May require vapor barriers, sump pumps, or perimeter drainage systems
📏 Step 4: Accessibility & Local Requirements
• 	Crawlspace access: Must be ≥18″ high and ≥24″ wide (IRC §R408.4)
• 	Basement egress: Must meet IRC §R310 for emergency escape and rescue
• 	Clearance: No obstructions blocking access to foundation inspection points
• 	IBU Overlay: May require tactile signage, compliant access panels, or visual contrast for low-vision inspectors
⚒️ Step 5: IRC Structural Requirements
• 	IRC R403–R407: Footings must be frost-protected and properly sized
• 	IRC R318: Moisture control required in crawlspaces and basements`
        },
        {
            id: 'found_2',
            name: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
            detail: 'The affected area is 12x12 incheshes or greater goes into the foundation at a depth of ¾ inch or greater.',
            criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUND-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: Visible portions of the foundation system accessible from inside the unit (e.g., slab edges, crawlspace access, basement walls, utility closets)
🔍 Step 2: Sanitation & Pest Control
• 	Check for pest droppings, nests, or burrowing near foundation edges
• 	IBU Overlay: May require sealed penetrations, pest-proof vents, or exclusion mesh
🧪 Step 3: Moisture Intrusion & Drainage
• 	Inspect for water stains, efflorescence, or mold on foundation surfaces
• 	Look for rusted fasteners or corroded rebar near exposed concrete
• 	IBU Overlay: May require vapor barriers, sump pumps, or perimeter drainage systems
📏 Step 4: Accessibility & Local Requirements
• 	Crawlspace access: Must be ≥18″ high and ≥24″ wide (IRC §R408.4)
• 	Basement egress: Must meet IRC §R310 for emergency escape and rescue
• 	Clearance: No obstructions blocking access to foundation inspection points
• 	IBU Overlay: May require tactile signage, compliant access panels, or visual contrast for low-vision inspectors
⚒️ Step 5: IRC Structural Requirements
• 	IRC R403–R407: Footings must be frost-protected and properly sized
• 	IRC R318: Moisture control required in crawlspaces and basements`
        },
        {
            id: 'found_3',
            name: 'Foundation is cracked',
            detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater.',
            criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUND-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: Visible portions of the foundation system accessible from inside the unit (e.g., slab edges, crawlspace access, basement walls, utility closets)
🔍 Step 2: Sanitation & Pest Control
• 	Check for pest droppings, nests, or burrowing near foundation edges
• 	IBU Overlay: May require sealed penetrations, pest-proof vents, or exclusion mesh
🧪 Step 3: Moisture Intrusion & Drainage
• 	Inspect for water stains, efflorescence, or mold on foundation surfaces
• 	Look for rusted fasteners or corroded rebar near exposed concrete
• 	IBU Overlay: May require vapor barriers, sump pumps, or perimeter drainage systems
📏 Step 4: Accessibility & Local Requirements
• 	Crawlspace access: Must be ≥18″ high and ≥24″ wide (IRC §R408.4)
• 	Basement egress: Must meet IRC §R310 for emergency escape and rescue
• 	Clearance: No obstructions blocking access to foundation inspection points
• 	IBU Overlay: May require tactile signage, compliant access panels, or visual contrast for low-vision inspectors
⚒️ Step 5: IRC Structural Requirements
• 	IRC R403–R407: Footings must be frost-protected and properly sized
• 	IRC R318: Moisture control required in crawlspaces and basements`
        },
        {
            id: 'found_4',
            name: 'Foundation infiltrated by water.',
            detail: 'Evidence of water infiltration through the foundation.',
            criteria: '(e.g., Excessive dampness, collected water, stains, or mineral deposits).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUND-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: Visible portions of the foundation system accessible from inside the unit (e.g., slab edges, crawlspace access, basement walls, utility closets)
🔍 Step 2: Sanitation & Pest Control
• 	Check for pest droppings, nests, or burrowing near foundation edges
• 	IBU Overlay: May require sealed penetrations, pest-proof vents, or exclusion mesh
🧪 Step 3: Moisture Intrusion & Drainage
• 	Inspect for water stains, efflorescence, or mold on foundation surfaces
• 	Look for rusted fasteners or corroded rebar near exposed concrete
• 	IBU Overlay: May require vapor barriers, sump pumps, or perimeter drainage systems
📏 Step 4: Accessibility & Local Requirements
• 	Crawlspace access: Must be ≥18″ high and ≥24″ wide (IRC §R408.4)
• 	Basement egress: Must meet IRC §R310 for emergency escape and rescue
• 	Clearance: No obstructions blocking access to foundation inspection points
• 	IBU Overlay: May require tactile signage, compliant access panels, or visual contrast for low-vision inspectors
⚒️ Step 5: IRC Structural Requirements
• 	IRC R403–R407: Footings must be frost-protected and properly sized
• 	IRC R318: Moisture control required in crawlspaces and basements`
        },
        {
            id: 'found_5',
            name: 'Foundation support post, column, or girder area is damaged.',
            detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUND-05',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: Visible portions of the foundation system accessible from inside the unit (e.g., slab edges, crawlspace access, basement walls, utility closets)
🔍 Step 2: Sanitation & Pest Control
• 	Check for pest droppings, nests, or burrowing near foundation edges
• 	IBU Overlay: May require sealed penetrations, pest-proof vents, or exclusion mesh
🧪 Step 3: Moisture Intrusion & Drainage
• 	Inspect for water stains, efflorescence, or mold on foundation surfaces
• 	Look for rusted fasteners or corroded rebar near exposed concrete
• 	IBU Overlay: May require vapor barriers, sump pumps, or perimeter drainage systems
📏 Step 4: Accessibility & Local Requirements
• 	Crawlspace access: Must be ≥18″ high and ≥24″ wide (IRC §R408.4)
• 	Basement egress: Must meet IRC §R310 for emergency escape and rescue
• 	Clearance: No obstructions blocking access to foundation inspection points
• 	IBU Overlay: May require tactile signage, compliant access panels, or visual contrast for low-vision inspectors
⚒️ Step 5: IRC Structural Requirements
• 	IRC R403–R407: Footings must be frost-protected and properly sized
• 	IRC R318: Moisture control required in crawlspaces and basements`
        }
    ]
};

// ==========================================
// 15. HAZARD
// ==========================================
export const HAZARD_INFESTATION: InsideSubcategory = {
    name: 'Infestation',
    deficiencies: [
        {
            id: 'haz_inf_1',
            name: 'Evidence of bedbugs.',
            detail: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
            criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZ-INF-01',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_2',
            name: 'Evidence of cockroaches (any sign).',
            detail: 'Evidence of cockroaches is found, (i.e.. of dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
            criteria: 'Evidence of cockroaches is found, (i.e.. of dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZ-INF-02',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_3',
            name: 'Evidence of mice (any sign).',
            detail: 'Evidence of mice is found (i.e. a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
            criteria: 'Evidence of mice is found (i.e. a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZ-INF-03',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_4',
            name: 'Evidence of other pests.',
            detail: 'Evidence of interior pest infestations—such as ants, wasps, squirrels, birds, or bats—may pose health and safety risks to residents.',
            criteria: 'Evidence of interior pest infestations—such as ants, wasps, squirrels, birds, or bats—may pose health and safety risks to residents.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZ-INF-04',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_5',
            name: 'Evidence of rats (any sign).',
            detail: 'Evidence of rats is found, i.e., a live or dead rat, droppings, or chewed holes.',
            criteria: 'Evidence of rats is found, i.e., a live or dead rat, droppings, or chewed holes.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZ-INF-05',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_6',
            name: 'Extensive bedbugs infestation.',
            detail: 'Sighting of at least one live bedbug in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
            criteria: 'Sighting of at least one live bedbug in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZ-INF-06',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_7',
            name: 'Extensive cockroach infestation (live).',
            detail: 'Sighting of one or more live cockroaches in two or more unit area observed simultaneously during visual assessment on the inspection day.',
            criteria: 'Sighting of one or more live cockroaches in two or more unit area observed simultaneously during visual assessment on the inspection day.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZ-INF-07',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_8',
            name: 'Extensive mouse infestation',
            detail: 'Sighting of at least one live mouse in two or more units or two rooms of the same unit during the daytime through surface visual assessment.',
            criteria: 'Sighting of at least one live mouse in two or more units or two rooms of the same unit during the daytime through surface visual assessment.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZ-INF-08',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        },
        {
            id: 'haz_inf_9',
            name: 'Extensive rate infestation.',
            detail: 'A live rat is seen in the unit.',
            criteria: 'A live rat is seen in the unit.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZ-INF-09',
            codeReference: `🧭 Step 1: Identify Target Areas for Inspection
Applies to: All interior spaces, including kitchens, bathrooms, bedrooms, closets, utility rooms, crawlspaces, and attics
• 	NSPIRE Scope: Pest hazards are scored regardless of resident behavior or existing extermination contracts
🔍 Step 2: Visual Condition Assessment
• 	Includes: Insects (cockroaches, ants, bedbugs, termites), rodents (mice, rats), birds, bats, and reptiles (e.g., snakes)
🧪 Step 3: Sanitation & Attractants
• 	Inspect for food residue, trash buildup, or standing water
• 	Check under sinks, behind appliances, and inside cabinets
• 	IBU Overlay: May require sealed cabinetry, pest-proof trash containers, or moisture control
📏 Step 4: Obstruction & Accessibility
• 	Ensure inspection access to baseboards, closets, and behind appliances
• 	Do not disturb resident belongings, but inspect visible areas thoroughly
• 	IBU Overlay: May require compliant inspection access or pest control coordination in elderly housing
⚒️ Step 5: IRC Sanitation & Structural Requirements
• 	IRC Section R306 & R322:
• 	Units must be free from unsanitary conditions and pest entry points
• 	IRC R302.5.1: Garage and utility areas must be sealed to prevent rodent intrusion`
        }
    ]
};

export const HAZARD_SHARP_EDGES: InsideSubcategory = {
    name: 'Sharp edges',
    deficiencies: [
        {
            id: 'haz_sharp_1',
            name: 'A sharp edge that can result in a cut or puncture hazard is present in the interior area, including, but not limited to, broken glass and damaged tile with exposed edges.',
            detail: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
            criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZ-SHARP-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All interior and exterior components within the unit, especially along normal paths of travel
🔍 Step 2: Common examples:
• 	Broken glass (windows, mirrors, furniture), Damaged tile or countertop edges, Exposed metal (HVAC grilles, cabinet hardware, bent fixtures)
🧪 Step 3: Repair & Mitigation Guidance
• 	Temporary mitigation: Tape, padding, or signage may be used until permanent repair
• 	Permanent repair: Replace damaged component, grind or bevel edge, install protective trim
• 	NSPIRE Note: Cosmetic damage is not scored unless it creates a sharp edge hazard
📏 Step 4: Accessibility & Path of Travel
• 	Location check: Sharp edges within 36″ of floor level or along walking paths pose a higher risk
• 	Rounded or beveled edges preferred in accessible units
• 	IBU Overlay: May require tactile warnings, visual contrast, or protective guards in elderly housing
⚒️ Step 5: IRC Safety Requirements
• 	IRC R311.7.8 & R312: Handrails and guards must be smooth and free of sharp projections
• 	IRC §R302.1 – Protection against physical hazards and injury`
        }
    ]
};

export const HAZARD_TRIP: InsideSubcategory = {
    name: 'Trip hazard',
    deficiencies: [
        {
            id: 'haz_trip_1',
            name: 'Trip hazard on walking surface.',
            detail: 'Walking surfaces have an abrupt change: a vertical gap ≥¾ inch or a horizontal separation ≥2 inches across the path of travel.',
            criteria: 'Walking surfaces have an abrupt change: a vertical gap ≥¾ inch or a horizontal separation ≥2 inches across the path of travel.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZ-TRIP-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All walking surfaces inside the unit, including:
• 	Hallways, entryways, kitchens, bathrooms, bedrooms, closets
• 	Transitions between flooring types, thresholds, and doorway lip
🔍 Step 2: Visual Condition Assessment
• 	Inspect for debris, cords, or clutter that may create temporary trip hazards
🧪 Step 3: Measurement & Testing
• 	Vertical Hazard: Use a ruler or measuring tool to confirm elevation change ≥ ¾ inch
• 	Horizontal Hazard: Measure gap perpendicular to path; cite if ≥ 2 inches
• 	Walk Test: Walk the area naturally to detect unevenness or instability
📏 Step 4: Accessibility & Local Requirements
• 	Clear width: Minimum 36″ for accessible routes
• 	Threshold height: ≤½″ beveled or ≤¼″ vertical
• 	Surface firmness: Must be stable, firm, and slip-resistant
• 	IBU Overlay: May require visual contrast, tactile warnings, or low-pile flooring in accessible units
⚒️ Step 5: IRC Safety Requirements
• 	IRC R311.7.8 & R312: Walking surfaces must be continuous and safe
• 	IRC §R302.1 – Protection against physical injury and unsafe walking surfaces`
        }
    ]
};

export const HAZARD_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Hazard',
    subcategories: [
        HAZARD_INFESTATION,
        HAZARD_SHARP_EDGES,
        HAZARD_TRIP
    ]
};

// ==========================================
// 16. HEATING, VENTILATION, AND AIR CONDITIONING (HVAC)
// ==========================================
export const HVAC_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Heating, Ventilation, and Air Conditioning',
    deficiencies: [
        {
            id: 'hvac_1',
            name: 'Air conditioning system or device is not operational.',
            detail: 'System or device does not turn on. OR System or device only produces hot or room temperature air.',
            criteria: '(e.g., a window unit or central air system).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HVAC-01',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        },
        {
            id: 'hvac_2',
            name: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance.',
            detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance.',
            criteria: 'Combustion chamber cover or gas shutoff valve was previously installed but is now either not present or incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'HVAC-02',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        },
        {
            id: 'hvac_3',
            name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected or improperly connected, damaged or missing.',
            detail: 'Fuel-burning heating system is present, and the exhaust vent is misaligned, blocked, disconnected, or damaged—posing safety risks.',
            criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitue for improperly connected flue vent.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'HVAC-03',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        },
        {
            id: 'hvac_4',
            name: 'Heating system or device safety shield is damaged or missing.',
            detail: 'Heating system or device safety shield is damaged or missing.',
            criteria: 'Safety shield was previously installed and is now not present or is incomplete.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HVAC-04',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        },
        {
            id: 'hvac_5',
            name: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
            detail: 'A permanently installed heating source is damaged Or is inoperable. Or is missing. Or not installed.',
            criteria: 'A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed waii unit.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HVAC-05',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        },
        {
            id: 'hvac_6',
            name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating or heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
            detail: 'The permanently installed heating or heating source is not working. Or Temperature is below 64 degrees Fahrenheit.',
            criteria: 'A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed waii unit.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'HVAC-06',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        },
        {
            id: 'hvac_7',
            name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating or heating source is working and the interior temperature is 64 to 67.9 degrees Fahrenheit.',
            detail: 'The permanently installed heating or heating source is working. However the temperature is 64 to 67.9 degrees Fahrenheit.',
            criteria: 'A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed waii unit.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.8/n',
            code: 'HVAC-07',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        },
        {
            id: 'hvac_8',
            name: 'Unvented space heater is present.',
            detail: 'Unvented space heater that burns gas, oil, or kerosene is present.',
            criteria: 'Inside, include any and all common areas.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'HVAC-08',
            codeReference: `🧭 Step 1: Identify HVAC Components
• 	Scope: Includes heating units, cooling systems, exhaust fans, thermostats, and ductwork
🔍 Step 2: Identification & Applicability
• 	Required: Every habitable space must have a functional heat source during the heating season (typically Oct–Apr)
• 	Cooling systems: Required only if originally designed or provided
🧪 Step 3: Functional Testing
• 	Heating Test: Activate thermostat and confirm warm air or heat delivery, Check for airflow at supply vents
• 	Cooling Test (if applicable): Activate AC and confirm cool air delivery
• 	Ventilation Test: Turn on exhaust fans in kitchen and bathroom
• 	Use tissue test to confirm suction
• 	Thermostat Check: Confirm display works and responds to input
📏 Step 4: Accessibility & Local Requirements
• 	Reach Range: Thermostats and controls must be within 15"–48" AFF
• 	Ventilation controls: Must be labeled and operable by residents
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC HVAC Safety Requirements
• 	IRC M1401–M1507: Heating systems must be safely installed and vented
• 	Combustion appliances must have proper clearances and exhaust
• 	No fuel-burning appliances allowed in sleeping rooms unless sealed combustion`
        }
    ]
};

// ==========================================
// 17. KITCHEN
// ==========================================
export const KITCHEN_CABINET: InsideSubcategory = {
    name: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'kit_cab_1',
            name: 'Storage component is damaged, inoperable, or missing.',
            detail: 'Some of the kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-CAB-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit with a designated kitchen must have permanent cabinetry for food and dish storage
🔍 Step 2: Visual Condition Assessment
• 	Check under sink cabinets for leaks, rot, or odor
🧪 Step 3: Operability Test
• 	Open and close every door and drawer
• 	Check for full extension and smooth operation
• 	Verify alignment and secure latching
📏 Step 4: Accessibility & Local Requirements
• 	Reach range: Shelves and drawers must be usable by residents with limited mobility
• 	Handle type: Lever or loop-style preferred for accessibility
• 	IBU Overlay: May require adjustable shelving, tactile labels, or visual contrast in accessible units
⚒️ Step 5: IRC Structural Requirements
• 	IRC R306.2: Kitchens must include space for food preparation and storage
• 	IRC R602.3: Cabinets must be securely fastened to structural framing`
        }
    ]
};

export const KITCHEN_COOKING: InsideSubcategory = {
    name: 'Cooking Appliance',
    deficiencies: [
        {
            id: 'kit_cook_1',
            name: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            criteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-COOK-01',
            codeReference: `🧭 Step 1: Identify Cooking Appliance Type
• 	Appliance types: Gas or electric range, cooktop, oven, or microwave (if primary)
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a primary cooking appliance unless exempt (e.g., SRO with shared kitchen)
🧪 Step 3: Functional Testing
• 	Burner Test: Gas: Observe flame pattern (even, blue flame)
• 	Electric: Feel for heat above coil or surface
• 	Oven Test: Turn on and confirm heating (use thermometer if available)
• 	Microwave Test (if primary): Run for 30 seconds with a cup of water; confirm heating
• 	Control Check: Ensure knobs, buttons, and digital displays respond properly
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Handle type: Lever or loop-style preferred
• 	Clear floor space: ≥30″ x 48″ in front of appliance for wheelchair access
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC G2406.2: No fuel-burning appliances allowed in sleeping rooms unless sealed combustion
• 	IRC E3901.5: Electrical outlets must be safely positioned and grounded near appliances`
        },
        {
            id: 'kit_cook_2',
            name: 'Microwave is the primary cooking appliance, and it is damaged.',
            detail: 'A microwave is the primary cooking appliance and it is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'A microwave is the primary cooking appliance and it is damaged (i.e., visibly defective; impacts functionality).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KIT-COOK-02',
            codeReference: `🧭 Step 1: Identify Cooking Appliance Type
• 	Appliance types: Gas or electric range, cooktop, oven, or microwave (if primary)
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a primary cooking appliance unless exempt (e.g., SRO with shared kitchen)
🧪 Step 3: Functional Testing
• 	Burner Test: Gas: Observe flame pattern (even, blue flame)
• 	Electric: Feel for heat above coil or surface
• 	Oven Test: Turn on and confirm heating (use thermometer if available)
• 	Microwave Test (if primary): Run for 30 seconds with a cup of water; confirm heating
• 	Control Check: Ensure knobs, buttons, and digital displays respond properly
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Handle type: Lever or loop-style preferred
• 	Clear floor space: ≥30″ x 48″ in front of appliance for wheelchair access
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC G2406.2: No fuel-burning appliances allowed in sleeping rooms unless sealed combustion
• 	IRC E3901.5: Electrical outlets must be safely positioned and grounded near appliances`
        },
        {
            id: 'kit_cook_3',
            name: 'A control knob is missing, or the oven, cooktop component is damaged or missing, making the device unsafe for use, including the oven door seal.',
            detail: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
            criteria: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-COOK-03',
            codeReference: `🧭 Step 1: Identify Cooking Appliance Type
• 	Appliance types: Gas or electric range, cooktop, oven, or microwave (if primary)
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a primary cooking appliance unless exempt (e.g., SRO with shared kitchen)
🧪 Step 3: Functional Testing
• 	Burner Test: Gas: Observe flame pattern (even, blue flame)
• 	Electric: Feel for heat above coil or surface
• 	Oven Test: Turn on and confirm heating (use thermometer if available)
• 	Microwave Test (if primary): Run for 30 seconds with a cup of water; confirm heating
• 	Control Check: Ensure knobs, buttons, and digital displays respond properly
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Handle type: Lever or loop-style preferred
• 	Clear floor space: ≥30″ x 48″ in front of appliance for wheelchair access
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC G2406.2: No fuel-burning appliances allowed in sleeping rooms unless sealed combustion
• 	IRC E3901.5: Electrical outlets must be safely positioned and grounded near appliances`
        },
        {
            id: 'kit_cook_4',
            name: 'Cooktop or oven does not ignite or produce heat.',
            detail: 'No burner on the cooking range or cooktop produces heat. Or The oven does not produce heat temperature.',
            criteria: 'No burner on the cooking range or cooktop produces heat. Or The oven does not produce heat temperature.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KIT-COOK-04',
            codeReference: `🧭 Step 1: Identify Cooking Appliance Type
• 	Appliance types: Gas or electric range, cooktop, oven, or microwave (if primary)
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a primary cooking appliance unless exempt (e.g., SRO with shared kitchen)
🧪 Step 3: Functional Testing
• 	Burner Test: Gas: Observe flame pattern (even, blue flame)
• 	Electric: Feel for heat above coil or surface
• 	Oven Test: Turn on and confirm heating (use thermometer if available)
• 	Microwave Test (if primary): Run for 30 seconds with a cup of water; confirm heating
• 	Control Check: Ensure knobs, buttons, and digital displays respond properly
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Handle type: Lever or loop-style preferred
• 	Clear floor space: ≥30″ x 48″ in front of appliance for wheelchair access
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC G2406.2: No fuel-burning appliances allowed in sleeping rooms unless sealed combustion
• 	IRC E3901.5: Electrical outlets must be safely positioned and grounded near appliances`
        },
        {
            id: 'kit_cook_5',
            name: 'The primary cooking appliance is missing.',
            detail: 'Primary cooking appliance is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Primary cooking appliance is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KIT-COOK-05',
            codeReference: `🧭 Step 1: Identify Cooking Appliance Type
• 	Appliance types: Gas or electric range, cooktop, oven, or microwave (if primary)
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a primary cooking appliance unless exempt (e.g., SRO with shared kitchen)
🧪 Step 3: Functional Testing
• 	Burner Test: Gas: Observe flame pattern (even, blue flame)
• 	Electric: Feel for heat above coil or surface
• 	Oven Test: Turn on and confirm heating (use thermometer if available)
• 	Microwave Test (if primary): Run for 30 seconds with a cup of water; confirm heating
• 	Control Check: Ensure knobs, buttons, and digital displays respond properly
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Handle type: Lever or loop-style preferred
• 	Clear floor space: ≥30″ x 48″ in front of appliance for wheelchair access
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC G2406.2: No fuel-burning appliances allowed in sleeping rooms unless sealed combustion
• 	IRC E3901.5: Electrical outlets must be safely positioned and grounded near appliances`
        }
    ]
};

export const KITCHEN_FOOD_PREP: InsideSubcategory = {
    name: 'Food preparation Area',
    deficiencies: [
        {
            id: 'kit_food_1',
            name: 'The food preparation area (countertop) is damaged or not functionally adequate.',
            detail: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            criteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-FOOD-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a designated food preparation area unless exempt (e.g., SRO with shared kitchen)
• 	Made of cleanable material (e.g., laminate, stainless steel, sealed stone)
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, grease, pests, or food residue on all surfaces
• 	Check under sink and behind appliances for leaks or contamination
🧪 Step 3: Functional Testing
• 	Surface Check: Run hand across surface to detect roughness, instability, or exposed substrate
• 	Cleanability Test: Confirm surface is sealed and nonporous (e.g., no raw wood or crumbling laminate)
• 	Stability Check: Ensure countertop is securely mounted and does not shift or sag
📏 Step 4: Accessibility & Local Requirements
• 	Counter height: ≤34″ AFF for accessible units
• 	Sink clearance: Knee space required under sink for wheelchair access
• 	IBU Overlay: May require tactile controls, visual contrast, or lever-style hardware
⚒️ Step 5: IRC Kitchen Requirements
• 	IRC R306.2: Kitchens must include a sink, cooking appliance, and space for food preparation
• 	IRC R602.3: Cabinets and counters must be securely fastened to structural framing`
        },
        {
            id: 'kit_food_2',
            name: 'The food preparation area, countertop is not present.',
            detail: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            criteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-FOOD-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a designated food preparation area unless exempt (e.g., SRO with shared kitchen)
• 	Made of cleanable material (e.g., laminate, stainless steel, sealed stone)
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, grease, pests, or food residue on all surfaces
• 	Check under sink and behind appliances for leaks or contamination
🧪 Step 3: Functional Testing
• 	Surface Check: Run hand across surface to detect roughness, instability, or exposed substrate
• 	Cleanability Test: Confirm surface is sealed and nonporous (e.g., no raw wood or crumbling laminate)
• 	Stability Check: Ensure countertop is securely mounted and does not shift or sag
📏 Step 4: Accessibility & Local Requirements
• 	Counter height: ≤34″ AFF for accessible units
• 	Sink clearance: Knee space required under sink for wheelchair access
• 	IBU Overlay: May require tactile controls, visual contrast, or lever-style hardware
⚒️ Step 5: IRC Kitchen Requirements
• 	IRC R306.2: Kitchens must include a sink, cooking appliance, and space for food preparation
• 	IRC R602.3: Cabinets and counters must be securely fastened to structural framing`
        }
    ]
};

export const KITCHEN_MOLD: InsideSubcategory = {
    name: 'MOLD-LIKE SUBSTANCE',
    deficiencies: [
        {
            id: 'kit_mold_1',
            name: 'Peeling Paint - Elevated moisture level.',
            detail: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-MOLD-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All kitchen surfaces—walls, ceilings, cabinetry, countertops, flooring, and behind/under appliances
🔍 Step 2: Sanitation & Environmental Safety
• 	Visual inspection: Look for mold-like patches ≥4 square inches cumulatively
🧪 Step 3: Inspection Technique
• 	Visual Scan: Estimate Area: Measure or approximate total surface area affected
• 	Check for Moisture Source: Look for active leaks, condensation, or plumbing failures
📏 Step 4: Accessibility & Local Requirements
• 	Reachability: Mold must be inspected in accessible areas only—no disassembly required
• 	Surface contrast: Mold-like substance must be distinguishable from surface color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion`
        },
        {
            id: 'kit_mold_2',
            name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than 9 square feet in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'KIT-MOLD-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All kitchen surfaces—walls, ceilings, cabinetry, countertops, flooring, and behind/under appliances
🔍 Step 2: Sanitation & Environmental Safety
• 	Visual inspection: Look for mold-like patches ≥4 square inches cumulatively
🧪 Step 3: Inspection Technique
• 	Visual Scan: Estimate Area: Measure or approximate total surface area affected
• 	Check for Moisture Source: Look for active leaks, condensation, or plumbing failures
📏 Step 4: Accessibility & Local Requirements
• 	Reachability: Mold must be inspected in accessible areas only—no disassembly required
• 	Surface contrast: Mold-like substance must be distinguishable from surface color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion`
        },
        {
            id: 'kit_mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KIT-MOLD-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All kitchen surfaces—walls, ceilings, cabinetry, countertops, flooring, and behind/under appliances
🔍 Step 2: Sanitation & Environmental Safety
• 	Visual inspection: Look for mold-like patches ≥4 square inches cumulatively
🧪 Step 3: Inspection Technique
• 	Visual Scan: Estimate Area: Measure or approximate total surface area affected
• 	Check for Moisture Source: Look for active leaks, condensation, or plumbing failures
📏 Step 4: Accessibility & Local Requirements
• 	Reachability: Mold must be inspected in accessible areas only—no disassembly required
• 	Surface contrast: Mold-like substance must be distinguishable from surface color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion`
        },
        {
            id: 'kit_mold_4',
            name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-MOLD-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All kitchen surfaces—walls, ceilings, cabinetry, countertops, flooring, and behind/under appliances
🔍 Step 2: Sanitation & Environmental Safety
• 	Visual inspection: Look for mold-like patches ≥4 square inches cumulatively
🧪 Step 3: Inspection Technique
• 	Visual Scan: Estimate Area: Measure or approximate total surface area affected
• 	Check for Moisture Source: Look for active leaks, condensation, or plumbing failures
📏 Step 4: Accessibility & Local Requirements
• 	Reachability: Mold must be inspected in accessible areas only—no disassembly required
• 	Surface contrast: Mold-like substance must be distinguishable from surface color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion`
        }
    ]
};

export const KITCHEN_REFRIGERATOR: InsideSubcategory = {
    name: 'Refrigerator',
    deficiencies: [
        {
            id: 'kit_ref_1',
            name: 'Refrigerator component is damaged such that it impacts functionality.',
            detail: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
            criteria: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-REF-01',
            codeReference: `🧭 Step 1: Identify the Refrigerator Type
Inspect only permanently installed refrigerators provided by the property
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a functional refrigerator unless exempt (e.g., shared kitchen arrangement)
• 	Includes: Integrated freezer compartment, shelving, seals, and controls
🧪 Step 3: Functional Testing
• 	Cooling Test: Use thermometer to confirm: Refrigerator: 32–40°F and Freezer ≤32°F
• 	Door Seal Check: Close door on a piece of paper; it should resist easy removal
• 	Interior Inspection: Open all drawers and shelves; check for cracks or missing parts
• 	Light & Controls: Confirm interior light and temperature controls function properly
📏 Step 4: Accessibility & Local Requirements
• 	Clear floor space: ≥30″ x 48″ in front of refrigerator for wheelchair access
• 	Control labeling: Must be legible and operable without fine motor skills
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC E3901.5: Electrical outlets must be grounded and safely positioned
• 	IRC R306.2: Kitchens must include a sink, cooking appliance, and food storage (refrigerator)`
        },
        {
            id: 'kit_ref_2',
            name: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
            detail: 'Does not cool adequately for the safe storage of food.',
            criteria: 'Does not cool adequately for the safe storage of food.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-REF-02',
            codeReference: `🧭 Step 1: Identify the Refrigerator Type
Inspect only permanently installed refrigerators provided by the property
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a functional refrigerator unless exempt (e.g., shared kitchen arrangement)
• 	Includes: Integrated freezer compartment, shelving, seals, and controls
🧪 Step 3: Functional Testing
• 	Cooling Test: Use thermometer to confirm: Refrigerator: 32–40°F and Freezer ≤32°F
• 	Door Seal Check: Close door on a piece of paper; it should resist easy removal
• 	Interior Inspection: Open all drawers and shelves; check for cracks or missing parts
• 	Light & Controls: Confirm interior light and temperature controls function properly
📏 Step 4: Accessibility & Local Requirements
• 	Clear floor space: ≥30″ x 48″ in front of refrigerator for wheelchair access
• 	Control labeling: Must be legible and operable without fine motor skills
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC E3901.5: Electrical outlets must be grounded and safely positioned
• 	IRC R306.2: Kitchens must include a sink, cooking appliance, and food storage (refrigerator)`
        },
        {
            id: 'kit_ref_3',
            name: 'Refrigerator is missing.',
            detail: 'Refrigerator is missing (i.e., evidence of prior installation but is now not present).',
            criteria: 'Refrigerator is missing (i.e., evidence of prior installation but is now not present).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-REF-03',
            codeReference: `🧭 Step 1: Identify the Refrigerator Type
Inspect only permanently installed refrigerators provided by the property
🔍 Step 2: Identification & Applicability
• 	Required: Every unit must have a functional refrigerator unless exempt (e.g., shared kitchen arrangement)
• 	Includes: Integrated freezer compartment, shelving, seals, and controls
🧪 Step 3: Functional Testing
• 	Cooling Test: Use thermometer to confirm: Refrigerator: 32–40°F and Freezer ≤32°F
• 	Door Seal Check: Close door on a piece of paper; it should resist easy removal
• 	Interior Inspection: Open all drawers and shelves; check for cracks or missing parts
• 	Light & Controls: Confirm interior light and temperature controls function properly
📏 Step 4: Accessibility & Local Requirements
• 	Clear floor space: ≥30″ x 48″ in front of refrigerator for wheelchair access
• 	Control labeling: Must be legible and operable without fine motor skills
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC E3901.5: Electrical outlets must be grounded and safely positioned
• 	IRC R306.2: Kitchens must include a sink, cooking appliance, and food storage (refrigerator)`
        }
    ]
};

export const KITCHEN_SINK: InsideSubcategory = {
    name: 'Sink',
    deficiencies: [
        {
            id: 'kit_sink_1',
            name: 'Hot and cold water cannot be activated or deactivated.',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-SINK-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a kitchen sink permanently installed and functionally adequate
• 	NSPIRE Definition: A basin with hardware designed to dispense and hold clean water and discharge wastewater
• 	Includes: Basin, faucet, handles, drain, supply lines, valves, splash guard, and overflow
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings under sink and around basin
• 	IBU Overlay: May require sealed cabinetry, mold-resistant finishes, or pest-proof plumbing penetrations
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill basin and observe drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
📏 Step 4: Accessibility & Local Requirements
• 	Knee clearance: Required under sink in accessible units
• 	Handle type: Lever-style preferred for residents with limited dexterity
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback
⚒️ Step 5: IRC Plumbing & Installation Requirements
• 	IRC P3201–P3202: Sink must have a trap and vent to prevent sewer gas
• 	IRC P2706.1: Drainage must be smooth and leak-free`
        },
        {
            id: 'kit_sink_2',
            name: 'The sink garbage disposal or other component is damaged or missing, and the sink is not functionally adequate.',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-SINK-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a kitchen sink permanently installed and functionally adequate
• 	NSPIRE Definition: A basin with hardware designed to dispense and hold clean water and discharge wastewater
• 	Includes: Basin, faucet, handles, drain, supply lines, valves, splash guard, and overflow
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings under sink and around basin
• 	IBU Overlay: May require sealed cabinetry, mold-resistant finishes, or pest-proof plumbing penetrations
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill basin and observe drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
📏 Step 4: Accessibility & Local Requirements
• 	Knee clearance: Required under sink in accessible units
• 	Handle type: Lever-style preferred for residents with limited dexterity
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback
⚒️ Step 5: IRC Plumbing & Installation Requirements
• 	IRC P3201–P3202: Sink must have a trap and vent to prevent sewer gas
• 	IRC P2706.1: Drainage must be smooth and leak-free`
        },
        {
            id: 'kit_sink_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-SINK-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a kitchen sink permanently installed and functionally adequate
• 	NSPIRE Definition: A basin with hardware designed to dispense and hold clean water and discharge wastewater
• 	Includes: Basin, faucet, handles, drain, supply lines, valves, splash guard, and overflow
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings under sink and around basin
• 	IBU Overlay: May require sealed cabinetry, mold-resistant finishes, or pest-proof plumbing penetrations
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill basin and observe drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
📏 Step 4: Accessibility & Local Requirements
• 	Knee clearance: Required under sink in accessible units
• 	Handle type: Lever-style preferred for residents with limited dexterity
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback
⚒️ Step 5: IRC Plumbing & Installation Requirements
• 	IRC P3201–P3202: Sink must have a trap and vent to prevent sewer gas
• 	IRC P2706.1: Drainage must be smooth and leak-free`
        },
        {
            id: 'kit_sink_4',
            name: 'Sink is missing or not installed within the primary kitchen.',
            detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
            criteria: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-SINK-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a kitchen sink permanently installed and functionally adequate
• 	NSPIRE Definition: A basin with hardware designed to dispense and hold clean water and discharge wastewater
• 	Includes: Basin, faucet, handles, drain, supply lines, valves, splash guard, and overflow
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings under sink and around basin
• 	IBU Overlay: May require sealed cabinetry, mold-resistant finishes, or pest-proof plumbing penetrations
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill basin and observe drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
📏 Step 4: Accessibility & Local Requirements
• 	Knee clearance: Required under sink in accessible units
• 	Handle type: Lever-style preferred for residents with limited dexterity
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback
⚒️ Step 5: IRC Plumbing & Installation Requirements
• 	IRC P3201–P3202: Sink must have a trap and vent to prevent sewer gas
• 	IRC P2706.1: Drainage must be smooth and leak-free`
        },
        {
            id: 'kit_sink_5',
            name: 'The sink is not draining, not functioning adequately.',
            detail: 'Water is not draining from the basin of the sink. slow or clogged drain.',
            criteria: 'Water is not draining from the basin of the sink. slow or clogged drain.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-SINK-05',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a kitchen sink permanently installed and functionally adequate
• 	NSPIRE Definition: A basin with hardware designed to dispense and hold clean water and discharge wastewater
• 	Includes: Basin, faucet, handles, drain, supply lines, valves, splash guard, and overflow
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings under sink and around basin
• 	IBU Overlay: May require sealed cabinetry, mold-resistant finishes, or pest-proof plumbing penetrations
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill basin and observe drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
📏 Step 4: Accessibility & Local Requirements
• 	Knee clearance: Required under sink in accessible units
• 	Handle type: Lever-style preferred for residents with limited dexterity
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback
⚒️ Step 5: IRC Plumbing & Installation Requirements
• 	IRC P3201–P3202: Sink must have a trap and vent to prevent sewer gas
• 	IRC P2706.1: Drainage must be smooth and leak-free`
        },
        {
            id: 'kit_sink_6',
            name: 'The dishwasher or other Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'KIT-SINK-06',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a kitchen sink permanently installed and functionally adequate
• 	NSPIRE Definition: A basin with hardware designed to dispense and hold clean water and discharge wastewater
• 	Includes: Basin, faucet, handles, drain, supply lines, valves, splash guard, and overflow
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings under sink and around basin
• 	IBU Overlay: May require sealed cabinetry, mold-resistant finishes, or pest-proof plumbing penetrations
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill basin and observe drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
📏 Step 4: Accessibility & Local Requirements
• 	Knee clearance: Required under sink in accessible units
• 	Handle type: Lever-style preferred for residents with limited dexterity
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback
⚒️ Step 5: IRC Plumbing & Installation Requirements
• 	IRC P3201–P3202: Sink must have a trap and vent to prevent sewer gas
• 	IRC P2706.1: Drainage must be smooth and leak-free`
        },
        {
            id: 'kit_sink_7',
            name: 'Water is directed outside of the basin.',
            detail: 'When in use, water is directed outside of the basin.',
            criteria: 'When in use, water is directed outside of the basin.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'KIT-SINK-07',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Every unit must have a kitchen sink permanently installed and functionally adequate
• 	NSPIRE Definition: A basin with hardware designed to dispense and hold clean water and discharge wastewater
• 	Includes: Basin, faucet, handles, drain, supply lines, valves, splash guard, and overflow
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings under sink and around basin
• 	IBU Overlay: May require sealed cabinetry, mold-resistant finishes, or pest-proof plumbing penetrations
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill basin and observe drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
📏 Step 4: Accessibility & Local Requirements
• 	Knee clearance: Required under sink in accessible units
• 	Handle type: Lever-style preferred for residents with limited dexterity
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback
⚒️ Step 5: IRC Plumbing & Installation Requirements
• 	IRC P3201–P3202: Sink must have a trap and vent to prevent sewer gas
• 	IRC P2706.1: Drainage must be smooth and leak-free`
        }
    ]
};

export const KITCHEN_VENTILATION: InsideSubcategory = {
    name: 'Ventilation',
    deficiencies: [
        {
            id: 'kit_vent_1',
            name: 'The kitchen does not have ventilation, not present and operable.',
            detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-VENT-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required if installed: Kitchen ventilation systems must be inspected if present
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease buildup on the hood, filter, and surrounding surfaces
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Switch test: Activate fan via wall switch or hood control
• 	Audible check: Confirm motor engages and airflow is present
• 	Airflow test: Use tissue or smoke to verify suction at intake
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Mechanical Requirements
• 	IRC M1503.3: Kitchen exhaust systems must discharge outdoors
• 	IRC M1502.4: Ducts must be smooth, securely fastened, and terminate outside
• 	IRC M1505.1`
        },
        {
            id: 'kit_vent_2',
            name: 'Exhaust system component is damaged or missing.',
            detail: 'Exhaust system component is damaged. Or exhaust system component is missing.',
            criteria: 'Exhaust system component is damaged. Or exhaust system component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-VENT-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required if installed: Kitchen ventilation systems must be inspected if present
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease buildup on the hood, filter, and surrounding surfaces
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Switch test: Activate fan via wall switch or hood control
• 	Audible check: Confirm motor engages and airflow is present
• 	Airflow test: Use tissue or smoke to verify suction at intake
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Mechanical Requirements
• 	IRC M1503.3: Kitchen exhaust systems must discharge outdoors
• 	IRC M1502.4: Ducts must be smooth, securely fastened, and terminate outside
• 	IRC M1505.1`
        },
        {
            id: 'kit_vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust vent inoperable.',
            criteria: 'Exhaust vent inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-VENT-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required if installed: Kitchen ventilation systems must be inspected if present
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease buildup on the hood, filter, and surrounding surfaces
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Switch test: Activate fan via wall switch or hood control
• 	Audible check: Confirm motor engages and airflow is present
• 	Airflow test: Use tissue or smoke to verify suction at intake
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Mechanical Requirements
• 	IRC M1503.3: Kitchen exhaust systems must discharge outdoors
• 	IRC M1502.4: Ducts must be smooth, securely fastened, and terminate outside
• 	IRC M1505.1`
        },
        {
            id: 'kit_vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system is blocked such that airflow may be restricted.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KIT-VENT-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required if installed: Kitchen ventilation systems must be inspected if present
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease buildup on the hood, filter, and surrounding surfaces
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Switch test: Activate fan via wall switch or hood control
• 	Audible check: Confirm motor engages and airflow is present
• 	Airflow test: Use tissue or smoke to verify suction at intake
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF for ADA compliance
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Mechanical Requirements
• 	IRC M1503.3: Kitchen exhaust systems must discharge outdoors
• 	IRC M1502.4: Ducts must be smooth, securely fastened, and terminate outside
• 	IRC M1505.1`
        }
    ]
};

export const KITCHEN_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Kitchen',
    subcategories: [
        KITCHEN_CABINET,
        KITCHEN_COOKING,
        KITCHEN_FOOD_PREP,
        KITCHEN_MOLD,
        KITCHEN_REFRIGERATOR,
        KITCHEN_SINK,
        KITCHEN_VENTILATION
    ]
};

// ==========================================
// 18. LEAK – GAS OR OIL
// ==========================================
export const LEAK_GAS_OIL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'LEAK – Gas or Oil',
    deficiencies: [
        {
            id: 'leak_gas_1',
            name: 'Natural gas, propane, or oil leak.',
            detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
            criteria: 'Natural gas, propane, or oil leak. strong odor.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'LEAK-GAS-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All fuel-fired appliances and associated piping inside the unit
• 	Includes: Gas stoves, furnaces, water heaters, fireplaces, and fuel supply lines
• 	NSPIRE Scope: Focuses on leaks, uncapped lines, and unsafe fuel conditions
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for fuel pooling or residue near appliances or tanks
• 	Inspect for soot or burn marks indicating incomplete combustion
• 	Ventilation: Ensure fuel-burning appliances have proper exhaust and air intake
• 	IBU Overlay: May require sealed penetrations, carbon monoxide alarms, or fire-rated enclosures
🧪 Step 3: Leak Detection Procedure
• 	Visual inspection: Look for staining, corrosion, or residue near joints and valves
• 	Odor check: Smell for sulfur/rotten egg scent (mercaptan additive in natural gas)
• 	Touch-Free Confirmation: Do not touch or manipulate fuel lines or valves
📏 Step 4: Accessibility & Local Requirements
• 	Shutoff valve access: Must be reachable without tools or obstruction
• 	Labeling: Fuel lines and shutoffs must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible alerts in accessible units
• 	Mobility Hazards: Oil spills may create slip risks in accessible paths
⚒️ Step 5: IRC Fuel System Requirements
• 	IRC (2021) §G2412–G2417 – Fuel gas piping, leak testing, and appliance connections
• 	IRC G2420.5: Shutoff valves required within 6 feet of each appliance
• 	IRC P2801.6: Oil tanks must be protected from impact and corrosion`
        }
    ]
};

// ==========================================
// 19. LEAK-SEWAGE SYSTEM
// ==========================================
export const LEAK_SEWAGE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Leak-Sewage System (Clogged drain)(Missing drain cap)',
    deficiencies: [
        {
            id: 'leak_sew_1',
            name: 'Blocked sewage system.',
            detail: 'Wastewater is unable to drain resulting in sewer backup.',
            criteria: 'Blocked sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'LEAK-SEW-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All drain, waste, and vent (DWV) systems inside the unit
• 	Includes: Toilets, sinks, tubs, floor drains, cleanouts, sewer lines, and pump cover
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for biohazard contamination: Wastewater exposure, mold, or pest activity
• 	Check for cross-contamination: Leaks near food prep areas or HVAC intakes
• 	IBU Overlay: May require sealed flooring, antimicrobial treatments, or pest exclusion protocols
🧪 Step 3: Operability & Leak Detection
• 	Visual inspection: Look for pooling water, staining, or active drips near fixtures and piping
• 	Odor check: Foul sewage smell near drains or plumbing chases
• 	Fixture test: Run water in sinks, tubs, and flush toilets—observe for backup or overflow
• 	Inspect cleanout caps, risers, and exposed piping for damage or leaks
📏 Step 4: Accessibility & Local Requirements
• 	Cleanout access: Must be unobstructed and reachable without tools
• 	Labeling: Cleanouts and pump covers should be clearly marked
• 	IBU Overlay: May require compliant access panels, tactile indicators, or visual contrast in accessible units
⚒️ Step 5: IRC Plumbing & Drainage Requirements
• 	IRC P3001–P3005: Drainage systems must be leak-free, properly vented, and connected to an approved sewer
• 	IRC P2601.2: All plumbing systems must be maintained in a sanitary condition`
        },
        {
            id: 'leak_sew_2',
            name: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
            detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Cap to the cleanout or pump cover is detached or missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-SEW-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All drain, waste, and vent (DWV) systems inside the unit
• 	Includes: Toilets, sinks, tubs, floor drains, cleanouts, sewer lines, and pump cover
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for biohazard contamination: Wastewater exposure, mold, or pest activity
• 	Check for cross-contamination: Leaks near food prep areas or HVAC intakes
• 	IBU Overlay: May require sealed flooring, antimicrobial treatments, or pest exclusion protocols
🧪 Step 3: Operability & Leak Detection
• 	Visual inspection: Look for pooling water, staining, or active drips near fixtures and piping
• 	Odor check: Foul sewage smell near drains or plumbing chases
• 	Fixture test: Run water in sinks, tubs, and flush toilets—observe for backup or overflow
• 	Inspect cleanout caps, risers, and exposed piping for damage or leaks
📏 Step 4: Accessibility & Local Requirements
• 	Cleanout access: Must be unobstructed and reachable without tools
• 	Labeling: Cleanouts and pump covers should be clearly marked
• 	IBU Overlay: May require compliant access panels, tactile indicators, or visual contrast in accessible units
⚒️ Step 5: IRC Plumbing & Drainage Requirements
• 	IRC P3001–P3005: Drainage systems must be leak-free, properly vented, and connected to an approved sewer
• 	IRC P2601.2: All plumbing systems must be maintained in a sanitary condition`
        },
        {
            id: 'leak_sew_3',
            name: 'Cleanout cap or riser is damaged.',
            detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
            criteria: 'Protective cap or riser is damaged.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-SEW-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All drain, waste, and vent (DWV) systems inside the unit
• 	Includes: Toilets, sinks, tubs, floor drains, cleanouts, sewer lines, and pump cover
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for biohazard contamination: Wastewater exposure, mold, or pest activity
• 	Check for cross-contamination: Leaks near food prep areas or HVAC intakes
• 	IBU Overlay: May require sealed flooring, antimicrobial treatments, or pest exclusion protocols
🧪 Step 3: Operability & Leak Detection
• 	Visual inspection: Look for pooling water, staining, or active drips near fixtures and piping
• 	Odor check: Foul sewage smell near drains or plumbing chases
• 	Fixture test: Run water in sinks, tubs, and flush toilets—observe for backup or overflow
• 	Inspect cleanout caps, risers, and exposed piping for damage or leaks
📏 Step 4: Accessibility & Local Requirements
• 	Cleanout access: Must be unobstructed and reachable without tools
• 	Labeling: Cleanouts and pump covers should be clearly marked
• 	IBU Overlay: May require compliant access panels, tactile indicators, or visual contrast in accessible units
⚒️ Step 5: IRC Plumbing & Drainage Requirements
• 	IRC P3001–P3005: Drainage systems must be leak-free, properly vented, and connected to an approved sewer
• 	IRC P2601.2: All plumbing systems must be maintained in a sanitary condition`
        },
        {
            id: 'leak_sew_4',
            name: 'Leak in sewage system.',
            detail: 'There is evidence of a sewer line or fitting leaking.',
            criteria: 'Leak in sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'LEAK-SEW-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All drain, waste, and vent (DWV) systems inside the unit
• 	Includes: Toilets, sinks, tubs, floor drains, cleanouts, sewer lines, and pump cover
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for biohazard contamination: Wastewater exposure, mold, or pest activity
• 	Check for cross-contamination: Leaks near food prep areas or HVAC intakes
• 	IBU Overlay: May require sealed flooring, antimicrobial treatments, or pest exclusion protocols
🧪 Step 3: Operability & Leak Detection
• 	Visual inspection: Look for pooling water, staining, or active drips near fixtures and piping
• 	Odor check: Foul sewage smell near drains or plumbing chases
• 	Fixture test: Run water in sinks, tubs, and flush toilets—observe for backup or overflow
• 	Inspect cleanout caps, risers, and exposed piping for damage or leaks
📏 Step 4: Accessibility & Local Requirements
• 	Cleanout access: Must be unobstructed and reachable without tools
• 	Labeling: Cleanouts and pump covers should be clearly marked
• 	IBU Overlay: May require compliant access panels, tactile indicators, or visual contrast in accessible units
⚒️ Step 5: IRC Plumbing & Drainage Requirements
• 	IRC P3001–P3005: Drainage systems must be leak-free, properly vented, and connected to an approved sewer
• 	IRC P2601.2: All plumbing systems must be maintained in a sanitary condition`
        }
    ]
};

// ==========================================
// 20. LEAK-WATER (PLUMBING LEAK)
// ==========================================
export const LEAK_WATER_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Leak- Water (plumbing leak)',
    deficiencies: [
        {
            id: 'leak_water_1',
            name: 'Environmental water intrusion.',
            detail: 'Water from the exterior environment is leaking into the interior.',
            criteria: 'Environmental water intrusion.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-WATER-01'
        },
        {
            id: 'leak_water_2',
            name: 'Fluid is leaking from the sprinkler assembly.',
            detail: 'Fluid is leaking from the sprinkler assembly.',
            criteria: 'Fluid is leaking from the sprinkler assembly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-WATER-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All water-bearing systems and surfaces inside the unit
• 	Includes: Supply lines, drainpipes, fixtures, appliances, ceilings, walls, floors, and sprinkler assemblies
• 	Leak types: Environmental intrusion, Plumbing leaks, Sprinkler system leaks
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest activity around leak sites
• 	Check for biohazard exposure if the leak involves wastewater or cross-contamination
• 	IBU Overlay: May require antimicrobial treatments, sealed finishes, or pest-proof repairs
🧪 Step 3: Leak Detection Procedure
• 	Visual inspection: Look for discoloration, pooling, or warped surfaces
• 	Touch test: Feel for moisture around suspect areas (walls, under sinks, behind appliances)
• 	Odor check: Musty smells may indicate hidden leaks or mold
• 	Resident inquiry: Ask if the leak was previously active or repaired
• 	Confirm if leaks have occurred recently, even if dry during inspection
📏 Step 4: Accessibility & Local Requirements
• 	Leak location: Must be reachable for inspection without disassembly
• 	Cleanout access: Required for plumbing leaks
• 	IBU Overlay: May require ADA-compliant access panels, tactile indicators, or visual contrast in accessible units
⚒️ Step 5: IRC Plumbing & Moisture Control Requirements
• 	IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• 	IRC R703.1: Exterior walls must prevent water intrusion`
        },
        {
            id: 'leak_water_3',
            name: 'Plumbing leak.',
            detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
            criteria: 'Plumbing leak.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-WATER-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All water-bearing systems and surfaces inside the unit
• 	Includes: Supply lines, drainpipes, fixtures, appliances, ceilings, walls, floors, and sprinkler assemblies
• 	Leak types: Environmental intrusion, Plumbing leaks, Sprinkler system leaks
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest activity around leak sites
• 	Check for biohazard exposure if the leak involves wastewater or cross-contamination
• 	IBU Overlay: May require antimicrobial treatments, sealed finishes, or pest-proof repairs
🧪 Step 3: Leak Detection Procedure
• 	Visual inspection: Look for discoloration, pooling, or warped surfaces
• 	Touch test: Feel for moisture around suspect areas (walls, under sinks, behind appliances)
• 	Odor check: Musty smells may indicate hidden leaks or mold
• 	Resident inquiry: Ask if the leak was previously active or repaired
• 	Confirm if leaks have occurred recently, even if dry during inspection
📏 Step 4: Accessibility & Local Requirements
• 	Leak location: Must be reachable for inspection without disassembly
• 	Cleanout access: Required for plumbing leaks
• 	IBU Overlay: May require ADA-compliant access panels, tactile indicators, or visual contrast in accessible units
⚒️ Step 5: IRC Plumbing & Moisture Control Requirements
• 	IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• 	IRC R703.1: Exterior walls must prevent water intrusion`
        }
    ]
};

// ==========================================
// 21. LIGHTING
// ==========================================
export const LIGHTING_INTERIOR: InsideSubcategory = {
    name: 'Lighting - Interior',
    deficiencies: [
        {
            id: 'light_int_1',
            name: 'A permanently installed light fixture is inoperable.',
            detail: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
            criteria: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-INT-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Permanently installed light fixtures must be present and functional in all habitable rooms, kitchens, and bathrooms
🔍 Step 2: Visual Inspection
• 	Look for missing covers, exposed wires, or damaged components
🧪 Step 3: Functional Testing
• 	Switch test: Activate each wall-mounted switch—confirm fixture responds
• 	Bulb test: Verify all bulbs illuminate thoroughly and evenly
• 	Stability Check: Check fixture mounting for looseness or detachment
📏 Step 4: Accessibility & Local Requirements
• 	Switch height: ≤48″ AFF for ADA compliance
• 	Lighting level: Must support safe navigation and task performance
• 	Control labeling: Switches must be clearly marked and operable without fine motor skills
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Electrical & Lighting Requirements
• 	IRC (2021) §R303.1–R303.3 – Natural and artificial lighting requirement
• 	IRC E3905.8: Fixtures must be securely mounted and enclosed
• 	IRC E3901.10: Lighting must be sufficient for safe use of the space`
        },
        {
            id: 'light_int_2',
            name: 'A permanently installed light fixture is not secure.',
            detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
            criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-INT-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Permanently installed light fixtures must be present and functional in all habitable rooms, kitchens, and bathrooms
🔍 Step 2: Visual Inspection
• 	Look for missing covers, exposed wires, or damaged components
🧪 Step 3: Functional Testing
• 	Switch test: Activate each wall-mounted switch—confirm fixture responds
• 	Bulb test: Verify all bulbs illuminate thoroughly and evenly
• 	Stability Check: Check fixture mounting for looseness or detachment
📏 Step 4: Accessibility & Local Requirements
• 	Switch height: ≤48″ AFF for ADA compliance
• 	Lighting level: Must support safe navigation and task performance
• 	Control labeling: Switches must be clearly marked and operable without fine motor skills
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Electrical & Lighting Requirements
• 	IRC (2021) §R303.1–R303.3 – Natural and artificial lighting requirement
• 	IRC E3905.8: Fixtures must be securely mounted and enclosed
• 	IRC E3901.10: Lighting must be sufficient for safe use of the space`
        },
        {
            id: 'light_int_3',
            name: 'At least one (1) permanently installed light fixture is not present in the kitchen or bathroom.',
            detail: 'At least one (1) permanently installed light fixture is not present in the kitchen and bathroom.',
            criteria: 'At least one (1) permanently installed light fixture is not present in the kitchen and bathroom.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-INT-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Permanently installed light fixtures must be present and functional in all habitable rooms, kitchens, and bathrooms
🔍 Step 2: Visual Inspection
• 	Look for missing covers, exposed wires, or damaged components
🧪 Step 3: Functional Testing
• 	Switch test: Activate each wall-mounted switch—confirm fixture responds
• 	Bulb test: Verify all bulbs illuminate thoroughly and evenly
• 	Stability Check: Check fixture mounting for looseness or detachment
📏 Step 4: Accessibility & Local Requirements
• 	Switch height: ≤48″ AFF for ADA compliance
• 	Lighting level: Must support safe navigation and task performance
• 	Control labeling: Switches must be clearly marked and operable without fine motor skills
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Electrical & Lighting Requirements
• 	IRC (2021) §R303.1–R303.3 – Natural and artificial lighting requirement
• 	IRC E3905.8: Fixtures must be securely mounted and enclosed
• 	IRC E3901.10: Lighting must be sufficient for safe use of the space`
        }
    ]
};

export const LIGHTING_MINIMUM_ELECTRICAL: InsideSubcategory = {
    name: 'Minimum Electrical and Lighting',
    deficiencies: [
        {
            id: 'light_min_1',
            name: 'At least two (2) working outlets are not present within each habitable room. OR at least one (1) working outlet and one (1) permanently installed light fixture is not present within each habitable room.',
            detail: 'At least two (2) working outlets are absent within each habitable room. Or at least one (1) working outlet and one (1) permanently installed light fixture not present within each habitable room.',
            criteria: 'At least two (2) working outlets are absent within each habitable room. Or at least one (1) working outlet and one (1) permanently installed light fixture not present within each habitable room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-MIN-01',
            codeReference: `🧭 Step 1: Identify Habitable Rooms
- Include: Living rooms, bedrooms, dining areas, kitchens
- Exclude: Bathrooms, closets, hallways, storage, utility spaces
NSPIRE defines habitable rooms as those used for living, sleeping, eating, or cooking
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for soot, burn marks, or melted plastic on outlets or fixtures
• 	Check for mold, rust, or pest activity around electrical boxes
• 	IBU Overlay: May require sealed faceplates, moisture-rated fixtures, or pest-proof junction boxes
🧪 Step 3: Functional Testing
- Outlet Test: Use a UL-listed outlet tester to confirm power, polarity, and grounding
- Light Fixture Test: Turn on the switch and confirm the fixture illuminates
- Replace bulb if needed to verify fixture functionality
- Check Mounting: Ensure fixture is securely attached to the wall or ceiling
📏 Step 4: Accessibility & Local Requirements
• 	Height: Outlets ≥15″ AFF; switches ≤48″ AFF for ADA compliance
• 	Reachability: Must be unobstructed by furniture or fixed cabinetry
• 	Labeling: Multi-gang switches should be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Electrical Requirements
- IRC E3901.2.1: Outlets required in all habitable rooms, spaced ≤12 feet apart
- IRC E3903.2: Lighting outlets required in kitchens, bathrooms, hallways, stairways, and utility rooms
- IRC E3901.6: No outlets allowed within bathtubs or shower spaces`
        }
    ]
};

export const LIGHTING_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Lighting',
    subcategories: [
        LIGHTING_INTERIOR,
        LIGHTING_MINIMUM_ELECTRICAL
    ]
};

// ==========================================
// 22. MOLD-LIKE SUBSTANCE
// ==========================================
export const MOLD_LIKE_SUBSTANCE: InsideSubcategory = {
    name: 'Mold - Like Substance',
    deficiencies: [
        {
            id: 'mold_1',
            name: 'Peeling Paint-Elevated moisture level.',
            detail: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'MOLD-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All interior surfaces—walls, ceilings, floors, cabinetry, HVAC registers, closets, and behind appliances
🔍 Step 2: Visual & Area-Based Assessment
• 	Visual confirmation required: Odor alone is not sufficient
• 	Visual Scan: Use a flashlight to inspect corners, ceilings, behind furniture, and inside cabinets
🧪 Step 3: Inspection Technique
• 	Estimate Surface Area: Measure or approximate the total affected area per room
• 	Moisture Source Check: Look for leaks, condensation, or poor ventilation
• 	Resident Confirmation: If possible, ask if the mold-like substance has been cleaned recently or if leaks have occurred
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual and reachable without disassembly
• 	Surface contrast: Mold must be distinguishable from the background color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion
• 	IRC R703.1: Exterior walls must prevent water intrusion`
        },
        {
            id: 'mold_2',
            name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than 9 square feet in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'MOLD-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All interior surfaces—walls, ceilings, floors, cabinetry, HVAC registers, closets, and behind appliances
🔍 Step 2: Visual & Area-Based Assessment
• 	Visual confirmation required: Odor alone is not sufficient
• 	Visual Scan: Use a flashlight to inspect corners, ceilings, behind furniture, and inside cabinets
🧪 Step 3: Inspection Technique
• 	Estimate Surface Area: Measure or approximate the total affected area per room
• 	Moisture Source Check: Look for leaks, condensation, or poor ventilation
• 	Resident Confirmation: If possible, ask if the mold-like substance has been cleaned recently or if leaks have occurred
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual and reachable without disassembly
• 	Surface contrast: Mold must be distinguishable from the background color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion
• 	IRC R703.1: Exterior walls must prevent water intrusion`
        },
        {
            id: 'mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'MOLD-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All interior surfaces—walls, ceilings, floors, cabinetry, HVAC registers, closets, and behind appliances
🔍 Step 2: Visual & Area-Based Assessment
• 	Visual confirmation required: Odor alone is not sufficient
• 	Visual Scan: Use a flashlight to inspect corners, ceilings, behind furniture, and inside cabinets
🧪 Step 3: Inspection Technique
• 	Estimate Surface Area: Measure or approximate the total affected area per room
• 	Moisture Source Check: Look for leaks, condensation, or poor ventilation
• 	Resident Confirmation: If possible, ask if the mold-like substance has been cleaned recently or if leaks have occurred
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual and reachable without disassembly
• 	Surface contrast: Mold must be distinguishable from the background color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion
• 	IRC R703.1: Exterior walls must prevent water intrusion`
        },
        {
            id: 'mold_4',
            name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'MOLD-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All interior surfaces—walls, ceilings, floors, cabinetry, HVAC registers, closets, and behind appliances
🔍 Step 2: Visual & Area-Based Assessment
• 	Visual confirmation required: Odor alone is not sufficient
• 	Visual Scan: Use a flashlight to inspect corners, ceilings, behind furniture, and inside cabinets
🧪 Step 3: Inspection Technique
• 	Estimate Surface Area: Measure or approximate the total affected area per room
• 	Moisture Source Check: Look for leaks, condensation, or poor ventilation
• 	Resident Confirmation: If possible, ask if the mold-like substance has been cleaned recently or if leaks have occurred
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual and reachable without disassembly
• 	Surface contrast: Mold must be distinguishable from the background color
• 	IBU Overlay: May require visual contrast, tactile indicators, or multilingual signage in accessible units
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion
• 	IRC R703.1: Exterior walls must prevent water intrusion`
        }
    ]
};

export const MOLD_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Mold',
    subcategories: [
        MOLD_LIKE_SUBSTANCE
    ]
};

// ==========================================
// 23. PAINT (Lead-Based Paint or Deteriorated Paint)
// ==========================================
export const PAINT_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
    deficiencies: [
        {
            id: 'paint_1',
            name: 'Less than 2\'SF -paint in a unit or inside the target property is deteriorated – below the level required for lead - safe work practices by a lead certified firm or for passing clearance.',
            detail: 'Paint is deteriorated for large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
            criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'PAINT-01',
            codeReference: `🧭 Step 1: Determine Applicability
Lead-based paint (LBP) inspections apply to: Units built before 1978 (presumed to contain LBP unless tested)
If no certified inspection or risk assessment is available, NSPIRE assumes all painted surfaces in pre-1978 units may contain lead.
🔍 Step 2: Visual Condition Assessment
• 	Reachable surfaces: Focus on areas accessible to children and residents
🧪 Step 3: Inspection Technique
- Measure Affected Area: Estimate or measure deteriorated paint per surface or component
- Check Friction/Impact Zones: Inspect areas subject to rubbing or banging (e.g., door edges, window sashes)
NSPIRE does not require chemical testing—visual assessment is sufficient unless documentation proves otherwise.
📏 Step 4: Accessibility & Local Requirements
• 	Visual contrast: Deterioration must be distinguishable from surface color
• 	IBU Overlay: May require tactile warnings, multilingual signage, or compliant hazard notices
⚒️ Step 5: IRC Renovation & Safety Requirements
- EPA RRP Rule (Referenced by IRC): Renovations disturbing LBP must follow lead-safe work practices by certified firms
- IRC R703.1: Interior finishes must be securely bonded and free from hazardous deterioration
IRC supports safe maintenance and renovation practices to prevent lead exposure`
        },
        {
            id: 'paint_2',
            name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
            detail: 'Paint is deteriorated. For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
            criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'PAINT-02',
            codeReference: `🧭 Step 1: Determine Applicability
Lead-based paint (LBP) inspections apply to: Units built before 1978 (presumed to contain LBP unless tested)
If no certified inspection or risk assessment is available, NSPIRE assumes all painted surfaces in pre-1978 units may contain lead.
🔍 Step 2: Visual Condition Assessment
• 	Reachable surfaces: Focus on areas accessible to children and residents
🧪 Step 3: Inspection Technique
- Measure Affected Area: Estimate or measure deteriorated paint per surface or component
- Check Friction/Impact Zones: Inspect areas subject to rubbing or banging (e.g., door edges, window sashes)
NSPIRE does not require chemical testing—visual assessment is sufficient unless documentation proves otherwise.
📏 Step 4: Accessibility & Local Requirements
• 	Visual contrast: Deterioration must be distinguishable from surface color
• 	IBU Overlay: May require tactile warnings, multilingual signage, or compliant hazard notices
⚒️ Step 5: IRC Renovation & Safety Requirements
- EPA RRP Rule (Referenced by IRC): Renovations disturbing LBP must follow lead-safe work practices by certified firms
- IRC R703.1: Interior finishes must be securely bonded and free from hazardous deterioration
IRC supports safe maintenance and renovation practices to prevent lead exposure`
        }
    ]
};

// ==========================================
// 24. RAILINGS
// ==========================================
export const RAILINGS_GUARDRAIL: InsideSubcategory = {
    name: 'Guardrail',
    deficiencies: [
        {
            id: 'rail_guard_1',
            name: 'The guardrail is missing or not installed. Does limit the safe use.',
            detail: 'The guardrail is missing or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
            criteria: 'The guardrail is missing or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'RAILING-GUARD-01',
            codeReference: `🧭 Step 1: Identify Guardrail Locations
NSPIRE Scope: Evaluates the presence, structural adequacy, and safety of guardrails in all resident-accessible areas
🔍 Step 2: Identification & Applicability
• 	Required: Guardrails must be present on any walking surface ≥30 inches above grade or floor below
• 	Applies to: Interior stairs, landings, lofts, and mezzanines, Balconies, decks, ramps, and elevated corridors
🧪 Step 3: Functional Adequacy
• 	Height check: Measure from walking surface to top of rail—must be ≥36″ (IRC)
• 	Spacing check: Openings between balusters must be ≤4″ to prevent child entrapment
• 	Stability test: Apply light pressure—guardrail should not flex or shift
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Graspability: Rails must be easily grasped for support
• 	Clear Floor Space: No obstructions in accessible paths near guardrails
• 	IBU Overlay: May require tactile warnings, compliant grip profiles, or extended rail ends
⚒️ Step 5: IRC Structural Requirements
• 	IRC R312.1: Guardrails required on open-sided walking surfaces >30″ above grade
• 	IRC R312.1.2–1.3: Minimum height: 36″ and Maximum opening: 4″ between balusters`
        },
        {
            id: 'rail_guard_2',
            name: 'Guard rail component, missing, damaged. Does not limit the safe use. The guardrail is functionally adequate.',
            detail: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to reasonably prevent fall hazards.',
            criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to reasonably prevent fall hazards.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'RAILING-GUARD-02',
            codeReference: `🧭 Step 1: Identify Guardrail Locations
NSPIRE Scope: Evaluates the presence, structural adequacy, and safety of guardrails in all resident-accessible areas
🔍 Step 2: Identification & Applicability
• 	Required: Guardrails must be present on any walking surface ≥30 inches above grade or floor below
• 	Applies to: Interior stairs, landings, lofts, and mezzanines, Balconies, decks, ramps, and elevated corridors
🧪 Step 3: Functional Adequacy
• 	Height check: Measure from walking surface to top of rail—must be ≥36″ (IRC)
• 	Spacing check: Openings between balusters must be ≤4″ to prevent child entrapment
• 	Stability test: Apply light pressure—guardrail should not flex or shift
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Graspability: Rails must be easily grasped for support
• 	Clear Floor Space: No obstructions in accessible paths near guardrails
• 	IBU Overlay: May require tactile warnings, compliant grip profiles, or extended rail ends
⚒️ Step 5: IRC Structural Requirements
• 	IRC R312.1: Guardrails required on open-sided walking surfaces >30″ above grade
• 	IRC R312.1.2–1.3: Minimum height: 36″ and Maximum opening: 4″ between balusters`
        }
    ]
};

export const RAILINGS_HANDRAIL: InsideSubcategory = {
    name: 'Handrail',
    deficiencies: [
        {
            id: 'rail_hand_1',
            name: 'Handrail is not functionally adequate.',
            detail: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches.',
            criteria: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RAILING-HAND-01',
            codeReference: `🧭 Step 1: Identify Locations Where Handrails Apply:
• 	Interior stairs, ramps, and corridors
🔍 Step 2: Identification & Applicability
• 	Required: On stairways with 4 or more risers; On ramps with rise >6 inches or horizontal run >72 inches
🧪 Step 3: Functional Testing
• 	Stability Check: Apply moderate force to confirm rail is firmly anchored
• 	Length Check: Ensure rail runs continuously from first to last riser or ramp edge
• 	Height Measurement: Measure from walking surface to top of rail (must be 28″–42″)
• 	Graspability Test: Confirm rail shape allows full hand grip (e.g., round or oval profile)
📏 Step 4: Accessibility & Local Requirements
• 	Height compliance: 34–38″ AFF for ADA handrails (CBC §1014.2)
• 	Visual contrast: Rail should be distinguishable from surroundings for low-vision residents
• 	Grip profile: Circular or rounded preferred; 1¼″–2″ diameter
• 	IBU Overlay: May require tactile indicators, extended rail ends, or dual handrails on ramps
⚒️ Step 5: IRC Structural Requirements
• 	IRC R311.7.8: Handrails required on one side of stairs with 4+ risers
• 	IRC R311.7.8.1–8.3: Height: 34″–38″, Graspable shape required, Ends must return to the wall or terminate safely`
        },
        {
            id: 'rail_hand_2',
            name: 'Handrail is not installed where required.',
            detail: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            criteria: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.4/n',
            code: 'RAILING-HAND-02',
            codeReference: `🧭 Step 1: Identify Locations Where Handrails Apply:
• 	Interior stairs, ramps, and corridors
🔍 Step 2: Identification & Applicability
• 	Required: On stairways with 4 or more risers; On ramps with rise >6 inches or horizontal run >72 inches
🧪 Step 3: Functional Testing
• 	Stability Check: Apply moderate force to confirm rail is firmly anchored
• 	Length Check: Ensure rail runs continuously from first to last riser or ramp edge
• 	Height Measurement: Measure from walking surface to top of rail (must be 28″–42″)
• 	Graspability Test: Confirm rail shape allows full hand grip (e.g., round or oval profile)
📏 Step 4: Accessibility & Local Requirements
• 	Height compliance: 34–38″ AFF for ADA handrails (CBC §1014.2)
• 	Visual contrast: Rail should be distinguishable from surroundings for low-vision residents
• 	Grip profile: Circular or rounded preferred; 1¼″–2″ diameter
• 	IBU Overlay: May require tactile indicators, extended rail ends, or dual handrails on ramps
⚒️ Step 5: IRC Structural Requirements
• 	IRC R311.7.8: Handrails required on one side of stairs with 4+ risers
• 	IRC R311.7.8.1–8.3: Height: 34″–38″, Graspable shape required, Ends must return to the wall or terminate safely`
        },
        {
            id: 'rail_hand_3',
            name: 'Handrail is not secured.',
            detail: 'There is movement in the anchors of the handrail.',
            criteria: 'There is movement in the anchors of the handrail.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RAILING-HAND-03',
            codeReference: `🧭 Step 1: Identify Locations Where Handrails Apply:
• 	Interior stairs, ramps, and corridors
🔍 Step 2: Identification & Applicability
• 	Required: On stairways with 4 or more risers; On ramps with rise >6 inches or horizontal run >72 inches
🧪 Step 3: Functional Testing
• 	Stability Check: Apply moderate force to confirm rail is firmly anchored
• 	Length Check: Ensure rail runs continuously from first to last riser or ramp edge
• 	Height Measurement: Measure from walking surface to top of rail (must be 28″–42″)
• 	Graspability Test: Confirm rail shape allows full hand grip (e.g., round or oval profile)
📏 Step 4: Accessibility & Local Requirements
• 	Height compliance: 34–38″ AFF for ADA handrails (CBC §1014.2)
• 	Visual contrast: Rail should be distinguishable from surroundings for low-vision residents
• 	Grip profile: Circular or rounded preferred; 1¼″–2″ diameter
• 	IBU Overlay: May require tactile indicators, extended rail ends, or dual handrails on ramps
⚒️ Step 5: IRC Structural Requirements
• 	IRC R311.7.8: Handrails required on one side of stairs with 4+ risers
• 	IRC R311.7.8.1–8.3: Height: 34″–38″, Graspable shape required, Ends must return to the wall or terminate safely`
        }
    ]
};

export const RAILINGS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Railings',
    subcategories: [RAILINGS_GUARDRAIL, RAILINGS_HANDRAIL]
};

// ==========================================
// 25. SINK (LAUNDRY, GARAGE, PATIO)
// ==========================================
export const SINK_LAUNDRY_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Sink (Laundry, Garage, or patio)',
    deficiencies: [
        {
            id: 'sink_laundry_1',
            name: 'Control Knobs.',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-01',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Auxiliary Sink Inspection – Laundry, Garage, or Patio
🔍 Step 2: Identification & Applicability
• 	Applies to: Utility sinks in laundry rooms, garages, patios, or service areas
• 	NSPIRE Scope: Only applies if sink is permanently installed and intended for resident use
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill the basin and observe the drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
• 	Gently press sink edges to detect movement or gaps
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Reach Range: Controls must be within 15″–48″ AFF
• 	Clear Floor Space: Minimum 30″x48″ in front of sink for wheelchair access
• 	Knee Clearance: If required, ≥30″ wide × 27″ high × 19″ deep under sink
⚒️ Step 5: Auxiliary Sink Inspection – Laundry, Garage, or Patio
Codes Referenced: IRC (2021) §P2701–P2706 – Plumbing fixture installation and drainage`
        },
        {
            id: 'sink_laundry_2',
            name: 'Component is missing.',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-02',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Auxiliary Sink Inspection – Laundry, Garage, or Patio
🔍 Step 2: Identification & Applicability
• 	Applies to: Utility sinks in laundry rooms, garages, patios, or service areas
• 	NSPIRE Scope: Only applies if sink is permanently installed and intended for resident use
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill the basin and observe the drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
• 	Gently press sink edges to detect movement or gaps
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Reach Range: Controls must be within 15″–48″ AFF
• 	Clear Floor Space: Minimum 30″x48″ in front of sink for wheelchair access
• 	Knee Clearance: If required, ≥30″ wide × 27″ high × 19″ deep under sink
⚒️ Step 5: Auxiliary Sink Inspection – Laundry, Garage, or Patio
Codes Referenced: IRC (2021) §P2701–P2706 – Plumbing fixture installation and drainage`
        },
        {
            id: 'sink_laundry_3',
            name: 'Improperly installed.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-03',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Auxiliary Sink Inspection – Laundry, Garage, or Patio
🔍 Step 2: Identification & Applicability
• 	Applies to: Utility sinks in laundry rooms, garages, patios, or service areas
• 	NSPIRE Scope: Only applies if sink is permanently installed and intended for resident use
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill the basin and observe the drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
• 	Gently press sink edges to detect movement or gaps
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Reach Range: Controls must be within 15″–48″ AFF
• 	Clear Floor Space: Minimum 30″x48″ in front of sink for wheelchair access
• 	Knee Clearance: If required, ≥30″ wide × 27″ high × 19″ deep under sink
⚒️ Step 5: Auxiliary Sink Inspection – Laundry, Garage, or Patio
Codes Referenced: IRC (2021) §P2701–P2706 – Plumbing fixture installation and drainage`
        },
        {
            id: 'sink_laundry_4',
            name: 'Sink is missing.',
            detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been).',
            criteria: 'not present or incomplete.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-04',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Auxiliary Sink Inspection – Laundry, Garage, or Patio
🔍 Step 2: Identification & Applicability
• 	Applies to: Utility sinks in laundry rooms, garages, patios, or service areas
• 	NSPIRE Scope: Only applies if sink is permanently installed and intended for resident use
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill the basin and observe the drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
• 	Gently press sink edges to detect movement or gaps
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Reach Range: Controls must be within 15″–48″ AFF
• 	Clear Floor Space: Minimum 30″x48″ in front of sink for wheelchair access
• 	Knee Clearance: If required, ≥30″ wide × 27″ high × 19″ deep under sink
⚒️ Step 5: Auxiliary Sink Inspection – Laundry, Garage, or Patio
Codes Referenced: IRC (2021) §P2701–P2706 – Plumbing fixture installation and drainage`
        },
        {
            id: 'sink_laundry_5',
            name: 'Sink not draining.',
            detail: 'Water is not draining from the basin of the sink.',
            criteria: 'Water is not draining from the basin of the sink.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-05',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Auxiliary Sink Inspection – Laundry, Garage, or Patio
🔍 Step 2: Identification & Applicability
• 	Applies to: Utility sinks in laundry rooms, garages, patios, or service areas
• 	NSPIRE Scope: Only applies if sink is permanently installed and intended for resident use
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill the basin and observe the drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
• 	Gently press sink edges to detect movement or gaps
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Reach Range: Controls must be within 15″–48″ AFF
• 	Clear Floor Space: Minimum 30″x48″ in front of sink for wheelchair access
• 	Knee Clearance: If required, ≥30″ wide × 27″ high × 19″ deep under sink
⚒️ Step 5: Auxiliary Sink Inspection – Laundry, Garage, or Patio
Codes Referenced: IRC (2021) §P2701–P2706 – Plumbing fixture installation and drainage`
        },
        {
            id: 'sink_laundry_6',
            name: 'Component is damaged.',
            detail: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'SINK-LAUNDRY-06',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Auxiliary Sink Inspection – Laundry, Garage, or Patio
🔍 Step 2: Identification & Applicability
• 	Applies to: Utility sinks in laundry rooms, garages, patios, or service areas
• 	NSPIRE Scope: Only applies if sink is permanently installed and intended for resident use
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill the basin and observe the drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
• 	Gently press sink edges to detect movement or gaps
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Reach Range: Controls must be within 15″–48″ AFF
• 	Clear Floor Space: Minimum 30″x48″ in front of sink for wheelchair access
• 	Knee Clearance: If required, ≥30″ wide × 27″ high × 19″ deep under sink
⚒️ Step 5: Auxiliary Sink Inspection – Laundry, Garage, or Patio
Codes Referenced: IRC (2021) §P2701–P2706 – Plumbing fixture installation and drainage`
        },
        {
            id: 'sink_laundry_7',
            name: 'Water pressure, direction.',
            detail: 'The sink\'s faucet water pressure and direction are not functional or adequate.',
            criteria: 'The sink\'s faucet water pressure and direction are not functional or adequate.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'SINK-LAUNDRY-07',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Auxiliary Sink Inspection – Laundry, Garage, or Patio
🔍 Step 2: Identification & Applicability
• 	Applies to: Utility sinks in laundry rooms, garages, patios, or service areas
• 	NSPIRE Scope: Only applies if sink is permanently installed and intended for resident use
🧪 Step 3: Operability Test
• 	Water test: Activate hot and cold water—verify flow, temperature, and shutoff
• 	Drain test: Fill the basin and observe the drainage speed and seal integrity
• 	Leak check: Inspect under sink for active leaks or water stains
• 	Gently press sink edges to detect movement or gaps
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Reach Range: Controls must be within 15″–48″ AFF
• 	Clear Floor Space: Minimum 30″x48″ in front of sink for wheelchair access
• 	Knee Clearance: If required, ≥30″ wide × 27″ high × 19″ deep under sink
⚒️ Step 5: Auxiliary Sink Inspection – Laundry, Garage, or Patio
Codes Referenced: IRC (2021) §P2701–P2706 – Plumbing fixture installation and drainage`
        }
    ]
};

// ==========================================
// 26. STEPS AND STAIRS
// ==========================================
export const STEPS_STAIRS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Steps and Stairs',
    deficiencies: [
        {
            id: 'steps_1',
            name: 'Stringer is damaged.',
            detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'Instability is detected while walking on the stair.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'STEPS-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Applies to all interior and exterior steps or stairways used for ingress/egress or circulation between levels
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for debris, spills, or obstructions that may cause slips or trips
• 	IBU Overlay: May require non-slip finishes, sealed surfaces, or pest-proof joints
🧪 Step 3: Functional Adequacy
• 	Walk test: Ascend and descend stairs—check for movement, flexing, or uneven steps
• 	Measure tread depth and riser height: Must be consistent across flight
• 	Check nosing: Should not protrude excessively or be damaged
📏 Step 4: Accessibility & Local Requirements
• 	Rise/run compliance: IRC max riser height = 7¾″; min tread depth = 10″
• 	Visual contrast: Tread edges should be distinguishable for low-vision residents
• 	Handrail integration: Required on stairs with ≥4 risers (see separate handrail guide)
• 	IBU Overlay: May require tactile warnings, compliant dimensions, or extended landings
⚒️ Step 5: IRC Structural Requirements
• 	IRC R311.7: Stairs must be structurally sound, with proper rise/run ratios`
        },
        {
            id: 'steps_2',
            name: 'Tread on a set of stairs damaged',
            detail: 'Tread on a set of stairs is missing (i.e., evidence or A portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
            criteria: 'Secure accessory treads are not present.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'STEPS-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: Applies to all interior and exterior steps or stairways used for ingress/egress or circulation between levels
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for debris, spills, or obstructions that may cause slips or trips
• 	IBU Overlay: May require non-slip finishes, sealed surfaces, or pest-proof joints
🧪 Step 3: Functional Adequacy
• 	Walk test: Ascend and descend stairs—check for movement, flexing, or uneven steps
• 	Measure tread depth and riser height: Must be consistent across flight
• 	Check nosing: Should not protrude excessively or be damaged
📏 Step 4: Accessibility & Local Requirements
• 	Rise/run compliance: IRC max riser height = 7¾″; min tread depth = 10″
• 	Visual contrast: Tread edges should be distinguishable for low-vision residents
• 	Handrail integration: Required on stairs with ≥4 risers (see separate handrail guide)
• 	IBU Overlay: May require tactile warnings, compliant dimensions, or extended landings
⚒️ Step 5: IRC Structural Requirements
• 	IRC R311.7: Stairs must be structurally sound, with proper rise/run ratios`
        }
    ]
};

// ==========================================
// 27. STRUCTURAL SYSTEM
// ==========================================
export const STRUCTURAL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Structural System',
    deficiencies: [
        {
            id: 'struct_1',
            name: 'Structural system exhibits signs of serious failure.',
            detail: 'Structural system exhibits signs of serious failure and may threaten the resident\'s safety.',
            criteria: 'Major Structural damage that effect resident\'s safety.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '.1/n',
            code: 'STRUCT-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All visible structural components within the unit, including:
• 	Walls, ceilings, floors, beams, columns, and roof framing
• 	Load-bearing partitions and visible foundation elements (e.g., slab edges)
• 	NSPIRE Scope: Focuses on observable structural damage, movement, or failure that compromises safety or habitability
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for water stains, rust, or efflorescence indicating moisture intrusion
• 	IBU Overlay: May require sealed penetrations, pest-proof framing, or mold-resistant materials
🧪 Step 3: Functional Adequacy
• 	Level check: Use a ball or a level to detect slope or uneven flooring
• 	Crack mapping: Document the location, length, and width of any cracks
• 	Movement test: Apply light pressure to suspect walls or floors—note flexing or vibration
📏 Step 4: Accessibility & Local Requirement (IBU)
• 	Mobility Hazards: Structural damage must not obstruct accessible paths
• 	Environmental Safety: Cracks or gaps must not allow pest intrusion or air/water infiltration
• 	Reach Zones: Structural hazards near switches, grab bars, or appliances may impair safe use
⚒️ Step 5: IRC Structural Requirements
• 	IRC R301.1: Structures must support all loads safely and resist collapse
• 	IRC R403–R407: Footings, foundations, posts, and beams must be properly sized and anchored`
        }
    ]
};

// ==========================================
// 28. VENTILATION (OTHER)
// ==========================================
export const VENTILATION_OTHER: InsideSubcategory = {
    name: 'Ventilation (with or without a fan).',
    deficiencies: [
        {
            id: 'vent_1',
            name: 'It is not functioning adequately.',
            detail: 'Effecting the unit.',
            criteria: 'Effecting the unit.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms, kitchens, and bathrooms must have adequate ventilation
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease, mold, or pest droppings on or around ventilation components
• 	Check for moisture buildup in bathrooms or kitchens due to poor airflow
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Fan test: Activate switch—confirm motor engages and airflow is present
• 	Airflow check: Use tissue or smoke to verify suction at intake
• 	Window Check: Confirm operability of windows in rooms without mechanical ventilation
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC (2021) §R303.3, §M1507 – Mechanical ventilation and natural airflow`
        },
        {
            id: 'vent_2',
            name: 'Exhaust system component is damaged or missing.',
            detail: 'Exhaust system component is damaged. Or exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Exhaust system component is damaged. Or exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms, kitchens, and bathrooms must have adequate ventilation
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease, mold, or pest droppings on or around ventilation components
• 	Check for moisture buildup in bathrooms or kitchens due to poor airflow
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Fan test: Activate switch—confirm motor engages and airflow is present
• 	Airflow check: Use tissue or smoke to verify suction at intake
• 	Window Check: Confirm operability of windows in rooms without mechanical ventilation
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC (2021) §R303.3, §M1507 – Mechanical ventilation and natural airflow`
        },
        {
            id: 'vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust fan, inoperable.',
            criteria: 'Exhaust fan, inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms, kitchens, and bathrooms must have adequate ventilation
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease, mold, or pest droppings on or around ventilation components
• 	Check for moisture buildup in bathrooms or kitchens due to poor airflow
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Fan test: Activate switch—confirm motor engages and airflow is present
• 	Airflow check: Use tissue or smoke to verify suction at intake
• 	Window Check: Confirm operability of windows in rooms without mechanical ventilation
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC (2021) §R303.3, §M1507 – Mechanical ventilation and natural airflow`
        },
        {
            id: 'vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system is blocked such that airflow may be restricted.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms, kitchens, and bathrooms must have adequate ventilation
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for grease, mold, or pest droppings on or around ventilation components
• 	Check for moisture buildup in bathrooms or kitchens due to poor airflow
• 	IBU Overlay: May require washable surfaces, sealed duct penetrations, or pest-proof grilles
🧪 Step 3: Operability Test
• 	Fan test: Activate switch—confirm motor engages and airflow is present
• 	Airflow check: Use tissue or smoke to verify suction at intake
• 	Window Check: Confirm operability of windows in rooms without mechanical ventilation
📏 Step 4: Accessibility & Local Requirements
• 	Control height: ≤48″ AFF
• 	Labeling: Fan controls must be clearly marked and operable without fine motor skills
• 	Reachability: Filters and switches must be accessible for cleaning and use
• 	IBU Overlay: May require tactile controls, visual contrast, or audible feedback in accessible units
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC (2021) §R303.3, §M1507 – Mechanical ventilation and natural airflow`
        }
    ]
};

export const VENTILATION_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Ventilation (other)',
    subcategories: [
        VENTILATION_OTHER
    ]
};

// ==========================================
// 29. WALL
// ==========================================
export const WALL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Wall',
    deficiencies: [
        {
            id: 'wall_1',
            name: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
            detail: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
            criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WALL-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All finished interior wall surfaces within the unit
• 	Includes: Drywall, plaster, paneling, tile, and wall-mounted systems (e.g., electrical boxes, HVAC registers)
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings on or behind wall surfaces
• 	Check for lead-based paint hazards in pre-1978 units (see separate guide)
• 	IBU Overlay: May require sealed finishes, antimicrobial coatings, or pest-proof wall penetrations
🧪 Step 3: Functional Adequacy
• 	Surface continuity: Wall must be free of large holes, exposed framing, or missing finishes
• 	Moisture Check: Look for dampness, bubbling paint, or soft spots
• 	Stability Check: Press gently on damaged areas to assess structural integrity
📏 Step 4: Accessibility & Local Requirements
• 	Wall-mounted controls: Must be ≤48″ AFF and operable without tight grasping
• 	Surface contrast: Walls should be distinguishable from adjacent surfaces for low-vision residents
• 	IBU Overlay: May require tactile signage, compliant switch placement, or reinforced backing for grab bars
⚒️ Step 5: IRC Structural & Finish Requirements
• 	IRC §R302.1 – Protection against structural failure and fire spread`
        },
        {
            id: 'wall_2',
            name: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
            detail: 'The wall is damaged, and repairs still need to be completed appropriately.',
            criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WALL-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All finished interior wall surfaces within the unit
• 	Includes: Drywall, plaster, paneling, tile, and wall-mounted systems (e.g., electrical boxes, HVAC registers)
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings on or behind wall surfaces
• 	Check for lead-based paint hazards in pre-1978 units (see separate guide)
• 	IBU Overlay: May require sealed finishes, antimicrobial coatings, or pest-proof wall penetrations
🧪 Step 3: Functional Adequacy
• 	Surface continuity: Wall must be free of large holes, exposed framing, or missing finishes
• 	Moisture Check: Look for dampness, bubbling paint, or soft spots
• 	Stability Check: Press gently on damaged areas to assess structural integrity
📏 Step 4: Accessibility & Local Requirements
• 	Wall-mounted controls: Must be ≤48″ AFF and operable without tight grasping
• 	Surface contrast: Walls should be distinguishable from adjacent surfaces for low-vision residents
• 	IBU Overlay: May require tactile signage, compliant switch placement, or reinforced backing for grab bars
⚒️ Step 5: IRC Structural & Finish Requirements
• 	IRC §R302.1 – Protection against structural failure and fire spread`
        },
        {
            id: 'wall_3',
            name: 'Interior wall has a loose or detached surface covering.',
            detail: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
            criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WALL-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All finished interior wall surfaces within the unit
• 	Includes: Drywall, plaster, paneling, tile, and wall-mounted systems (e.g., electrical boxes, HVAC registers)
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings on or behind wall surfaces
• 	Check for lead-based paint hazards in pre-1978 units (see separate guide)
• 	IBU Overlay: May require sealed finishes, antimicrobial coatings, or pest-proof wall penetrations
🧪 Step 3: Functional Adequacy
• 	Surface continuity: Wall must be free of large holes, exposed framing, or missing finishes
• 	Moisture Check: Look for dampness, bubbling paint, or soft spots
• 	Stability Check: Press gently on damaged areas to assess structural integrity
📏 Step 4: Accessibility & Local Requirements
• 	Wall-mounted controls: Must be ≤48″ AFF and operable without tight grasping
• 	Surface contrast: Walls should be distinguishable from adjacent surfaces for low-vision residents
• 	IBU Overlay: May require tactile signage, compliant switch placement, or reinforced backing for grab bars
⚒️ Step 5: IRC Structural & Finish Requirements
• 	IRC §R302.1 – Protection against structural failure and fire spread`
        }
    ]
};

// ==========================================
// 30. WATER HEATER
// ==========================================
export const WATER_HEATER_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Water Heater',
    deficiencies: [
        {
            id: 'wh_1',
            name: 'Chimney or flue piping is blocked, misaligned, or missing.',
            detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'The vent is damaged/misaligned /not connected properly.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'WH-01',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
Inspect all permanently installed water heaters, including: Tank-style (gas/electric), Tankless (on-demand), and Boiler systems
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings around base and plumbing penetrations
• 	Check for water pooling or rust stains under the tank or near the discharge pipe
• 	IBU Overlay: May require sealed flooring, pest-proof enclosures, or a moisture-resistant finish
🧪 Step 3: Functional Testing (Non-Invasive)
• 	Hot Water Test: Run hot water at the kitchen and bathroom faucets to confirm delivery
• 	TPR Valve & Pipe Check: Inspect valve for corrosion, blockage, or missing discharge pipe
• 	Confirm pipe terminates 2–6 inches from the floor and slopes downward
• 	Flue Pipe Inspection: Check for a continuous upward slope, secure joints, and no tape over holes
• 	Gas Valve Check: Confirm valve is present, operable, and leak-free (visual only)
📏 Step 4: Accessibility & Local Requirements
• 	Control height: Thermostat and shutoff valves must be reachable (≤48″ AFF)
• 	Labeling: Emergency shutoff must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible alerts in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC P2801–P2804: Water heaters must be installed per manufacturer specs
• 	TPR valve required and must discharge to a safe location
• 	IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• 	IRC M1801.1: Flue gas exhaust must be vented outdoors with a proper slope`
        },
        {
            id: 'wh_2',
            name: 'Gas shutoff valve is damaged, missing or not installed.',
            detail: 'Gas shutoff valve is damaged; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed.',
            criteria: 'Unable to shutoff gas in case of an emergency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'WH-02',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
Inspect all permanently installed water heaters, including: Tank-style (gas/electric), Tankless (on-demand), and Boiler systems
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings around base and plumbing penetrations
• 	Check for water pooling or rust stains under the tank or near the discharge pipe
• 	IBU Overlay: May require sealed flooring, pest-proof enclosures, or a moisture-resistant finish
🧪 Step 3: Functional Testing (Non-Invasive)
• 	Hot Water Test: Run hot water at the kitchen and bathroom faucets to confirm delivery
• 	TPR Valve & Pipe Check: Inspect valve for corrosion, blockage, or missing discharge pipe
• 	Confirm pipe terminates 2–6 inches from the floor and slopes downward
• 	Flue Pipe Inspection: Check for a continuous upward slope, secure joints, and no tape over holes
• 	Gas Valve Check: Confirm valve is present, operable, and leak-free (visual only)
📏 Step 4: Accessibility & Local Requirements
• 	Control height: Thermostat and shutoff valves must be reachable (≤48″ AFF)
• 	Labeling: Emergency shutoff must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible alerts in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC P2801–P2804: Water heaters must be installed per manufacturer specs
• 	TPR valve required and must discharge to a safe location
• 	IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• 	IRC M1801.1: Flue gas exhaust must be vented outdoors with a proper slope`
        },
        {
            id: 'wh_3',
            name: 'No hot water.',
            detail: 'Hot water does not dispense after handle is engaged.',
            criteria: 'No hot water after several minutes.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'WH-03',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
Inspect all permanently installed water heaters, including: Tank-style (gas/electric), Tankless (on-demand), and Boiler systems
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings around base and plumbing penetrations
• 	Check for water pooling or rust stains under the tank or near the discharge pipe
• 	IBU Overlay: May require sealed flooring, pest-proof enclosures, or a moisture-resistant finish
🧪 Step 3: Functional Testing (Non-Invasive)
• 	Hot Water Test: Run hot water at the kitchen and bathroom faucets to confirm delivery
• 	TPR Valve & Pipe Check: Inspect valve for corrosion, blockage, or missing discharge pipe
• 	Confirm pipe terminates 2–6 inches from the floor and slopes downward
• 	Flue Pipe Inspection: Check for a continuous upward slope, secure joints, and no tape over holes
• 	Gas Valve Check: Confirm valve is present, operable, and leak-free (visual only)
📏 Step 4: Accessibility & Local Requirements
• 	Control height: Thermostat and shutoff valves must be reachable (≤48″ AFF)
• 	Labeling: Emergency shutoff must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible alerts in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC P2801–P2804: Water heaters must be installed per manufacturer specs
• 	TPR valve required and must discharge to a safe location
• 	IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• 	IRC M1801.1: Flue gas exhaust must be vented outdoors with a proper slope`
        },
        {
            id: 'wh_4',
            name: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
            detail: 'The TPRV is obstructed such that the TPRV cannot be fully actuated. OR Relief valve discharge piping is damaged, capped, has an upward slope, or is constructed of unsuitable material.',
            criteria: 'The TPRV valve is not functioning adequately.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'WH-04',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
Inspect all permanently installed water heaters, including: Tank-style (gas/electric), Tankless (on-demand), and Boiler systems
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings around base and plumbing penetrations
• 	Check for water pooling or rust stains under the tank or near the discharge pipe
• 	IBU Overlay: May require sealed flooring, pest-proof enclosures, or a moisture-resistant finish
🧪 Step 3: Functional Testing (Non-Invasive)
• 	Hot Water Test: Run hot water at the kitchen and bathroom faucets to confirm delivery
• 	TPR Valve & Pipe Check: Inspect valve for corrosion, blockage, or missing discharge pipe
• 	Confirm pipe terminates 2–6 inches from the floor and slopes downward
• 	Flue Pipe Inspection: Check for a continuous upward slope, secure joints, and no tape over holes
• 	Gas Valve Check: Confirm valve is present, operable, and leak-free (visual only)
📏 Step 4: Accessibility & Local Requirements
• 	Control height: Thermostat and shutoff valves must be reachable (≤48″ AFF)
• 	Labeling: Emergency shutoff must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible alerts in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC P2801–P2804: Water heaters must be installed per manufacturer specs
• 	TPR valve required and must discharge to a safe location
• 	IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• 	IRC M1801.1: Flue gas exhaust must be vented outdoors with a proper slope`
        },
        {
            id: 'wh_5',
            name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
            detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). Or the relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
            criteria: 'Not properly installed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WH-05',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
Inspect all permanently installed water heaters, including: Tank-style (gas/electric), Tankless (on-demand), and Boiler systems
🔍 Step 2: Sanitation & Environmental Safety
• 	Inspect for mold, mildew, or pest droppings around base and plumbing penetrations
• 	Check for water pooling or rust stains under the tank or near the discharge pipe
• 	IBU Overlay: May require sealed flooring, pest-proof enclosures, or a moisture-resistant finish
🧪 Step 3: Functional Testing (Non-Invasive)
• 	Hot Water Test: Run hot water at the kitchen and bathroom faucets to confirm delivery
• 	TPR Valve & Pipe Check: Inspect valve for corrosion, blockage, or missing discharge pipe
• 	Confirm pipe terminates 2–6 inches from the floor and slopes downward
• 	Flue Pipe Inspection: Check for a continuous upward slope, secure joints, and no tape over holes
• 	Gas Valve Check: Confirm valve is present, operable, and leak-free (visual only)
📏 Step 4: Accessibility & Local Requirements
• 	Control height: Thermostat and shutoff valves must be reachable (≤48″ AFF)
• 	Labeling: Emergency shutoff must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or audible alerts in accessible units
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC P2801–P2804: Water heaters must be installed per manufacturer specs
• 	TPR valve required and must discharge to a safe location
• 	IRC G2420.5: Gas shutoff valve required within 6 feet of appliance
• 	IRC M1801.1: Flue gas exhaust must be vented outdoors with a proper slope`
        }
    ]
};

// ==========================================
// 31. WINDOW
// ==========================================
export const WINDOW_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'Window',
    deficiencies: [
        {
            id: 'window_1',
            name: 'Window cannot be secured.',
            detail: 'Window cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Only one lock is present, and it is damaged or inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WINDOW-01',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms must have windows for natural light and ventilation unless mechanical systems are provided
• 	Includes: Fixed and operable windows
• 	Window assemblies with screens, locks, weather stripping, and glazing
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for water intrusion: Staining, bubbling paint, or soft drywall near the window
• 	IBU Overlay: May require sealed penetrations, pest-proof screens, or moisture-resistant finishes
🧪 Step 3: Operability & Security
• 	Open test: Unlock and open window fully—verify smooth operation
• 	Stay-open test: Confirm window remains open without external support
• 	Close & lock test: Ensure the window closes securely and the lock engages
• 	Screen Inspection: Check for tears, holes, or missing mesh
• 	Egress Check (Bedroom Windows): Confirm clear path and operability for emergency escape
📏 Step 4: Accessibility & Local Requirements
• 	Window height: Bottom of operable portion ≤44″ AFF for egress (IRC §R310.2.2)
• 	Clear opening: ≥5.7 ft² for egress windows in sleeping areas
• 	Lock & latch: Must be operable without tight grasping or pinching
• 	IBU Overlay: May require tactile indicators, visual contrast, or compliant hardware in accessible units
⚒️ Step 5: IRC Structural Requirements
• 	IRC R308.4: Safety glazing required near doors, stairs, and walkways
• 	IRC R310.2: Emergency escape and rescue openings required in sleeping rooms
• 	IRC R303.6: Natural light and ventilation must be provided via windows or mechanical systems`
        },
        {
            id: 'window_2',
            name: 'Window component is damaged or missing, and the window is not functionally adequate.',
            detail: 'The window component is missing or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater.',
            criteria: 'Window is not functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WINDOW-02',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms must have windows for natural light and ventilation unless mechanical systems are provided
• 	Includes: Fixed and operable windows
• 	Window assemblies with screens, locks, weather stripping, and glazing
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for water intrusion: Staining, bubbling paint, or soft drywall near the window
• 	IBU Overlay: May require sealed penetrations, pest-proof screens, or moisture-resistant finishes
🧪 Step 3: Operability & Security
• 	Open test: Unlock and open window fully—verify smooth operation
• 	Stay-open test: Confirm window remains open without external support
• 	Close & lock test: Ensure the window closes securely and the lock engages
• 	Screen Inspection: Check for tears, holes, or missing mesh
• 	Egress Check (Bedroom Windows): Confirm clear path and operability for emergency escape
📏 Step 4: Accessibility & Local Requirements
• 	Window height: Bottom of operable portion ≤44″ AFF for egress (IRC §R310.2.2)
• 	Clear opening: ≥5.7 ft² for egress windows in sleeping areas
• 	Lock & latch: Must be operable without tight grasping or pinching
• 	IBU Overlay: May require tactile indicators, visual contrast, or compliant hardware in accessible units
⚒️ Step 5: IRC Structural Requirements
• 	IRC R308.4: Safety glazing required near doors, stairs, and walkways
• 	IRC R310.2: Emergency escape and rescue openings required in sleeping rooms
• 	IRC R303.6: Natural light and ventilation must be provided via windows or mechanical systems`
        },
        {
            id: 'window_3',
            name: 'Window will not close.',
            detail: 'The window does not close completely, or at least one window lock is not present. Or The window can be opened once the lock is engaged.',
            criteria: 'Window lock does not keep the window closed.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'WINDOW-03',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms must have windows for natural light and ventilation unless mechanical systems are provided
• 	Includes: Fixed and operable windows
• 	Window assemblies with screens, locks, weather stripping, and glazing
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for water intrusion: Staining, bubbling paint, or soft drywall near the window
• 	IBU Overlay: May require sealed penetrations, pest-proof screens, or moisture-resistant finishes
🧪 Step 3: Operability & Security
• 	Open test: Unlock and open window fully—verify smooth operation
• 	Stay-open test: Confirm window remains open without external support
• 	Close & lock test: Ensure the window closes securely and the lock engages
• 	Screen Inspection: Check for tears, holes, or missing mesh
• 	Egress Check (Bedroom Windows): Confirm clear path and operability for emergency escape
📏 Step 4: Accessibility & Local Requirements
• 	Window height: Bottom of operable portion ≤44″ AFF for egress (IRC §R310.2.2)
• 	Clear opening: ≥5.7 ft² for egress windows in sleeping areas
• 	Lock & latch: Must be operable without tight grasping or pinching
• 	IBU Overlay: May require tactile indicators, visual contrast, or compliant hardware in accessible units
⚒️ Step 5: IRC Structural Requirements
• 	IRC R308.4: Safety glazing required near doors, stairs, and walkways
• 	IRC R310.2: Emergency escape and rescue openings required in sleeping rooms
• 	IRC R303.6: Natural light and ventilation must be provided via windows or mechanical systems`
        },
        {
            id: 'window_4',
            name: 'Window will not open or stay open.',
            detail: 'Window will not open. OR Once opened, window will not stay open without the use of a tool or item.',
            criteria: 'Will not stay open without the use of a tool or item.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WINDOW-04',
            codeReference: `🧭 Step 1: Identification & Applicability
• 	Required: All habitable rooms must have windows for natural light and ventilation unless mechanical systems are provided
• 	Includes: Fixed and operable windows
• 	Window assemblies with screens, locks, weather stripping, and glazing
🔍 Step 2: Sanitation & Environmental Safety
• 	Check for water intrusion: Staining, bubbling paint, or soft drywall near the window
• 	IBU Overlay: May require sealed penetrations, pest-proof screens, or moisture-resistant finishes
🧪 Step 3: Operability & Security
• 	Open test: Unlock and open window fully—verify smooth operation
• 	Stay-open test: Confirm window remains open without external support
• 	Close & lock test: Ensure the window closes securely and the lock engages
• 	Screen Inspection: Check for tears, holes, or missing mesh
• 	Egress Check (Bedroom Windows): Confirm clear path and operability for emergency escape
📏 Step 4: Accessibility & Local Requirements
• 	Window height: Bottom of operable portion ≤44″ AFF for egress (IRC §R310.2.2)
• 	Clear opening: ≥5.7 ft² for egress windows in sleeping areas
• 	Lock & latch: Must be operable without tight grasping or pinching
• 	IBU Overlay: May require tactile indicators, visual contrast, or compliant hardware in accessible units
⚒️ Step 5: IRC Structural Requirements
• 	IRC R308.4: Safety glazing required near doors, stairs, and walkways
• 	IRC R310.2: Emergency escape and rescue openings required in sleeping rooms
• 	IRC R303.6: Natural light and ventilation must be provided via windows or mechanical systems`
        }
    ]
};

// ==========================================
// 32. GENERAL COMMENT
// ==========================================
export const GENERAL_COMMENT_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: 'General comment:*',
    deficiencies: [
        {
            id: 'general_1',
            name: '(housekeeping / no access/resident refusal)',
            detail: '(housekeeping / no access/resident refusal)',
            criteria: '(housekeeping / no access/resident refusal)',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'GENERAL-01'
        }
    ]
};

// ==========================================
// ALL INSIDE/UNIT CATEGORIES
// ==========================================
export const ALL_INSIDE_CATEGORIES: InsideItemDeficiencies[] = [
    BATHROOM_DEFICIENCIES,                  // 1
    CABINETS_STORAGE_DEFICIENCIES,           // 2
    CALL_FOR_AID_DEFICIENCIES,              // 3
    CARBON_MONOXIDE_DEFICIENCIES,           // 4
    CEILING_DEFICIENCIES,                   // 5
    CHIMNEY_DEFICIENCIES,                   // 6
    CLOTHES_DRYER_DEFICIENCIES,             // 7
    DOORS_DEFICIENCIES,                     // 8
    DRAINAGE_DEFICIENCIES,                  // 9
    EGRESS_DEFICIENCIES,                    // 10
    ELECTRICAL_DEFICIENCIES,                // 11
    FIRE_SAFETY_DEFICIENCIES,               // 12
    FLOOR_DEFICIENCIES,                     // 13
    FOUNDATION_DEFICIENCIES,                // 14
    HAZARD_DEFICIENCIES,                    // 15
    HVAC_DEFICIENCIES,                      // 16
    KITCHEN_DEFICIENCIES,                   // 17
    LEAK_GAS_OIL_DEFICIENCIES,              // 18
    LEAK_SEWAGE_DEFICIENCIES,               // 19
    LEAK_WATER_DEFICIENCIES,                // 20
    LIGHTING_DEFICIENCIES,                  // 21
    MOLD_DEFICIENCIES,                      // 22
    PAINT_DEFICIENCIES,                     // 23
    RAILINGS_DEFICIENCIES,                  // 24
    SINK_LAUNDRY_DEFICIENCIES,              // 25
    STEPS_STAIRS_DEFICIENCIES,              // 26
    STRUCTURAL_DEFICIENCIES,                // 27
    VENTILATION_DEFICIENCIES,               // 28
    WALL_DEFICIENCIES,                      // 29
    WATER_HEATER_DEFICIENCIES,              // 30
    WINDOW_DEFICIENCIES,                    // 31
    GENERAL_COMMENT_DEFICIENCIES            // 32
];

// ==========================================
// INSIDE CATEGORIES LIST (for UI display)
// ==========================================
export const INSIDE_CATEGORIES: string[] = ALL_INSIDE_CATEGORIES.map(cat => cat.itemName);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get all deficiencies for a specific inside/unit item
 * Returns both subcategory deficiencies and direct deficiencies
 */
export function getInsideDeficienciesForItem(itemName: string): InsideDeficiencyOption[] {
    const category = ALL_INSIDE_CATEGORIES.find(
        cat => cat.itemName.toLowerCase() === itemName.toLowerCase()
    );

    if (!category) {
        return [];
    }

    // If has subcategories, flatten all deficiencies from subcategories
    if (category.subcategories) {
        return category.subcategories.flatMap(sub => sub.deficiencies);
    }

    // If has direct deficiencies
    if (category.deficiencies) {
        return category.deficiencies;
    }

    return [];
}

/**
 * Get all deficiencies for a specific item with subcategory information
 * Returns the full category structure
 */
export function getAllInsideDeficienciesForItem(itemName: string): InsideItemDeficiencies | null {
    return ALL_INSIDE_CATEGORIES.find(
        cat => cat.itemName.toLowerCase() === itemName.toLowerCase()
    ) || null;
}

/**
 * Get deficiencies for a specific subcategory within an item
 */
export function getInsideSubcategoryDeficiencies(
    itemName: string,
    subcategoryName: string
): InsideDeficiencyOption[] {
    const category = ALL_INSIDE_CATEGORIES.find(
        cat => cat.itemName.toLowerCase() === itemName.toLowerCase()
    );

    if (!category || !category.subcategories) {
        return [];
    }

    const subcategory = category.subcategories.find(
        sub => sub.name.toLowerCase() === subcategoryName.toLowerCase()
    );

    return subcategory?.deficiencies || [];
}

/**
 * Get all subcategory names for an item
 */
export function getInsideSubcategories(itemName: string): string[] {
    const category = ALL_INSIDE_CATEGORIES.find(
        cat => cat.itemName.toLowerCase() === itemName.toLowerCase()
    );

    if (!category || !category.subcategories) {
        return [];
    }

    return category.subcategories.map(sub => sub.name);
}

/**
 * Calculate points for a deficiency
 * Formulas like '5.0/n', '13.40/n', '27.25/n', '54.50/n' divide by number of deficiencies
 * Formulas like '54.50/50xn', '13.40/50xn' divide by 50 then multiply by count
 * '0.000' means automatic fail (no points)
 */
export function calculateDeficiencyPoints(pointsFormula: string, deficiencyCount: number = 1): number {
    if (pointsFormula === '0.000') {
        return 0; // Automatic fail
    }

    // Handle formulas like '54.50/50xn' or '13.40/50xn'
    if (pointsFormula.includes('/50xn')) {
        const baseValue = parseFloat(pointsFormula.replace('/50xn', ''));
        return (baseValue / 50) * deficiencyCount;
    }

    // Handle formulas like '5.0/n', '13.40/n', '27.25/n', '54.50/n', '2.40/n'
    if (pointsFormula.includes('/n')) {
        const baseValue = parseFloat(pointsFormula.replace('/n', ''));
        return baseValue / deficiencyCount;
    }

    // If it's just a number
    const numValue = parseFloat(pointsFormula);
    return isNaN(numValue) ? 0 : numValue;
}

/**
 * Total possible points for Units = 50
 */
export const UNIT_TOTAL_POSSIBLE_POINTS = 50;


