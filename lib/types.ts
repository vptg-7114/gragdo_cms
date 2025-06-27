// Define the appointment status enum
export enum AppointmentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// Define the appointment interface
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentDate: string; // ISO string
  duration: number;
  concern: string;
  notes?: string;
  status: AppointmentStatus;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the doctor interface
export interface Doctor {
  id: string;
  name: string;
  email?: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  isAvailable: boolean;
  clinicId: string;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the gender enum
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

// Define the patient interface
export interface Patient {
  id: string;
  patientId: string;
  name: string;
  email?: string;
  phone: string;
  gender: Gender;
  age: number;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  clinicId: string;
  createdById: string;
  createdAt: string; // Store as ISO string
  updatedAt: string; // Store as ISO string
}

// Define the clinic interface
export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the user roles
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  DOCTOR = "DOCTOR"
}

// Define the user interface
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  phone?: string;
  role: UserRole;
  clinicId?: string; // Required for ADMIN, STAFF, DOCTOR roles
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the transaction interface
export interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  paymentStatus: "PAID" | "PENDING" | "CANCELLED";
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  clinicId: string;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the medicine interface
export interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  type: string;
  dosage: string;
  manufacturedDate: string;
  expiryDate: string;
  price: number;
  stock: number;
  clinicId: string;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the treatment interface
export interface Treatment {
  id: string;
  name: string;
  description?: string;
  cost: number;
  duration?: number;
  clinicId: string;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the prescription interface
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  diagnosis: string;
  medications: string;
  instructions?: string;
  followUpDate?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the room interface
export interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  totalBeds: number;
  clinicId: string;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the bed interface
export interface Bed {
  id: string;
  bedNumber: number;
  roomId: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  patientId?: string;
  admissionDate?: string;
  dischargeDate?: string;
  clinicId: string;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}