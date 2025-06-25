'use server'

import { readData } from '@/lib/db';

export async function getAdminDashboardStats() {
  try {
    const patients = await readData('patients', []);
    const appointments = await readData('appointments', []);
    const doctors = await readData('doctors', []);
    const staff = await readData('staff', []);
    
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
    ];
  } catch (error) {
    console.error('Error fetching admin doctors:', error);
    return [];
  }
}

export async function getAdminStaff() {
  try {
    const staff = await readData('staff', []);
    if (staff.length === 0) {
      // Mock data for staff list - expanded to match the image
      return [
        {
          id: '1',
          name: 'K. Vijay',
          role: 'Apprentice',
          isAvailable: true,
          avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
        },
        {
          id: '2',
          name: 'P. Sandeep',
          role: 'Compounder',
          isAvailable: true
        },
        {
          id: '3',
          name: 'Ch. Asritha',
          role: 'Nurse',
          isAvailable: true
        },
        {
          id: '4',
          name: 'P. Ravi',
          role: 'Compounder',
          isAvailable: true
        },
        {
          id: '5',
          name: 'A. Srikanth',
          role: 'Intern',
          isAvailable: true
        }
      ];
    }
    return staff;
  } catch (error) {
    console.error('Error fetching admin staff:', error);
    return [];
  }
}

export async function getAdminTransactions() {
  try {
    const transactions = await readData('transactions', []);
    if (transactions.length === 0) {
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
        }
      ];
    }
    return transactions;
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return [];
  }
}

export async function getAdminAppointments() {
  try {
    const appointments = await readData('appointments', []);
    if (appointments.length === 0) {
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
          action: 'Accept'
        },
        {
          id: '2',
          sNo: 2,
          name: 'P. Sandeep',
          phoneNumber: '9876543210',
          email: '9876543210',
          age: 30,
          gender: 'M',
          action: 'Accept'
        },
        {
          id: '3',
          sNo: 3,
          name: 'Ch. Asritha',
          phoneNumber: '9876543210',
          email: '9876543210',
          age: 25,
          gender: 'F',
          action: 'Accept'
        },
        {
          id: '4',
          sNo: 4,
          name: 'P. Ravi',
          phoneNumber: '9876543210',
          email: '9876543210',
          age: 32,
          gender: 'M',
          action: 'Accept'
        },
        {
          id: '5',
          sNo: 5,
          name: 'K. Arun',
          phoneNumber: '9876543210',
          email: '9876543210',
          age: 32,
          gender: 'M',
          action: 'Accept'
        }
      ];
    }
    return appointments;
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    return [];
  }
}