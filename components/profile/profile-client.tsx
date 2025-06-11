"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Building2
} from "lucide-react"
import { updateUserProfile } from "@/lib/actions/profile"
import { formatDate } from "@/lib/utils"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  address?: string
  bio?: string
  profileImage?: string
  clinic?: {
    name: string
    address: string
  }
  createdAt: Date
}

interface ProfileClientProps {
  initialProfile: UserProfile
}

export function ProfileClient({ initialProfile }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(initialProfile.profileImage)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialProfile.name,
      email: initialProfile.email,
      phone: initialProfile.phone || "",
      address: initialProfile.address || "",
      bio: initialProfile.bio || "",
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const result = await updateUserProfile(initialProfile.id, {
        ...data,
        profileImage
      })
      
      if (result.success) {
        setIsEditing(false)
        // You could add a toast notification here
      } else {
        console.error('Failed to update profile:', result.error)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setProfileImage(initialProfile.profileImage)
    setIsEditing(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-700'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700'
      case 'USER':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin'
      case 'ADMIN':
        return 'Admin'
      case 'USER':
        return 'User'
      default:
        return role
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Profile Settings
        </h1>
        
        {!isEditing ? (
          <Button 
            variant="digigo" 
            size="digigo" 
            className="w-full sm:w-auto"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="digigo"
              size="digigo"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || !isDirty}
              className="flex-1 sm:flex-none"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1 rounded-[20px] border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-2xl">
                <AvatarImage 
                  src={profileImage || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2"} 
                  alt={initialProfile.name}
                />
                <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-xl rounded-2xl">
                  {initialProfile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#7165e1] text-white p-2 rounded-full cursor-pointer hover:bg-[#5f52d1] transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-xl md:text-2xl font-sf-pro font-bold text-[#7165e1] mb-2">
              {initialProfile.name}
            </h2>
            
            <Badge className={`rounded-full text-sm mb-4 ${getRoleColor(initialProfile.role)}`}>
              {getRoleLabel(initialProfile.role)}
            </Badge>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{initialProfile.email}</span>
              </div>
              
              {initialProfile.phone && (
                <div className="flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{initialProfile.phone}</span>
                </div>
              )}
              
              {initialProfile.clinic && (
                <div className="flex items-center justify-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>{initialProfile.clinic.name}</span>
                </div>
              )}
              
              <div className="flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Joined {formatDate(initialProfile.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="lg:col-span-2 rounded-[20px] border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-sf-pro font-semibold text-[#7165e1]">
              {isEditing ? "Edit Profile Information" : "Profile Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="h-12"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="h-12"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="h-12"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      className="h-12"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    className="min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      <p className="text-base font-sf-pro text-black mt-1">{initialProfile.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                      <p className="text-base font-sf-pro text-black mt-1">{initialProfile.email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <p className="text-base font-sf-pro text-black mt-1">
                        {initialProfile.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Role</Label>
                      <p className="text-base font-sf-pro text-black mt-1">
                        {getRoleLabel(initialProfile.role)}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Address</Label>
                      <p className="text-base font-sf-pro text-black mt-1">
                        {initialProfile.address || "Not provided"}
                      </p>
                    </div>
                    
                    {initialProfile.clinic && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Clinic</Label>
                        <p className="text-base font-sf-pro text-black mt-1">
                          {initialProfile.clinic.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {initialProfile.clinic.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {initialProfile.bio && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bio</Label>
                    <p className="text-base font-sf-pro text-black mt-1 leading-relaxed">
                      {initialProfile.bio}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}