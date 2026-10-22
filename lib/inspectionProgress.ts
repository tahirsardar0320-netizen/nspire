import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS } from "@/lib/inspectionData"
import { fetchWithTimeout } from './httpFetch';
import { durableGet, durableSet } from './durableStore';

/**
 * Whether a progress record belongs to the given building. The progress API
 * does not filter by building — it answers with the whole property — so every
 * screen that shows per-building numbers has to apply this itself, or one
 * building's work shows up under all of them.
 *
 * Unit records carry the building in their type (unit_B1_Unit 001); older
 * Outside/Inside records carried it in unit_id; records with no building
 * anywhere predate multi-building support and can only be the first building's.
 */
export function recordBelongsToBuilding(p: any, buildingId: string): boolean {
  const bId = String(buildingId || '').toLowerCase();
  const type = String(p?.inspectionType || '').toLowerCase();
  const pBldg = String(p?.buildingId || '').toLowerCase();
  const pUnit = String(p?.unitId || '').toLowerCase();
  if (/^unit_b\d+_/.test(type)) return type.startsWith(`unit_${bId}_`);
  if (pBldg) return pBldg === bId;
  if (/^b\d+$/.test(pUnit) || pUnit.startsWith('building ')) return pUnit === bId;
  return bId === 'b1' || bId === 'building 1';
}

// Computes per-property completion % from the same records the
// inspection-category page writes (API progress + its local cache),
// so every page that shows progress stays in sync.
export async function fetchPropertyProgressMap(propertyList: any[], apiUrl: string): Promise<Record<string, number>> {
  let apiProgress: any[] = []
  try {
    const response = await fetchWithTimeout(`${apiUrl}/api/inspections/progress?slim=1`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    if (data.success && Array.isArray(data.progress)) {
      apiProgress = data.progress
    }
  } catch (e) {
    console.error('Error fetching progress from API, falling back to local cache:', e)
  }

  const progressMap: Record<string, number> = {}

  propertyList.forEach(prop => {
    const propId = prop._id
    const numBuildings = parseInt(prop.buildings) || 0

    let unitsToInspect = parseInt(prop.units) || 1
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`property_coverage_${propId}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed && typeof parsed.calculatedUnits === 'number') {
            unitsToInspect = parsed.calculatedUnits
          }
        } catch (e) {}
      }
    }

    const totalTasks = (numBuildings * 2) + unitsToInspect
    if (totalTasks <= 0) {
      progressMap[propId] = 0
      return
    }

    const propApiRecords = apiProgress.filter((p: any) =>
      p.propertyId === propId || p.propertyId?._id === propId
    )

    let completedTasks = 0
    const completedUnitKeys = new Set<string>()

    for (let b = 1; b <= numBuildings; b++) {
      const buildingId = `B${b}`

      let records = propApiRecords.filter((p: any) => recordBelongsToBuilding(p, buildingId))

      if (typeof window !== 'undefined') {
        try {
          const cached = durableGet(`cached_progress_${propId}_${buildingId}`)
          if (cached) {
            const cachedList = JSON.parse(cached)
            if (Array.isArray(cachedList)) records = [...records, ...cachedList]
          }
        } catch (e) {}
      }

      const outsideRec = records.find((p: any) => p.inspectionType === 'Outside')
      const insideRec = records.find((p: any) => p.inspectionType === 'Inside')

      if (outsideRec?.responses) {
        const done = Object.values(outsideRec.responses).filter((s: any) => s !== null && s !== undefined).length
        completedTasks += Math.min(1, done / (OUTSIDE_ITEMS.length || 1))
      }
      if (insideRec?.responses) {
        const done = Object.values(insideRec.responses).filter((s: any) => s !== null && s !== undefined).length
        completedTasks += Math.min(1, done / (INSIDE_ITEMS.length || 1))
      }

      records.forEach((p: any) => {
        const type = String(p.inspectionType || '').toLowerCase()
        if (type.startsWith('unit_')) {
          const key = `${buildingId}_${p.unitId}`
          if (!completedUnitKeys.has(key)) {
            completedUnitKeys.add(key)
            // A unit mid-inspection used to count as a whole task here while the
            // inspection screen counted it as a fraction, so the dashboard and
            // the screen disagreed about the same property. Count it the same
            // way everywhere.
            if (p.inspectionData?.isComplete) {
              completedTasks += 1
            } else if (p.responses) {
              const done = Object.values(p.responses).filter((s: any) => s !== null && s !== undefined).length
              completedTasks += Math.min(1, done / (UNIT_ITEMS.length || 1))
            }
          }
        }
      })
    }

    progressMap[propId] = Math.min(100, Math.round((completedTasks / totalTasks) * 100))
  })

  return progressMap
}

export function getActiveInspectionId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('active_inspection_property')
}
