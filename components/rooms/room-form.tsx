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

const roomSchema = z.object({
  roomNo: z.string().min(1, "Room number is required"),
  roomType: z.string().min(1, "Room type is required"),
  totalBeds: z.string().min(1, "Total beds is required"),
  availableBeds: z.string().min(1, "Available beds is required"),
  occupiedBeds: z.string().min(1, "Occupied beds is required"),
  reservedBeds: z.string().min(1, "Reserved beds is required"),
})

type RoomFormData = z.infer<typeof roomSchema>

interface Room {
  id: string
  roomNo: string
  roomType: string
  totalBeds: number
  availableBeds: number
  occupiedBeds: number
  reservedBeds: number
}

interface RoomFormProps {
  initialData?: Room
  onSubmit: (data: RoomFormData) => void
  onCancel: () => void
}

export function RoomForm({
  initialData,
  onSubmit,
  onCancel,
}: RoomFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData
      ? {
          roomNo: initialData.roomNo,
          roomType: initialData.roomType,
          totalBeds: initialData.totalBeds.toString(),
          availableBeds: initialData.availableBeds.toString(),
          occupiedBeds: initialData.occupiedBeds.toString(),
          reservedBeds: initialData.reservedBeds.toString(),
        }
      : undefined,
  })

  const isEditing = !!initialData

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          {isEditing ? "Edit Room Details" : "Add Room"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Room Number, Total Beds, Room Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomNo" className="text-sm font-medium text-black">
                Room Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="roomNo"
                placeholder="Enter Room Number"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("roomNo")}
              />
              {errors.roomNo && (
                <p className="text-xs text-red-500">{errors.roomNo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBeds" className="text-sm font-medium text-black">
                Total Beds<span className="text-red-500">*</span>
              </Label>
              <Input
                id="totalBeds"
                placeholder="Enter Total Beds"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("totalBeds")}
              />
              {errors.totalBeds && (
                <p className="text-xs text-red-500">{errors.totalBeds.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType" className="text-sm font-medium text-black">
                Room Type<span className="text-red-500">*</span>
              </Label>
              <Select 
                onValueChange={(value) => setValue("roomType", value)}
                defaultValue={initialData?.roomType}
              >
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delux">Delux</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                  <SelectItem value="Ward">Ward</SelectItem>
                </SelectContent>
              </Select>
              {errors.roomType && (
                <p className="text-xs text-red-500">{errors.roomType.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Available Beds, Occupied Beds, Reserved Beds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableBeds" className="text-sm font-medium text-black">
                Available Beds<span className="text-red-500">*</span>
              </Label>
              <Input
                id="availableBeds"
                placeholder="Enter Number of Available Beds"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("availableBeds")}
              />
              {errors.availableBeds && (
                <p className="text-xs text-red-500">{errors.availableBeds.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupiedBeds" className="text-sm font-medium text-black">
                Occupied Beds<span className="text-red-500">*</span>
              </Label>
              <Input
                id="occupiedBeds"
                placeholder="Enter Number of Occupied Beds"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("occupiedBeds")}
              />
              {errors.occupiedBeds && (
                <p className="text-xs text-red-500">{errors.occupiedBeds.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservedBeds" className="text-sm font-medium text-black">
                Reserved Beds<span className="text-red-500">*</span>
              </Label>
              <Input
                id="reservedBeds"
                placeholder="Enter Number of Reserved beds"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("reservedBeds")}
              />
              {errors.reservedBeds && (
                <p className="text-xs text-red-500">{errors.reservedBeds.message}</p>
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
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Room"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}