// This file contains utilities for working with JSON data files
// We're using the "server-only" package to ensure this code only runs on the server
import "server-only";

// Define the base path for data files
const DATA_DIR = "data";

// Generic function to read data from a JSON file
export async function readData<T>(collection: string, defaultValue: T[] = []): Promise<T[]> {
  try {
    // In a browser environment, we can't use fs directly
    // Instead, we'll use dynamic imports to load JSON files
    let data;
    
    try {
      // Try to dynamically import the JSON file
      const module = await import(`@/data/${collection}.json`);
      data = module.default;
    } catch (error) {
      // If the file doesn't exist, return the default value
      return defaultValue;
    }
    
    return data as T[];
  } catch (error) {
    console.error(`Error reading from ${collection}.json:`, error);
    return defaultValue;
  }
}

// Generic function to write data to a JSON file
export async function writeData<T>(collection: string, data: T[]): Promise<void> {
  try {
    // In a browser environment, we can't write to the file system
    // This is a mock implementation that logs the data
    console.log(`[Mock] Writing to ${collection}.json:`, data);
    
    // In a real implementation with a backend, you would make an API call here
    // For now, we'll just return without actually writing
  } catch (error) {
    console.error(`Error writing to ${collection}.json:`, error);
    throw new Error(`Failed to write data to ${collection}`);
  }
}

// Function to ensure the data directory exists
export async function ensureDataDir(): Promise<void> {
  // This is a no-op in the browser environment
  // In a real implementation with Node.js, you would create the directory
}

// Function to get related data with proper typing
export async function getRelatedData<T, R>(
  collection: string,
  foreignKey: keyof T,
  foreignValue: string,
  defaultValue: R[] = []
): Promise<R[]> {
  try {
    const data = await readData<T>(collection, []);
    return data.filter(item => item[foreignKey] === foreignValue) as unknown as R[];
  } catch (error) {
    console.error(`Error getting related data from ${collection}.json:`, error);
    return defaultValue;
  }
}

// Function to find a record by ID
export async function findById<T extends { id: string }>(
  collection: string,
  id: string
): Promise<T | null> {
  try {
    const data = await readData<T>(collection, []);
    return data.find(item => item.id === id) || null;
  } catch (error) {
    console.error(`Error finding record by ID in ${collection}.json:`, error);
    return null;
  }
}