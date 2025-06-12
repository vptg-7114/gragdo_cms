"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, PenSquare, Trash2, MoreHorizontal } from "lucide-react"
import { createDoctor, updateDoctor, deleteDoctor } from "@/lib/actions/doctors"
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
  // Add mock data for table display
  const doctorsWithScheduleData = initialDoctors.map((doctor, index) => ({
    ...doctor,
    doctorId: `${123456 + index}`,
    appointmentCount: 10,
    weeklySchedule: {
      sun: "NA",
      mon: "9AM-2PM",
      tue: "9AM-2PM", 
      wed: "9AM-2PM",
      thu: "9AM-2PM",
      fri: "9AM-2PM",
      sat: "9AM-2PM"
    }
  }))

  const [doctors, setDoctors] = useState(doctorsWithScheduleData)
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsWithScheduleData)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // Filter doctors based on search term
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctorId.includes(searchTerm) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDoctors(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, doctors])

  const handleEdit = (id: string) => {
    console.log('Edit doctor:', id)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteDoctor(id)
    if (result.success) {
      setDoctors(prev => prev.filter(d => d.id !== id))
    } else {
      console.error('Failed to delete doctor:', result.error)
    }
  }

  // Pagination logic
  const totalRecords = filteredDoctors.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing records per page
  }

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

      {/* Doctors Container with integrated search and pagination */}
      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Header with Search and Records Per Page */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Doctors List
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Records Per Page Dropdown */}
              <div className="flex items-center gap-2 lg:min-w-[160px]">
                <span className="text-sm text-gray-600 whitespace-nowrap">Display</span>
                <Select value={recordsPerPage} onValueChange={handleRecordsPerPageChange}>
                  <SelectTrigger className="h-10 w-[80px] rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600 whitespace-nowrap">records per page</span>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {paginatedDoctors.map((doctor, index) => (
              <Card key={doctor.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {doctor.doctorId}
                      </p>
                    </div>
                    <Badge
                      variant={doctor.isAvailable ? "completed" : "pending"}
                      className="rounded-[20px] text-xs"
                    >
                      {doctor.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Designation:</span>
                      <span>{doctor.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Appointments:</span>
                      <span>{doctor.appointmentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="text-right">Mon-Sat: 9AM-2PM</span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(doctor.id)}>
                          <PenSquare className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(doctor.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View - Matching the image layout exactly */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      ID
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Doctor Name
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Designation
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Appointments
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Sun
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Mon
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Tue
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Wed
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Thu
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Fri
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Sat
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDoctors.map((doctor, index) => (
                    <TableRow
                      key={doctor.id}
                      className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff] cursor-pointer"
                      onClick={() => window.location.href = `/doctors/${doctor.id}`}
                    >
                      <TableCell className="text-base text-black font-sf-pro">
                        {doctor.doctorId}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {doctor.name}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {doctor.specialization}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {doctor.appointmentCount}
                      </TableCell>
                      <TableCell className="text-base font-sf-pro">
                        <span className="text-red-500 font-medium">NA</span>
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        9AM-2PM
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        9AM-2PM
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        9AM-2PM
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        9AM-2PM
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        9AM-2PM
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        9AM-2PM
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Results Summary and Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages}
              {searchTerm && ` (filtered from ${doctors.length} total)`}
            </p>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-xs"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "digigo" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Pagination (for mobile) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 lg:hidden">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600 px-3">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No doctors found matching your search." : "No doctors found. Add your first doctor to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}