"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Phone, Mail, Calendar, MoreHorizontal } from "lucide-react"
import { createDoctor, updateDoctor, deleteDoctor } from "@/lib/actions/doctors"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Doctors Management
        </h1>
        
        <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
          <span className="hidden sm:inline">Add New Doctor</span>
          <span className="sm:hidden">Add Doctor</span>
        </Button>
      </div>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {doctors.map((doctor) => (
            <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
              <Card className="rounded-[20px] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-sf-pro font-semibold text-[#7165e1] mb-1 truncate">
                        {doctor.name}
                      </h3>
                      <p className="text-gray-600 font-sf-pro text-sm md:text-base truncate">
                        {doctor.specialization}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={doctor.isAvailable ? "completed" : "pending"}
                        className="rounded-full text-xs"
                      >
                        {doctor.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Schedule</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-xs md:text-sm">
                    {doctor.qualification && (
                      <p className="text-gray-600">
                        <strong>Qualification:</strong> {doctor.qualification}
                      </p>
                    )}
                    {doctor.experience && (
                      <p className="text-gray-600">
                        <strong>Experience:</strong> {doctor.experience} years
                      </p>
                    )}
                    {doctor.consultationFee && (
                      <p className="text-gray-600">
                        <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-xs md:text-sm">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{doctor.phone}</span>
                    </div>
                    {doctor.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{doctor.email}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{doctor.appointments?.length || 0} upcoming appointments</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs md:text-sm"
                      onClick={(e) => e.preventDefault()}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs md:text-sm"
                      onClick={(e) => e.preventDefault()}
                    >
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="rounded-[20px] border-none shadow-sm">
          <CardContent className="p-4 md:p-6 lg:p-[34px]">
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