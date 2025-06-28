from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import uuid
import os
import json
from functools import wraps
from dotenv import load_dotenv

from database import get_db, init_db, seed_demo_data
from models import User, Clinic, Doctor, Patient, Appointment, Prescription, Medicine, Room, Bed, Transaction, Invoice, Treatment, Document

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

# Initialize database
init_db()

# Seed demo data
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
            # Decode the token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            
            # Get the user from the database
            db = get_db()
            current_user = User.find_by_id(db, data['id'])
            db.close()
            
            if not current_user:
                return jsonify({'success': False, 'error': 'Invalid token!'}), 401
            
        except Exception as e:
            return jsonify({'success': False, 'error': 'Invalid token!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400
    
    db = get_db()
    user = User.find_by_email_and_role(db, data['email'], data['role'])
    
    if not user:
        db.close()
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    
    if check_password_hash(user['password'], data['password']):
        # Generate token
        token = jwt.encode({
            'id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        # Create response
        response = jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'clinicId': user.get('clinicId'),
                'clinicIds': json.loads(user['clinicIds']) if user.get('clinicIds') else None
            }
        })
        
        # Set cookie
        response.set_cookie(
            'auth-token',
            token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=60*60*24*7  # 7 days
        )
        
        db.close()
        return response
    
    db.close()
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    required_fields = ['firstName', 'lastName', 'email', 'phone', 'role', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400
    
    # Check if email already exists
    db = get_db()
    existing_user = User.find_by_email(db, data['email'])
    
    if existing_user:
        db.close()
        return jsonify({'success': False, 'error': 'Email already exists'}), 400
    
    # Create new user
    now = datetime.datetime.utcnow().isoformat()
    
    # For roles that require a clinic ID
    if data['role'] in ['ADMIN', 'STAFF', 'DOCTOR'] and not data.get('clinicId'):
        db.close()
        return jsonify({'success': False, 'error': 'Clinic ID is required for this role'}), 400
    
    # Hash the password
    hashed_password = generate_password_hash(data['password'])
    
    # Create user object
    user_id = str(uuid.uuid4())
    user_data = {
        'id': user_id,
        'name': f"{data['firstName']} {data['lastName']}",
        'email': data['email'],
        'password': hashed_password,
        'phone': data['phone'],
        'role': data['role'],
        'clinicId': data.get('clinicId'),
        'clinicIds': json.dumps([data.get('clinicId')]) if data.get('clinicId') and data['role'] == 'SUPER_ADMIN' else None,
        'isActive': 1,
        'createdAt': now,
        'updatedAt': now
    }
    
    # Insert user into database
    User.create(db, user_data)
    
    # Generate token
    token = jwt.encode({
        'id': user_id,
        'email': data['email'],
        'role': data['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    # Create response
    response = jsonify({
        'success': True,
        'user': {
            'id': user_id,
            'name': user_data['name'],
            'email': data['email'],
            'role': data['role'],
            'clinicId': data.get('clinicId'),
            'clinicIds': json.loads(user_data['clinicIds']) if user_data.get('clinicIds') else None
        }
    })
    
    # Set cookie
    response.set_cookie(
        'auth-token',
        token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite='Lax',
        max_age=60*60*24*7  # 7 days
    )
    
    db.close()
    return response

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'success': False, 'error': 'Email is required'}), 400
    
    # Check if user exists
    db = get_db()
    user = User.find_by_email(db, data['email'])
    
    if not user:
        db.close()
        # Don't reveal that the user doesn't exist for security reasons
        return jsonify({'success': True, 'message': 'If your email is registered, you will receive a password reset link'}), 200
    
    # In a real application, you would send an email with a reset link
    # For this demo, we'll just generate a token
    reset_token = jwt.encode({
        'id': user['id'],
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    # In a real app, you would store this token in the database and send an email
    # For now, we'll just return it in the response for testing
    db.close()
    return jsonify({
        'success': True,
        'message': 'If your email is registered, you will receive a password reset link',
        'token': reset_token  # Remove this in production
    }), 200

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or not data.get('token') or not data.get('newPassword'):
        return jsonify({'success': False, 'error': 'Token and new password are required'}), 400
    
    try:
        # Decode the token
        token_data = jwt.decode(data['token'], app.config['SECRET_KEY'], algorithms=["HS256"])
        
        # Check if token is expired
        if datetime.datetime.fromtimestamp(token_data['exp']) < datetime.datetime.utcnow():
            return jsonify({'success': False, 'error': 'Token has expired'}), 400
        
        # Get the user from the database
        db = get_db()
        user = User.find_by_id(db, token_data['id'])
        
        if not user:
            db.close()
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # Update the password
        hashed_password = generate_password_hash(data['newPassword'])
        User.update(db, user['id'], {'password': hashed_password, 'updatedAt': datetime.datetime.utcnow().isoformat()})
        
        db.close()
        return jsonify({'success': True, 'message': 'Password has been reset successfully'}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': 'Invalid token'}), 400

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    response = jsonify({'success': True})
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

# Profile routes
@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    user_id = request.args.get('userId', current_user['id'])
    
    db = get_db()
    user = User.find_by_id(db, user_id)
    
    if not user:
        db.close()
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    # Get clinic details if applicable
    clinic = None
    if user.get('clinicId'):
        clinic = Clinic.find_by_id(db, user['clinicId'])
    
    # Get clinics for super admin
    clinics = []
    if user['role'] == 'SUPER_ADMIN' and user.get('clinicIds'):
        clinic_ids = json.loads(user['clinicIds'])
        for clinic_id in clinic_ids:
            c = Clinic.find_by_id(db, clinic_id)
            if c:
                clinics.append({
                    'id': c['id'],
                    'name': c['name'],
                    'address': c['address']
                })
    
    profile = {
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'phone': user.get('phone'),
        'role': user['role'],
        'clinic': {
            'id': clinic['id'],
            'name': clinic['name'],
            'address': clinic['address']
        } if clinic else None,
        'clinicIds': json.loads(user['clinicIds']) if user.get('clinicIds') else None,
        'clinics': clinics,
        'createdAt': user['createdAt']
    }
    
    db.close()
    return jsonify({'success': True, 'profile': profile})

@app.route('/api/profile', methods=['PATCH'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    if not data or not data.get('userId'):
        return jsonify({'success': False, 'error': 'User ID is required'}), 400
    
    # Check if the user is updating their own profile or has admin rights
    if data['userId'] != current_user['id'] and current_user['role'] not in ['SUPER_ADMIN', 'ADMIN']:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    db = get_db()
    user = User.find_by_id(db, data['userId'])
    
    if not user:
        db.close()
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    # Update user data
    update_data = {
        'updatedAt': datetime.datetime.utcnow().isoformat()
    }
    
    if data.get('name'):
        update_data['name'] = data['name']
    
    if data.get('email'):
        update_data['email'] = data['email']
    
    if data.get('phone'):
        update_data['phone'] = data['phone']
    
    User.update(db, data['userId'], update_data)
    
    db.close()
    return jsonify({'success': True})

# Clinic routes
@app.route('/api/clinics', methods=['GET'])
@token_required
def get_clinics(current_user):
    db = get_db()
    clinics = Clinic.get_all(db)
    
    # Enhance clinics with stats
    for clinic in clinics:
        # Get patient count
        cursor = db.cursor()
        cursor.execute('SELECT COUNT(*) as count FROM patients WHERE clinicId = ?', (clinic['id'],))
        patient_count = cursor.fetchone()['count']
        
        # Get appointment count
        cursor.execute('SELECT COUNT(*) as count FROM appointments WHERE clinicId = ?', (clinic['id'],))
        appointment_count = cursor.fetchone()['count']
        
        # Get doctor count
        cursor.execute('SELECT COUNT(*) as count FROM doctors WHERE clinicId = ?', (clinic['id'],))
        doctor_count = cursor.fetchone()['count']
        
        clinic['stats'] = {
            'patients': patient_count,
            'appointments': appointment_count,
            'doctors': doctor_count
        }
    
    db.close()
    return jsonify({'success': True, 'clinics': clinics})

@app.route('/api/clinics/<id>', methods=['GET'])
@token_required
def get_clinic(current_user, id):
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        db.close()
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Get stats
    cursor = db.cursor()
    
    # Get patient count
    cursor.execute('SELECT COUNT(*) as count FROM patients WHERE clinicId = ?', (id,))
    patient_count = cursor.fetchone()['count']
    
    # Get appointment count
    cursor.execute('SELECT COUNT(*) as count FROM appointments WHERE clinicId = ?', (id,))
    appointment_count = cursor.fetchone()['count']
    
    # Get doctor count
    cursor.execute('SELECT COUNT(*) as count FROM doctors WHERE clinicId = ?', (id,))
    doctor_count = cursor.fetchone()['count']
    
    clinic['stats'] = {
        'patients': patient_count,
        'appointments': appointment_count,
        'doctors': doctor_count
    }
    
    db.close()
    return jsonify({'success': True, 'clinic': clinic})

@app.route('/api/clinics', methods=['POST'])
@token_required
def create_clinic(current_user):
    data = request.get_json()
    
    required_fields = ['name', 'address', 'phone']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400
    
    # Create clinic
    now = datetime.datetime.utcnow().isoformat()
    
    clinic_data = {
        'id': str(uuid.uuid4()),
        'name': data['name'],
        'address': data['address'],
        'phone': data['phone'],
        'email': data.get('email'),
        'description': data.get('description'),
        'createdById': current_user['id'],
        'createdAt': now,
        'updatedAt': now
    }
    
    db = get_db()
    Clinic.create(db, clinic_data)
    
    # If the user is a super admin, add this clinic to their clinicIds
    if current_user['role'] == 'SUPER_ADMIN':
        clinic_ids = json.loads(current_user.get('clinicIds', '[]')) if current_user.get('clinicIds') else []
        clinic_ids.append(clinic_data['id'])
        User.update(db, current_user['id'], {'clinicIds': json.dumps(clinic_ids), 'updatedAt': now})
    
    db.close()
    return jsonify({'success': True, 'clinic': clinic_data})

@app.route('/api/clinics/<id>', methods=['PATCH'])
@token_required
def update_clinic(current_user, id):
    data = request.get_json()
    
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        db.close()
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Check if user has permission to update this clinic
    if current_user['role'] != 'SUPER_ADMIN' and (current_user['role'] != 'ADMIN' or current_user.get('clinicId') != id):
        db.close()
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    # Update clinic data
    update_data = {
        'updatedAt': datetime.datetime.utcnow().isoformat()
    }
    
    if data.get('name'):
        update_data['name'] = data['name']
    
    if data.get('address'):
        update_data['address'] = data['address']
    
    if data.get('phone'):
        update_data['phone'] = data['phone']
    
    if 'email' in data:
        update_data['email'] = data['email']
    
    if 'description' in data:
        update_data['description'] = data['description']
    
    Clinic.update(db, id, update_data)
    
    # Get updated clinic
    updated_clinic = Clinic.find_by_id(db, id)
    
    db.close()
    return jsonify({'success': True, 'clinic': updated_clinic})

@app.route('/api/clinics/<id>', methods=['DELETE'])
@token_required
def delete_clinic(current_user, id):
    # Only super admins can delete clinics
    if current_user['role'] != 'SUPER_ADMIN':
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        db.close()
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Check if clinic has any associated data
    cursor = db.cursor()
    
    # Check for doctors
    cursor.execute('SELECT COUNT(*) as count FROM doctors WHERE clinicId = ?', (id,))
    if cursor.fetchone()['count'] > 0:
        db.close()
        return jsonify({'success': False, 'error': 'Cannot delete clinic with associated doctors'}), 400
    
    # Check for patients
    cursor.execute('SELECT COUNT(*) as count FROM patients WHERE clinicId = ?', (id,))
    if cursor.fetchone()['count'] > 0:
        db.close()
        return jsonify({'success': False, 'error': 'Cannot delete clinic with associated patients'}), 400
    
    # Check for appointments
    cursor.execute('SELECT COUNT(*) as count FROM appointments WHERE clinicId = ?', (id,))
    if cursor.fetchone()['count'] > 0:
        db.close()
        return jsonify({'success': False, 'error': 'Cannot delete clinic with associated appointments'}), 400
    
    # Delete clinic
    Clinic.delete(db, id)
    
    # Remove clinic from super admin's clinicIds
    if current_user.get('clinicIds'):
        clinic_ids = json.loads(current_user['clinicIds'])
        if id in clinic_ids:
            clinic_ids.remove(id)
            User.update(db, current_user['id'], {
                'clinicIds': json.dumps(clinic_ids),
                'updatedAt': datetime.datetime.utcnow().isoformat()
            })
    
    db.close()
    return jsonify({'success': True})

# Doctor routes
@app.route('/api/doctors', methods=['GET'])
@token_required
def get_doctors(current_user):
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    
    if clinic_id:
        doctors = Doctor.find_by_clinic(db, clinic_id)
    else:
        doctors = Doctor.get_all(db)
    
    db.close()
    return jsonify({'success': True, 'doctors': doctors})

@app.route('/api/doctors/<id>', methods=['GET'])
@token_required
def get_doctor(current_user, id):
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        db.close()
        return jsonify({'success': False, 'error': 'Doctor not found'}), 404
    
    db.close()
    return jsonify({'success': True, 'doctor': doctor})

@app.route('/api/doctors', methods=['POST'])
@token_required
def create_doctor(current_user):
    data = request.get_json()
    
    required_fields = ['name', 'phone', 'specialization', 'clinicId']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400
    
    # Create doctor
    now = datetime.datetime.utcnow().isoformat()
    
    doctor_data = {
        'id': str(uuid.uuid4()),
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
    
    db = get_db()
    Doctor.create(db, doctor_data)
    
    db.close()
    return jsonify({'success': True, 'doctor': doctor_data})

@app.route('/api/doctors/<id>', methods=['PATCH'])
@token_required
def update_doctor(current_user, id):
    data = request.get_json()
    
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        db.close()
        return jsonify({'success': False, 'error': 'Doctor not found'}), 404
    
    # Update doctor data
    update_data = {
        'updatedAt': datetime.datetime.utcnow().isoformat()
    }
    
    if data.get('name'):
        update_data['name'] = data['name']
    
    if 'email' in data:
        update_data['email'] = data['email']
    
    if data.get('phone'):
        update_data['phone'] = data['phone']
    
    if data.get('specialization'):
        update_data['specialization'] = data['specialization']
    
    if 'qualification' in data:
        update_data['qualification'] = data['qualification']
    
    if 'experience' in data:
        update_data['experience'] = data['experience']
    
    if 'consultationFee' in data:
        update_data['consultationFee'] = data['consultationFee']
    
    if 'isAvailable' in data:
        update_data['isAvailable'] = 1 if data['isAvailable'] else 0
    
    Doctor.update(db, id, update_data)
    
    # Get updated doctor
    updated_doctor = Doctor.find_by_id(db, id)
    
    db.close()
    return jsonify({'success': True, 'doctor': updated_doctor})

@app.route('/api/doctors/<id>', methods=['DELETE'])
@token_required
def delete_doctor(current_user, id):
    db = get_db()
    doctor = Doctor.find_by_id(db, id)
    
    if not doctor:
        db.close()
        return jsonify({'success': False, 'error': 'Doctor not found'}), 404
    
    # Check if doctor has any associated appointments
    cursor = db.cursor()
    cursor.execute('SELECT COUNT(*) as count FROM appointments WHERE doctorId = ?', (id,))
    if cursor.fetchone()['count'] > 0:
        db.close()
        return jsonify({'success': False, 'error': 'Cannot delete doctor with associated appointments'}), 400
    
    # Delete doctor
    Doctor.delete(db, id)
    
    db.close()
    return jsonify({'success': True})

# Patient routes
@app.route('/api/patients', methods=['GET'])
@token_required
def get_patients(current_user):
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    
    if clinic_id:
        patients = Patient.find_by_clinic(db, clinic_id)
    else:
        patients = Patient.get_all(db)
    
    # Format patient names
    for patient in patients:
        patient['name'] = f"{patient['firstName']} {patient['lastName']}"
    
    db.close()
    return jsonify({'success': True, 'patients': patients})

@app.route('/api/patients/<id>', methods=['GET'])
@token_required
def get_patient(current_user, id):
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        db.close()
        return jsonify({'success': False, 'error': 'Patient not found'}), 404
    
    # Format patient name
    patient['name'] = f"{patient['firstName']} {patient['lastName']}"
    
    db.close()
    return jsonify({'success': True, 'patient': patient})

@app.route('/api/patients', methods=['POST'])
@token_required
def create_patient(current_user):
    data = request.get_json()
    
    required_fields = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'clinicId']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400
    
    # Calculate age from date of birth
    try:
        dob = datetime.datetime.fromisoformat(data['dateOfBirth'].replace('Z', '+00:00'))
        today = datetime.datetime.utcnow()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    except:
        age = 0
    
    # Create patient
    now = datetime.datetime.utcnow().isoformat()
    
    # Generate a unique patient ID
    patient_id = f"PAT{uuid.uuid4().hex[:6].upper()}"
    
    patient_data = {
        'id': str(uuid.uuid4()),
        'patientId': patient_id,
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
    
    db = get_db()
    Patient.create(db, patient_data)
    
    # Format patient name for response
    patient_data['name'] = f"{patient_data['firstName']} {patient_data['lastName']}"
    
    db.close()
    return jsonify({'success': True, 'patient': patient_data})

@app.route('/api/patients/<id>', methods=['PATCH'])
@token_required
def update_patient(current_user, id):
    data = request.get_json()
    
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        db.close()
        return jsonify({'success': False, 'error': 'Patient not found'}), 404
    
    # Update patient data
    update_data = {
        'updatedAt': datetime.datetime.utcnow().isoformat()
    }
    
    # Update fields if provided
    fields = [
        'firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth',
        'bloodGroup', 'address', 'city', 'state', 'postalCode',
        'medicalHistory', 'isActive'
    ]
    
    for field in fields:
        if field in data:
            update_data[field] = data[field]
    
    # Special handling for allergies and emergencyContact
    if 'allergies' in data:
        update_data['allergies'] = json.dumps(data['allergies']) if isinstance(data['allergies'], list) else data['allergies']
    
    if 'emergencyContact' in data:
        update_data['emergencyContact'] = json.dumps(data['emergencyContact']) if data['emergencyContact'] else None
    
    # Recalculate age if date of birth is updated
    if 'dateOfBirth' in data:
        try:
            dob = datetime.datetime.fromisoformat(data['dateOfBirth'].replace('Z', '+00:00'))
            today = datetime.datetime.utcnow()
            update_data['age'] = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        except:
            pass
    
    Patient.update(db, id, update_data)
    
    # Get updated patient
    updated_patient = Patient.find_by_id(db, id)
    
    # Format patient name
    updated_patient['name'] = f"{updated_patient['firstName']} {updated_patient['lastName']}"
    
    db.close()
    return jsonify({'success': True, 'patient': updated_patient})

@app.route('/api/patients/<id>', methods=['DELETE'])
@token_required
def delete_patient(current_user, id):
    db = get_db()
    patient = Patient.find_by_id(db, id)
    
    if not patient:
        db.close()
        return jsonify({'success': False, 'error': 'Patient not found'}), 404
    
    # Check if patient has any associated appointments
    cursor = db.cursor()
    cursor.execute('SELECT COUNT(*) as count FROM appointments WHERE patientId = ?', (id,))
    if cursor.fetchone()['count'] > 0:
        db.close()
        return jsonify({'success': False, 'error': 'Cannot delete patient with associated appointments'}), 400
    
    # Delete patient
    Patient.delete(db, id)
    
    db.close()
    return jsonify({'success': True})

# Appointment routes
@app.route('/api/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    patient_id = request.args.get('patientId')
    status = request.args.get('status')
    
    db = get_db()
    
    # Build conditions
    conditions = {}
    if clinic_id:
        conditions['clinicId'] = clinic_id
    if doctor_id:
        conditions['doctorId'] = doctor_id
    if patient_id:
        conditions['patientId'] = patient_id
    if status:
        conditions['status'] = status
    
    appointments = Appointment.get_all(db, conditions if conditions else None)
    
    # Enhance appointments with patient and doctor details
    enhanced_appointments = []
    for appointment in appointments:
        patient = Patient.find_by_id(db, appointment['patientId'])
        doctor = Doctor.find_by_id(db, appointment['doctorId'])
        
        if patient and doctor:
            enhanced_appointment = {
                **appointment,
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
            enhanced_appointments.append(enhanced_appointment)
    
    db.close()
    return jsonify({'success': True, 'appointments': enhanced_appointments})

@app.route('/api/appointments/<id>', methods=['GET'])
@token_required
def get_appointment(current_user, id):
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        db.close()
        return jsonify({'success': False, 'error': 'Appointment not found'}), 404
    
    # Get patient and doctor details
    patient = Patient.find_by_id(db, appointment['patientId'])
    doctor = Doctor.find_by_id(db, appointment['doctorId'])
    
    if patient and doctor:
        appointment['patient'] = {
            'patientId': patient['patientId'],
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        }
        appointment['doctor'] = {
            'name': doctor['name']
        }
    
    db.close()
    return jsonify({'success': True, 'appointment': appointment})

@app.route('/api/appointments', methods=['POST'])
@token_required
def create_appointment(current_user):
    data = request.get_json()
    
    required_fields = ['patientId', 'doctorId', 'clinicId', 'appointmentDate', 'startTime', 'endTime', 'duration', 'concern']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400
    
    # Create appointment
    now = datetime.datetime.utcnow().isoformat()
    
    # Generate a unique appointment ID
    appointment_id = f"APT{uuid.uuid4().hex[:6].upper()}"
    
    appointment_data = {
        'id': str(uuid.uuid4()),
        'appointmentId': appointment_id,
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
    
    db = get_db()
    Appointment.create(db, appointment_data)
    
    # Get patient and doctor details for response
    patient = Patient.find_by_id(db, data['patientId'])
    doctor = Doctor.find_by_id(db, data['doctorId'])
    
    if patient and doctor:
        appointment_data['patient'] = {
            'patientId': patient['patientId'],
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        }
        appointment_data['doctor'] = {
            'name': doctor['name']
        }
    
    db.close()
    return jsonify({'success': True, 'appointment': appointment_data})

@app.route('/api/appointments/<id>', methods=['PATCH'])
@token_required
def update_appointment(current_user, id):
    data = request.get_json()
    
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        db.close()
        return jsonify({'success': False, 'error': 'Appointment not found'}), 404
    
    # Update appointment data
    update_data = {
        'updatedAt': datetime.datetime.utcnow().isoformat()
    }
    
    # Handle different types of updates based on the action
    action = data.get('action')
    
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
        if not all(data.get(field) for field in ['appointmentDate', 'startTime', 'endTime', 'duration']):
            db.close()
            return jsonify({'success': False, 'error': 'Required fields for rescheduling are missing'}), 400
        
        update_data['appointmentDate'] = data['appointmentDate']
        update_data['startTime'] = data['startTime']
        update_data['endTime'] = data['endTime']
        update_data['duration'] = data['duration']
        update_data['status'] = 'RESCHEDULED'
    elif action == 'cancel':
        if not data.get('cancelReason') or not data.get('cancelledById'):
            db.close()
            return jsonify({'success': False, 'error': 'Reason and canceller ID are required for cancellation'}), 400
        
        update_data['status'] = 'CANCELLED'
        update_data['cancelledAt'] = datetime.datetime.utcnow().isoformat()
        update_data['cancelledById'] = data['cancelledById']
        update_data['cancelReason'] = data['cancelReason']
    else:
        # Regular update
        fields = [
            'appointmentDate', 'startTime', 'endTime', 'duration', 'type',
            'concern', 'notes', 'status', 'followUpDate'
        ]
        
        for field in fields:
            if field in data:
                update_data[field] = data[field]
        
        if data.get('vitals'):
            update_data['vitals'] = json.dumps(data['vitals'])
    
    Appointment.update(db, id, update_data)
    
    # Get updated appointment
    updated_appointment = Appointment.find_by_id(db, id)
    
    # Get patient and doctor details for response
    patient = Patient.find_by_id(db, updated_appointment['patientId'])
    doctor = Doctor.find_by_id(db, updated_appointment['doctorId'])
    
    if patient and doctor:
        updated_appointment['patient'] = {
            'patientId': patient['patientId'],
            'name': f"{patient['firstName']} {patient['lastName']}",
            'phone': patient['phone'],
            'gender': patient['gender'],
            'age': patient['age']
        }
        updated_appointment['doctor'] = {
            'name': doctor['name']
        }
    
    db.close()
    return jsonify({'success': True, 'appointment': updated_appointment})

@app.route('/api/appointments/<id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, id):
    db = get_db()
    appointment = Appointment.find_by_id(db, id)
    
    if not appointment:
        db.close()
        return jsonify({'success': False, 'error': 'Appointment not found'}), 404
    
    # Check if appointment has any associated prescriptions
    cursor = db.cursor()
    cursor.execute('SELECT COUNT(*) as count FROM prescriptions WHERE appointmentId = ?', (id,))
    if cursor.fetchone()['count'] > 0:
        db.close()
        return jsonify({'success': False, 'error': 'Cannot delete appointment with associated prescriptions'}), 400
    
    # Delete appointment
    Appointment.delete(db, id)
    
    db.close()
    return jsonify({'success': True})

# Prescription routes
@app.route('/api/prescriptions', methods=['GET'])
@token_required
def get_prescriptions(current_user):
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    patient_id = request.args.get('patientId')
    
    db = get_db()
    
    # Build conditions
    conditions = {}
    if clinic_id:
        conditions['clinicId'] = clinic_id
    if doctor_id:
        conditions['doctorId'] = doctor_id
    if patient_id:
        conditions['patientId'] = patient_id
    
    prescriptions = Prescription.get_all(db, conditions if conditions else None)
    
    # Enhance prescriptions with patient and doctor details
    enhanced_prescriptions = []
    for prescription in prescriptions:
        patient = Patient.find_by_id(db, prescription['patientId'])
        doctor = Doctor.find_by_id(db, prescription['doctorId'])
        
        if patient and doctor:
            # Parse medications JSON
            medications = json.loads(prescription['medications']) if isinstance(prescription['medications'], str) else prescription['medications']
            
            # Create enhanced prescription
            enhanced_prescription = {
                **prescription,
                'patientName': f"{patient['firstName']} {patient['lastName']}",
                'doctorName': doctor['name'],
                'gender': patient['gender'],
                'age': patient['age'],
                'concern': medications[0]['name'] if medications and len(medications) > 0 else 'General checkup',
                'reports': [],
                'prescriptions': []
            }
            
            # Add document URL if available
            if prescription.get('documentUrl'):
                enhanced_prescription['prescriptions'].append({
                    'id': prescription['id'],
                    'name': f"Prescription_{prescription['prescriptionId']}.pdf",
                    'type': 'PDF',
                    'url': prescription['documentUrl']
                })
            
            enhanced_prescriptions.append(enhanced_prescription)
    
    db.close()
    return jsonify({'success': True, 'prescriptions': enhanced_prescriptions})

@app.route('/api/prescriptions/<id>', methods=['GET'])
@token_required
def get_prescription(current_user, id):
    db = get_db()
    prescription = Prescription.find_by_id(db, id)
    
    if not prescription:
        db.close()
        return jsonify({'success': False, 'error': 'Prescription not found'}), 404
    
    # Get patient and doctor details
    patient = Patient.find_by_id(db, prescription['patientId'])
    doctor = Doctor.find_by_id(db, prescription['doctorId'])
    
    if patient and doctor:
        prescription['patientName'] = f"{patient['firstName']} {patient['lastName']}"
        prescription['doctorName'] = doctor['name']
        prescription['gender'] = patient['gender']
        prescription['age'] = patient['age']
    
    # Parse medications JSON
    prescription['medications'] = json.loads(prescription['medications']) if isinstance(prescription['medications'], str) else prescription['medications']
    
    db.close()
    return jsonify({'success': True, 'prescription': prescription})

@app.route('/api/prescriptions', methods=['POST'])
@token_required
def create_prescription(current_user):
    data = request.get_json()
    
    required_fields = ['patientId', 'doctorId', 'clinicId', 'appointmentId', 'diagnosis', 'medications']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400
    
    # Create prescription
    now = datetime.datetime.utcnow().isoformat()
    
    # Generate a unique prescription ID
    prescription_id = f"PRE{uuid.uuid4().hex[:6].upper()}"
    
    prescription_data = {
        'id': str(uuid.uuid4()),
        'prescriptionId': prescription_id,
        'patientId': data['patientId'],
        'doctorId': data['doctorId'],
        'clinicId': data['clinicId'],
        'appointmentId': data['appointmentId'],
        'diagnosis': data['diagnosis'],
        'medications': json.dumps(data['medications']),
        'instructions': data.get('instructions'),
        'followUpDate': data.get('followUpDate'),
        'isActive': 1,
        'documentUrl': data.get('documentUrl'),
        'createdAt': now,
        'updatedAt': now
    }
    
    db = get_db()
    Prescription.create(db, prescription_data)
    
    # Get patient and doctor details for response
    patient = Patient.find_by_id(db, data['patientId'])
    doctor = Doctor.find_by_id(db, data['doctorId'])
    
    if patient and doctor:
        prescription_data['patientName'] = f"{patient['firstName']} {patient['lastName']}"
        prescription_data['doctorName'] = doctor['name']
        prescription_data['gender'] = patient['gender']
        prescription_data['age'] = patient['age']
    
    # Parse medications JSON for response
    prescription_data['medications'] = data['medications']
    
    db.close()
    return jsonify({'success': True, 'prescription': prescription_data})

@app.route('/api/prescriptions/<id>', methods=['PATCH'])
@token_required
def update_prescription(current_user, id):
    data = request.get_json()
    
    db = get_db()
    prescription = Prescription.find_by_id(db, id)
    
    if not prescription:
        db.close()
        return jsonify({'success': False, 'error': 'Prescription not found'}), 404
    
    # Update prescription data
    update_data = {
        'updatedAt': datetime.datetime.utcnow().isoformat()
    }
    
    if data.get('diagnosis'):
        update_data['diagnosis'] = data['diagnosis']
    
    if data.get('medications'):
        update_data['medications'] = json.dumps(data['medications'])
    
    if 'instructions' in data:
        update_data['instructions'] = data['instructions']
    
    if 'followUpDate' in data:
        update_data['followUpDate'] = data['followUpDate']
    
    if 'isActive' in data:
        update_data['isActive'] = 1 if data['isActive'] else 0
    
    if 'documentUrl' in data:
        update_data['documentUrl'] = data['documentUrl']
    
    Prescription.update(db, id, update_data)
    
    # Get updated prescription
    updated_prescription = Prescription.find_by_id(db, id)
    
    # Get patient and doctor details for response
    patient = Patient.find_by_id(db, updated_prescription['patientId'])
    doctor = Doctor.find_by_id(db, updated_prescription['doctorId'])
    
    if patient and doctor:
        updated_prescription['patientName'] = f"{patient['firstName']} {patient['lastName']}"
        updated_prescription['doctorName'] = doctor['name']
        updated_prescription['gender'] = patient['gender']
        updated_prescription['age'] = patient['age']
    
    # Parse medications JSON for response
    updated_prescription['medications'] = json.loads(updated_prescription['medications']) if isinstance(updated_prescription['medications'], str) else updated_prescription['medications']
    
    db.close()
    return jsonify({'success': True, 'prescription': updated_prescription})

@app.route('/api/prescriptions/<id>', methods=['DELETE'])
@token_required
def delete_prescription(current_user, id):
    db = get_db()
    prescription = Prescription.find_by_id(db, id)
    
    if not prescription:
        db.close()
        return jsonify({'success': False, 'error': 'Prescription not found'}), 404
    
    # Delete prescription
    Prescription.delete(db, id)
    
    db.close()
    return jsonify({'success': True})

# Dashboard routes
@app.route('/api/dashboard/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_user):
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    
    db = get_db()
    cursor = db.cursor()
    
    stats = {}
    
    # Get today's date
    today = datetime.datetime.utcnow().date().isoformat()
    
    # Build query conditions
    clinic_condition = f"clinicId = '{clinic_id}'" if clinic_id else "1=1"
    doctor_condition = f"doctorId = '{doctor_id}'" if doctor_id else "1=1"
    
    # Today's appointments
    cursor.execute(f'''
    SELECT COUNT(*) as count FROM appointments 
    WHERE {clinic_condition} AND {doctor_condition} AND date(appointmentDate) = ?
    ''', (today,))
    stats['todayAppointments'] = cursor.fetchone()['count']
    
    # Today's patients (unique patients with appointments today)
    cursor.execute(f'''
    SELECT COUNT(DISTINCT patientId) as count FROM appointments 
    WHERE {clinic_condition} AND {doctor_condition} AND date(appointmentDate) = ?
    ''', (today,))
    stats['todayPatients'] = cursor.fetchone()['count']
    
    # Total patients
    cursor.execute(f'''
    SELECT COUNT(*) as count FROM patients 
    WHERE {clinic_condition}
    ''')
    stats['totalPatients'] = cursor.fetchone()['count']
    
    # Male patients
    cursor.execute(f'''
    SELECT COUNT(*) as count FROM patients 
    WHERE {clinic_condition} AND gender = 'MALE'
    ''')
    stats['malePatients'] = cursor.fetchone()['count']
    
    # Female patients
    cursor.execute(f'''
    SELECT COUNT(*) as count FROM patients 
    WHERE {clinic_condition} AND gender = 'FEMALE'
    ''')
    stats['femalePatients'] = cursor.fetchone()['count']
    
    # Child patients (age < 18)
    cursor.execute(f'''
    SELECT COUNT(*) as count FROM patients 
    WHERE {clinic_condition} AND age < 18
    ''')
    stats['childPatients'] = cursor.fetchone()['count']
    
    # Available doctors
    cursor.execute(f'''
    SELECT COUNT(*) as count FROM doctors 
    WHERE {clinic_condition} AND isAvailable = 1
    ''')
    stats['availableDoctors'] = cursor.fetchone()['count']
    
    # Check-ins (appointments with status CHECKED_IN or IN_PROGRESS)
    cursor.execute(f'''
    SELECT COUNT(*) as count FROM appointments 
    WHERE {clinic_condition} AND {doctor_condition} AND date(appointmentDate) = ? 
    AND (status = 'CHECKED_IN' OR status = 'IN_PROGRESS')
    ''', (today,))
    stats['checkIns'] = cursor.fetchone()['count']
    
    # For admin dashboard
    if not doctor_id:
        # Total doctors
        cursor.execute(f'''
        SELECT COUNT(*) as count FROM doctors 
        WHERE {clinic_condition}
        ''')
        stats['doctors'] = cursor.fetchone()['count']
        
        # Total staff
        cursor.execute(f'''
        SELECT COUNT(*) as count FROM users 
        WHERE {clinic_condition} AND role = 'STAFF'
        ''')
        stats['staff'] = cursor.fetchone()['count']
    
    db.close()
    return jsonify({'success': True, 'stats': stats})

@app.route('/api/dashboard/appointments', methods=['GET'])
@token_required
def get_recent_appointments(current_user):
    clinic_id = request.args.get('clinicId')
    doctor_id = request.args.get('doctorId')
    
    db = get_db()
    
    # Build conditions
    conditions = {}
    if clinic_id:
        conditions['clinicId'] = clinic_id
    if doctor_id:
        conditions['doctorId'] = doctor_id
    
    # Get recent appointments (limit to 10)
    cursor = db.cursor()
    
    query = '''
    SELECT * FROM appointments 
    WHERE 1=1
    '''
    
    params = []
    
    if clinic_id:
        query += ' AND clinicId = ?'
        params.append(clinic_id)
    
    if doctor_id:
        query += ' AND doctorId = ?'
        params.append(doctor_id)
    
    query += ' ORDER BY appointmentDate DESC LIMIT 10'
    
    cursor.execute(query, params)
    appointments = cursor.fetchall()
    
    # Enhance appointments with patient and doctor details
    enhanced_appointments = []
    for appointment in appointments:
        patient = Patient.find_by_id(db, appointment['patientId'])
        doctor = Doctor.find_by_id(db, appointment['doctorId'])
        
        if patient and doctor:
            enhanced_appointment = {
                **appointment,
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
            enhanced_appointments.append(enhanced_appointment)
    
    db.close()
    return jsonify({'success': True, 'appointments': enhanced_appointments})

@app.route('/api/dashboard/doctors-activity', methods=['GET'])
@token_required
def get_doctors_activity(current_user):
    clinic_id = request.args.get('clinicId')
    
    db = get_db()
    
    # Get doctors
    doctors = Doctor.find_by_clinic(db, clinic_id) if clinic_id else Doctor.get_all(db)
    
    # Enhance doctors with appointment stats
    enhanced_doctors = []
    for doctor in doctors:
        # Get appointment counts
        cursor = db.cursor()
        
        # In progress appointments
        cursor.execute('''
        SELECT COUNT(*) as count FROM appointments 
        WHERE doctorId = ? AND status = 'IN_PROGRESS'
        ''', (doctor['id'],))
        in_progress = cursor.fetchone()['count']
        
        # Completed appointments
        cursor.execute('''
        SELECT COUNT(*) as count FROM appointments 
        WHERE doctorId = ? AND status = 'COMPLETED'
        ''', (doctor['id'],))
        completed = cursor.fetchone()['count']
        
        # Pending appointments
        cursor.execute('''
        SELECT COUNT(*) as count FROM appointments 
        WHERE doctorId = ? AND (status = 'SCHEDULED' OR status = 'CONFIRMED')
        ''', (doctor['id'],))
        pending = cursor.fetchone()['count']
        
        # Total appointments
        total = in_progress + completed + pending
        
        enhanced_doctor = {
            'id': doctor['id'],
            'name': doctor['name'],
            'specialization': doctor['specialization'],
            'isAvailable': bool(doctor['isAvailable']),
            'appointments': {
                'inProgress': in_progress,
                'completed': completed,
                'pending': pending,
                'total': total
            }
        }
        
        enhanced_doctors.append(enhanced_doctor)
    
    db.close()
    return jsonify({'success': True, 'doctorsActivity': enhanced_doctors})

@app.route('/api/dashboard/reports', methods=['GET'])
@token_required
def get_recent_reports(current_user):
    clinic_id = request.args.get('clinicId')
    
    # Mock data for reports
    reports = [
        {
            'id': '1',
            'title': 'Monthly Patient Report',
            'type': 'Patient Statistics',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=2),
            'size': '2.5 MB',
            'format': 'PDF'
        },
        {
            'id': '2',
            'title': 'Revenue Analysis',
            'type': 'Financial Report',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=5),
            'size': '1.8 MB',
            'format': 'Excel'
        },
        {
            'id': '3',
            'title': 'Doctor Performance',
            'type': 'Staff Report',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=7),
            'size': '3.2 MB',
            'format': 'PDF'
        },
        {
            'id': '4',
            'title': 'Inventory Status',
            'type': 'Inventory Report',
            'generatedDate': datetime.datetime.utcnow() - datetime.timedelta(days=10),
            'size': '1.5 MB',
            'format': 'PDF'
        }
    ]
    
    return jsonify({'success': True, 'reports': reports})

# Admin dashboard routes
@app.route('/api/admin/stats', methods=['GET'])
@token_required
def get_admin_stats(current_user):
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    cursor = db.cursor()
    
    stats = {}
    
    # Total patients
    cursor.execute('''
    SELECT COUNT(*) as count FROM patients 
    WHERE clinicId = ?
    ''', (clinic_id,))
    stats['totalPatients'] = cursor.fetchone()['count']
    
    # Today's appointments
    today = datetime.datetime.utcnow().date().isoformat()
    cursor.execute('''
    SELECT COUNT(*) as count FROM appointments 
    WHERE clinicId = ? AND date(appointmentDate) = ?
    ''', (clinic_id, today))
    stats['appointments'] = cursor.fetchone()['count']
    
    # Total doctors
    cursor.execute('''
    SELECT COUNT(*) as count FROM doctors 
    WHERE clinicId = ?
    ''', (clinic_id,))
    stats['doctors'] = cursor.fetchone()['count']
    
    # Total staff
    cursor.execute('''
    SELECT COUNT(*) as count FROM users 
    WHERE clinicId = ? AND role = 'STAFF'
    ''', (clinic_id,))
    stats['staff'] = cursor.fetchone()['count']
    
    db.close()
    return jsonify({'success': True, 'stats': stats})

@app.route('/api/admin/doctors', methods=['GET'])
@token_required
def get_admin_doctors(current_user):
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    doctors = Doctor.find_by_clinic(db, clinic_id)
    
    db.close()
    return jsonify({'success': True, 'doctors': doctors})

@app.route('/api/admin/staff', methods=['GET'])
@token_required
def get_admin_staff(current_user):
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    staff = User.find_by_clinic_and_role(db, clinic_id, 'STAFF')
    
    db.close()
    return jsonify({'success': True, 'staff': staff})

@app.route('/api/admin/transactions', methods=['GET'])
@token_required
def get_admin_transactions(current_user):
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    
    # Get recent transactions (limit to 10)
    cursor = db.cursor()
    cursor.execute('''
    SELECT * FROM transactions 
    WHERE clinicId = ? 
    ORDER BY createdAt DESC LIMIT 10
    ''', (clinic_id,))
    
    transactions = cursor.fetchall()
    
    # Format transactions for the dashboard
    formatted_transactions = []
    for transaction in transactions:
        # Get doctor name if available
        doctor_name = None
        if transaction.get('doctorId'):
            doctor = Doctor.find_by_id(db, transaction['doctorId'])
            if doctor:
                doctor_name = doctor['name']
        
        # Get patient name if available
        patient_name = None
        if transaction.get('patientId'):
            patient = Patient.find_by_id(db, transaction['patientId'])
            if patient:
                patient_name = f"{patient['firstName']} {patient['lastName']}"
        
        formatted_transaction = {
            'id': transaction['id'],
            'doctorName': doctor_name or 'N/A',
            'testName': transaction['description'],
            'date': transaction['createdAt'].split('T')[0] if 'T' in transaction['createdAt'] else transaction['createdAt'],
            'amount': transaction['amount']
        }
        
        formatted_transactions.append(formatted_transaction)
    
    db.close()
    return jsonify({'success': True, 'transactions': formatted_transactions})

@app.route('/api/admin/appointments', methods=['GET'])
@token_required
def get_admin_appointments(current_user):
    clinic_id = request.args.get('clinicId')
    
    if not clinic_id:
        return jsonify({'success': False, 'error': 'Clinic ID is required'}), 400
    
    db = get_db()
    
    # Get recent appointments (limit to 10)
    cursor = db.cursor()
    cursor.execute('''
    SELECT * FROM appointments 
    WHERE clinicId = ? 
    ORDER BY appointmentDate DESC LIMIT 10
    ''', (clinic_id,))
    
    appointments = cursor.fetchall()
    
    # Format appointments for the dashboard
    formatted_appointments = []
    for appointment in appointments:
        # Get patient details
        patient = Patient.find_by_id(db, appointment['patientId'])
        if patient:
            formatted_appointment = {
                'id': appointment['id'],
                'sNo': len(formatted_appointments) + 1,
                'name': f"{patient['firstName']} {patient['lastName']}",
                'phoneNumber': patient['phone'],
                'email': patient.get('email', 'N/A'),
                'age': patient['age'],
                'gender': patient['gender'],
                'action': 'Accept' if appointment['status'] in ['SCHEDULED', 'CONFIRMED'] else 'Decline'
            }
            
            formatted_appointments.append(formatted_appointment)
    
    db.close()
    return jsonify({'success': True, 'appointments': formatted_appointments})

# Analytics routes
@app.route('/api/analytics', methods=['GET'])
@token_required
def get_analytics(current_user):
    # Mock data for analytics
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

# Treatments routes
@app.route('/api/treatments', methods=['GET'])
@token_required
def get_treatments(current_user):
    db = get_db()
    treatments = Treatment.get_all(db)
    
    # Format treatments for the client
    formatted_treatments = []
    for treatment in treatments:
        formatted_treatment = {
            'id': treatment['id'],
            'treatmentName': treatment['name'],
            'treatmentInCharge': 'K. Vijay',  # Mock data
            'treatmentCost': treatment['cost'],
            'createdAt': treatment['createdAt']
        }
        
        formatted_treatments.append(formatted_treatment)
    
    db.close()
    return jsonify({'success': True, 'treatments': formatted_treatments})

@app.route('/api/treatments/<id>', methods=['DELETE'])
@token_required
def delete_treatment(current_user, id):
    db = get_db()
    treatment = Treatment.find_by_id(db, id)
    
    if not treatment:
        db.close()
        return jsonify({'success': False, 'error': 'Treatment not found'}), 404
    
    # Delete treatment
    Treatment.delete(db, id)
    
    db.close()
    return jsonify({'success': True})

# Medicines routes
@app.route('/api/medicines', methods=['GET'])
@token_required
def get_medicines(current_user):
    clinic_id = request.args.get('clinicId')
    is_active = request.args.get('isActive')
    
    db = get_db()
    
    # Build conditions
    conditions = {}
    if clinic_id:
        conditions['clinicId'] = clinic_id
    if is_active is not None:
        conditions['isActive'] = 1 if is_active == 'true' else 0
    
    medicines = Medicine.get_all(db, conditions if conditions else None)
    
    db.close()
    return jsonify({'success': True, 'medicines': medicines})

@app.route('/api/medicines/<id>', methods=['GET'])
@token_required
def get_medicine(current_user, id):
    db = get_db()
    medicine = Medicine.find_by_id(db, id)
    
    if not medicine:
        db.close()
        return jsonify({'success': False, 'error': 'Medicine not found'}), 404
    
    db.close()
    return jsonify({'success': True, 'medicine': medicine})

@app.route('/api/medicines', methods=['POST'])
@token_required
def create_medicine(current_user):
    data = request.get_json()
    
    required_fields = [
        'name', 'manufacturer', 'batchNumber', 'type', 'dosage',
        'manufacturedDate', 'expiryDate', 'price', 'stock', 'clinicId'
    ]
    
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'error': f'{field} is required'}), 400
    
    # Create medicine
    now = datetime.datetime.utcnow().isoformat()
    
    # Generate a unique medicine ID
    medicine_id = f"MED{uuid.uuid4().hex[:6].upper()}"
    
    medicine_data = {
        'id': str(uuid.uuid4()),
        'medicineId': medicine_id,
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
        'createdById': current_user['id'],
        'isActive': 1,
        'createdAt': now,
        'updatedAt': now
    }
    
    db = get_db()
    Medicine.create(db, medicine_data)
    
    db.close()
    return jsonify({'success': True, 'medicine': medicine_data})

@app.route('/api/medicines/<id>', methods=['PATCH'])
@token_required
def update_medicine(current_user, id):
    data = request.get_json()
    
    db = get_db()
    medicine = Medicine.find_by_id(db, id)
    
    if not medicine:
        db.close()
        return jsonify({'success': False, 'error': 'Medicine not found'}), 404
    
    # Handle stock updates separately
    if data.get('action') == 'updateStock':
        if 'quantity' not in data or 'isAddition' not in data:
            db.close()
            return jsonify({'success': False, 'error': 'Quantity and isAddition are required for stock updates'}), 400
        
        current_stock = medicine['stock']
        quantity = int(data['quantity'])
        
        if data['isAddition']:
            new_stock = current_stock + quantity
        else:
            new_stock = current_stock - quantity
            if new_stock < 0:
                db.close()
                return jsonify({'success': False, 'error': 'Insufficient stock'}), 400
        
        update_data = {
            'stock': new_stock,
            'updatedAt': datetime.datetime.utcnow().isoformat()
        }
    else:
        # Regular update
        update_data = {
            'updatedAt': datetime.datetime.utcnow().isoformat()
        }
        
        fields = [
            'name', 'manufacturer', 'batchNumber', 'type', 'dosage',
            'manufacturedDate', 'expiryDate', 'price', 'stock', 'reorderLevel', 'isActive'
        ]
        
        for field in fields:
            if field in data:
                update_data[field] = data[field]
    
    Medicine.update(db, id, update_data)
    
    # Get updated medicine
    updated_medicine = Medicine.find_by_id(db, id)
    
    db.close()
    return jsonify({'success': True, 'medicine': updated_medicine})

@app.route('/api/medicines/<id>', methods=['DELETE'])
@token_required
def delete_medicine(current_user, id):
    db = get_db()
    medicine = Medicine.find_by_id(db, id)
    
    if not medicine:
        db.close()
        return jsonify({'success': False, 'error': 'Medicine not found'}), 404
    
    # Delete medicine
    Medicine.delete(db, id)
    
    db.close()
    return jsonify({'success': True})

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)