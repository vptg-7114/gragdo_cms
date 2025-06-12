import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AdminPrescriptionsClient } from "@/components/admin/prescriptions/admin-prescriptions-client"
import { getPrescriptions } from "@/lib/actions/prescriptions"

export default async function AdminPrescriptionsPage() {
  const prescriptions = await getPrescriptions()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading prescriptions...</p>
            </div>
          }>
            <AdminPrescriptionsClient initialPrescriptions={prescriptions} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}