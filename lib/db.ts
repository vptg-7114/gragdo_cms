// This file contains utilities for working with JSON data files
// We're using the "server-only" package to ensure this code only runs on the server
import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

// Define the base path for data files
const DATA_DIR = join(process.cwd(), "data");

// Ensure the data directory exists
export async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
}

// Generic function to read data from a JSON file
export async function readData<T>(collection: string): Promise<T[]> {
  try {
    const filePath = join(DATA_DIR, `${collection}.json`);
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data) as T[];
  } catch (error) {
    // If the file doesn't exist or there's an error reading it, return an empty array
    return [];
  }
}

// Generic function to write data to a JSON file
export async function writeData<T>(collection: string, data: T[]): Promise<void> {
  try {
    await ensureDataDir();
    const filePath = join(DATA_DIR, `${collection}.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing to ${collection}.json:`, error);
    throw new Error(`Failed to write data to ${collection}`);
  }
}

// Generic function to find an item by ID
export async function findById<T extends { id: string }>(
  collection: string,
  id: string
): Promise<T | null> {
  const items = await readData<T>(collection);
  return items.find(item => item.id === id) || null;
}

// Generic function to create a new item
export async function createItem<T extends { id?: string }>(
  collection: string,
  data: T
): Promise<T> {
  const items = await readData<T>(collection);
  
  // Generate an ID if one isn't provided
  const newItem = {
    ...data,
    id: data.id || Math.random().toString(36).substring(2, 15),
  } as T;
  
  items.push(newItem);
  await writeData(collection, items);
  return newItem;
}

// Generic function to update an item
export async function updateItem<T extends { id: string }>(
  collection: string,
  id: string,
  data: Partial<T>
): Promise<T | null> {
  const items = await readData<T>(collection);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedItem = { ...items[index], ...data } as T;
  items[index] = updatedItem;
  await writeData(collection, items);
  return updatedItem;
}

// Generic function to delete an item
export async function deleteItem<T extends { id: string }>(
  collection: string,
  id: string
): Promise<boolean> {
  const items = await readData<T>(collection);
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) {
    return false; // Item not found
  }
  
  await writeData(collection, filteredItems);
  return true;
}