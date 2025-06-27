import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DoctorScheduleClient } from "@/components/doctor/schedule/doctor-schedule-client"
import { getAppointments } from "@/lib/actions/appointments"
import { getPatients } from "@/lib/actions/patients"

export default async function DoctorSchedulePage() {
  const [appointments, patients] = await Promise.all([
    getAppointments(),
    getPatients()
  ])

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading schedule...</p>
            </div>
          }>
            <DoctorScheduleClient 
              initialAppointments={appointments}
              patients={patients}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}