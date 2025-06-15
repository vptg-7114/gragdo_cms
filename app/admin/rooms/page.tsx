import { PageLayout } from "@/components/shared/page-layout"
import { RoomsClient } from "@/components/rooms/rooms-client"

export default function AdminRoomsPage() {
  return (
    <PageLayout userRole="ADMIN" title="Rooms Management">
      <RoomsClient />
    </PageLayout>
  )
}