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
import { Plus, Search, PenSquare, Trash2 } from "lucide-react"
import { RoomForm } from "@/components/rooms/room-form"

interface Room {
  id: string
  roomNo: string
  roomType: string
  totalBeds: number
  availableBeds: number
  occupiedBeds: number
  reservedBeds: number
}

export default function RoomsPage() {
  // Mock data for rooms
  const initialRooms = [
    {
      id: '1',
      roomNo: '1',
      roomType: 'Delux',
      totalBeds: 3,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '2',
      roomNo: '2',
      roomType: 'Standard',
      totalBeds: 4,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 1
    },
    {
      id: '3',
      roomNo: '3',
      roomType: 'Private',
      totalBeds: 1,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '4',
      roomNo: '4',
      roomType: 'Suite',
      totalBeds: 2,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 1
    },
    {
      id: '5',
      roomNo: '5',
      roomType: 'Ward',
      totalBeds: 16,
      availableBeds: 6,
      occupiedBeds: 10,
      reservedBeds: 0
    },
    {
      id: '6',
      roomNo: '1',
      roomType: 'Standard',
      totalBeds: 4,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 1
    },
    {
      id: '7',
      roomNo: '2',
      roomType: 'Ward',
      totalBeds: 16,
      availableBeds: 3,
      occupiedBeds: 13,
      reservedBeds: 0
    },
    {
      id: '8',
      roomNo: '3',
      roomType: 'Delux',
      totalBeds: 3,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '9',
      roomNo: '4',
      roomType: 'Private',
      totalBeds: 1,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '10',
      roomNo: '5',
      roomType: 'Suite',
      totalBeds: 2,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 0
    }
  ]

  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(initialRooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  useEffect(() => {
    // Filter rooms based on search term
    const filtered = rooms.filter((room) =>
      room.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRooms(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, rooms])

  const handleSubmit = async (data: any) => {
    if (editingRoom) {
      // Update existing room
      setRooms(prev => 
        prev.map(room => 
          room.id === editingRoom.id ? { ...room, ...data } : room
        )
      )
    } else {
      // Add new room
      const newRoom = {
        id: Math.random().toString(36).substr(2, 9),
        ...data
      }
      setRooms(prev => [...prev, newRoom])
    }
    
    setIsFormOpen(false)
    setEditingRoom(null)
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id))
  }

  // Pagination logic
  const totalRecords = filteredRooms.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing records per page
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="USER" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
              Rooms Management
            </h1>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  <span className="hidden sm:inline">Add Room</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <RoomForm
                  initialData={editingRoom || undefined}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setIsFormOpen(false)
                    setEditingRoom(null)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-[20px] shadow-sm">
            <div className="p-4 md:p-6 lg:p-[34px]">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
                  Rooms
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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
                {paginatedRooms.map((room) => (
                  <Card key={room.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-[#7165e1]">
                            Room {room.roomNo}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {room.roomType}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Beds:</span>
                          <span>{room.totalBeds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available:</span>
                          <span>{room.availableBeds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Occupied:</span>
                          <span>{room.occupiedBeds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reserved:</span>
                          <span>{room.reservedBeds}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(room)}>
                          <PenSquare className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(room.id)}>
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
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Room No.</TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Room type</TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Total Beds</TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Available Beds</TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Occupied Beds</TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Reserved Beds</TableHead>
                        <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRooms.map((room) => (
                        <TableRow key={room.id} className="bg-[#f4f3ff] rounded-[10px] my-[10px]">
                          <TableCell className="text-base text-black font-sf-pro">
                            {room.roomNo}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {room.roomType}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {room.totalBeds}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {room.availableBeds}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {room.occupiedBeds}
                          </TableCell>
                          <TableCell className="text-base text-black font-sf-pro">
                            {room.reservedBeds}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
                                <PenSquare className="w-5 h-5 text-[#7165e1]" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)}>
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
                  {searchTerm && ` (filtered from ${rooms.length} total)`}
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

              {filteredRooms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 font-sf-pro">
                    {searchTerm ? "No rooms found matching your search." : "No rooms found. Add your first room to get started."}
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