'use server'

import { readData, writeData, findById } from '@/lib/db';
import { Medicine, MedicineType } from '@/lib/models';
import { createMedicine } from '@/lib/models';

export async function createMedicineRecord(data: {
  name: string;
  manufacturer: string;
  batchNumber: string;
  type: MedicineType;
  dosage: string;
  manufacturedDate: string;
  expiryDate: string;
  price: number;
  stock: number;
  reorderLevel: number;
  clinicId: string;
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    // Generate a unique medicine ID
    const medicineId = `MED${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create medicine object
    const newMedicine = createMedicine({
      name: data.name,
      manufacturer: data.manufacturer,
      batchNumber: data.batchNumber,
      type: data.type,
      dosage: data.dosage,
      manufacturedDate: data.manufacturedDate,
      expiryDate: data.expiryDate,
      price: data.price,
      stock: data.stock,
      reorderLevel: data.reorderLevel,
      clinicId: data.clinicId,
      createdById: data.createdById,
      isActive: true,
      medicineId,
      createdAt: now,
      updatedAt: now
    });
    
    // Save to database
    const medicines = await readData<Medicine[]>("medicines", []);
    medicines.push(newMedicine as any);
    await writeData("medicines", medicines);

    return { success: true, medicine: newMedicine };
  } catch (error) {
    console.error('Error creating medicine:', error);
    return { success: false, error: 'Failed to create medicine' };
  }
}

export async function updateMedicineRecord(id: string, data: {
  name?: string;
  manufacturer?: string;
  batchNumber?: string;
  type?: MedicineType;
  dosage?: string;
  manufacturedDate?: string;
  expiryDate?: string;
  price?: number;
  stock?: number;
  reorderLevel?: number;
  isActive?: boolean;
}) {
  try {
    const medicines = await readData<Medicine[]>("medicines", []);
    const medicineIndex = medicines.findIndex(m => m.id === id);
    
    if (medicineIndex === -1) {
      return { success: false, error: 'Medicine not found' };
    }
    
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const updatedMedicine = {
      ...medicines[medicineIndex],
      ...updatedData
    };
    
    medicines[medicineIndex] = updatedMedicine;
    await writeData("medicines", medicines);
    
    return { success: true, medicine: updatedMedicine };
  } catch (error) {
    console.error('Error updating medicine:', error);
    return { success: false, error: 'Failed to update medicine' };
  }
}

export async function deleteMedicineRecord(id: string) {
  try {
    const medicines = await readData<Medicine[]>("medicines", []);
    
    // Check if medicine is used in any prescription
    const prescriptions = await readData("prescriptions", []);
    const usedInPrescription = prescriptions.some(p => 
      p.medications.some(m => m.medicineId === id)
    );
    
    if (usedInPrescription) {
      return { success: false, error: 'Cannot delete medicine used in prescriptions' };
    }
    
    // Check if medicine is used in any invoice
    const invoices = await readData("invoices", []);
    const usedInInvoice = invoices.some(i => 
      i.items.some(item => item.medicineId === id)
    );
    
    if (usedInInvoice) {
      return { success: false, error: 'Cannot delete medicine used in invoices' };
    }
    
    const updatedMedicines = medicines.filter(m => m.id !== id);
    
    if (updatedMedicines.length === medicines.length) {
      return { success: false, error: 'Medicine not found' };
    }
    
    await writeData("medicines", updatedMedicines);
    return { success: true };
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return { success: false, error: 'Failed to delete medicine' };
  }
}

export async function getMedicines(clinicId?: string, isActive?: boolean) {
  try {
    const medicines = await readData<Medicine[]>("medicines", []);
    
    // Apply filters
    let filteredMedicines = medicines;
    
    if (clinicId) {
      filteredMedicines = filteredMedicines.filter(m => m.clinicId === clinicId);
    }
    
    if (isActive !== undefined) {
      filteredMedicines = filteredMedicines.filter(m => m.isActive === isActive);
    }
    
    // Sort by name
    return filteredMedicines.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }
}

export async function getMedicineById(id: string) {
  try {
    return await findById<Medicine>("medicines", id);
  } catch (error) {
    console.error('Error fetching medicine:', error);
    return null;
  }
}

export async function updateMedicineStock(id: string, quantity: number, isAddition: boolean = true) {
  try {
    const medicines = await readData<Medicine[]>("medicines", []);
    const medicineIndex = medicines.findIndex(m => m.id === id);
    
    if (medicineIndex === -1) {
      return { success: false, error: 'Medicine not found' };
    }
    
    const currentStock = medicines[medicineIndex].stock;
    let newStock;
    
    if (isAddition) {
      newStock = currentStock + quantity;
    } else {
      newStock = currentStock - quantity;
      
      if (newStock < 0) {
        return { success: false, error: 'Insufficient stock' };
      }
    }
    
    const updatedMedicine = {
      ...medicines[medicineIndex],
      stock: newStock,
      updatedAt: new Date().toISOString()
    };
    
    medicines[medicineIndex] = updatedMedicine;
    await writeData("medicines", medicines);
    
    return { success: true, medicine: updatedMedicine };
  } catch (error) {
    console.error('Error updating medicine stock:', error);
    return { success: false, error: 'Failed to update medicine stock' };
  }
}

export async function getLowStockMedicines(clinicId: string) {
  try {
    const medicines = await readData<Medicine[]>("medicines", []);
    
    // Filter by clinic and low stock
    const lowStockMedicines = medicines.filter(m => 
      m.clinicId === clinicId && 
      m.isActive && 
      m.stock <= m.reorderLevel
    );
    
    // Sort by stock level (ascending)
    return lowStockMedicines.sort((a, b) => a.stock - b.stock);
  } catch (error) {
    console.error('Error fetching low stock medicines:', error);
    return [];
  }
}

export async function getExpiringMedicines(clinicId: string, daysThreshold: number = 90) {
  try {
    const medicines = await readData<Medicine[]>("medicines", []);
    
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    // Filter by clinic and expiry date
    const expiringMedicines = medicines.filter(m => {
      if (m.clinicId !== clinicId || !m.isActive) return false;
      
      const expiryDate = new Date(m.expiryDate);
      return expiryDate <= thresholdDate;
    });
    
    // Sort by expiry date (ascending)
    return expiringMedicines.sort((a, b) => 
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );
  } catch (error) {
    console.error('Error fetching expiring medicines:', error);
    return [];
  }
}