import { AppProvider } from '@/lib/app-context'
import { CampusDeskApp } from '@/components/campus-desk-app'

export default function Home() {
  return (
    <AppProvider>
      <CampusDeskApp />
    </AppProvider>
  )
}
