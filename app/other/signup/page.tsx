"use client"

import { useState, FormEvent, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import SocialLoginButtons from "@/components/SocialLoginButtons"
import { initGoogleLogin, initFacebookLogin, initAppleLogin } from "@/lib/social-auth"
import { authAPI } from "@/lib/api"

export default function OtherSignup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("other")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // CAPTCHA state
  const [captchaId, setCaptchaId] = useState("")
  const [captchaImage, setCaptchaImage] = useState("")
  const [captchaCode, setCaptchaCode] = useState("")
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [expectedFallbackCode, setExpectedFallbackCode] = useState("")

  // Load captcha on mount
  useEffect(() => {
    loadCaptcha()
  }, [])

  const generateFallbackCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let fallbackText = ""
    for (let i = 0; i < 4; i++) {
      fallbackText += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const svgString = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="60" viewBox="0 0 180 60"><rect width="100%" height="100%" fill="%23E8F4F8"/><text x="50%" y="60%" font-family="monospace" font-size="28" font-weight="bold" fill="%23006795" dominant-baseline="middle" text-anchor="middle" letter-spacing="4">${fallbackText}</text><line x1="10" y1="15" x2="170" y2="45" stroke="%23006795" stroke-width="2" opacity="0.3"/><line x1="20" y1="45" x2="160" y2="15" stroke="%23006795" stroke-width="2" opacity="0.3"/></svg>`
    setCaptchaId("fallback")
    setCaptchaImage(svgString)
    setCaptchaCode("")
    setExpectedFallbackCode(fallbackText)
  };

  const loadCaptcha = async () => {
    setCaptchaLoading(true)
    try {
      const response = await authAPI.getCaptcha()
      if (response.success && response.captchaImage) {
        setCaptchaId(response.captchaId)
        setCaptchaImage(response.captchaImage)
        setCaptchaCode("")
      }
    } catch (error) {
      console.error("Failed to load captcha:", error)
      generateFallbackCaptcha()
      toast.info("Using backup security check.", {
        position: "top-right",
        autoClose: 2000,
      })
    } finally {
      setCaptchaLoading(false)
    }
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error("Please enter your full name", { position: "top-right", autoClose: 3000 })
      return
    }

    if (fullName.trim().length < 2) {
      toast.error("Full name must be at least 2 characters long", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!email.trim()) {
      toast.error("Please enter your email address", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!password) {
      toast.error("Please create a password", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters with uppercase, lowercase, and number", { position: "top-right", autoClose: 4000 })
      return
    }

    if (!role) {
      toast.error("Please select your role", { position: "top-right", autoClose: 3000 })
      return
    }

    // Validate CAPTCHA
    if (!captchaCode.trim()) {
      toast.error("Please enter the security code", { position: "top-right", autoClose: 3000 })
      return
    }

    if (captchaId === "fallback") {
      if (captchaCode.trim().toUpperCase() !== expectedFallbackCode) {
        toast.error("Incorrect security code", { position: "top-right", autoClose: 3000 })
        return
      }
    } else if (captchaCode.length !== 5) {
      toast.error("Security code must be 5 characters", { position: "top-right", autoClose: 3000 })
      return
    }

    setIsLoading(true)

    try {
      // Call local Next.js API route — no email verification
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: 'other',
        }),
      })
      const response = await res.json()

      if (response.success) {
        if (response.token) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        toast.success("Account created! You can now log in.", {
          position: "top-right",
          autoClose: 1500,
        })
        setTimeout(() => {
          router.push('/other/login')
        }, 1500)
      } else {
        toast.error(response.message || "Signup failed. Please try again.", { position: "top-right", autoClose: 3000 })
        loadCaptcha()
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || "Error creating account. Please try again.", { position: "top-right", autoClose: 3000 })
      loadCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true)
    const portal = 'Other'

    try {
      let result
      if (provider === 'google') {
        result = await initGoogleLogin(portal)
      } else if (provider === 'facebook') {
        result = await initFacebookLogin(portal)
      } else {
        result = await initAppleLogin(portal)
      }

      // Send to backend for verification
      const response = await authAPI.socialLogin(
        result.email,
        result.fullName || result.email.split('@')[0],
        portal,
        provider
      )

      if (response.success) {
        // Store token
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))

        toast.success(`Logged in with ${provider}! Redirecting...`, {
          position: "top-right",
          autoClose: 2000,
        })

        // Redirect based on role
        const userRole = response.user.role
        setTimeout(() => {
          if (userRole === 'admin') {
            router.push('/admin/dashboard')
          } else if (userRole === 'management' || userRole === 'property-manager' || userRole === 'supervisor') {
            router.push('/management/dashboard')
          } else if (userRole === 'inspector') {
            router.push('/dashboard')
          } else {
            router.push('/other/dashboard')
          }
        }, 2000)
      } else {
        toast.error(response.message || 'Social login failed', {
          position: "top-right",
          autoClose: 3000,
        })
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error)

      if (!error.message?.includes('cancelled') && !error.message?.includes('closed')) {
        toast.error(error.message || `Failed to sign in with ${provider}`, {
          position: "top-right",
          autoClose: 3000,
        })
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="w-full bg-gradient-to-b from-[#1E1B4B] to-[#312E81] text-white px-6 text-center flex flex-col items-center justify-center rounded-b-[50px] shadow-lg border-b border-indigo-950/20" style={{ height: '280px' }}>
        <div className="flex justify-center mb-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-inner border border-white/15">
          <Image src="/logo.png" alt="NSPIRE Logo" width={480} height={560} className="w-auto h-16 md:h-20 lg:h-22 cursor-pointer filter brightness-0 invert" onClick={() => router.push('/')} />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">Create Your NSPIRE Account</h1>
        <p className="text-xs md:text-sm font-semibold tracking-wider uppercase text-amber-400 px-4">Other Portal</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[640px] px-6 md:px-10 py-8 bg-white rounded-2xl border border-slate-200/80 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 text-center tracking-tight font-sans">Let's Get You Started</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create your Password" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <input
                  type="text"
                  id="role"
                  value="Other"
                  readOnly
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-550 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            {/* CAPTCHA */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Security Check
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3">
                <div className="flex items-center gap-3">
                  {captchaLoading ? (
                    <div className="w-40 sm:w-48 h-14 sm:h-16 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                      <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    </div>
                  ) : captchaImage ? (
                    <img
                      src={captchaImage}
                      alt="Security Code"
                      className="w-40 sm:w-48 h-14 sm:h-16 rounded-lg border border-slate-200 object-contain bg-white shadow-sm"
                    />
                  ) : (
                    <div className="w-40 sm:w-48 h-14 sm:h-16 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                      <span className="text-xs text-slate-400">Click refresh →</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    disabled={captchaLoading}
                    className="p-2 sm:p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 flex-shrink-0 text-slate-600"
                    title="Refresh security code"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={captchaCode}
                onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())}
                placeholder="Enter code from image"
                maxLength={5}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-base sm:text-lg font-bold tracking-widest uppercase focus:border-transparent transition-all"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-6 font-bold text-base disabled:opacity-50 shadow-md transition-all duration-200">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <SocialLoginButtons
              onGoogleClick={() => handleSocialLogin('google')}
              onFacebookClick={() => handleSocialLogin('facebook')}
              onAppleClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            />
          </div>

          <p className="text-center text-sm text-slate-500 mt-6 font-medium">
            Already have an account?{" "}
            <button onClick={() => router.push('/other/login')} className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold bg-transparent border-0 cursor-pointer">Log in here</button>
          </p>
        </div>
      </div>
    </div>
  )
}
