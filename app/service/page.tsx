import { Metadata } from 'next';
import ServiceClient from './ServiceClient';

export const metadata: Metadata = {
  title: 'Inspection Services in USA | Nspire',
  description: 'Streamline inspections and real-time tracking. Nspire Inspection App delivers efficient inspection management.',
};

export default function ServicePage() {
  return <ServiceClient />;
}
