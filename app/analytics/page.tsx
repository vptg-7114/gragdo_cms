import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AnalyticsClient } from "@/components/analytics/analytics-client"
import { getAnalyticsData } from "@/lib/actions/analytics"

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <AnalyticsClient initialData={analyticsData} />
        </div>
      </main>
    </div>
  )
}