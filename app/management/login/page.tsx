"use client"

import { useState, FormEvent } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import SocialLoginButtons from "@/components/SocialLoginButtons"
import { initGoogleLogin, initFacebookLogin, initAppleLogin } from "@/lib/social-auth"
import { authAPI } from "@/lib/api"

export default function ManagementLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

    if (password.length < 8 || password.length > 128) {
      toast.error("Password must be between 8 and 128 characters", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.login(email, password, rememberMe, 'management')

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))

        const userRole = response.user?.role || 'management'

        toast.success("Login successful! Redirecting to dashboard...", {
          position: "top-right",
          autoClose: 2000,
        })

        // Redirect to appropriate dashboard based on user role
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
        toast.error(response.message || "Login failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        })
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      // ── EMAIL VERIFICATION REDIRECT BYPASSED FOR TESTING ──
      toast.error(error.message || "Error connecting to server. Please check if backend is running.", {
        position: "top-right",
        autoClose: 3000,
      })
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true)

    try {
      let result
      if (provider === 'google') {
        result = await initGoogleLogin('Management')
      } else if (provider === 'facebook') {
        result = await initFacebookLogin('Management')
      } else {
        result = await initAppleLogin('Management')
      }

      // Send to backend for verification
      const response = await authAPI.socialLogin(
        result.email,
        result.fullName || result.email.split('@')[0],
        'Management',
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
        <p className="text-xs md:text-sm text-[#006795] font-semibold mt-4">
          Management Portal Login
        </p>
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
              <button
                type="button"
                onClick={() => router.push('/management/forgot-password')}
                className="text-sm text-[#006795] hover:underline font-medium bg-transparent border-0 cursor-pointer"
              >
                Forgot Password?
              </button>
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
              onClick={() => router.push('/management/signup')}
              className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
            >
              Sign Up
            </button>
          </p>

          {/* Back to Portal Selection */}
          <p className="text-center text-sm text-gray-600 mt-4">
            <button
              onClick={() => router.push('/login')}
              className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              ← Back to Portal Selection
            </button>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-gray-700 hover:underline font-medium">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="/privacy" className="text-gray-700 hover:underline font-medium">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

