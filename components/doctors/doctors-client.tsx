"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Phone, Mail, Calendar } from "lucide-react"
import { createDoctor, updateDoctor, deleteDoctor } from "@/lib/actions/doctors"

interface Doctor {
  id: string
  name: string
  email?: string
  phone: string
  specialization: string
  qualification?: string
  experience?: number
  consultationFee?: number
  isAvailable: boolean
  schedules?: any[]
  appointments?: any[]
}

interface DoctorsClientProps {
  initialDoctors: Doctor[]
}

export function DoctorsClient({ initialDoctors }: DoctorsClientProps) {
  const [doctors, setDoctors] = useState(initialDoctors)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-sf-pro font-bold text-[#7165e1]">
          Doctors Management
        </h1>
        
        <Button variant="digigo" size="digigo">
          <Plus className="mr-2 h-6 w-6" />
          Add New Doctor
        </Button>
      </div>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="rounded-[20px] border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-sf-pro font-semibold text-[#7165e1] mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-600 font-sf-pro">
                      {doctor.specialization}
                    </p>
                  </div>
                  <Badge 
                    variant={doctor.isAvailable ? "completed" : "pending"}
                    className="rounded-full"
                  >
                    {doctor.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {doctor.qualification && (
                    <p className="text-sm text-gray-600">
                      <strong>Qualification:</strong> {doctor.qualification}
                    </p>
                  )}
                  {doctor.experience && (
                    <p className="text-sm text-gray-600">
                      <strong>Experience:</strong> {doctor.experience} years
                    </p>
                  )}
                  {doctor.consultationFee && (
                    <p className="text-sm text-gray-600">
                      <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
                    </p>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {doctor.phone}
                  </div>
                  {doctor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {doctor.email}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {doctor.appointments?.length || 0} upcoming appointments
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-[20px] border-none shadow-sm">
          <CardContent className="p-[34px]">
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                No doctors found. Add your first doctor to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}