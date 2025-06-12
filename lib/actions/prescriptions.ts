import { prisma } from "@/lib/prisma"

export async function createPrescription(data: {
  patientId: string
  doctorId: string
  clinicId: string
  concern: string
  diagnosis: string
  medications: string
  instructions?: string
  followUpDate?: Date
  createdById: string
}) {
  try {
    const prescription = await prisma.prescription.create({
      data,
      include: {
        patient: true,
        doctor: true
      }
    })

    return { success: true, prescription }
  } catch (error) {
    console.error('Error creating prescription:', error)
    return { success: false, error: 'Failed to create prescription' }
  }
}

export async function updatePrescription(id: string, data: {
  concern?: string
  diagnosis?: string
  medications?: string
  instructions?: string
  followUpDate?: Date
}) {
  try {
    const prescription = await prisma.prescription.update({
      where: { id },
      data,
      include: {
        patient: true,
        doctor: true
      }
    })

    return { success: true, prescription }
  } catch (error) {
    console.error('Error updating prescription:', error)
    return { success: false, error: 'Failed to update prescription' }
  }
}

export async function deletePrescription(id: string) {
  try {
    await prisma.prescription.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting prescription:', error)
    return { success: false, error: 'Failed to delete prescription' }
  }
}

export async function getPrescriptions(clinicId?: string) {
  try {
    // For demo purposes, return mock data
    const mockPrescriptions = [
      {
        id: '1',
        patientId: '123456',
        patientName: 'K. Vijay',
        doctorName: 'K. Ranganath',
        concern: 'Heart problem',
        gender: 'M',
        age: 22,
        reports: [
          {
            id: '1',
            name: 'Blood Test Report.pdf',
            type: 'PDF',
            url: '/mock-reports/blood-test.pdf',
            size: '2.4 MB'
          },
          {
            id: '2',
            name: 'ECG Report.jpg',
            type: 'Image',
            url: '/mock-reports/ecg.jpg',
            size: '1.8 MB'
          }
        ],
        prescriptions: [
          {
            id: '1',
            name: 'Prescription_Jan_2024.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/prescription-jan.pdf',
            size: '1.2 MB'
          }
        ],
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        patientId: '454575',
        patientName: 'P. Sandeep',
        doctorName: 'L. Satya',
        concern: 'General checkup',
        gender: 'M',
        age: 30,
        reports: [
          {
            id: '3',
            name: 'General Checkup Report.pdf',
            type: 'PDF',
            url: '/mock-reports/general-checkup.pdf',
            size: '3.1 MB'
          }
        ],
        prescriptions: [
          {
            id: '2',
            name: 'Prescription_Jan_2024.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/prescription-jan-2.pdf',
            size: '1.5 MB'
          }
        ],
        createdAt: new Date('2024-01-10')
      },
      {
        id: '3',
        patientId: '787764',
        patientName: 'Ch. Asritha',
        doctorName: 'G. Anitha',
        concern: 'PCOD',
        gender: 'F',
        age: 25,
        reports: [
          {
            id: '4',
            name: 'Ultrasound Report.pdf',
            type: 'PDF',
            url: '/mock-reports/ultrasound.pdf',
            size: '2.8 MB'
          },
          {
            id: '5',
            name: 'Hormone Test.pdf',
            type: 'PDF',
            url: '/mock-reports/hormone-test.pdf',
            size: '1.9 MB'
          }
        ],
        prescriptions: [
          {
            id: '3',
            name: 'PCOD_Treatment_Plan.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/pcod-treatment.pdf',
            size: '2.2 MB'
          }
        ],
        createdAt: new Date('2024-01-08')
      },
      {
        id: '4',
        patientId: '454215',
        patientName: 'P. Ravi',
        doctorName: 'P. Ravi',
        concern: 'Kidney disease',
        gender: 'M',
        age: 32,
        reports: [
          {
            id: '6',
            name: 'Kidney Function Test.pdf',
            type: 'PDF',
            url: '/mock-reports/kidney-function.pdf',
            size: '2.1 MB'
          }
        ],
        prescriptions: [
          {
            id: '4',
            name: 'Kidney_Treatment.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/kidney-treatment.pdf',
            size: '1.8 MB'
          }
        ],
        createdAt: new Date('2024-01-05')
      },
      {
        id: '5',
        patientId: '498465',
        patientName: 'A. Srikanth',
        doctorName: 'K. Ranganath',
        concern: 'Heart problem',
        gender: 'M',
        age: 32,
        reports: [
          {
            id: '7',
            name: 'Cardiac_Assessment.pdf',
            type: 'PDF',
            url: '/mock-reports/cardiac-assessment.pdf',
            size: '3.4 MB'
          },
          {
            id: '8',
            name: 'Stress_Test_Results.jpg',
            type: 'Image',
            url: '/mock-reports/stress-test.jpg',
            size: '2.2 MB'
          }
        ],
        prescriptions: [
          {
            id: '5',
            name: 'Cardiac_Medication.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/cardiac-medication.pdf',
            size: '1.6 MB'
          }
        ],
        createdAt: new Date('2024-01-03')
      },
      {
        id: '6',
        patientId: '454215',
        patientName: 'P. Ravi',
        doctorName: 'P. Ravi',
        concern: 'Kidney disease',
        gender: 'M',
        age: 32,
        reports: [
          {
            id: '9',
            name: 'Follow_up_Report.pdf',
            type: 'PDF',
            url: '/mock-reports/followup.pdf',
            size: '1.7 MB'
          }
        ],
        prescriptions: [
          {
            id: '6',
            name: 'Updated_Prescription.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/updated-prescription.pdf',
            size: '1.4 MB'
          }
        ],
        createdAt: new Date('2024-01-01')
      },
      {
        id: '7',
        patientId: '498465',
        patientName: 'A. Srikanth',
        doctorName: 'K. Ranganath',
        concern: 'Heart problem',
        gender: 'M',
        age: 32,
        reports: [
          {
            id: '10',
            name: 'Monthly_Checkup.pdf',
            type: 'PDF',
            url: '/mock-reports/monthly-checkup.pdf',
            size: '2.6 MB'
          }
        ],
        prescriptions: [
          {
            id: '7',
            name: 'Monthly_Prescription.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/monthly-prescription.pdf',
            size: '1.3 MB'
          }
        ],
        createdAt: new Date('2023-12-28')
      },
      {
        id: '8',
        patientId: '454215',
        patientName: 'P. Ravi',
        doctorName: 'P. Ravi',
        concern: 'Kidney disease',
        gender: 'M',
        age: 32,
        reports: [
          {
            id: '11',
            name: 'Lab_Results_Dec.pdf',
            type: 'PDF',
            url: '/mock-reports/lab-results-dec.pdf',
            size: '2.0 MB'
          }
        ],
        prescriptions: [
          {
            id: '8',
            name: 'December_Prescription.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/december-prescription.pdf',
            size: '1.7 MB'
          }
        ],
        createdAt: new Date('2023-12-25')
      },
      {
        id: '9',
        patientId: '498465',
        patientName: 'A. Srikanth',
        doctorName: 'K. Ranganath',
        concern: 'Heart problem',
        gender: 'M',
        age: 32,
        reports: [
          {
            id: '12',
            name: 'Year_End_Assessment.pdf',
            type: 'PDF',
            url: '/mock-reports/year-end-assessment.pdf',
            size: '3.8 MB'
          }
        ],
        prescriptions: [
          {
            id: '9',
            name: 'Year_End_Prescription.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/year-end-prescription.pdf',
            size: '2.1 MB'
          }
        ],
        createdAt: new Date('2023-12-22')
      },
      {
        id: '10',
        patientId: '454215',
        patientName: 'P. Ravi',
        doctorName: 'P. Ravi',
        concern: 'Kidney disease',
        gender: 'M',
        age: 32,
        reports: [
          {
            id: '13',
            name: 'Final_Report_2023.pdf',
            type: 'PDF',
            url: '/mock-reports/final-report-2023.pdf',
            size: '2.9 MB'
          }
        ],
        prescriptions: [
          {
            id: '10',
            name: 'Final_Prescription_2023.pdf',
            type: 'PDF',
            url: '/mock-prescriptions/final-prescription-2023.pdf',
            size: '1.9 MB'
          }
        ],
        createdAt: new Date('2023-12-20')
      }
    ]

    return mockPrescriptions
  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    return []
  }
}

export async function getPrescriptionById(id: string) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true
      }
    })

    return prescription
  } catch (error) {
    console.error('Error fetching prescription:', error)
    return null
  }
}