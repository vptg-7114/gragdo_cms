import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DoctorProfileClient } from "@/components/doctors/doctor-profile-client"
import { getDoctorById } from "@/lib/actions/doctors"
import { notFound } from "next/navigation"

interface DoctorProfilePageProps {
  params: {
    id: string
  }
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const doctor = await getDoctorById(params.id)

  if (!doctor) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="USER" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <DoctorProfileClient doctor={doctor} />
        </div>
      </main>
    </div>
  )
}