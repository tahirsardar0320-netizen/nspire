"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import Image from "next/image"
import { usersAPI, authAPI } from "@/lib/api"

type TabType = "profile" | "notifications" | "security"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [isLoading, setIsLoading] = useState(false)

  // Profile state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("Inspector")
  const [language, setLanguage] = useState("English")
  const [timezone, setTimezone] = useState("EST")

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          setName(user.fullName || '')
          setEmail(user.email || '')
          setRole(user.role || 'Inspector')
        }
        
        // Try to get fresh data from API
        const response = await authAPI.getMe()
        if (response.success) {
          setName(response.user.fullName || '')
          setEmail(response.user.email || '')
          setPhone(response.user.phone || '')
          setRole(response.user.role || 'Inspector')
          setLanguage(response.user.language || 'English')
          setTimezone(response.user.timezone || 'EST')
          if (response.user.emailNotifications) {
            setEmailNotifications((prev) => ({ ...prev, ...response.user.emailNotifications }))
          }
          if (response.user.inAppNotifications) {
            setInAppNotifications((prev) => ({ ...prev, ...response.user.inAppNotifications }))
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
    loadUserData()
  }, [])

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState({
    inspectionReminders: true,
    reportCompletion: true,
    followUpTasks: false,
    systemUpdates: true,
  })
  const [inAppNotifications, setInAppNotifications] = useState({
    inspectionReminders: true,
    reportCompletion: true,
    followUpTasks: true,
    systemUpdates: false,
  })

  // Security state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.updateProfile({
        fullName: name,
        email,
        phone,
        role,
        language,
        timezone,
      })
      if (response.success) {
        toast.success("Profile updated successfully!", { position: "top-right" })
        // Update local storage
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          user.fullName = name
          user.email = email
          localStorage.setItem('user', JSON.stringify(user))
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.updateNotificationSettings(
        emailNotifications,
        inAppNotifications
      )
      if (response.success) {
        toast.success("Notification preferences saved!", { position: "top-right" })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save notifications", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" })
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!", { position: "top-right" })
      return
    }
    setIsLoading(true)
    try {
      const response = await usersAPI.changePassword(currentPassword, newPassword)
      if (response.success) {
        toast.success("Password changed successfully!", { position: "top-right" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to change password", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.toggleTwoFactor()
      if (response.success) {
        setTwoFactorEnabled(response.twoFactorEnabled)
        toast.success(response.message, { position: "top-right" })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle 2FA", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.info("Logged out successfully", { position: "top-right" })
    setTimeout(() => router.push("/"), 1000)
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 font-lexend">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">Manage your account preferences, notifications, and security</p>
        </div>
 
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <nav className="space-y-1.5">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeTab === "profile"
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </button>
 
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeTab === "notifications"
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </button>
 
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeTab === "security"
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security Settings
                </button>
              </nav>
            </div>
          </div>
 
          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Profile Settings</h2>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">Update your personal information and profile picture</p>
                </div>
 
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="relative group">
                    <Image
                      src="https://ui-avatars.com/api/?name=Emma+Johnson&size=100&background=0F4C5C&color=fff"
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-2xl border-2 border-slate-100 shadow-sm"
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm hover:shadow-md transition-all duration-200 border-0">
                      Change Photo
                    </Button>
                    <p className="text-[11px] font-semibold text-slate-400">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>
 
                {/* Form */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all duration-200"
                    />
                  </div>
 
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all duration-200"
                    />
                  </div>
 
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all duration-200"
                    />
                  </div>
 
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-semibold text-slate-800 transition-all duration-200 cursor-pointer"
                    >
                      <option value="Inspector">Inspector</option>
                      <option value="Property Manager">Property Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
 
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-semibold text-slate-800 transition-all duration-200 cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
 
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-semibold text-slate-800 transition-all duration-200 cursor-pointer"
                    >
                      <option value="EST">EST (UTC-5)</option>
                      <option value="CST">CST (UTC-6)</option>
                      <option value="MST">MST (UTC-7)</option>
                      <option value="PST">PST (UTC-8)</option>
                    </select>
                  </div>
                </div>
 
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-teal-600/10 transition-all duration-200 border-0"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
 
            {/* Notification Preferences */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">Control how and when you receive portal alerts</p>
                </div>
 
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email Notifications</h3>
                    <div className="grid gap-3.5">
                      {Object.entries(emailNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800 text-sm">
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </p>
                            <p className="text-xs font-semibold text-slate-500">
                              Receive email notifications for {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() =>
                                setEmailNotifications({ ...emailNotifications, [key]: !value })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
 
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">In-App Notifications</h3>
                    <div className="grid gap-3.5">
                      {Object.entries(inAppNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800 text-sm">
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </p>
                            <p className="text-xs font-semibold text-slate-500">
                              Show in-app notifications for {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() =>
                                setInAppNotifications({ ...inAppNotifications, [key]: !value })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
 
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-teal-600/10 transition-all duration-200 border-0"
                  >
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </div>
            )}
 
            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-8">
                {/* Change Password */}
                <div className="space-y-5 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                    <p className="text-slate-500 text-xs mt-0.5 font-medium">Update your password regularly to keep your account secure</p>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all duration-200"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all duration-200"
                        placeholder="Enter new password (min. 8 characters)"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button onClick={handleChangePassword} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold px-4 py-2 rounded-xl text-xs border-0 shadow-sm shadow-teal-600/10">
                      Update Password
                    </Button>
                  </div>
                </div>
 
                {/* Two-Factor Authentication */}
                <div className="space-y-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Two-Factor Authentication</h2>
                    <p className="text-slate-500 text-xs mt-0.5 font-medium">Add an extra layer of security to your account logins</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm">Require authentication code</p>
                      <p className="text-xs font-semibold text-slate-500 max-w-lg">
                        We will ask for a verification code via your registered communication channels whenever you log in from an untrusted device.
                      </p>
                    </div>
                    <Button
                      onClick={handleToggle2FA}
                      disabled={isLoading}
                      className={`w-full sm:w-auto font-bold px-5 py-2.5 rounded-xl text-xs border-0 shadow-sm transition-all duration-200 ${
                        twoFactorEnabled
                          ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10"
                          : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10"
                      }`}
                    >
                      {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </Button>
                  </div>
                </div>
 
                {/* Session Management */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Session Management</h2>
                    <p className="text-slate-500 text-xs mt-0.5 font-medium">View and manage your active web portal sessions</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 text-sm">Current Device</p>
                        <p className="text-xs font-semibold text-slate-400">Windows · Chrome · {new Date().toLocaleString()}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Active Now
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 text-sm">iPhone 13</p>
                        <p className="text-xs font-semibold text-slate-400">iOS · Safari · Last active 2 hours ago</p>
                      </div>
                      <Button variant="outline" className="text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 border-rose-100 rounded-xl px-4 py-2 text-xs font-bold">
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-start">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100 rounded-xl px-5 py-2.5 text-xs font-bold flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log Out From All Devices
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
