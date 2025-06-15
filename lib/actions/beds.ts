export async function getBedsByRoom(roomId: string) {
  try {
    // Mock data for beds in a room
    const mockBeds = [
      {
        id: '1',
        bedNumber: 1,
        patientName: 'K. Vijay',
        age: 22,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '2',
        bedNumber: 2,
        patientName: 'P. Sandeep',
        age: 30,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '3',
        bedNumber: 3,
        patientName: 'Ch. Asritha',
        age: 25,
        gender: 'F',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '4',
        bedNumber: 4,
        patientName: 'P. Ravi',
        age: 32,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '5',
        bedNumber: 5,
        patientName: 'A. Srikanth',
        age: 32,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '6',
        bedNumber: 6,
        patientName: 'P. Ravi',
        age: 32,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '7',
        bedNumber: 7,
        patientName: 'A. Srikanth',
        age: 32,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '8',
        bedNumber: 8,
        patientName: 'P. Ravi',
        age: 32,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '9',
        bedNumber: 9,
        patientName: 'A. Srikanth',
        age: 32,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      },
      {
        id: '10',
        bedNumber: 10,
        patientName: 'P. Ravi',
        age: 32,
        gender: 'M',
        admissionDate: '30-05-2025',
        dischargeDate: '05-06-2025',
        status: 'occupied'
      }
    ]

    return mockBeds
  } catch (error) {
    console.error('Error fetching beds:', error)
    return []
  }
}

export async function reserveBed(data: {
  roomId: string
  bedNumber: string
  patientFirstName: string
  patientLastName: string
  age: string
  gender: string
  admissionDate: string
}) {
  try {
    // In a real app, you would save to database
    console.log('Reserving bed:', data)
    return { success: true }
  } catch (error) {
    console.error('Error reserving bed:', error)
    return { success: false, error: 'Failed to reserve bed' }
  }
}

export async function dischargeBed(bedId: string) {
  try {
    // In a real app, you would update in database
    console.log('Discharging bed:', bedId)
    return { success: true }
  } catch (error) {
    console.error('Error discharging bed:', error)
    return { success: false, error: 'Failed to discharge bed' }
  }
}