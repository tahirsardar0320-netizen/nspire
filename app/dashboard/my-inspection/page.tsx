"use client"

import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { propertiesAPI } from "@/lib/api"
import { fetchPropertyProgressMap } from "@/lib/inspectionProgress"
import { UnitSelectionModal } from "@/components/UnitSelectionModal"
import { ActionModal, EditPropertyModal, SummaryModal } from "@/components/PropertyModals"
import { Country, State, City } from 'country-state-city'

export default function MyInspection() {
  const router = useRouter()
  const [propertyName, setPropertyName] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unitSelectionOpen, setUnitSelectionOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [summaryModalOpen, setSummaryModalOpen] = useState(false)
  const [lockedProperties, setLockedProperties] = useState<Record<string, boolean>>({})
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({})
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null)

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Location data
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    const allowedCountries = ['US', 'CA', 'GB', 'AU']
    const allCountries = Country.getAllCountries()
    const filteredCountries = allCountries
      .filter(country => allowedCountries.includes(country.isoCode))
      .sort((a, b) => a.name.localeCompare(b.name))
    setCountries(filteredCountries)
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      setSelectedState('')
      setSelectedCity('')
      setCities([])
      const countryStates = State.getStatesOfCountry(selectedCountry)
      setStates(countryStates.sort((a, b) => a.name.localeCompare(b.name)))
    } else {
      setStates([])
      setCities([])
    }
  }, [selectedCountry])

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setSelectedCity('')
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState)
      setCities(stateCities.sort((a, b) => a.name.localeCompare(b.name)))
    } else {
      setCities([])
    }
  }, [selectedCountry, selectedState])

  const handleUnitSelectionContinue = (selectedUnits: string[]) => {
    setUnitSelectionOpen(false)
    localStorage.setItem('selectedUnits', JSON.stringify(selectedUnits))
    toast.success(`${selectedUnits.length} units selected for inspection`, { position: "top-right", autoClose: 2000 })
    router.push('/dashboard/inspection/summary')
  }

  useEffect(() => { fetchProperties() }, [])

  // Sync active inspection + lock state on mount or when properties/progress change
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        search: propertyName || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
      })
      if (response.success) {
        setProperties(response.properties)
        setSelectedIds(new Set()) // clear selection on refresh
        fetchProgress(response.properties)
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error)
      toast.error("Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (propertyList: any[]) => {
    const progressMap = await fetchPropertyProgressMap(propertyList, process.env.NEXT_PUBLIC_API_URL || '')
    setPropertyProgress(progressMap)
  }


  const handleEditProperty = () => {
    setActionModalOpen(false)
    setEditModalOpen(true)
  }

  const activateInspection = (propId: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('active_inspection_property', propId)
    setActiveInspectionId(propId)
    const lockMap: Record<string, boolean> = {}
    properties.forEach(p => {
      const pid = p._id || p.propertyId
      if (pid) lockMap[pid] = pid !== propId
    })
    setLockedProperties(lockMap)
  }

  const clearActiveInspection = (propId: string) => {
    if (typeof window === 'undefined') return
    const current = localStorage.getItem('active_inspection_property')
    if (current === propId) {
      localStorage.removeItem('active_inspection_property')
      setActiveInspectionId(null)
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

  const handleActionStartInspection = () => {
    setActionModalOpen(false)
    if (!selectedProperty) return

    const propId = selectedProperty._id || selectedProperty.propertyId

    // Block if another property is already being inspected
    if (typeof window !== 'undefined' && propId) {
      const currentActive = localStorage.getItem('active_inspection_property')
      if (currentActive && currentActive !== propId) {
        toast.error('Another property is currently being inspected. Please complete or hold it first.', { position: 'top-right' })
        return
      }
      activateInspection(propId)
    }

    router.push(`/dashboard/property-details/${propId}`)
  }

  const handleHoldInspection = async () => {
    if (!selectedProperty) return
    const pid = selectedProperty._id || selectedProperty.propertyId
    if (pid) {
      clearActiveInspection(pid)
    }
    try {
      const response = await propertiesAPI.hold(selectedProperty._id)
      if (response.success) {
        toast.success(response.message, { position: "top-right" })
        fetchProperties()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to hold inspection")
    } finally {
      setActionModalOpen(false)
    }
  }

  const handleRemoveProperty = async () => {
    if (!selectedProperty) return
    if (confirm(`Are you sure you want to remove ${selectedProperty.name}?`)) {
      try {
        const response = await propertiesAPI.delete(selectedProperty._id)
        if (response.success) {
          toast.success("Property removed successfully", { position: "top-right" })
          fetchProperties()
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to remove property")
      } finally {
        setActionModalOpen(false)
      }
    }
  }

  // ── Multi-select helpers ──────────────────────────────
  const allIds = properties.map(p => p._id)
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

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Delete ${selectedIds.size} selected ${selectedIds.size === 1 ? 'property' : 'properties'}? This cannot be undone.`)) return
    try {
      await Promise.all(Array.from(selectedIds).map(id => propertiesAPI.delete(id)))
      toast.success(`${selectedIds.size} ${selectedIds.size === 1 ? 'property' : 'properties'} deleted`, { position: "top-right" })
      fetchProperties()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete selected properties")
    }
  }

  const handleInitiate = (property: any) => {
    const pid = property._id || property.propertyId
    if (typeof window !== 'undefined' && pid) {
      const currentActive = localStorage.getItem('active_inspection_property')
      if (currentActive && currentActive !== pid) {
        toast.error('Another property is currently being inspected. Please complete or hold it first.', { position: 'top-right' })
        return
      }
    }
    setSelectedProperty(property)
    setActionModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#EBF5FB] p-4 sm:p-6 lg:p-8 font-lexend">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient tracking-tight">My Inspections</h1>
          <p className="text-slate-500 text-sm mt-1">Review, manage, and download your completed property inspection reports</p>
        </div>

        {/* Properties Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 sm:p-6">

          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-extrabold text-slate-800">Your Properties</h2>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow-md transition-all duration-200 flex items-center gap-2 border-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected ({selectedIds.size})
                </Button>
              )}
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm shadow-md transition-all duration-200 flex items-center gap-2 border-0"
              >
                Add New Property
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                <svg className="w-8 h-8 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading properties...
              </div>
            ) : properties.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium">No properties found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    {/* Select-all checkbox */}
                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected && !allSelected }}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Property ID</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Property Name</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Address</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">State/Province</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">City/Area</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Postal Code</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Buildings</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Units</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((property) => {
                    const pid = property._id || property.propertyId
                    const isChecked = selectedIds.has(pid)
                    return (
                      <tr
                        key={pid}
                        className={`transition-colors duration-150 ${isChecked ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}`}
                      >
                        {/* Row checkbox */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleOne(pid)}
                            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-sky-600 font-semibold text-xs hover:underline cursor-pointer">
                            {property.propertyId || property._id?.slice(-8)?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-slate-800 text-sm">{property.name}</td>
                        <td className="py-4 px-4 text-center text-slate-500 text-xs truncate max-w-[140px]" title={property.address}>{property.address}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {property.state}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-500 text-xs">{property.city}</td>
                        <td className="py-4 px-4 text-center text-slate-500 text-xs font-mono">{property.zipCode}</td>
                        <td className="py-4 px-4 text-center font-semibold text-slate-700">{property.buildings || 1}</td>
                        <td className="py-4 px-4 text-center font-semibold text-slate-700">{property.units || 1}</td>
                        <td className="py-4 px-4 text-center">
                          {propertyProgress[pid] === 100 ? (
                            <button
                              disabled
                              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed mx-auto border-0 shadow-sm"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Completed
                            </button>
                          ) : activeInspectionId === pid ? (
                            <button
                              onClick={() => handleInitiate(property)}
                              className="px-4 py-1.5 text-[11px] font-bold text-white bg-[#006795] hover:bg-[#0a5670] rounded-lg whitespace-nowrap mx-auto border-0 shadow-sm transition-colors"
                            >
                              In Progress
                            </button>
                          ) : lockedProperties[pid] ? (
                            <button
                              disabled
                              className="px-4 py-1.5 text-xs font-bold text-white bg-rose-500 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed mx-auto border-0 shadow-sm"
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
                              className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-sm border-0"
                            >
                              Initiate
                            </button>
                          )}
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onEdit={handleEditProperty}
        onViewSummary={() => {
          setActionModalOpen(false)
          setSummaryModalOpen(true)
        }}
        onStartInspection={handleActionStartInspection}
        onHoldInspection={handleHoldInspection}
        onRemoveProperty={handleRemoveProperty}
        propertyData={selectedProperty}
      />

      <UnitSelectionModal
        isOpen={unitSelectionOpen}
        onClose={() => setUnitSelectionOpen(false)}
        onContinue={handleUnitSelectionContinue}
        totalUnits={selectedProperty?.units || 20}
      />

      <EditPropertyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={fetchProperties}
        propertyData={selectedProperty}
      />
      <SummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        propertyData={selectedProperty}
      />
    </DashboardLayout>
  )
}
