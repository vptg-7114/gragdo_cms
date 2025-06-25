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