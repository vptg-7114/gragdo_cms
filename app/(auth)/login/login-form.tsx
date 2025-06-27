"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { login } from "@/lib/actions/auth"
import { UserRole } from "@/lib/types"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole | "">("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !role) {
      setError("Please fill in all fields")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await login({
        email,
        password,
        role: role as UserRole
      })
      
      if (result.success) {
        // Redirect based on role
        switch (role) {
          case "SUPER_ADMIN":
            router.push("/clinics")
            break
          case "ADMIN":
            router.push("/admin/dashboard")
            break
          case "STAFF":
            router.push("/staff/dashboard")
            break
          case "DOCTOR":
            router.push("/doctor/dashboard")
            break
          default:
            router.push("/")
        }
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          className="h-12 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <SelectTrigger className="h-12 rounded-lg">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="DOCTOR">Doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          className="h-12 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#7165e1] hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]"
        disabled={isLoading}
      >
        {isLoading ? "LOGGING IN..." : "LOGIN"}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-[#7165e1] hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}