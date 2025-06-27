import { PageLayout } from "@/components/shared/page-layout"
import { RoomsClient } from "@/components/rooms/rooms-client"

export default function RoomsPage() {
  return (
    <PageLayout userRole="USER" title="Rooms Management">
      <RoomsClient />
    </PageLayout>
  )
}