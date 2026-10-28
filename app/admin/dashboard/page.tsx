"use client"

import { useState, useEffect } from "react"
import AdminDashboardLayout from "@/components/AdminDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { loadGeo, geo } from '@/lib/geo'

interface Property {
  id: string
  name: string
  buildings: number
  units: number
  address: string
  city: string
  state: string
  zip: string
}

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [propertyName, setPropertyName] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  // Location data from country-state-city package
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  // Load countries once the lazily fetched geo data lands.
  useEffect(() => {
    loadGeo().then(({ Country }) => {
      const allowedCountries = ['United States', 'Canada', 'United Kingdom', 'Australia']
      setCountries(Country.getAllCountries().filter(country => allowedCountries.includes(country.name)))
    })
  }, [])

  // Handle country change
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName)
    setSelectedState("")
    setSelectedCity("")
    
    const country = countries.find(c => c.name === countryName)
    const State = geo()?.State
    if (country && State) {
      setStates(State.getStatesOfCountry(country.isoCode))
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
    
    const City = geo()?.City
    if (country && state && City) {
      setCities(City.getCitiesOfState(country.isoCode, state.isoCode))
    } else {
      setCities([])
    }
  }

  // Mock data for properties
  const properties: Property[] = [
    {
      id: "DE001000006",
      name: "CRESTVIEW APTS",
      buildings: 15,
      units: 191,
      address: "2700 N Market St",
      city: "Wilmington",
      state: "DE",
      zip: "19802",
    },
    {
      id: "CA002000123",
      name: "SUNRISE TERRACE",
      buildings: 8,
      units: 96,
      address: "1450 Ocean Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
    },
    {
      id: "TX003000456",
      name: "LONE STAR RESIDENCES",
      buildings: 12,
      units: 144,
      address: "3200 Main Street",
      city: "Houston",
      state: "TX",
      zip: "77001",
    },
    {
      id: "NY004000789",
      name: "EMPIRE STATE LIVING",
      buildings: 20,
      units: 250,
      address: "500 5th Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    {
      id: "FL005000321",
      name: "PALM BEACH GARDENS",
      buildings: 6,
      units: 72,
      address: "8800 Collins Ave",
      city: "Miami",
      state: "FL",
      zip: "33101",
    },
    {
      id: "AZ006000654",
      name: "DESERT OASIS HOMES",
      buildings: 10,
      units: 120,
      address: "4500 Camelback Rd",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
    },
    {
      id: "WA007000987",
      name: "PACIFIC NORTHWEST APTS",
      buildings: 7,
      units: 84,
      address: "1200 Pike Street",
      city: "Seattle",
      state: "WA",
      zip: "98101",
    },
    {
      id: "IL008000147",
      name: "WINDY CITY TOWERS",
      buildings: 18,
      units: 216,
      address: "233 S Wacker Dr",
      city: "Chicago",
      state: "IL",
      zip: "60601",
    },
  ]

  const handleSearch = () => {
    toast.info("Searching properties...", { position: "top-right" })
    console.log("Search params:", { searchQuery, propertyName, selectedState, selectedCity })
  }

  const handleSelectEdit = (property: Property) => {
    toast.info(`Selected property: ${property.name}`, { position: "top-right" })
    console.log("Selected property:", property)
  }

  const handleAddProperty = () => {
    toast.info("Add Property clicked", { position: "top-right" })
  }

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage all properties and inspections</p>
          </div>
          <Button
            onClick={handleAddProperty}
            className="w-full sm:w-auto bg-[#F84B5F] hover:bg-[#EE3646] text-white font-semibold px-6 py-3 rounded-lg text-base shadow-sm hover:shadow-md transition-all duration-200"
          >
            Add Property
          </Button>
        </div>

        {/* Search Filters */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 lg:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Properties</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            {/* Search by Name, City or State */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Search by Name, City or State</label>
              <input
                type="text"
                placeholder="Enter search term"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm transition-colors duration-200"
              />
            </div>

            {/* Property Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Property Name</label>
              <input
                type="text"
                placeholder="Enter property name"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm transition-colors duration-200"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                placeholder="Enter Country"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent bg-white text-sm transition-colors duration-200"
              />
            </div>

            {/* State (Province) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State (Province)</label>
              <input
                type="text"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                placeholder="Enter State"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent bg-white text-sm transition-colors duration-200"
              />
            </div>

            {/* City (Area) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">City (Area)</label>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter City"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent bg-white text-sm transition-colors duration-200"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-[#1E3A5F] hover:bg-[#152A45] text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                Search Properties
              </Button>
            </div>
          </div>
        </Card>

        {/* Properties Table */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Property Records</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {properties.length} properties
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Property ID
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Property Name
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    No Of Building(s)
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    No Of Unit(s)
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    City (Area)
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    State (Province)
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Postal Code
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-4">
                      <span className="text-blue-600 font-medium text-sm bg-blue-50 px-2 py-1 rounded">
                        {property.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{property.name}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-900 font-medium">{property.buildings}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium">{property.units}</td>
                    <td className="py-4 px-4 text-gray-600">{property.address}</td>
                    <td className="py-4 px-4 text-gray-600">{property.city}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {property.state}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-mono text-sm">{property.zip}</td>
                    <td className="py-4 px-4">
                      <Button
                        onClick={() => handleSelectEdit(property)}
                        className="bg-[#1E3A5F] hover:bg-[#152A45] text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Select/ Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-2 py-1 rounded">
                        {property.id}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {property.state}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{property.name}</h3>
                    <p className="text-gray-600 text-sm">{property.address}</p>
                  </div>
                  <Button
                    onClick={() => handleSelectEdit(property)}
                    className="bg-[#1E3A5F] hover:bg-[#152A45] text-white font-semibold px-3 py-2 rounded-lg text-xs shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap ml-2"
                  >
                    Select/ Edit
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 text-xs block mb-1">Buildings</span>
                    <p className="font-semibold text-gray-900 text-base">{property.buildings}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 text-xs block mb-1">Units</span>
                    <p className="font-semibold text-gray-900 text-base">{property.units}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 text-xs block mb-1">City</span>
                    <p className="font-semibold text-gray-900 text-base">{property.city}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 text-xs block mb-1">Postal Code</span>
                    <p className="font-semibold text-gray-900 text-base font-mono">{property.zip}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
