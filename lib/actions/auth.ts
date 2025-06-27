"use server"

import { readData } from "@/lib/db"
import { UserRole } from "@/lib/types"

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
    const users = await readData("users", [])
    const user = users.find(
      (u) => u.email === credentials.email && u.role === credentials.role
    )

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    // In a real app, you would verify the password here
    // For demo purposes, we'll just return success

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId
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

export async function getRedirectPathForRole(role: UserRole, clinicId?: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/clinics"
    case "ADMIN":
      return clinicId ? `/${clinicId}/admin/dashboard` : "/admin/dashboard"
    case "STAFF":
      return "/staff/dashboard"
    case "DOCTOR":
      return "/doctor/dashboard"
    default:
      return "/"
  }
}