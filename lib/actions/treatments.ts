export async function createTreatment(data: {
  treatmentName: string
  treatmentInChargeName: string
  treatmentCost: number
}) {
  try {
    // In a real app, you would save to database
    console.log('Creating treatment:', data)
    return { success: true }
  } catch (error) {
    console.error('Error creating treatment:', error)
    return { success: false, error: 'Failed to create treatment' }
  }
}

export async function updateTreatment(id: string, data: {
  treatmentName?: string
  treatmentInChargeName?: string
  treatmentCost?: number
}) {
  try {
    // In a real app, you would update in database
    console.log('Updating treatment:', id, data)
    return { success: true }
  } catch (error) {
    console.error('Error updating treatment:', error)
    return { success: false, error: 'Failed to update treatment' }
  }
}

export async function deleteTreatment(id: string) {
  try {
    // In a real app, you would delete from database
    console.log('Deleting treatment:', id)
    return { success: true }
  } catch (error) {
    console.error('Error deleting treatment:', error)
    return { success: false, error: 'Failed to delete treatment' }
  }
}

export async function getTreatments() {
  try {
    // Mock data for demo purposes - matching the image exactly
    const mockTreatments = [
      {
        id: '1',
        treatmentName: 'Complete Blood Count (CBC)',
        treatmentInCharge: 'K. Vijay',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        treatmentName: 'Lipid Profile',
        treatmentInCharge: 'P. Sandeep',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-14')
      },
      {
        id: '3',
        treatmentName: 'Thyroid Panel',
        treatmentInCharge: 'Ch. Asritha',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-13')
      },
      {
        id: '4',
        treatmentName: 'Diabetes Panel',
        treatmentInCharge: 'P. Ravi',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-12')
      },
      {
        id: '5',
        treatmentName: 'Liver Panel',
        treatmentInCharge: 'A. Srikanth',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-11')
      },
      {
        id: '6',
        treatmentName: 'Kidney Panel',
        treatmentInCharge: 'P. Ravi',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-10')
      },
      {
        id: '7',
        treatmentName: 'Vitamin Profile',
        treatmentInCharge: 'A. Srikanth',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-09')
      },
      {
        id: '8',
        treatmentName: 'CT Scan',
        treatmentInCharge: 'P. Ravi',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-08')
      },
      {
        id: '9',
        treatmentName: 'MRI Scan',
        treatmentInCharge: 'A. Srikanth',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-07')
      },
      {
        id: '10',
        treatmentName: 'X-ray',
        treatmentInCharge: 'P. Ravi',
        treatmentCost: 10000,
        createdAt: new Date('2024-01-06')
      }
    ]

    return mockTreatments
  } catch (error) {
    console.error('Error fetching treatments:', error)
    return []
  }
}

export async function getTreatmentById(id: string) {
  try {
    const treatments = await getTreatments()
    return treatments.find(treatment => treatment.id === id) || null
  } catch (error) {
    console.error('Error fetching treatment:', error)
    return null
  }
}