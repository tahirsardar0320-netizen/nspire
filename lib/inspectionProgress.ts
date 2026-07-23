import { OUTSIDE_ITEMS, INSIDE_ITEMS } from "@/lib/inspectionData"

// Computes per-property completion % from the same records the
// inspection-category page writes (API progress + its local cache),
// so every page that shows progress stays in sync.
export async function fetchPropertyProgressMap(propertyList: any[], apiUrl: string): Promise<Record<string, number>> {
  let apiProgress: any[] = []
  try {
    const response = await fetch(`${apiUrl}/api/inspections/progress`, {
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

      let records = propApiRecords.filter((p: any) =>
        String(p.buildingId || p.unitId || '').toUpperCase() === buildingId
      )

      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(`cached_progress_${propId}_${buildingId}`)
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
            completedTasks += 1
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
