'use client'

import { useApp } from '@/lib/app-context'
import { SplashScreen } from '@/components/screens/splash-screen'
import { OtpScreen } from '@/components/screens/otp-screen'
import { ProfileSetupScreen } from '@/components/screens/profile-setup-screen'
import { HomeScreen } from '@/components/screens/home-screen'
import { SellerProfileScreen } from '@/components/screens/seller-profile-screen'
import { PostRequestScreen } from '@/components/screens/post-request-screen'
import { InboxScreen } from '@/components/screens/inbox-screen'
import { ChatScreen } from '@/components/screens/chat-screen'
import { ProfileScreen } from '@/components/screens/profile-screen'
import { BottomNav } from '@/components/bottom-nav'

function ScreenRenderer() {
  const { currentScreen } = useApp()

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />
    case 'otp':
      return <OtpScreen />
    case 'profile-setup':
      return <ProfileSetupScreen />
    case 'home':
      return <HomeScreen />
    case 'seller-profile':
      return <SellerProfileScreen />
    case 'post-request':
      return <PostRequestScreen />
    case 'inbox':
      return <InboxScreen />
    case 'chat':
      return <ChatScreen />
    case 'profile':
      return <ProfileScreen />
    default:
      return <SplashScreen />
  }
}

export function CampusDeskApp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile container */}
      <div className="mx-auto max-w-[480px] min-h-screen bg-background shadow-2xl shadow-black/20 relative overflow-y-auto">
        <ScreenRenderer />
        <BottomNav />
      </div>
    </div>
  )
}