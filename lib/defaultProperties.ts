// Baseline property every new inspector account starts with, seeded the same
// way a manually-added property would be (tied to that user's own userId) so
// it behaves identically — editable, removable, scored, etc. Kept to a single
// generic entry (rather than real client properties) so app review / demo
// accounts land on an obvious sandbox, not production client data.
export const DEFAULT_PROPERTIES = [
  { propertyId: 'TEST-0001', name: 'Test Property', buildings: 2, units: 8, address: '123 Sample St', city: 'Los Angeles', state: 'California', zipCode: '90001' },
];
