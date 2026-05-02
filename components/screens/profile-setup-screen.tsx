'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEPARTMENTS, YEARS } from '@/lib/mock-data'
import type { Department, Year, Role } from '@/lib/types'
import { ArrowLeft, ArrowRight, Search, PenTool, Users, Sparkles, Check } from 'lucide-react'

const roleOptions: { id: Role; title: string; description: string; icon: typeof Search; gradient: string }[] = [
  {
    id: 'find-writers',
    title: 'Find Writers',
    description: 'Get help with your assignments',
    icon: Search,
    gradient: 'from-primary/20 to-violet-500/20',
  },
  {
    id: 'be-writer',
    title: 'Be a Writer',
    description: 'Earn by helping others',
    icon: PenTool,
    gradient: 'from-success/20 to-emerald-500/20',
  },
  {
    id: 'both',
    title: 'Both',
    description: 'Find help and offer services',
    icon: Users,
    gradient: 'from-warning/20 to-amber-500/20',
  },
]

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex-1 relative">
          <div
            className={`
              h-1.5 rounded-full transition-all duration-500
              ${s <= step ? 'bg-gradient-to-r from-primary to-violet-600' : 'bg-border'}
            `}
          />
          {s === step && (
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      ))}
    </div>
  )
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 
        ${
          selected
            ? 'bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/30 scale-105'
            : 'bg-surface border border-border/50 text-foreground hover:border-primary/50 hover:scale-[1.02]'
        }
      `}
    >
      {selected && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
      {children}
    </button>
  )
}

function RoleCard({
  role,
  selected,
  onClick,
}: {
  role: (typeof roleOptions)[0]
  selected: boolean
  onClick: () => void
}) {
  const Icon = role.icon
  return (
    <button
      onClick={onClick}
      className={`
        p-5 rounded-2xl border-2 text-left w-full
        transition-all duration-300 group
        ${
          selected
            ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]'
            : 'border-border/50 bg-surface hover:border-primary/50 hover:scale-[1.01]'
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div
          className={`
            w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
            ${selected 
              ? 'bg-gradient-to-br from-primary to-violet-600 glow-primary-subtle' 
              : `bg-gradient-to-br ${role.gradient}`
            }
          `}
        >
          <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-foreground'}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground">{role.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{role.description}</p>
        </div>
        {selected && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </button>
  )
}

export function ProfileSetupScreen() {
  const {
    profileSetupStep,
    nextProfileStep,
    prevProfileStep,
    user,
    setUserName,
    setUserDepartment,
    setUserYear,
    setUserRole,
    navigateTo,
  } = useApp()

  const [name, setName] = useState(user?.name || '')
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(
    user?.department || null
  )
  const [selectedYear, setSelectedYear] = useState<Year | null>(user?.year || null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(user?.role || null)

  const handleNext = () => {
    if (profileSetupStep === 1 && name.trim()) {
      setUserName(name.trim())
      nextProfileStep()
    } else if (profileSetupStep === 2 && selectedDepartment) {
      setUserDepartment(selectedDepartment)
      nextProfileStep()
    } else if (profileSetupStep === 3 && selectedYear) {
      setUserYear(selectedYear)
      nextProfileStep()
    } else if (profileSetupStep === 4 && selectedRole) {
      setUserRole(selectedRole)
      nextProfileStep()
    }
  }

  const canProceed = () => {
    if (profileSetupStep === 1) return name.trim().length > 0
    if (profileSetupStep === 2) return !!selectedDepartment
    if (profileSetupStep === 3) return !!selectedYear
    if (profileSetupStep === 4) return !!selectedRole
    return false
  }

  const handleBack = () => {
    if (profileSetupStep === 1) {
      navigateTo('otp')
    } else {
      prevProfileStep()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-[80px] animate-pulse delay-500" />

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center text-foreground hover:bg-surface transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="glass p-8 rounded-3xl border border-border/50 gradient-border">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary">Step {profileSetupStep} of 4</span>
          </div>
          
          <ProgressBar step={profileSetupStep} />

          {/* Step 1: Name */}
          {profileSetupStep === 1 && (
            <div className="slide-up">
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-2">
                {"What's"} your name?
              </h1>
              <p className="text-muted-foreground mb-6">
                This will be visible to other students
              </p>

              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 bg-surface border-border text-foreground text-lg placeholder:text-muted-foreground rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Department */}
          {profileSetupStep === 2 && (
            <div className="slide-up">
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-2">
                Select your department
              </h1>
              <p className="text-muted-foreground mb-6">Choose your branch of study</p>

              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dept, index) => (
                  <div key={dept} style={{ animationDelay: `${index * 30}ms` }} className="slide-up">
                    <Chip
                      selected={selectedDepartment === dept}
                      onClick={() => setSelectedDepartment(dept as Department)}
                    >
                      {dept}
                    </Chip>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Year */}
          {profileSetupStep === 3 && (
            <div className="slide-up">
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-2">
                Which year are you in?
              </h1>
              <p className="text-muted-foreground mb-6">Select your current year of study</p>

              <div className="grid grid-cols-2 gap-3">
                {YEARS.map((year, index) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year as Year)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`
                      slide-up p-4 rounded-xl text-center font-medium transition-all duration-200
                      ${
                        selectedYear === year
                          ? 'bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                          : 'bg-surface border border-border/50 text-foreground hover:border-primary/50 hover:scale-[1.02]'
                      }
                    `}
                  >
                    {selectedYear === year && <Check className="w-4 h-4 inline mr-2" />}
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Role */}
          {profileSetupStep === 4 && (
            <div className="slide-up">
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-2">
                How will you use CampusDesk?
              </h1>
              <p className="text-muted-foreground mb-6">You can change this later</p>

              <div className="space-y-3">
                {roleOptions.map((role, index) => (
                  <div key={role.id} style={{ animationDelay: `${index * 80}ms` }} className="slide-up">
                    <RoleCard
                      role={role}
                      selected={selectedRole === role.id}
                      onClick={() => setSelectedRole(role.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full h-14 mt-8 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {profileSetupStep === 4 ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Get Started
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
