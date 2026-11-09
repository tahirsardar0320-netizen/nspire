"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { ChevronLeft, ChevronRight, Save, CheckCircle, Camera, AlertCircle } from "lucide-react"

type ItemStatus = "Pass" | "Fail" | "N/A"

interface InspectionItem {
  id: string
  name: string
  status: ItemStatus | null
  remarks: string
  photos: number
}

export default function InspectionPage() {
  const router = useRouter()
  const params = useParams()
  const unitId = params.id as string

  const [currentSection, setCurrentSection] = useState(0)
  const [sections, setSections] = useState([
    {
      name: "Electrical",
      items: [
        { id: "e1", name: "All outlets are functioning properly", status: "Pass" as ItemStatus, remarks: "", photos: 0 },
        { id: "e2", name: "No exposed wiring or hazards", status: "Fail" as ItemStatus, remarks: "Exposed wiring near kitchen outlet", photos: 1 },
        { id: "e3", name: "Circuit breaker panel is accessible", status: "Pass" as ItemStatus, remarks: "", photos: 0 },
      ]
    },
    {
      name: "Plumbing",
      items: [
        { id: "p1", name: "No visible leaks under sinks", status: null, remarks: "", photos: 0 },
        { id: "p2", name: "Water pressure is adequate", status: null, remarks: "", photos: 0 },
        { id: "p3", name: "Drainage is functioning properly", status: null, remarks: "", photos: 0 },
      ]
    },
    {
      name: "Fire Safety",
      items: [
        { id: "f1", name: "Smoke detectors are installed and functional", status: null, remarks: "", photos: 0 },
        { id: "f2", name: "Fire extinguisher is accessible", status: null, remarks: "", photos: 0 },
        { id: "f3", name: "Emergency exits are marked and accessible", status: null, remarks: "", photos: 0 },
      ]
    },
  ])

  const currentSectionData = sections[currentSection]
  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0)
  const completedItems = sections.reduce((sum, section) => 
    sum + section.items.filter(item => item.status !== null).length, 0
  )
  const progressPercentage = Math.round((completedItems / totalItems) * 100)

  const updateItemStatus = (sectionIndex: number, itemId: string, status: ItemStatus) => {
    setSections(prev => {
      const updated = [...prev]
      const item = updated[sectionIndex].items.find(i => i.id === itemId)
      if (item) item.status = status
      return updated
    })
  }

  const updateItemRemarks = (sectionIndex: number, itemId: string, remarks: string) => {
    setSections(prev => {
      const updated = [...prev]
      const item = updated[sectionIndex].items.find(i => i.id === itemId)
      if (item) item.remarks = remarks
      return updated
    })
  }

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!", { position: "top-right" })
  }

  const handleSubmit = () => {
    if (completedItems < totalItems) {
      toast.warning(`Please complete all items (${completedItems}/${totalItems} completed)`, { position: "top-right" })
      return
    }
    toast.success("Inspection submitted successfully!", { position: "top-right" })
    setTimeout(() => router.push('/dashboard/inspection/summary'), 1500)
  }

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Property Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Unit {unitId} Inspection
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">Sunset Apartments, New York</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="flex-1 sm:flex-initial bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-750 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4 text-slate-500" />
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border-0 shadow-sm shadow-teal-600/10"
              >
                <CheckCircle className="w-4 h-4" />
                Submit Inspection
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-[#0E7490] uppercase tracking-wider">
                Progress: {completedItems} of {totalItems} items checked
              </p>
              <span className="text-base font-extrabold text-teal-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </Card>

          {/* Section Navigation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs sm:text-sm flex-1 text-center ${
                  currentSection === index 
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Inspection Items */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{currentSectionData.name} Items</h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {currentSectionData.items.map((item) => (
                <div key={item.id} className="py-5 first:pt-0 last:pb-0 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <p className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">{item.name}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateItemStatus(currentSection, item.id, "Pass")}
                        className={`flex-1 min-w-[75px] sm:min-w-[85px] py-2 px-3 rounded-xl font-extrabold transition-all text-xs sm:text-sm border ${
                          item.status === "Pass"
                            ? 'bg-emerald-500 text-white border-transparent shadow-sm'
                            : 'bg-slate-50/50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200'
                        }`}
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => updateItemStatus(currentSection, item.id, "Fail")}
                        className={`flex-1 min-w-[75px] sm:min-w-[85px] py-2 px-3 rounded-xl font-extrabold transition-all text-xs sm:text-sm border ${
                          item.status === "Fail"
                            ? 'bg-rose-500 text-white border-transparent shadow-sm'
                            : 'bg-slate-50/50 text-slate-600 hover:bg-rose-50 hover:text-rose-700 border-slate-200'
                        }`}
                      >
                        Fail
                      </button>
                      <button
                        onClick={() => updateItemStatus(currentSection, item.id, "N/A")}
                        className={`flex-1 min-w-[75px] sm:min-w-[85px] py-2 px-3 rounded-xl font-extrabold transition-all text-xs sm:text-sm border ${
                          item.status === "N/A"
                            ? 'bg-slate-500 text-white border-transparent shadow-sm'
                            : 'bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-700 border-slate-200'
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-black text-[#0E7490] uppercase tracking-wider">
                        Add Remarks / Observations
                      </label>
                      <textarea
                        value={item.remarks}
                        onChange={(e) => updateItemRemarks(currentSection, item.id, e.target.value)}
                        placeholder="Enter any additional notes or observations..."
                        className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all placeholder-slate-400 outline-none resize-none"
                        rows={2}
                      />
                    </div>
                    <button className="self-end mb-1 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-500 hover:text-teal-600 transition-all shadow-sm flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>

                  {item.photos > 0 && (
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1 bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1 w-max">
                      <AlertCircle className="w-3.5 h-3.5 text-teal-600" />
                      {item.photos} photo(s) attached
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between">
            <Button
              onClick={goToPrevSection}
              disabled={currentSection === 0}
              variant="outline"
              className="flex-1 sm:flex-initial border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Previous Section
            </Button>
            <Button
              onClick={goToNextSection}
              disabled={currentSection === sections.length - 1}
              className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl border-0 shadow-sm shadow-teal-600/10 text-xs sm:text-sm"
            >
              Next Section
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
