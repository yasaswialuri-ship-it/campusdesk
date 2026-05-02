'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useApp } from '@/lib/app-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DEPARTMENTS, OFFER_TYPES } from '@/lib/mock-data'
import type { Seller, Department, OfferType } from '@/lib/types'
import {
  Search,
  Star,
  Clock,
  Package,
  MessageCircle,
  ChevronDown,
  BadgeCheck,
  Zap,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react'

function FilterChip({
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
        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
        transition-all duration-200
        ${
          selected
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
            : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-surface/80'
        }
      `}
    >
      {children}
    </button>
  )
}

function OfferBadge({ type }: { type: OfferType }) {
  const styles: Record<OfferType, { bg: string; text: string }> = {
    Assignment: { bg: 'bg-primary/15', text: 'text-primary' },
    'Lab Record': { bg: 'bg-success/15', text: 'text-success' },
    Project: { bg: 'bg-warning/15', text: 'text-warning' },
  }
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${styles[type].bg} ${styles[type].text}`}>
      {type}
    </span>
  )
}

function SellerCard({ seller, onClick }: { seller: Seller; onClick: () => void }) {
  return (
    <div className="glass border border-border/50 rounded-2xl p-5 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group gradient-border slide-up">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:scale-105 transition-transform"
            style={{ backgroundColor: seller.avatarColor }}
          >
            {seller.avatar}
          </div>
          {seller.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background rounded-full flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate text-lg">{seller.name}</h3>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-warning">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{seller.rating}</span>
            </div>
            <span className="text-muted-foreground">({seller.reviewCount} reviews)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success">
            {seller.pricePerPage ? (
              <>
                <span>₹{seller.pricePerPage}</span>
                <span className="text-xs text-muted-foreground font-normal block">/page</span>
              </>
            ) : (
              <>
                <span>₹{seller.flatPrice}</span>
                <span className="text-xs text-muted-foreground font-normal block">flat</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{seller.bio}</p>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1.5 rounded-lg bg-surface border border-border/50 text-muted-foreground text-xs font-medium">
          {seller.department} • {seller.year}
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          {seller.ordersCompleted} orders
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          {seller.responseTime}
        </span>
      </div>

      {/* Offer types */}
      <div className="flex flex-wrap gap-2 mb-5">
        {seller.offers.map((offer) => (
          <OfferBadge key={offer} type={offer} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onClick}
          className="flex-1 h-11 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
        >
          View Profile
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 border-border hover:border-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <MessageCircle className="w-5 h-5 text-primary" />
        </Button>
      </div>
    </div>
  )
}

export function HomeScreen() {
  const { user, sellers, filters, setFilter, selectSeller, navigateTo } = useApp()

  const collegeDomain = user?.email?.split('@')[1] || 'college.edu'

  const filteredSellers = useMemo(() => {
    let result = [...sellers]

    // Filter by offer type
    if (filters.offerType !== 'All') {
      result = result.filter((s) => s.offers.includes(filters.offerType))
    }

    // Filter by branch
    if (filters.branch !== 'All') {
      result = result.filter((s) => s.department === filters.branch)
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.subjects.some((sub) => sub.toLowerCase().includes(search)) ||
          s.bio?.toLowerCase().includes(search)
      )
    }

    // Sort
    switch (filters.sort) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'price-low':
        result.sort((a, b) => (a.pricePerPage || a.flatPrice || 0) - (b.pricePerPage || b.flatPrice || 0))
        break
      case 'price-high':
        result.sort((a, b) => (b.pricePerPage || b.flatPrice || 0) - (a.pricePerPage || a.flatPrice || 0))
        break
      case 'orders':
        result.sort((a, b) => (b.ordersCompleted || 0) - (a.ordersCompleted || 0))
        break
    }

    return result
  }, [sellers, filters])

  const handleViewProfile = (seller: Seller) => {
    selectSeller(seller)
    navigateTo('seller-profile')
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 bg-background border-b border-border safe-area-top">
        <div className="p-4 pb-0">
          {/* Title row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center glow-primary-subtle">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-foreground">
                  Find Writers
                </h1>
                <span className="text-xs text-muted-foreground">
                  @{collegeDomain}
                </span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search writers, subjects..."
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="pl-11 h-12 bg-surface border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Offer type filters */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
            <FilterChip
              selected={filters.offerType === 'All'}
              onClick={() => setFilter('offerType', 'All')}
            >
              All Types
            </FilterChip>
            {OFFER_TYPES.map((type) => (
              <FilterChip
                key={type}
                selected={filters.offerType === type}
                onClick={() => setFilter('offerType', type)}
              >
                {type}
              </FilterChip>
            ))}
          </div>

          {/* Branch filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            <FilterChip
              selected={filters.branch === 'All'}
              onClick={() => setFilter('branch', 'All')}
            >
              All Branches
            </FilterChip>
            {DEPARTMENTS.slice(0, 5).map((dept) => (
              <FilterChip
                key={dept}
                selected={filters.branch === dept}
                onClick={() => setFilter('branch', dept as Department)}
              >
                {dept}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-24">

      {/* Results header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          <strong className="text-foreground">{filteredSellers.length}</strong> Writers available
        </span>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value as typeof filters.sort)}
            className="appearance-none bg-surface border border-border rounded-xl px-4 py-2 pr-9 text-sm text-foreground cursor-pointer focus:outline-none focus:border-primary transition-colors"
          >
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="orders">Most Orders</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Seller list */}
      <div className="px-4 space-y-4">
        {filteredSellers.length > 0 ? (
          filteredSellers.map((seller, index) => (
            <div key={seller.id} style={{ animationDelay: `${index * 50}ms` }}>
              <SellerCard
                seller={seller}
                onClick={() => handleViewProfile(seller)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No writers found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
