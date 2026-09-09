/**
 * The inspector categories offered by the "Inspector Other" portal.
 *
 * These ids are persisted on the user as `inspectorType`, so treat them as
 * stored values: renaming one orphans every account already signed up under it.
 */
export const INSPECTOR_TYPES = [
  { id: 'home-inspector', label: 'Home Inspector', emoji: '🏠' },
  { id: 'multi-unit-inspector', label: 'Multi-Unit Inspector', emoji: '🏢' },
  { id: 'commercial-inspector', label: 'Commercial Inspector', emoji: '🏙️' },
  { id: 'certified-inspector', label: 'Certified Inspector', emoji: '✅' },
] as const

export type InspectorTypeId = (typeof INSPECTOR_TYPES)[number]['id']

export const isInspectorType = (value: unknown): value is InspectorTypeId =>
  typeof value === 'string' && INSPECTOR_TYPES.some((t) => t.id === value)

/** Human-readable name for a stored id, or null if it isn't one of ours. */
export const inspectorTypeLabel = (id?: string | null): string | null =>
  INSPECTOR_TYPES.find((t) => t.id === id)?.label ?? null
