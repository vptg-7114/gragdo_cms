'use server'

import { readData, writeData } from '@/lib/db';

interface Invoice {
  id: string;
  invoiceNo: string;
  patientName: string;
  phone: string;
  createdDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

export async function getInvoices() {
  try {
    const invoices = await readData<Invoice[]>('invoices', []);
    
    if (invoices.length === 0) {
      // Mock data for demo purposes
      return [
        {
          id: '1',
          invoiceNo: '#123456',
          patientName: 'K. Vijay',
          phone: '9876543210',
          createdDate: '01/06/2025',
          dueDate: '05/06/2025',
          amount: 10000,
          status: 'Paid',
          items: [
            { description: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 },
            { description: 'Medical Tests', quantity: 1, rate: 9500, amount: 9500 }
          ]
        },
        {
          id: '2',
          invoiceNo: '#454575',
          patientName: 'P. Sandeep',
          phone: '9876543210',
          createdDate: '01/06/2025',
          dueDate: '05/06/2025',
          amount: 10000,
          status: 'Pending',
          items: [
            { description: 'General Checkup', quantity: 1, rate: 300, amount: 300 },
            { description: 'Lab Tests', quantity: 1, rate: 9700, amount: 9700 }
          ]
        },
        {
          id: '3',
          invoiceNo: '#787764',
          patientName: 'Ch. Asritha',
          phone: '9876543210',
          createdDate: '01/06/2025',
          dueDate: '05/06/2025',
          amount: 10000,
          status: 'Overdue',
          items: [
            { description: 'Gynecology Consultation', quantity: 1, rate: 400, amount: 400 },
            { description: 'Ultrasound', quantity: 1, rate: 9600, amount: 9600 }
          ]
        }
      ];
    }
    
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}