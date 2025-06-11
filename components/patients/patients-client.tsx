"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { createPatient, updatePatient, deletePatient } from "@/lib/actions/patients"

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-sf-pro font-bold text-[#7165e1]">
          Patients Management
        </h1>
        
        <Button variant="digigo" size="digigo">
          <Plus className="mr-2 h-6 w-6" />
          Add New Patient
        </Button>
      </div>

      <Card className="rounded-[20px] border-none shadow-sm">
        <CardContent className="p-[34px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search patients by name, ID, or phone..."
                className="pl-10 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              Filter
            </Button>
          </div>

          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="p-4 bg-[#f4f3ff] rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-sf-pro font-semibold text-lg text-[#7165e1]">
                        {patient.name}
                      </h3>
                      <p className="text-gray-600">ID: {patient.patientId}</p>
                      <p className="text-gray-600">Phone: {patient.phone}</p>
                      <p className="text-gray-600">Age: {patient.age} | Gender: {patient.gender}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
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