import { prisma } from "@/lib/prisma"

export async function createDoctor(data: {
  name: string
  email?: string
  phone: string
  specialization: string
  qualification?: string
  experience?: number
  consultationFee?: number
  clinicId: string
  createdById: string
}) {
  try {
    const doctor = await prisma.doctor.create({
      data: {
        ...data,
        isAvailable: true
      }
    })

    return { success: true, doctor }
  } catch (error) {
    console.error('Error creating doctor:', error)
    return { success: false, error: 'Failed to create doctor' }
  }
}

export async function updateDoctor(id: string, data: {
  name?: string
  email?: string
  phone?: string
  specialization?: string
  qualification?: string
  experience?: number
  consultationFee?: number
  isAvailable?: boolean
}) {
  try {
    const doctor = await prisma.doctor.update({
      where: { id },
      data
    })

    return { success: true, doctor }
  } catch (error) {
    console.error('Error updating doctor:', error)
    return { success: false, error: 'Failed to update doctor' }
  }
}

export async function deleteDoctor(id: string) {
  try {
    await prisma.doctor.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting doctor:', error)
    return { success: false, error: 'Failed to delete doctor' }
  }
}

export async function getDoctors(clinicId?: string) {
  try {
    const doctors = await prisma.doctor.findMany({
      where: clinicId ? { clinicId } : {},
      include: {
        schedules: true,
        appointments: {
          where: {
            appointmentDate: {
              gte: new Date()
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return doctors
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return []
  }
}

export async function getDoctorById(id: string) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        schedules: true,
        appointments: {
          include: {
            patient: true
          },
          orderBy: { appointmentDate: 'desc' }
        }
      }
    })

    return doctor
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return null
  }
}