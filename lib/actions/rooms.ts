'use server'

import { readData, writeData, findById } from '@/lib/db';
import { Room, RoomType } from '@/lib/models';
import { createRoom } from '@/lib/models';

export async function createRoomRecord(data: {
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  totalBeds: number;
  clinicId: string;
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    // Check if room number already exists in this clinic
    const rooms = await readData<Room[]>("rooms", []);
    const existingRoom = rooms.find(r => r.clinicId === data.clinicId && r.roomNumber === data.roomNumber);
    
    if (existingRoom) {
      return { success: false, error: 'Room number already exists in this clinic' };
    }
    
    // Generate a unique room ID
    const roomId = `ROOM${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create room object
    const newRoom = createRoom({
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      floor: data.floor,
      totalBeds: data.totalBeds,
      clinicId: data.clinicId,
      createdById: data.createdById,
      isActive: true,
      roomId,
      createdAt: now,
      updatedAt: now
    });
    
    // Save to database
    rooms.push(newRoom as any);
    await writeData("rooms", rooms);

    return { success: true, room: newRoom };
  } catch (error) {
    console.error('Error creating room:', error);
    return { success: false, error: 'Failed to create room' };
  }
}

export async function updateRoomRecord(id: string, data: {
  roomNumber?: string;
  roomType?: RoomType;
  floor?: number;
  totalBeds?: number;
  isActive?: boolean;
}) {
  try {
    const rooms = await readData<Room[]>("rooms", []);
    const roomIndex = rooms.findIndex(r => r.id === id);
    
    if (roomIndex === -1) {
      return { success: false, error: 'Room not found' };
    }
    
    // If changing room number, check if it already exists in this clinic
    if (data.roomNumber && data.roomNumber !== rooms[roomIndex].roomNumber) {
      const existingRoom = rooms.find(r => 
        r.clinicId === rooms[roomIndex].clinicId && 
        r.roomNumber === data.roomNumber &&
        r.id !== id
      );
      
      if (existingRoom) {
        return { success: false, error: 'Room number already exists in this clinic' };
      }
    }
    
    // If reducing total beds, check if there are more beds than the new total
    if (data.totalBeds && data.totalBeds < rooms[roomIndex].totalBeds) {
      const beds = await readData("beds", []);
      const roomBeds = beds.filter(b => b.roomId === id);
      
      if (roomBeds.length > data.totalBeds) {
        return { success: false, error: 'Cannot reduce total beds below the number of existing beds' };
      }
    }
    
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const updatedRoom = {
      ...rooms[roomIndex],
      ...updatedData
    };
    
    rooms[roomIndex] = updatedRoom;
    await writeData("rooms", rooms);
    
    return { success: true, room: updatedRoom };
  } catch (error) {
    console.error('Error updating room:', error);
    return { success: false, error: 'Failed to update room' };
  }
}

export async function deleteRoomRecord(id: string) {
  try {
    // Check if room has beds
    const beds = await readData("beds", []);
    const roomBeds = beds.filter(b => b.roomId === id);
    
    if (roomBeds.length > 0) {
      return { success: false, error: 'Cannot delete a room with beds. Delete the beds first.' };
    }
    
    const rooms = await readData<Room[]>("rooms", []);
    const updatedRooms = rooms.filter(r => r.id !== id);
    
    if (updatedRooms.length === rooms.length) {
      return { success: false, error: 'Room not found' };
    }
    
    await writeData("rooms", updatedRooms);
    return { success: true };
  } catch (error) {
    console.error('Error deleting room:', error);
    return { success: false, error: 'Failed to delete room' };
  }
}

export async function getRooms(clinicId?: string, isActive?: boolean) {
  try {
    const rooms = await readData<Room[]>("rooms", []);
    
    // Apply filters
    let filteredRooms = rooms;
    
    if (clinicId) {
      filteredRooms = filteredRooms.filter(r => r.clinicId === clinicId);
    }
    
    if (isActive !== undefined) {
      filteredRooms = filteredRooms.filter(r => r.isActive === isActive);
    }
    
    // Get bed counts for each room
    const beds = await readData("beds", []);
    
    const roomsWithBedCounts = filteredRooms.map(room => {
      const roomBeds = beds.filter(b => b.roomId === room.id);
      const availableBeds = roomBeds.filter(b => b.status === BedStatus.AVAILABLE).length;
      const occupiedBeds = roomBeds.filter(b => b.status === BedStatus.OCCUPIED).length;
      const reservedBeds = roomBeds.filter(b => b.status === BedStatus.RESERVED).length;
      
      return {
        ...room,
        bedCounts: {
          total: roomBeds.length,
          available: availableBeds,
          occupied: occupiedBeds,
          reserved: reservedBeds
        }
      };
    });
    
    // Sort by floor and room number
    return roomsWithBedCounts.sort((a, b) => {
      if (a.floor !== b.floor) {
        return a.floor - b.floor;
      }
      return a.roomNumber.localeCompare(b.roomNumber);
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

export async function getRoomById(id: string) {
  try {
    const room = await findById<Room>("rooms", id);
    
    if (!room) {
      return null;
    }
    
    // Get beds for this room
    const beds = await readData("beds", []);
    const roomBeds = beds.filter(b => b.roomId === id);
    
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
    
    return {
      ...room,
      beds: bedsWithPatients.sort((a, b) => a.bedNumber - b.bedNumber),
      bedCounts: {
        total: roomBeds.length,
        available: roomBeds.filter(b => b.status === BedStatus.AVAILABLE).length,
        occupied: roomBeds.filter(b => b.status === BedStatus.OCCUPIED).length,
        reserved: roomBeds.filter(b => b.status === BedStatus.RESERVED).length
      }
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}