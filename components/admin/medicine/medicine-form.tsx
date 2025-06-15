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
import { Trash2 } from "lucide-react"

const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  type: z.string().min(1, "Medicine type is required"),
  dosage: z.string().min(1, "Dosage is required"),
  manufacturedDate: z.string().min(1, "Manufactured date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  price: z.string().min(1, "Price is required"),
})

type MedicineFormData = z.infer<typeof medicineSchema>

interface Medicine {
  id: string
  name: string
  manufacturer: string
  batchNumber: string
  type: string
  dosage: string
  manufacturedDate: string
  expiryDate: string
  price: string
}

interface MedicineFormProps {
  initialData?: Medicine
  onSubmit: (data: MedicineFormData) => void
  onCancel: () => void
}

export function MedicineForm({
  initialData,
  onSubmit,
  onCancel,
}: MedicineFormProps) {
  const [medicineRows, setMedicineRows] = useState([
    {
      id: 1,
      name: initialData?.name || "ALERGIN",
      manufacturer: initialData?.manufacturer || "Cipla",
      batchNumber: initialData?.batchNumber || "123456",
      type: initialData?.type || "Capsule",
      dosage: initialData?.dosage || "500mg",
      manufacturedDate: initialData?.manufacturedDate || "30-05-2025",
      expiryDate: initialData?.expiryDate || "06-06-2027",
      price: initialData?.price || "100"
    }
  ])

  const addNewRow = () => {
    setMedicineRows([...medicineRows, {
      id: medicineRows.length + 1,
      name: "",
      manufacturer: "Cipla",
      batchNumber: "",
      type: "Capsule",
      dosage: "",
      manufacturedDate: "",
      expiryDate: "",
      price: ""
    }])
  }

  const removeRow = (id: number) => {
    if (medicineRows.length > 1) {
      setMedicineRows(medicineRows.filter(row => row.id !== id))
    }
  }

  const updateRow = (id: number, field: string, value: string) => {
    setMedicineRows(medicineRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ))
  }

  const handleFormSubmit = () => {
    // Process all rows and submit
    console.log("Submitting medicines:", medicineRows)
    onSubmit(medicineRows[0])
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          Add Medicine
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        {/* Table Header */}
        <div className="grid grid-cols-9 gap-2 bg-[#f4f3ff] p-4 rounded-t-lg mb-2">
          <div className="text-sm font-medium text-gray-700">Medicine name</div>
          <div className="text-sm font-medium text-gray-700">Manufacturer</div>
          <div className="text-sm font-medium text-gray-700">Batch Number</div>
          <div className="text-sm font-medium text-gray-700">Medicine type</div>
          <div className="text-sm font-medium text-gray-700">Dosage</div>
          <div className="text-sm font-medium text-gray-700">Manufacture date</div>
          <div className="text-sm font-medium text-gray-700">Expiry Date</div>
          <div className="text-sm font-medium text-gray-700">Price</div>
          <div className="text-sm font-medium text-gray-700">Action</div>
        </div>

        {/* Medicine Rows */}
        {medicineRows.map((row) => (
          <div key={row.id} className="grid grid-cols-9 gap-2 p-2 border-b">
            <div>
              <Input
                value={row.name}
                onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Select 
                value={row.manufacturer}
                onValueChange={(value) => updateRow(row.id, 'manufacturer', value)}
              >
                <SelectTrigger className="h-10 rounded-lg border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cipla">Cipla</SelectItem>
                  <SelectItem value="Sun Pharma">Sun Pharma</SelectItem>
                  <SelectItem value="Dr. Reddy's">Dr. Reddy's</SelectItem>
                  <SelectItem value="Lupin">Lupin</SelectItem>
                  <SelectItem value="Zydus">Zydus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                value={row.batchNumber}
                onChange={(e) => updateRow(row.id, 'batchNumber', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Select 
                value={row.type}
                onValueChange={(value) => updateRow(row.id, 'type', value)}
              >
                <SelectTrigger className="h-10 rounded-lg border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tablets">Tablets</SelectItem>
                  <SelectItem value="Capsules">Capsules</SelectItem>
                  <SelectItem value="Syrups">Syrups</SelectItem>
                  <SelectItem value="Liquids">Liquids</SelectItem>
                  <SelectItem value="Creams">Creams</SelectItem>
                  <SelectItem value="Inhalers">Inhalers</SelectItem>
                  <SelectItem value="Patches">Patches</SelectItem>
                  <SelectItem value="Injections">Injections</SelectItem>
                  <SelectItem value="Suppositories">Suppositories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                value={row.dosage}
                onChange={(e) => updateRow(row.id, 'dosage', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Input
                type="text"
                value={row.manufacturedDate}
                onChange={(e) => updateRow(row.id, 'manufacturedDate', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Input
                type="text"
                value={row.expiryDate}
                onChange={(e) => updateRow(row.id, 'expiryDate', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <div className="flex items-center">
                <span className="mr-1">Rs.</span>
                <Input
                  value={row.price}
                  onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                  className="h-10 rounded-lg border-gray-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.id)}
                disabled={medicineRows.length === 1}
                className="h-8 w-8 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Row Button */}
        <Button
          variant="outline"
          onClick={addNewRow}
          className="mt-4 border-[#7165e1] text-[#7165e1]"
        >
          Add New Row
        </Button>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto h-12 px-8 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleFormSubmit}
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white font-medium"
          >
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}