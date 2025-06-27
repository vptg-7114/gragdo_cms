"use server"

import { readData } from "@/lib/db"
import { UserRole, User } from "@/lib/types"
import { cookies } from 'next/headers'

interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  clinicId?: string
  password: string
}

export async function login(credentials: LoginCredentials) {
  try {
    // In a real app, you would validate credentials against a database
    // For demo purposes, we'll just check if the user exists
    const users = await readData<User[]>("users", [])
    const user = users.find(
      (u) => u.email === credentials.email && u.role === credentials.role
    )

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    // In a real app, you would verify the password here
    // For demo purposes, we'll just return success
    
    // Set auth cookie in a real app
    const cookieStore = cookies()
    // Generate a JWT token with user information
    // const token = generateAuthToken(user)
    // cookieStore.set('auth-token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 60 * 60 * 24 * 7, // 1 week
    //   path: '/',
    // })

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
        clinicIds: user.clinicIds
      }
    }
  } catch (error) {
    console.error("Error during login:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function signup(data: SignupData) {
  try {
    // In a real app, you would create a new user in the database
    // For demo purposes, we'll just return success
    
    const fullName = `${data.firstName} ${data.lastName}`.trim()
    
    return {
      success: true,
      user: {
        id: Math.random().toString(36).substring(2, 15),
        name: fullName,
        email: data.email,
        role: data.role,
        clinicId: data.clinicId
      }
    }
  } catch (error) {
    console.error("Error during signup:", error)
    return { success: false, error: "An error occurred during signup" }
  }
}

export async function forgotPassword(email: string) {
  try {
    // In a real app, you would send a password reset email
    // For demo purposes, we'll just return success
    
    return { success: true, message: "Password reset email sent" }
  } catch (error) {
    console.error("Error during password reset:", error)
    return { success: false, error: "An error occurred during password reset" }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // In a real app, you would validate the token and update the user's password
    // For demo purposes, we'll just return success
    
    // Validate token (mock validation)
    if (!token || token.length < 10) {
      return { success: false, error: "Invalid or expired token" }
    }
    
    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }
    
    return { success: true, message: "Password reset successful" }
  } catch (error) {
    console.error("Error during password reset:", error)
    return { success: false, error: "An error occurred during password reset" }
  }
}

export async function getRedirectPathForRole(role: UserRole, clinicId?: string, userId?: string) {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "/clinics"
    case UserRole.ADMIN:
      return clinicId && userId ? `/${clinicId}/admin/${userId}/dashboard` : "/admin/dashboard"
    case UserRole.STAFF:
      return clinicId && userId ? `/${clinicId}/staff/${userId}/dashboard` : "/staff/dashboard"
    case UserRole.DOCTOR:
      return clinicId && userId ? `/${clinicId}/doctor/${userId}/dashboard` : "/doctor/dashboard"
    default:
      return "/"
  }
}

export async function logout() {
  // Clear the auth cookie
  const cookieStore = cookies()
  cookieStore.delete('auth-token')
  
  return { success: true }
}

// This function would verify and decode the JWT token in a real app
function verifyAndDecodeToken(token: string) {
  // In a real app, you would use a library like jsonwebtoken to verify and decode the token
  // For demo purposes, we'll just return a mock user ID
  return 'default-user'
}

// This function would generate a JWT token in a real app
function generateAuthToken(user: User) {
  // In a real app, you would use a library like jsonwebtoken to generate a token
  // For demo purposes, we'll just return a mock token
  return 'mock-token'
}