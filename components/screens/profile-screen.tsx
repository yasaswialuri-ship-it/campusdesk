'use client'

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import type { Request } from '@/lib/types'
import {
  BadgeCheck,
  Edit,
  FileText,
  CheckCircle,
  Star,
  Wallet,
  Crown,
  ChevronRight,
  Bookmark,
  Receipt,
  Bell,
  HelpCircle,
  LogOut,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Zap,
} from 'lucide-react'

function StatCard({
  icon: Icon,
  value,
  label,
  gradient,
}: {
  icon: typeof FileText
  value: string | number
  label: string
  gradient: string
}) {
  return (
    <div className="glass border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all duration-300 group">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

function RequestItem({ request }: { request: Request }) {
  const statusConfig = {
    active: { color: 'bg-primary/15 text-primary border-primary/20', icon: Clock },
    'in-progress': { color: 'bg-warning/15 text-warning border-warning/20', icon: Zap },
    completed: { color: 'bg-success/15 text-success border-success/20', icon: CheckCircle },
    cancelled: { color: 'bg-destructive/15 text-destructive border-destructive/20', icon: AlertCircle },
  }

  const config = statusConfig[request.status]
  const StatusIcon = config.icon

  return (
    <div className="flex items-center gap-4 p-4 glass border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color} border`}>
        <StatusIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{request.subject}</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {request.type} • {request.responses} responses
        </p>
      </div>
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${config.color} border`}>
        {request.status.replace('-', ' ')}
      </span>
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
  badge,
}: {
  icon: typeof FileText
  label: string
  onClick?: () => void
  danger?: boolean
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 hover:bg-surface transition-all duration-200
        ${danger ? 'text-destructive' : 'text-foreground'}
      `}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-destructive/10' : 'bg-surface'}`}>
        <Icon className={`w-5 h-5 ${danger ? 'text-destructive' : 'text-muted-foreground'}`} />
      </div>
      <span className="flex-1 text-left font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="w-6 h-6 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  )
}

export function ProfileScreen() {
  const { user, requests, navigateTo } = useApp()

  const activeRequests = requests.filter((r) => r.status === 'active' || r.status === 'in-progress')

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="glass border-b border-border/50 p-4 pt-6 safe-area-top">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center glow-primary-subtle">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-foreground">
              Profile
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:border-primary rounded-xl gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>

        {/* Profile Card */}
        <div className="glass rounded-2xl p-5 border border-border/50 gradient-border">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div
                className="w-18 h-18 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                style={{ backgroundColor: '#8b5cf6', width: '72px', height: '72px' }}
              >
                {user?.avatar || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-background rounded-full flex items-center justify-center shadow-lg">
                <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-xl text-foreground">
                {user?.name || 'Student Name'}
              </h2>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {user?.email || 'student@college.edu'}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {user?.department && (
                  <span className="px-3 py-1 rounded-lg bg-primary/15 text-primary text-xs font-semibold">
                    {user.department}
                  </span>
                )}
                {user?.year && (
                  <span className="px-3 py-1 rounded-lg bg-surface border border-border/50 text-muted-foreground text-xs font-medium">
                    {user.year}
                  </span>
                )}
              </div>
            </div>
          </div>
          {user?.bio && (
            <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border/50 leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={FileText}
            value={requests.length}
            label="Requests Posted"
            gradient="from-primary/20 to-violet-500/20"
          />
          <StatCard
            icon={CheckCircle}
            value={requests.filter((r) => r.status === 'completed').length}
            label="Work Completed"
            gradient="from-success/20 to-emerald-500/20"
          />
          <StatCard
            icon={Star}
            value="4.8"
            label="Average Rating"
            gradient="from-warning/20 to-amber-500/20"
          />
          <StatCard
            icon={Wallet}
            value="₹2,450"
            label="Total Earned"
            gradient="from-primary/20 to-violet-500/20"
          />
        </div>

        {/* Wallet Card */}
        <div className="glass border border-border/50 rounded-2xl p-5 gradient-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-3xl font-bold text-success">₹340</p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-success hover:bg-success/90 text-success-foreground font-semibold rounded-xl gap-1.5"
            >
              Withdraw
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Active Requests
            </h3>
            <div className="space-y-3">
              {activeRequests.map((request, index) => (
                <div key={request.id} className="slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <RequestItem request={request} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Card */}
        <div className="relative overflow-hidden rounded-2xl p-5">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-violet-500/20 to-primary/30 animate-pulse" />
          <div className="absolute inset-[1px] bg-background rounded-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center flex-shrink-0 glow-primary-subtle">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">Go Premium</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Get priority listing, lower fees, and verified badge
                </p>
              </div>
            </div>
            <Button className="w-full mt-5 h-12 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]">
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="glass border border-border/50 rounded-2xl overflow-hidden">
          <MenuItem icon={FileText} label="My Requests" badge={activeRequests.length} />
          <div className="border-t border-border/50 mx-4" />
          <MenuItem icon={Bookmark} label="Saved Writers" />
          <div className="border-t border-border/50 mx-4" />
          <MenuItem icon={Receipt} label="Transactions" />
          <div className="border-t border-border/50 mx-4" />
          <MenuItem icon={Bell} label="Notifications" badge={3} />
          <div className="border-t border-border/50 mx-4" />
          <MenuItem icon={HelpCircle} label="Help & Support" />
          <div className="border-t border-border/50 mx-4" />
          <MenuItem
            icon={LogOut}
            label="Log Out"
            danger
            onClick={() => navigateTo('splash')}
          />
        </div>
      </div>
    </div>
  )
}
