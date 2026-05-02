'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, CheckCircle2, Sparkles } from 'lucide-react'

export function OtpScreen() {
  const { user, navigateTo } = useApp()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleVerify = useCallback(() => {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsVerifying(true)
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      navigateTo('profile-setup')
    }, 1500)
  }, [otp, navigateTo])

  const handleResend = () => {
    setResendTimer(30)
    setOtp(Array(6).fill(''))
    inputRefs.current[0]?.focus()
  }

  const filledCount = otp.filter((d) => d !== '').length

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-[80px] animate-pulse delay-500" />

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigateTo('splash')}
          className="w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center text-foreground hover:bg-surface transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="glass p-8 rounded-3xl border border-border/50 gradient-border">
          {/* Email icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-6 glow-primary-subtle">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-2">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground">
              {"We've"} sent a 6-digit code to
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-foreground font-semibold">{user?.email || 'your@email.edu'}</span>
              <button
                onClick={() => navigateTo('splash')}
                className="text-primary text-sm hover:underline font-medium"
              >
                Change
              </button>
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold
                  bg-surface border-2 rounded-xl
                  focus:outline-none transition-all duration-200
                  ${digit ? 'border-primary text-foreground bg-primary/5 scale-105' : 'border-border text-muted-foreground'}
                  ${error ? 'border-destructive' : ''}
                  focus:border-primary focus:ring-2 focus:ring-primary/20 focus:scale-105
                `}
              />
            ))}
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${i < filledCount ? 'bg-primary scale-125' : 'bg-border'}
                  `}
                />
              ))}
            </div>
            {filledCount === 6 && (
              <CheckCircle2 className="w-5 h-5 text-success animate-bounce" />
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-sm mb-4 slide-up">
              <span className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center text-xs font-bold">!</span>
              {error}
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isVerifying || filledCount < 6}
            className="w-full h-14 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Verify & Continue
              </>
            )}
          </Button>

          {/* Resend */}
          <div className="text-center mt-6">
            {resendTimer > 0 ? (
              <p className="text-muted-foreground text-sm">
                Resend code in{' '}
                <span className="text-primary font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary text-sm hover:underline font-semibold transition-colors"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          {"Didn't"} receive the code? Check your spam folder or try a different email.
        </p>
      </div>
    </div>
  )
}
