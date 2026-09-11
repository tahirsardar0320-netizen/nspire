// Baseline property every new inspector account starts with, seeded the same
// way a manually-added property would be (tied to that user's own userId) so
// it behaves identically — editable, removable, scored, etc. This is the first
// of the original 10 seeded properties, kept as the one baseline entry and
// renamed to "Test Property" rather than showing real client data by default.
export const DEFAULT_PROPERTIES = [
  { propertyId: 'B98to101', name: 'Test Property', buildings: 1, units: 5, address: '999 E. Ojai Ave', city: 'Ojai', state: 'California', zipCode: '93023' },
];
