'use server'

import { readData, writeData, findById } from '@/lib/db';
import { Transaction, TransactionType, PaymentMethod, PaymentStatus } from '@/lib/models';
import { createTransaction } from '@/lib/models';
import { uploadFile, deleteFile, generateFileKey } from '@/lib/services/s3';

export async function createTransactionRecord(data: {
  amount: number;
  type: TransactionType;
  description: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  invoiceId?: string;
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  clinicId: string;
  createdById: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const now = new Date().toISOString();
    
    // Generate a unique transaction ID
    const transactionId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Process receipt document if provided
    let receiptUrl;
    if (data.document) {
      const key = generateFileKey('receipts', `receipt_${transactionId}.pdf`);
      receiptUrl = await uploadFile(data.document.file, key, data.document.contentType);
    }
    
    // Create transaction object
    const newTransaction = createTransaction({
      amount: data.amount,
      type: data.type,
      description: data.description,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      invoiceId: data.invoiceId,
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      clinicId: data.clinicId,
      createdById: data.createdById,
      receiptUrl,
      transactionId,
      createdAt: now,
      updatedAt: now
    });
    
    // Save to database
    const transactions = await readData<Transaction[]>("transactions", []);
    transactions.push(newTransaction as any);
    await writeData("transactions", transactions);
    
    // If this is a payment for an invoice, update the invoice status
    if (data.invoiceId && data.type === TransactionType.INCOME) {
      const invoices = await readData("invoices", []);
      const invoiceIndex = invoices.findIndex(i => i.id === data.invoiceId);
      
      if (invoiceIndex !== -1) {
        const invoice = invoices[invoiceIndex];
        
        // Calculate total paid amount
        const paidAmount = transactions
          .filter(t => t.invoiceId === data.invoiceId && t.type === TransactionType.INCOME)
          .reduce((sum, t) => sum + t.amount, 0) + data.amount;
        
        // Determine new status
        let newStatus;
        if (paidAmount >= invoice.total) {
          newStatus = 'PAID';
        } else if (paidAmount > 0) {
          newStatus = 'PARTIALLY_PAID';
        } else {
          newStatus = invoice.status;
        }
        
        const updatedInvoice = {
          ...invoice,
          status: newStatus,
          updatedAt: now
        };
        
        invoices[invoiceIndex] = updatedInvoice;
        await writeData("invoices", invoices);
      }
    }

    return { success: true, transaction: newTransaction };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error: 'Failed to create transaction' };
  }
}

export async function updateTransactionRecord(id: string, data: {
  description?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const transactions = await readData<Transaction[]>("transactions", []);
    const transactionIndex = transactions.findIndex(t => t.id === id);
    
    if (transactionIndex === -1) {
      return { success: false, error: 'Transaction not found' };
    }
    
    const now = new Date().toISOString();
    
    // Process receipt document if provided
    let receiptUrl = transactions[transactionIndex].receiptUrl;
    if (data.document) {
      // Delete old receipt if it exists
      if (receiptUrl) {
        try {
          const urlParts = new URL(receiptUrl);
          const key = urlParts.pathname.substring(1); // Remove leading slash
          await deleteFile(key);
        } catch (error) {
          console.error('Error deleting old receipt:', error);
          // Continue even if deletion fails
        }
      }
      
      // Upload new receipt
      const key = generateFileKey('receipts', `receipt_${transactions[transactionIndex].transactionId}.pdf`);
      receiptUrl = await uploadFile(data.document.file, key, data.document.contentType);
    }
    
    const updatedData = {
      ...data,
      receiptUrl,
      updatedAt: now
    };
    
    const updatedTransaction = {
      ...transactions[transactionIndex],
      ...updatedData
    };
    
    transactions[transactionIndex] = updatedTransaction;
    await writeData("transactions", transactions);
    
    return { success: true, transaction: updatedTransaction };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { success: false, error: 'Failed to update transaction' };
  }
}

export async function deleteTransactionRecord(id: string) {
  try {
    const transactions = await readData<Transaction[]>("transactions", []);
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      return { success: false, error: 'Transaction not found' };
    }
    
    // Delete receipt from S3 if it exists
    if (transaction.receiptUrl) {
      try {
        const urlParts = new URL(transaction.receiptUrl);
        const key = urlParts.pathname.substring(1); // Remove leading slash
        await deleteFile(key);
      } catch (error) {
        console.error('Error deleting receipt:', error);
        // Continue even if deletion fails
      }
    }
    
    // Remove transaction from database
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await writeData("transactions", updatedTransactions);
    
    // If this was a payment for an invoice, update the invoice status
    if (transaction.invoiceId && transaction.type === TransactionType.INCOME) {
      const invoices = await readData("invoices", []);
      const invoiceIndex = invoices.findIndex(i => i.id === transaction.invoiceId);
      
      if (invoiceIndex !== -1) {
        const invoice = invoices[invoiceIndex];
        
        // Calculate total paid amount (excluding this transaction)
        const paidAmount = updatedTransactions
          .filter(t => t.invoiceId === transaction.invoiceId && t.type === TransactionType.INCOME)
          .reduce((sum, t) => sum + t.amount, 0);
        
        // Determine new status
        let newStatus;
        if (paidAmount >= invoice.total) {
          newStatus = 'PAID';
        } else if (paidAmount > 0) {
          newStatus = 'PARTIALLY_PAID';
        } else {
          newStatus = 'SENT';
        }
        
        const updatedInvoice = {
          ...invoice,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        
        invoices[invoiceIndex] = updatedInvoice;
        await writeData("invoices", invoices);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error: 'Failed to delete transaction' };
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
    const doctors = await readData("doctors", []);
    
    const transactionsWithDetails = filteredTransactions.map(transaction => {
      const patient = transaction.patientId ? patients.find(p => p.id === transaction.patientId) : undefined;
      const invoice = transaction.invoiceId ? invoices.find(i => i.id === transaction.invoiceId) : undefined;
      const doctor = transaction.doctorId ? doctors.find(d => d.id === transaction.doctorId) : undefined;
      
      return {
        ...transaction,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : undefined,
        invoiceNumber: invoice?.invoiceId,
        doctorName: doctor?.name
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
    const doctor = transaction.doctorId ? await findById("doctors", transaction.doctorId) : undefined;
    
    return {
      ...transaction,
      patient,
      invoice,
      doctor
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

export async function getTransactionSummary(clinicId: string, period: 'day' | 'week' | 'month' | 'year' = 'month') {
  try {
    const transactions = await readData<Transaction[]>("transactions", []);
    
    // Filter by clinic
    const clinicTransactions = transactions.filter(t => t.clinicId === clinicId);
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    // Filter by date range
    const periodTransactions = clinicTransactions.filter(t => 
      new Date(t.createdAt) >= startDate
    );
    
    // Calculate totals
    const income = periodTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = periodTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const refund = periodTransactions
      .filter(t => t.type === TransactionType.REFUND)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const net = income - expense - refund;
    
    // Group by payment method (for income only)
    const paymentMethods = {};
    periodTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .forEach(t => {
        const method = t.paymentMethod;
        paymentMethods[method] = (paymentMethods[method] || 0) + t.amount;
      });
    
    return {
      period,
      income,
      expense,
      refund,
      net,
      paymentMethods,
      transactionCount: periodTransactions.length
    };
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return {
      period,
      income: 0,
      expense: 0,
      refund: 0,
      net: 0,
      paymentMethods: {},
      transactionCount: 0
    };
  }
}