import { redirect } from 'next/navigation'
import { getUserProfile } from "@/lib/actions/profile"
import { getRedirectPathForRole } from "@/lib/actions/auth"

export default async function Home() {
  try {
    // Get user profile to check role
    // We're passing undefined here to explicitly show we want the default behavior
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
    // Re-throw NEXT_REDIRECT errors to allow Next.js to handle redirects properly
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    
    console.error('Error in home page:', error)
    redirect('/login')
  }
}