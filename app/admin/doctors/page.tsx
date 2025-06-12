import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AdminDoctorsClient } from "@/components/admin/doctors/admin-doctors-client"
import { getDoctors } from "@/lib/actions/doctors"

export default async function AdminDoctorsPage() {
  const doctors = await getDoctors()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading doctors...</p>
            </div>
          }>
            <AdminDoctorsClient initialDoctors={doctors} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}