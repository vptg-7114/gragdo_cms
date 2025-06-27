import { PageLayout } from "@/components/shared/page-layout"
import { RoomsClient } from "@/components/rooms/rooms-client"

export default function RoomsPage() {
  return (
    <PageLayout userRole="STAFF" title="Rooms Management">
      <RoomsClient />
    </PageLayout>
  )
}