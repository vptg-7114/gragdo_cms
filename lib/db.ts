import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'path';

// Define the base path for data files
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure the data directory exists
export async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Generic function to read data from a JSON file
export async function readData<T>(fileName: string, defaultData: T): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, `${fileName}.json`);
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    // If file doesn't exist or has invalid JSON, return default data
    return defaultData;
  }
}

// Generic function to write data to a JSON file
export async function writeData<T>(fileName: string, data: T): Promise<void> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, `${fileName}.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing to ${fileName}.json:`, error);
    throw new Error(`Failed to write data to ${fileName}.json`);
  }
}