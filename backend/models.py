import sqlite3
import json
import uuid
from datetime import datetime

class BaseModel:
    """Base model with common methods"""
    
    @staticmethod
    def find_by_id(db, table, id):
        """Find a record by ID"""
        cursor = db.cursor()
        cursor.execute(f'SELECT * FROM {table} WHERE id = ?', (id,))
        record = cursor.fetchone()
        
        if record:
            # Convert JSON strings back to objects
            for key, value in record.items():
                if isinstance(value, str) and (value.startswith('{') or value.startswith('[')):
                    try:
                        record[key] = json.loads(value)
                    except:
                        pass
        
        return record
    
    @staticmethod
    def create(db, table, data):
        """Create a new record"""
        cursor = db.cursor()
        
        # Generate ID if not provided
        if 'id' not in data:
            data['id'] = str(uuid.uuid4())
        
        # Convert any nested objects to JSON strings
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                data[key] = json.dumps(value)
        
        # Get column names and values
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?'] * len(data))
        
        # Insert record
        query = f'INSERT INTO {table} ({columns}) VALUES ({placeholders})'
        cursor.execute(query, list(data.values()))
        db.commit()
        
        return data['id']
    
    @staticmethod
    def update(db, table, id, data):
        """Update a record"""
        cursor = db.cursor()
        
        # Convert any nested objects to JSON strings
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                data[key] = json.dumps(value)
        
        # Get column names and values
        set_clause = ', '.join([f'{key} = ?' for key in data.keys()])
        
        # Update record
        query = f'UPDATE {table} SET {set_clause} WHERE id = ?'
        cursor.execute(query, list(data.values()) + [id])
        db.commit()
        
        return True
    
    @staticmethod
    def delete(db, table, id):
        """Delete a record"""
        cursor = db.cursor()
        cursor.execute(f'DELETE FROM {table} WHERE id = ?', (id,))
        db.commit()
        
        return True
    
    @staticmethod
    def get_all(db, table, conditions=None):
        """Get all records with optional conditions"""
        cursor = db.cursor()
        
        query = f'SELECT * FROM {table}'
        params = []
        
        if conditions:
            where_clauses = []
            for key, value in conditions.items():
                where_clauses.append(f'{key} = ?')
                params.append(value)
            
            if where_clauses:
                query += ' WHERE ' + ' AND '.join(where_clauses)
        
        cursor.execute(query, params)
        records = cursor.fetchall()
        
        # Convert JSON strings back to objects
        for record in records:
            for key, value in record.items():
                if isinstance(value, str) and (value.startswith('{') or value.startswith('[')):
                    try:
                        record[key] = json.loads(value)
                    except:
                        pass
        
        return records

class User:
    """User model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a user by ID"""
        return BaseModel.find_by_id(db, 'users', id)
    
    @staticmethod
    def find_by_email(db, email):
        """Find a user by email"""
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        return cursor.fetchone()
    
    @staticmethod
    def find_by_email_and_role(db, email, role):
        """Find a user by email and role"""
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ? AND role = ?', (email, role))
        return cursor.fetchone()
    
    @staticmethod
    def find_by_clinic_and_role(db, clinic_id, role):
        """Find users by clinic and role"""
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE clinicId = ? AND role = ?', (clinic_id, role))
        return cursor.fetchall()
    
    @staticmethod
    def create(db, data):
        """Create a new user"""
        return BaseModel.create(db, 'users', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a user"""
        return BaseModel.update(db, 'users', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a user"""
        return BaseModel.delete(db, 'users', id)
    
    @staticmethod
    def get_all(db):
        """Get all users"""
        return BaseModel.get_all(db, 'users')

class Clinic:
    """Clinic model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a clinic by ID"""
        return BaseModel.find_by_id(db, 'clinics', id)
    
    @staticmethod
    def create(db, data):
        """Create a new clinic"""
        return BaseModel.create(db, 'clinics', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a clinic"""
        return BaseModel.update(db, 'clinics', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a clinic"""
        return BaseModel.delete(db, 'clinics', id)
    
    @staticmethod
    def get_all(db):
        """Get all clinics"""
        return BaseModel.get_all(db, 'clinics')

class Doctor:
    """Doctor model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a doctor by ID"""
        return BaseModel.find_by_id(db, 'doctors', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find doctors by clinic"""
        return BaseModel.get_all(db, 'doctors', {'clinicId': clinic_id})
    
    @staticmethod
    def create(db, data):
        """Create a new doctor"""
        return BaseModel.create(db, 'doctors', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a doctor"""
        return BaseModel.update(db, 'doctors', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a doctor"""
        return BaseModel.delete(db, 'doctors', id)
    
    @staticmethod
    def get_all(db, clinic_id=None):
        """Get all doctors, optionally filtered by clinic"""
        if clinic_id:
            return BaseModel.get_all(db, 'doctors', {'clinicId': clinic_id})
        return BaseModel.get_all(db, 'doctors')

class Patient:
    """Patient model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a patient by ID"""
        return BaseModel.find_by_id(db, 'patients', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find patients by clinic"""
        return BaseModel.get_all(db, 'patients', {'clinicId': clinic_id})
    
    @staticmethod
    def create(db, data):
        """Create a new patient"""
        # Generate a unique patient ID with prefix PAT if not provided
        if 'patientId' not in data:
            import random
            data['patientId'] = f"PAT{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'patients', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a patient"""
        return BaseModel.update(db, 'patients', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a patient"""
        return BaseModel.delete(db, 'patients', id)
    
    @staticmethod
    def get_all(db, clinic_id=None):
        """Get all patients, optionally filtered by clinic"""
        if clinic_id:
            return BaseModel.get_all(db, 'patients', {'clinicId': clinic_id})
        return BaseModel.get_all(db, 'patients')

class Appointment:
    """Appointment model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find an appointment by ID"""
        return BaseModel.find_by_id(db, 'appointments', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find appointments by clinic"""
        return BaseModel.get_all(db, 'appointments', {'clinicId': clinic_id})
    
    @staticmethod
    def find_by_doctor(db, doctor_id):
        """Find appointments by doctor"""
        return BaseModel.get_all(db, 'appointments', {'doctorId': doctor_id})
    
    @staticmethod
    def find_by_patient(db, patient_id):
        """Find appointments by patient"""
        return BaseModel.get_all(db, 'appointments', {'patientId': patient_id})
    
    @staticmethod
    def create(db, data):
        """Create a new appointment"""
        # Generate a unique appointment ID with prefix APT if not provided
        if 'appointmentId' not in data:
            import random
            data['appointmentId'] = f"APT{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'appointments', data)
    
    @staticmethod
    def update(db, id, data):
        """Update an appointment"""
        return BaseModel.update(db, 'appointments', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete an appointment"""
        return BaseModel.delete(db, 'appointments', id)
    
    @staticmethod
    def get_all(db, clinic_id=None, doctor_id=None, patient_id=None, status=None):
        """Get all appointments with optional filters"""
        conditions = {}
        
        if clinic_id:
            conditions['clinicId'] = clinic_id
        
        if doctor_id:
            conditions['doctorId'] = doctor_id
        
        if patient_id:
            conditions['patientId'] = patient_id
        
        if status:
            conditions['status'] = status
        
        return BaseModel.get_all(db, 'appointments', conditions if conditions else None)

class Prescription:
    """Prescription model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a prescription by ID"""
        return BaseModel.find_by_id(db, 'prescriptions', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find prescriptions by clinic"""
        return BaseModel.get_all(db, 'prescriptions', {'clinicId': clinic_id})
    
    @staticmethod
    def find_by_doctor(db, doctor_id):
        """Find prescriptions by doctor"""
        return BaseModel.get_all(db, 'prescriptions', {'doctorId': doctor_id})
    
    @staticmethod
    def find_by_patient(db, patient_id):
        """Find prescriptions by patient"""
        return BaseModel.get_all(db, 'prescriptions', {'patientId': patient_id})
    
    @staticmethod
    def create(db, data):
        """Create a new prescription"""
        # Generate a unique prescription ID with prefix PRE if not provided
        if 'prescriptionId' not in data:
            import random
            data['prescriptionId'] = f"PRE{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'prescriptions', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a prescription"""
        return BaseModel.update(db, 'prescriptions', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a prescription"""
        return BaseModel.delete(db, 'prescriptions', id)
    
    @staticmethod
    def get_all(db, clinic_id=None, doctor_id=None, patient_id=None):
        """Get all prescriptions with optional filters"""
        conditions = {}
        
        if clinic_id:
            conditions['clinicId'] = clinic_id
        
        if doctor_id:
            conditions['doctorId'] = doctor_id
        
        if patient_id:
            conditions['patientId'] = patient_id
        
        return BaseModel.get_all(db, 'prescriptions', conditions if conditions else None)

class Medicine:
    """Medicine model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a medicine by ID"""
        return BaseModel.find_by_id(db, 'medicines', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find medicines by clinic"""
        return BaseModel.get_all(db, 'medicines', {'clinicId': clinic_id})
    
    @staticmethod
    def create(db, data):
        """Create a new medicine"""
        # Generate a unique medicine ID with prefix MED if not provided
        if 'medicineId' not in data:
            import random
            data['medicineId'] = f"MED{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'medicines', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a medicine"""
        return BaseModel.update(db, 'medicines', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a medicine"""
        return BaseModel.delete(db, 'medicines', id)
    
    @staticmethod
    def get_all(db, clinic_id=None, is_active=None):
        """Get all medicines with optional filters"""
        conditions = {}
        
        if clinic_id:
            conditions['clinicId'] = clinic_id
        
        if is_active is not None:
            conditions['isActive'] = 1 if is_active else 0
        
        return BaseModel.get_all(db, 'medicines', conditions if conditions else None)

class Room:
    """Room model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a room by ID"""
        return BaseModel.find_by_id(db, 'rooms', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find rooms by clinic"""
        return BaseModel.get_all(db, 'rooms', {'clinicId': clinic_id})
    
    @staticmethod
    def create(db, data):
        """Create a new room"""
        # Generate a unique room ID with prefix ROOM if not provided
        if 'roomId' not in data:
            import random
            data['roomId'] = f"ROOM{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'rooms', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a room"""
        return BaseModel.update(db, 'rooms', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a room"""
        return BaseModel.delete(db, 'rooms', id)
    
    @staticmethod
    def get_all(db, clinic_id=None, is_active=None):
        """Get all rooms with optional filters"""
        conditions = {}
        
        if clinic_id:
            conditions['clinicId'] = clinic_id
        
        if is_active is not None:
            conditions['isActive'] = 1 if is_active else 0
        
        return BaseModel.get_all(db, 'rooms', conditions if conditions else None)

class Bed:
    """Bed model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a bed by ID"""
        return BaseModel.find_by_id(db, 'beds', id)
    
    @staticmethod
    def find_by_room(db, room_id):
        """Find beds by room"""
        return BaseModel.get_all(db, 'beds', {'roomId': room_id})
    
    @staticmethod
    def create(db, data):
        """Create a new bed"""
        # Generate a unique bed ID with prefix BED if not provided
        if 'bedId' not in data:
            import random
            data['bedId'] = f"BED{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'beds', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a bed"""
        return BaseModel.update(db, 'beds', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a bed"""
        return BaseModel.delete(db, 'beds', id)
    
    @staticmethod
    def get_all(db, room_id=None, status=None):
        """Get all beds with optional filters"""
        conditions = {}
        
        if room_id:
            conditions['roomId'] = room_id
        
        if status:
            conditions['status'] = status
        
        return BaseModel.get_all(db, 'beds', conditions if conditions else None)

class Transaction:
    """Transaction model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a transaction by ID"""
        return BaseModel.find_by_id(db, 'transactions', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find transactions by clinic"""
        return BaseModel.get_all(db, 'transactions', {'clinicId': clinic_id})
    
    @staticmethod
    def find_by_invoice(db, invoice_id):
        """Find transactions by invoice"""
        return BaseModel.get_all(db, 'transactions', {'invoiceId': invoice_id})
    
    @staticmethod
    def create(db, data):
        """Create a new transaction"""
        # Generate a unique transaction ID with prefix TXN if not provided
        if 'transactionId' not in data:
            import random
            data['transactionId'] = f"TXN{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'transactions', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a transaction"""
        return BaseModel.update(db, 'transactions', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a transaction"""
        return BaseModel.delete(db, 'transactions', id)
    
    @staticmethod
    def get_all(db, clinic_id=None, patient_id=None, type=None):
        """Get all transactions with optional filters"""
        conditions = {}
        
        if clinic_id:
            conditions['clinicId'] = clinic_id
        
        if patient_id:
            conditions['patientId'] = patient_id
        
        if type:
            conditions['type'] = type
        
        return BaseModel.get_all(db, 'transactions', conditions if conditions else None)

class Invoice:
    """Invoice model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find an invoice by ID"""
        return BaseModel.find_by_id(db, 'invoices', id)
    
    @staticmethod
    def find_by_clinic(db, clinic_id):
        """Find invoices by clinic"""
        return BaseModel.get_all(db, 'invoices', {'clinicId': clinic_id})
    
    @staticmethod
    def find_by_patient(db, patient_id):
        """Find invoices by patient"""
        return BaseModel.get_all(db, 'invoices', {'patientId': patient_id})
    
    @staticmethod
    def create(db, data):
        """Create a new invoice"""
        # Generate a unique invoice ID with prefix INV if not provided
        if 'invoiceId' not in data:
            import random
            data['invoiceId'] = f"INV{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'invoices', data)
    
    @staticmethod
    def update(db, id, data):
        """Update an invoice"""
        return BaseModel.update(db, 'invoices', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete an invoice"""
        return BaseModel.delete(db, 'invoices', id)
    
    @staticmethod
    def get_all(db, clinic_id=None, patient_id=None, status=None):
        """Get all invoices with optional filters"""
        conditions = {}
        
        if clinic_id:
            conditions['clinicId'] = clinic_id
        
        if patient_id:
            conditions['patientId'] = patient_id
        
        if status:
            conditions['status'] = status
        
        return BaseModel.get_all(db, 'invoices', conditions if conditions else None)

class Treatment:
    """Treatment model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a treatment by ID"""
        return BaseModel.find_by_id(db, 'treatments', id)
    
    @staticmethod
    def create(db, data):
        """Create a new treatment"""
        return BaseModel.create(db, 'treatments', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a treatment"""
        return BaseModel.update(db, 'treatments', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a treatment"""
        return BaseModel.delete(db, 'treatments', id)
    
    @staticmethod
    def get_all(db, clinic_id=None):
        """Get all treatments with optional filters"""
        if clinic_id:
            return BaseModel.get_all(db, 'treatments', {'clinicId': clinic_id})
        return BaseModel.get_all(db, 'treatments')

class Document:
    """Document model"""
    
    @staticmethod
    def find_by_id(db, id):
        """Find a document by ID"""
        return BaseModel.find_by_id(db, 'documents', id)
    
    @staticmethod
    def find_by_patient(db, patient_id):
        """Find documents by patient"""
        return BaseModel.get_all(db, 'documents', {'patientId': patient_id})
    
    @staticmethod
    def create(db, data):
        """Create a new document"""
        # Generate a unique document ID with prefix DOC if not provided
        if 'documentId' not in data:
            import random
            data['documentId'] = f"DOC{random.randint(100000, 999999)}"
        
        return BaseModel.create(db, 'documents', data)
    
    @staticmethod
    def update(db, id, data):
        """Update a document"""
        return BaseModel.update(db, 'documents', id, data)
    
    @staticmethod
    def delete(db, id):
        """Delete a document"""
        return BaseModel.delete(db, 'documents', id)
    
    @staticmethod
    def get_all(db, patient_id=None, type=None):
        """Get all documents with optional filters"""
        conditions = {}
        
        if patient_id:
            conditions['patientId'] = patient_id
        
        if type:
            conditions['type'] = type
        
        return BaseModel.get_all(db, 'documents', conditions if conditions else None)