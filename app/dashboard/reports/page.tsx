"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { FileText, Search, Download, Share2, AlertTriangle, CheckCircle2, Clock, AlertCircle, Calendar, CreditCard, ChevronRight, SlidersHorizontal } from "lucide-react"

interface Report {
  id: string
  property: string
  unit: string
  inspector: string
  date: string
  compliance: number
  status: "Completed" | "Under Review" | "Follow-up Required"
  payment: "Paid" | "Pending"
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [inspectionCount, setInspectionCount] = useState(0)
  const INSPECTION_LIMIT = 15

  const reports: Report[] = [
    {
      id: "RPT-001",
      property: "Sunset Apartments",
      unit: "101",
      inspector: "Emma Johnson",
      date: "2024-01-15",
      compliance: 88,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-002",
      property: "River Heights",
      unit: "205",
      inspector: "Michael Chen",
      date: "2024-01-14",
      compliance: 92,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-003",
      property: "Courthouse Apartments",
      unit: "312",
      inspector: "Sarah Williams",
      date: "2024-01-13",
      compliance: 75,
      status: "Under Review",
      payment: "Pending",
    },
    {
      id: "RPT-004",
      property: "Calhoun Homes",
      unit: "A-45",
      inspector: "Emma Johnson",
      date: "2024-01-12",
      compliance: 85,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-005",
      property: "STEPHEN'S PARK APA",
      unit: "B-12",
      inspector: "David Martinez",
      date: "2024-01-11",
      compliance: 95,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-006",
      property: "Demure St-Hilaire",
      unit: "308",
      inspector: "Emma Johnson",
      date: "2024-01-10",
      compliance: 68,
      status: "Follow-up Required",
      payment: "Pending",
    },
  ]

  // Apply real filters to mock data
  const filteredReports = reports.filter((report) => {
    // Search Term
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      report.property.toLowerCase().includes(term) ||
      report.unit.toLowerCase().includes(term) ||
      report.inspector.toLowerCase().includes(term) ||
      report.id.toLowerCase().includes(term)

    // Property Name
    let matchesProperty = true
    if (propertyFilter === "sunset") matchesProperty = report.property === "Sunset Apartments"
    else if (propertyFilter === "river") matchesProperty = report.property === "River Heights"
    else if (propertyFilter === "courthouse") matchesProperty = report.property === "Courthouse Apartments"
    else if (propertyFilter === "calhoun") matchesProperty = report.property === "Calhoun Homes"

    // Status
    let matchesStatus = true
    if (statusFilter === "completed") matchesStatus = report.status === "Completed"
    else if (statusFilter === "review") matchesStatus = report.status === "Under Review"
    else if (statusFilter === "followup") matchesStatus = report.status === "Follow-up Required"

    // Date Range (simple check based on hardcoded dates vs today relative logic or just show all for empty)
    let matchesDate = true
    if (dateRange === "today") {
      matchesDate = report.date === new Date().toISOString().split('T')[0]
    }

    return matchesSearch && matchesProperty && matchesStatus && matchesDate
  })

  const handleApplyFilters = () => {
    toast.success("Filters applied successfully", { position: "top-right" })
  }

  const handleDownload = (reportId: string) => {
    if (inspectionCount >= INSPECTION_LIMIT) {
      toast.error(`Inspection limit reached (${INSPECTION_LIMIT}/${INSPECTION_LIMIT})`, { position: "top-right" })
      return
    }
    setInspectionCount(inspectionCount + 1)
    toast.success(`Downloading report ${reportId}...`, { position: "top-right" })
  }

  const handleShare = (reportId: string) => {
    if (inspectionCount >= INSPECTION_LIMIT) {
      toast.error(`Inspection limit reached (${INSPECTION_LIMIT}/${INSPECTION_LIMIT})`, { position: "top-right" })
      return
    }
    setInspectionCount(inspectionCount + 1)
    toast.info(`Sharing report ${reportId} with team...`, { position: "top-right" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Under Review":
        return "bg-sky-50 text-sky-700 border-sky-200"
      case "Follow-up Required":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />
      case "Under Review":
        return <Clock className="w-3.5 h-3.5" />
      case "Follow-up Required":
        return <AlertTriangle className="w-3.5 h-3.5" />
      default:
        return <AlertCircle className="w-3.5 h-3.5" />
    }
  }

  const getPaymentBadge = (payment: string) => {
    return payment === "Paid" ? (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50/50 text-emerald-700 border border-emerald-100 flex items-center gap-1 w-max">
        <CreditCard className="w-3 h-3" />
        Paid
      </span>
    ) : (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50/50 text-amber-700 border border-amber-100 flex items-center gap-1 w-max">
        <CreditCard className="w-3 h-3" />
        Pending
      </span>
    )
  }

  const getComplianceStyle = (compliance: number) => {
    if (compliance >= 90) return { text: "text-emerald-600", bar: "bg-emerald-500", bg: "bg-emerald-50" }
    if (compliance >= 75) return { text: "text-amber-600", bar: "bg-amber-500", bg: "bg-amber-50" }
    return { text: "text-rose-600", bar: "bg-rose-500", bg: "bg-rose-50" }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Inspection Limit Banner */}
          {inspectionCount >= INSPECTION_LIMIT && (
            <div className="bg-rose-50 border border-rose-200/80 border-l-4 border-l-rose-500 rounded-2xl p-5 shadow-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-extrabold text-rose-800">Inspection limit reached ({inspectionCount}/{INSPECTION_LIMIT})</p>
                <p className="text-xs text-rose-600 mt-1 font-medium">You have reached the maximum number of inspections allowed. No further download or share actions can be performed.</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-600" />
                Inspection Reports
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">View and manage all property inspection documents</p>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-teal-50/30 border border-teal-100 rounded-2xl px-5 py-3 flex items-center gap-4">
              <div>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Inspections Used</p>
                <p className="text-xl font-extrabold text-teal-800 tracking-tight">
                  {inspectionCount} <span className="text-slate-400 font-medium text-xs">/ {INSPECTION_LIMIT}</span>
                </p>
              </div>
              <div className="w-1.5 h-10 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`w-full rounded-full transition-all duration-300 ${inspectionCount >= INSPECTION_LIMIT ? 'bg-rose-500' : 'bg-teal-600'}`}
                  style={{ height: `${(inspectionCount / INSPECTION_LIMIT) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-black text-[#0E7490] uppercase tracking-wider">Search Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 space-y-1">
                <label className="text-xs font-black text-[#0E7490] uppercase tracking-wider">
                  Search Reports
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by property, unit, or inspector..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#0E7490] uppercase tracking-wider">
                  Property Name
                </label>
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                >
                  <option value="">All Properties</option>
                  <option value="sunset">Sunset Apartments</option>
                  <option value="river">River Heights</option>
                  <option value="courthouse">Courthouse Apartments</option>
                  <option value="calhoun">Calhoun Homes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#0E7490] uppercase tracking-wider">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 3 Months</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#0E7490] uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="review">Under Review</option>
                  <option value="followup">Follow-up Required</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleApplyFilters}
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl border-0 shadow-sm shadow-teal-600/10 text-xs sm:text-sm"
              >
                Apply Filters
              </Button>
            </div>
          </Card>

          {/* Reports Table & List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden divide-y divide-slate-100">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const compStyle = getComplianceStyle(report.compliance)
                  return (
                    <div key={report.id} className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {report.id}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-1">{report.property}</h3>
                        </div>
                        <span className={`px-2.5 py-0.5 inline-flex items-center gap-1 text-xs font-bold border rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                        <div>
                          <span className="text-xs font-black text-[#0E7490] uppercase tracking-wider block">Unit</span>
                          <span className="text-slate-950 font-semibold">{report.unit}</span>
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#0E7490] uppercase tracking-wider block">Date</span>
                          <span className="text-slate-950 font-semibold">{report.date}</span>
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#0E7490] uppercase tracking-wider block">Inspector</span>
                          <span className="text-slate-950 font-semibold">{report.inspector}</span>
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#0E7490] uppercase tracking-wider block">Payment</span>
                          {getPaymentBadge(report.payment)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-[#0E7490] uppercase tracking-wider block">Compliance</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-extrabold ${compStyle.text}`}>
                              {report.compliance}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${compStyle.bar}`} style={{ width: `${report.compliance}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(report.id)}
                            disabled={inspectionCount >= INSPECTION_LIMIT}
                            className={`p-2 rounded-xl transition-colors border ${
                              inspectionCount >= INSPECTION_LIMIT
                                ? 'text-slate-300 bg-slate-50 border-slate-100 cursor-not-allowed'
                                : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50 border-slate-200 bg-white shadow-sm'
                            }`}
                            title="Download Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(report.id)}
                            disabled={inspectionCount >= INSPECTION_LIMIT}
                            className={`p-2 rounded-xl transition-colors border ${
                              inspectionCount >= INSPECTION_LIMIT
                                ? 'text-slate-300 bg-slate-50 border-slate-100 cursor-not-allowed'
                                : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50 border-slate-200 bg-white shadow-sm'
                            }`}
                            title="Share Report"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-700 font-bold text-sm">No reports matching filters</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-left">
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Inspector
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                      const compStyle = getComplianceStyle(report.compliance)
                      return (
                        <tr key={report.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-150 uppercase">
                              {report.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-extrabold text-slate-900 tracking-tight">{report.property}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-slate-700">{report.unit}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-slate-600">{report.inspector}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-500 font-semibold">{report.date}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-extrabold ${compStyle.text}`}>
                                {report.compliance}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${compStyle.bar}`} style={{ width: `${report.compliance}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 inline-flex items-center gap-1 text-xs font-bold border rounded-full ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)}
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPaymentBadge(report.payment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDownload(report.id)}
                                disabled={inspectionCount >= INSPECTION_LIMIT}
                                className={`p-2 rounded-xl transition-colors border ${
                                  inspectionCount >= INSPECTION_LIMIT
                                    ? 'text-slate-300 bg-slate-50 border-slate-100 cursor-not-allowed'
                                    : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50 border-slate-200 bg-white shadow-sm'
                                }`}
                                title="Download Report"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleShare(report.id)}
                                disabled={inspectionCount >= INSPECTION_LIMIT}
                                className={`p-2 rounded-xl transition-colors border ${
                                  inspectionCount >= INSPECTION_LIMIT
                                    ? 'text-slate-300 bg-slate-50 border-slate-100 cursor-not-allowed'
                                    : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50 border-slate-200 bg-white shadow-sm'
                                }`}
                                title="Share Report"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-700 font-bold text-sm">No reports matching filters</p>
                        <p className="text-slate-400 text-xs mt-0.5">Try adjusting your filters or search term</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-extrabold text-slate-800">1</span> to <span className="font-extrabold text-slate-800">{filteredReports.length}</span> of{' '}
                  <span className="font-extrabold text-slate-800">{filteredReports.length}</span> results
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled className="px-4 py-2 border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs">
                    Previous
                  </Button>
                  <Button variant="outline" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-teal-600/10 border-0">
                    1
                  </Button>
                  <Button variant="outline" disabled className="px-4 py-2 border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
