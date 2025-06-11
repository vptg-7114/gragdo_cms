"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Upload } from "lucide-react"

const appointmentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  createId: z.string().min(1, "Create ID is required"),
  emailId: z.string().email("Invalid email address").optional().or(z.literal("")),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  selectTime: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  problem: z.string().min(1, "Problem is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  patients: Array<{ id: string; name: string; patientId: string }>
  doctors: Array<{ id: string; name: string; specialization: string }>
  onSubmit: (data: AppointmentFormData) => void
  onCancel: () => void
  initialData?: Partial<AppointmentFormData>
}

export function AppointmentForm({
  patients,
  doctors,
  onSubmit,
  onCancel,
  initialData,
}: AppointmentFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData,
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          Add Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: First Name, Last Name, Age, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-black">
                First Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter First Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-black">
                Last Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter Last Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-black">
                Age<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("age", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.age && (
                <p className="text-xs text-red-500">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-black">
                Gender<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="MALE"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Male</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="FEMALE"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Female</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="OTHER"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Other</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Create ID, Email ID, Mobile Number, Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="createId" className="text-sm font-medium text-black">
                Create ID<span className="text-red-500">*</span>
              </Label>
              <Input
                id="createId"
                placeholder="Create Unique ID"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("createId")}
              />
              {errors.createId && (
                <p className="text-xs text-red-500">{errors.createId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailId" className="text-sm font-medium text-black">
                Email ID
              </Label>
              <Input
                id="emailId"
                type="email"
                placeholder="Enter Email ID"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("emailId")}
              />
              {errors.emailId && (
                <p className="text-xs text-red-500">{errors.emailId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-sm font-medium text-black">
                Mobile Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobileNumber"
                placeholder="Enter Mobile Number"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("mobileNumber")}
              />
              {errors.mobileNumber && (
                <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorId" className="text-sm font-medium text-black">
                Doctor<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("doctorId", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorId && (
                <p className="text-xs text-red-500">{errors.doctorId.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Appointment Date, Select Time, Duration, Problem */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate" className="text-sm font-medium text-black">
                Appointment Date<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="appointmentDate"
                  type="date"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1] pl-4"
                  {...register("appointmentDate")}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.appointmentDate && (
                <p className="text-xs text-red-500">{errors.appointmentDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="selectTime" className="text-sm font-medium text-black">
                Select time<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="selectTime"
                  type="time"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1] pl-4"
                  {...register("selectTime")}
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.selectTime && (
                <p className="text-xs text-red-500">{errors.selectTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-black">
                Duration<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("duration", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-xs text-red-500">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem" className="text-sm font-medium text-black">
                Problem<span className="text-red-500">*</span>
              </Label>
              <Input
                id="problem"
                placeholder="Enter Problem"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("problem")}
              />
              {errors.problem && (
                <p className="text-xs text-red-500">{errors.problem.message}</p>
              )}
            </div>
          </div>

          {/* Row 4: Address, City, State, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-black">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Enter Address"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("address")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-black">
                City
              </Label>
              <Input
                id="city"
                placeholder="Enter City"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("city")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-black">
                State
              </Label>
              <Select onValueChange={(value) => setValue("state", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                  <SelectItem value="odisha">Odisha</SelectItem>
                  <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                  <SelectItem value="jharkhand">Jharkhand</SelectItem>
                  <SelectItem value="assam">Assam</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                  <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="goa">Goa</SelectItem>
                  <SelectItem value="manipur">Manipur</SelectItem>
                  <SelectItem value="meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="tripura">Tripura</SelectItem>
                  <SelectItem value="nagaland">Nagaland</SelectItem>
                  <SelectItem value="mizoram">Mizoram</SelectItem>
                  <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                  <SelectItem value="sikkim">Sikkim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium text-black">
                Postal code
              </Label>
              <Input
                id="postalCode"
                placeholder="Enter Postal Code"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("postalCode")}
              />
            </div>
          </div>

          {/* Upload Reports Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-black">
              Upload Reports
            </Label>
            
            <div className="border-2 border-dashed border-[#7165e1] rounded-lg p-8 text-center bg-[#f8f7ff]">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-[#7165e1] mx-auto mb-2" />
                <p className="text-[#7165e1] font-medium">
                  Click here to upload file
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX
                </p>
              </label>
            </div>

            {/* Display uploaded files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-black">Uploaded Files:</p>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white font-medium"
            >
              {isSubmitting ? "Creating..." : "Create Appointment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}