"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Building2, Search, Plus, MapPin, ChevronRight, LayoutDashboard, FileSpreadsheet, AlertCircle, CheckCircle2, CircleDollarSign } from "lucide-react"

export default function UnitSelection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('property')
  const [searchName, setSearchName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const units = [
    { id: "101", status: "needs-attention", label: "Needs Attention", color: "text-amber-700 bg-amber-50 border-amber-100", dotColor: "bg-amber-500" },
    { id: "102", status: "completed", label: "Completed", color: "text-emerald-700 bg-emerald-50 border-emerald-100", dotColor: "bg-emerald-500" },
    { id: "103", status: "unpaid", label: "Unpaid", color: "text-rose-700 bg-rose-50 border-rose-100", dotColor: "bg-rose-500" },
  ]

  const properties = [
    { id: "001", name: "COHEN'S PARK APARTMENTS", units: 12, city: "New York", state: "NY" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "needs-attention":
        return <AlertCircle className="w-4 h-4 text-amber-600" />
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case "unpaid":
        return <CircleDollarSign className="w-4 h-4 text-rose-600" />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Property Search
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Search by name, city, or state to initiate an inspection
              </p>
            </div>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl border-0 shadow-sm shadow-teal-600/10 text-xs sm:text-sm flex items-center justify-center gap-1.5 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </div>

          {/* Search Form */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#064B5E] uppercase tracking-wider">
                  Property Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all outline-none"
                  />
                </div>
              </div>

              {/* State Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#064B5E] uppercase tracking-wider">
                  State
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all outline-none"
                  />
                </div>
              </div>

              {/* City Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#064B5E] uppercase tracking-wider">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl border-0 shadow-sm shadow-teal-600/10 text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </Button>
          </Card>

          {/* Property Results */}
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#064B5E] uppercase tracking-wider">
                      Property #{property.id}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {property.city}, {property.state}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {property.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    Units Available: <span className="text-teal-600 font-extrabold">{property.units}</span>
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`/dashboard/inspection/unit-selection?property=${property.id}`)}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl border-0 shadow-sm shadow-teal-600/10 text-xs sm:text-sm"
                >
                  Initiate Inspection
                </Button>
              </div>
            ))}
          </div>

          {/* Unit Selection Section - Only show if property is selected */}
          {propertyId && (
            <div className="space-y-6 pt-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Select Unit for Inspection
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Select one of the units listed below to begin the assessment checklist
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {units.map((unit) => (
                  <Card
                    key={unit.id}
                    className="bg-white border border-slate-200 hover:border-teal-500 rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all space-y-4 relative group"
                    onClick={() => router.push(`/dashboard/inspection/${unit.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 ${unit.color}`}>
                        {getStatusIcon(unit.status)}
                        {unit.label}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                    
                    <div className="space-y-0.5">
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Unit {unit.id}
                      </h3>
                      <p className="text-xs text-slate-400 font-bold">Click to start or resume</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => router.push('/dashboard/inspection/summary')}
                  className="w-full sm:flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl border-0 shadow-sm shadow-teal-600/10 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  View Summary
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="w-full sm:flex-1 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
