import { Metadata } from "next";
import OwnersClient from "./OwnersClient";

export const metadata: Metadata = {
  title: "Owners Inspection Services in USA | Nspire Home Inspections",
  description: "Nspire offers comprehensive Owners Inspection Services across the USA for property owners, landlords, and multi-unit managers with precise evaluations.",
};

export default function OwnersPage() {
  return <OwnersClient />;
}
