import { readData, createItem, updateItem, deleteItem, findById } from '@/lib/db';

export async function createInvoice(data: {
  patientId: string
  dueDate: string
  items: Array<{
    description: string
    quantity: number
    rate: number
  }>
  notes?: string
}) {
  try {
    // Calculate total amount
    const amount = data.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
    
    // Generate invoice number
    const invoiceNo = `#${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Get patient details
    const patients = await readData('patients.json');
    const patient = patients.find(p => p.id === data.patientId);
    
    const invoice = await createItem('invoices.json', {
      invoiceNo,
      ...data,
      amount,
      status: 'Pending',
      createdDate: new Date().toLocaleDateString('en-GB'),
      patientName: patient?.name || 'Unknown Patient',
      phone: patient?.phone || 'N/A'
    });
    
    return { success: true, invoice };
  } catch (error) {
    console.error('Error creating invoice:', error);
    return { success: false, error: 'Failed to create invoice' };
  }
}

export async function updateInvoice(id: string, data: any) {
  try {
    const invoice = await updateItem('invoices.json', id, data);
    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }
    return { success: true, invoice };
  } catch (error) {
    console.error('Error updating invoice:', error);
    return { success: false, error: 'Failed to update invoice' };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const success = await deleteItem('invoices.json', id);
    if (!success) {
      return { success: false, error: 'Invoice not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return { success: false, error: 'Failed to delete invoice' };
  }
}

export async function getInvoices() {
  try {
    // Try to read from invoices.json
    let invoices = [];
    try {
      invoices = await readData('invoices.json');
    } catch (error) {
      // If file doesn't exist, use mock data
      invoices = [
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
        },
        {
          id: '4',
          invoiceNo: '#454215',
          patientName: 'P. Ravi',
          phone: '9876543210',
          createdDate: '01/06/2025',
          dueDate: '05/06/2025',
          amount: 10000,
          status: 'Pending',
          items: [
            { description: 'Kidney Consultation', quantity: 1, rate: 500, amount: 500 },
            { description: 'Kidney Function Tests', quantity: 1, rate: 9500, amount: 9500 }
          ]
        },
        {
          id: '5',
          invoiceNo: '#498465',
          patientName: 'A. Srikanth',
          phone: '9876543210',
          createdDate: '01/06/2025',
          dueDate: '05/06/2025',
          amount: 10000,
          status: 'Paid',
          items: [
            { description: 'Cardiology Consultation', quantity: 1, rate: 500, amount: 500 },
            { description: 'ECG & Tests', quantity: 1, rate: 9500, amount: 9500 }
          ]
        }
      ];
      
      // Create the file with mock data
      const fs = require('fs/promises');
      const path = require('path');
      await fs.writeFile(
        path.join(process.cwd(), 'data/invoices.json'),
        JSON.stringify(invoices, null, 2)
      );
    }
    
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoices = await getInvoices();
    return invoices.find(invoice => invoice.id === id) || null;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}