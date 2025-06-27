import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PatientsClient } from "@/components/patients/patients-client"
import { getPatients } from "@/lib/actions/patients"

export default async function PatientsPage() {
  const patients = await getPatients()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <PatientsClient initialPatients={patients} />
        </div>
      </main>
    </div>
  )
}