import { prisma } from "@/lib/prisma"
import { AppointmentStatus } from "@prisma/client"

export async function createAppointment(data: {
  patientId: string
  doctorId: string
  clinicId: string
  appointmentDate: Date
  concern: string
  notes?: string
  createdById: string
}) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        status: AppointmentStatus.PENDING,
        duration: 30
      },
      include: {
        patient: true,
        doctor: true
      }
    })

    return { success: true, appointment }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return { success: false, error: 'Failed to create appointment' }
  }
}

export async function updateAppointment(id: string, data: {
  appointmentDate?: Date
  concern?: string
  notes?: string
  status?: AppointmentStatus
}) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        doctor: true
      }
    })

    return { success: true, appointment }
  } catch (error) {
    console.error('Error updating appointment:', error)
    return { success: false, error: 'Failed to update appointment' }
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return { success: false, error: 'Failed to delete appointment' }
  }
}

export async function getAppointments(clinicId?: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: clinicId ? { clinicId } : {},
      include: {
        patient: true,
        doctor: true
      },
      orderBy: { appointmentDate: 'desc' }
    })

    return appointments
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
}