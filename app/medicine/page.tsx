import { Suspense } from "react"
import { MedicineClient } from "@/components/admin/medicine/medicine-client"
import { getMedicines } from "@/lib/actions/medicines"
import { PageLayout } from "@/components/shared/page-layout"

export default async function MedicinePage() {
  const medicines = await getMedicines()

  return (
    <PageLayout userRole="USER" title="Medicine Management">
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 font-sf-pro">Loading medicines...</p>
        </div>
      }>
        <MedicineClient initialMedicines={medicines} />
      </Suspense>
    </PageLayout>
  )
}