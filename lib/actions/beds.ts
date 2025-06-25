'use server'

import { readData, writeData } from '@/lib/db';

interface Bed {
  id: string;
  bedNumber: number;
  patientName: string;
  age: number;
  gender: string;
  admissionDate: string;
  dischargeDate: string;
  status: 'occupied' | 'available' | 'reserved';
  roomId: string;
}

export async function getBedsByRoom(roomId: string) {
  try {
    const beds = await readData<Bed[]>('beds', []);
    const roomBeds = beds.filter(bed => bed.roomId === roomId);
    
    if (roomBeds.length === 0) {
      // Mock data for beds in a room
      return [
        {
          id: '1',
          bedNumber: 1,
          patientName: 'K. Vijay',
          age: 22,
          gender: 'M',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied',
          roomId
        },
        {
          id: '2',
          bedNumber: 2,
          patientName: 'P. Sandeep',
          age: 30,
          gender: 'M',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied',
          roomId
        },
        {
          id: '3',
          bedNumber: 3,
          patientName: 'Ch. Asritha',
          age: 25,
          gender: 'F',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied',
          roomId
        }
      ];
    }
    
    return roomBeds;
  } catch (error) {
    console.error('Error fetching beds:', error);
    return [];
  }
}

export async function dischargeBed(bedId: string) {
  try {
    const beds = await readData<Bed[]>('beds', []);
    const updatedBeds = beds.map(bed => 
      bed.id === bedId 
        ? { 
            ...bed, 
            status: 'available' as const, 
            patientName: '', 
            age: 0, 
            gender: '', 
            admissionDate: '', 
            dischargeDate: '' 
          }
        : bed
    );
    
    await writeData('beds', updatedBeds);
    return { success: true };
  } catch (error) {
    console.error('Error discharging bed:', error);
    return { success: false, error: 'Failed to discharge bed' };
  }
}