import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [
      totalAppointments,
      totalPatients,
      todayCheckIns,
      availableDoctors
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.patient.count(),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: today,
            lt: tomorrow
          },
          status: 'COMPLETED'
        }
      }),
      prisma.doctor.count({
        where: { isAvailable: true }
      })
    ])

    return {
      appointments: totalAppointments,
      totalPatients,
      checkIns: todayCheckIns,
      availableDoctors
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      appointments: 0,
      totalPatients: 0,
      checkIns: 0,
      availableDoctors: 0
    }
  }
}

export async function getRecentAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: { appointmentDate: 'desc' },
      include: {
        patient: true,
        doctor: true
      }
    })

    return appointments
  } catch (error) {
    console.error('Error fetching recent appointments:', error)
    return []
  }
}