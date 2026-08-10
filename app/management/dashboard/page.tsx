"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ManagementDashboardLayout from "@/components/ManagementDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { propertiesAPI } from "@/lib/api"
import { Country, State, City, IState, ICity } from "country-state-city"
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
}

const ALLOWED_COUNTRIES = [
  { isoCode: "AU", name: "Australia" },
  { isoCode: "CA", name: "Canada" },
  { isoCode: "GB", name: "United Kingdom" },
  { isoCode: "US", name: "United States" },
]

export default function ManagementDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [states, setStates] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newPropertyData, setNewPropertyData] = useState<any>(null)

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry)
      setStates(countryStates)
      setSelectedState("")
      setSelectedCity("")
      setCities([])
    } else {
      setStates([])
      setSelectedState("")
      setSelectedCity("")
      setCities([])
    }
  }, [selectedCountry])

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState)
      setCities(stateCities)
      setSelectedCity("")
    } else {
      setCities([])
      setSelectedCity("")
    }
  }, [selectedCountry, selectedState])

  const fetchProperties = async (params?: any) => {
    try {
      setLoading(true)
      const queryParams: any = { limit: 50 }
      if (params?.search) queryParams.search = params.search
      if (params?.country) queryParams.country = params.country
      if (params?.state) queryParams.state = params.state
      if (params?.city) queryParams.city = params.city

      const response = await propertiesAPI.getAll(queryParams)
      if (response.success) {
        setProperties(response.properties || [])
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      // Use mock data if API fails
      setProperties([
        {
          _id: "1",
          propertyId: "80000017",
          name: "STEPHEN'S PARK APA...",
          buildings: [],
          units: [],
          address: "3200 LATO...",
          city: "Anchorage",
          state: "Alaska",
          zipCode: "99508"
        },
        {
          _id: "2",
          propertyId: "QC 2016E7EF",
          name: "Demure St-Hilaire",
          buildings: [],
          units: [],
          address: "21 Rue Messier",
          city: "Mont-Saint...",
          state: "QC",
          zipCode: "J3SLI3"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleSearch = () => {
    const stateObj = states.find(s => s.isoCode === selectedState)
    const countryObj = ALLOWED_COUNTRIES.find(c => c.isoCode === selectedCountry)
    fetchProperties({
      search: searchQuery,
      country: countryObj?.name || "",
      state: stateObj?.name || selectedState,
      city: selectedCity
    })
    toast.info("Searching properties...", { position: "top-right" })
  }

  const handleInitiate = (property: Property) => {
    toast.success(`Inspection initiated for ${property.name}`, {
      position: "top-right",
      autoClose: 2000,
    })
    router.push('/management/dashboard/unit-selection?property=' + property.propertyId)
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

  const handleHoldInspection = () => {
    toast.info(`Inspection for ${newPropertyData?.name || 'property'} put on hold`, { position: 'top-right' })
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
      <div className="p-3 sm:p-4 md:p-6">
        {/* Inspection Overview Section */}
        <Card className="bg-gradient-to-r from-[#006795] to-[#0A5670] rounded-lg shadow-sm p-4 sm:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-white">
              <h2 className="text-lg sm:text-xl font-bold mb-1">Inspection Overview</h2>
              <p className="text-sm text-white/80">Start a new inspection by adding a property</p>
            </div>
            <Button
              onClick={() => setShowAddPropertyModal(true)}
              className="w-full sm:w-auto bg-[#006795] hover:bg-[#00567a] text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Inspection
            </Button>
          </div>
        </Card>

        <div className="flex flex-col gap-3 mb-4 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Search By Name, City Or State</h1>
        </div>

        {/* Search Filters */}
        <Card className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Property Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter property name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795] text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                placeholder="Enter Country"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795] bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                placeholder="Enter State"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795] bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter City"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795] bg-white text-sm"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-[#006795] hover:bg-[#0A5670] text-white font-semibold py-2.5 rounded-lg text-sm"
              >
                Search Properties
              </Button>
            </div>
          </div>

          {/* Properties Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Property ID</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Property Name</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">No of Building</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">No of Units</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Address</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">City</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">State</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Zip Code</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Select</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">Loading properties...</td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">No properties found.</td>
                  </tr>
                ) : (
                  properties.map((property) => (
                    <tr key={property._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 text-center">
                        <span className="text-[#006795] font-medium">{property.propertyId}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-900 text-center">{property.name}</td>
                      <td className="py-4 px-4 text-gray-900 text-center">{property.buildings?.length || 0}</td>
                      <td className="py-4 px-4 text-gray-900 text-center">{property.units?.length || 0}</td>
                      <td className="py-4 px-4 text-gray-900 text-center">{property.address}</td>
                      <td className="py-4 px-4 text-gray-900 text-center">{property.city}</td>
                      <td className="py-4 px-4 text-gray-900 text-center">{property.state}</td>
                      <td className="py-4 px-4 text-gray-900 text-center">{property.zipCode}</td>
                      <td className="py-4 px-4">
                        <Button
                          onClick={() => handleInitiate(property)}
                          className="bg-[#006795] hover:bg-[#00567a] text-white font-semibold px-4 py-2 rounded-lg text-sm"
                        >
                          Initiate
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Properties Cards - Mobile & Tablet */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No properties found.</div>
            ) : (
              properties.map((property) => (
                <Card key={property._id} className="p-4 bg-gray-50 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[#006795] font-semibold text-sm">#{property.propertyId}</span>
                      <h3 className="text-base font-bold text-gray-900 mt-1">{property.name}</h3>
                    </div>
                  </div>

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
                      <span className="text-gray-500">Address:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.address}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">City:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.city}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">State:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.state}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Zip:</span>
                      <span className="ml-1 font-medium text-gray-900">{property.zipCode}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleInitiate(property)}
                    className="w-full bg-[#006795] hover:bg-[#00567a] text-white font-semibold py-2 rounded-lg text-sm"
                  >
                    Initiate
                  </Button>
                </Card>
              ))
            )}
          </div>
        </Card>
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
        onStartInspection={() => { setShowActionModal(false); newPropertyData && handleInitiate(newPropertyData) }}
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
    </ManagementDashboardLayout>
  )
}
