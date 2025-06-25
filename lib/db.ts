import fs from 'fs/promises';
import path from 'path';

// Define the base path for data files
const DATA_DIR = path.join(process.cwd(), 'data');

// Generic function to read data from a JSON file
export async function readData<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading data from ${filename}:`, error);
    return [];
  }
}

// Generic function to write data to a JSON file
export async function writeData<T>(filename: string, data: T[]): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing data to ${filename}:`, error);
    return false;
  }
}

// Generic function to find an item by ID
export async function findById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<T | null> {
  const items = await readData<T>(filename);
  return items.find(item => item.id === id) || null;
}

// Generic function to find items by a field value
export async function findByField<T>(
  filename: string,
  field: keyof T,
  value: any
): Promise<T[]> {
  const items = await readData<T>(filename);
  return items.filter(item => item[field] === value);
}

// Generic function to create a new item
export async function createItem<T extends { id?: string }>(
  filename: string,
  data: T
): Promise<T> {
  const items = await readData<T>(filename);
  
  // Generate a new ID if not provided
  const newItem = {
    ...data,
    id: data.id || Math.random().toString(36).substring(2, 11),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as T;
  
  items.push(newItem);
  await writeData(filename, items);
  
  return newItem;
}

// Generic function to update an item
export async function updateItem<T extends { id: string }>(
  filename: string,
  id: string,
  data: Partial<T>
): Promise<T | null> {
  const items = await readData<T>(filename);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const updatedItem = {
    ...items[index],
    ...data,
    updatedAt: new Date().toISOString()
  } as T;
  
  items[index] = updatedItem;
  await writeData(filename, items);
  
  return updatedItem;
}

// Generic function to delete an item
export async function deleteItem<T extends { id: string }>(
  filename: string,
  id: string
): Promise<boolean> {
  const items = await readData<T>(filename);
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  await writeData(filename, filteredItems);
  return true;
}

// Generate a unique ID for a patient
export function generateId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Define common types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AppointmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED';
export type TransactionType = 'INCOME' | 'EXPENSE';