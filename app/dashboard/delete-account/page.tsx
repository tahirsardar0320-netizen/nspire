"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authAPI } from "@/lib/api"
import { toast } from "react-toastify"
import { AlertTriangle, Trash2, Shield, Lock, User, Mail, Loader2, Info } from "lucide-react"

export default function DeleteAccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [password, setPassword] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const userRes = await authAPI.getMe()
      if (userRes.success) {
        setUser(userRes.user)
      }
    } catch (error: any) {
      console.error('Error fetching user:', error)
      toast.error("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm')
      return
    }

    if (!password) {
      toast.error("Please enter your password to confirm")
      return
    }

    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/delete-account`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ password })
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Account deleted successfully. Redirecting...", { position: "top-right" })
        
        // Clear all local storage
        localStorage.clear()
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        throw new Error(data.message || 'Failed to delete account')
      }
    } catch (error: any) {
      console.error('Delete account error:', error)
      toast.error(`Failed to delete account: ${error.message}`, { position: "top-right" })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-lexend">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-600 border-t-transparent mx-auto"></div>
            <p className="text-slate-500 text-sm font-semibold">Loading account information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-rose-600 animate-pulse" />
                Delete Account
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>

          {/* Warning Card */}
          <div className="bg-rose-50/50 border border-rose-200/80 border-l-4 border-l-rose-500 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-rose-200 text-rose-600 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-rose-900 tracking-tight">Warning: This action is irreversible</h3>
              <p className="text-xs sm:text-sm text-rose-800 font-medium leading-relaxed">
                Deleting your account will permanently remove all your data from our servers. This includes:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-rose-700 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>All inspection reports and findings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>Property information and records</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>Your profile and account settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>All uploaded images and documents</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Current Account Info */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Info className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Current Account Information</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                <div className="w-10 h-10 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center flex-shrink-0 text-sky-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</p>
                  <p className="font-extrabold text-sm text-slate-800 truncate">{user?.fullName || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</p>
                  <p className="font-extrabold text-sm text-slate-800 truncate">{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 text-teal-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Role</p>
                  <p className="font-extrabold text-sm text-slate-800 capitalize truncate">{user?.role || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Delete Confirmation */}
          {!showConfirmation ? (
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Ready to delete your account?</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
                  Before proceeding, please make sure you've downloaded any important data or reports you need.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowConfirmation(true)}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl border-0 shadow-sm shadow-rose-600/10 text-xs sm:text-sm"
                >
                  Continue to Delete
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Confirm Account Deletion</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE in capital letters"
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Enter your password to confirm
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setShowConfirmation(false)
                      setConfirmText("")
                      setPassword("")
                    }}
                    variant="outline"
                    className="w-full sm:flex-1 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm"
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleting || confirmText !== "DELETE" || !password}
                    className="w-full sm:flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl border-0 shadow-sm shadow-rose-600/10 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete My Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Help Text */}
          <div className="text-center text-xs text-slate-500 font-semibold">
            <p>Need help? Contact support at <a href="mailto:support@inspire.com" className="text-teal-600 hover:underline">support@inspire.com</a></p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
