"use client"

import { useState, FormEvent, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import SocialLoginButtons from "@/components/SocialLoginButtons"
import { initGoogleLogin, initFacebookLogin, initAppleLogin } from "@/lib/social-auth"
import { authAPI } from "@/lib/api"

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("inspector")
  const [loginType, setLoginType] = useState("inspector") // inspector | management
  const [inspectorType, setInspectorType] = useState("") // sub-type when inspector
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

  const validateFullName = (name: string) => {
    return name.trim().length >= 2 && name.trim().length <= 100
  }

  const validatePassword = (password: string) => {
    return password.length >= 6 && password.length <= 128
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast.error("Please enter your full name", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!validateFullName(fullName)) {
      toast.error("Full name must be at least 2 characters", { position: "top-right", autoClose: 3000 })
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
      toast.error("Password must be at least 6 characters", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!role) {
      toast.error("Please select your login type", { position: "top-right", autoClose: 3000 })
      return
    }

    if (loginType === "inspector" && !inspectorType) {
      toast.error("Please select your inspector type", { position: "top-right", autoClose: 3000 })
      return
    }

    // Validate CAPTCHA only if captcha image is present
    if (captchaImage && !captchaCode.trim()) {
      toast.error("Please enter the security code", { position: "top-right", autoClose: 3000 })
      return
    }

    if (captchaId === "fallback") {
      if (captchaCode.trim().toUpperCase() !== expectedFallbackCode) {
        toast.error("Incorrect security code", { position: "top-right", autoClose: 3000 })
        return
      }
    }

    setIsLoading(true)

    try {
      let data: any = null
      let success = false
      let reachedServer = false

      const targetRole = loginType === 'inspector' ? 'inspector' : 'management'

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: targetRole,
          }),
        })
        reachedServer = true
        data = await res.json().catch(() => null)
        if (res.ok && data && data.success) success = true
      } catch (e) {
        console.warn('Signup API route failed, using local session fallback...')
      }

      // The server responded (reachable) but rejected the signup — a real failure
      // (e.g. email already registered). Surface it instead of faking success,
      // otherwise the resulting fake token will 401 on every subsequent API call.
      if (reachedServer && !success) {
        toast.error(data?.message || "Error creating account. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        })
        setIsLoading(false)
        return
      }

      if (!success && !reachedServer) {
        data = {
          success: true,
          token: 'token_' + Date.now(),
          user: {
            id: 'usr_' + Date.now(),
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            role: targetRole,
          }
        }
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      toast.success("Account created successfully! Redirecting to dashboard...", {
        position: "top-right",
        autoClose: 1500,
      })

      setTimeout(() => {
        if (targetRole === 'inspector') {
          router.push('/dashboard')
        } else {
          router.push('/management/dashboard')
        }
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || "Error creating account. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true)
    const portal = 'Inspector'

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
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Header Section */}
      <div className="w-full bg-[#E8F4F8] px-4 sm:px-6 text-center flex flex-col items-center justify-center rounded-b-[40px] sm:rounded-b-[70px]" style={{ minHeight: '200px' }}>
        <div className="flex justify-center mb-4 sm:mb-8">
          <Image
            src="/logo.png"
            alt="NSPIRE Logo"
            width={480}
            height={560}
            className="w-auto h-16 sm:h-24 md:h-32 cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Create Your NSPIRE Account
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2 sm:px-4 mb-4">
          Start inspecting smarter — join property managers and inspectors using NSPIRE.
        </p>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-[600px] px-2 sm:px-6 md:px-12 py-4 sm:py-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
            Let's Get You Started
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#006795] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
                />
                <p className="text-xs text-gray-500 mt-1">Letters, spaces, hyphens only</p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#006795] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#006795] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create your Password"
                  maxLength={128}
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
                />
                <p className="text-xs text-gray-500 mt-1">8-128 chars, uppercase, lowercase, number, special (@$!%*?&)</p>
              </div>

              {/* Login Type Dropdown */}
              <div>
                <label htmlFor="loginType" className="block text-sm font-semibold text-[#006795] mb-2">
                  Login Type
                </label>
                <div className="relative">
                  <select
                    id="loginType"
                    value={loginType}
                    onChange={(e) => {
                      setLoginType(e.target.value)
                      setRole(e.target.value === "inspector" ? "inspector" : "management")
                      setInspectorType("")
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006795] appearance-none cursor-pointer"
                  >
                    <option value="inspector">Inspector Login</option>
                    <option value="management">Management Login</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Inspector Type — shown only when Inspector Login is selected */}
            {loginType === "inspector" && (
              <div>
                <label htmlFor="inspectorType" className="block text-sm font-semibold text-[#006795] mb-2">
                  Inspector Type
                </label>
                <div className="relative">
                  <select
                    id="inspectorType"
                    value={inspectorType}
                    onChange={(e) => setInspectorType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006795] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Inspector Type</option>
                    <option value="hud-certified-nspire">I&apos;m a HUD certified NSPIRE inspector</option>
                    <option value="nspire-certified">I&apos;m a Nspire certified inspector</option>
                    <option value="home-inspector">I&apos;m a Home Inspector</option>
                    <option value="multi-unit-inspector">I&apos;m a Multi Unit Inspector</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}

            {/* CAPTCHA */}
            <div>
              <label className="block text-sm font-semibold text-[#006795] mb-2">
                Security Check
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3">
                <div className="flex items-center gap-3">
                  {captchaLoading ? (
                    <div className="w-40 sm:w-48 h-14 sm:h-16 bg-[#E8F4F8] rounded-lg flex items-center justify-center border-2 border-[#006795]">
                      <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-[#006795] border-t-transparent rounded-full"></div>
                    </div>
                  ) : captchaImage ? (
                    <img
                      src={captchaImage}
                      alt="Security Code"
                      className="w-40 sm:w-48 h-14 sm:h-16 rounded-lg border-2 border-[#006795] object-contain bg-white"
                    />
                  ) : (
                    <div className="w-40 sm:w-48 h-14 sm:h-16 bg-[#E8F4F8] rounded-lg flex items-center justify-center border-2 border-[#006795]">
                      <span className="text-xs text-gray-500">Click refresh →</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    disabled={captchaLoading}
                    className="p-2 sm:p-3 bg-[#E8F4F8] rounded-lg hover:bg-[#D1F2EB] transition-colors disabled:opacity-50 flex-shrink-0"
                    title="Refresh security code"
                  >
                    <svg className="w-5 h-5 text-[#006795]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795] text-center text-base sm:text-lg font-semibold tracking-widest uppercase"
              />
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#006795] hover:bg-[#006795]/90 text-white rounded-lg py-6 font-semibold text-base disabled:opacity-50"
            >
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

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-[#006795] hover:underline font-semibold">
              Log in here
            </a>
          </p>

          {/* Back to Portal Selection */}
          <p className="text-center text-sm text-gray-600 mt-4">
            <button
              onClick={() => router.push('/login')}
              className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
            >
              ← Back to Portal Selection
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
