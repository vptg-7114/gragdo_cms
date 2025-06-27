import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AppointmentsClient } from "@/components/appointments/appointments-client"
import { getAppointments } from "@/lib/actions/appointments"
import { getPatients } from "@/lib/actions/patients"
import { getDoctors } from "@/lib/actions/doctors"

export default async function DoctorAppointmentsPage() {
  const [appointments, patients, doctors] = await Promise.all([
    getAppointments(),
    getPatients(),
    getDoctors()
  ])

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading appointments...</p>
            </div>
          }>
            <AppointmentsClient 
              initialAppointments={appointments}
              patients={patients}
              doctors={doctors}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}