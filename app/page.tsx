import { redirect } from 'next/navigation'
import { getUserProfile } from "@/lib/actions/profile"
import { getRedirectPathForRole } from "@/lib/actions/auth"
import { cookies } from 'next/headers'

export default async function Home() {
  try {
    // In a real app, we would get the user ID from the authentication token
    // For now, we'll simulate this by assuming we have the user ID
    
    // This would be the proper implementation:
    // 1. Get the auth token from cookies
    // const cookieStore = cookies()
    // const token = cookieStore.get('auth-token')?.value
    // 2. Verify and decode the token to get the user ID
    // const userId = verifyAndDecodeToken(token)
    
    // Get user profile with the user ID from the token
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