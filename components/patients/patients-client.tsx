"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { createPatient, updatePatient, deletePatient } from "@/lib/actions/patients"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Patient {
  id: string
  patientId: string
  name: string
  email?: string
  phone: string
  gender: string
  age: number
  address?: string
  medicalHistory?: string
  allergies?: string
  createdAt: Date
}

interface PatientsClientProps {
  initialPatients: Patient[]
}

export function PatientsClient({ initialPatients }: PatientsClientProps) {
  const [patients, setPatients] = useState(initialPatients)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.includes(searchTerm) ||
    patient.phone.includes(searchTerm)
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Patients Management
        </h1>
        
        <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
          <span className="hidden sm:inline">Add New Patient</span>
          <span className="sm:hidden">Add Patient</span>
        </Button>
      </div>

      <Card className="rounded-[20px] border-none shadow-sm">
        <CardContent className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search patients by name, ID, or phone..."
                className="pl-10 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 px-6 w-full sm:w-auto">
              Filter
            </Button>
          </div>

          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="p-4 bg-[#f4f3ff] rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sf-pro font-semibold text-lg text-[#7165e1] truncate">
                        {patient.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                        <p>ID: {patient.patientId}</p>
                        <p>Phone: {patient.phone}</p>
                        <p>Age: {patient.age}</p>
                        <p>Gender: {patient.gender}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="sm:hidden">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No patients found matching your search." : "No patients found. Add your first patient to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}