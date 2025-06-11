import { PrismaClient, UserRole, Gender, AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a clinic
  const clinic = await prisma.clinic.create({
    data: {
      name: 'Vishnu Clinic',
      address: '123 Health Street, Medical District',
      phone: '+91-9876543210',
      email: 'info@vishnuclinic.com',
      description: 'A modern healthcare facility providing comprehensive medical services'
    }
  })

  // Create users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@digigo.com',
      name: 'Super Admin',
      phone: '+91-9999999999',
      role: UserRole.SUPER_ADMIN
    }
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@vishnuclinic.com',
      name: 'Clinic Admin',
      phone: '+91-9876543210',
      role: UserRole.ADMIN,
      clinicId: clinic.id
    }
  })

  const user = await prisma.user.create({
    data: {
      email: 'operator@vishnuclinic.com',
      name: 'Reception Operator',
      phone: '+91-9876543211',
      role: UserRole.USER,
      clinicId: clinic.id
    }
  })

  // Create doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: 'Dr. K. Ranganath',
        email: 'ranganath@vishnuclinic.com',
        phone: '+91-9876543212',
        specialization: 'Cardiology',
        qualification: 'MBBS, MD (Cardiology)',
        experience: 15,
        consultationFee: 500,
        clinicId: clinic.id,
        createdById: admin.id
      }
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. L. Satya',
        email: 'satya@vishnuclinic.com',
        phone: '+91-9876543213',
        specialization: 'General Medicine',
        qualification: 'MBBS, MD (General Medicine)',
        experience: 10,
        consultationFee: 300,
        clinicId: clinic.id,
        createdById: admin.id
      }
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. G. Anitha',
        email: 'anitha@vishnuclinic.com',
        phone: '+91-9876543214',
        specialization: 'Gynecology',
        qualification: 'MBBS, MS (Gynecology)',
        experience: 12,
        consultationFee: 400,
        clinicId: clinic.id,
        createdById: admin.id
      }
    })
  ])

  // Create doctor schedules
  for (const doctor of doctors) {
    // Monday to Friday, 9 AM to 5 PM
    for (let day = 1; day <= 5; day++) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00'
        }
      })
    }
  }

  // Create patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        patientId: '123456',
        name: 'K. Vijay',
        email: 'vijay@example.com',
        phone: '9876543210',
        gender: Gender.MALE,
        age: 22,
        address: '456 Patient Street, City',
        medicalHistory: 'No significant medical history',
        clinicId: clinic.id,
        createdById: user.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: '454575',
        name: 'P. Sandeep',
        email: 'sandeep@example.com',
        phone: '9876543215',
        gender: Gender.MALE,
        age: 30,
        address: '789 Patient Avenue, City',
        clinicId: clinic.id,
        createdById: user.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: '787764',
        name: 'Ch. Asritha',
        email: 'asritha@example.com',
        phone: '9876543216',
        gender: Gender.FEMALE,
        age: 25,
        address: '321 Patient Road, City',
        clinicId: clinic.id,
        createdById: user.id
      }
    })
  ])

  // Create appointments
  const today = new Date()
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        clinicId: clinic.id,
        appointmentDate: new Date(today.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        concern: 'Heart problem',
        notes: 'Regular checkup for heart condition',
        status: AppointmentStatus.PENDING,
        createdById: user.id
      }
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        clinicId: clinic.id,
        appointmentDate: new Date(today.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
        concern: 'General checkup',
        status: AppointmentStatus.IN_PROGRESS,
        createdById: user.id
      }
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        clinicId: clinic.id,
        appointmentDate: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        concern: 'PCOD consultation',
        status: AppointmentStatus.COMPLETED,
        createdById: user.id
      }
    })
  ])

  // Create some transactions
  await Promise.all([
    prisma.transaction.create({
      data: {
        amount: 500,
        type: 'INCOME',
        description: 'Consultation fee - Dr. K. Ranganath',
        paymentStatus: 'PAID',
        appointmentId: appointments[2].id,
        clinicId: clinic.id
      }
    }),
    prisma.transaction.create({
      data: {
        amount: 2000,
        type: 'EXPENSE',
        description: 'Medical equipment purchase',
        paymentStatus: 'PAID',
        clinicId: clinic.id
      }
    })
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })