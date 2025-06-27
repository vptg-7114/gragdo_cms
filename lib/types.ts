// Define the appointment status enum
export enum AppointmentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// Define the gender enum
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

// Define the user roles
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  DOCTOR = "DOCTOR"
}

// Define the base model interface with common fields
interface BaseModel {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the user interface
export interface User extends BaseModel {
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  phone?: string;
  role: UserRole;
  clinicId?: string; // Required for ADMIN, STAFF, DOCTOR roles
  clinicIds?: string[]; // Array of clinic IDs for SUPER_ADMIN role
  isActive: boolean;
}

// Define the clinic interface
export interface Clinic extends BaseModel {
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  // Relationships
  admins?: User[]; // ADMIN users associated with this clinic
  doctors?: Doctor[]; // Doctors associated with this clinic
  staff?: User[]; // STAFF users associated with this clinic
  patients?: Patient[]; // Patients associated with this clinic
}

// Define the doctor interface
export interface Doctor extends BaseModel {
  userId: string; // Reference to User with role DOCTOR
  name: string;
  email?: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  isAvailable: boolean;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this doctor
  // Relationships
  user?: User; // The user account associated with this doctor
  clinic?: Clinic; // The clinic this doctor belongs to
  appointments?: Appointment[]; // Appointments assigned to this doctor
  patients?: Patient[]; // Patients this doctor has treated
}

// Define the patient interface
export interface Patient extends BaseModel {
  patientId: string; // Unique patient identifier (e.g., PAT123456)
  name: string;
  email?: string;
  phone: string;
  gender: Gender;
  age: number;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this patient
  // Relationships
  clinic?: Clinic; // The clinic this patient belongs to
  appointments?: Appointment[]; // Appointments for this patient
  prescriptions?: Prescription[]; // Prescriptions for this patient
}

// Define the appointment interface
export interface Appointment extends BaseModel {
  patientId: string; // Reference to Patient
  doctorId: string; // Reference to Doctor
  clinicId: string; // Reference to Clinic
  appointmentDate: string; // ISO string
  duration: number;
  concern: string;
  notes?: string;
  status: AppointmentStatus;
  createdById: string; // Reference to User who created this appointment
  // Relationships
  patient?: Patient; // The patient for this appointment
  doctor?: Doctor; // The doctor for this appointment
  clinic?: Clinic; // The clinic where this appointment takes place
  createdBy?: User; // The user who created this appointment
}

// Define the prescription interface
export interface Prescription extends BaseModel {
  patientId: string; // Reference to Patient
  doctorId: string; // Reference to Doctor
  clinicId: string; // Reference to Clinic
  diagnosis: string;
  medications: string;
  instructions?: string;
  followUpDate?: string;
  // Relationships
  patient?: Patient; // The patient for this prescription
  doctor?: Doctor; // The doctor who wrote this prescription
  clinic?: Clinic; // The clinic where this prescription was written
}

// Define the transaction interface
export interface Transaction extends BaseModel {
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  paymentStatus: "PAID" | "PENDING" | "CANCELLED";
  appointmentId?: string; // Reference to Appointment (optional)
  patientId?: string; // Reference to Patient (optional)
  doctorId?: string; // Reference to Doctor (optional)
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this transaction
  // Relationships
  appointment?: Appointment; // The appointment associated with this transaction
  patient?: Patient; // The patient associated with this transaction
  doctor?: Doctor; // The doctor associated with this transaction
  clinic?: Clinic; // The clinic where this transaction took place
  createdBy?: User; // The user who created this transaction
}

// Define the medicine interface
export interface Medicine extends BaseModel {
  name: string;
  manufacturer: string;
  batchNumber: string;
  type: string;
  dosage: string;
  manufacturedDate: string;
  expiryDate: string;
  price: number;
  stock: number;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this medicine
  // Relationships
  clinic?: Clinic; // The clinic where this medicine is stocked
  createdBy?: User; // The user who created this medicine
}

// Define the treatment interface
export interface Treatment extends BaseModel {
  name: string;
  description?: string;
  cost: number;
  duration?: number;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this treatment
  // Relationships
  clinic?: Clinic; // The clinic where this treatment is offered
  createdBy?: User; // The user who created this treatment
}

// Define the room interface
export interface Room extends BaseModel {
  roomNumber: string;
  roomType: string;
  totalBeds: number;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this room
  // Relationships
  clinic?: Clinic; // The clinic where this room is located
  createdBy?: User; // The user who created this room
  beds?: Bed[]; // Beds in this room
}

// Define the bed interface
export interface Bed extends BaseModel {
  bedNumber: number;
  roomId: string; // Reference to Room
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  patientId?: string; // Reference to Patient (optional)
  admissionDate?: string;
  dischargeDate?: string;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this bed
  // Relationships
  room?: Room; // The room this bed is in
  patient?: Patient; // The patient currently occupying this bed
  clinic?: Clinic; // The clinic where this bed is located
  createdBy?: User; // The user who created this bed
}

// Define the enhanced prescription interface for client-side use
export interface EnhancedPrescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  concern: string;
  gender: string;
  age: number;
  reports: {
    id: string;
    name: string;
    type: string;
    url: string;
    size?: string;
  }[];
  prescriptions: {
    id: string;
    name: string;
    type: string;
    url: string;
    size?: string;
  }[];
  createdAt: Date;
}