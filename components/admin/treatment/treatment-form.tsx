"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const treatmentSchema = z.object({
  treatmentName: z.string().min(1, "Treatment name is required"),
  treatmentInChargeName: z.string().min(1, "Treatment in-charge name is required"),
  treatmentCost: z.string().min(1, "Treatment cost is required"),
})

type TreatmentFormData = z.infer<typeof treatmentSchema>

interface TreatmentFormProps {
  onSubmit: (data: TreatmentFormData) => void
  onCancel: () => void
  initialData?: Partial<TreatmentFormData>
}

export function TreatmentForm({
  onSubmit,
  onCancel,
  initialData,
}: TreatmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: initialData,
  })

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Treatments</span>
          <span className="text-[#7165e1]">></span>
          <span className="text-[#7165e1]">Add Treatment</span>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          Add Treatment
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Treatment Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="treatmentName" className="text-sm font-medium text-black">
                Treatment Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="treatmentName"
                placeholder="Enter Treatment Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("treatmentName")}
              />
              {errors.treatmentName && (
                <p className="text-xs text-red-500">{errors.treatmentName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentInChargeName" className="text-sm font-medium text-black">
                Treatment In-charge Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="treatmentInChargeName"
                placeholder="Enter Treatment In-charge Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("treatmentInChargeName")}
              />
              {errors.treatmentInChargeName && (
                <p className="text-xs text-red-500">{errors.treatmentInChargeName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentCost" className="text-sm font-medium text-black">
                Treatment Cost<span className="text-red-500">*</span>
              </Label>
              <Input
                id="treatmentCost"
                placeholder="Enter Cost"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("treatmentCost")}
              />
              {errors.treatmentCost && (
                <p className="text-xs text-red-500">{errors.treatmentCost.message}</p>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}