from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Import database and models
from database import init_db, get_db
from models import (
    User, Clinic, Doctor, Patient, Appointment, Prescription, 
    Medicine, Room, Bed, Transaction, Invoice, Treatment, Document
)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'fallback-secret-key-for-development-only')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize database
init_db()

# Helper functions
def generate_token(user_data):
    """Generate a JWT token for a user"""
    payload = {
        'id': user_data['id'],
        'name': user_data['name'],
        'email': user_data['email'],
        'role': user_data['role'],
        'clinicId': user_data.get('clinicId'),
        'clinicIds': user_data.get('clinicIds'),
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    """Verify a JWT token"""
    try:
        return jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
    except:
        return None

def get_current_user():
    """Get the current user from the request"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    return verify_token(token)

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'API is running'})

# Auth routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login a user"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    if not email or not password or not role:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400
    
    db = get_db()
    user = User.find_by_email_and_role(db, email, role)
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    
    # Generate token
    token = generate_token(user)
    
    # Set token in cookie
    response = jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'clinicId': user.get('clinicId'),
            'clinicIds': user.get('clinicIds')
        }
    })
    response.set_cookie('auth-token', token, httponly=True, secure=False, max_age=60*60*24*7)
    
    return response

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Register a new user"""
    data = request.json
    
    required_fields = ['firstName', 'lastName', 'email', 'phone', 'role', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    db = get_db()
    
    # Check if user already exists
    existing_user = User.find_by_email(db, data['email'])
    if existing_user:
        return jsonify({'success': False, 'error': 'Email already in use'}), 400
    
    # Create user
    full_name = f"{data['firstName']} {data['lastName']}".strip()
    hashed_password = generate_password_hash(data['password'])
    
    user_data = {
        'name': full_name,
        'email': data['email'],
        'password': hashed_password,
        'phone': data['phone'],
        'role': data['role'],
        'clinicId': data.get('clinicId'),
        'isActive': True,
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    user_id = User.create(db, user_data)
    user_data['id'] = user_id
    
    # Generate token
    token = generate_token(user_data)
    
    # Set token in cookie
    response = jsonify({
        'success': True,
        'user': {
            'id': user_id,
            'name': full_name,
            'email': data['email'],
            'role': data['role'],
            'clinicId': data.get('clinicId')
        }
    })
    response.set_cookie('auth-token', token, httponly=True, secure=False, max_age=60*60*24*7)
    
    return response

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Request a password reset"""
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({'success': False, 'error': 'Email is required'}), 400
    
    # In a real app, you would send a password reset email
    # For demo purposes, we'll just return success
    
    return jsonify({'success': True, 'message': 'Password reset email sent'})

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset a password"""
    data = request.json
    token = data.get('token')
    new_password = data.get('newPassword')
    
    if not token or not new_password:
        return jsonify({'success': False, 'error': 'Token and new password are required'}), 400
    
    # In a real app, you would validate the token and update the user's password
    # For demo purposes, we'll just return success
    
    return jsonify({'success': True, 'message': 'Password reset successful'})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout a user"""
    response = jsonify({'success': True})
    response.delete_cookie('auth-token')
    return response

@app.route('/api/auth/me', methods=['GET'])
def get_current_user_route():
    """Get the current user"""
    # Get token from cookie
    token = request.cookies.get('auth-token')
    
    if not token:
        return jsonify({'success': False, 'error': 'Not authenticated'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    return jsonify({
        'success': True,
        'user': {
            'id': user_data['id'],
            'name': user_data['name'],
            'email': user_data['email'],
            'role': user_data['role'],
            'clinicId': user_data.get('clinicId'),
            'clinicIds': user_data.get('clinicIds')
        }
    })

# Profile routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    """Get a user profile"""
    user_id = request.args.get('userId')
    
    # Get current user from token if no userId provided
    if not user_id:
        token = request.cookies.get('auth-token')
        if not token:
            return jsonify({'success': False, 'error': 'Authentication required'}), 401
        
        user_data = verify_token(token)
        if not user_data:
            return jsonify({'success': False, 'error': 'Invalid token'}), 401
        
        user_id = user_data['id']
    
    db = get_db()
    user = User.find_by_id(db, user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    # Get clinic details if applicable
    clinic = None
    clinics = []
    
    if user['role'] == 'SUPER_ADMIN' and user.get('clinicIds'):
        clinic_ids = user['clinicIds']
        if isinstance(clinic_ids, str):
            import json
            try:
                clinic_ids = json.loads(clinic_ids)
            except:
                clinic_ids = []
        
        for clinic_id in clinic_ids:
            clinic_data = Clinic.find_by_id(db, clinic_id)
            if clinic_data:
                clinics.append({
                    'id': clinic_data['id'],
                    'name': clinic_data['name'],
                    'address': clinic_data['address']
                })
    elif user.get('clinicId'):
        clinic_data = Clinic.find_by_id(db, user['clinicId'])
        if clinic_data:
            clinic = {
                'id': clinic_data['id'],
                'name': clinic_data['name'],
                'address': clinic_data['address']
            }
    
    profile = {
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'phone': user.get('phone'),
        'role': user['role'],
        'address': None,  # Add these fields to User model if needed
        'bio': None,
        'profileImage': None,
        'clinicId': user.get('clinicId'),
        'clinic': clinic,
        'clinicIds': user.get('clinicIds'),
        'clinics': clinics,
        'createdAt': user['createdAt']
    }
    
    return jsonify({'success': True, 'profile': profile})

@app.route('/api/profile', methods=['PATCH'])
def update_profile():
    """Update a user profile"""
    data = request.json
    user_id = data.get('userId')
    
    if not user_id:
        return jsonify({'success': False, 'error': 'User ID is required'}), 400
    
    db = get_db()
    user = User.find_by_id(db, user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    # Update fields
    update_data = {}
    for field in ['name', 'email', 'phone', 'address', 'bio', 'profileImage']:
        if field in data:
            update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    User.update(db, user_id, update_data)
    
    return jsonify({'success': True})

# Clinic routes
@app.route('/api/clinics', methods=['GET'])
def get_clinics():
    """Get all clinics"""
    db = get_db()
    clinics = Clinic.get_all(db)
    
    # Add stats for each clinic
    for clinic in clinics:
        patients = Patient.find_by_clinic(db, clinic['id'])
        appointments = Appointment.find_by_clinic(db, clinic['id'])
        doctors = Doctor.find_by_clinic(db, clinic['id'])
        
        clinic['stats'] = {
            'patients': len(patients),
            'appointments': len(appointments),
            'doctors': len(doctors)
        }
    
    return jsonify({'success': True, 'clinics': clinics})

@app.route('/api/clinics/<id>', methods=['GET'])
def get_clinic(id):
    """Get a clinic by ID"""
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Add stats
    patients = Patient.find_by_clinic(db, id)
    appointments = Appointment.find_by_clinic(db, id)
    doctors = Doctor.find_by_clinic(db, id)
    
    clinic['stats'] = {
        'patients': len(patients),
        'appointments': len(appointments),
        'doctors': len(doctors)
    }
    
    return jsonify({'success': True, 'clinic': clinic})

@app.route('/api/clinics', methods=['POST'])
def create_clinic():
    """Create a new clinic"""
    data = request.json
    
    required_fields = ['name', 'address', 'phone']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    clinic_data = {
        'name': data['name'],
        'address': data['address'],
        'phone': data['phone'],
        'email': data.get('email'),
        'description': data.get('description'),
        'createdById': user_data['id'],
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    clinic_id = Clinic.create(db, clinic_data)
    clinic_data['id'] = clinic_id
    
    return jsonify({'success': True, 'clinic': clinic_data})

@app.route('/api/clinics/<id>', methods=['PATCH'])
def update_clinic(id):
    """Update a clinic"""
    data = request.json
    
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Update fields
    update_data = {}
    for field in ['name', 'address', 'phone', 'email', 'description']:
        if field in data:
            update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Clinic.update(db, id, update_data)
    
    # Get updated clinic
    updated_clinic = Clinic.find_by_id(db, id)
    
    return jsonify({'success': True, 'clinic': updated_clinic})

@app.route('/api/clinics/<id>', methods=['DELETE'])
def delete_clinic(id):
    """Delete a clinic"""
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Check if clinic has associated data
    patients = Patient.find_by_clinic(db, id)
    if patients:
        return jsonify({'success': False, 'error': 'Cannot delete clinic with associated patients'}), 400
    
    Clinic.delete(db, id)
    
    return jsonify({'success': True})

# Doctor routes
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    """Get all doctors"""
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    doctors = Doctor.get_all(db, clinic_id)
    
    return jsonify({'success': True, 'doctors': doctors})

@app.route('/api/doctors/<id>', methods=['GET'])
def get_doctor(id):
    """Get a doctor by ID"""
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        return jsonify({'success': False, 'error': 'Doctor not found'}), 404
    
    return jsonify({'success': True, 'doctor': doctor})

@app.route('/api/doctors', methods=['POST'])
def create_doctor():
    """Create a new doctor"""
    data = request.json
    
    required_fields = ['name', 'phone', 'specialization', 'clinicId']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    doctor_data = {
        'name': data['name'],
        'email': data.get('email'),
        'phone': data['phone'],
        'specialization': data['specialization'],
        'qualification': data.get('qualification'),
        'experience': data.get('experience'),
        'consultationFee': data.get('consultationFee'),
        'isAvailable': True,
        'clinicId': data['clinicId'],
        'createdById': user_data['id'],
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    doctor_id = Doctor.create(db, doctor_data)
    doctor_data['id'] = doctor_id
    
    return jsonify({'success': True, 'doctor': doctor_data})

@app.route('/api/doctors/<id>', methods=['PATCH'])
def update_doctor(id):
    """Update a doctor"""
    data = request.json
    
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        return jsonify({'success': False, 'error': 'Doctor not found'}), 404
    
    # Update fields
    update_data = {}
    for field in ['name', 'email', 'phone', 'specialization', 'qualification', 'experience', 'consultationFee', 'isAvailable']:
        if field in data:
            update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Doctor.update(db, id, update_data)
    
    # Get updated doctor
    updated_doctor = Doctor.find_by_id(db, id)
    
    return jsonify({'success': True, 'doctor': updated_doctor})

@app.route('/api/doctors/<id>', methods=['DELETE'])
def delete_doctor(id):
    """Delete a doctor"""
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        return jsonify({'success': False, 'error': 'Doctor not found'}), 404
    
    # Check if doctor has associated appointments
    appointments = Appointment.find_by_doctor(db, id)
    if appointments:
        return jsonify({'success': False, 'error': 'Cannot delete doctor with associated appointments'}), 400
    
    Doctor.delete(db, id)
    
    return jsonify({'success': True})

# Patient routes
@app.route('/api/patients', methods=['GET'])
def get_patients():
    """Get all patients"""
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    patients = Patient.get_all(db, clinic_id)
    
    return jsonify({'success': True, 'patients': patients})

@app.route('/api/patients/<id>', methods=['GET'])
def get_patient(id):
    """Get a patient by ID"""
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        return jsonify({'success': False, 'error': 'Patient not found'}), 404
    
    return jsonify({'success': True, 'patient': patient})

@app.route('/api/patients', methods=['POST'])
def create_patient():
    """Create a new patient"""
    data = request.json
    
    required_fields = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'clinicId']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    # Calculate age from date of birth
    from datetime import datetime
    birth_date = datetime.fromisoformat(data['dateOfBirth'].replace('Z', '+00:00'))
    today = datetime.utcnow()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    patient_data = {
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'email': data.get('email'),
        'phone': data['phone'],
        'gender': data['gender'],
        'dateOfBirth': data['dateOfBirth'],
        'age': age,
        'bloodGroup': data.get('bloodGroup'),
        'address': data.get('address'),
        'city': data.get('city'),
        'state': data.get('state'),
        'postalCode': data.get('postalCode'),
        'medicalHistory': data.get('medicalHistory'),
        'allergies': data.get('allergies'),
        'clinicId': data['clinicId'],
        'createdById': user_data['id'],
        'isActive': True,
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    patient_id = Patient.create(db, patient_data)
    patient_data['id'] = patient_id
    
    return jsonify({'success': True, 'patient': patient_data})

@app.route('/api/patients/<id>', methods=['PATCH'])
def update_patient(id):
    """Update a patient"""
    data = request.json
    
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        return jsonify({'success': False, 'error': 'Patient not found'}), 404
    
    # Update fields
    update_data = {}
    fields = [
        'firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth',
        'bloodGroup', 'address', 'city', 'state', 'postalCode',
        'medicalHistory', 'allergies', 'isActive'
    ]
    
    for field in fields:
        if field in data:
            update_data[field] = data[field]
    
    # Recalculate age if date of birth is updated
    if 'dateOfBirth' in update_data:
        from datetime import datetime
        birth_date = datetime.fromisoformat(update_data['dateOfBirth'].replace('Z', '+00:00'))
        today = datetime.utcnow()
        update_data['age'] = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Patient.update(db, id, update_data)
    
    # Get updated patient
    updated_patient = Patient.find_by_id(db, id)
    
    return jsonify({'success': True, 'patient': updated_patient})

@app.route('/api/patients/<id>', methods=['DELETE'])
def delete_patient(id):
    """Delete a patient"""
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        return jsonify({'success': False, 'error': 'Patient not found'}), 404
    
    # Check if patient has associated appointments
    appointments = Appointment.find_by_patient(db, id)
    if appointments:
        return jsonify({'success': False, 'error': 'Cannot delete patient with associated appointments'}), 400
    
    Patient.delete(db, id)
    
    return jsonify({'success': True})

# Appointment routes
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    """Get all appointments"""
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    patient_id = request.args.get('patientId')
    status = request.args.get('status')
    
    db = get_db()
    appointments = Appointment.get_all(db, clinic_id, doctor_id, patient_id, status)
    
    # Enrich appointments with patient and doctor data
    for appointment in appointments:
        patient = Patient.find_by_id(db, appointment['patientId'])
        doctor = Doctor.find_by_id(db, appointment['doctorId'])
        
        if patient:
            appointment['patient'] = {
                'id': patient['id'],
                'patientId': patient.get('patientId', ''),
                'name': f"{patient['firstName']} {patient['lastName']}",
                'phone': patient['phone'],
                'gender': patient['gender'],
                'age': patient['age']
            }
        
        if doctor:
            appointment['doctor'] = {
                'id': doctor['id'],
                'name': doctor['name']
            }
    
    return jsonify({'success': True, 'appointments': appointments})

@app.route('/api/appointments/<id>', methods=['GET'])
def get_appointment(id):
    """Get an appointment by ID"""
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        return jsonify({'success': False, 'error': 'Appointment not found'}), 404
    
    # Enrich appointment with patient and doctor data
    patient = Patient.find_by_id(db, appointment['patientId'])
    doctor = Doctor.find_by_id(db, appointment['doctorId'])
    
    if patient:
        appointment['patient'] = {
            'id': patient['id'],
            'patientId': patient.get('patientId', ''),
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        }
    
    if doctor:
        appointment['doctor'] = {
            'id': doctor['id'],
            'name': doctor['name']
        }
    
    return jsonify({'success': True, 'appointment': appointment})

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    """Create a new appointment"""
    data = request.json
    
    required_fields = ['patientId', 'doctorId', 'clinicId', 'appointmentDate', 'startTime', 'endTime', 'duration', 'concern']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    appointment_data = {
        'patientId': data['patientId'],
        'doctorId': data['doctorId'],
        'clinicId': data['clinicId'],
        'appointmentDate': data['appointmentDate'],
        'startTime': data['startTime'],
        'endTime': data['endTime'],
        'duration': data['duration'],
        'type': data.get('type', 'REGULAR'),
        'concern': data['concern'],
        'notes': data.get('notes'),
        'status': 'SCHEDULED',
        'isFollowUp': data.get('isFollowUp', False),
        'previousAppointmentId': data.get('previousAppointmentId'),
        'createdById': user_data['id'],
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    appointment_id = Appointment.create(db, appointment_data)
    appointment_data['id'] = appointment_id
    
    # Get patient and doctor for response
    patient = Patient.find_by_id(db, data['patientId'])
    doctor = Doctor.find_by_id(db, data['doctorId'])
    
    if patient:
        appointment_data['patient'] = {
            'id': patient['id'],
            'patientId': patient.get('patientId', ''),
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        }
    
    if doctor:
        appointment_data['doctor'] = {
            'id': doctor['id'],
            'name': doctor['name']
        }
    
    return jsonify({'success': True, 'appointment': appointment_data})

@app.route('/api/appointments/<id>', methods=['PATCH'])
def update_appointment(id):
    """Update an appointment"""
    data = request.json
    
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        return jsonify({'success': False, 'error': 'Appointment not found'}), 404
    
    # Handle different types of updates based on the action
    action = data.get('action')
    update_data = {}
    
    if action == 'checkIn':
        update_data['status'] = 'CHECKED_IN'
    elif action == 'start':
        update_data['status'] = 'IN_PROGRESS'
    elif action == 'complete':
        update_data['status'] = 'COMPLETED'
        update_data['vitals'] = data.get('vitals')
        update_data['notes'] = data.get('notes')
        update_data['followUpDate'] = data.get('followUpDate')
    elif action == 'reschedule':
        if not all(field in data for field in ['appointmentDate', 'startTime', 'endTime', 'duration']):
            return jsonify({'success': False, 'error': 'Required fields for rescheduling are missing'}), 400
        
        update_data['appointmentDate'] = data['appointmentDate']
        update_data['startTime'] = data['startTime']
        update_data['endTime'] = data['endTime']
        update_data['duration'] = data['duration']
        update_data['status'] = 'RESCHEDULED'
    elif action == 'cancel':
        if not data.get('cancelReason') or not data.get('cancelledById'):
            return jsonify({'success': False, 'error': 'Reason and canceller ID are required for cancellation'}), 400
        
        update_data['status'] = 'CANCELLED'
        update_data['cancelledAt'] = datetime.utcnow().isoformat()
        update_data['cancelledById'] = data['cancelledById']
        update_data['cancelReason'] = data['cancelReason']
    else:
        # Regular update
        fields = ['appointmentDate', 'startTime', 'endTime', 'duration', 'type', 'concern', 'notes', 'status', 'vitals', 'followUpDate']
        for field in fields:
            if field in data:
                update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Appointment.update(db, id, update_data)
    
    # Get updated appointment
    updated_appointment = Appointment.find_by_id(db, id)
    
    # Enrich appointment with patient and doctor data
    patient = Patient.find_by_id(db, updated_appointment['patientId'])
    doctor = Doctor.find_by_id(db, updated_appointment['doctorId'])
    
    if patient:
        updated_appointment['patient'] = {
            'id': patient['id'],
            'patientId': patient.get('patientId', ''),
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        }
    
    if doctor:
        updated_appointment['doctor'] = {
            'id': doctor['id'],
            'name': doctor['name']
        }
    
    return jsonify({'success': True, 'appointment': updated_appointment})

@app.route('/api/appointments/<id>', methods=['DELETE'])
def delete_appointment(id):
    """Delete an appointment"""
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        return jsonify({'success': False, 'error': 'Appointment not found'}), 404
    
    Appointment.delete(db, id)
    
    return jsonify({'success': True})

# Prescription routes
@app.route('/api/prescriptions', methods=['GET'])
def get_prescriptions():
    """Get all prescriptions"""
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    patient_id = request.args.get('patientId')
    
    db = get_db()
    prescriptions = Prescription.get_all(db, clinic_id, doctor_id, patient_id)
    
    # Enrich prescriptions with patient and doctor data
    for prescription in prescriptions:
        patient = Patient.find_by_id(db, prescription['patientId'])
        doctor = Doctor.find_by_id(db, prescription['doctorId'])
        
        if patient:
            prescription['patientName'] = f"{patient['firstName']} {patient['lastName']}"
            prescription['patientGender'] = patient['gender']
            prescription['patientAge'] = patient['age']
        
        if doctor:
            prescription['doctorName'] = doctor['name']
    
    return jsonify({'success': True, 'prescriptions': prescriptions})

@app.route('/api/prescriptions/<id>', methods=['GET'])
def get_prescription(id):
    """Get a prescription by ID"""
    db = get_db()
    prescription = Prescription.find_by_id(db, id)
    
    if not prescription:
        return jsonify({'success': False, 'error': 'Prescription not found'}), 404
    
    # Enrich prescription with patient and doctor data
    patient = Patient.find_by_id(db, prescription['patientId'])
    doctor = Doctor.find_by_id(db, prescription['doctorId'])
    
    if patient:
        prescription['patient'] = patient
    
    if doctor:
        prescription['doctor'] = doctor
    
    return jsonify({'success': True, 'prescription': prescription})

@app.route('/api/prescriptions', methods=['POST'])
def create_prescription():
    """Create a new prescription"""
    data = request.json
    
    required_fields = ['patientId', 'doctorId', 'clinicId', 'appointmentId', 'diagnosis', 'medications']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    prescription_data = {
        'patientId': data['patientId'],
        'doctorId': data['doctorId'],
        'clinicId': data['clinicId'],
        'appointmentId': data['appointmentId'],
        'diagnosis': data['diagnosis'],
        'medications': data['medications'],
        'instructions': data.get('instructions'),
        'followUpDate': data.get('followUpDate'),
        'isActive': True,
        'documentUrl': data.get('documentUrl'),
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    prescription_id = Prescription.create(db, prescription_data)
    prescription_data['id'] = prescription_id
    
    return jsonify({'success': True, 'prescription': prescription_data})

@app.route('/api/prescriptions/<id>', methods=['PATCH'])
def update_prescription(id):
    """Update a prescription"""
    data = request.json
    
    db = get_db()
    prescription = Prescription.find_by_id(db, id)
    
    if not prescription:
        return jsonify({'success': False, 'error': 'Prescription not found'}), 404
    
    # Update fields
    update_data = {}
    fields = ['diagnosis', 'medications', 'instructions', 'followUpDate', 'isActive', 'documentUrl']
    
    for field in fields:
        if field in data:
            update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Prescription.update(db, id, update_data)
    
    # Get updated prescription
    updated_prescription = Prescription.find_by_id(db, id)
    
    return jsonify({'success': True, 'prescription': updated_prescription})

@app.route('/api/prescriptions/<id>', methods=['DELETE'])
def delete_prescription(id):
    """Delete a prescription"""
    db = get_db()
    prescription = Prescription.find_by_id(db, id)
    
    if not prescription:
        return jsonify({'success': False, 'error': 'Prescription not found'}), 404
    
    Prescription.delete(db, id)
    
    return jsonify({'success': True})

# Dashboard routes
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    
    db = get_db()
    
    # Get appointments and patients
    appointments = Appointment.get_all(db, clinic_id, doctor_id)
    patients = Patient.get_all(db, clinic_id)
    doctors = Doctor.get_all(db, clinic_id)
    
    # Get today's appointments and patients
    today = datetime.utcnow().date()
    today_appointments = [a for a in appointments if datetime.fromisoformat(a['appointmentDate'].replace('Z', '+00:00')).date() == today]
    today_patient_ids = set(a['patientId'] for a in today_appointments)
    today_patients = len(today_patient_ids)
    
    # Get patient demographics
    male_patients = len([p for p in patients if p['gender'] == 'MALE'])
    female_patients = len([p for p in patients if p['gender'] == 'FEMALE'])
    child_patients = len([p for p in patients if p['age'] < 18])
    
    # Get available doctors
    available_doctors = len([d for d in doctors if d.get('isAvailable', True)])
    
    # Get check-ins (patients who have arrived for their appointments)
    # For demo purposes, we'll use a percentage of today's appointments
    check_ins = len([a for a in today_appointments if a['status'] in ['CHECKED_IN', 'IN_PROGRESS', 'COMPLETED']])
    
    return jsonify({
        'success': True,
        'stats': {
            'todayAppointments': len(today_appointments),
            'todayPatients': today_patients,
            'totalPatients': len(patients),
            'malePatients': male_patients,
            'femalePatients': female_patients,
            'childPatients': child_patients,
            'availableDoctors': available_doctors,
            'checkIns': check_ins,
            'appointments': len(today_appointments)  # For StatsCards component
        }
    })

@app.route('/api/dashboard/appointments', methods=['GET'])
def get_recent_appointments():
    """Get recent appointments"""
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    
    db = get_db()
    
    # Get appointments
    appointments = Appointment.get_all(db, clinic_id, doctor_id)
    
    # Sort by date descending and take the first 5
    appointments.sort(key=lambda a: a['appointmentDate'], reverse=True)
    recent_appointments = appointments[:5]
    
    # Enrich appointments with patient and doctor data
    for appointment in recent_appointments:
        patient = Patient.find_by_id(db, appointment['patientId'])
        doctor = Doctor.find_by_id(db, appointment['doctorId'])
        
        if patient:
            appointment['patient'] = {
                'id': patient['id'],
                'patientId': patient.get('patientId', ''),
                'name': f"{patient['firstName']} {patient['lastName']}",
                'phone': patient['phone'],
                'gender': patient['gender'],
                'age': patient['age']
            }
        
        if doctor:
            appointment['doctor'] = {
                'id': doctor['id'],
                'name': doctor['name']
            }
    
    return jsonify({'success': True, 'appointments': recent_appointments})

@app.route('/api/dashboard/doctors-activity', methods=['GET'])
def get_doctors_activity():
    """Get doctors activity"""
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    
    # Get doctors
    doctors = Doctor.get_all(db, clinic_id)
    
    # Get appointments
    appointments = Appointment.get_all(db, clinic_id)
    
    doctors_activity = []
    for doctor in doctors:
        doctor_appointments = [a for a in appointments if a['doctorId'] == doctor['id']]
        in_progress = len([a for a in doctor_appointments if a['status'] == 'IN_PROGRESS'])
        completed = len([a for a in doctor_appointments if a['status'] == 'COMPLETED'])
        pending = len([a for a in doctor_appointments if a['status'] in ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN']])
        
        doctors_activity.append({
            'id': doctor['id'],
            'name': doctor['name'],
            'specialization': doctor['specialization'],
            'isAvailable': doctor.get('isAvailable', True),
            'appointments': {
                'inProgress': in_progress,
                'completed': completed,
                'pending': pending,
                'total': len(doctor_appointments)
            }
        })
    
    return jsonify({'success': True, 'doctorsActivity': doctors_activity})

@app.route('/api/dashboard/reports', methods=['GET'])
def get_recent_reports():
    """Get recent reports"""
    # In a real app, you would fetch reports from the database
    # For demo purposes, we'll return mock data
    reports = [
        {
            'id': '1',
            'title': 'Monthly Patient Report',
            'type': 'Patient Analytics',
            'generatedDate': (datetime.utcnow() - timedelta(days=15)).isoformat(),
            'size': '2.4 MB',
            'format': 'PDF'
        },
        {
            'id': '2',
            'title': 'Revenue Analysis Q4',
            'type': 'Financial Report',
            'generatedDate': (datetime.utcnow() - timedelta(days=10)).isoformat(),
            'size': '1.8 MB',
            'format': 'Excel'
        },
        {
            'id': '3',
            'title': 'Doctor Performance Report',
            'type': 'Performance Analytics',
            'generatedDate': (datetime.utcnow() - timedelta(days=8)).isoformat(),
            'size': '3.2 MB',
            'format': 'PDF'
        },
        {
            'id': '4',
            'title': 'Appointment Statistics',
            'type': 'Operational Report',
            'generatedDate': (datetime.utcnow() - timedelta(days=5)).isoformat(),
            'size': '1.5 MB',
            'format': 'PDF'
        }
    ]
    
    return jsonify({'success': True, 'reports': reports})

# Admin routes
@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    """Get admin dashboard statistics"""
    clinic_id = request.args.get('clinicId')
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    
    # Get patients, appointments, doctors, and staff
    patients = Patient.find_by_clinic(db, clinic_id)
    appointments = Appointment.find_by_clinic(db, clinic_id)
    doctors = Doctor.find_by_clinic(db, clinic_id)
    staff = User.find_by_clinic_and_role(db, clinic_id, 'STAFF')
    
    return jsonify({
        'success': True,
        'stats': {
            'totalPatients': len(patients),
            'appointments': len(appointments),
            'doctors': len(doctors),
            'staff': len(staff)
        }
    })

@app.route('/api/admin/doctors', methods=['GET'])
def get_admin_doctors():
    """Get doctors for admin dashboard"""
    clinic_id = request.args.get('clinicId')
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    
    # Get doctors
    doctors = Doctor.find_by_clinic(db, clinic_id)
    
    # Format for display
    formatted_doctors = []
    for doctor in doctors:
        formatted_doctors.append({
            'id': doctor['id'],
            'name': doctor['name'],
            'specialization': doctor['specialization'],
            'isAvailable': doctor.get('isAvailable', True),
            'avatar': None  # Add avatar field to Doctor model if needed
        })
    
    return jsonify({'success': True, 'doctors': formatted_doctors})

@app.route('/api/admin/staff', methods=['GET'])
def get_admin_staff():
    """Get staff for admin dashboard"""
    clinic_id = request.args.get('clinicId')
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    
    # Get staff
    staff = User.find_by_clinic_and_role(db, clinic_id, 'STAFF')
    
    # Format for display
    formatted_staff = []
    for staff_member in staff:
        formatted_staff.append({
            'id': staff_member['id'],
            'name': staff_member['name'],
            'role': 'Staff',
            'isAvailable': staff_member.get('isActive', True),
            'avatar': None  # Add avatar field to User model if needed
        })
    
    return jsonify({'success': True, 'staff': formatted_staff})

@app.route('/api/admin/transactions', methods=['GET'])
def get_admin_transactions():
    """Get transactions for admin dashboard"""
    clinic_id = request.args.get('clinicId')
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    
    # Get transactions
    transactions = Transaction.find_by_clinic(db, clinic_id)
    
    # Sort by date descending and take the first 5
    transactions.sort(key=lambda t: t['createdAt'], reverse=True)
    recent_transactions = transactions[:5]
    
    return jsonify({'success': True, 'transactions': recent_transactions})

@app.route('/api/admin/appointments', methods=['GET'])
def get_admin_appointments():
    """Get appointments for admin dashboard"""
    clinic_id = request.args.get('clinicId')
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    
    # Get appointments
    appointments = Appointment.find_by_clinic(db, clinic_id)
    
    # Sort by date descending and take the first 5
    appointments.sort(key=lambda a: a['createdAt'], reverse=True)
    recent_appointments = appointments[:5]
    
    # Format for display
    formatted_appointments = []
    for i, appointment in enumerate(recent_appointments):
        patient = Patient.find_by_id(db, appointment['patientId'])
        
        formatted_appointments.append({
            'id': appointment['id'],
            'sNo': i + 1,
            'name': f"{patient['firstName']} {patient['lastName']}" if patient else 'Unknown',
            'phoneNumber': patient['phone'] if patient else 'N/A',
            'email': patient.get('email', 'N/A') if patient else 'N/A',
            'age': patient['age'] if patient else 0,
            'gender': patient['gender'] if patient else 'N/A',
            'action': 'Accept'
        })
    
    return jsonify({'success': True, 'appointments': formatted_appointments})

# Analytics routes
@app.route('/api/analytics', methods=['GET'])
def get_analytics_data():
    """Get analytics data"""
    db = get_db()
    
    # Get patients, appointments, and transactions
    patients = Patient.get_all(db)
    appointments = Appointment.get_all(db)
    transactions = Transaction.get_all(db)
    
    # Calculate revenue
    now = datetime.utcnow()
    this_month_start = datetime(now.year, now.month, 1)
    last_month_start = datetime(now.year, now.month - 1 if now.month > 1 else 12, 1)
    last_month_end = this_month_start - timedelta(days=1)
    
    # Filter transactions for this month and last month
    this_month_transactions = [tx for tx in transactions if 
                              datetime.fromisoformat(tx['createdAt'].replace('Z', '+00:00')) >= this_month_start and 
                              datetime.fromisoformat(tx['createdAt'].replace('Z', '+00:00')) <= now and 
                              tx['type'] == 'INCOME']
    
    last_month_transactions = [tx for tx in transactions if 
                              datetime.fromisoformat(tx['createdAt'].replace('Z', '+00:00')) >= last_month_start and 
                              datetime.fromisoformat(tx['createdAt'].replace('Z', '+00:00')) <= last_month_end and 
                              tx['type'] == 'INCOME']
    
    # Calculate revenue
    this_month_revenue = sum(tx['amount'] for tx in this_month_transactions)
    last_month_revenue = sum(tx['amount'] for tx in last_month_transactions)
    
    # Calculate growth
    revenue_growth = 0
    if last_month_revenue > 0:
        revenue_growth = round(((this_month_revenue - last_month_revenue) / last_month_revenue) * 100)
    
    # Calculate patient growth
    last_month_patients = len([p for p in patients if 
                              datetime.fromisoformat(p['createdAt'].replace('Z', '+00:00')) < this_month_start])
    
    patient_growth = 0
    if last_month_patients > 0:
        patient_growth = round(((len(patients) - last_month_patients) / last_month_patients) * 100)
    
    # Calculate appointment completion rate
    completed_appointments = len([a for a in appointments if a['status'] == 'COMPLETED'])
    completion_rate = 0
    if appointments:
        completion_rate = round((completed_appointments / len(appointments)) * 100)
    
    return jsonify({
        'success': True,
        'data': {
            'revenue': {
                'thisMonth': this_month_revenue or 250000,  # Default value for demo
                'lastMonth': last_month_revenue or 220000,  # Default value for demo
                'growth': revenue_growth or 13  # Default value for demo
            },
            'patients': {
                'total': len(patients) or 2427,  # Default value for demo
                'growth': patient_growth or 8  # Default value for demo
            },
            'appointments': {
                'completionRate': completion_rate or 85,  # Default value for demo
                'total': len(appointments) or 1850  # Default value for demo
            }
        }
    })

# Medicine routes
@app.route('/api/medicines', methods=['GET'])
def get_medicines():
    """Get all medicines"""
    clinic_id = request.args.get('clinicId')
    is_active = request.args.get('isActive')
    
    if is_active is not None:
        is_active = is_active.lower() == 'true'
    
    db = get_db()
    medicines = Medicine.get_all(db, clinic_id, is_active)
    
    return jsonify({'success': True, 'medicines': medicines})

@app.route('/api/medicines/<id>', methods=['GET'])
def get_medicine(id):
    """Get a medicine by ID"""
    db = get_db()
    medicine = Medicine.find_by_id(db, id)
    
    if not medicine:
        return jsonify({'success': False, 'error': 'Medicine not found'}), 404
    
    return jsonify({'success': True, 'medicine': medicine})

@app.route('/api/medicines', methods=['POST'])
def create_medicine():
    """Create a new medicine"""
    data = request.json
    
    required_fields = ['name', 'manufacturer', 'batchNumber', 'type', 'dosage', 
                      'manufacturedDate', 'expiryDate', 'price', 'stock', 'clinicId']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    medicine_data = {
        'name': data['name'],
        'manufacturer': data['manufacturer'],
        'batchNumber': data['batchNumber'],
        'type': data['type'],
        'dosage': data['dosage'],
        'manufacturedDate': data['manufacturedDate'],
        'expiryDate': data['expiryDate'],
        'price': data['price'],
        'stock': data['stock'],
        'reorderLevel': data.get('reorderLevel', 10),
        'clinicId': data['clinicId'],
        'createdById': user_data['id'],
        'isActive': True,
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    medicine_id = Medicine.create(db, medicine_data)
    medicine_data['id'] = medicine_id
    
    return jsonify({'success': True, 'medicine': medicine_data})

@app.route('/api/medicines/<id>', methods=['PATCH'])
def update_medicine(id):
    """Update a medicine"""
    data = request.json
    
    db = get_db()
    medicine = Medicine.find_by_id(db, id)
    
    if not medicine:
        return jsonify({'success': False, 'error': 'Medicine not found'}), 404
    
    # Handle stock updates separately
    if data.get('action') == 'updateStock':
        if 'quantity' not in data or 'isAddition' not in data:
            return jsonify({'success': False, 'error': 'Quantity and isAddition are required for stock updates'}), 400
        
        current_stock = medicine['stock']
        quantity = data['quantity']
        is_addition = data['isAddition']
        
        if is_addition:
            new_stock = current_stock + quantity
        else:
            new_stock = current_stock - quantity
            if new_stock < 0:
                return jsonify({'success': False, 'error': 'Insufficient stock'}), 400
        
        update_data = {
            'stock': new_stock,
            'updatedAt': datetime.utcnow().isoformat()
        }
    else:
        # Regular update
        update_data = {}
        fields = ['name', 'manufacturer', 'batchNumber', 'type', 'dosage', 
                 'manufacturedDate', 'expiryDate', 'price', 'stock', 'reorderLevel', 'isActive']
        
        for field in fields:
            if field in data:
                update_data[field] = data[field]
        
        update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Medicine.update(db, id, update_data)
    
    # Get updated medicine
    updated_medicine = Medicine.find_by_id(db, id)
    
    return jsonify({'success': True, 'medicine': updated_medicine})

@app.route('/api/medicines/<id>', methods=['DELETE'])
def delete_medicine(id):
    """Delete a medicine"""
    db = get_db()
    medicine = Medicine.find_by_id(db, id)
    
    if not medicine:
        return jsonify({'success': False, 'error': 'Medicine not found'}), 404
    
    Medicine.delete(db, id)
    
    return jsonify({'success': True})

# Treatment routes
@app.route('/api/treatments', methods=['GET'])
def get_treatments():
    """Get all treatments"""
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    treatments = Treatment.get_all(db, clinic_id)
    
    return jsonify({'success': True, 'treatments': treatments})

@app.route('/api/treatments/<id>', methods=['DELETE'])
def delete_treatment(id):
    """Delete a treatment"""
    db = get_db()
    treatment = Treatment.find_by_id(db, id)
    
    if not treatment:
        return jsonify({'success': False, 'error': 'Treatment not found'}), 404
    
    Treatment.delete(db, id)
    
    return jsonify({'success': True})

# Room routes
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    """Get all rooms"""
    clinic_id = request.args.get('clinicId')
    is_active = request.args.get('isActive')
    
    if is_active is not None:
        is_active = is_active.lower() == 'true'
    
    db = get_db()
    rooms = Room.get_all(db, clinic_id, is_active)
    
    # Get bed counts for each room
    for room in rooms:
        room_beds = Bed.find_by_room(db, room['id'])
        available_beds = len([b for b in room_beds if b['status'] == 'AVAILABLE'])
        occupied_beds = len([b for b in room_beds if b['status'] == 'OCCUPIED'])
        reserved_beds = len([b for b in room_beds if b['status'] == 'RESERVED'])
        
        room['bedCounts'] = {
            'total': len(room_beds),
            'available': available_beds,
            'occupied': occupied_beds,
            'reserved': reserved_beds
        }
    
    return jsonify({'success': True, 'rooms': rooms})

@app.route('/api/rooms/<id>', methods=['GET'])
def get_room(id):
    """Get a room by ID"""
    db = get_db()
    room = Room.find_by_id(db, id)
    
    if not room:
        return jsonify({'success': False, 'error': 'Room not found'}), 404
    
    # Get beds for this room
    room_beds = Bed.find_by_room(db, id)
    
    # Get patient details for occupied beds
    for bed in room_beds:
        if bed['status'] == 'OCCUPIED' and bed.get('patientId'):
            patient = Patient.find_by_id(db, bed['patientId'])
            if patient:
                bed['patient'] = {
                    'id': patient['id'],
                    'patientId': patient.get('patientId', ''),
                    'name': f"{patient['firstName']} {patient['lastName']}",
                    'gender': patient['gender'],
                    'age': patient['age']
                }
    
    room['beds'] = room_beds
    room['bedCounts'] = {
        'total': len(room_beds),
        'available': len([b for b in room_beds if b['status'] == 'AVAILABLE']),
        'occupied': len([b for b in room_beds if b['status'] == 'OCCUPIED']),
        'reserved': len([b for b in room_beds if b['status'] == 'RESERVED'])
    }
    
    return jsonify({'success': True, 'room': room})

@app.route('/api/rooms', methods=['POST'])
def create_room():
    """Create a new room"""
    data = request.json
    
    required_fields = ['roomNumber', 'roomType', 'floor', 'totalBeds', 'clinicId']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    # Check if room number already exists in this clinic
    existing_rooms = Room.find_by_clinic(db, data['clinicId'])
    if any(r['roomNumber'] == data['roomNumber'] for r in existing_rooms):
        return jsonify({'success': False, 'error': 'Room number already exists in this clinic'}), 400
    
    room_data = {
        'roomNumber': data['roomNumber'],
        'roomType': data['roomType'],
        'floor': data['floor'],
        'totalBeds': data['totalBeds'],
        'clinicId': data['clinicId'],
        'createdById': user_data['id'],
        'isActive': True,
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    room_id = Room.create(db, room_data)
    room_data['id'] = room_id
    
    return jsonify({'success': True, 'room': room_data})

@app.route('/api/rooms/<id>', methods=['PATCH'])
def update_room(id):
    """Update a room"""
    data = request.json
    
    db = get_db()
    room = Room.find_by_id(db, id)
    
    if not room:
        return jsonify({'success': False, 'error': 'Room not found'}), 404
    
    # Check if room number is being changed and already exists
    if 'roomNumber' in data and data['roomNumber'] != room['roomNumber']:
        existing_rooms = Room.find_by_clinic(db, room['clinicId'])
        if any(r['roomNumber'] == data['roomNumber'] and r['id'] != id for r in existing_rooms):
            return jsonify({'success': False, 'error': 'Room number already exists in this clinic'}), 400
    
    # Update fields
    update_data = {}
    fields = ['roomNumber', 'roomType', 'floor', 'totalBeds', 'isActive']
    
    for field in fields:
        if field in data:
            update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Room.update(db, id, update_data)
    
    # Get updated room
    updated_room = Room.find_by_id(db, id)
    
    return jsonify({'success': True, 'room': updated_room})

@app.route('/api/rooms/<id>', methods=['DELETE'])
def delete_room(id):
    """Delete a room"""
    db = get_db()
    room = Room.find_by_id(db, id)
    
    if not room:
        return jsonify({'success': False, 'error': 'Room not found'}), 404
    
    # Check if room has beds
    room_beds = Bed.find_by_room(db, id)
    if room_beds:
        return jsonify({'success': False, 'error': 'Cannot delete a room with beds. Delete the beds first.'}), 400
    
    Room.delete(db, id)
    
    return jsonify({'success': True})

# Bed routes
@app.route('/api/beds/room/<room_id>', methods=['GET'])
def get_beds_by_room(room_id):
    """Get beds by room"""
    db = get_db()
    beds = Bed.find_by_room(db, room_id)
    
    # Get patient details for occupied beds
    for bed in beds:
        if bed['status'] == 'OCCUPIED' and bed.get('patientId'):
            patient = Patient.find_by_id(db, bed['patientId'])
            if patient:
                bed['patient'] = {
                    'id': patient['id'],
                    'patientId': patient.get('patientId', ''),
                    'name': f"{patient['firstName']} {patient['lastName']}",
                    'gender': patient['gender'],
                    'age': patient['age']
                }
    
    return jsonify({'success': True, 'beds': beds})

@app.route('/api/beds/<id>', methods=['GET'])
def get_bed(id):
    """Get a bed by ID"""
    db = get_db()
    bed = Bed.find_by_id(db, id)
    
    if not bed:
        return jsonify({'success': False, 'error': 'Bed not found'}), 404
    
    # Get patient details if bed is occupied
    if bed['status'] == 'OCCUPIED' and bed.get('patientId'):
        patient = Patient.find_by_id(db, bed['patientId'])
        if patient:
            bed['patient'] = {
                'id': patient['id'],
                'patientId': patient.get('patientId', ''),
                'name': f"{patient['firstName']} {patient['lastName']}",
                'gender': patient['gender'],
                'age': patient['age']
            }
    
    # Get room details
    room = Room.find_by_id(db, bed['roomId'])
    if room:
        bed['room'] = {
            'id': room['id'],
            'roomNumber': room['roomNumber'],
            'roomType': room['roomType']
        }
    
    return jsonify({'success': True, 'bed': bed})

@app.route('/api/beds', methods=['POST'])
def create_bed():
    """Create a new bed"""
    data = request.json
    
    required_fields = ['bedNumber', 'roomId', 'clinicId']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
    
    # Get current user from token
    token = request.cookies.get('auth-token')
    if not token:
        return jsonify({'success': False, 'error': 'Authentication required'}), 401
    
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    
    # Check if room exists
    room = Room.find_by_id(db, data['roomId'])
    if not room:
        return jsonify({'success': False, 'error': 'Room not found'}), 404
    
    # Check if bed number already exists in this room
    existing_beds = Bed.find_by_room(db, data['roomId'])
    if any(b['bedNumber'] == data['bedNumber'] for b in existing_beds):
        return jsonify({'success': False, 'error': 'Bed number already exists in this room'}), 400
    
    bed_data = {
        'bedNumber': data['bedNumber'],
        'roomId': data['roomId'],
        'status': 'AVAILABLE',
        'clinicId': data['clinicId'],
        'createdById': user_data['id'],
        'notes': data.get('notes'),
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat()
    }
    
    bed_id = Bed.create(db, bed_data)
    bed_data['id'] = bed_id
    
    return jsonify({'success': True, 'bed': bed_data})

@app.route('/api/beds/<id>', methods=['PATCH'])
def update_bed(id):
    """Update a bed"""
    data = request.json
    
    db = get_db()
    bed = Bed.find_by_id(db, id)
    
    if not bed:
        return jsonify({'success': False, 'error': 'Bed not found'}), 404
    
    # Handle different types of updates based on the action
    action = data.get('action')
    
    if action == 'assign':
        if not data.get('patientId') or not data.get('admissionDate'):
            return jsonify({'success': False, 'error': 'Patient ID and admission date are required for assignment'}), 400
        
        # Check if bed is available
        if bed['status'] != 'AVAILABLE':
            return jsonify({'success': False, 'error': 'Bed is not available'}), 400
        
        # Check if patient exists
        patient = Patient.find_by_id(db, data['patientId'])
        if not patient:
            return jsonify({'success': False, 'error': 'Patient not found'}), 404
        
        update_data = {
            'status': 'OCCUPIED',
            'patientId': data['patientId'],
            'admissionDate': data['admissionDate'],
            'dischargeDate': data.get('dischargeDate'),
            'updatedAt': datetime.utcnow().isoformat()
        }
    elif action == 'discharge':
        # Check if bed is occupied
        if bed['status'] != 'OCCUPIED':
            return jsonify({'success': False, 'error': 'Bed is not occupied'}), 400
        
        update_data = {
            'status': 'AVAILABLE',
            'patientId': None,
            'admissionDate': None,
            'dischargeDate': None,
            'updatedAt': datetime.utcnow().isoformat()
        }
    elif action == 'reserve':
        # Check if bed is available
        if bed['status'] != 'AVAILABLE':
            return jsonify({'success': False, 'error': 'Bed is not available'}), 400
        
        update_data = {
            'status': 'RESERVED',
            'updatedAt': datetime.utcnow().isoformat()
        }
    else:
        # Regular update
        update_data = {}
        fields = ['bedNumber', 'status', 'notes']
        
        for field in fields:
            if field in data:
                update_data[field] = data[field]
        
        update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    Bed.update(db, id, update_data)
    
    # Get updated bed
    updated_bed = Bed.find_by_id(db, id)
    
    return jsonify({'success': True, 'bed': updated_bed})

@app.route('/api/beds/<id>', methods=['DELETE'])
def delete_bed(id):
    """Delete a bed"""
    db = get_db()
    bed = Bed.find_by_id(db, id)
    
    if not bed:
        return jsonify({'success': False, 'error': 'Bed not found'}), 404
    
    # Check if bed is occupied or reserved
    if bed['status'] in ['OCCUPIED', 'RESERVED']:
        return jsonify({'success': False, 'error': 'Cannot delete an occupied or reserved bed'}), 400
    
    Bed.delete(db, id)
    
    return jsonify({'success': True})

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)