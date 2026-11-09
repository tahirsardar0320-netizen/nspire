"use client"

import { ReactNode, useState, useEffect } from "react"
import { durableRemove } from '@/lib/durableStore'
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "react-toastify"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()

  // The header zoom buttons are gone — pinch does the job now. Clear any
  // zoom level a device saved while the buttons existed, or those phones
  // stay magnified forever.
  useEffect(() => {
    try {
      (document.body.style as any).zoom = ''
      localStorage.removeItem('app_zoom_level')
    } catch { /* nothing saved */ }
    // The portal runs a notch more compact than the marketing site — every
    // rem-based size steps down together, which is what keeps proportions
    // matching the reference app. Tap targets are px-based and keep 44px.
    document.documentElement.style.fontSize = '14px'
    return () => { document.documentElement.style.fontSize = '' }
  }, [])
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState("User")
  const [userRole, setUserRole] = useState("Inspector")

  useEffect(() => {
    // Auth guard — redirect unauthenticated users
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login?role=inspector')
      return
    }
    // Load user data from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserName(user.name || user.firstName || user.fullName || user.email?.split('@')[0] || 'User')
        setUserRole(user.role || 'Inspector')
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [router])

  // Koke: "the sidebar menu should disappear after starting the inspection" —
  // inspection screens get the full width, no menu to wander off through.
  const inInspection = !!pathname?.startsWith('/dashboard/inspection-category')

  const isActive = (path: string) => pathname === path

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      path: '/dashboard/my-inspection',
      label: 'My Inspection',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      path: '/dashboard/inspection-status',
      label: 'Inspection Status',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex font-lexend">
      {/* Blurred cityscape behind everything — same photo family as the home page,
          washed down so the cards stay readable. */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/multi_unit_housing.png')] bg-cover bg-center blur-[7px] scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4F8]/85 via-white/80 to-[#E8F4F8]/90" />
      </div>

      {/* Desktop Sidebar */}
      {!inInspection && <aside className="hidden lg:flex lg:flex-col w-72 bg-gradient-to-b from-[#0090C0] via-[#005E92] to-[#003A66] shadow-xl border-r-2 border-[#40D0F0]/70 fixed h-full z-10 overflow-hidden">
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-[#40D0F0] via-[#0090C0] to-[#F84B5F]" />
        {/* Decorative color blooms so the panel isn't a flat block of color */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#40D0F0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-56 h-56 bg-[#F84B5F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-24 -right-10 w-48 h-48 bg-[#40D0F0]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-6 border-b border-[#40D0F0]/30 flex justify-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#40D0F0]/25 rounded-full blur-3xl pointer-events-none" />
          <Image
            src="/logo.png?v=3"
            alt="NSPIRE"
            width={300}
            height={100}
            className="relative h-32 w-auto cursor-pointer filter brightness-110"
            onClick={() => router.push('/')}
          />
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-lg font-bold transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#00C6D7] to-[#006795] text-white font-bold shadow-md shadow-[#006795]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#40D0F0]/30">
          <button
            onClick={() => router.push('/dashboard/settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-lg font-bold transition-all duration-200 ${
              isActive('/dashboard/settings')
                ? 'bg-gradient-to-r from-[#00C6D7] to-[#006795] text-white font-bold shadow-md shadow-[#006795]/30'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </button>

          <button
            onClick={() => {
              durableRemove('token')
              durableRemove('user')
              toast.success("Logged out successfully!", { position: "top-right" })
              setTimeout(() => router.push('/'), 1500)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-lg font-bold transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </aside>}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#0090C0] via-[#005E92] to-[#003A66] shadow-lg z-50 transform transition-transform duration-300 lg:hidden flex flex-col overflow-hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-[#40D0F0] via-[#0090C0] to-[#F84B5F]" />
        {/* Decorative color blooms so the panel isn't a flat block of color */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#40D0F0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-56 h-56 bg-[#F84B5F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-24 -right-10 w-48 h-48 bg-[#40D0F0]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-4 border-b border-[#40D0F0]/30 flex items-center justify-between overflow-hidden">
          <div className="absolute top-1/2 left-8 -translate-y-1/2 w-28 h-28 bg-[#40D0F0]/25 rounded-full blur-3xl pointer-events-none" />
          <Image
            src="/logo.png?v=3"
            alt="NSPIRE"
            width={180}
            height={60}
            className="relative w-auto h-16 cursor-pointer"
            onClick={() => {
              router.push('/')
              setIsMobileMenuOpen(false)
            }}
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path)
                setIsMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-lg font-bold transition-all duration-200 ${isActive(item.path) ? 'bg-gradient-to-r from-[#00C6D7] to-[#006795] text-white font-bold shadow-md shadow-[#006795]/30' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#40D0F0]/30">
          <button
            onClick={() => {
              router.push('/dashboard/settings')
              setIsMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-lg font-bold transition-all duration-200 ${isActive('/dashboard/settings') ? 'bg-gradient-to-r from-[#00C6D7] to-[#006795] text-white font-bold shadow-md shadow-[#006795]/30' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </button>

          <button
            onClick={() => {
              durableRemove('token')
              durableRemove('user')
              toast.success("Logged out successfully!", { position: "top-right" })
              setTimeout(() => router.push('/'), 1500)
              setIsMobileMenuOpen(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-lg font-bold transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`relative z-10 flex-1 ${inInspection ? '' : 'lg:ml-72'}`}>
        {/* Top Header */}
        <header className="bg-gradient-to-r from-[#0090C0] to-[#005E92] border-b-2 border-[#40D0F0]/60 px-4 md:px-6 py-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button — gone during an inspection, same as the sidebar */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 hover:bg-white/15 rounded-lg text-white ${inInspection ? 'invisible pointer-events-none' : ''}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Image
                src="/logo.png?v=3"
                alt="NSPIRE"
                width={120}
                height={40}
                className="w-auto h-12 cursor-pointer"
                onClick={() => router.push('/')}
              />
            </div>

            <div className="flex items-center gap-2 md:gap-4">

              <button
                onClick={() => router.push('/dashboard/notifications')}
                className="relative p-2 hover:bg-white/15 text-white rounded-lg transition-colors border border-white/30"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <div className="flex items-center gap-2">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D7FA8&color=fff`}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full w-8 h-8 md:w-10 md:h-10 border-2 border-white/60 shadow-sm"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-white">{(userName || '').toUpperCase()}</p>
                  <p className="text-xs text-[#B8ECFF] font-bold">{userRole}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  )
}
