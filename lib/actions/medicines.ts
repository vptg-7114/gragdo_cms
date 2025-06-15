export async function createMedicine(data: {
  name: string
  manufacturer: string
  batchNumber: string
  type: string
  dosage: string
  manufacturedDate: string
  expiryDate: string
  price: string
}) {
  try {
    // In a real app, you would save to database
    console.log('Creating medicine:', data)
    return { success: true }
  } catch (error) {
    console.error('Error creating medicine:', error)
    return { success: false, error: 'Failed to create medicine' }
  }
}

export async function updateMedicine(id: string, data: {
  name?: string
  manufacturer?: string
  batchNumber?: string
  type?: string
  dosage?: string
  manufacturedDate?: string
  expiryDate?: string
  price?: string
}) {
  try {
    // In a real app, you would update in database
    console.log('Updating medicine:', id, data)
    return { success: true }
  } catch (error) {
    console.error('Error updating medicine:', error)
    return { success: false, error: 'Failed to update medicine' }
  }
}

export async function deleteMedicine(id: string) {
  try {
    // In a real app, you would delete from database
    console.log('Deleting medicine:', id)
    return { success: true }
  } catch (error) {
    console.error('Error deleting medicine:', error)
    return { success: false, error: 'Failed to delete medicine' }
  }
}

export async function getMedicines() {
  try {
    // Mock data for demo purposes
    const mockMedicines = [
      {
        id: '1',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Tablets',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '2',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Capsules',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '3',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Syrups',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '4',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Liquids',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '5',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Creams',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '6',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Inhalers',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '7',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Patches',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '8',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Injections',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '9',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Suppositories',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      },
      {
        id: '10',
        name: 'Medicine name',
        manufacturer: 'Cipla',
        batchNumber: '123456',
        type: 'Tablets',
        dosage: '500mg',
        manufacturedDate: '30-05-2025',
        expiryDate: '05-06-2027',
        price: '100'
      }
    ]

    return mockMedicines
  } catch (error) {
    console.error('Error fetching medicines:', error)
    return []
  }
}

export async function getMedicineById(id: string) {
  try {
    const medicines = await getMedicines()
    return medicines.find(medicine => medicine.id === id) || null
  } catch (error) {
    console.error('Error fetching medicine:', error)
    return null
  }
}