import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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
  const [appointmentsList, setAppointmentsList] = useState(appointments)

  const handleAccept = (appointmentId: string) => {
    setAppointmentsList(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, action: 'Accept' as const } 
          : appointment
      )
    )
  }

  const handleDecline = (appointmentId: string) => {
    setAppointmentsList(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, action: 'Decline' as const } 
          : appointment
      )
    )
  }

  const columns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'name', label: 'Name' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'email', label: 'Email' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'action', label: 'Action' }
  ]

  const renderCell = (item: Appointment, column: any) => {
    if (column.key === 'action') {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 h-7 rounded"
            onClick={() => handleAccept(item.id)}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="text-xs px-3 py-1 h-7 rounded"
            onClick={() => handleDecline(item.id)}
          >
            Decline
          </Button>
        </div>
      )
    }
    return item[column.key as keyof Appointment]
  }

  return (
    <DataTable
      title="Appointments"
      columns={columns}
      data={appointmentsList}
      actionLabel="View All"
      actionUrl="/admin/appointments"
      renderCell={renderCell}
    />
  )
}