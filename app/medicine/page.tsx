"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
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
import { Plus, Search, PenSquare, Trash2, Filter } from "lucide-react"
import { MedicineForm } from "@/components/admin/medicine/medicine-form"
import { getMedicines, deleteMedicine } from "@/lib/actions/medicines"

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

export default function MedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMedicines = async () => {
      const data = await getMedicines()
      setMedicines(data)
      setFilteredMedicines(data)
      setLoading(false)
    }
    
    loadMedicines()
  }, [])

  useEffect(() => {
    const filtered = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.batchNumber.includes(searchTerm) ||
      medicine.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMedicines(filtered)
    setCurrentPage(1)
  }, [searchTerm, medicines])

  const handleSubmit = async (data: any) => {
    console.log("Medicine data:", data)
    setIsFormOpen(false)
    setEditingMedicine(null)
    // Refresh medicines data here
  }

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteMedicine(id)
    if (result.success) {
      setMedicines(prev => prev.filter(m => m.id !== id))
    } else {
      console.error('Failed to delete medicine:', result.error)
    }
  }

  // Pagination logic
  const totalRecords = filteredMedicines.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedMedicines = filteredMedicines.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f4f3ff]">
        <Sidebar userRole="USER" />
        <main className="flex-1 overflow-auto ml-0 md:ml-0">
          <Header />
          <div className="p-4 md:p-6 lg:p-[34px]">
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="USER" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="bg-white rounded-[20px] shadow-sm">
            <div className="p-4 md:p-6 lg:p-[34px]">
              {/* Header with Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl text-black font-sf-pro font-bold">
                  Medicine
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

                  {/* Filter Button */}
                  <Button variant="outline" className="h-10 px-4 rounded-xl border-gray-300 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2 text-[#7165e1]" />
                    Filter by
                  </Button>

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

                  {/* Add Medicine Button */}
                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                      <Button variant="digigo" size="sm" className="h-10 px-4 rounded-xl">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Medicine
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
                      <MedicineForm
                        initialData={editingMedicine || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                          setIsFormOpen(false)
                          setEditingMedicine(null)
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-4">
                {paginatedMedicines.map((medicine, index) => (
                  <Card key={medicine.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-[#7165e1]">
                            {medicine.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {medicine.manufacturer}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Batch:</span>
                          <span>{medicine.batchNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span>{medicine.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dosage:</span>
                          <span>{medicine.dosage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expiry:</span>
                          <span>{medicine.expiryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span>Rs. {medicine.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(medicine)}>
                          <PenSquare className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(medicine.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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
                          S.No
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Medicine Name
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Manufacturer
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Batch number
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Medicine Type
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Dosage
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Manufactured Date
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Expiry Date
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Price
                        </TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedMedicines.map((medicine, index) => (
                        <TableRow
                          key={medicine.id}
                          className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff]"
                        >
                          <TableCell className="text-base text-black font-sf-pro">
                            {startIndex + index + 1}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {medicine.name}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {medicine.manufacturer}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {medicine.batchNumber}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {medicine.type}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {medicine.dosage}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {medicine.manufacturedDate}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {medicine.expiryDate}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            Rs. {medicine.price}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(medicine)}>
                                <PenSquare className="w-5 h-5 text-[#7165e1]" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(medicine.id)}>
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </Button>
                            </div>
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
                  {searchTerm && ` (filtered from ${medicines.length} total)`}
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

              {filteredMedicines.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 font-sf-pro">
                    {searchTerm ? "No medicines found matching your search." : "No medicines found. Add your first medicine to get started."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}