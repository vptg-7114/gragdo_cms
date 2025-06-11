import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AppointmentTable } from "@/components/appointments/appointment-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter } from "lucide-react"
import { getDashboardStats, getRecentAppointments } from "@/lib/actions/dashboard"

export default async function DashboardPage() {
  const [stats, appointments] = await Promise.all([
    getDashboardStats(),
    getRecentAppointments()
  ])

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="USER" />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-[34px]">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Time Filter and Add Patient */}
          <div className="flex justify-between mt-[30px]">
            <Tabs defaultValue="today" className="w-[561px]">
              <TabsList className="w-full h-[54px] p-0 bg-white rounded-2xl">
                <TabsTrigger
                  value="today"
                  className="w-[187px] h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="yesterday"
                  className="w-[187px] h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Yesterday
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="w-[187px] h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  This Month
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-4">
              <div className="w-[54px] h-[54px] bg-white rounded-[10.8px] flex items-center justify-center">
                <Filter className="w-[23px] h-[26px] text-[#7165e1]" />
              </div>
              <Button variant="digigo" size="digigo" className="w-[200px]">
                <Plus className="mr-2 h-6 w-6" />
                Add Patient
              </Button>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="mt-[50px]">
            <AppointmentTable appointments={appointments} />
          </div>
        </div>
      </main>
    </div>
  )
}