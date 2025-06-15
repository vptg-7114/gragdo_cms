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
import { Calendar } from "lucide-react"

const bedReservationSchema = z.object({
  patientFirstName: z.string().min(1, "First name is required"),
  patientLastName: z.string().min(1, "Last name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  roomType: z.string().min(1, "Room type is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
})

type BedReservationFormData = z.infer<typeof bedReservationSchema>

interface BedReservationFormProps {
  roomId: string
  onSubmit: (data: BedReservationFormData) => void
  onCancel: () => void
}

export function BedReservationForm({
  roomId,
  onSubmit,
  onCancel,
}: BedReservationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BedReservationFormData>({
    resolver: zodResolver(bedReservationSchema),
    defaultValues: {
      patientFirstName: "Ajay Kumar",
      patientLastName: "Kumar",
      age: "35",
      gender: "Male",
      roomType: "",
      roomNumber: "",
      bedNumber: "",
      admissionDate: "",
    },
  })

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span>Patients</span>
          <span className="mx-2">/</span>
          <span>Rooms</span>
          <span className="mx-2">/</span>
          <span>Beds</span>
          <span className="mx-2">/</span>
          <span className="text-[#7165e1]">Reserve Bed</span>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          Reserve Bed
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Patient First Name, Patient Last Name, Age, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientFirstName" className="text-sm font-medium text-black">
                Patient First Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="patientFirstName"
                placeholder="Enter First Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("patientFirstName")}
              />
              {errors.patientFirstName && (
                <p className="text-xs text-red-500">{errors.patientFirstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientLastName" className="text-sm font-medium text-black">
                Patient Last Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="patientLastName"
                placeholder="Enter Last Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("patientLastName")}
              />
              {errors.patientLastName && (
                <p className="text-xs text-red-500">{errors.patientLastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-black">
                Age<span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                placeholder="Enter Age"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("age")}
              />
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
                    value="Male"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                    defaultChecked
                  />
                  <span className="text-sm">Male</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Female"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Female</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Other"
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

          {/* Row 2: Room Type, Room Number, Bed Number, Admission Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomType" className="text-sm font-medium text-black">
                Room Type<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("roomType", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delux">Delux</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="ward">Ward</SelectItem>
                </SelectContent>
              </Select>
              {errors.roomType && (
                <p className="text-xs text-red-500">{errors.roomType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber" className="text-sm font-medium text-black">
                Room Number<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("roomNumber", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Room 1</SelectItem>
                  <SelectItem value="2">Room 2</SelectItem>
                  <SelectItem value="3">Room 3</SelectItem>
                  <SelectItem value="4">Room 4</SelectItem>
                  <SelectItem value="5">Room 5</SelectItem>
                </SelectContent>
              </Select>
              {errors.roomNumber && (
                <p className="text-xs text-red-500">{errors.roomNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedNumber" className="text-sm font-medium text-black">
                Bed Number<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("bedNumber", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bed 1</SelectItem>
                  <SelectItem value="2">Bed 2</SelectItem>
                  <SelectItem value="3">Bed 3</SelectItem>
                  <SelectItem value="4">Bed 4</SelectItem>
                </SelectContent>
              </Select>
              {errors.bedNumber && (
                <p className="text-xs text-red-500">{errors.bedNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionDate" className="text-sm font-medium text-black">
                Admission Date<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="admissionDate"
                  type="date"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1] pl-4"
                  {...register("admissionDate")}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.admissionDate && (
                <p className="text-xs text-red-500">{errors.admissionDate.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6">
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
              {isSubmitting ? "Reserving..." : "Reserve Bed"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}