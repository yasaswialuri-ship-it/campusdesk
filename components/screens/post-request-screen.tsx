'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SUBJECTS } from '@/lib/mock-data'
import type { OfferType } from '@/lib/types'
import {
  FileText,
  FlaskConical,
  Laptop,
  Lightbulb,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
  Send,
} from 'lucide-react'

const requestTypes: { type: OfferType; icon: typeof FileText; label: string; gradient: string }[] = [
  { type: 'Assignment', icon: FileText, label: 'Assignment', gradient: 'from-primary/20 to-violet-500/20' },
  { type: 'Lab Record', icon: FlaskConical, label: 'Lab Record', gradient: 'from-success/20 to-emerald-500/20' },
  { type: 'Project', icon: Laptop, label: 'Project', gradient: 'from-warning/20 to-amber-500/20' },
]

const deadlineUnits = ['days', 'hours', 'weeks'] as const

const tips = [
  'Be specific about your requirements',
  'Mention the exact topic or syllabus',
  'Include any formatting guidelines',
  'Set a realistic deadline',
  'Budget fairly for quality work',
]

export function PostRequestScreen() {
  const { addRequest, navigateTo } = useApp()
  const [selectedType, setSelectedType] = useState<OfferType | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [deadlineValue, setDeadlineValue] = useState('')
  const [deadlineUnit, setDeadlineUnit] = useState<(typeof deadlineUnits)[number]>('days')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

  const canSubmit =
    selectedType &&
    selectedSubjects.length > 0 &&
    description.trim().length > 0 &&
    budget &&
    deadlineValue

  const handleSubmit = () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    setTimeout(() => {
      addRequest({
        type: selectedType!,
        subject: selectedSubjects.join(', '),
        description: description.trim(),
        budget: parseInt(budget),
        deadline: `${deadlineValue} ${deadlineUnit}`,
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-border/50 p-4 safe-area-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center glow-primary-subtle">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-foreground">
              Post Request
            </h1>
            <p className="text-xs text-muted-foreground">
              Get help from writers in your college
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:flex lg:gap-6">
        <div className="flex-1 space-y-6">
          {/* Request Type */}
          <div className="glass border border-border/50 rounded-2xl p-5">
            <label className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">1</span>
              What do you need help with?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {requestTypes.map(({ type, icon: Icon, label, gradient }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`
                    p-4 rounded-xl border-2 text-center transition-all duration-200
                    ${
                      selectedType === type
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'border-border/50 bg-surface hover:border-primary/50 hover:scale-[1.01]'
                    }
                  `}
                >
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br ${gradient} ${selectedType === type ? 'scale-110' : ''} transition-transform`}>
                    <Icon className={`w-6 h-6 ${selectedType === type ? 'text-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-sm font-medium ${selectedType === type ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                  {selectedType === type && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selection */}
          <div className="glass border border-border/50 rounded-2xl p-5">
            <label className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">2</span>
              Select Subjects
              <span className="text-xs text-muted-foreground font-normal">(multi-select)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      selectedSubjects.includes(subject)
                        ? 'bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/25'
                        : 'bg-surface border border-border/50 text-foreground hover:border-primary/50 hover:scale-[1.02]'
                    }
                  `}
                >
                  {selectedSubjects.includes(subject) && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                  {subject}
                </button>
              ))}
            </div>
            {selectedSubjects.length > 0 && (
              <p className="text-xs text-primary mt-3">{selectedSubjects.length} subject(s) selected</p>
            )}
          </div>

          {/* Description */}
          <div className="glass border border-border/50 rounded-2xl p-5">
            <label className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">3</span>
              Describe your requirements
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
              placeholder="Describe your requirements in detail..."
              rows={5}
              className="w-full bg-surface border border-border/50 rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {description.length}/5000 characters
            </p>
          </div>

          {/* Budget and Deadline */}
          <div className="glass border border-border/50 rounded-2xl p-5">
            <label className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">4</span>
              Budget & Deadline
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Budget (₹)</label>
                <Input
                  type="number"
                  placeholder="500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-12 bg-surface border-border/50 text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Deadline</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="3"
                    value={deadlineValue}
                    onChange={(e) => setDeadlineValue(e.target.value)}
                    className="h-12 bg-surface border-border/50 text-foreground placeholder:text-muted-foreground flex-1 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <select
                    value={deadlineUnit}
                    onChange={(e) => setDeadlineUnit(e.target.value as typeof deadlineUnit)}
                    className="bg-surface border border-border/50 rounded-xl px-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    {deadlineUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Panel - Mobile */}
          <div className="lg:hidden">
            <TipsPanel />
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-4 p-5 bg-destructive/5 rounded-2xl border border-destructive/20">
            <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Disclaimer</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                CampusDesk is a peer-to-peer platform. We do not guarantee the quality of work.
                Always verify the work before final submission.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Post Request
              </span>
            )}
          </Button>
        </div>

        {/* Tips Panel - Desktop */}
        <div className="hidden lg:block w-80 sticky top-24">
          <TipsPanel />
        </div>
      </div>
    </div>
  )
}

function TipsPanel() {
  return (
    <div className="glass border border-border/50 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-warning" />
        </div>
        <h3 className="font-semibold text-foreground">Tips for Success</h3>
      </div>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}
