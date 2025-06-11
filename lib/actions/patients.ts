import { prisma } from "@/lib/prisma"
import { Gender } from "@prisma/client"
import { generatePatientId } from "@/lib/utils"

export async function createPatient(data: {
  name: string
  email?: string
  phone: string
  gender: Gender
  age: number
  address?: string
  medicalHistory?: string
  allergies?: string
  clinicId: string
  createdById: string
}) {
  try {
    const patientId = generatePatientId()
    
    const patient = await prisma.patient.create({
      data: {
        ...data,
        patientId
      }
    })

    return { success: true, patient }
  } catch (error) {
    console.error('Error creating patient:', error)
    return { success: false, error: 'Failed to create patient' }
  }
}

export async function updatePatient(id: string, data: {
  name?: string
  email?: string
  phone?: string
  gender?: Gender
  age?: number
  address?: string
  medicalHistory?: string
  allergies?: string
}) {
  try {
    const patient = await prisma.patient.update({
      where: { id },
      data
    })

    return { success: true, patient }
  } catch (error) {
    console.error('Error updating patient:', error)
    return { success: false, error: 'Failed to update patient' }
  }
}

export async function deletePatient(id: string) {
  try {
    await prisma.patient.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting patient:', error)
    return { success: false, error: 'Failed to delete patient' }
  }
}

export async function getPatients(clinicId?: string) {
  try {
    const patients = await prisma.patient.findMany({
      where: clinicId ? { clinicId } : {},
      orderBy: { createdAt: 'desc' }
    })

    return patients
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

export async function getPatientById(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            doctor: true
          },
          orderBy: { appointmentDate: 'desc' }
        }
      }
    })

    return patient
  } catch (error) {
    console.error('Error fetching patient:', error)
    return null
  }
}