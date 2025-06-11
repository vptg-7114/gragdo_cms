import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AnalyticsClient } from "@/components/analytics/analytics-client"
import { getAnalyticsData } from "@/lib/actions/analytics"

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-[34px]">
          <AnalyticsClient initialData={analyticsData} />
        </div>
      </main>
    </div>
  )
}