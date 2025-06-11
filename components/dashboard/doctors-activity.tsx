"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserCheck, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface DoctorActivity {
  id: string
  name: string
  specialization: string
  isAvailable: boolean
  appointments: {
    inProgress: number
    completed: number
    pending: number
    total: number
  }
}

interface DoctorsActivityProps {
  doctors: DoctorActivity[]
}

export function DoctorsActivity({ doctors }: DoctorsActivityProps) {
  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-4 md:p-6 lg:p-[34px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
            Doctor's Activity
          </h2>
          <Button
            variant="link"
            className="text-[#7165e1] text-sm md:text-base font-sf-pro font-medium"
          >
            View All
          </Button>
        </div>

        {doctors.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              <ScrollArea className="h-[400px]">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="border border-gray-200 mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#7165e1] truncate">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {doctor.specialization}
                          </p>
                        </div>
                        <Badge
                          variant={doctor.isAvailable ? "completed" : "pending"}
                          className="rounded-full text-xs ml-2"
                        >
                          {doctor.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-yellow-700">In Progress</span>
                          </div>
                          <span className="font-semibold text-yellow-700">
                            {doctor.appointments.inProgress}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700">Completed</span>
                          </div>
                          <span className="font-semibold text-green-700">
                            {doctor.appointments.completed}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg col-span-2">
                          <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                            <span className="text-orange-700">Pending</span>
                          </div>
                          <span className="font-semibold text-orange-700">
                            {doctor.appointments.pending}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-6 gap-4 p-4 bg-[#f4f3ff] rounded-[10px] font-sf-pro font-medium text-[#888888]">
                    <div className="text-lg">Doctor Name</div>
                    <div className="text-lg">Specialization</div>
                    <div className="text-lg text-center">Status</div>
                    <div className="text-lg text-center">In Progress</div>
                    <div className="text-lg text-center">Completed</div>
                    <div className="text-lg text-center">Pending</div>
                  </div>

                  {/* Doctor Rows */}
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="grid grid-cols-6 gap-4 p-4 bg-[#f4f3ff] rounded-[10px] items-center"
                    >
                      <div>
                        <p className="text-base text-black font-sf-pro font-semibold">
                          {doctor.name}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-base text-black font-sf-pro">
                          {doctor.specialization}
                        </p>
                      </div>
                      
                      <div className="flex justify-center">
                        <Badge
                          variant={doctor.isAvailable ? "completed" : "pending"}
                          className="rounded-[40px] text-sm font-sf-pro"
                        >
                          {doctor.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="flex items-center justify-center w-12 h-8 bg-yellow-100 rounded-lg">
                          <span className="text-base font-sf-pro font-semibold text-yellow-700">
                            {doctor.appointments.inProgress}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="flex items-center justify-center w-12 h-8 bg-green-100 rounded-lg">
                          <span className="text-base font-sf-pro font-semibold text-green-700">
                            {doctor.appointments.completed}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="flex items-center justify-center w-12 h-8 bg-orange-100 rounded-lg">
                          <span className="text-base font-sf-pro font-semibold text-orange-700">
                            {doctor.appointments.pending}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-500 font-sf-pro">
              No doctors found. Add doctors to see their activity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}