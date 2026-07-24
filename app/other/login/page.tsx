"use client"

import { useState, FormEvent } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import SocialLoginButtons from "@/components/SocialLoginButtons"
import { initGoogleLogin, initFacebookLogin, initAppleLogin } from "@/lib/social-auth"
import { authAPI } from "@/lib/api"

export default function OtherLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Please enter your email address", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!password) {
      toast.error("Please enter your password", { position: "top-right", autoClose: 3000 })
      return
    }

    if (password.length < 8 || password.length > 128) {
      toast.error("Password must be between 8 and 128 characters", { position: "top-right", autoClose: 3000 })
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.login(email, password, rememberMe, 'other')

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))

        const userRole = response.user?.role || 'other'

        toast.success("Login successful! Redirecting to dashboard...", { position: "top-right", autoClose: 2000 })

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
        toast.error(response.message || "Login failed. Please try again.", { position: "top-right", autoClose: 3000 })
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      // ── EMAIL VERIFICATION REDIRECT BYPASSED FOR TESTING ──
      toast.error(error.message || "Error connecting to server. Please check if backend is running.", { position: "top-right", autoClose: 3000 })
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true)

    try {
      let result
      if (provider === 'google') {
        result = await initGoogleLogin('Other')
      } else if (provider === 'facebook') {
        result = await initFacebookLogin('Other')
      } else {
        result = await initAppleLogin('Other')
      }

      // Send to backend for verification
      const response = await authAPI.socialLogin(
        result.email,
        result.fullName || result.email.split('@')[0],
        'Other',
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="w-full bg-gradient-to-b from-[#1E1B4B] to-[#312E81] text-white px-6 text-center flex flex-col items-center justify-center rounded-b-[50px] shadow-lg border-b border-indigo-950/20" style={{ height: '280px' }}>
        <div className="flex justify-center mb-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-inner border border-white/15">
          <Image src="/logo.png" alt="NSPIRE Logo" width={480} height={560} className="w-auto h-16 md:h-20 lg:h-22 cursor-pointer filter brightness-0 invert" onClick={() => router.push('/')} />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">Welcome to NSPIRE</h1>
        <p className="text-xs md:text-sm font-semibold tracking-wider uppercase text-amber-400">Other Portal</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[540px] px-6 md:px-10 py-8 bg-white rounded-2xl border border-slate-200/80 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 text-center tracking-tight">Log In to Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-600 font-medium">Remember Me</span>
              </label>
              <button type="button" onClick={() => router.push('/forgot-password')} className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-semibold bg-transparent border-0 cursor-pointer">Forgot Password?</button>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-6 font-bold text-base disabled:opacity-50 shadow-md transition-all duration-205">
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

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <button onClick={() => router.push('/other/signup')} className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold bg-transparent border-0 cursor-pointer">Sign Up</button>
          </p>

          <p className="text-center text-sm text-slate-500 mt-3">
            <button onClick={() => router.push('/login')} className="text-slate-500 hover:text-slate-800 hover:underline font-semibold bg-transparent border-0 cursor-pointer">Back to Portal Selection</button>
          </p>

          <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
            By signing up, you agree to our <a href="/terms" className="text-slate-500 hover:text-slate-700 hover:underline font-medium">Terms of Service</a> and <a href="/privacy" className="text-slate-500 hover:text-slate-700 hover:underline font-medium">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

