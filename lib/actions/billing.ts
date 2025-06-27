'use server'

import { readData, writeData, findById } from '@/lib/db';
import { Invoice, InvoiceStatus, InvoiceItem, InvoiceItemType, Transaction, TransactionType, PaymentMethod, PaymentStatus } from '@/lib/models';
import { createInvoice, createTransaction } from '@/lib/models';
import { uploadFile, deleteFile, generateFileKey } from '@/lib/services/s3';

interface InvoiceWithDetails extends Invoice {
  patientName?: string;
  patientPhone?: string;
  patient?: any;
  appointment?: any;
  transactions?: Transaction[];
}

export async function createInvoiceRecord(data: {
  patientId: string;
  clinicId: string;
  appointmentId?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    type: InvoiceItemType;
    medicineId?: string;
    treatmentId?: string;
  }[];
  discount: number;
  tax: number;
  dueDate: string;
  notes?: string;
  createdById: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const now = new Date().toISOString();
    
    // Generate a unique invoice ID
    const invoiceId = `INV${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Calculate amounts
    const items: InvoiceItem[] = data.items.map(item => ({
      id: `item-${Math.random().toString(36).substring(2, 10)}`,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
      type: item.type,
      medicineId: item.medicineId,
      treatmentId: item.treatmentId
    }));
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal - data.discount + data.tax;
    
    // Process document if provided
    let documentUrl;
    if (data.document) {
      const key = generateFileKey('invoices', `invoice_${invoiceId}.pdf`);
      documentUrl = await uploadFile(data.document.file, key, data.document.contentType);
    }
    
    // Create invoice object
    const newInvoice = createInvoice({
      patientId: data.patientId,
      clinicId: data.clinicId,
      appointmentId: data.appointmentId,
      items,
      subtotal,
      discount: data.discount,
      tax: data.tax,
      total,
      dueDate: data.dueDate,
      status: InvoiceStatus.SENT,
      notes: data.notes,
      createdById: data.createdById,
      documentUrl,
      invoiceId,
      createdAt: now,
      updatedAt: now
    });
    
    // Save to database
    const invoices = await readData<Invoice[]>("invoices", []);
    invoices.push(newInvoice as any);
    await writeData("invoices", invoices);

    return { success: true, invoice: newInvoice };
  } catch (error) {
    console.error('Error creating invoice:', error);
    return { success: false, error: 'Failed to create invoice' };
  }
}

export async function updateInvoiceRecord(id: string, data: {
  items?: {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    type: InvoiceItemType;
    medicineId?: string;
    treatmentId?: string;
  }[];
  discount?: number;
  tax?: number;
  dueDate?: string;
  status?: InvoiceStatus;
  notes?: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const invoices = await readData<Invoice[]>("invoices", []);
    const invoiceIndex = invoices.findIndex(i => i.id === id);
    
    if (invoiceIndex === -1) {
      return { success: false, error: 'Invoice not found' };
    }
    
    const now = new Date().toISOString();
    
    // Process document if provided
    let documentUrl = invoices[invoiceIndex].documentUrl;
    if (data.document) {
      // Delete old document if it exists
      if (documentUrl) {
        try {
          const urlParts = new URL(documentUrl);
          const key = urlParts.pathname.substring(1); // Remove leading slash
          await deleteFile(key);
        } catch (error) {
          console.error('Error deleting old invoice document:', error);
          // Continue even if deletion fails
        }
      }
      
      // Upload new document
      const key = generateFileKey('invoices', `invoice_${invoices[invoiceIndex].invoiceId}.pdf`);
      documentUrl = await uploadFile(data.document.file, key, data.document.contentType);
    }
    
    // Calculate amounts if items are updated
    let items = invoices[invoiceIndex].items;
    let subtotal = invoices[invoiceIndex].subtotal;
    let discount = data.discount !== undefined ? data.discount : invoices[invoiceIndex].discount;
    let tax = data.tax !== undefined ? data.tax : invoices[invoiceIndex].tax;
    
    if (data.items) {
      items = data.items.map(item => ({
        id: item.id || `item-${Math.random().toString(36).substring(2, 10)}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice,
        type: item.type,
        medicineId: item.medicineId,
        treatmentId: item.treatmentId
      }));
      
      subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    }
    
    const total = subtotal - discount + tax;
    
    const updatedData = {
      ...data,
      items,
      subtotal,
      discount,
      tax,
      total,
      documentUrl,
      updatedAt: now
    };
    
    const updatedInvoice = {
      ...invoices[invoiceIndex],
      ...updatedData
    };
    
    invoices[invoiceIndex] = updatedInvoice;
    await writeData("invoices", invoices);
    
    return { success: true, invoice: updatedInvoice };
  } catch (error) {
    console.error('Error updating invoice:', error);
    return { success: false, error: 'Failed to update invoice' };
  }
}

export async function deleteInvoiceRecord(id: string) {
  try {
    const invoices = await readData<Invoice[]>("invoices", []);
    const invoice = invoices.find(i => i.id === id);
    
    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }
    
    // Check if invoice has associated transactions
    const transactions = await readData("transactions", []);
    const invoiceTransactions = transactions.filter(t => t.invoiceId === id);
    
    if (invoiceTransactions.length > 0) {
      return { success: false, error: 'Cannot delete invoice with associated transactions' };
    }
    
    // Delete document from S3 if it exists
    if (invoice.documentUrl) {
      try {
        const urlParts = new URL(invoice.documentUrl);
        const key = urlParts.pathname.substring(1); // Remove leading slash
        await deleteFile(key);
      } catch (error) {
        console.error('Error deleting invoice document:', error);
        // Continue even if deletion fails
      }
    }
    
    // Remove invoice from database
    const updatedInvoices = invoices.filter(i => i.id !== id);
    await writeData("invoices", updatedInvoices);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return { success: false, error: 'Failed to delete invoice' };
  }
}

export async function getInvoices(clinicId?: string, patientId?: string, status?: InvoiceStatus) {
  try {
    const invoices = await readData<Invoice[]>("invoices", []);
    
    // Apply filters
    let filteredInvoices = invoices;
    
    if (clinicId) {
      filteredInvoices = filteredInvoices.filter(i => i.clinicId === clinicId);
    }
    
    if (patientId) {
      filteredInvoices = filteredInvoices.filter(i => i.patientId === patientId);
    }
    
    if (status) {
      filteredInvoices = filteredInvoices.filter(i => i.status === status);
    }
    
    // Get patient details
    const patients = await readData("patients", []);
    
    const invoicesWithPatients = filteredInvoices.map(invoice => {
      const patient = patients.find(p => p.id === invoice.patientId);
      
      return {
        ...invoice,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
        patientPhone: patient?.phone || 'N/A'
      };
    });
    
    // Sort by createdAt in descending order
    return invoicesWithPatients.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) as InvoiceWithDetails[];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoice = await findById<Invoice>("invoices", id);
    
    if (!invoice) {
      return null;
    }
    
    // Get patient details
    const patient = await findById("patients", invoice.patientId);
    
    // Get appointment details if available
    let appointment;
    if (invoice.appointmentId) {
      appointment = await findById("appointments", invoice.appointmentId);
    }
    
    // Get transactions for this invoice
    const transactions = await readData("transactions", []);
    const invoiceTransactions = transactions
      .filter(t => t.invoiceId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      ...invoice,
      patient,
      appointment,
      transactions: invoiceTransactions
    } as InvoiceWithDetails;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export async function recordPayment(data: {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  patientId: string;
  clinicId: string;
  createdById: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const now = new Date().toISOString();
    
    // Check if invoice exists
    const invoice = await findById<Invoice>("invoices", data.invoiceId);
    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }
    
    // Process receipt document if provided
    let receiptUrl;
    if (data.document) {
      const key = generateFileKey('receipts', `receipt_${Math.random().toString(36).substring(2, 10)}.pdf`);
      receiptUrl = await uploadFile(data.document.file, key, data.document.contentType);
    }
    
    // Generate a unique transaction ID
    const transactionId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create transaction object
    const newTransaction = createTransaction({
      amount: data.amount,
      type: TransactionType.INCOME,
      description: data.description,
      paymentMethod: data.paymentMethod,
      paymentStatus: PaymentStatus.PAID,
      invoiceId: data.invoiceId,
      patientId: data.patientId,
      clinicId: data.clinicId,
      createdById: data.createdById,
      receiptUrl,
      transactionId,
      createdAt: now,
      updatedAt: now
    });
    
    // Save transaction to database
    const transactions = await readData<Transaction[]>("transactions", []);
    transactions.push(newTransaction as any);
    await writeData("transactions", transactions);
    
    // Update invoice status
    const invoices = await readData<Invoice[]>("invoices", []);
    const invoiceIndex = invoices.findIndex(i => i.id === data.invoiceId);
    
    if (invoiceIndex !== -1) {
      // Calculate total paid amount
      const paidAmount = transactions
        .filter(t => t.invoiceId === data.invoiceId && t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0) + data.amount;
      
      // Determine new status
      let newStatus;
      if (paidAmount >= invoice.total) {
        newStatus = InvoiceStatus.PAID;
      } else if (paidAmount > 0) {
        newStatus = InvoiceStatus.PARTIALLY_PAID;
      } else {
        newStatus = invoice.status;
      }
      
      const updatedInvoice = {
        ...invoices[invoiceIndex],
        status: newStatus,
        updatedAt: now
      };
      
      invoices[invoiceIndex] = updatedInvoice;
      await writeData("invoices", invoices);
    }
    
    return { success: true, transaction: newTransaction };
  } catch (error) {
    console.error('Error recording payment:', error);
    return { success: false, error: 'Failed to record payment' };
  }
}

export async function getTransactions(clinicId?: string, patientId?: string, type?: TransactionType) {
  try {
    const transactions = await readData<Transaction[]>("transactions", []);
    
    // Apply filters
    let filteredTransactions = transactions;
    
    if (clinicId) {
      filteredTransactions = filteredTransactions.filter(t => t.clinicId === clinicId);
    }
    
    if (patientId) {
      filteredTransactions = filteredTransactions.filter(t => t.patientId === patientId);
    }
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    // Get patient and invoice details
    const patients = await readData("patients", []);
    const invoices = await readData("invoices", []);
    
    const transactionsWithDetails = filteredTransactions.map(transaction => {
      const patient = transaction.patientId ? patients.find(p => p.id === transaction.patientId) : undefined;
      const invoice = transaction.invoiceId ? invoices.find(i => i.id === transaction.invoiceId) : undefined;
      
      return {
        ...transaction,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : undefined,
        invoiceNumber: invoice?.invoiceId
      };
    });
    
    // Sort by createdAt in descending order
    return transactionsWithDetails.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getTransactionById(id: string) {
  try {
    const transaction = await findById<Transaction>("transactions", id);
    
    if (!transaction) {
      return null;
    }
    
    // Get related details
    const patient = transaction.patientId ? await findById("patients", transaction.patientId) : undefined;
    const invoice = transaction.invoiceId ? await findById("invoices", transaction.invoiceId) : undefined;
    
    return {
      ...transaction,
      patient,
      invoice
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}