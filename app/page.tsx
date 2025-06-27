import { redirect } from 'next/navigation'
import { getUserProfile } from "@/lib/actions/profile"
import { getRedirectPathForRole } from "@/lib/actions/auth"

export default async function Home() {
  try {
    // Get user profile to check role
    const userProfile = await getUserProfile()
    
    if (!userProfile) {
      redirect('/login')
    }
    
    // Redirect based on user role
    const redirectPath = await getRedirectPathForRole(
      userProfile.role, 
      userProfile.clinic?.id,
      userProfile.id
    )
    redirect(redirectPath)
  } catch (error) {
    console.error('Error in home page:', error)
    redirect('/login')
  }
}