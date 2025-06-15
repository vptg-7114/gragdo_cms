"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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
import { Search, Plus } from "lucide-react"
import { BedReservationForm } from "./bed-reservation-form"
import { dischargeBed } from "@/lib/actions/beds"

interface Bed {
  id: string
  bedNumber: number
  patientName: string
  age: number
  gender: string
  admissionDate: string
  dischargeDate: string
  status: 'occupied' | 'available' | 'reserved'
}

interface BedsClientProps {
  roomId: string
  initialBeds: Bed[]
}

export function BedsClient({ roomId, initialBeds }: BedsClientProps) {
  const [beds, setBeds] = useState(initialBeds)
  const [filteredBeds, setFilteredBeds] = useState(initialBeds)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isReservationOpen, setIsReservationOpen] = useState(false)

  useEffect(() => {
    const filtered = beds.filter((bed) =>
      bed.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.bedNumber.toString().includes(searchTerm) ||
      bed.gender.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBeds(filtered)
    setCurrentPage(1)
  }, [searchTerm, beds])

  const handleReservation = async (data: any) => {
    console.log("Bed reservation data:", data)
    setIsReservationOpen(false)
    // Refresh beds data here
  }

  const handleDischarge = async (bedId: string) => {
    const result = await dischargeBed(bedId)
    if (result.success) {
      setBeds(prev => prev.map(bed => 
        bed.id === bedId 
          ? { ...bed, status: 'available' as const, patientName: '', age: 0, gender: '', admissionDate: '', dischargeDate: '' }
          : bed
      ))
    }
  }

  // Pagination logic
  const totalRecords = filteredBeds.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedBeds = filteredBeds.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span>Patients</span>
        <span className="mx-2">/</span>
        <span>Rooms</span>
        <span className="mx-2">/</span>
        <span>Beds</span>
        <span className="mx-2">/</span>
        <span className="text-[#7165e1]">Reserve Bed</span>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Header with Search and Records Per Page */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl text-black font-sf-pro font-bold">
              Beds
            </h1>
            
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

              {/* Reserve Bed Button */}
              <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                <DialogTrigger asChild>
                  <Button variant="digigo" size="sm" className="h-10 px-4 rounded-xl">
                    Reserve Bed
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                  <BedReservationForm
                    roomId={roomId}
                    onSubmit={handleReservation}
                    onCancel={() => setIsReservationOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {paginatedBeds.map((bed, index) => (
              <Card key={bed.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        Bed {bed.bedNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {bed.patientName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span>{bed.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span>{bed.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admission:</span>
                      <span>{bed.admissionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discharge:</span>
                      <span>{bed.dischargeDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="digigo" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDischarge(bed.id)}
                    >
                      Discharge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Bed No.
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Patient Name
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Age
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Gender
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Admin Date
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Discharge Date
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBeds.map((bed, index) => (
                    <TableRow
                      key={bed.id}
                      className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff]"
                    >
                      <TableCell className="text-base text-black font-sf-pro">
                        {bed.bedNumber}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {bed.patientName}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {bed.age}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {bed.gender}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {bed.admissionDate}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {bed.dischargeDate}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="digigo"
                          size="sm"
                          onClick={() => handleDischarge(bed.id)}
                          className="rounded-xl"
                        >
                          Discharge
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages}
            </p>
            
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
                
                <Button
                  variant="digigo"
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                >
                  {currentPage}
                </Button>
                
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

          {filteredBeds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No beds found matching your search." : "No beds found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}