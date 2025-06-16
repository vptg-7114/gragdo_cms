import { redirect } from 'next/navigation'
import { getUserProfile } from "@/lib/actions/profile"

export default async function Home() {
  // Get user profile to check role
  const userProfile = await getUserProfile()
  
  // Redirect based on user role
  if (userProfile.role === 'ADMIN' || userProfile.role === 'SUPER_ADMIN') {
    redirect('/clinics')
  } else {
    redirect('/dashboard')
  }
}