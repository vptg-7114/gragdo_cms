import { redirect } from 'next/navigation'
import { getUserProfile } from "@/lib/actions/profile"
import { getRedirectPathForRole } from "@/lib/actions/auth"

export default async function Home() {
  // Redirect to login page if not authenticated
  // In a real app, you would check the session/auth state
  redirect('/login')
  
  // The code below would be used in a real app with authentication
  // to redirect users based on their role
  /*
  try {
    // Get user profile to check role
    const userProfile = await getUserProfile()
    
    if (!userProfile) {
      redirect('/login')
    }
    
    // Redirect based on user role
    const redirectPath = await getRedirectPathForRole(userProfile.role, userProfile.clinic?.id)
    redirect(redirectPath)
  } catch (error) {
    console.error('Error in home page:', error)
    redirect('/login')
  }
  */
}