import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PrescriptionsClient } from "@/components/prescriptions/prescriptions-client"
import { getPrescriptions } from "@/lib/actions/prescriptions"

export default async function DoctorPrescriptionsPage() {
  const prescriptions = await getPrescriptions()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <PrescriptionsClient initialPrescriptions={prescriptions} />
        </div>
      </main>
    </div>
  )
}