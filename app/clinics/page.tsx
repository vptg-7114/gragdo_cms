import { Suspense } from "react"
import { ClinicsClient } from "@/components/clinics/clinics-client"
import { getClinics } from "@/lib/actions/clinics"
import { getUserProfile } from "@/lib/actions/profile"
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

export default async function ClinicsPage() {
  // In a real app, we would get the user ID from the authentication token
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  
  // If no token, redirect to login
  if (!token) {
    redirect('/login')
  }
  
  // Verify and decode the token to get the user ID
  // const userId = verifyAndDecodeToken(token)
  // For now, we'll use a simulated userId or let getUserProfile handle it
  
  // Get the current user profile
  const userProfile = await getUserProfile()
  
  // If no user is logged in or user is not a super admin, redirect to login
  if (!userProfile || userProfile.role !== 'SUPER_ADMIN') {
    redirect('/login')
  }
  
  // Get all clinics
  const clinics = await getClinics()
  
  // Filter clinics based on user's clinicIds if they exist
  const filteredClinics = userProfile.clinicIds 
    ? clinics.filter(clinic => userProfile.clinicIds?.includes(clinic.id))
    : clinics

  return (
    <div className="min-h-screen bg-[#f4f3ff] p-4 md:p-6 lg:p-[34px]">
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 font-sf-pro">Loading clinics...</p>
        </div>
      }>
        <ClinicsClient 
          initialClinics={filteredClinics} 
          userRole={userProfile.role}
        />
      </Suspense>
    </div>
  )
}