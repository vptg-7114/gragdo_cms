import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Appointment {
  id: string
  sNo: number
  name: string
  phoneNumber: string
  email: string
  age: number
  gender: string
  action: 'Accept' | 'Decline'
}

interface AdminAppointmentsProps {
  appointments: Appointment[]
}

export function AdminAppointments({ appointments }: AdminAppointmentsProps) {
  const handleAction = (appointmentId: string, action: 'Accept' | 'Decline') => {
    console.log(`${action} appointment:`, appointmentId)
  }

  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-sf-pro font-semibold text-black">
            Appointments
          </h3>
          <Button variant="link" className="text-[#7165e1] text-sm font-sf-pro font-medium p-0">
            View All
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-xs font-sf-pro font-medium text-gray-600">S.No</TableHead>
                <TableHead className="text-xs font-sf-pro font-medium text-gray-600">Name</TableHead>
                <TableHead className="text-xs font-sf-pro font-medium text-gray-600">Phone number</TableHead>
                <TableHead className="text-xs font-sf-pro font-medium text-gray-600">Email</TableHead>
                <TableHead className="text-xs font-sf-pro font-medium text-gray-600">Age</TableHead>
                <TableHead className="text-xs font-sf-pro font-medium text-gray-600">Gender</TableHead>
                <TableHead className="text-xs font-sf-pro font-medium text-gray-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} className="border-b border-gray-100">
                  <TableCell className="text-sm font-sf-pro text-black">
                    {appointment.sNo}
                  </TableCell>
                  <TableCell className="text-sm font-sf-pro text-black">
                    {appointment.name}
                  </TableCell>
                  <TableCell className="text-sm font-sf-pro text-black">
                    {appointment.phoneNumber}
                  </TableCell>
                  <TableCell className="text-sm font-sf-pro text-black">
                    {appointment.email}
                  </TableCell>
                  <TableCell className="text-sm font-sf-pro text-black">
                    {appointment.age}
                  </TableCell>
                  <TableCell className="text-sm font-sf-pro text-black">
                    {appointment.gender}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 h-7 rounded"
                        onClick={() => handleAction(appointment.id, 'Accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs px-3 py-1 h-7 rounded"
                        onClick={() => handleAction(appointment.id, 'Decline')}
                      >
                        Decline
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