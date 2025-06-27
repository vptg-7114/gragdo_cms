import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AppointmentTable } from "@/components/appointments/appointment-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter } from "lucide-react"
import { getDashboardStats, getRecentAppointments } from "@/lib/actions/dashboard"

export default async function DoctorDashboardPage() {
  const [stats, appointments] = await Promise.all([
    getDashboardStats(),
    getRecentAppointments()
  ])

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Stats Cards */}
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-[16px]" />
              ))}
            </div>
          }>
            <StatsCards stats={stats} />
          </Suspense>

          {/* Time Filter and Add Patient */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mt-6 lg:mt-[30px]">
            <Tabs defaultValue="today" className="w-full lg:w-[561px]">
              <TabsList className="w-full h-[50px] md:h-[54px] p-0 bg-white rounded-2xl grid grid-cols-3">
                <TabsTrigger
                  value="today"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="yesterday"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Yesterday
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  This Month
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-[50px] md:w-[54px] h-[50px] md:h-[54px] bg-white rounded-[10.8px] flex items-center justify-center">
                <Filter className="w-[20px] h-[23px] md:w-[23px] md:h-[26px] text-[#7165e1]" />
              </div>
              <Button variant="digigo" size="digigo" className="w-full sm:w-[180px] md:w-[200px] h-[50px] md:h-[54px] text-sm md:text-base">
                <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                Add Patient
              </Button>
            </div>
          </div>

          {/* Appointments Table - Full Width */}
          <div className="mt-8 lg:mt-[50px]">
            <Suspense fallback={
              <div className="bg-white rounded-[20px] shadow-sm p-6">
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
              </div>
            }>
              <AppointmentTable appointments={appointments} />
            </Suspense>
          </div>

          {/* Calendar Section */}
          <div className="mt-8 lg:mt-[50px]">
            <div className="bg-white rounded-[20px] shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
                  Calendar
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Button variant="outline" className="rounded-l-lg rounded-r-none border-r-0">
                      May
                    </Button>
                    <Button variant="outline" className="rounded-l-none rounded-r-lg">
                      2023
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Days of Week */}
                <div className="text-center p-2 text-gray-500 font-medium">Mo</div>
                <div className="text-center p-2 text-gray-500 font-medium">Tu</div>
                <div className="text-center p-2 text-gray-500 font-medium">We</div>
                <div className="text-center p-2 text-gray-500 font-medium">Th</div>
                <div className="text-center p-2 text-gray-500 font-medium">Fr</div>
                <div className="text-center p-2 text-gray-500 font-medium">Sa</div>
                <div className="text-center p-2 text-gray-500 font-medium">Su</div>
                
                {/* Calendar Days */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 18;
                  return (
                    <div 
                      key={day} 
                      className={`text-center p-2 rounded-lg ${
                        isToday 
                          ? 'bg-[#7165e1] text-white' 
                          : 'hover:bg-gray-100 cursor-pointer'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
                
                {/* Empty cells for next month */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={`next-${i}`} 
                    className="text-center p-2 text-gray-300"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Appointments Overview */}
          <div className="mt-8 lg:mt-[50px]">
            <div className="bg-white rounded-[20px] shadow-sm p-6">
              <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold mb-6">
                Appointments Overview
              </h2>
              
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  {/* Pie Chart */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* General Checkup segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#7165e1"
                      strokeWidth="20"
                      strokeDasharray="83.8 251.2"
                      strokeDashoffset="0"
                    />
                    {/* Surgery segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="20"
                      strokeDasharray="120.6 251.2"
                      strokeDashoffset="-83.8"
                    />
                    {/* Diagnosis segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#c4b5fd"
                      strokeWidth="20"
                      strokeDasharray="46.8 251.2"
                      strokeDashoffset="-204.4"
                    />
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-lg font-bold">Total</div>
                    <div className="text-3xl font-bold text-[#7165e1]">2,427</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#7165e1] rounded-full"></div>
                  <div>
                    <div className="text-sm text-gray-500">General Checkup</div>
                    <div className="text-lg font-bold">660</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#a855f7] rounded-full"></div>
                  <div>
                    <div className="text-sm text-gray-500">Surgery</div>
                    <div className="text-lg font-bold">949</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#c4b5fd] rounded-full"></div>
                  <div>
                    <div className="text-sm text-gray-500">Diagnosis</div>
                    <div className="text-lg font-bold">818</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}