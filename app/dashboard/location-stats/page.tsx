"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { loadGeo } from '@/lib/geo'
import { Globe, Map, Navigation, Compass, ChevronDown, Info, ListOrdered } from "lucide-react"

interface LocationStats {
  totalCountries: number
  totalStates: number
  totalCities: number
  countriesWithStates: { [key: string]: number }
  statesWithCities: { [key: string]: number }
}

export default function LocationStatsPage() {
  const [stats, setStats] = useState<LocationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCountryDetails, setShowCountryDetails] = useState(false)
  const [showStateDetails, setShowStateDetails] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)

      // Get stats only for allowed countries
      const { Country, State, City } = await loadGeo()
      const allowedCountries = ['US', 'CA', 'GB', 'AU']
      const allCountries = Country.getAllCountries()
        .filter(country => allowedCountries.includes(country.isoCode))

      let totalStates = 0
      let totalCities = 0
      const countriesWithStates: { [key: string]: number } = {}
      const statesWithCities: { [key: string]: number } = {}

      allCountries.forEach(country => {
        const states = State.getStatesOfCountry(country.isoCode)
        const cities = City.getCitiesOfCountry(country.isoCode)

        totalStates += states.length
        totalCities += (cities || []).length
        countriesWithStates[country.name] = states.length

        // Get cities per state for this country
        states.forEach(state => {
          const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode)
          const stateKey = `${state.name}, ${country.name}`
          statesWithCities[stateKey] = stateCities.length
        })
      })

      const locationStats: LocationStats = {
        totalCountries: allCountries.length,
        totalStates,
        totalCities,
        countriesWithStates,
        statesWithCities,
      }

      setStats(locationStats)
    } catch (error) {
      console.error('Error loading location stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getTopCountriesWithStates = () => {
    if (!stats) return []
    return Object.entries(stats.countriesWithStates)
      .sort(([, a], [, b]) => b - a)
  }

  const getTopStatesWithCities = () => {
    if (!stats) return []
    return Object.entries(stats.statesWithCities)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-lexend">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-600 border-t-transparent mx-auto"></div>
            <p className="text-slate-500 text-sm font-semibold">Loading location statistics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Compass className="w-6 h-6 text-teal-600" />
                Location Statistics
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Inspector Portal location data coverage, states, and city metrics.
              </p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Countries Covered</p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formatNumber(stats?.totalCountries || 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <Globe className="w-6 h-6" />
              </div>
            </Card>

            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">States/Provinces</p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formatNumber(stats?.totalStates || 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                <Map className="w-6 h-6" />
              </div>
            </Card>

            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cities Registered</p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formatNumber(stats?.totalCities || 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Navigation className="w-6 h-6" />
              </div>
            </Card>
          </div>

          {/* Countries Breakdown */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              <button
                onClick={() => setShowCountryDetails(!showCountryDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Countries by States/Provinces</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${showCountryDetails ? 'rotate-180' : ''}`}
                />
              </button>

              {showCountryDetails && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {getTopCountriesWithStates().map(([country, count], index) => (
                    <div key={country} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                        <span className="text-sm font-semibold text-slate-800">{country}</span>
                      </div>
                      <span className="text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-full">
                        {formatNumber(count)} states
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* States Breakdown */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              <button
                onClick={() => setShowStateDetails(!showStateDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Top States/Provinces by Cities (Sample)</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${showStateDetails ? 'rotate-180' : ''}`}
                />
              </button>

              {showStateDetails && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {getTopStatesWithCities().map(([state, count], index) => (
                    <div key={state} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                        <span className="text-sm font-semibold text-slate-800">{state}</span>
                      </div>
                      <span className="text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1 rounded-full">
                        {formatNumber(count)} cities
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Info Section */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Info className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Inspector Portal Coverage</h3>
            </div>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                This inspector portal supports property management in four key countries:
                United States, Canada, United Kingdom, and Australia.
              </p>
              <p>
                Complete coverage includes all states, provinces, territories, and cities
                within these countries for accurate property location selection.
              </p>
              
              <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl mt-4">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-3">Coverage Details:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span><strong>United States:</strong> 66 states/territories with 19,821 cities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span><strong>Canada:</strong> 13 provinces/territories with 1,079 cities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span><strong>United Kingdom:</strong> 247 regions with 3,871 cities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span><strong>Australia:</strong> 8 states/territories with 4,152 cities</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}
