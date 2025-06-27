import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProfileClient } from "@/components/profile/profile-client"
import { getUserProfile } from "@/lib/actions/profile"

export default async function ProfilePage() {
  const userProfile = await getUserProfile()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="USER" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <ProfileClient initialProfile={userProfile} />
        </div>
      </main>
    </div>
  )
}