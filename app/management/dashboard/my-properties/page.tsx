"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ManagementDashboardLayout from "@/components/ManagementDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { propertiesAPI } from "@/lib/api"
import { 
  AddPropertyModal, 
  ActionModal, 
  EditPropertyModal 
} from "@/components/PropertyModals"

interface Property {
  _id: string;
  propertyId: string;
  name: string;
  buildings: any[];
  units: any[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
}

export default function MyProperties() {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newPropertyData, setNewPropertyData] = useState<any>(null)
  const [showUnitSelectionModal, setShowUnitSelectionModal] = useState(false)
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [demoUnits] = useState([
    "Unit 101", "Unit 102", "Unit 103", "Unit 104", "Unit 105",
    "Unit 201", "Unit 202", "Unit 203", "Unit 204", "Unit 205",
    "Unit 301", "Unit 302", "Unit 303", "Unit 304", "Unit 305",
    "Unit 401", "Unit 402", "Unit 403", "Unit 404", "Unit 405"
  ])

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getAll({ limit: 50 })
      if (response.success) {
        setProperties(response.properties || [])
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties', { position: "top-right" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600'
      case 'hold':
        return 'text-blue-600'
      case 'pending':
        return 'text-red-500'
      default:
        return 'text-gray-600'
    }
  }

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === properties.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(properties.map(p => p._id))
    }
  }

  const handleAddPropertyNext = async (data: any) => {
    try {
      if (Array.isArray(data)) {
        const response = await propertiesAPI.createBulk(
          data.map((p: any) => ({
            propertyId: p.propertyId,
            name: p.propertyName,
            address: p.address,
            city: p.city,
            state: p.state,
            zipCode: p.zipCode,
            buildings: parseInt(p.buildings) || 0,
            units: parseInt(p.units) || 0,
          }))
        )
        if (response.success) {
          toast.success(`${response.properties?.length || data.length} properties added successfully!`, { position: "top-right" })
          fetchProperties()
          setNewPropertyData(response.properties?.[0] || data[0])
          setShowAddPropertyModal(false)
          setShowActionModal(true)
        }
      } else {
        const response = await propertiesAPI.create({
          propertyId: data.propertyId,
          name: data.propertyName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          buildings: parseInt(data.buildings) || 0,
          units: parseInt(data.units) || 0,
        })
        if (response.success) {
          toast.success("Property added successfully!", { position: "top-right" })
          fetchProperties()
          setNewPropertyData(response.property)
          setShowAddPropertyModal(false)
          setShowActionModal(true)
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add property. Please try again.", { position: "top-right" })
    }
  }

  const handleEditProperty = () => {
    setShowActionModal(false)
    setShowEditModal(true)
  }

  const handleOpenActionModal = (property: Property) => {
    setNewPropertyData(property)
    setShowActionModal(true)
  }

  const handleHoldInspection = () => {
    toast.info(`Inspection for ${newPropertyData?.name || 'property'} put on hold`, { position: 'top-right' })
    setShowActionModal(false)
  }

  const handleStartInspection = () => {
    setShowActionModal(false)
    if (newPropertyData) {
      router.push(`/management/dashboard/unit-selection?property=${newPropertyData.propertyId}`)
    }
  }

  const handleRemoveProperty = async () => {
    if (!newPropertyData?._id) return
    if (!confirm(`Remove "${newPropertyData?.name}"? This cannot be undone.`)) return
    try {
      const response = await propertiesAPI.delete(newPropertyData._id)
      if (response.success) {
        toast.success('Property removed', { position: 'top-right' })
        setShowActionModal(false)
        fetchProperties()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove property')
    }
  }

  return (
    <ManagementDashboardLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Properties</h1>
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => setShowUnitSelectionModal(true)}
                    className="w-full sm:w-auto bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-6 py-3 rounded-lg"
                  >
                    Select Units for Inspection
                  </Button>
                <Button
                  onClick={() => setShowAddPropertyModal(true)}
                  className="w-full sm:w-auto bg-[#F84B5F] hover:bg-[#EE3646] text-white font-semibold px-6 py-3 rounded-lg"
                >
                  Add Property
                </Button>
              </div>
            </div>

        {/* Desktop Table View */}
        <Card className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === properties.length && properties.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Property ID</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Property Name</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">No of Building</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">No of Units</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">City</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">State</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Zip Code</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500">Loading properties...</td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500">No properties found.</td>
                  </tr>
                ) : (
                properties.map((property) => (
                  <tr key={property._id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(property._id)}
                        onChange={() => handleRowSelect(property._id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => router.push(`/management/dashboard/unit-selection?property=${property.propertyId}`)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {property.propertyId}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-gray-900">{property.name}</td>
                    <td className="py-4 px-4 text-gray-900">{property.buildings?.length || 0}</td>
                    <td className="py-4 px-4 text-gray-900">{property.units?.length || 0}</td>
                    <td className="py-4 px-4 text-gray-900">{property.city}</td>
                    <td className="py-4 px-4 text-gray-900">{property.state}</td>
                    <td className="py-4 px-4 text-gray-900">{property.zipCode}</td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold text-sm ${getStatusColor(property.status)}`}>
                        {property.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleOpenActionModal(property)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Actions"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No properties found.</div>
          ) : (
          properties.map((property) => (
            <Card key={property._id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(property._id)}
                  onChange={() => handleRowSelect(property._id)}
                  className="w-4 h-4 rounded border-gray-300 mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <button
                      onClick={() => router.push(`/management/dashboard/unit-selection?property=${property.propertyId}`)}
                      className="text-blue-600 hover:underline font-semibold text-sm"
                    >
                      #{property.propertyId}
                    </button>
                    <span className={`font-semibold text-sm ${getStatusColor(property.status)}`}>
                      {property.status || 'Pending'}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-gray-900 mb-2">{property.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Buildings:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.buildings?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Units:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.units?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">City:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.city}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Zip:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.zipCode}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-3">
                    <span className="font-medium">State:</span> {property.state}
                  </div>
                  
                  <Button
                    onClick={() => router.push(`/management/dashboard/unit-selection?property=${property.propertyId}`)}
                    className="w-full bg-[#006795] hover:bg-[#0A5670] text-white font-medium py-2 rounded-lg text-sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
          )}
          </div>
        </div>

        <AddPropertyModal 
          isOpen={showAddPropertyModal} 
          onClose={() => setShowAddPropertyModal(false)}
          onNext={handleAddPropertyNext}
        />
        <ActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onEdit={handleEditProperty}
          onStartInspection={handleStartInspection}
          onHoldInspection={handleHoldInspection}
          onRemoveProperty={handleRemoveProperty}
          propertyData={newPropertyData}
        />
        <EditPropertyModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchProperties}
          propertyData={newPropertyData}
        />

        {/* Unit Selection Modal */}
        {showUnitSelectionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 relative">
                <button
                  onClick={() => {
                    setShowUnitSelectionModal(false)
                    setSelectedUnits([])
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Units for Inspection</h2>
                  <p className="text-gray-500">Choose the units you want to include in your inspection. You can select individual units or use random selection.</p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  <Button
                    onClick={() => setSelectedUnits([...demoUnits])}
                    className="bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={() => {
                      const shuffled = [...demoUnits].sort(() => Math.random() - 0.5)
                      setSelectedUnits(shuffled.slice(0, Math.floor(demoUnits.length * 0.3)))
                    }}
                    className="bg-[#F84B5F] hover:bg-[#E63946] text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Random Selection
                  </Button>
                </div>

                <div className="text-center mb-4">
                  <p className="text-gray-700 font-medium">Selected: {selectedUnits.length} of {demoUnits.length} units</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
                  {demoUnits.map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        setSelectedUnits(prev => 
                          prev.includes(unit) 
                            ? prev.filter(u => u !== unit) 
                            : [...prev, unit]
                        )
                      }}
                      className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedUnits.includes(unit)
                          ? 'bg-[#E8F4F8] border-[#006795] text-[#006795]'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      if (selectedUnits.length === 0) {
                        toast.warning("Please select at least one unit", { position: "top-right" })
                        return
                      }
                      toast.success(`${selectedUnits.length} units selected for inspection!`, { position: "top-right" })
                      setShowUnitSelectionModal(false)
                      setSelectedUnits([])
                    }}
                    className="bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-8 py-3 rounded-full min-w-[200px]"
                  >
                    Continue with {selectedUnits.length} Units
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ManagementDashboardLayout>
    )
  }
