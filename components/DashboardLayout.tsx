"use client"

import { ReactNode, useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "react-toastify"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
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

  const isActive = (path: string) => pathname === path

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
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
    {
      path: '/dashboard/delete-account',
      label: 'Delete Account',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex font-lexend">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-[#0F4C5C] to-[#142834] shadow-xl border-r border-[#0F4C5C]/30 fixed h-full z-10">
        <div className="p-6 border-b border-[#0F4C5C]/40 flex justify-center">
          <Image
            src="/logo.png"
            alt="NSPIRE"
            width={300}
            height={100}
            className="h-28 w-auto cursor-pointer filter brightness-110"
            onClick={() => router.push('/')}
          />
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#0F4C5C]/40">
          <button
            onClick={() => router.push('/dashboard/settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-all duration-200 ${
              isActive('/dashboard/settings')
                ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20'
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
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              toast.success("Logged out successfully!", { position: "top-right" })
              setTimeout(() => router.push('/'), 1500)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0F4C5C] to-[#142834] shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-4 border-b border-[#0F4C5C]/40 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="NSPIRE"
            width={180}
            height={60}
            className="w-auto h-14 cursor-pointer"
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
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-all duration-200 ${isActive(item.path) ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#0F4C5C]/40">
          <button
            onClick={() => {
              router.push('/dashboard/settings')
              setIsMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-all duration-200 ${isActive('/dashboard/settings') ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              toast.success("Logged out successfully!", { position: "top-right" })
              setTimeout(() => router.push('/'), 1500)
              setIsMobileMenuOpen(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/85 px-4 md:px-6 py-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Image
                src="/logo.png"
                alt="NSPIRE"
                width={120}
                height={40}
                className="w-auto h-10 cursor-pointer"
                onClick={() => router.push('/')}
              />
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
              <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search inspections, properties..."
                className="flex-1 outline-none text-sm bg-transparent text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => router.push('/dashboard/notifications')}
                className="relative p-2 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors border border-slate-200"
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
                  className="rounded-full w-8 h-8 md:w-10 md:h-10 border border-slate-200 shadow-sm"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">{(userName || '').toUpperCase()}</p>
                  <p className="text-xs text-teal-600 font-bold">{userRole}</p>
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
