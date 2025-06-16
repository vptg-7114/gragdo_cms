import { Suspense } from "react"
import { redirect } from "next/navigation"
import { ClinicsClient } from "@/components/clinics/clinics-client"
import { getUserProfile } from "@/lib/actions/profile"
import { getClinics } from "@/lib/actions/clinics"

export default async function ClinicsPage() {
  // Get user profile to check role
  const userProfile = await getUserProfile()
  
  // If user is not an admin or super admin, redirect to dashboard
  if (userProfile.role !== 'ADMIN' && userProfile.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }
  
  // Get clinics data
  const clinics = await getClinics()

  return (
    <div className="min-h-screen bg-[#f4f3ff] p-4 md:p-6 lg:p-[34px]">
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 font-sf-pro">Loading clinics...</p>
        </div>
      }>
        <ClinicsClient initialClinics={clinics} userRole={userProfile.role} />
      </Suspense>
    </div>
  )
}