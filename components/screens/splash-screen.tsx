'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, MessageCircle, CreditCard, Check, Users, Sparkles, ArrowRight } from 'lucide-react'

const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']

const features = [
  {
    icon: Shield,
    title: 'Student Verified',
    description: 'Only college emails allowed',
    gradient: 'from-primary/20 to-violet-500/20',
  },
  {
    icon: MessageCircle,
    title: 'In-app Chat',
    description: 'Communicate directly',
    gradient: 'from-success/20 to-emerald-500/20',
  },
  {
    icon: CreditCard,
    title: 'Pay Safely',
    description: 'Payment releases upon physical delivery',
    gradient: 'from-warning/20 to-amber-500/20',
  },
]

const AVATARS = [
  { color: '#8b5cf6', letter: 'R' },
  { color: '#22c55e', letter: 'P' },
  { color: '#eab308', letter: 'A' },
  { color: '#ef4444', letter: 'K' },
]

export function SplashScreen() {
  const { setUserEmail, navigateTo } = useApp()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    const domain = email.split('@')[1]?.toLowerCase()
    if (BLOCKED_DOMAINS.some((blocked) => domain?.includes(blocked))) {
      return 'Please use your college email address'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      return
    }
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUserEmail(email)
    navigateTo('otp')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="flex-1 p-6 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-violet-500/10 rounded-full blur-[80px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-success/5 rounded-full blur-[60px] animate-pulse delay-500" />

        <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center glow-primary-subtle">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-syne)] text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Campus<span className="text-primary">Desk</span>
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="font-[family-name:var(--font-syne)] text-3xl lg:text-5xl font-bold text-foreground mb-4 leading-tight text-balance">
            Your Campus.{' '}
            <span className="bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent">
              All in One Place.
            </span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            The premium peer marketplace for assignments, projects & lab records.
          </p>

          {/* Feature cards */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 glass transition-all duration-300 hover:border-primary/30 hover:translate-x-1 group slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof desktop */}
          <div className="hidden lg:flex items-center gap-4 text-muted-foreground">
            <div className="flex -space-x-3">
              {AVATARS.map((avatar, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-sm font-semibold text-white shadow-lg transition-transform hover:scale-110 hover:z-10"
                  style={{ backgroundColor: avatar.color }}
                >
                  {avatar.letter}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Trusted by <strong className="text-foreground">2,000+</strong> students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex-1 p-6 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="glass p-8 rounded-3xl border border-border/50 gradient-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">Registration Open</span>
            </div>

            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-2">
              Get Started
            </h2>
            <p className="text-muted-foreground mb-8">
              Enter your college email to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">College Email</label>
                <Input
                  type="email"
                  placeholder="yourname@college.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  className="h-14 bg-background/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {error && (
                  <p className="text-destructive text-sm flex items-center gap-2 slide-up">
                    <span className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center text-xs font-bold">!</span>
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue with Email
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Social proof mobile */}
            <div className="lg:hidden flex items-center justify-center gap-3 mt-8 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {AVATARS.slice(0, 3).map((avatar, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-surface flex items-center justify-center text-[10px] font-semibold text-white"
                    style={{ backgroundColor: avatar.color }}
                  >
                    {avatar.letter}
                  </div>
                ))}
              </div>
              <span>⭐⭐⭐⭐⭐ Trusted by 2,000+ students</span>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-warning/5 rounded-xl border border-warning/20">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Check className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-warning">Disclaimer:</strong> CampusDesk is a peer-to-peer platform.
                  Use at your own risk. We do not guarantee work quality.
                </span>
              </p>
            </div>

            {/* Privacy note */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              🔒 We never share your email with anyone
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}