import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StateInspectorsClient from "./StateInspectorsClient";

const stateData: Record<string, {
  name: string;
  inspectors: { name: string; company: string; city: string; phone: string }[];
}> = {
  california: {
    name: "California",
    inspectors: [
      { name: "Bill Risley", company: "Risley Home Inspections", city: "San Diego", phone: "(317) 605-5885" },
      { name: "Eric Wheeler, HI-4133", company: "THE HOME INSPECTOR", city: "Los Angeles", phone: "(205) 482-8413" },
      { name: "Chris Zobrosky, HI-4378", company: "Iron City Inspections", city: "Sacramento", phone: "(205) 441-6986" },
      { name: "Anthony Westbrook", company: "Westbrook Homes", city: "Long Beach", phone: "(205) 378-9443" },
      { name: "Richard Glynn", company: "Guiding Light Inspections", city: "Oakland", phone: "(850) 408-4495" },
      { name: "Lee Sutton", company: "Lee Sutton Inspection Services LLC", city: "Anaheim", phone: "(334) 717-0851" },
      { name: "Charles Wright, Sr", company: "C Wright Enterprises LLC", city: "Santa Ana", phone: "(205) 473-1250" },
      { name: "Marcus Johnson", company: "Pacific Home Inspections", city: "Fresno", phone: "(559) 234-5678" },
    ],
  },
  florida: {
    name: "Florida",
    inspectors: [
      { name: "James Carter", company: "Sunshine State Inspections", city: "Miami", phone: "(305) 123-4567" },
      { name: "Patricia Moore", company: "Moore Home Inspections", city: "Orlando", phone: "(407) 987-6543" },
      { name: "Robert Davis", company: "Gulf Coast Inspections", city: "Tampa", phone: "(813) 456-7890" },
      { name: "Linda Harris", company: "Harris Property Inspections", city: "Jacksonville", phone: "(904) 321-6547" },
      { name: "Michael Thompson", company: "Atlantic Inspections LLC", city: "Fort Lauderdale", phone: "(954) 789-0123" },
    ],
  },
  georgia: {
    name: "Georgia",
    inspectors: [
      { name: "David Wilson", company: "Peach State Inspections", city: "Atlanta", phone: "(404) 555-1234" },
      { name: "Sarah Brown", company: "Brown Home Services", city: "Savannah", phone: "(912) 678-9012" },
      { name: "Kevin Martinez", company: "Southern Comfort Inspections", city: "Augusta", phone: "(706) 234-5678" },
    ],
  },
  louisiana: {
    name: "Louisiana",
    inspectors: [
      { name: "William Anderson", company: "Bayou State Inspections", city: "New Orleans", phone: "(504) 345-6789" },
      { name: "Jessica Taylor", company: "Taylor Property Inspections", city: "Baton Rouge", phone: "(225) 456-7890" },
      { name: "Christopher Lee", company: "Pelican Home Inspections", city: "Shreveport", phone: "(318) 567-8901" },
    ],
  },
  oklahoma: {
    name: "Oklahoma",
    inspectors: [
      { name: "Daniel Jackson", company: "Sooner State Inspections", city: "Oklahoma City", phone: "(405) 678-9012" },
      { name: "Ashley White", company: "White Home Inspections", city: "Tulsa", phone: "(918) 789-0123" },
      { name: "Matthew Harris", company: "Prairie Wind Inspections", city: "Norman", phone: "(405) 890-1234" },
    ],
  },
};

export async function generateMetadata({ params }: { params: { state: string } }): Promise<Metadata> {
  const data = stateData[params.state.toLowerCase()];
  if (!data) return { title: "Not Found" };
  return {
    title: `Certified Home Inspectors in ${data.name} | NSPIRE`,
    description: `All certified home inspectors available in ${data.name}. Find InterNACHI-certified inspectors near you.`,
  };
}

export function generateStaticParams() {
  return Object.keys(stateData).map((state) => ({ state }));
}

export default function StateInspectorsPage({ params }: { params: { state: string } }) {
  const data = stateData[params.state.toLowerCase()];
  if (!data) notFound();
  return <StateInspectorsClient stateName={data.name} inspectors={data.inspectors} />;
}
