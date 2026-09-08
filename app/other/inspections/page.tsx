"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OtherDashboardLayout from "@/components/OtherDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { inspectionsAPI } from "@/lib/api"

export default function OtherInspectionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [inspections, setInspections] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalInspections: 0,
    completed: 0,
    scheduled: 0,
    inProgress: 0
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    fetchInspections()
    fetchStats()
  }, [statusFilter])

  const fetchInspections = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter) params.status = statusFilter
      
      const response = await inspectionsAPI.getAll(params)
      if (response.success) {
        setInspections(response.inspections || [])
      }
    } catch (error: any) {
      console.error('Error fetching inspections:', error)
      setInspections([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await inspectionsAPI.getStats()
      if (response.success) {
        setStats({
          totalInspections: response.stats.totalInspections || 0,
          completed: response.stats.completed || 0,
          scheduled: response.stats.scheduled || 0,
          inProgress: response.stats.inProgress || 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSearch = () => {
    fetchInspections()
    toast.info("Searching inspections...", { position: "top-right" })
  }

  // Opens the shared NSPIRE property view; PortalLayout keeps the user in this
  // portal's own chrome.
  const handleViewInspection = (inspection: any) => {
    const propertyId =
      typeof inspection.property === 'object' ? inspection.property?._id : inspection.property
    if (!propertyId) {
      toast.error("This inspection has no property linked to it.", { position: "top-right" })
      return
    }
    router.push(`/dashboard/property-details/${propertyId}`)
  }

  const filteredInspections = inspections.filter(inspection => {
    const propertyName = typeof inspection.property === 'object' ? inspection.property?.name : ''
    return (
      inspection.inspectionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.inspectionType?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200"
      case "scheduled":
        return "bg-amber-50 text-amber-700 border border-amber-200"
      case "in-progress":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200"
      case "pending":
        return "bg-orange-50 text-orange-700 border border-orange-200"
      case "failed":
        return "bg-rose-50 text-rose-700 border border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200"
    }
  }

  return (
    <OtherDashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Inspections</h1>
          <p className="text-slate-500 text-sm sm:text-base">View and track all inspections</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 lg:mb-8">
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Inspections</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats.totalInspections}</p>
          </Card>
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Scheduled</p>
            <p className="text-3xl font-extrabold text-amber-600">{stats.scheduled}</p>
          </Card>
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">In Progress</p>
            <p className="text-3xl font-extrabold text-indigo-600">{stats.inProgress}</p>
          </Card>
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Completed</p>
            <p className="text-3xl font-extrabold text-emerald-600">{stats.completed}</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-6 mb-6 lg:mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Search & Filter</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID, property, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-200 bg-slate-50/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg font-bold transition-colors duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="sm:w-48">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow-sm hover:shadow transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Inspections Table */}
        <Card className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">All Inspections</h2>
            <span className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              {filteredInspections.length} inspections
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200/80">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading inspections...</div>
            ) : filteredInspections.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">No inspections found.</div>
            ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Property</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Scheduled</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Score</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInspections.map((inspection) => (
                  <tr 
                    key={inspection._id} 
                    className="hover:bg-slate-50/50 transition-colors duration-150"
                  >
                    <td className="py-4 px-4">
                      <span className="text-indigo-600 font-bold text-xs bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">
                        {inspection.inspectionId || inspection._id?.slice(-6)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900">
                        {typeof inspection.property === 'object' ? inspection.property?.name : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">
                      {inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-slate-900 text-sm font-medium">{inspection.inspectionType || 'Standard'}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(inspection.status)}`}>
                        {inspection.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-900 font-bold">
                      {inspection.complianceScore ? `${inspection.complianceScore}%` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        onClick={() => handleViewInspection(inspection)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm hover:shadow transition-all duration-200"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading inspections...</div>
            ) : filteredInspections.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">No inspections found.</div>
            ) : (
            filteredInspections.map((inspection) => (
              <Card key={inspection._id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-indigo-600 font-bold text-xs bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                        {inspection.inspectionId || inspection._id?.slice(-6)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(inspection.status)}`}>
                        {inspection.status || 'Pending'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {typeof inspection.property === 'object' ? inspection.property?.name : 'N/A'}
                    </h3>
                    <p className="text-slate-500 text-xs">
                      {inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleViewInspection(inspection)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-lg text-xs shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap ml-2"
                  >
                    View
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 text-xs block mb-0.5">Type</span>
                    <p className="font-semibold text-slate-800 text-sm">{inspection.inspectionType || 'Standard'}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 text-xs block mb-0.5">Score</span>
                    <p className="font-semibold text-slate-800 text-sm">
                      {inspection.complianceScore ? `${inspection.complianceScore}%` : '-'}
                    </p>
                  </div>
                </div>
              </Card>
            ))
            )}
          </div>
        </Card>
      </div>
    </OtherDashboardLayout>
  )
}
