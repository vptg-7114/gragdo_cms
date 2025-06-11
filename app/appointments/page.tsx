"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AppointmentTable } from "@/components/appointments/appointment-table"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { getAppointments, deleteAppointment } from "@/lib/actions/appointments"
import { getPatients } from "@/lib/actions/patients"
import { getDoctors } from "@/lib/actions/doctors"

export default function AppointmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null)
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        getAppointments(),
        getPatients(),
        getDoctors()
      ])
      
      setAppointments(appointmentsData)
      setPatients(patientsData)
      setDoctors(doctorsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    console.log("Appointment data:", data)
    setIsFormOpen(false)
    setEditingAppointment(null)
    await loadData() // Refresh data
  }

  const handleEdit = (id: string) => {
    setEditingAppointment(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteAppointment(id)
    if (result.success) {
      await loadData() // Refresh data
    } else {
      console.error('Failed to delete appointment:', result.error)
    }
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
              Appointments Management
            </h1>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  <span className="hidden sm:inline">Schedule Appointment</span>
                  <span className="sm:hidden">Schedule</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <AppointmentForm
                  patients={patients}
                  doctors={doctors}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <AppointmentTable
            appointments={appointments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  )
}