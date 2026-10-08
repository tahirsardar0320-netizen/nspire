"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ManagementDashboardLayout from "@/components/ManagementDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { adminAPI, propertiesAPI, inspectionsAPI } from "@/lib/api"
import { fetchWithTimeout } from '@/lib/httpFetch';

interface Report {
  _id: string
  id?: string
  propertyName?: string
  property: {
    _id: string
    name: string
  }
  unit: {
    _id: string
    unitNumber: string
  }
  inspector: {
    _id: string
    name: string
  }
  inspectorName?: string
  scheduledDate: string
  inspectionDate?: string
  status: string
  result?: string
  score?: number
}

interface Property {
  _id: string
  name: string
}

export default function Reports() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProperty, setSelectedProperty] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
    fetchProperties()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      // Use admin API to get all inspections for management
      const response = await adminAPI.getInspections()
      setReports(response.inspections || [])
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const fetchProperties = async () => {
    try {
      const response = await propertiesAPI.getAll()
      setProperties(response.properties || [])
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    }
  }

  const getStatusStyle = (status: string, result?: string) => {
    const finalStatus = result || status
    if (finalStatus === 'completed' || finalStatus === 'pass' || finalStatus === 'Compliant' || finalStatus === 'paid' || finalStatus === 'Paid') {
      return { color: 'text-green-600', bg: 'bg-green-50' }
    } else if (finalStatus === 'failed' || finalStatus === 'fail' || finalStatus === 'Non-Compliant' || finalStatus === 'unpaid' || finalStatus === 'Unpaid') {
      return { color: 'text-red-600', bg: 'bg-red-50' }
    } else if (finalStatus === 'in-progress' || finalStatus === 'pending') {
      return { color: 'text-yellow-600', bg: 'bg-yellow-50' }
    }
    return { color: 'text-gray-600', bg: 'bg-gray-50' }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handlePreview = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("Authentication required")
        return
      }

      // Make the request with proper authorization and open in new window
      const previewUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspections/${reportId}/nspire-preview`
      
      const response = await fetchWithTimeout(previewUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to load preview')
      }

      const htmlContent = await response.text()
      
      // Open new window and write the HTML content
      const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
      } else {
        toast.error("Please allow popups to preview the report")
      }
    } catch (error: any) {
      console.error('Preview error:', error)
      toast.error("Failed to preview report")
    }
  }

  const handleExport = async (reportId: string) => {
    try {
      const report = reports.find(r => r._id === reportId)
      if (!report) return

      toast.info("Generating NSPIRE PDF report...", { position: "top-right", autoClose: 2000 })

      // Use the new NSPIRE PDF generation endpoint
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetchWithTimeout(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspections/${reportId}/nspire-pdf?includeImages=true&includeSummary=true&includeDeficiencies=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate PDF')
      }

      // Check if response is JSON (HTML fallback) or PDF
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        // Handle HTML fallback for client-side PDF generation
        const data = await response.json()
        
        if (data.html) {
          // Create a new window with the HTML content and print it
          const printWindow = window.open('', '_blank', 'width=1200,height=800')
          if (printWindow) {
            printWindow.document.write(data.html)
            printWindow.document.close()
            
            // Wait for content to load then trigger print
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print()
                toast.success("Report opened for printing. Use your browser's print function to save as PDF.", { 
                  position: "top-right",
                  autoClose: 5000 
                })
              }, 1000)
            }
          } else {
            toast.error("Please allow popups to print the report")
          }
        } else {
          throw new Error('Invalid response format')
        }
      } else {
        // Handle PDF blob response
        const blob = await response.blob()
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // Generate filename
        const propertyName = (report.propertyName || report.property?.name || 'Property').replace(/[^a-zA-Z0-9]/g, '_')
        const dateStr = new Date().toISOString().split('T')[0]
        link.download = `NSPIRE_Report_${propertyName}_${dateStr}.pdf`
        
        // Trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        window.URL.revokeObjectURL(url)
        
        toast.success("NSPIRE inspection report downloaded successfully!", { position: "top-right" })
      }
    } catch (error: any) {
      console.error('PDF generation error:', error)
      toast.error(error.message || "Failed to generate NSPIRE inspection report")
    }
  }

  const handleShare = async (reportId: string) => {
    try {
      const response = await inspectionsAPI.generateShareLink(reportId);
      
      // Create a more detailed success message
      const expiryDate = new Date(response.expiresAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Copy the shareable URL to clipboard
      await navigator.clipboard.writeText(response.shareUrl);
      
      // Show success message with the URL
      toast.success(
        <div>
          <div className="font-semibold mb-1">Shareable link copied to clipboard!</div>
          <div className="text-sm text-gray-600 mb-2">Link expires on {expiryDate}</div>
          <div className="text-xs bg-gray-100 p-2 rounded break-all">
            {response.shareUrl}
          </div>
        </div>, 
        { 
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
        }
      );
    } catch (error) {
      console.error('Share error:', error);
      toast.error("Failed to generate shareable link");
    }
  };

  const filteredReports = reports.filter(report => {
    const propertyName = report.propertyName || report.property?.name || ''
    const unitNumber = report.unit?.unitNumber || ''
    const inspectorName = report.inspectorName || report.inspector?.name || ''

    const matchesSearch = searchQuery === '' ||
      propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspectorName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProperty = selectedProperty === '' || report.property?._id === selectedProperty
    const matchesStatus = selectedStatus === '' || report.status === selectedStatus || report.result === selectedStatus
    return matchesSearch && matchesProperty && matchesStatus
  })

  return (
    <ManagementDashboardLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Inspection Reports</h1>
          <p className="text-sm text-gray-600">View, export and share your inspection reports.</p>
        </div>

        {/* Filters */}
        <Card className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Property Name</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006795]"
              >
                <option value="">All Properties</option>
                {properties.map(property => (
                  <option key={property._id} value={property._id}>{property.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Date Range</label>
              <select
                className="w-full px-4 py-2 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006795]"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006795]"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="needs-attention">Needs Attention</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by property, unit or inspector name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
            />
          </div>
        </Card>

        {/* Desktop Table View */}
        <Card className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Property</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Unit</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Inspector</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Compliance Score</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">Loading reports...</td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">No reports found.</td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const statusStyle = getStatusStyle(report.status, report.result)
                    const propertyName = report.propertyName || report.property?.name || 'N/A'
                    const unitNumber = report.unit?.unitNumber || 'All Units'
                    const inspectorName = report.inspectorName || report.inspector?.name || 'N/A'
                    const dateStr = report.inspectionDate || report.scheduledDate
                    return (
                      <tr key={report._id || report.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-900 font-medium">{propertyName}</td>
                        <td className="py-4 px-4 text-gray-900">{unitNumber}</td>
                        <td className="py-4 px-4 text-gray-900">{inspectorName}</td>
                        <td className="py-4 px-4 text-gray-900">{formatDate(dateStr)}</td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusStyle.bg}`}>
                            <div className={`w-2 h-2 rounded-full ${statusStyle.color.replace('text-', 'bg-')}`}></div>
                            <span className={`text-sm font-semibold ${statusStyle.color}`}>
                              {report.result || report.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePreview(report._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Preview Report"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleExport(report._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Download NSPIRE PDF"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleShare(report._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Share Report"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t px-4 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">Showing {filteredReports.length} Reports</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Prev
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-[#006795] rounded-lg hover:bg-[#0A5670]">
                1
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </Card>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No reports found.</div>
          ) : (
            filteredReports.map((report) => {
              const statusStyle = getStatusStyle(report.status, report.result)
              const propertyName = report.propertyName || report.property?.name || 'N/A'
              const unitNumber = report.unit?.unitNumber || 'All Units'
              const inspectorName = report.inspectorName || report.inspector?.name || 'N/A'
              const dateStr = report.inspectionDate || report.scheduledDate
              return (
                <Card key={report._id || report.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{propertyName}</h3>
                      <p className="text-sm text-gray-600">{unitNumber}</p>
                      <p className="text-sm text-gray-600">{inspectorName} • {formatDate(dateStr)}</p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusStyle.bg}`}>
                      <span className={`text-xs font-semibold ${statusStyle.color}`}>
                        {report.result || report.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handlePreview(report._id)}
                      className="flex-1 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm"
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={() => handleExport(report._id)}
                      className="flex-1 bg-[#006795] hover:bg-[#0A5670] text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => handleShare(report._id)}
                      className="flex-1 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm"
                    >
                      Share
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </ManagementDashboardLayout>
  )
}

