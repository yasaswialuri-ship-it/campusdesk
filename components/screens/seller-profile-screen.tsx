'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import type { OfferType } from '@/lib/types'
import {
  ArrowLeft,
  Star,
  Clock,
  Package,
  Calendar,
  BadgeCheck,
  Minus,
  Plus,
  MessageCircle,
  Info,
  Shield,
  Sparkles,
} from 'lucide-react'

const PLATFORM_FEE_PERCENT = 10

export function SellerProfileScreen() {
  const { selectedSeller, navigateTo, selectConversation, conversations } = useApp()
  const [selectedOffer, setSelectedOffer] = useState<OfferType>('Assignment')
  const [pageCount, setPageCount] = useState(5)

  if (!selectedSeller) {
    navigateTo('home')
    return null
  }

  const hasPerPagePricing = !!selectedSeller.pricePerPage
  const basePrice = hasPerPagePricing
    ? selectedSeller.pricePerPage! * pageCount
    : selectedSeller.flatPrice!

  const platformFee = Math.round((basePrice * PLATFORM_FEE_PERCENT) / 100)
  const totalPrice = basePrice + platformFee

  const handleChat = () => {
    const existingConv = conversations.find(
      (c) => c.participantId === selectedSeller.id
    )
    if (existingConv) {
      selectConversation(existingConv)
    }
    navigateTo('chat')
  }

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Header with gradient */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 h-48 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        
        {/* Back button */}
        <div className="relative z-10 p-4 pt-6 safe-area-top">
          <button
            onClick={() => navigateTo('home')}
            className="w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center text-foreground hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile header */}
      <div className="relative z-10 px-4 -mt-2">
        <div className="glass border border-border/50 rounded-3xl p-6 gradient-border">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                style={{ backgroundColor: selectedSeller.avatarColor }}
              >
                {selectedSeller.avatar}
              </div>
              {selectedSeller.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-primary fill-primary/20" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-1">
                {selectedSeller.name}
              </h1>
              <div className="flex items-center gap-2 text-sm mb-2">
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{selectedSeller.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({selectedSeller.reviewCount} reviews)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-primary/15 text-primary text-xs font-semibold">
                  {selectedSeller.department}
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface border border-border/50 text-muted-foreground text-xs font-medium">
                  {selectedSeller.year}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground mt-5 leading-relaxed">{selectedSeller.bio}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass border border-border/50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-success mb-1">
              <Package className="w-5 h-5" />
              <span className="text-xl font-bold">{selectedSeller.ordersCompleted}</span>
            </div>
            <p className="text-xs text-muted-foreground">Orders Done</p>
          </div>
          <div className="glass border border-border/50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-bold">{selectedSeller.responseTime}</span>
            </div>
            <p className="text-xs text-muted-foreground">Response</p>
          </div>
          <div className="glass border border-border/50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-warning mb-1">
              <Calendar className="w-5 h-5" />
              <span className="text-xl font-bold">{selectedSeller.deliveryDays}d</span>
            </div>
            <p className="text-xs text-muted-foreground">Delivery</p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="px-4 mt-6">
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Subjects Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {selectedSeller.subjects.map((subject) => (
            <span
              key={subject}
              className="px-4 py-2 rounded-xl bg-surface border border-border/50 text-sm text-foreground hover:border-primary/30 transition-colors"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Order Box */}
      <div className="px-4 mt-6">
        <div className="glass border border-border/50 rounded-3xl p-6 gradient-border">
          <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Place an Order
          </h2>

          {/* Offer type selection */}
          <div className="mb-5">
            <label className="text-sm text-muted-foreground mb-3 block">Select Offer Type</label>
            <div className="flex gap-2">
              {selectedSeller.offers.map((offer) => (
                <button
                  key={offer}
                  onClick={() => setSelectedOffer(offer)}
                  className={`
                    flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                    ${
                      selectedOffer === offer
                        ? 'bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25'
                        : 'bg-surface border border-border text-foreground hover:border-primary/50'
                    }
                  `}
                >
                  {offer}
                </button>
              ))}
            </div>
          </div>

          {/* Page counter (for per-page pricing) */}
          {hasPerPagePricing && (
            <div className="mb-5">
              <label className="text-sm text-muted-foreground mb-3 block">Number of Pages</label>
              <div className="flex items-center justify-center gap-6 py-3">
                <button
                  onClick={() => setPageCount((p) => Math.max(1, p - 1))}
                  className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all active:scale-95"
                >
                  <Minus className="w-5 h-5 text-foreground" />
                </button>
                <div className="text-center">
                  <span className="text-4xl font-bold text-foreground">{pageCount}</span>
                  <span className="text-sm text-muted-foreground block">pages</span>
                </div>
                <button
                  onClick={() => setPageCount((p) => p + 1)}
                  className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-background/50 rounded-2xl p-5 mb-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {hasPerPagePricing
                  ? `₹${selectedSeller.pricePerPage} × ${pageCount} pages`
                  : 'Flat Price'}
              </span>
              <span className="text-foreground font-medium">₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Platform Fee (10%)
              </span>
              <span className="text-foreground font-medium">₹{platformFee}</span>
            </div>
            <div className="border-t border-border pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-2xl text-success">₹{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Reserve button */}
          <Button className="w-full h-14 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground font-semibold text-lg rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]">
            Reserve & Order
          </Button>

          {/* Note */}
          <div className="flex items-start gap-3 mt-5 p-4 bg-success/5 rounded-xl border border-success/20">
            <Info className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Payment is released only after you confirm physical delivery of the work.
            </p>
          </div>
        </div>
      </div>

      {/* Chat button (fixed) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 safe-area-bottom">
        <Button
          onClick={handleChat}
          variant="outline"
          className="w-full h-14 border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary font-semibold rounded-xl transition-all"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Chat with {selectedSeller.name.split(' ')[0]}
        </Button>
      </div>
    </div>
  )
}
