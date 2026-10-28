"use client"

// Stripped to a single card on the client's instruction: the Other portal
// shows nothing but what its picker card promises — "Other, for other
// users" — until a real role is defined for it. The old dashboard here
// (inspections, stats, user lists) belonged to no actual workflow.
import OtherDashboardLayout from "@/components/OtherDashboardLayout"
import { Card } from "@/components/ui/card"

export default function OtherDashboard() {
  return (
    <OtherDashboardLayout>
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Other</h1>
          <p className="text-slate-500 font-medium">For other users.</p>
        </Card>
      </div>
    </OtherDashboardLayout>
  )
}
