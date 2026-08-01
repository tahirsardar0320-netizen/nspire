import { Metadata } from "next";
import AffordableHousingClient from "./AffordableHousingClient";

export const metadata: Metadata = {
  title: "Affordable Housing Inspection Services in USA | Nspire Home Inspections",
  description: "NSPIRE-compliant inspections for LIHTC, Section 8, and affordable multi-family housing — physical condition reviews, compliance documentation, and HUD/REAC-aligned reporting.",
};

export default function AffordableHousingPage() {
  return <AffordableHousingClient />;
}
