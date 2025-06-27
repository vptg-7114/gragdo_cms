import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StaffSettingsClient } from "@/components/staff/settings/staff-settings-client"
import { getUserProfile } from "@/lib/actions/profile"

export default async function StaffSettingsPage() {
  const userProfile = await getUserProfile()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading settings...</p>
            </div>
          }>
            <StaffSettingsClient initialProfile={userProfile} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}