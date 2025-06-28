'use server'

import { cookies } from 'next/headers'
import { UserRole } from "@/lib/types"
import { authApi } from '@/lib/services/api'

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
    const response = await authApi.login(credentials.email, credentials.password, credentials.role)
    
    if (response.success) {
      // Set the auth token in a cookie
      cookies().set('auth-token', response.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })
      
      return {
        success: true,
        user: response.user
      }
    } else {
      return { success: false, error: response.error || "Invalid credentials" }
    }
  } catch (error) {
    console.error("Error during login:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function signup(data: SignupData) {
  try {
    const response = await authApi.signup(data)
    
    if (response.success) {
      // Set the auth token in a cookie
      cookies().set('auth-token', response.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })
      
      return {
        success: true,
        user: response.user
      }
    } else {
      return { success: false, error: response.error || "Signup failed" }
    }
  } catch (error) {
    console.error("Error during signup:", error)
    return { success: false, error: "An error occurred during signup" }
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await authApi.forgotPassword(email)
    
    return { 
      success: response.success, 
      message: response.message,
      error: response.error 
    }
  } catch (error) {
    console.error("Error during password reset:", error)
    return { success: false, error: "An error occurred during password reset" }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await authApi.resetPassword(token, newPassword)
    
    return { 
      success: response.success, 
      message: response.message,
      error: response.error 
    }
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
  try {
    await authApi.logout()
    
    // Clear the auth cookie
    cookies().delete('auth-token')
    
    return { success: true }
  } catch (error) {
    console.error("Error during logout:", error)
    return { success: false, error: "An error occurred during logout" }
  }
}

export async function getCurrentUser(token?: string) {
  try {
    const response = await authApi.getCurrentUser()
    
    if (response.success) {
      return response.user
    }
    
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}