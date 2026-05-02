'use client'

import { useApp } from '@/lib/app-context'
import type { Screen } from '@/lib/types'
import { Search, PlusSquare, MessageCircle, User, Home } from 'lucide-react'

const navItems: { screen: Screen; icon: typeof Search; label: string }[] = [
  { screen: 'home', icon: Home, label: 'Home' },
  { screen: 'post-request', icon: PlusSquare, label: 'Post' },
  { screen: 'inbox', icon: MessageCircle, label: 'Inbox' },
  { screen: 'profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const { currentScreen, navigateTo, totalUnreadCount } = useApp()

  if (['splash', 'otp', 'profile-setup', 'chat'].includes(currentScreen)) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-[480px] mx-auto">
        {navItems.map(({ screen, icon: Icon, label }) => {
          const isActive = currentScreen === screen ||
            (screen === 'home' && currentScreen === 'seller-profile')

          return (
            <button
              key={screen}
              onClick={() => navigateTo(screen)}
              className={`
                relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300
                ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {isActive && (
                <span className="absolute inset-0 bg-primary/10 rounded-2xl" />
              )}

              <div className="relative z-10">
                <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {screen === 'inbox' && totalUnreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full ring-2 ring-background">
                    {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}