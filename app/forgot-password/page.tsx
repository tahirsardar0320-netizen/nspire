"use client"

import { useState, FormEvent } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"

type Step = 'email' | 'otp' | 'password'

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<Step>('email')
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    // At least 8 characters, max 128, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/
    return passwordRegex.test(password)
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error("Please enter your email address", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", { position: "top-right", autoClose: 3000 })
      return
    }

    setIsLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to send OTP. Please try again.", { position: "top-right", autoClose: 3000 })
        setIsLoading(false)
        return
      }

      toast.success("OTP sent to your email! Please check your inbox.", { position: "top-right", autoClose: 4000 })
      setStep('otp')
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error("Error connecting to server. Please try again later.", { position: "top-right", autoClose: 3000 })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!otp.trim()) {
      toast.error("Please enter the OTP", { position: "top-right", autoClose: 3000 })
      return
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("OTP must be 6 digits", { position: "top-right", autoClose: 3000 })
      return
    }

    setIsLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Invalid OTP. Please try again.", { position: "top-right", autoClose: 3000 })
        setIsLoading(false)
        return
      }

      toast.success("OTP verified! Please enter your new password.", { position: "top-right", autoClose: 3000 })
      setStep('password')
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error("Error connecting to server. Please try again later.", { position: "top-right", autoClose: 3000 })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!newPassword) {
      toast.error("Please enter your new password", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!validatePassword(newPassword)) {
      toast.error("Password must be 8-128 characters with uppercase, lowercase, number, and special character (@$!%*?&)", { position: "top-right", autoClose: 5000 })
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right", autoClose: 3000 })
      return
    }

    setIsLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to reset password. Please try again.", { position: "top-right", autoClose: 3000 })
        setIsLoading(false)
        return
      }

      toast.success("Password reset successfully! Redirecting to login...", { position: "top-right", autoClose: 3000 })
      setTimeout(() => router.push('/login'), 2000)
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error("Error connecting to server. Please try again later.", { position: "top-right", autoClose: 3000 })
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    setIsLoading(true)
    try {
      await authAPI.resendResetOTP(email)
      toast.success("New OTP sent to your email!", { position: "top-right", autoClose: 3000 })
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP. Please try again.", { position: "top-right", autoClose: 3000 })
    } finally {
      setIsLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 'email': return 'Forgot Your Password?'
      case 'otp': return 'Enter Verification Code'
      case 'password': return 'Create New Password'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 'email': return "Enter your registered email address, and we'll send you a verification code."
      case 'otp': return `We've sent a 6-digit code to ${email}. Enter it below.`
      case 'password': return 'Choose a strong password with uppercase, lowercase, number, and special character.'
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section */}
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{getStepTitle()}</h1>
        <p className="text-sm md:text-base text-gray-600 px-4 mb-8">{getStepDescription()}</p>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${step === 'email' ? 'bg-[#006795]' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 'otp' ? 'bg-[#006795]' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 'password' ? 'bg-[#006795]' : 'bg-gray-300'}`} />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[600px] px-6 md:px-12 py-8">
          
          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your registered email"
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#006795] hover:bg-[#006795]/90 text-white rounded-lg py-6 font-semibold text-base disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-900 mb-2">Verification Code</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795] text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#006795] hover:bg-[#006795]/90 text-white rounded-lg py-6 font-semibold text-base disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={isLoading}
                  className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  maxLength={128}
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
                />
                <p className="text-xs text-gray-500 mt-1">8-128 characters with uppercase, lowercase, number, and special character (@$!%*?&)</p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  maxLength={128}
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006795]"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#006795] hover:bg-[#006795]/90 text-white rounded-lg py-6 font-semibold text-base disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          {/* Back to Login Link */}
          <p className="text-center text-sm mt-6">
            <button 
              onClick={() => step === 'email' ? router.push('/login') : setStep('email')}
              className="text-[#F84B5F] hover:underline font-semibold cursor-pointer bg-transparent border-0"
            >
              {step === 'email' ? 'Back to Login' : '← Start Over'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

