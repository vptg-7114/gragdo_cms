import { readData, createItem, updateItem, deleteItem } from '@/lib/db';

export async function getBedsByRoom(roomId: string) {
  try {
    // Try to read from beds.json
    let beds = [];
    try {
      const allBeds = await readData('beds.json');
      beds = allBeds.filter(bed => bed.roomId === roomId);
    } catch (error) {
      // If file doesn't exist, use mock data
      beds = [
        {
          id: '1',
          roomId: roomId,
          bedNumber: 1,
          patientName: 'K. Vijay',
          age: 22,
          gender: 'M',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied'
        },
        {
          id: '2',
          roomId: roomId,
          bedNumber: 2,
          patientName: 'P. Sandeep',
          age: 30,
          gender: 'M',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied'
        },
        {
          id: '3',
          roomId: roomId,
          bedNumber: 3,
          patientName: 'Ch. Asritha',
          age: 25,
          gender: 'F',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied'
        },
        {
          id: '4',
          roomId: roomId,
          bedNumber: 4,
          patientName: 'P. Ravi',
          age: 32,
          gender: 'M',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied'
        },
        {
          id: '5',
          roomId: roomId,
          bedNumber: 5,
          patientName: 'A. Srikanth',
          age: 32,
          gender: 'M',
          admissionDate: '30-05-2025',
          dischargeDate: '05-06-2025',
          status: 'occupied'
        }
      ];
      
      // Create the file with mock data for all rooms
      const allBeds = [];
      for (let i = 1; i <= 5; i++) {
        const roomBeds = beds.map(bed => ({
          ...bed,
          roomId: i.toString(),
          id: `${i}-${bed.id}`
        }));
        allBeds.push(...roomBeds);
      }
      
      const fs = require('fs/promises');
      const path = require('path');
      await fs.writeFile(
        path.join(process.cwd(), 'data/beds.json'),
        JSON.stringify(allBeds, null, 2)
      );
      
      // Filter for the requested room
      beds = allBeds.filter(bed => bed.roomId === roomId);
    }
    
    return beds;
  } catch (error) {
    console.error('Error fetching beds:', error);
    return [];
  }
}

export async function reserveBed(data: {
  roomId: string
  bedNumber: string
  patientFirstName: string
  patientLastName: string
  age: string
  gender: string
  admissionDate: string
}) {
  try {
    const beds = await readData('beds.json');
    const bedIndex = beds.findIndex(
      bed => bed.roomId === data.roomId && bed.bedNumber.toString() === data.bedNumber
    );
    
    if (bedIndex === -1) {
      // Bed not found, create a new one
      const newBed = await createItem('beds.json', {
        roomId: data.roomId,
        bedNumber: parseInt(data.bedNumber),
        patientName: `${data.patientFirstName} ${data.patientLastName}`,
        age: parseInt(data.age),
        gender: data.gender.charAt(0),
        admissionDate: data.admissionDate,
        dischargeDate: '',
        status: 'occupied'
      });
      
      return { success: true, bed: newBed };
    } else {
      // Update existing bed
      const updatedBed = await updateItem('beds.json', beds[bedIndex].id, {
        patientName: `${data.patientFirstName} ${data.patientLastName}`,
        age: parseInt(data.age),
        gender: data.gender.charAt(0),
        admissionDate: data.admissionDate,
        dischargeDate: '',
        status: 'occupied'
      });
      
      return { success: true, bed: updatedBed };
    }
  } catch (error) {
    console.error('Error reserving bed:', error);
    return { success: false, error: 'Failed to reserve bed' };
  }
}

export async function dischargeBed(bedId: string) {
  try {
    const bed = await updateItem('beds.json', bedId, {
      patientName: '',
      age: 0,
      gender: '',
      admissionDate: '',
      dischargeDate: '',
      status: 'available'
    });
    
    if (!bed) {
      return { success: false, error: 'Bed not found' };
    }
    
    return { success: true, bed };
  } catch (error) {
    console.error('Error discharging bed:', error);
    return { success: false, error: 'Failed to discharge bed' };
  }
}