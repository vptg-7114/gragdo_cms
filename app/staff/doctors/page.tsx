import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DoctorsClient } from "@/components/doctors/doctors-client"
import { getDoctors } from "@/lib/actions/doctors"

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <DoctorsClient initialDoctors={doctors} />
        </div>
      </main>
    </div>
  )
}