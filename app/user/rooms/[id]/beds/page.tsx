import { Suspense } from "react"
import { BedsClient } from "@/components/rooms/beds/beds-client"
import { getBedsByRoom } from "@/lib/actions/beds"
import { notFound } from "next/navigation"
import { PageLayout } from "@/components/shared/page-layout"

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
    <PageLayout userRole="USER">
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 font-sf-pro">Loading beds...</p>
        </div>
      }>
        <BedsClient roomId={params.id} initialBeds={beds} />
      </Suspense>
    </PageLayout>
  )
}