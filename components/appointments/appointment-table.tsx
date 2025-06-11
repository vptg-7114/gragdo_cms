"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PenSquare, Trash2 } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface Appointment {
  id: string
  patient: {
    patientId: string
    name: string
    phone: string
    gender: string
    age: number
  }
  doctor: {
    name: string
  }
  appointmentDate: Date
  duration: number
  concern: string
  status: string
}

interface AppointmentTableProps {
  appointments: Appointment[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function AppointmentTable({ appointments, onEdit, onDelete }: AppointmentTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'completed'
      case 'IN_PROGRESS':
        return 'inProgress'
      case 'PENDING':
        return 'pending'
      default:
        return 'pending'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'COMPLETED':
        return 'Completed'
      case 'PENDING':
        return 'Pending'
      default:
        return status
    }
  }

  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-[34px]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-black font-sf-pro font-semibold">
            Appointments
          </h2>
          <Button
            variant="link"
            className="text-[#7165e1] text-base font-sf-pro font-medium"
          >
            View All
          </Button>
        </div>

        <ScrollArea className="mt-[48px] h-[350px]">
          <Table>
            <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
              <TableRow>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  S.No
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Patient's ID
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Name
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Phone
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Gender
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Age
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Concern
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Doctor name
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Time
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Status
                </TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow
                  key={appointment.id}
                  className="bg-[#f4f3ff] rounded-[10px] my-[10px]"
                >
                  <TableCell className="text-base text-black font-sf-pro">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.patient.patientId}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.patient.name}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.patient.phone}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.patient.gender}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.patient.age}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.concern}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.doctor.name}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {formatTime(appointment.appointmentDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(appointment.status)}
                      className="rounded-[40px] text-base font-sf-pro"
                    >
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(appointment.id)}
                      >
                        <PenSquare className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(appointment.id)}
                      >
                        <Trash2 className="w-[23px] h-[23px]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}