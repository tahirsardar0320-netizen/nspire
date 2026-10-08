"use client"

import { useState, FormEvent, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useSearchParams, useRouter } from "next/navigation"
import SocialLoginButtons from "@/components/SocialLoginButtons"
import { initGoogleLogin, initFacebookLogin, initAppleLogin , resumePendingOAuth } from "@/lib/social-auth"
import { authAPI } from "@/lib/api"
import { completeSocialSignIn, dashboardForRole } from "@/lib/completeSocialSignIn"
import { safeSetItem } from "@/lib/safeStorage"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role') || 'user'

  const getRoleDisplayName = () => {
    if (role === 'inspector') return 'Inspector'
    if (role === 'management') return 'Management'
    return 'User'
  }

  const getPortalFromRole = () => {
    if (role === 'inspector') return 'Inspector'
    if (role === 'management') return 'Management'
    if (role === 'other') return 'Other'
    return 'Inspector'
  }



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email.trim()) {
      toast.error("Please enter your email address", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }



    if (!password) {
      toast.error("Please enter your password", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setIsLoading(true)

    try {
      // One request, through the same helper every other portal's login already
      // uses. This screen used to try two endpoints with bare fetch() calls and
      // no time limit. iOS holds a stalled request open instead of failing it,
      // so the await never settled, the finally never ran, and the button sat on
      // "Logging in..." with no error and no way forward — while Android's
      // WebView gave up quickly and showed a real message. authAPI.login aborts
      // at 45s, so this now always finishes one way or the other.
      const data = await authAPI.login(
        email.trim().toLowerCase(),
        password,
        rememberMe,
        // Omitted for the default portal, so the server picks the role itself.
        (role && role !== 'user' ? role : undefined) as string,
      )

      if (!data?.success || !data?.token) {
        toast.error(data?.message || 'Invalid email or password', { position: 'top-right', autoClose: 3000 })
        return
      }

      // A failed write here would leave the user looking signed in with no
      // token, and the next request would bounce them straight back here.
      if (!safeSetItem('token', data.token)) {
        toast.error("Couldn't save your session — free up some space on your device and try again.", { position: 'top-right', autoClose: 5000 })
        return
      }
      safeSetItem('user', JSON.stringify(data.user))

      toast.success('Login successful! Redirecting to dashboard...', { position: 'top-right', autoClose: 1500 })
      router.push(dashboardForRole(data.user?.role || role))
    } catch (error: any) {
      console.error('Login error:', error)
      // Never mint a token here. A session the server did not issue looks fine
      // until the first API call 401s and dumps the user back on this screen,
      // which is exactly how the "randomly logged out" reports started.
      toast.error(
        error?.timedOut
          ? 'That took too long. Check your connection and try again.'
          : error?.status
            // The server answered and refused — show what it said rather than
            // blaming the connection, which is what used to happen on a simple
            // wrong password.
            ? error.message || 'Invalid email or password'
            : "Can't reach the server. Check your connection and try again.",
        { position: 'top-right', autoClose: 4000 },
      )
    } finally {
      setIsLoading(false)
    }
  }

  // A sign-in interrupted by the in-app browser leaves its result waiting on
  // the server. Collect it on the way back in, so the user does not have to
  // start again having already authorised the app.
  useEffect(() => {
    let active = true
    resumePendingOAuth()
      .then((result) => {
        if (!active || !result) return
        completeSocialSignIn(result.provider, result.email, result.fullName, result.portal)
          .then((done) => {
            if (!active || !done.ok) return
            toast.success('Signed in. Redirecting...', { position: 'top-right', autoClose: 1500 })
            router.push(dashboardForRole(done.role))
          })
          .catch(() => {})
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true)
    const portal = getPortalFromRole()

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
        // A failed write here would leave the user looking signed in with no
        // token, and the next request would bounce them straight back here.
        if (!safeSetItem('token', response.token)) {
          toast.error("Couldn't save your session — free up some space on your device and try again.", { position: "top-right", autoClose: 5000 })
          return
        }
        safeSetItem('user', JSON.stringify(response.user))

        toast.success(`Logged in with ${provider}! Redirecting...`, {
          position: "top-right",
          autoClose: 2000,
        })

        // Redirect based on role
        const userRole = response.user.role
        router.push(dashboardForRole(userRole))
      } else {
        toast.error(response.message || 'Social login failed', {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error)

      // Don't show error if user cancelled
      if (!error.message?.includes('cancelled') && !error.message?.includes('closed')) {
        toast.error(error.message || `Failed to sign in with ${provider}`, {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } finally {
      // One place, so no branch can leave the button disabled.
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section - Full Width with rounded bottom corners */}
      <div className="w-full bg-[#E8F4F8] px-6 text-center flex flex-col items-center justify-center rounded-b-[70px]" style={{ height: '280px' }}>
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="NSPIRE Logo"
            width={480}
            height={560}
            className="w-auto h-24 md:h-32 lg:h-36 cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Welcome to NSPIRE
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Smart Inspections. Real-Time Results.
        </p>
        {role && role !== 'user' && (
          <p className="text-xs md:text-sm text-[#006795] font-semibold mb-8">
            Logging in as {getRoleDisplayName()}
          </p>
        )}
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[600px] px-6 md:px-12 py-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center">
            Log In to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                maxLength={128}
                className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#006795] focus:ring-[#006795]"
                />
                <span className="text-sm text-gray-700">Remember Me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-[#006795] hover:underline font-medium"
                onClick={(e) => { e.preventDefault(); router.push('/forgot-password') }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#006795] hover:bg-[#006795]/90 text-white rounded-lg py-6 font-semibold text-base disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
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

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => router.push(`/signup${role && role !== 'user' ? `?role=${role}` : ''}`)}
              className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
            >
              Sign Up
            </button>
          </p>

          {/* Back to Portal Selection */}
          <p className="text-center text-sm text-gray-600 mt-4">
            <button
              onClick={() => router.push('/profile-selection')}
              className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              ← Back to Portal Selection
            </button>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our{" "}
            <button onClick={() => router.push('/terms-of-service')} className="text-gray-700 hover:underline font-medium bg-transparent border-0 cursor-pointer p-0 inline">
              Terms of Service
            </button>
            {" "}and{" "}
            <button onClick={() => router.push('/privacy-policy')} className="text-gray-700 hover:underline font-medium bg-transparent border-0 cursor-pointer p-0 inline">
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

