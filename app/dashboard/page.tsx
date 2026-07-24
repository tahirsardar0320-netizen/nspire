"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import {
  RequestInspectionModal,
  AddPropertyModal,
  BuildingDivisionModal,
  ActionModal,
  CoverageSelectionModal,
  EditPropertyModal,
  SummaryModal
} from "@/components/PropertyModals"
import { propertiesAPI } from "@/lib/api"
import { fetchPropertyProgressMap } from "@/lib/inspectionProgress"
import { Country, State, City } from 'country-state-city'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showBuildingDivisionModal, setShowBuildingDivisionModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showCoverageModal, setShowCoverageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [newPropertyData, setNewPropertyData] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({})
  const [lockedProperties, setLockedProperties] = useState<Record<string, boolean>>({})
  // The one property that is currently being inspected (all others get locked)
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null)
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allIds = properties.map(p => p._id || p.propertyId)
  const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.has(id))
  const someSelected = allIds.some(id => selectedIds.has(id))

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(allIds))
    }
  }

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Location data from country-state-city package
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  // Load countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries()
    const allowedCountries = ['United States', 'Canada', 'United Kingdom', 'Australia']
    const filteredCountries = allCountries.filter(country =>
      allowedCountries.includes(country.name)
    )
    setCountries(filteredCountries)
  }, [])

  // Handle country change
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName)
    setSelectedState("")
    setSelectedCity("")

    const country = countries.find(c => c.name === countryName)
    if (country) {
      const countryStates = State.getStatesOfCountry(country.isoCode)
      setStates(countryStates)
    } else {
      setStates([])
    }
    setCities([])
  }

  // Handle state change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName)
    setSelectedCity("")

    const country = countries.find(c => c.name === selectedCountry)
    const state = states.find(s => s.name === stateName)

    if (country && state) {
      const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode)
      setCities(stateCities)
    } else {
      setCities([])
    }
  }

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties()
  }, [])

  // Auto-clear active inspection lock when the active property reaches 100%
  useEffect(() => {
    if (!activeInspectionId || Object.keys(propertyProgress).length === 0) return
    if (propertyProgress[activeInspectionId] === 100) {
      clearActiveInspection(activeInspectionId)
    }
  }, [propertyProgress, activeInspectionId])

  // Sync active inspection + lock state on mount or when properties/progress change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Read the currently active inspection
      const savedActive = localStorage.getItem('active_inspection_property')
      
      // Auto-release active inspection lock if the property doesn't exist in properties list anymore (only after loading finishes)
      let actualActive = savedActive
      if (savedActive && !loading && properties.length > 0) {
        const activeExists = properties.some(p => (p._id || p.propertyId) === savedActive)
        if (!activeExists) {
          localStorage.removeItem('active_inspection_property')
          actualActive = null
        }
      }
      setActiveInspectionId(actualActive)

      const lockMap: Record<string, boolean> = {}
      properties.forEach(p => {
        const pid = p._id || p.propertyId
        if (!pid) return
        // A property is locked if there is an active inspection on a DIFFERENT property
        const isOtherActive = actualActive && actualActive !== pid
        lockMap[pid] = !!isOtherActive
      })
      setLockedProperties(lockMap)
    }
  }, [properties, loading])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getAll({
        search: searchQuery || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
      })
      if (response && response.success && response.properties) {
        setProperties(response.properties)
        localStorage.setItem('cached_properties', JSON.stringify(response.properties))
        // Fetch progress for these properties
        if (response.properties.length > 0) {
          fetchProgress(response.properties)
        }
        setSelectedIds(new Set()) // clear selection on refresh
      } else {
        const cached = localStorage.getItem('cached_properties')
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            setProperties(parsed)
            fetchProgress(parsed)
          } catch (e) {}
        }
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error)
      const cached = localStorage.getItem('cached_properties')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          setProperties(parsed)
          fetchProgress(parsed)
        } catch (e) {
          setProperties([])
        }
      } else {
        setProperties([])
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (propertyList: any[]) => {
    const progressMap = await fetchPropertyProgressMap(propertyList, API_URL)
    setPropertyProgress(progressMap)
  }

  const handleSearch = () => {
    fetchProperties()
    toast.info("Searching properties...", { position: "top-right" })
  }

  const handleHoldInspection = (property: any) => {
    const pid = property._id || property.propertyId
    if (pid) {
      clearActiveInspection(pid)
    }
    toast.info(`Inspection for ${property.name} put on hold`, { position: "top-right" })
  }

  const handleRemoveProperty = async (property: any) => {
    if (confirm(`Are you sure you want to remove ${property.name}?`)) {
      try {
        const response = await propertiesAPI.delete(property._id)
        if (response.success) {
          setSelectedIds(prev => {
            const next = new Set(prev)
            next.delete(property._id)
            return next
          })
          toast.success("Property removed successfully", { position: "top-right" })
          fetchProperties()
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to remove property")
      }
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Delete ${selectedIds.size} selected ${selectedIds.size === 1 ? 'property' : 'properties'}? This cannot be undone.`)) return
    try {
      await Promise.all(Array.from(selectedIds).map(id => propertiesAPI.delete(id)))
      toast.success(`${selectedIds.size} ${selectedIds.size === 1 ? 'property' : 'properties'} deleted`, { position: "top-right" })
      setSelectedIds(new Set())
      fetchProperties()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete selected properties")
    }
  }

  const handleAddPropertyNext = (data: any) => {
    // Store the property data and show the building division modal
    const propData = Array.isArray(data) ? data[0] : data
    setNewPropertyData(propData)
    setShowAddPropertyModal(false)
    setShowBuildingDivisionModal(true)
  }

  const handleBuildingUpdate = async (data: any, buildings: { name: string; units: number }[]) => {
    try {
      const response = await propertiesAPI.create({
        propertyId: data.propertyId,
        name: data.propertyName || data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        buildings: buildings.length,
        units: buildings.reduce((sum, b) => sum + b.units, 0),
      })
      if (response.success) {
        toast.success("Data saved successfully", { position: "top-right" })

        // Save custom building names to localStorage
        const propId = response.property?._id || data.propertyId
        if (propId) {
          const namesMap: Record<string, string> = {}
          buildings.forEach((b, i) => {
            namesMap[`B${i + 1}`] = b.name
          })
          localStorage.setItem(`buildingNames_${propId}`, JSON.stringify(namesMap))
        }

        fetchProperties()
        setNewPropertyData(response.property || data)
        setShowBuildingDivisionModal(false)
        setShowActionModal(true)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add property. Please try again.", { position: "top-right" })
    }
  }

  const handleEditProperty = () => {
    setShowActionModal(false)
    setShowEditModal(true)
  }

  const handleActionStartInspection = () => {
    setShowActionModal(false)

    const prop = newPropertyData || selectedProperty
    const propId = prop?._id || prop?.id || 'new'

    // Block if another property is already being inspected
    if (typeof window !== 'undefined' && propId !== 'new') {
      const currentActive = localStorage.getItem('active_inspection_property')
      if (currentActive && currentActive !== propId) {
        toast.error('Another property is currently being inspected. Please complete or hold it first.', { position: 'top-right' })
        return
      }
    }

    // Check if there is already a saved coverage for this property
    if (typeof window !== 'undefined' && propId !== 'new') {
      const saved = localStorage.getItem(`property_coverage_${propId}`)
      if (saved) {
        try {
          const { coverage, calculatedUnits } = JSON.parse(saved)
          // Mark as active inspection (locks all others)
          activateInspection(propId)
          router.push(
            `/dashboard/property-details/${propId}?coverage=${coverage}&calculatedUnits=${calculatedUnits}`
          )
          return
        } catch (e) {
          console.error('Error parsing saved coverage:', e)
        }
      }
    }

    setShowCoverageModal(true)
  }

  // Set a property as the active inspection — locks all others
  const activateInspection = (propId: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('active_inspection_property', propId)
    setActiveInspectionId(propId)
    // Lock all other properties immediately
    const lockMap: Record<string, boolean> = {}
    properties.forEach(p => {
      const pid = p._id || p.propertyId
      if (pid) lockMap[pid] = pid !== propId
    })
    setLockedProperties(lockMap)
  }

  // Clear the active inspection lock — called when inspection reaches 100%
  const clearActiveInspection = (propId: string) => {
    if (typeof window === 'undefined') return
    const current = localStorage.getItem('active_inspection_property')
    if (current === propId) {
      localStorage.removeItem('active_inspection_property')
      setActiveInspectionId(null)
      // Unlock all properties
      const lockMap: Record<string, boolean> = {}
      properties.forEach(p => {
        const pid = p._id || p.propertyId
        if (pid) {
          lockMap[pid] = false
        }
      })
      setLockedProperties(lockMap)
    }
  }

  const handleCoverageStart = (coverage: string, calculatedUnits: number) => {
    setShowCoverageModal(false)
    const prop = newPropertyData || selectedProperty
    const propId = prop?._id || prop?.id || 'new'

    if (typeof window !== 'undefined' && propId !== 'new') {
      localStorage.setItem(`property_coverage_${propId}`, JSON.stringify({ coverage, calculatedUnits }))
      // Mark this property as the active inspection (lock all others)
      activateInspection(propId)
    }

    router.push(
      `/dashboard/property-details/${propId}?coverage=${coverage}&calculatedUnits=${calculatedUnits}`
    )
  }

  const handleInitiate = (property: any) => {
    setSelectedProperty(property)
    setNewPropertyData(property)
    setShowActionModal(true)
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#EBF5FB] p-4 sm:p-6 lg:p-8 font-lexend">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient tracking-tight">Property Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your properties and initiate inspections</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button
            onClick={() => setShowAddPropertyModal(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm shadow-md transition-all duration-200 flex items-center gap-2 border-0"
          >
            Add New Property
          </Button>
          {selectedIds.size > 0 && (
            <Button
              onClick={handleDeleteSelected}
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm shadow-md transition-all duration-200 flex items-center gap-2 border-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedIds.size})
            </Button>
          )}
        </div>

        {/* Properties Section */}
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Your Properties</h2>
            <span className="text-xs font-semibold text-slate-500">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>

          {/* Properties Table - Desktop */}
          <div className="hidden md:block rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center gap-3">
                <svg className="w-8 h-8 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading properties...
              </div>
            ) : properties.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No properties found. Add your first property!</div>
            ) : (
              <table className="w-full table-fixed">
                <thead className="bg-slate-50/75 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected && !allSelected }}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[12%]">Property ID</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[16%]">Property Name</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[8%]">Buildings</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[7%]">Units</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[12%]">Address</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[9%]">City</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[7%]">State</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[7%]">Zip</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[10%]">Progress</th>
                    <th className="text-center py-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[16%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((property) => {
                    const pid = property._id || property.propertyId
                    const isChecked = selectedIds.has(pid)
                    return (
                    <tr
                      key={pid}
                      className={`transition-colors duration-150 ${isChecked ? 'bg-teal-50/60 ring-1 ring-inset ring-teal-200' : 'hover:bg-slate-50/50'}`}
                    >
                      {/* Checkbox column */}
                      <td className="py-4 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOne(pid)}
                          className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="text-sky-700 font-bold text-[10px] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded truncate block mx-auto w-fit font-mono">
                          {property.propertyId}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="font-bold text-slate-800 text-sm truncate block">{property.name}</span>
                      </td>
                      <td className="py-4 px-3 text-slate-700 font-semibold text-sm text-center">{property.buildings}</td>
                      <td className="py-4 px-3 text-slate-700 font-semibold text-sm text-center">{property.units}</td>
                      <td className="py-4 px-3 text-slate-500 text-xs truncate text-center font-medium">{property.address}</td>
                      <td className="py-4 px-3 text-slate-500 text-xs truncate text-center font-medium">{property.city}</td>
                      <td className="py-4 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 truncate">
                          {property.state}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-slate-500 font-mono text-xs text-center font-medium">{property.zipCode}</td>
                      <td className="py-4 px-3">
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${propertyProgress[pid] || 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 block text-center">
                          {propertyProgress[pid] || 0}%
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center justify-center gap-2">
                          {propertyProgress[pid] === 100 ? (
                            <button
                              disabled
                              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg whitespace-nowrap cursor-not-allowed border-0 shadow-sm"
                            >
                              Completed
                            </button>
                          ) : activeInspectionId === pid ? (
                            <button
                              onClick={() => handleInitiate(property)}
                              className="px-2 py-1.5 text-[11px] font-bold text-white bg-[#006795] hover:bg-[#0a5670] rounded-lg whitespace-nowrap transition-colors border-0 shadow-sm"
                            >
                              In Progress
                            </button>
                          ) : lockedProperties[pid] ? (
                            <button
                              disabled
                              className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed border-0 shadow-sm"
                              title={activeInspectionId && activeInspectionId !== pid ? 'Another property is currently being inspected' : 'Locked'}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              Locked
                            </button>
                          ) : (
                            <button
                              onClick={() => handleInitiate(property)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm shadow-teal-600/10 border-0"
                            >
                              Initiate
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveProperty(property)}
                            className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100/50 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>

                    </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Properties Cards - Mobile & Tablet */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center justify-center gap-3">
                <svg className="w-8 h-8 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading properties...
              </div>
            ) : properties.map((property) => {
              const pid = property._id || property.propertyId
              return (
                  <Card key={pid} className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sky-700 font-bold text-xs bg-sky-50 border border-sky-100 px-2 py-0.5 rounded font-mono">
                            {property.propertyId}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {property.state}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1">{property.name}</h3>
                        <p className="text-slate-500 text-xs font-medium">{property.address}</p>
                      </div>
                      {propertyProgress[pid] === 100 ? (
                        <button
                          disabled
                          className="bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs cursor-not-allowed whitespace-nowrap ml-2 border-0 shadow-sm"
                        >
                          Completed
                        </button>
                      ) : activeInspectionId === pid ? (
                        <Button
                          onClick={() => handleInitiate(property)}
                          className="bg-[#006795] hover:bg-[#0a5670] text-white font-bold px-3 py-2 rounded-xl text-xs whitespace-nowrap ml-2 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          In Progress
                        </Button>
                      ) : lockedProperties[pid] ? (
                        <button
                          disabled
                          className="bg-rose-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed whitespace-nowrap ml-2 border-0 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Locked
                        </button>
                      ) : (
                        <Button
                          onClick={() => handleInitiate(property)}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap ml-2 border-0"
                        >
                          Initiate
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Buildings</span>
                        <p className="font-bold text-slate-800 text-sm">{property.buildings}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Units</span>
                        <p className="font-bold text-slate-800 text-sm">{property.units}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">City</span>
                        <p className="font-bold text-slate-800 text-sm">{property.city}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Zip Code</span>
                        <p className="font-bold text-slate-800 text-sm font-mono">{property.zipCode}</p>
                      </div>
                      <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Progress</span>
                          <span className="text-teal-600 font-bold text-xs">{propertyProgress[pid] || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${propertyProgress[pid] || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <RequestInspectionModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onNext={handleAddPropertyNext}
      />
      <BuildingDivisionModal
        isOpen={showBuildingDivisionModal}
        onClose={() => setShowBuildingDivisionModal(false)}
        onUpdate={handleBuildingUpdate}
        propertyData={newPropertyData}
      />
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onEdit={handleEditProperty}
        onViewSummary={() => {
          setShowActionModal(false)
          setShowSummaryModal(true)
        }}
        onStartInspection={handleActionStartInspection}
        onHoldInspection={() => selectedProperty && handleHoldInspection(selectedProperty)}
        onRemoveProperty={() => selectedProperty && handleRemoveProperty(selectedProperty)}
        propertyData={newPropertyData}
      />
      <CoverageSelectionModal
        isOpen={showCoverageModal}
        onClose={() => setShowCoverageModal(false)}
        onStartInspection={handleCoverageStart}
        propertyData={newPropertyData}
      />
      <EditPropertyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchProperties}
        propertyData={newPropertyData}
      />
      <SummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        propertyData={newPropertyData}
      />
    </DashboardLayout>
  )
}
