import FindInspectorsClient from './FindInspectorsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Certified Home Inspectors Near You | NSPIRE',
  description: 'Search for InterNACHI-Certified Home Inspectors near you.',
};

export default function FindInspectorsPage() {
  return <FindInspectorsClient />;
}
