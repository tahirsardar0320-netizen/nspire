"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { inspectionsAPI, propertiesAPI } from "@/lib/api"
import { Country, State, City } from 'country-state-city'
import * as XLSX from 'xlsx'

interface RequestInspectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestInspectionModal({ isOpen, onClose }: RequestInspectionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    purpose: "",
    email: "",
    hudFre: "",
    management: "",
    insurance: "",
    banker: "",
    buildings: "",
    units: "",
    state: "",
    zipCode: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await inspectionsAPI.createRequest({
        purpose: formData.purpose,
        hudPreNegative: formData.hudFre === 'yes',
        managementCompany: formData.management,
        insuranceCompany: formData.insurance,
        banker: formData.banker,
        buildings: parseInt(formData.buildings) || 0,
        units: parseInt(formData.units) || 0,
        state: formData.state,
        zipCode: formData.zipCode,
      })

      if (response.success) {
        toast.success("Inspection request submitted successfully!", { position: "top-right" })
        onClose()
        setFormData({
          purpose: "",
          email: "",
          hudFre: "",
          management: "",
          insurance: "",
          banker: "",
          buildings: "",
          units: "",
          state: "",
          zipCode: ""
        })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-lexend animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-content border border-slate-200/80 shadow-xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 mb-4 sm:mb-6 pr-8 tracking-tight">Request Inspection by a certified Inspector.</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Purpose of Inspection</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Enter purpose of inspection"
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">HUD Pre-Negative Inspection</label>
            <input
              type="text"
              value={formData.hudFre}
              onChange={(e) => setFormData({ ...formData, hudFre: e.target.value })}
              placeholder="Select option"
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Management Co./Assessment</label>
            <input
              type="text"
              value={formData.management}
              onChange={(e) => setFormData({ ...formData, management: e.target.value })}
              placeholder="Enter management company or assessment"
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Insurance Co / Risk Management</label>
              <input
                type="text"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                placeholder="Insurance company"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Banker / Sale</label>
              <input
                type="text"
                value={formData.banker}
                onChange={(e) => setFormData({ ...formData, banker: e.target.value })}
                placeholder="Banker or sale"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Number of buildings</label>
              <input
                type="text"
                value={formData.buildings}
                onChange={(e) => setFormData({ ...formData, buildings: e.target.value })}
                placeholder="e.g. 4"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Number of units</label>
              <input
                type="text"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                placeholder="e.g. 43"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State / City</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter state / city"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zip / Postal Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="Enter zip / postal code"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-center pt-4 border-t border-slate-100">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 border-0 shadow-md shadow-teal-600/10 transition-colors"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: (data: any) => void
}

interface PropertyFormData {
  propertyId?: string
  address: string
  propertyName: string
  country: string
  countryCode: string
  state: string
  stateCode: string
  buildings: string
  city: string
  units: string
  zipCode: string
}

const emptyPropertyForm: PropertyFormData = {
  propertyId: "",
  address: "",
  propertyName: "",
  country: "United States",
  countryCode: "US",
  state: "",
  stateCode: "",
  buildings: "",
  city: "",
  units: "",
  zipCode: ""
}

export function AddPropertyModal({ isOpen, onClose, onNext }: AddPropertyModalProps) {
  const [properties, setProperties] = useState<PropertyFormData[]>([{ ...emptyPropertyForm }])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Location data from country-state-city package
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    // Load only specific countries
    const allCountries = Country.getAllCountries()
    const allowedCountries = ['United States', 'Canada', 'United Kingdom', 'Australia']
    const filteredCountries = allCountries.filter(country =>
      allowedCountries.includes(country.name)
    )
    setCountries(filteredCountries)
  }, [])

  const updateProperty = (index: number, field: keyof PropertyFormData, value: string) => {
    const updated = [...properties]
    updated[index] = { ...updated[index], [field]: value }
    setProperties(updated)
  }

  const addNewProperty = () => {
    setProperties([...properties, { ...emptyPropertyForm }])
  }

  const removeProperty = (index: number) => {
    if (properties.length > 1) {
      setProperties(properties.filter((_, i) => i !== index))
    }
  }

  // File upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    const validTypes = [
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
      'text/csv'
    ]
    const validExtensions = ['.txt', '.xls', '.xlsx', '.pdf', '.csv']

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast.error("Please upload a .txt, .xls, .xlsx, .csv, or .pdf file", { position: "top-right" })
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      // For demo purposes, parse based on file type
      if (fileExtension === '.txt' || fileExtension === '.csv') {
        const text = await file.text()
        const parsedProperties = parseTextOrCSV(text)
        if (parsedProperties.length > 0) {
          setProperties(parsedProperties)
          toast.success(`Successfully imported ${parsedProperties.length} properties from file!`, { position: "top-right" })
        } else {
          toast.info("No property data found in file. Please check the format.", { position: "top-right" })
        }
      } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
        // Parse Excel file using xlsx library
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet)

        if (jsonData.length === 0) {
          toast.info("No data rows found in the Excel file.", { position: "top-right" })
        } else {
          const parsedProperties = parseExcelRows(jsonData)
          if (parsedProperties.length > 0) {
            setProperties(parsedProperties)
            toast.success(`Successfully imported ${parsedProperties.length} properties from Excel!`, { position: "top-right" })
          } else {
            toast.info("Could not match column headers. Expected: Property ID, Address, Property Name, State, City, Postal Code, Buildings, Units", { position: "top-right" })
          }
        }
      } else if (fileExtension === '.pdf') {
        toast.info("PDF files require server-side processing. Please use .xlsx or .csv format.", { position: "top-right" })
      }
    } catch (error) {
      toast.error("Error processing file. Please try again.", { position: "top-right" })
    } finally {
      setIsProcessing(false)
    }
  }

  const parseTextOrCSV = (text: string): PropertyFormData[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const properties: PropertyFormData[] = []
    const headers = lines[0].toLowerCase().split(/[,\t]/).map(h => h.trim())

    // Map common header names to our fields
    const fieldMapping: Record<string, keyof PropertyFormData> = {
      'property id': 'propertyId',
      'property id (optional)': 'propertyId',
      'propertyid': 'propertyId',
      'id': 'propertyId',
      'address': 'address',
      'property name': 'propertyName',
      'property nam': 'propertyName',
      'propertyname': 'propertyName',
      'name': 'propertyName',
      'country': 'country',
      'state': 'state',
      'province': 'state',
      'city': 'city',
      'area': 'city',
      'buildings': 'buildings',
      'building': 'buildings',
      'number of building': 'buildings',
      'number of buildings': 'buildings',
      'numberofbuilding': 'buildings',
      'numberofbuildings': 'buildings',
      'no of buildings': 'buildings',
      'units': 'units',
      'unit': 'units',
      'number of unit': 'units',
      'number of units': 'units',
      'numberofunit': 'units',
      'numberofunits': 'units',
      'no of units': 'units',
      'zip': 'zipCode',
      'zipcode': 'zipCode',
      'zip code': 'zipCode',
      'postal': 'zipCode',
      'postal code': 'zipCode',
      'postalcode': 'zipCode'
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[,\t]/).map(v => v.trim())
      if (values.length === 0 || (values.length === 1 && !values[0])) continue

      const property: PropertyFormData = { ...emptyPropertyForm }

      headers.forEach((header, index) => {
        const field = fieldMapping[header]
        if (field && values[index]) {
          property[field] = values[index]
        }
      })

      // Only add if at least property ID or name exists
      if (property.propertyId || property.propertyName) {
        properties.push(property)
      }
    }

    return properties
  }

  const clearUploadedFile = () => {
    setUploadedFile(null)
  }

  // Excel field mapping: maps lowercase/trimmed header names to PropertyFormData keys
  const excelFieldMapping: Record<string, keyof PropertyFormData> = {
    'property id': 'propertyId',
    'property id (optional)': 'propertyId',
    'propertyid': 'propertyId',
    'id': 'propertyId',
    'address': 'address',
    'property name': 'propertyName',
    'property nam': 'propertyName',
    'propertyname': 'propertyName',
    'name': 'propertyName',
    'country': 'country',
    'state': 'state',
    'province': 'state',
    'city': 'city',
    'area': 'city',
    'buildings': 'buildings',
    'building': 'buildings',
    'number of building': 'buildings',
    'number of buildings': 'buildings',
    'numberofbuilding': 'buildings',
    'numberofbuildings': 'buildings',
    'no of buildings': 'buildings',
    'units': 'units',
    'unit': 'units',
    'number of unit': 'units',
    'number of units': 'units',
    'numberofunit': 'units',
    'numberofunits': 'units',
    'no of units': 'units',
    'zip': 'zipCode',
    'zipcode': 'zipCode',
    'zip code': 'zipCode',
    'postal': 'zipCode',
    'postal code': 'zipCode',
    'postalcode': 'zipCode'
  }

  const parseExcelRows = (rows: Record<string, any>[]): PropertyFormData[] => {
    const results: PropertyFormData[] = []

    for (const row of rows) {
      const property: PropertyFormData = { ...emptyPropertyForm }
      let hasData = false

      for (const [rawKey, rawValue] of Object.entries(row)) {
        const key = rawKey.toLowerCase().trim()
        const value = String(rawValue ?? '').trim()
        if (!value) continue

        // Try exact match first
        let field = excelFieldMapping[key]

        // If no exact match, try partial/fuzzy matching
        if (!field) {
          for (const [mappingKey, mappingField] of Object.entries(excelFieldMapping)) {
            if (key.includes(mappingKey) || mappingKey.includes(key)) {
              field = mappingField
              break
            }
          }
        }

        if (field) {
          property[field] = value
          hasData = true
        }
      }

      if (hasData && (property.propertyName || property.propertyId || property.address)) {
        results.push(property)
      }
    }

    return results
  }

  const getStatesForCountry = (countryName: string): any[] => {
    const country = countries.find(c => c.name === countryName)
    if (country) {
      return State.getStatesOfCountry(country.isoCode)
    }
    return []
  }

  const getCitiesForState = (countryName: string, stateName: string): any[] => {
    const country = countries.find(c => c.name === countryName)
    const state = states.find(s => s.name === stateName)
    if (country && state) {
      return City.getCitiesOfState(country.isoCode, state.isoCode)
    }
    return []
  }

  const handleNext = () => {
    // Validate all properties
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i]
      if (!prop.address || !prop.propertyName || !prop.state || !prop.city || !prop.zipCode) {
        toast.error(`Please fill in all required fields for Property ${i + 1}`, { position: "top-right" })
        return
      }
    }
    onNext(properties.length === 1 ? properties[0] : properties)
  }

  const handleClose = () => {
    setProperties([{ ...emptyPropertyForm }])
    setUploadedFile(null)
    setIsProcessing(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-lexend animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative modal-content border border-slate-200/80 shadow-xl animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-between mb-4 sm:mb-6 pr-8 border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-teal-600 tracking-tight">Add New Property</h2>
          <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-teal-100/60 shadow-sm">
            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
          </span>
        </div>

        <div className="space-y-6">
          {properties.map((formData, index) => (
            <div key={index} className="border border-slate-200/80 bg-slate-50/20 rounded-2xl p-4 sm:p-5 relative shadow-sm">
              {properties.length > 1 && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-teal-600">Property {index + 1}</span>
                  <button
                    onClick={() => removeProperty(index)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 p-1.5 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Property ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.propertyId}
                    onChange={(e) => updateProperty(index, 'propertyId', e.target.value)}
                    placeholder="Property ID"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateProperty(index, 'address', e.target.value)}
                    placeholder="Enter your Address"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Property Name *</label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => updateProperty(index, 'propertyName', e.target.value)}
                    placeholder="Enter your Property Name"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateProperty(index, 'city', e.target.value)}
                    placeholder="Enter City"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Number Of Buildings *</label>
                  <input
                    type="text"
                    value={formData.buildings}
                    onChange={(e) => updateProperty(index, 'buildings', e.target.value)}
                    placeholder="Number of Buildings"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateProperty(index, 'state', e.target.value)}
                    placeholder="Enter State"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Number Of Units *</label>
                  <input
                    type="text"
                    value={formData.units}
                    onChange={(e) => updateProperty(index, 'units', e.target.value)}
                    placeholder="Number of Units"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Zip *</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateProperty(index, 'zipCode', e.target.value)}
                    placeholder="Postal Code"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all text-center"
                    required
                  />
                </div>
              </div>


            </div>
          ))}

          {/* Add & Next Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <button
              onClick={addNewProperty}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-rose-500/10 border-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Property
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-teal-600/10 border-0"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Drag and Drop File Upload Section */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/30 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 text-center">Import Properties From File</h3>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${isDragging
                ? 'border-teal-500 bg-teal-50/30'
                : 'border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 bg-white shadow-sm'
                }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 font-medium">Processing file...</p>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-500 font-bold">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      clearUploadedFile()
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto mb-3 bg-teal-50 border border-teal-100/60 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 mb-1">
                    <span className="font-extrabold text-teal-600">Drag & drop</span> your file here
                  </p>
                  <p className="text-xs text-slate-400 font-medium mb-3">or click to browse</p>
                  <input
                    type="file"
                    accept=".txt,.csv,.xls,.xlsx,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="property-file-upload"
                  />
                  <label
                    htmlFor="property-file-upload"
                    className="inline-block px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm shadow-teal-600/10"
                  >
                    Browse Files
                  </label>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3">
                    Supported: TXT, CSV, XLS, XLSX, PDF
                  </p>
                </>
              )}
            </div>

            {/* File Format Guide */}
            <div className="mt-4 p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Expected Column Headers:</p>
              <div className="flex flex-wrap gap-1.5">
                {['Property ID', 'Address', 'Property Name', 'State', 'City', 'Postal Code', 'Buildings', 'Units'].map((col) => (
                  <span key={col} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4 sm:pt-6 border-t border-slate-100">
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto px-12 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm border-0 shadow-md shadow-teal-600/10 transition-colors"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Building Division Modal (Property Details)
// ============================================
interface BuildingData {
  name: string
  units: number
}

interface BuildingDivisionModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (data: any, buildings: BuildingData[]) => void
  propertyData: any
}

export function BuildingDivisionModal({ isOpen, onClose, onUpdate, propertyData }: BuildingDivisionModalProps) {
  const [buildings, setBuildings] = useState<BuildingData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (propertyData && isOpen) {
      const numBuildings = parseInt(propertyData.buildings) || 1
      const totalUnits = parseInt(propertyData.units) || 0

      // Evenly divide units across buildings
      const unitsPerBuilding = Math.floor(totalUnits / numBuildings)
      const remainder = totalUnits % numBuildings

      setBuildings(prev => {
        // If we already have the correct number of buildings, just update units
        if (prev.length === numBuildings) {
          return prev.map((b, i) => ({
            ...b,
            units: unitsPerBuilding + (i < remainder ? 1 : 0)
          }))
        }

        // Otherwise, initialize new list
        const buildingList: BuildingData[] = []
        for (let i = 0; i < numBuildings; i++) {
          buildingList.push({
            name: `B${i + 1}`,
            units: unitsPerBuilding + (i < remainder ? 1 : 0),
          })
        }
        return buildingList
      })
    }
  }, [propertyData, isOpen])

  const updateBuildingName = (index: number, name: string) => {
    const updated = [...buildings]
    updated[index] = { ...updated[index], name }
    setBuildings(updated)
  }

  const updateBuildingUnits = (index: number, units: number) => {
    const updated = [...buildings]
    updated[index] = { ...updated[index], units }
    setBuildings(updated)
  }

  const handleUpdate = () => {
    // Validate building names
    for (let i = 0; i < buildings.length; i++) {
      if (!buildings[i].name.trim()) {
        toast.error(`Please enter a name for Building ${i + 1}`, { position: "top-right" })
        return
      }
    }
    setIsLoading(true)
    onUpdate(propertyData, buildings)
  }

  if (!isOpen || !propertyData) return null

  const propertyId = propertyData.propertyId || 'N/A'
  const propertyName = propertyData.propertyName || propertyData.name || 'N/A'

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-lexend animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative modal-content border border-slate-200/80 shadow-xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 mb-4 sm:mb-6 tracking-tight">Property Details</h2>

        {/* Property Info Header */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Property ID: <span className="font-extrabold text-slate-800 normal-case ml-1">{propertyId}</span>
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Property Name: <span className="font-extrabold text-slate-800 normal-case ml-1">{propertyName}</span>
          </p>
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {buildings.map((building, index) => (
            <div key={index} className="border border-slate-200/85 rounded-2xl p-4 bg-slate-50/30 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Building Name</label>
                  <input
                    type="text"
                    value={building.name}
                    onChange={(e) => updateBuildingName(index, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006795]/20 focus:border-[#006795] text-sm font-medium text-slate-800 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">No. of Units</label>
                  <input
                    type="number"
                    value={building.units}
                    onChange={(e) => updateBuildingUnits(index, parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006795]/20 focus:border-[#006795] text-sm font-medium text-slate-800 transition-all"
                  />
                </div>
                <button
                  onClick={() => {
                    toast.success(`Building ${building.name} updated`, { position: "top-right" })
                  }}
                  className="px-4 py-2.5 bg-[#006795] hover:bg-[#005580] text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-[#006795]/10 border-0 whitespace-nowrap h-[42px] flex items-center justify-center font-lexend"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Update Button */}
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          className="w-full py-3.5 bg-[#006795] hover:bg-[#005580] text-white font-bold rounded-xl text-sm transition-colors border-0 shadow-md shadow-[#006795]/10 font-lexend"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  )
}

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onViewSummary?: () => void
  onStartInspection?: () => void
  onRemoveProperty?: () => void
  propertyData: any
}

export function ActionModal({ isOpen, onClose, onEdit, onViewSummary, onStartInspection, onRemoveProperty, propertyData }: ActionModalProps) {
  const handleStartInspection = () => {
    if (onStartInspection) {
      onStartInspection()
    }
    onClose()
  }

  const handleViewSummary = () => {
    if (onViewSummary) {
      onViewSummary()
    } else {
      onEdit()
    }
    onClose()
  }

  const handleRemove = () => {
    if (onRemoveProperty) {
      onRemoveProperty()
    } else {
      toast.error("Property removed", { position: "top-right" })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 sm:p-8 font-lexend animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-7 text-center tracking-tight">Action</h2>

        <div className="space-y-3">
          {/* View Summary — dark outlined */}
          <button
            onClick={handleViewSummary}
            className="w-full px-6 py-4 bg-white border-2 border-slate-800 hover:bg-slate-800 hover:text-white text-slate-800 font-bold rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Summary
          </button>

          {/* Continue Inspection — brand teal */}
          <button
            onClick={handleStartInspection}
            className="w-full px-6 py-4 bg-[#006795] hover:bg-[#005578] active:bg-[#004a6a] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-[#006795]/30 flex items-center justify-center gap-2.5 border-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Continue Inspection
          </button>

          {/* Remove Property — red */}
          <button
            onClick={handleRemove}
            className="w-full px-6 py-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-rose-400/30 flex items-center justify-center gap-2.5 border-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Property
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Coverage Selection Modal (Random / 100% / 50%)
// ============================================

// NSPIRE Sampling Ranges (same as mobile app)
const NSPIRE_SAMPLING_RANGES: [number, number, number][] = [
  [1, 1, 1], [2, 2, 1], [3, 3, 2], [4, 4, 3], [5, 5, 4],
  [6, 6, 5], [7, 7, 6], [8, 8, 7], [9, 9, 8], [10, 10, 9],
  [11, 12, 9], [13, 14, 10], [15, 16, 11], [17, 18, 12],
  [19, 21, 13], [22, 24, 14], [25, 27, 15], [28, 30, 16],
  [31, 35, 17], [36, 39, 18], [40, 45, 19], [46, 51, 20],
  [52, 59, 21], [60, 67, 22], [68, 78, 23], [79, 92, 24],
  [93, 110, 25], [111, 120, 26], [121, 166, 27], [167, 214, 28],
  [215, 295, 29], [296, 455, 30], [456, 920, 31], [921, Infinity, 32],
]

function getNspireScoringFactor(totalUnits: number): number {
  for (const [min, max, factor] of NSPIRE_SAMPLING_RANGES) {
    if (totalUnits >= min && totalUnits <= max) return factor
  }
  return 32
}

const COVERAGE_OPTIONS = [
  { label: 'Random Sample', value: 'random', description: 'Automatically select a random sample based on NSPIRE guidelines' },
  { label: '50% - Half Units', value: '50', description: 'Inspect half of all units (randomly selected)' },
  { label: '100% - All Units', value: '100', description: 'Inspect every unit in the property' },
]

interface CoverageSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onStartInspection: (coverage: string, calculatedUnits: number) => void
  propertyData: any
}

export function CoverageSelectionModal({ isOpen, onClose, onStartInspection, propertyData }: CoverageSelectionModalProps) {
  const [selectedCoverage, setSelectedCoverage] = useState('100')
  const [calculatedUnits, setCalculatedUnits] = useState(0)

  const totalUnits = parseInt(propertyData?.units) || 1

  useEffect(() => {
    if (isOpen && propertyData) {
      setSelectedCoverage('random')
      setCalculatedUnits(getNspireScoringFactor(totalUnits))
    }
  }, [isOpen, propertyData])

  const handleCoverageChange = (coverage: string) => {
    setSelectedCoverage(coverage)
    let units = 0
    if (coverage === '100') {
      units = totalUnits
    } else if (coverage === '50') {
      units = Math.ceil(totalUnits / 2)
    } else if (coverage === 'random') {
      units = getNspireScoringFactor(totalUnits)
    }
    setCalculatedUnits(units)
  }

  const handleStart = () => {
    onStartInspection(selectedCoverage, calculatedUnits)
  }

  if (!isOpen || !propertyData) return null

  const propertyName = propertyData.propertyName || propertyData.name || 'N/A'

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-lexend animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-xl border border-slate-200/80 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Ready for Inspection</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-base font-extrabold text-slate-800 tracking-tight mb-1">{propertyName}</p>
        <p className="text-sm text-slate-500 font-medium mb-6">
          Total Units: <span className="font-extrabold text-slate-800">{totalUnits}</span>
        </p>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Select Inspection Coverage</p>

        <div className="space-y-3 mb-6">
          {COVERAGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleCoverageChange(option.value)}
              className={`w-full flex items-start gap-3.5 p-4 rounded-xl border transition-all text-left ${selectedCoverage === option.value
                ? 'border-teal-500 bg-teal-50/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/30 bg-white'
                }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${selectedCoverage === option.value ? 'border-teal-600' : 'border-slate-300'
                }`}>
                {selectedCoverage === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${selectedCoverage === option.value ? 'text-teal-600' : 'text-slate-900'
                  }`}>
                  {option.label}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Units to Inspect:</span>
          <span className="text-xl font-extrabold text-teal-600">{calculatedUnits}</span>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-teal-600/10 border-0 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Start Inspection
        </button>
      </div>
    </div>
  )
}

interface EditPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  propertyData: any
}

export function EditPropertyModal({ isOpen, onClose, onSuccess, propertyData }: EditPropertyModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    propertyId: "",
    address: "",
    propertyName: "",
    country: "",
    countryCode: "",
    state: "",
    stateCode: "",
    buildings: "",
    city: "",
    units: "",
    zipCode: ""
  })

  // Sync formData with propertyData when modal opens or propertyData changes
  useEffect(() => {
    if (isOpen && propertyData) {
      setFormData({
        propertyId: propertyData.propertyId || "",
        address: propertyData.address || "",
        propertyName: propertyData.name || propertyData.propertyName || "",
        country: propertyData.country || "United States",
        countryCode: propertyData.countryCode || "US",
        state: propertyData.state || "",
        stateCode: propertyData.stateCode || "",
        buildings: String(propertyData.buildings || ""),
        city: propertyData.city || "",
        units: String(propertyData.units || ""),
        zipCode: propertyData.zipCode || ""
      })
    }
  }, [isOpen, propertyData])

  // Location data from country-state-city package
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    // Load only specific countries
    const allCountries = Country.getAllCountries()
    const allowedCountries = ['United States', 'Canada', 'United Kingdom', 'Australia']
    const filteredCountries = allCountries.filter(country =>
      allowedCountries.includes(country.name)
    )
    setCountries(filteredCountries)

    // Load states for current country if exists
    if (formData.country) {
      const selectedCountry = filteredCountries.find(c => c.name === formData.country)
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode)
        setStates(countryStates)

        // Load cities for current state if exists
        if (formData.state) {
          const selectedState = countryStates.find(s => s.name === formData.state)
          if (selectedState) {
            const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
            setCities(stateCities)
          }
        }
      }
    }
  }, [formData.country, formData.state])

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName)
    setFormData({
      ...formData,
      country: countryName,
      countryCode: selectedCountry?.isoCode || '',
      state: '',
      stateCode: '',
      city: ''
    })

    // Load states for selected country
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode)
      setStates(countryStates)
    } else {
      setStates([])
    }
    setCities([])
  }

  const handleStateChange = (stateName: string) => {
    const selectedState = states.find(s => s.name === stateName)
    setFormData({
      ...formData,
      state: stateName,
      stateCode: selectedState?.isoCode || '',
      city: ''
    })

    // Load cities for selected state
    if (selectedState && formData.countryCode) {
      const stateCities = City.getCitiesOfState(formData.countryCode, selectedState.isoCode)
      setCities(stateCities)
    } else {
      setCities([])
    }
  }

  const handleUpdate = async () => {
    if (!propertyData?._id) {
      toast.error("Property ID not found");
      return;
    }

    setIsLoading(true);
    try {
      const response = await propertiesAPI.update(propertyData._id, {
        propertyId: formData.propertyId,
        name: formData.propertyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        buildings: parseInt(formData.buildings) || 0,
        units: parseInt(formData.units) || 0,
      });

      if (response.success) {
        toast.success("Property updated successfully!", { position: "top-right" });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update property");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!propertyData?._id) return;
    
    if (!confirm(`Are you sure you want to delete ${formData.propertyName}?`)) return;

    setIsLoading(true);
    try {
      const response = await propertiesAPI.delete(propertyData._id);
      if (response.success) {
        toast.success("Property deleted successfully", { position: "top-right" });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete property");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-lexend animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-slate-200/80 shadow-xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 mb-4 sm:mb-6 text-center pr-8 tracking-tight">Edit or Delete Property</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Property ID</label>
              <input
                type="text"
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Property Name</label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter Country"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">State (Province)</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter State"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">City (Area)</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter City"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Postal Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Number Of Buildings</label>
              <input
                type="text"
                value={formData.buildings}
                onChange={(e) => setFormData({ ...formData, buildings: e.target.value })}
                placeholder="Number of Buildings"
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Number Of Units</label>
              <input
                type="text"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-100">
            <Button
              onClick={handleUpdate}
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 border-0 shadow-md shadow-teal-600/10 transition-colors"
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm disabled:opacity-50 border-0 shadow-md shadow-rose-500/10 transition-colors"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SummaryModal({ isOpen, onClose, propertyData, hideFullReportButton = false }: { isOpen: boolean; onClose: () => void; propertyData: any; hideFullReportButton?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summaryData, setSummaryData] = useState<any>(null)

  useEffect(() => {
    if (isOpen && propertyData?._id) {
      loadSummaryData()
    }
  }, [isOpen, propertyData])

  const extractImageUrl = (d: any): string => {
    if (typeof d.imageUri === 'string' && d.imageUri.trim()) return d.imageUri;
    if (typeof d.imageUrl === 'string' && d.imageUrl.trim()) return d.imageUrl;
    if (typeof d.photo === 'string' && d.photo.trim()) return d.photo;
    if (typeof d.image === 'string' && d.image.trim()) return d.image;
    if (Array.isArray(d.photos) && d.photos.length > 0) {
      const first = d.photos[0];
      if (typeof first === 'string' && first.trim()) return first;
      if (first?.url && typeof first.url === 'string' && first.url.trim()) return first.url;
    }
    return '';
  };

  const loadSummaryData = async () => {
    try {
      setLoading(true)
      const propertyId = propertyData._id
      const token = localStorage.getItem('token')

      const [progData, inspectionsRes] = await Promise.all([
        inspectionsAPI.getProgress({ property_id: propertyId, draft_only: 'false' }),
        inspectionsAPI.getAll({ property: propertyId, status: 'completed' })
      ])

      let allFindings: any[] = []

      // 1. Collect findings from progress
      if (progData && progData.progress) {
        progData.progress.forEach((record: any) => {
          const recordFindings = record.inspectionData?.findings || record.inspectionData?.deficiencies || record.data?.findings || record.data?.deficiencies || [];
          if (Array.isArray(recordFindings)) {
            const building = record.buildingId || record.inspectionData?.buildingId || record.data?.buildingId || '';
            const unit = record.unitId || record.inspectionData?.currentUnit || record.data?.currentUnit || '-';
            const rawArea = record.inspectionType || (unit === 'Outside' ? 'Outside' : unit === 'Inside' ? 'Inside' : 'Unit');
            const area = rawArea.charAt(0).toUpperCase() + rawArea.slice(1).toLowerCase();

            recordFindings.forEach((f: any) => {
              allFindings.push({
                ...f,
                building: f.building || building,
                unit: f.unit || unit,
                area: f.area || area
              })
            })
          }
        })
      }

      // 2. Collect findings from completed
      if (inspectionsRes.success && inspectionsRes.inspections) {
        inspectionsRes.inspections.forEach((insp: any) => {
          const inspFindings = insp.findings || insp.deficiencies || insp.inspectionData?.findings || insp.inspectionData?.deficiencies || insp.data?.findings || insp.data?.deficiencies || [];
          if (Array.isArray(inspFindings)) {
            inspFindings.forEach((f: any) => {
              allFindings.push({
                ...f,
                building: f.building || insp.building?.name || '',
                unit: f.unit || insp.unit?.name || insp.unit || '-',
                area: f.area || insp.inspectionType || 'Final'
              })
            })
          }
        })
      }

      // 3. Deduplicate
      const deduped = new Map<string, any>()
      allFindings.forEach(f => {
        const normBuilding = String(f.building || '').replace(/^Building\s+/i, 'B').toUpperCase().trim()
        const normUnit = String(f.unit || '').replace(/^Unit\s+/i, '').replace(/^-$/, '').toUpperCase().trim()
        const normName = String(f.deficiencyName || f.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const key = [normName, normBuilding, normUnit].filter(Boolean).join('|')
        
        const existing = deduped.get(key)
        if (!existing || (!existing.imageUri && f.imageUri)) {
          deduped.set(key, f)
        }
      })
      const finalFindings = Array.from(deduped.values())

      // Count completed sections
      let outsideCompleted = 0
      let insideCompleted = 0
      const completedUnitIds = new Set<string>()

      if (progData && Array.isArray(progData.progress)) {
        progData.progress.forEach((p: any) => {
          const type = String(p.inspectionType || '').toLowerCase()
          const isComplete = p.inspectionData?.isComplete === true
          if (isComplete) {
            if (type === 'outside') {
              outsideCompleted = 1
            } else if (type === 'inside') {
              insideCompleted = 1
            } else if (type.startsWith('unit_') || p.unitId) {
              const uid = p.unitId || type.replace('unit_', '')
              completedUnitIds.add(uid)
            }
          }
        })
      }

      if (inspectionsRes.success && Array.isArray(inspectionsRes.inspections)) {
        inspectionsRes.inspections.forEach((insp: any) => {
          const type = String(insp.inspectionType || '').toLowerCase()
          if (type === 'outside') {
            outsideCompleted = 1
          } else if (type === 'inside') {
            insideCompleted = 1
          } else if (type.startsWith('unit_') || (insp.unitId && insp.unitId !== propertyId)) {
            completedUnitIds.add(insp.unitId)
          }
        })
      }

      const completedUnitsCount = completedUnitIds.size

      let calculatedUnits = parseInt(propertyData.units) || 1
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`property_coverage_${propertyId}`)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (parsed && typeof parsed.calculatedUnits === 'number') {
              calculatedUnits = parsed.calculatedUnits
            }
          } catch (e) {}
        }
      }

      // 4. Calculate summary counts
      let lifeThreatening = 0
      let severe = 0
      let moderate = 0
      let low = 0

      finalFindings.forEach(f => {
        const severity = String(f.severity || f.healthAndSafety || 'Moderate').toLowerCase()
        if (severity.includes('life') || severity.includes('threat')) {
          lifeThreatening++
        } else if (severity.includes('severe')) {
          severe++
        } else if (severity.includes('moderate')) {
          moderate++
        } else {
          low++
        }
      })

      // Calculate score
      const totalDeductions = finalFindings.reduce((sum, f) => {
        const severity = String(f.severity || f.healthAndSafety || 'Moderate').toLowerCase()
        let pts = 3 // moderate
        if (severity.includes('life') || severity.includes('threat')) {
          pts = 10
        } else if (severity.includes('severe')) {
          pts = 5
        } else if (severity.includes('low')) {
          pts = 1
        }
        return sum + pts
      }, 0)

      const preliminaryScore = Math.max(0, 100 - totalDeductions)
      const finalScore = Math.max(0, preliminaryScore - 5)

      setSummaryData({
        score: finalScore,
        counts: {
          lifeThreatening,
          severe,
          moderate,
          low,
          total: finalFindings.length
        },
        deficiencies: finalFindings,
        calculatedUnits,
        completedUnitsCount,
        outsideCompleted,
        insideCompleted
      })
    } catch (error) {
      console.error("Error loading summary data:", error)
      toast.error("Failed to load summary data")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const propertyName = propertyData?.name || propertyData?.propertyName || "Property"
  const propertyAddress = propertyData?.address || "-"

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-lexend animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">Inspection Report Summary</h2>
          <div className="text-center mb-6">
            <p className="text-sm font-extrabold text-slate-700">{propertyName}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{propertyAddress}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3 flex-1 flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-600 border-t-transparent"></div>
            <p className="text-slate-500 text-xs font-semibold">Loading summary data...</p>
          </div>
        ) : !summaryData ? (
          <div className="py-8 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
            <p className="text-slate-500 text-xs font-semibold">No data available.</p>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col min-h-0">
            {/* Property & Occupancy Info */}
            <div className="grid md:grid-cols-2 gap-4 flex-shrink-0">
              <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 shadow-sm space-y-2.5">
                <div className="border-b border-slate-200 pb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Property Information</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Property Name</span>
                    <span className="font-bold text-slate-800">{propertyName}</span>
                  </div>
                  <div className="flex justify-between py-1 gap-4">
                    <span className="text-slate-400">Address</span>
                    <span className="font-bold text-slate-800 text-right">{propertyAddress}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Property ID</span>
                    <span className="font-bold text-slate-800">{propertyData.propertyId || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 shadow-sm space-y-2.5">
                <div className="border-b border-slate-200 pb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Occupancy Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white border border-slate-200/50 p-2.5 rounded-xl text-center shadow-xs">
                    <p className="text-lg font-black text-slate-800">{propertyData.units || 1}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Units</p>
                  </div>
                  <div className="bg-emerald-50/30 border border-emerald-100/50 p-2.5 rounded-xl text-center shadow-xs">
                    <p className="text-lg font-black text-emerald-700">{propertyData.occupiedUnits || Math.round((propertyData.units || 1) * 0.9)}</p>
                    <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Occupied</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score & Passing Status */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Final Score</span>
              <span className={`text-4xl font-black ${summaryData.score >= 60 ? 'text-teal-600' : 'text-rose-600'}`}>
                {summaryData.score}
              </span>
              <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                summaryData.score >= 60 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {summaryData.score >= 60 ? '✓ Passing' : '✗ Below Threshold'}
              </span>
            </div>

            {/* Counts Grid */}
            <div className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-rose-50/50 border-l-4 border-l-rose-500 border border-rose-100 rounded-r-xl p-3 text-center shadow-sm">
                <p className="text-2xl font-black text-rose-700">{summaryData.counts.lifeThreatening}</p>
                <p className="text-[9px] font-bold text-rose-600 uppercase tracking-wider mt-0.5">Life-Threat</p>
              </div>
              <div className="bg-amber-50/50 border-l-4 border-l-amber-500 border border-amber-100 rounded-r-xl p-3 text-center shadow-sm">
                <p className="text-2xl font-black text-amber-700">{summaryData.counts.severe}</p>
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">Severe</p>
              </div>
              <div className="bg-sky-50/50 border-l-4 border-l-sky-500 border border-sky-100 rounded-r-xl p-3 text-center shadow-sm">
                <p className="text-2xl font-black text-sky-700">{summaryData.counts.moderate}</p>
                <p className="text-[9px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">Moderate</p>
              </div>
              <div className="bg-slate-50 border-l-4 border-l-slate-400 border border-slate-200 rounded-r-xl p-3 text-center shadow-sm">
                <p className="text-2xl font-black text-slate-700">{summaryData.counts.low}</p>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">Low</p>
              </div>
              <div className="bg-teal-50/50 border-l-4 border-l-teal-600 border border-teal-100 rounded-r-xl p-3 col-span-2 sm:col-span-1 text-center shadow-sm">
                <p className="text-2xl font-black text-teal-700">{summaryData.counts.total}</p>
                <p className="text-[9px] font-bold text-teal-600 uppercase tracking-wider mt-0.5">Total</p>
              </div>
            </div>

            {/* Inspection Data Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4 space-y-3 flex-shrink-0">
              <div className="border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Inspection Data Breakdown</h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-150">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="text-left p-2.5">Type</th>
                      <th className="text-center p-2.5">Property Total</th>
                      <th className="text-center p-2.5">Sample Size</th>
                      <th className="text-center p-2.5">Units Inspected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-2.5 font-extrabold text-slate-850">Outside</td>
                      <td className="p-2.5 text-center">{propertyData.buildings || 1}</td>
                      <td className="p-2.5 text-center">{propertyData.buildings || 1}</td>
                      <td className="p-2.5 text-center">{summaryData.outsideCompleted}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-2.5 font-extrabold text-slate-850">Inside</td>
                      <td className="p-2.5 text-center">{propertyData.buildings || 1}</td>
                      <td className="p-2.5 text-center">{propertyData.buildings || 1}</td>
                      <td className="p-2.5 text-center">{summaryData.insideCompleted}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-2.5 font-extrabold text-slate-850">Units</td>
                      <td className="p-2.5 text-center">{propertyData.units || 1}</td>
                      <td className="p-2.5 text-center">{summaryData.calculatedUnits}</td>
                      <td className="p-2.5 text-center">{summaryData.completedUnitsCount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scrollable Deficiency List */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-0 bg-white">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-extrabold text-xs text-slate-700 flex-shrink-0">
                Recorded Deficiencies ({summaryData.deficiencies.length})
              </div>
              <div className="overflow-y-auto divide-y divide-slate-100 flex-1 min-h-0">
                {summaryData.deficiencies.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                    No deficiencies recorded for this property.
                  </div>
                ) : (
                  summaryData.deficiencies.map((def: any, idx: number) => {
                    const severity = String(def.severity || def.healthAndSafety || 'Moderate');
                    const severityColor = severity.toLowerCase().includes('life') || severity.toLowerCase().includes('threat')
                      ? 'text-rose-600 bg-rose-50 border-rose-100'
                      : severity.toLowerCase().includes('severe')
                      ? 'text-amber-700 bg-amber-50 border-amber-100'
                      : severity.toLowerCase().includes('moderate')
                      ? 'text-sky-700 bg-sky-50 border-sky-100'
                      : 'text-slate-600 bg-slate-50 border-slate-200';
                    
                    const imgUrl = extractImageUrl(def);
                    const detailText = def.description || def.detail || def.deficiencyDetails || '';
                    const notesText = def.comments || def.notes || '';
                    const repairTimelineText = def.repairBy || def.repairTimeline || '';
                    const codeComplianceText = def.codeAndCompliance || def.nspireCode || '';

                    return (
                      <div key={idx} className="p-4 hover:bg-slate-50/40 transition-colors flex flex-col md:flex-row gap-4 items-start">
                        {imgUrl && (
                          <div className="w-full md:w-28 h-20 relative rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-slate-100">
                            <img src={imgUrl} alt={def.deficiencyName || def.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-slate-800 text-sm">
                                {def.deficiencyName || def.title || "Unnamed Deficiency"}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1 text-[9px] font-bold uppercase tracking-wider">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {def.building ? `Bldg ${def.building.replace(/^Building\s+/i, '')}` : 'Bldg -'}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {def.unit ? `Unit ${def.unit.replace(/^Unit\s+/i, '')}` : 'Unit -'}
                                </span>
                                {def.room && def.room !== '-' && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                    {def.room}
                                  </span>
                                )}
                                {def.area && def.area !== '-' && (
                                  <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                                    {def.area}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm ${severityColor}`}>
                              {severity}
                            </span>
                          </div>

                          {detailText && (
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {detailText}
                            </p>
                          )}

                          {notesText && (
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex gap-2 items-start mt-1">
                              <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              <p className="text-xs text-slate-600 italic font-medium leading-normal">
                                <strong>Inspector Notes:</strong> {notesText}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4 text-[10px] font-semibold text-slate-500 pt-1">
                            {repairTimelineText && (
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Repair: {repairTimelineText}
                              </span>
                            )}
                            {codeComplianceText && (
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Code: {codeComplianceText}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 justify-end">
              <Button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors border-0"
              >
                Close
              </Button>
              {!hideFullReportButton && (
                <Button
                  onClick={() => {
                    onClose()
                    router.push(`/dashboard/inspection/summary?propertyId=${propertyData._id}`)
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors border-0 shadow-md shadow-teal-600/10 flex items-center justify-center gap-2"
                >
                  View Full Report & Export
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

