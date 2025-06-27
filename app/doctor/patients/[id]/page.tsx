import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PatientDetailsClient } from "@/components/doctor/patients/patient-details-client"
import { getPatientById } from "@/lib/actions/patients"

interface PatientDetailsPageProps {
  params: {
    id: string
  }
}

export default async function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  const patient = await getPatientById(params.id)
  
  if (!patient) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading patient details...</p>
            </div>
          }>
            <PatientDetailsClient patient={patient} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}