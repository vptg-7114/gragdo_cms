export async function getAdminDashboardStats() {
  try {
    // Mock data for admin dashboard stats
    return {
      totalPatients: 150,
      appointments: 150,
      doctors: 20,
      staff: 50
    }
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    return {
      totalPatients: 0,
      appointments: 0,
      doctors: 0,
      staff: 0
    }
  }
}

export async function getAdminDoctors() {
  try {
    // Mock data for doctors list
    return [
      {
        id: '1',
        name: 'Dr. M. Santhosh',
        specialization: 'Cardiologist',
        isAvailable: true,
        avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      {
        id: '2',
        name: 'Dr. G. Kiran Kumar',
        specialization: 'Urologist',
        isAvailable: true
      },
      {
        id: '3',
        name: 'Dr. Ch. Asritha',
        specialization: 'Gynecologist',
        isAvailable: true
      },
      {
        id: '4',
        name: 'Dr. K. Arun Kumar',
        specialization: 'Ophthalmologist',
        isAvailable: false
      }
    ]
  } catch (error) {
    console.error('Error fetching admin doctors:', error)
    return []
  }
}

export async function getAdminStaff() {
  try {
    // Mock data for staff list
    return [
      {
        id: '1',
        name: 'K. Rohini',
        role: 'Head nurse',
        isAvailable: true,
        avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      {
        id: '2',
        name: 'P. Priyanka',
        role: 'Nurse',
        isAvailable: true
      },
      {
        id: '3',
        name: 'J. Rajesh',
        role: 'Compounder',
        isAvailable: true
      },
      {
        id: '4',
        name: 'D. Dhanush',
        role: 'Compounder',
        isAvailable: false
      }
    ]
  } catch (error) {
    console.error('Error fetching admin staff:', error)
    return []
  }
}

export async function getAdminTransactions() {
  try {
    // Mock data for transaction history
    return [
      {
        id: '1',
        doctorName: 'Dr. M. Santhosh',
        testName: 'ECG',
        date: 'June 2',
        amount: 350
      },
      {
        id: '2',
        doctorName: 'Dr. G. Kiran Kumar',
        testName: 'Kidney Function Test',
        date: 'June 2',
        amount: 550
      },
      {
        id: '3',
        doctorName: 'Dr. Ch. Asritha',
        testName: 'Blood Test',
        date: 'June 2',
        amount: 150
      },
      {
        id: '4',
        doctorName: 'Dr. K. Arun Kumar',
        testName: 'Visual field test',
        date: 'June 2',
        amount: 200
      },
      {
        id: '5',
        doctorName: 'Dr. K. Arun Kumar',
        testName: 'Glaucoma tests',
        date: 'June 2',
        amount: 300
      },
      {
        id: '6',
        doctorName: 'Dr. K. Arun Kumar',
        testName: 'Color vision tests',
        date: 'June 2',
        amount: 200
      }
    ]
  } catch (error) {
    console.error('Error fetching admin transactions:', error)
    return []
  }
}

export async function getAdminAppointments() {
  try {
    // Mock data for appointments
    return [
      {
        id: '1',
        sNo: 1,
        name: 'K. Vijay',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 22,
        gender: 'M',
        action: 'Accept' as const
      },
      {
        id: '2',
        sNo: 2,
        name: 'P. Sandeep',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 30,
        gender: 'M',
        action: 'Accept' as const
      },
      {
        id: '3',
        sNo: 3,
        name: 'Ch. Asritha',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 25,
        gender: 'F',
        action: 'Accept' as const
      },
      {
        id: '4',
        sNo: 4,
        name: 'P. Ravi',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 32,
        gender: 'M',
        action: 'Accept' as const
      },
      {
        id: '5',
        sNo: 5,
        name: 'K. Arun',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 32,
        gender: 'M',
        action: 'Accept' as const
      },
      {
        id: '6',
        sNo: 6,
        name: 'K. Satya',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 32,
        gender: 'M',
        action: 'Accept' as const
      },
      {
        id: '7',
        sNo: 7,
        name: 'B. Kiran',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 32,
        gender: 'M',
        action: 'Accept' as const
      },
      {
        id: '8',
        sNo: 8,
        name: 'S. Santhosh',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 32,
        gender: 'M',
        action: 'Accept' as const
      },
      {
        id: '9',
        sNo: 9,
        name: 'L. Anitha',
        phoneNumber: '9876543210',
        email: '9876543210',
        age: 32,
        gender: 'F',
        action: 'Accept' as const
      }
    ]
  } catch (error) {
    console.error('Error fetching admin appointments:', error)
    return []
  }
}