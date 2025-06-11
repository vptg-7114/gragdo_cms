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

export async function getDoctorsActivity() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        appointments: {
          select: {
            status: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    const doctorsActivity = doctors.map(doctor => {
      const appointments = doctor.appointments
      const inProgress = appointments.filter(apt => apt.status === 'IN_PROGRESS').length
      const completed = appointments.filter(apt => apt.status === 'COMPLETED').length
      const pending = appointments.filter(apt => apt.status === 'PENDING').length

      return {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        isAvailable: doctor.isAvailable,
        appointments: {
          inProgress,
          completed,
          pending,
          total: appointments.length
        }
      }
    })

    return doctorsActivity
  } catch (error) {
    console.error('Error fetching doctors activity:', error)
    return []
  }
}

export async function getRecentReports() {
  try {
    // Mock data for recent reports - replace with actual report model when implemented
    const reports = [
      {
        id: '1',
        title: 'Monthly Patient Report',
        type: 'Patient Analytics',
        generatedDate: new Date('2024-01-15'),
        size: '2.4 MB',
        format: 'PDF'
      },
      {
        id: '2',
        title: 'Revenue Analysis Q4',
        type: 'Financial Report',
        generatedDate: new Date('2024-01-10'),
        size: '1.8 MB',
        format: 'Excel'
      },
      {
        id: '3',
        title: 'Doctor Performance Report',
        type: 'Performance Analytics',
        generatedDate: new Date('2024-01-08'),
        size: '3.2 MB',
        format: 'PDF'
      },
      {
        id: '4',
        title: 'Appointment Statistics',
        type: 'Operational Report',
        generatedDate: new Date('2024-01-05'),
        size: '1.5 MB',
        format: 'PDF'
      },
      {
        id: '5',
        title: 'Inventory Status Report',
        type: 'Inventory Management',
        generatedDate: new Date('2024-01-03'),
        size: '2.1 MB',
        format: 'Excel'
      },
      {
        id: '6',
        title: 'Patient Satisfaction Survey',
        type: 'Quality Assurance',
        generatedDate: new Date('2024-01-01'),
        size: '4.3 MB',
        format: 'PDF'
      },
      {
        id: '7',
        title: 'Staff Attendance Report',
        type: 'HR Analytics',
        generatedDate: new Date('2023-12-28'),
        size: '1.2 MB',
        format: 'Excel'
      },
      {
        id: '8',
        title: 'Equipment Maintenance Log',
        type: 'Maintenance Report',
        generatedDate: new Date('2023-12-25'),
        size: '2.8 MB',
        format: 'PDF'
      },
      {
        id: '9',
        title: 'Insurance Claims Report',
        type: 'Financial Report',
        generatedDate: new Date('2023-12-22'),
        size: '3.5 MB',
        format: 'Excel'
      },
      {
        id: '10',
        title: 'Medication Usage Analysis',
        type: 'Pharmacy Report',
        generatedDate: new Date('2023-12-20'),
        size: '2.9 MB',
        format: 'PDF'
      }
    ]

    return reports
  } catch (error) {
    console.error('Error fetching recent reports:', error)
    return []
  }
}