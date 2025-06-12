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
import { Plus, Trash2 } from "lucide-react"

const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    rate: z.number().min(0, "Rate must be positive"),
  })).min(1, "At least one item is required"),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void
  onCancel: () => void
  initialData?: Partial<InvoiceFormData>
}

export function InvoiceForm({
  onSubmit,
  onCancel,
  initialData,
}: InvoiceFormProps) {
  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0 }
  ])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      ...initialData,
      items: items
    },
  })

  // Mock data for patients
  const mockPatients = [
    { id: '1', name: 'K. Vijay', patientId: '123456' },
    { id: '2', name: 'P. Sandeep', patientId: '454575' },
    { id: '3', name: 'Ch. Asritha', patientId: '787764' },
  ]

  const addItem = () => {
    const newItems = [...items, { description: "", quantity: 1, rate: 0 }]
    setItems(newItems)
    setValue("items", newItems)
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    setValue("items", newItems)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
    setValue("items", newItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.rate), 0)
  }

  const handleFormSubmit = (data: InvoiceFormData) => {
    onSubmit({ ...data, items })
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          Create Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Row 1: Patient, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-sm font-medium text-black">
                Patient<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("patientId", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.patientId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientId && (
                <p className="text-xs text-red-500">{errors.patientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-black">
                Due Date<span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("dueDate")}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-black">
                Invoice Items<span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="md:col-span-5">
                    <Label className="text-xs text-gray-600">Description</Label>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="h-10 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-gray-600">Quantity</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="h-10 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-gray-600">Rate</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="h-10 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-gray-600">Amount</Label>
                    <Input
                      value={`₹${(item.quantity * item.rate).toFixed(2)}`}
                      disabled
                      className="h-10 mt-1 bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-10 w-10 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="w-64 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-[#7165e1]">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {errors.items && (
              <p className="text-xs text-red-500">{errors.items.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-black">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or terms..."
              className="min-h-[100px] rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
              {...register("notes")}
            />
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
              {isSubmitting ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}