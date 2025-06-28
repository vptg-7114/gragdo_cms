import sqlite3
import os
import json
from datetime import datetime

# Database file path
DB_FILE = os.path.join(os.path.dirname(__file__), 'digigo_care.db')

def dict_factory(cursor, row):
    """Convert database row to dictionary"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = dict_factory
    return conn

def init_db():
    """Initialize the database with tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL,
        clinicId TEXT,
        clinicIds TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
    )
    ''')
    
    # Create clinics table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS clinics (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        description TEXT,
        createdById TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create doctors table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        specialization TEXT NOT NULL,
        qualification TEXT,
        experience INTEGER,
        consultationFee REAL,
        isAvailable INTEGER NOT NULL DEFAULT 1,
        clinicId TEXT NOT NULL,
        createdById TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create patients table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        patientId TEXT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        gender TEXT NOT NULL,
        dateOfBirth TEXT NOT NULL,
        age INTEGER NOT NULL,
        bloodGroup TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        postalCode TEXT,
        medicalHistory TEXT,
        allergies TEXT,
        emergencyContact TEXT,
        clinicId TEXT NOT NULL,
        createdById TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create appointments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        appointmentId TEXT,
        patientId TEXT NOT NULL,
        doctorId TEXT NOT NULL,
        clinicId TEXT NOT NULL,
        appointmentDate TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        duration INTEGER NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        concern TEXT NOT NULL,
        notes TEXT,
        vitals TEXT,
        createdById TEXT NOT NULL,
        cancelledAt TEXT,
        cancelledById TEXT,
        cancelReason TEXT,
        followUpDate TEXT,
        isFollowUp INTEGER NOT NULL DEFAULT 0,
        previousAppointmentId TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (patientId) REFERENCES patients (id),
        FOREIGN KEY (doctorId) REFERENCES doctors (id),
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id),
        FOREIGN KEY (cancelledById) REFERENCES users (id),
        FOREIGN KEY (previousAppointmentId) REFERENCES appointments (id)
    )
    ''')
    
    # Create prescriptions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY,
        prescriptionId TEXT,
        patientId TEXT NOT NULL,
        doctorId TEXT NOT NULL,
        clinicId TEXT NOT NULL,
        appointmentId TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        medications TEXT NOT NULL,
        instructions TEXT,
        followUpDate TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        documentUrl TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (patientId) REFERENCES patients (id),
        FOREIGN KEY (doctorId) REFERENCES doctors (id),
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (appointmentId) REFERENCES appointments (id)
    )
    ''')
    
    # Create medicines table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS medicines (
        id TEXT PRIMARY KEY,
        medicineId TEXT,
        name TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        batchNumber TEXT NOT NULL,
        type TEXT NOT NULL,
        dosage TEXT NOT NULL,
        manufacturedDate TEXT NOT NULL,
        expiryDate TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        reorderLevel INTEGER NOT NULL,
        clinicId TEXT NOT NULL,
        createdById TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create rooms table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        roomId TEXT,
        roomNumber TEXT NOT NULL,
        roomType TEXT NOT NULL,
        floor INTEGER NOT NULL,
        totalBeds INTEGER NOT NULL,
        clinicId TEXT NOT NULL,
        createdById TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create beds table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS beds (
        id TEXT PRIMARY KEY,
        bedId TEXT,
        bedNumber INTEGER NOT NULL,
        roomId TEXT NOT NULL,
        status TEXT NOT NULL,
        patientId TEXT,
        admissionDate TEXT,
        dischargeDate TEXT,
        clinicId TEXT NOT NULL,
        createdById TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (roomId) REFERENCES rooms (id),
        FOREIGN KEY (patientId) REFERENCES patients (id),
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create transactions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        transactionId TEXT,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        paymentStatus TEXT NOT NULL,
        invoiceId TEXT,
        appointmentId TEXT,
        patientId TEXT,
        doctorId TEXT,
        clinicId TEXT NOT NULL,
        createdById TEXT NOT NULL,
        receiptUrl TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (invoiceId) REFERENCES invoices (id),
        FOREIGN KEY (appointmentId) REFERENCES appointments (id),
        FOREIGN KEY (patientId) REFERENCES patients (id),
        FOREIGN KEY (doctorId) REFERENCES doctors (id),
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create invoices table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        invoiceId TEXT,
        patientId TEXT NOT NULL,
        clinicId TEXT NOT NULL,
        appointmentId TEXT,
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        discount REAL NOT NULL,
        tax REAL NOT NULL,
        total REAL NOT NULL,
        dueDate TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        createdById TEXT NOT NULL,
        documentUrl TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (patientId) REFERENCES patients (id),
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (appointmentId) REFERENCES appointments (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Create documents table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        documentId TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        url TEXT NOT NULL,
        size INTEGER NOT NULL,
        patientId TEXT NOT NULL,
        appointmentId TEXT,
        uploadedById TEXT NOT NULL,
        clinicId TEXT NOT NULL,
        tags TEXT,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (patientId) REFERENCES patients (id),
        FOREIGN KEY (appointmentId) REFERENCES appointments (id),
        FOREIGN KEY (uploadedById) REFERENCES users (id),
        FOREIGN KEY (clinicId) REFERENCES clinics (id)
    )
    ''')
    
    # Create treatments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS treatments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        cost REAL NOT NULL,
        duration INTEGER,
        clinicId TEXT NOT NULL,
        createdById TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (clinicId) REFERENCES clinics (id),
        FOREIGN KEY (createdById) REFERENCES users (id)
    )
    ''')
    
    # Insert default super admin user if not exists
    cursor.execute('''
    SELECT * FROM users WHERE email = ? AND role = ?
    ''', ('superadmin@digigo.com', 'SUPER_ADMIN'))
    
    if not cursor.fetchone():
        from werkzeug.security import generate_password_hash
        import uuid
        
        now = datetime.utcnow().isoformat()
        
        cursor.execute('''
        INSERT INTO users (id, name, email, password, phone, role, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            str(uuid.uuid4()),
            'Super Admin',
            'superadmin@digigo.com',
            generate_password_hash('password123'),
            '+91-9999999999',
            'SUPER_ADMIN',
            1,
            now,
            now
        ))
    
    conn.commit()
    conn.close()

def seed_demo_data():
    """Seed the database with demo data"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if we already have data
    cursor.execute('SELECT COUNT(*) as count FROM clinics')
    result = cursor.fetchone()
    
    if result['count'] > 0:
        conn.close()
        return  # Data already exists
    
    # Import demo data from JSON files
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    
    # Define the order of tables to import (to respect foreign keys)
    tables = [
        'users',
        'clinics',
        'doctors',
        'patients',
        'appointments',
        'prescriptions',
        'medicines',
        'rooms',
        'beds',
        'transactions',
        'invoices',
        'treatments'
    ]
    
    for table in tables:
        json_file = os.path.join(data_dir, f'{table}.json')
        if os.path.exists(json_file):
            with open(json_file, 'r') as f:
                records = json.load(f)
                
                for record in records:
                    # Convert any nested objects to JSON strings
                    for key, value in record.items():
                        if isinstance(value, (dict, list)):
                            record[key] = json.dumps(value)
                    
                    # Get column names
                    columns = ', '.join(record.keys())
                    placeholders = ', '.join(['?'] * len(record))
                    
                    # Insert record
                    query = f'INSERT INTO {table} ({columns}) VALUES ({placeholders})'
                    cursor.execute(query, list(record.values()))
    
    conn.commit()
    conn.close()