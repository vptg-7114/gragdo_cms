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
    const amount = data.items.reduce((total, item) => total + (item.quantity * item.rate), 0)
    
    // Generate invoice number
    const invoiceNo = `#${Math.floor(100000 + Math.random() * 900000)}`
    
    // In a real app, you would save to database
    const invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo,
      ...data,
      amount,
      status: 'Pending' as const,
      createdDate: new Date().toLocaleDateString('en-GB'),
    }

    return { success: true, invoice }
  } catch (error) {
    console.error('Error creating invoice:', error)
    return { success: false, error: 'Failed to create invoice' }
  }
}

export async function updateInvoice(id: string, data: any) {
  try {
    // In a real app, you would update in database
    console.log('Updating invoice:', id, data)
    return { success: true }
  } catch (error) {
    console.error('Error updating invoice:', error)
    return { success: false, error: 'Failed to update invoice' }
  }
}

export async function deleteInvoice(id: string) {
  try {
    // In a real app, you would delete from database
    console.log('Deleting invoice:', id)
    return { success: true }
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return { success: false, error: 'Failed to delete invoice' }
  }
}

export async function getInvoices() {
  try {
    // Mock data for demo purposes
    const mockInvoices = [
      {
        id: '1',
        invoiceNo: '#123456',
        patientName: 'K. Vijay',
        phone: '9876543210',
        createdDate: '01/06/2025',
        dueDate: '05/06/2025',
        amount: 10000,
        status: 'Paid' as const,
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
        status: 'Pending' as const,
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
        status: 'Overdue' as const,
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
        status: 'Pending' as const,
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
        status: 'Paid' as const,
        items: [
          { description: 'Cardiology Consultation', quantity: 1, rate: 500, amount: 500 },
          { description: 'ECG & Tests', quantity: 1, rate: 9500, amount: 9500 }
        ]
      },
      {
        id: '6',
        invoiceNo: '#454215',
        patientName: 'P. Ravi',
        phone: '9876543210',
        createdDate: '01/06/2025',
        dueDate: '05/06/2025',
        amount: 10000,
        status: 'Overdue' as const,
        items: [
          { description: 'Follow-up Consultation', quantity: 1, rate: 300, amount: 300 },
          { description: 'Additional Tests', quantity: 1, rate: 9700, amount: 9700 }
        ]
      },
      {
        id: '7',
        invoiceNo: '#498465',
        patientName: 'A. Srikanth',
        phone: '9876543210',
        createdDate: '01/06/2025',
        dueDate: '05/06/2025',
        amount: 10000,
        status: 'Paid' as const,
        items: [
          { description: 'Heart Checkup', quantity: 1, rate: 600, amount: 600 },
          { description: 'Stress Test', quantity: 1, rate: 9400, amount: 9400 }
        ]
      },
      {
        id: '8',
        invoiceNo: '#454215',
        patientName: 'P. Ravi',
        phone: '9876543210',
        createdDate: '01/06/2025',
        dueDate: '05/06/2025',
        amount: 10000,
        status: 'Pending' as const,
        items: [
          { description: 'Routine Checkup', quantity: 1, rate: 400, amount: 400 },
          { description: 'Blood Work', quantity: 1, rate: 9600, amount: 9600 }
        ]
      },
      {
        id: '9',
        invoiceNo: '#498465',
        patientName: 'A. Srikanth',
        phone: '9876543210',
        createdDate: '01/06/2025',
        dueDate: '05/06/2025',
        amount: 10000,
        status: 'Paid' as const,
        items: [
          { description: 'Cardiac Assessment', quantity: 1, rate: 700, amount: 700 },
          { description: 'Advanced Tests', quantity: 1, rate: 9300, amount: 9300 }
        ]
      },
      {
        id: '10',
        invoiceNo: '#454215',
        patientName: 'P. Ravi',
        phone: '9876543210',
        createdDate: '01/06/2025',
        dueDate: '05/06/2025',
        amount: 10000,
        status: 'Pending' as const,
        items: [
          { description: 'Monthly Checkup', quantity: 1, rate: 350, amount: 350 },
          { description: 'Lab Analysis', quantity: 1, rate: 9650, amount: 9650 }
        ]
      }
    ]

    return mockInvoices
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoices = await getInvoices()
    return invoices.find(invoice => invoice.id === id) || null
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return null
  }
}