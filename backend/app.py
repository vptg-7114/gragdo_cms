from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from functools import wraps
from dotenv import load_dotenv

from database import init_db, get_db, seed_demo_data
from models import User, Clinic, Doctor, Patient, Appointment, Prescription, Medicine, Room, Bed, Transaction, Invoice, Treatment

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'fallback-secret-key')
app.config['DATABASE_URL'] = os.environ.get('DATABASE_URL', 'sqlite:///digigo_care.db')

# Configure CORS
cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

# Initialize database
with app.app_context():
    init_db()
    seed_demo_data()

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in cookies
        if 'auth-token' in request.cookies:
            token = request.cookies.get('auth-token')
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'success': False, 'error': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            db = get_db()
            current_user = User.find_by_id(db, data['id'])
            if not current_user:
                return jsonify({'success': False, 'error': 'Invalid token!'}), 401
        except:
            return jsonify({'success': False, 'error': 'Invalid token!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({'success': False, 'error': 'Email, password, and role are required!'}), 400
    
    db = get_db()
    user = User.find_by_email_and_role(db, data['email'], data['role'])
    
    if not user:
        return jsonify({'success': False, 'error': 'Invalid email or role!'}), 401
    
    if check_password_hash(user['password'], data['password']):
        # Generate token
        token = jwt.encode({
            'id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        # Create response
        response = make_response(jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'clinicId': user.get('clinicId'),
                'clinicIds': json.loads(user['clinicIds']) if user.get('clinicIds') else None
            }
        }))
        
        # Set cookie
        response.set_cookie(
            'auth-token', 
            token, 
            httponly=True, 
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=60*60*24*7  # 7 days
        )
        
        return response
    
    return jsonify({'success': False, 'error': 'Invalid password!'}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    required_fields = ['firstName', 'lastName', 'email', 'phone', 'role', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required!'}), 400
    
    # Check if email already exists
    db = get_db()
    existing_user = User.find_by_email(db, data['email'])
    
    if existing_user:
        return jsonify({'success': False, 'error': 'Email already exists!'}), 400
    
    # Create new user
    import uuid
    
    user_id = str(uuid.uuid4())
    now = datetime.datetime.utcnow().isoformat()
    
    # Combine first and last name
    name = f"{data['firstName']} {data['lastName']}"
    
    # Hash password
    hashed_password = generate_password_hash(data['password'])
    
    # Create user object
    user_data = {
        'id': user_id,
        'name': name,
        'email': data['email'],
        'password': hashed_password,
        'phone': data['phone'],
        'role': data['role'],
        'clinicId': data.get('clinicId'),
        'clinicIds': json.dumps([data.get('clinicId')]) if data.get('clinicId') else None,
        'isActive': 1,
        'createdAt': now,
        'updatedAt': now
    }
    
    # Save user to database
    User.create(db, user_data)
    
    # Generate token
    token = jwt.encode({
        'id': user_id,
        'email': data['email'],
        'role': data['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    # Create response
    response = make_response(jsonify({
        'success': True,
        'user': {
            'id': user_id,
            'name': name,
            'email': data['email'],
            'role': data['role'],
            'clinicId': data.get('clinicId'),
            'clinicIds': [data.get('clinicId')] if data.get('clinicId') else None
        }
    }))
    
    # Set cookie
    response.set_cookie(
        'auth-token', 
        token, 
        httponly=True, 
        secure=False,  # Set to True in production with HTTPS
        samesite='Lax',
        max_age=60*60*24*7  # 7 days
    )
    
    return response

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'success': True}))
    response.delete_cookie('auth-token')
    return response

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'success': True,
        'user': {
            'id': current_user['id'],
            'name': current_user['name'],
            'email': current_user['email'],
            'role': current_user['role'],
            'clinicId': current_user.get('clinicId'),
            'clinicIds': json.loads(current_user['clinicIds']) if current_user.get('clinicIds') else None
        }
    })

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'success': False, 'error': 'Email is required!'}), 400
    
    # In a real app, you would send a password reset email
    # For this demo, we'll just return success
    
    return jsonify({
        'success': True,
        'message': 'Password reset email sent!'
    })

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or not data.get('token') or not data.get('newPassword'):
        return jsonify({'success': False, 'error': 'Token and new password are required!'}), 400
    
    # In a real app, you would verify the token and update the password
    # For this demo, we'll just return success
    
    return jsonify({
        'success': True,
        'message': 'Password reset successful!'
    })

# Clinic routes
@app.route('/api/clinics', methods=['GET'])
def get_clinics():
    db = get_db()
    clinics = Clinic.get_all(db)
    
    # Add stats to each clinic
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
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found!'}), 404
    
    # Add stats
    patients = Patient.find_by_clinic(db, clinic['id'])
    appointments = Appointment.find_by_clinic(db, clinic['id'])
    doctors = Doctor.find_by_clinic(db, clinic['id'])
    
    clinic['stats'] = {
        'patients': len(patients),
        'appointments': len(appointments),
        'doctors': len(doctors)
    }
    
    return jsonify({'success': True, 'clinic': clinic})

@app.route('/api/clinics', methods=['POST'])
@token_required
def create_clinic(current_user):
    data = request.get_json()
    
    required_fields = ['name', 'address', 'phone']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required!'}), 400
    
    # Create new clinic
    import uuid
    
    clinic_id = str(uuid.uuid4())
    now = datetime.datetime.utcnow().isoformat()
    
    # Create clinic object
    clinic_data = {
        'id': clinic_id,
        'name': data['name'],
        'address': data['address'],
        'phone': data['phone'],
        'email': data.get('email'),
        'description': data.get('description'),
        'createdById': current_user['id'],
        'createdAt': now,
        'updatedAt': now
    }
    
    # Save clinic to database
    db = get_db()
    Clinic.create(db, clinic_data)
    
    # If user is SUPER_ADMIN, add clinic to their clinicIds
    if current_user['role'] == 'SUPER_ADMIN':
        clinicIds = json.loads(current_user.get('clinicIds', '[]')) if current_user.get('clinicIds') else []
        clinicIds.append(clinic_id)
        
        User.update(db, current_user['id'], {
            'clinicIds': json.dumps(clinicIds),
            'updatedAt': now
        })
    
    return jsonify({'success': True, 'clinic': clinic_data})

@app.route('/api/clinics/<id>', methods=['PATCH'])
@token_required
def update_clinic(current_user, id):
    data = request.get_json()
    
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found!'}), 404
    
    # Update clinic
    update_data = {}
    for field in ['name', 'address', 'phone', 'email', 'description']:
        if field in data:
            update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.datetime.utcnow().isoformat()
    
    Clinic.update(db, id, update_data)
    
    # Get updated clinic
    updated_clinic = Clinic.find_by_id(db, id)
    
    return jsonify({'success': True, 'clinic': updated_clinic})

@app.route('/api/clinics/<id>', methods=['DELETE'])
@token_required
def delete_clinic(current_user, id):
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found!'}), 404
    
    # Check if clinic has associated data
    patients = Patient.find_by_clinic(db, id)
    if patients:
        return jsonify({'success': False, 'error': 'Cannot delete clinic with patients!'}), 400
    
    doctors = Doctor.find_by_clinic(db, id)
    if doctors:
        return jsonify({'success': False, 'error': 'Cannot delete clinic with doctors!'}), 400
    
    # Delete clinic
    Clinic.delete(db, id)
    
    return jsonify({'success': True})

# Doctor routes
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    if clinic_id:
        doctors = Doctor.find_by_clinic(db, clinic_id)
    else:
        doctors = Doctor.get_all(db)
    
    return jsonify({'success': True, 'doctors': doctors})

@app.route('/api/doctors/<id>', methods=['GET'])
def get_doctor(id):
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        return jsonify({'success': False, 'error': 'Doctor not found!'}), 404
    
    return jsonify({'success': True, 'doctor': doctor})

@app.route('/api/doctors', methods=['POST'])
@token_required
def create_doctor(current_user):
    data = request.get_json()
    
    required_fields = ['name', 'phone', 'specialization', 'clinicId']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required!'}), 400
    
    # Create new doctor
    import uuid
    
    doctor_id = str(uuid.uuid4())
    now = datetime.datetime.utcnow().isoformat()
    
    # Create doctor object
    doctor_data = {
        'id': doctor_id,
        'name': data['name'],
        'email': data.get('email'),
        'phone': data['phone'],
        'specialization': data['specialization'],
        'qualification': data.get('qualification'),
        'experience': data.get('experience'),
        'consultationFee': data.get('consultationFee'),
        'isAvailable': 1,
        'clinicId': data['clinicId'],
        'createdById': current_user['id'],
        'createdAt': now,
        'updatedAt': now
    }
    
    # Save doctor to database
    db = get_db()
    Doctor.create(db, doctor_data)
    
    return jsonify({'success': True, 'doctor': doctor_data})

@app.route('/api/doctors/<id>', methods=['PATCH'])
@token_required
def update_doctor(current_user, id):
    data = request.get_json()
    
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        return jsonify({'success': False, 'error': 'Doctor not found!'}), 404
    
    # Update doctor
    update_data = {}
    for field in ['name', 'email', 'phone', 'specialization', 'qualification', 'experience', 'consultationFee', 'isAvailable']:
        if field in data:
            if field == 'isAvailable':
                update_data[field] = 1 if data[field] else 0
            else:
                update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.datetime.utcnow().isoformat()
    
    Doctor.update(db, id, update_data)
    
    # Get updated doctor
    updated_doctor = Doctor.find_by_id(db, id)
    
    return jsonify({'success': True, 'doctor': updated_doctor})

@app.route('/api/doctors/<id>', methods=['DELETE'])
@token_required
def delete_doctor(current_user, id):
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        return jsonify({'success': False, 'error': 'Doctor not found!'}), 404
    
    # Check if doctor has appointments
    appointments = Appointment.find_by_doctor(db, id)
    if appointments:
        return jsonify({'success': False, 'error': 'Cannot delete doctor with appointments!'}), 400
    
    # Delete doctor
    Doctor.delete(db, id)
    
    return jsonify({'success': True})

# Patient routes
@app.route('/api/patients', methods=['GET'])
def get_patients():
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    if clinic_id:
        patients = Patient.find_by_clinic(db, clinic_id)
    else:
        patients = Patient.get_all(db)
    
    # Format patient data
    formatted_patients = []
    for patient in patients:
        formatted_patient = {
            'id': patient['id'],
            'patientId': patient['patientId'],
            'name': f"{patient['firstName']} {patient['lastName']}",
            'email': patient.get('email'),
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age'],
            'address': patient.get('address'),
            'medicalHistory': patient.get('medicalHistory'),
            'allergies': patient.get('allergies'),
            'clinicId': patient['clinicId'],
            'createdAt': patient['createdAt']
        }
        formatted_patients.append(formatted_patient)
    
    return jsonify({'success': True, 'patients': formatted_patients})

@app.route('/api/patients/<id>', methods=['GET'])
def get_patient(id):
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        return jsonify({'success': False, 'error': 'Patient not found!'}), 404
    
    # Format patient data
    formatted_patient = {
        'id': patient['id'],
        'patientId': patient['patientId'],
        'name': f"{patient['firstName']} {patient['lastName']}",
        'email': patient.get('email'),
        'phone': patient['phone'],
        'gender': patient['gender'],
        'age': patient['age'],
        'address': patient.get('address'),
        'medicalHistory': patient.get('medicalHistory'),
        'allergies': patient.get('allergies'),
        'clinicId': patient['clinicId'],
        'createdAt': patient['createdAt']
    }
    
    return jsonify({'success': True, 'patient': formatted_patient})

@app.route('/api/patients', methods=['POST'])
@token_required
def create_patient(current_user):
    data = request.get_json()
    
    required_fields = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'clinicId']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required!'}), 400
    
    # Calculate age from date of birth
    try:
        dob = datetime.datetime.fromisoformat(data['dateOfBirth'].replace('Z', '+00:00'))
        today = datetime.datetime.utcnow()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    except:
        return jsonify({'success': False, 'error': 'Invalid date of birth!'}), 400
    
    # Create new patient
    import uuid
    
    patient_id = str(uuid.uuid4())
    now = datetime.datetime.utcnow().isoformat()
    
    # Generate a unique patient ID with prefix PAT
    import random
    patient_id_number = f"PAT{random.randint(100000, 999999)}"
    
    # Create patient object
    patient_data = {
        'id': patient_id,
        'patientId': patient_id_number,
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
        'allergies': json.dumps(data.get('allergies', [])) if isinstance(data.get('allergies'), list) else data.get('allergies'),
        'emergencyContact': json.dumps(data.get('emergencyContact')) if data.get('emergencyContact') else None,
        'clinicId': data['clinicId'],
        'createdById': current_user['id'],
        'isActive': 1,
        'createdAt': now,
        'updatedAt': now
    }
    
    # Save patient to database
    db = get_db()
    Patient.create(db, patient_data)
    
    # Format response
    formatted_patient = {
        'id': patient_id,
        'patientId': patient_id_number,
        'name': f"{data['firstName']} {data['lastName']}",
        'email': data.get('email'),
        'phone': data['phone'],
        'gender': data['gender'],
        'age': age,
        'address': data.get('address'),
        'medicalHistory': data.get('medicalHistory'),
        'allergies': data.get('allergies'),
        'clinicId': data['clinicId'],
        'createdAt': now
    }
    
    return jsonify({'success': True, 'patient': formatted_patient})

@app.route('/api/patients/<id>', methods=['PATCH'])
@token_required
def update_patient(current_user, id):
    data = request.get_json()
    
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        return jsonify({'success': False, 'error': 'Patient not found!'}), 404
    
    # Update patient
    update_data = {}
    for field in ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'bloodGroup', 
                 'address', 'city', 'state', 'postalCode', 'medicalHistory', 'allergies', 
                 'emergencyContact', 'isActive']:
        if field in data:
            if field == 'isActive':
                update_data[field] = 1 if data[field] else 0
            elif field in ['allergies', 'emergencyContact'] and isinstance(data[field], (dict, list)):
                update_data[field] = json.dumps(data[field])
            else:
                update_data[field] = data[field]
    
    # Recalculate age if date of birth is updated
    if 'dateOfBirth' in update_data:
        try:
            dob = datetime.datetime.fromisoformat(update_data['dateOfBirth'].replace('Z', '+00:00'))
            today = datetime.datetime.utcnow()
            update_data['age'] = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        except:
            return jsonify({'success': False, 'error': 'Invalid date of birth!'}), 400
    
    update_data['updatedAt'] = datetime.datetime.utcnow().isoformat()
    
    Patient.update(db, id, update_data)
    
    # Get updated patient
    updated_patient = Patient.find_by_id(db, id)
    
    # Format response
    formatted_patient = {
        'id': updated_patient['id'],
        'patientId': updated_patient['patientId'],
        'name': f"{updated_patient['firstName']} {updated_patient['lastName']}",
        'email': updated_patient.get('email'),
        'phone': updated_patient['phone'],
        'gender': updated_patient['gender'],
        'age': updated_patient['age'],
        'address': updated_patient.get('address'),
        'medicalHistory': updated_patient.get('medicalHistory'),
        'allergies': json.loads(updated_patient['allergies']) if updated_patient.get('allergies') and updated_patient['allergies'].startswith('[') else updated_patient.get('allergies'),
        'clinicId': updated_patient['clinicId'],
        'createdAt': updated_patient['createdAt']
    }
    
    return jsonify({'success': True, 'patient': formatted_patient})

@app.route('/api/patients/<id>', methods=['DELETE'])
@token_required
def delete_patient(current_user, id):
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        return jsonify({'success': False, 'error': 'Patient not found!'}), 404
    
    # Check if patient has appointments
    appointments = Appointment.find_by_patient(db, id)
    if appointments:
        return jsonify({'success': False, 'error': 'Cannot delete patient with appointments!'}), 400
    
    # Delete patient
    Patient.delete(db, id)
    
    return jsonify({'success': True})

# Appointment routes
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    patient_id = request.args.get('patientId')
    status = request.args.get('status')
    
    db = get_db()
    appointments = Appointment.get_all(db, clinic_id, doctor_id, patient_id, status)
    
    # Enrich appointments with patient and doctor data
    enriched_appointments = []
    for appointment in appointments:
        patient = Patient.find_by_id(db, appointment['patientId'])
        doctor = Doctor.find_by_id(db, appointment['doctorId'])
        
        enriched_appointment = {
            'id': appointment['id'],
            'appointmentDate': appointment['appointmentDate'],
            'duration': appointment['duration'],
            'concern': appointment['concern'],
            'status': appointment['status'],
            'patient': {
                'patientId': patient['patientId'],
                'name': f"{patient['firstName']} {patient['lastName']}",
                'phone': patient['phone'],
                'gender': patient['gender'],
                'age': patient['age']
            },
            'doctor': {
                'name': doctor['name']
            }
        }
        
        enriched_appointments.append(enriched_appointment)
    
    return jsonify({'success': True, 'appointments': enriched_appointments})

@app.route('/api/appointments/<id>', methods=['GET'])
def get_appointment(id):
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        return jsonify({'success': False, 'error': 'Appointment not found!'}), 404
    
    # Enrich appointment with patient and doctor data
    patient = Patient.find_by_id(db, appointment['patientId'])
    doctor = Doctor.find_by_id(db, appointment['doctorId'])
    
    enriched_appointment = {
        'id': appointment['id'],
        'appointmentDate': appointment['appointmentDate'],
        'startTime': appointment['startTime'],
        'endTime': appointment['endTime'],
        'duration': appointment['duration'],
        'type': appointment['type'],
        'concern': appointment['concern'],
        'notes': appointment.get('notes'),
        'status': appointment['status'],
        'vitals': json.loads(appointment['vitals']) if appointment.get('vitals') else None,
        'followUpDate': appointment.get('followUpDate'),
        'patient': {
            'id': patient['id'],
            'patientId': patient['patientId'],
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        },
        'doctor': {
            'id': doctor['id'],
            'name': doctor['name'],
            'specialization': doctor['specialization']
        }
    }
    
    return jsonify({'success': True, 'appointment': enriched_appointment})

@app.route('/api/appointments', methods=['POST'])
@token_required
def create_appointment(current_user):
    data = request.get_json()
    
    required_fields = ['patientId', 'doctorId', 'clinicId', 'appointmentDate', 'startTime', 'endTime', 'duration', 'concern']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required!'}), 400
    
    # Create new appointment
    import uuid
    import random
    
    appointment_id = str(uuid.uuid4())
    appointment_id_number = f"APT{random.randint(100000, 999999)}"
    now = datetime.datetime.utcnow().isoformat()
    
    # Create appointment object
    appointment_data = {
        'id': appointment_id,
        'appointmentId': appointment_id_number,
        'patientId': data['patientId'],
        'doctorId': data['doctorId'],
        'clinicId': data['clinicId'],
        'appointmentDate': data['appointmentDate'],
        'startTime': data['startTime'],
        'endTime': data['endTime'],
        'duration': data['duration'],
        'type': data.get('type', 'REGULAR'),
        'status': 'SCHEDULED',
        'concern': data['concern'],
        'notes': data.get('notes'),
        'createdById': current_user['id'],
        'isFollowUp': 1 if data.get('isFollowUp') else 0,
        'previousAppointmentId': data.get('previousAppointmentId'),
        'createdAt': now,
        'updatedAt': now
    }
    
    # Save appointment to database
    db = get_db()
    Appointment.create(db, appointment_data)
    
    # Get patient and doctor data for response
    patient = Patient.find_by_id(db, data['patientId'])
    doctor = Doctor.find_by_id(db, data['doctorId'])
    
    # Format response
    formatted_appointment = {
        'id': appointment_id,
        'appointmentDate': data['appointmentDate'],
        'startTime': data['startTime'],
        'endTime': data['endTime'],
        'duration': data['duration'],
        'type': data.get('type', 'REGULAR'),
        'concern': data['concern'],
        'status': 'SCHEDULED',
        'patient': {
            'patientId': patient['patientId'],
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        },
        'doctor': {
            'name': doctor['name']
        }
    }
    
    return jsonify({'success': True, 'appointment': formatted_appointment})

@app.route('/api/appointments/<id>', methods=['PATCH'])
@token_required
def update_appointment(current_user, id):
    data = request.get_json()
    
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        return jsonify({'success': False, 'error': 'Appointment not found!'}), 404
    
    # Handle different types of updates based on the action
    action = data.get('action')
    update_data = {}
    
    if action == 'checkIn':
        update_data['status'] = 'CHECKED_IN'
    elif action == 'start':
        update_data['status'] = 'IN_PROGRESS'
    elif action == 'complete':
        update_data['status'] = 'COMPLETED'
        if data.get('vitals'):
            update_data['vitals'] = json.dumps(data['vitals'])
        if data.get('notes'):
            update_data['notes'] = data['notes']
        if data.get('followUpDate'):
            update_data['followUpDate'] = data['followUpDate']
    elif action == 'reschedule':
        if not all(field in data for field in ['appointmentDate', 'startTime', 'endTime', 'duration']):
            return jsonify({'success': False, 'error': 'Required fields for rescheduling are missing!'}), 400
        
        update_data['appointmentDate'] = data['appointmentDate']
        update_data['startTime'] = data['startTime']
        update_data['endTime'] = data['endTime']
        update_data['duration'] = data['duration']
        update_data['status'] = 'SCHEDULED'
    elif action == 'cancel':
        if not data.get('cancelReason') or not data.get('cancelledById'):
            return jsonify({'success': False, 'error': 'Reason and canceller ID are required for cancellation!'}), 400
        
        update_data['status'] = 'CANCELLED'
        update_data['cancelledAt'] = datetime.datetime.utcnow().isoformat()
        update_data['cancelledById'] = data['cancelledById']
        update_data['cancelReason'] = data['cancelReason']
    else:
        # Regular update
        for field in ['appointmentDate', 'startTime', 'endTime', 'duration', 'type', 'concern', 'notes', 'status', 'vitals', 'followUpDate']:
            if field in data:
                if field == 'vitals' and isinstance(data[field], dict):
                    update_data[field] = json.dumps(data[field])
                else:
                    update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.datetime.utcnow().isoformat()
    
    Appointment.update(db, id, update_data)
    
    # Get updated appointment
    updated_appointment = Appointment.find_by_id(db, id)
    
    # Enrich appointment with patient and doctor data
    patient = Patient.find_by_id(db, updated_appointment['patientId'])
    doctor = Doctor.find_by_id(db, updated_appointment['doctorId'])
    
    enriched_appointment = {
        'id': updated_appointment['id'],
        'appointmentDate': updated_appointment['appointmentDate'],
        'startTime': updated_appointment['startTime'],
        'endTime': updated_appointment['endTime'],
        'duration': updated_appointment['duration'],
        'type': updated_appointment['type'],
        'concern': updated_appointment['concern'],
        'notes': updated_appointment.get('notes'),
        'status': updated_appointment['status'],
        'vitals': json.loads(updated_appointment['vitals']) if updated_appointment.get('vitals') else None,
        'followUpDate': updated_appointment.get('followUpDate'),
        'patient': {
            'patientId': patient['patientId'],
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        },
        'doctor': {
            'name': doctor['name']
        }
    }
    
    return jsonify({'success': True, 'appointment': enriched_appointment})

@app.route('/api/appointments/<id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, id):
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        return jsonify({'success': False, 'error': 'Appointment not found!'}), 404
    
    # Delete appointment
    Appointment.delete(db, id)
    
    return jsonify({'success': True})

# Profile routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('userId')
    
    db = get_db()
    
    # If no user ID is provided, try to get it from the token
    if not user_id:
        token = request.cookies.get('auth-token')
        if not token:
            return jsonify({'success': False, 'error': 'Authentication required!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = data['id']
        except:
            return jsonify({'success': False, 'error': 'Invalid token!'}), 401
    
    user = User.find_by_id(db, user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found!'}), 404
    
    # Get clinic details if user has a clinicId
    clinic = None
    if user.get('clinicId'):
        clinic = Clinic.find_by_id(db, user['clinicId'])
    
    # Get all clinics if user is SUPER_ADMIN
    clinics = []
    if user['role'] == 'SUPER_ADMIN' and user.get('clinicIds'):
        clinic_ids = json.loads(user['clinicIds'])
        for clinic_id in clinic_ids:
            clinic_data = Clinic.find_by_id(db, clinic_id)
            if clinic_data:
                clinics.append({
                    'id': clinic_data['id'],
                    'name': clinic_data['name'],
                    'address': clinic_data['address']
                })
    
    # Format profile data
    profile = {
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'phone': user.get('phone'),
        'role': user['role'],
        'address': None,  # Not stored in user table
        'bio': None,  # Not stored in user table
        'profileImage': None,  # Not stored in user table
        'clinic': {
            'id': clinic['id'],
            'name': clinic['name'],
            'address': clinic['address']
        } if clinic else None,
        'clinicId': user.get('clinicId'),
        'clinicIds': json.loads(user['clinicIds']) if user.get('clinicIds') else None,
        'clinics': clinics,
        'createdAt': user['createdAt']
    }
    
    return jsonify({'success': True, 'profile': profile})

@app.route('/api/profile', methods=['PATCH'])
def update_profile():
    data = request.get_json()
    
    if not data.get('userId'):
        return jsonify({'success': False, 'error': 'User ID is required!'}), 400
    
    db = get_db()
    user = User.find_by_id(db, data['userId'])
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found!'}), 404
    
    # Update user
    update_data = {}
    for field in ['name', 'email', 'phone']:
        if field in data:
            update_data[field] = data[field]
    
    update_data['updatedAt'] = datetime.datetime.utcnow().isoformat()
    
    User.update(db, data['userId'], update_data)
    
    return jsonify({'success': True})

# Add more routes for other resources as needed...

# Dashboard routes
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    
    # Get patients
    patients = Patient.find_by_clinic(db, clinic_id)
    total_patients = len(patients)
    
    # Count patients by gender
    male_patients = len([p for p in patients if p['gender'] == 'MALE'])
    female_patients = len([p for p in patients if p['gender'] == 'FEMALE'])
    
    # Count child patients (age < 18)
    child_patients = len([p for p in patients if p['age'] < 18])
    
    # Get today's appointments
    today = datetime.datetime.utcnow().strftime('%Y-%m-%d')
    
    if doctor_id:
        today_appointments = [a for a in Appointment.find_by_doctor(db, doctor_id) 
                             if a['appointmentDate'].startswith(today)]
    else:
        today_appointments = [a for a in Appointment.find_by_clinic(db, clinic_id) 
                             if a['appointmentDate'].startswith(today)]
    
    # Count today's patients (unique patients with appointments today)
    today_patient_ids = set(a['patientId'] for a in today_appointments)
    today_patients = len(today_patient_ids)
    
    # Count available doctors
    doctors = Doctor.find_by_clinic(db, clinic_id)
    available_doctors = len([d for d in doctors if d['isAvailable'] == 1])
    
    # Count check-ins (appointments with status CHECKED_IN or later)
    check_ins = len([a for a in today_appointments 
                    if a['status'] in ['CHECKED_IN', 'IN_PROGRESS', 'COMPLETED']])
    
    stats = {
        'todayAppointments': len(today_appointments),
        'todayPatients': today_patients,
        'totalPatients': total_patients,
        'malePatients': male_patients,
        'femalePatients': female_patients,
        'childPatients': child_patients,
        'availableDoctors': available_doctors,
        'checkIns': check_ins,
        'appointments': len(today_appointments)  # For backward compatibility
    }
    
    return jsonify({'success': True, 'stats': stats})

@app.route('/api/dashboard/appointments', methods=['GET'])
def get_recent_appointments():
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    
    # Get recent appointments
    if doctor_id:
        appointments = Appointment.find_by_doctor(db, doctor_id)
    else:
        appointments = Appointment.find_by_clinic(db, clinic_id)
    
    # Sort by appointmentDate in descending order
    appointments.sort(key=lambda a: a['appointmentDate'], reverse=True)
    
    # Limit to 10 most recent
    recent_appointments = appointments[:10]
    
    # Enrich appointments with patient and doctor data
    enriched_appointments = []
    for appointment in recent_appointments:
        patient = Patient.find_by_id(db, appointment['patientId'])
        doctor = Doctor.find_by_id(db, appointment['doctorId'])
        
        enriched_appointment = {
            'id': appointment['id'],
            'appointmentDate': appointment['appointmentDate'],
            'duration': appointment['duration'],
            'concern': appointment['concern'],
            'status': appointment['status'],
            'patient': {
                'patientId': patient['patientId'],
                'name': f"{patient['firstName']} {patient['lastName']}",
                'phone': patient['phone'],
                'gender': patient['gender'],
                'age': patient['age']
            },
            'doctor': {
                'name': doctor['name']
            }
        }
        
        enriched_appointments.append(enriched_appointment)
    
    return jsonify({'success': True, 'appointments': enriched_appointments})

@app.route('/api/dashboard/doctors-activity', methods=['GET'])
def get_doctors_activity():
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    
    # Get doctors for this clinic
    doctors = Doctor.find_by_clinic(db, clinic_id)
    
    # Get appointments for each doctor
    doctors_activity = []
    for doctor in doctors:
        appointments = Appointment.find_by_doctor(db, doctor['id'])
        
        # Count appointments by status
        in_progress = len([a for a in appointments if a['status'] == 'IN_PROGRESS'])
        completed = len([a for a in appointments if a['status'] == 'COMPLETED'])
        pending = len([a for a in appointments if a['status'] in ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN']])
        
        doctors_activity.append({
            'id': doctor['id'],
            'name': doctor['name'],
            'specialization': doctor['specialization'],
            'isAvailable': doctor['isAvailable'] == 1,
            'appointments': {
                'inProgress': in_progress,
                'completed': completed,
                'pending': pending,
                'total': len(appointments)
            }
        })
    
    return jsonify({'success': True, 'doctorsActivity': doctors_activity})

@app.route('/api/dashboard/reports', methods=['GET'])
def get_recent_reports():
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    # For demo purposes, return mock reports
    reports = [
        {
            'id': '1',
            'title': 'Monthly Revenue Report',
            'type': 'Financial',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=2),
            'size': '1.2 MB',
            'format': 'PDF'
        },
        {
            'id': '2',
            'title': 'Patient Demographics',
            'type': 'Analytics',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=5),
            'size': '850 KB',
            'format': 'Excel'
        },
        {
            'id': '3',
            'title': 'Doctor Performance',
            'type': 'Analytics',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=7),
            'size': '1.5 MB',
            'format': 'PDF'
        },
        {
            'id': '4',
            'title': 'Inventory Status',
            'type': 'Operational',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=10),
            'size': '720 KB',
            'format': 'Excel'
        }
    ]
    
    return jsonify({'success': True, 'reports': reports})

# Admin dashboard routes
@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    
    # Get counts
    patients = Patient.find_by_clinic(db, clinic_id)
    doctors = Doctor.find_by_clinic(db, clinic_id)
    staff = User.find_by_clinic_and_role(db, clinic_id, 'STAFF')
    
    # Get today's appointments
    today = datetime.datetime.utcnow().strftime('%Y-%m-%d')
    appointments = [a for a in Appointment.find_by_clinic(db, clinic_id) 
                   if a['appointmentDate'].startswith(today)]
    
    stats = {
        'totalPatients': len(patients),
        'appointments': len(appointments),
        'doctors': len(doctors),
        'staff': len(staff)
    }
    
    return jsonify({'success': True, 'stats': stats})

@app.route('/api/admin/doctors', methods=['GET'])
def get_admin_doctors():
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    doctors = Doctor.find_by_clinic(db, clinic_id)
    
    return jsonify({'success': True, 'doctors': doctors})

@app.route('/api/admin/staff', methods=['GET'])
def get_admin_staff():
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    staff = User.find_by_clinic_and_role(db, clinic_id, 'STAFF')
    
    return jsonify({'success': True, 'staff': staff})

@app.route('/api/admin/transactions', methods=['GET'])
def get_admin_transactions():
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    transactions = Transaction.get_all(db, {'clinicId': clinic_id})
    
    # Format for admin dashboard
    formatted_transactions = []
    for transaction in transactions[:10]:  # Limit to 10 most recent
        formatted_transaction = {
            'id': transaction['id'],
            'doctorName': 'Dr. K. Ranganath',  # Placeholder
            'testName': transaction['description'],
            'date': transaction['createdAt'].split('T')[0],
            'amount': transaction['amount']
        }
        formatted_transactions.append(formatted_transaction)
    
    return jsonify({'success': True, 'transactions': formatted_transactions})

@app.route('/api/admin/appointments', methods=['GET'])
def get_admin_appointments():
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required!'}), 400
    
    db = get_db()
    appointments = Appointment.find_by_clinic(db, clinic_id)
    
    # Format for admin dashboard
    formatted_appointments = []
    for i, appointment in enumerate(appointments[:10]):  # Limit to 10 most recent
        formatted_appointment = {
            'id': appointment['id'],
            'sNo': i + 1,
            'name': f"Patient {i + 1}",  # Placeholder
            'phoneNumber': '9876543210',  # Placeholder
            'email': f"patient{i+1}@example.com",  # Placeholder
            'age': 30 + i % 10,  # Placeholder
            'gender': 'Male' if i % 2 == 0 else 'Female',  # Placeholder
            'action': 'Accept' if i % 3 != 0 else 'Decline'  # Placeholder
        }
        formatted_appointments.append(formatted_appointment)
    
    return jsonify({'success': True, 'appointments': formatted_appointments})

# Analytics routes
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    # For demo purposes, return mock analytics data
    analytics_data = {
        'revenue': {
            'thisMonth': 250000,
            'lastMonth': 220000,
            'growth': 13
        },
        'patients': {
            'total': 2427,
            'growth': 8
        },
        'appointments': {
            'completionRate': 85,
            'total': 1850
        }
    }
    
    return jsonify({'success': True, 'data': analytics_data})

# Prescription routes
@app.route('/api/prescriptions', methods=['GET'])
def get_prescriptions():
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    patient_id = request.args.get('patientId')
    
    db = get_db()
    
    # Apply filters
    filters = {}
    if clinic_id:
        filters['clinicId'] = clinic_id
    if doctor_id:
        filters['doctorId'] = doctor_id
    if patient_id:
        filters['patientId'] = patient_id
    
    prescriptions = Prescription.get_all(db, filters if filters else None)
    
    # Enrich prescriptions with patient and doctor data
    enriched_prescriptions = []
    for prescription in prescriptions:
        patient = Patient.find_by_id(db, prescription['patientId'])
        doctor = Doctor.find_by_id(db, prescription['doctorId'])
        
        # For demo purposes, add mock reports and prescriptions
        reports = [
            {
                'id': f"report-{prescription['id']}-1",
                'name': 'Blood Test Report.pdf',
                'type': 'PDF',
                'url': 'https://example.com/reports/blood-test.pdf'
            },
            {
                'id': f"report-{prescription['id']}-2",
                'name': 'X-Ray Report.jpg',
                'type': 'Image',
                'url': 'https://example.com/reports/xray.jpg'
            }
        ]
        
        prescription_docs = [
            {
                'id': f"prescription-{prescription['id']}",
                'name': f"Prescription_{prescription['prescriptionId']}.pdf",
                'type': 'PDF',
                'url': prescription.get('documentUrl', 'https://example.com/prescriptions/prescription.pdf')
            }
        ]
        
        enriched_prescription = {
            'id': prescription['id'],
            'patientId': patient['patientId'],
            'patientName': f"{patient['firstName']} {patient['lastName']}",
            'doctorName': doctor['name'],
            'concern': patient.get('medicalHistory', 'General checkup'),
            'gender': patient['gender'],
            'age': patient['age'],
            'reports': reports,
            'prescriptions': prescription_docs,
            'createdAt': datetime.datetime.fromisoformat(prescription['createdAt'].replace('Z', '+00:00'))
        }
        
        enriched_prescriptions.append(enriched_prescription)
    
    return jsonify({'success': True, 'prescriptions': enriched_prescriptions})

# Add more routes as needed...

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)