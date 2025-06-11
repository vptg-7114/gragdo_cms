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

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  concern: z.string().min(1, "Concern is required"),
  notes: z.string().optional(),
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

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl font-sf-pro font-semibold text-[#7165e1]">
          {initialData ? "Edit Appointment" : "Schedule New Appointment"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-sm md:text-base">Patient</Label>
              <Select onValueChange={(value) => setValue("patientId", value)}>
                <SelectTrigger className="h-10 md:h-12">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientId && (
                <p className="text-xs md:text-sm text-red-500">{errors.patientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorId" className="text-sm md:text-base">Doctor</Label>
              <Select onValueChange={(value) => setValue("doctorId", value)}>
                <SelectTrigger className="h-10 md:h-12">
                  <SelectValue placeholder="Select doctor" />
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
                <p className="text-xs md:text-sm text-red-500">{errors.doctorId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate" className="text-sm md:text-base">Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                className="h-10 md:h-12"
                {...register("appointmentDate")}
              />
              {errors.appointmentDate && (
                <p className="text-xs md:text-sm text-red-500">{errors.appointmentDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime" className="text-sm md:text-base">Time</Label>
              <Input
                id="appointmentTime"
                type="time"
                className="h-10 md:h-12"
                {...register("appointmentTime")}
              />
              {errors.appointmentTime && (
                <p className="text-xs md:text-sm text-red-500">{errors.appointmentTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="concern" className="text-sm md:text-base">Concern</Label>
            <Input
              id="concern"
              placeholder="Enter patient's concern"
              className="h-10 md:h-12"
              {...register("concern")}
            />
            {errors.concern && (
              <p className="text-xs md:text-sm text-red-500">{errors.concern.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm md:text-base">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              className="min-h-[80px] md:min-h-[100px]"
              {...register("notes")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 md:h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="digigo"
              size="digigo"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 md:h-12"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Schedule"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}