'use server'

import { readData, writeData, findById } from '@/lib/db';
import { Bed, BedStatus, Room } from '@/lib/models';
import { createBed } from '@/lib/models';

export async function createBedRecord(data: {
  bedNumber: number;
  roomId: string;
  clinicId: string;
  createdById: string;
  notes?: string;
}) {
  try {
    const now = new Date().toISOString();
    
    // Check if room exists
    const room = await findById<Room>("rooms", data.roomId);
    if (!room) {
      return { success: false, error: 'Room not found' };
    }
    
    // Check if bed number already exists in this room
    const beds = await readData<Bed[]>("beds", []);
    const existingBed = beds.find(b => b.roomId === data.roomId && b.bedNumber === data.bedNumber);
    
    if (existingBed) {
      return { success: false, error: 'Bed number already exists in this room' };
    }
    
    // Generate a unique bed ID
    const bedId = `BED${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create bed object
    const newBed = createBed({
      bedNumber: data.bedNumber,
      roomId: data.roomId,
      status: BedStatus.AVAILABLE,
      clinicId: data.clinicId,
      createdById: data.createdById,
      notes: data.notes,
      bedId,
      createdAt: now,
      updatedAt: now
    });
    
    // Save to database
    beds.push(newBed as any);
    await writeData("beds", beds);

    return { success: true, bed: newBed };
  } catch (error) {
    console.error('Error creating bed:', error);
    return { success: false, error: 'Failed to create bed' };
  }
}

export async function updateBedRecord(id: string, data: {
  bedNumber?: number;
  status?: BedStatus;
  notes?: string;
}) {
  try {
    const beds = await readData<Bed[]>("beds", []);
    const bedIndex = beds.findIndex(b => b.id === id);
    
    if (bedIndex === -1) {
      return { success: false, error: 'Bed not found' };
    }
    
    // If changing bed number, check if it already exists in this room
    if (data.bedNumber && data.bedNumber !== beds[bedIndex].bedNumber) {
      const existingBed = beds.find(b => 
        b.roomId === beds[bedIndex].roomId && 
        b.bedNumber === data.bedNumber &&
        b.id !== id
      );
      
      if (existingBed) {
        return { success: false, error: 'Bed number already exists in this room' };
      }
    }
    
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const updatedBed = {
      ...beds[bedIndex],
      ...updatedData
    };
    
    beds[bedIndex] = updatedBed;
    await writeData("beds", beds);
    
    return { success: true, bed: updatedBed };
  } catch (error) {
    console.error('Error updating bed:', error);
    return { success: false, error: 'Failed to update bed' };
  }
}

export async function assignBed(id: string, data: {
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
}) {
  try {
    const beds = await readData<Bed[]>("beds", []);
    const bedIndex = beds.findIndex(b => b.id === id);
    
    if (bedIndex === -1) {
      return { success: false, error: 'Bed not found' };
    }
    
    // Check if bed is available
    if (beds[bedIndex].status !== BedStatus.AVAILABLE) {
      return { success: false, error: 'Bed is not available' };
    }
    
    // Check if patient exists
    const patient = await findById("patients", data.patientId);
    if (!patient) {
      return { success: false, error: 'Patient not found' };
    }
    
    const updatedBed = {
      ...beds[bedIndex],
      status: BedStatus.OCCUPIED,
      patientId: data.patientId,
      admissionDate: data.admissionDate,
      dischargeDate: data.dischargeDate,
      updatedAt: new Date().toISOString()
    };
    
    beds[bedIndex] = updatedBed;
    await writeData("beds", beds);
    
    return { success: true, bed: updatedBed };
  } catch (error) {
    console.error('Error assigning bed:', error);
    return { success: false, error: 'Failed to assign bed' };
  }
}

export async function dischargeBed(id: string) {
  try {
    const beds = await readData<Bed[]>("beds", []);
    const bedIndex = beds.findIndex(b => b.id === id);
    
    if (bedIndex === -1) {
      return { success: false, error: 'Bed not found' };
    }
    
    // Check if bed is occupied
    if (beds[bedIndex].status !== BedStatus.OCCUPIED) {
      return { success: false, error: 'Bed is not occupied' };
    }
    
    const updatedBed = {
      ...beds[bedIndex],
      status: BedStatus.AVAILABLE,
      patientId: undefined,
      admissionDate: undefined,
      dischargeDate: undefined,
      updatedAt: new Date().toISOString()
    };
    
    beds[bedIndex] = updatedBed;
    await writeData("beds", beds);
    
    return { success: true, bed: updatedBed };
  } catch (error) {
    console.error('Error discharging bed:', error);
    return { success: false, error: 'Failed to discharge bed' };
  }
}

export async function reserveBed(id: string) {
  try {
    const beds = await readData<Bed[]>("beds", []);
    const bedIndex = beds.findIndex(b => b.id === id);
    
    if (bedIndex === -1) {
      return { success: false, error: 'Bed not found' };
    }
    
    // Check if bed is available
    if (beds[bedIndex].status !== BedStatus.AVAILABLE) {
      return { success: false, error: 'Bed is not available' };
    }
    
    const updatedBed = {
      ...beds[bedIndex],
      status: BedStatus.RESERVED,
      updatedAt: new Date().toISOString()
    };
    
    beds[bedIndex] = updatedBed;
    await writeData("beds", beds);
    
    return { success: true, bed: updatedBed };
  } catch (error) {
    console.error('Error reserving bed:', error);
    return { success: false, error: 'Failed to reserve bed' };
  }
}

export async function deleteBed(id: string) {
  try {
    const beds = await readData<Bed[]>("beds", []);
    
    // Check if bed is occupied or reserved
    const bed = beds.find(b => b.id === id);
    if (bed && (bed.status === BedStatus.OCCUPIED || bed.status === BedStatus.RESERVED)) {
      return { success: false, error: 'Cannot delete an occupied or reserved bed' };
    }
    
    const updatedBeds = beds.filter(b => b.id !== id);
    
    if (updatedBeds.length === beds.length) {
      return { success: false, error: 'Bed not found' };
    }
    
    await writeData("beds", updatedBeds);
    return { success: true };
  } catch (error) {
    console.error('Error deleting bed:', error);
    return { success: false, error: 'Failed to delete bed' };
  }
}

export async function getBedsByRoom(roomId: string) {
  try {
    const beds = await readData<Bed[]>("beds", []);
    const roomBeds = beds.filter(bed => bed.roomId === roomId);
    
    // Get patient details for occupied beds
    const patients = await readData("patients", []);
    
    const bedsWithPatients = roomBeds.map(bed => {
      if (bed.status === BedStatus.OCCUPIED && bed.patientId) {
        const patient = patients.find(p => p.id === bed.patientId);
        
        return {
          ...bed,
          patient: patient ? {
            id: patient.id,
            patientId: patient.patientId,
            name: `${patient.firstName} ${patient.lastName}`,
            gender: patient.gender,
            age: patient.age
          } : undefined
        };
      }
      
      return bed;
    });
    
    // Sort by bed number
    return bedsWithPatients.sort((a, b) => a.bedNumber - b.bedNumber);
  } catch (error) {
    console.error('Error fetching beds:', error);
    return [];
  }
}

export async function getBedById(id: string) {
  try {
    const bed = await findById<Bed>("beds", id);
    
    if (!bed) {
      return null;
    }
    
    // Get patient details if bed is occupied
    let patient;
    if (bed.status === BedStatus.OCCUPIED && bed.patientId) {
      patient = await findById("patients", bed.patientId);
    }
    
    // Get room details
    const room = await findById("rooms", bed.roomId);
    
    return {
      ...bed,
      patient: patient ? {
        id: patient.id,
        patientId: patient.patientId,
        name: `${patient.firstName} ${patient.lastName}`,
        gender: patient.gender,
        age: patient.age
      } : undefined,
      room: room ? {
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType
      } : undefined
    };
  } catch (error) {
    console.error('Error fetching bed:', error);
    return null;
  }
}