"use client"

import { ReactNode, useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "react-toastify"

interface ManagementDashboardLayoutProps {
  children: ReactNode
}

interface User {
  id: string
  fullName: string
  email: string
  role: string
}

export default function ManagementDashboardLayout({ children }: ManagementDashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Auth guard — redirect unauthenticated users
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/management/login')
      return
    }
    // Get user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [router])

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'property-manager': 'Property Manager',
      'management': 'Management',
      'supervisor': 'Supervisor',
      'inspector': 'Inspector',
      'other': 'Other Manager',
      'asset-manager': 'Asset Manager'
    }
    return roleNames[role] || role
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success("Logged out successfully!", { position: "top-right" })
    setTimeout(() => router.push('/'), 1500)
  }

  const isActive = (path: string) => pathname === path

  const navigationItems = [
    {
      path: '/management/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      path: '/management/dashboard/my-properties',
      label: 'My Properties',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      path: '/management/dashboard/reports',
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
          <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      )
    },
    {
      path: '/management/dashboard/analytics',
      label: 'Analytics/Insights',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-[#E8F4F8] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-lg fixed h-full z-10">
        <div className="p-6 border-b">
          <Image
            src="/logo.png"
            alt="NSPIRE"
            width={300}
            height={100}
            className="h-28 w-auto cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-colors ${
                isActive(item.path) ? 'bg-[#F84B5F] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={() => router.push('/management/dashboard/settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-colors ${
              isActive('/management/dashboard/settings') ? 'bg-[#F84B5F] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
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
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b flex items-center justify-between">
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
            className="p-2 hover:bg-gray-100 rounded-lg"
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
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-colors ${
                isActive(item.path) ? 'bg-[#F84B5F] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={() => {
              router.push('/management/dashboard/settings')
              setIsMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-medium transition-colors ${
              isActive('/management/dashboard/settings') ? 'bg-[#F84B5F] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </button>
          
          <button
            onClick={() => {
              handleLogout()
              setIsMobileMenuOpen(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
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
        <header className="bg-white shadow-sm px-4 md:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
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
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="flex-1 outline-none text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => router.push('/management/notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Language Selector */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 9h20M2 14h20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-sm font-medium">English</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0D6A8D&color=fff`}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full w-8 h-8 md:w-10 md:h-10"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">{(user?.fullName || 'User').toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{user ? getRoleDisplayName(user.role) : 'Loading...'}</p>
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
