import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { TreatmentClient } from "@/components/admin/treatment/treatment-client"
import { getTreatments } from "@/lib/actions/treatments"

export default async function AdminTreatmentPage() {
  const treatments = await getTreatments()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading treatments...</p>
            </div>
          }>
            <TreatmentClient initialTreatments={treatments} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}