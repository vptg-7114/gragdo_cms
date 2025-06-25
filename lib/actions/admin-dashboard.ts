import { readData } from '@/lib/db';

export async function getAdminDashboardStats() {
  try {
    const patients = await readData('patients.json');
    const appointments = await readData('appointments.json');
    const doctors = await readData('doctors.json');
    const users = await readData('users.json');
    
    // Filter staff (users with role USER)
    const staff = users.filter(user => user.role === 'USER');
    
    return {
      totalPatients: patients.length,
      appointments: appointments.length,
      doctors: doctors.length,
      staff: staff.length
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return {
      totalPatients: 0,
      appointments: 0,
      doctors: 0,
      staff: 0
    };
  }
}

export async function getAdminDoctors() {
  try {
    const doctors = await readData('doctors.json');
    
    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      isAvailable: doctor.isAvailable,
      avatar: doctor.id === '1' ? 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' : undefined
    }));
  } catch (error) {
    console.error('Error fetching admin doctors:', error);
    return [];
  }
}

export async function getAdminStaff() {
  try {
    const users = await readData('users.json');
    
    // Filter users with role USER
    const staff = users.filter(user => user.role === 'USER');
    
    return staff.map((user, index) => ({
      id: user.id,
      name: user.name,
      role: 'Staff',
      isAvailable: true,
      avatar: index === 0 ? 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' : undefined
    }));
  } catch (error) {
    console.error('Error fetching admin staff:', error);
    return [];
  }
}

export async function getAdminTransactions() {
  try {
    const transactions = await readData('transactions.json');
    
    return transactions.map(transaction => ({
      id: transaction.id,
      doctorName: transaction.doctorName || 'Dr. Unknown',
      testName: transaction.testName || transaction.description,
      date: transaction.date || new Date(transaction.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      amount: transaction.amount
    }));
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return [];
  }
}

export async function getAdminAppointments() {
  try {
    const appointments = await readData('appointments.json');
    const patients = await readData('patients.json');
    
    return appointments.map((appointment, index) => {
      const patient = patients.find(p => p.id === appointment.patientId);
      
      return {
        id: appointment.id,
        sNo: index + 1,
        name: patient?.name || 'Unknown Patient',
        phoneNumber: patient?.phone || 'N/A',
        email: patient?.email || patient?.phone || 'N/A',
        age: patient?.age || 0,
        gender: patient?.gender === 'MALE' ? 'M' : patient?.gender === 'FEMALE' ? 'F' : 'O',
        appointmentDate: new Date(appointment.appointmentDate),
        action: 'Accept' as const
      };
    });
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    return [];
  }
}