import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { BedsClient } from "@/components/rooms/beds/beds-client"
import { getBedsByRoom } from "@/lib/actions/beds"
import { notFound } from "next/navigation"

interface BedsPageProps {
  params: {
    id: string
  }
}

export default async function BedsPage({ params }: BedsPageProps) {
  const beds = await getBedsByRoom(params.id)

  if (!beds) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="USER" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading beds...</p>
            </div>
          }>
            <BedsClient roomId={params.id} initialBeds={beds} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}