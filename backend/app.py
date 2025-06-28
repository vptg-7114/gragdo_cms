from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import jwt
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from dotenv import load_dotenv
from database import init_db, get_db, seed_demo_data
from models import User, Clinic, Doctor, Patient, Appointment, Prescription, Medicine, Room, Bed, Transaction, Invoice, Treatment

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
CORS(app, origins=os.getenv('CORS_ORIGINS', '*').split(','), supports_credentials=True)

# Initialize database
init_db()

# Seed demo data
seed_demo_data()

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in cookies
        if 'auth-token' in request.cookies:
            token = request.cookies.get('auth-token')
        
        # Check if token is in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'success': False, 'error': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            db = get_db()
            current_user = User.find_by_id(db, data['id'])
            
            if not current_user:
                return jsonify({'success': False, 'error': 'Invalid token'}), 401
            
        except:
            return jsonify({'success': False, 'error': 'Invalid token'}), 401
        
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
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    
    if check_password_hash(user['password'], data['password']):
        # Generate token
        token = jwt.encode({
            'id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, app.config['SECRET_KEY'])
        
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
    
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or not data.get('firstName') or not data.get('lastName') or not data.get('email') or not data.get('phone') or not data.get('role') or not data.get('password'):
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400
    
    db = get_db()
    
    # Check if user already exists
    existing_user = User.find_by_email(db, data['email'])
    if existing_user:
        return jsonify({'success': False, 'error': 'Email already exists'}), 400
    
    # Check if clinic exists for roles that require it
    if data['role'] in ['ADMIN', 'STAFF', 'DOCTOR'] and not data.get('clinicId'):
        return jsonify({'success': False, 'error': 'Clinic ID is required for this role'}), 400
    
    # Create user
    now = datetime.datetime.utcnow().isoformat()
    
    user_data = {
        'name': f"{data['firstName']} {data['lastName']}",
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'phone': data['phone'],
        'role': data['role'],
        'clinicId': data.get('clinicId'),
        'isActive': 1,
        'createdAt': now,
        'updatedAt': now
    }
    
    # Add clinicIds array for SUPER_ADMIN
    if data['role'] == 'SUPER_ADMIN':
        user_data['clinicIds'] = json.dumps([])
    
    user_id = User.create(db, user_data)
    
    # Create doctor profile if role is DOCTOR
    if data['role'] == 'DOCTOR':
        doctor_data = {
            'userId': user_id,
            'name': f"Dr. {data['firstName']} {data['lastName']}",
            'email': data['email'],
            'phone': data['phone'],
            'specialization': data.get('specialization', 'General Medicine'),
            'clinicId': data['clinicId'],
            'createdById': user_id,
            'isAvailable': 1,
            'createdAt': now,
            'updatedAt': now
        }
        Doctor.create(db, doctor_data)
    
    # Get the created user
    user = User.find_by_id(db, user_id)
    
    # Generate token
    token = jwt.encode({
        'id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'])
    
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
        return jsonify({'success': False, 'error': 'Email is required'}), 400
    
    # In a real app, you would send a password reset email
    # For this demo, we'll just return success
    
    return jsonify({
        'success': True,
        'message': 'Password reset email sent'
    })

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or not data.get('token') or not data.get('newPassword'):
        return jsonify({'success': False, 'error': 'Token and new password are required'}), 400
    
    # In a real app, you would verify the token and update the password
    # For this demo, we'll just return success
    
    return jsonify({
        'success': True,
        'message': 'Password reset successful'
    })

# Profile routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('userId')
    
    if not user_id:
        # Check if user is authenticated
        token = request.cookies.get('auth-token')
        if not token:
            return jsonify({'success': False, 'error': 'Authentication required'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = data['id']
        except:
            return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    db = get_db()
    user = User.find_by_id(db, user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    # Get clinic details if user has a clinicId
    clinic = None
    if user.get('clinicId'):
        clinic = Clinic.find_by_id(db, user['clinicId'])
    
    # Get clinics if user is a SUPER_ADMIN
    clinics = None
    if user['role'] == 'SUPER_ADMIN' and user.get('clinicIds'):
        clinic_ids = json.loads(user['clinicIds'])
        clinics = []
        for clinic_id in clinic_ids:
            c = Clinic.find_by_id(db, clinic_id)
            if c:
                clinics.append({
                    'id': c['id'],
                    'name': c['name'],
                    'address': c['address']
                })
    
    return jsonify({
        'success': True,
        'profile': {
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
            'clinics': clinics,
            'createdAt': user['createdAt']
        }
    })

@app.route('/api/profile', methods=['PATCH'])
def update_profile():
    data = request.get_json()
    
    if not data or not data.get('userId'):
        return jsonify({'success': False, 'error': 'User ID is required'}), 400
    
    db = get_db()
    user = User.find_by_id(db, data['userId'])
    
    if not user:
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
    
    return jsonify({'success': True})

# Clinics routes
@app.route('/api/clinics', methods=['GET'])
def get_clinics():
    db = get_db()
    clinics = Clinic.get_all(db)
    
    # Enhance clinics with stats
    for clinic in clinics:
        # Get patient count
        patients = Patient.find_by_clinic(db, clinic['id'])
        patient_count = len(patients)
        
        # Get appointment count
        appointments = Appointment.find_by_clinic(db, clinic['id'])
        appointment_count = len(appointments)
        
        # Get doctor count
        doctors = Doctor.find_by_clinic(db, clinic['id'])
        doctor_count = len(doctors)
        
        clinic['stats'] = {
            'patients': patient_count,
            'appointments': appointment_count,
            'doctors': doctor_count
        }
    
    return jsonify({'success': True, 'clinics': clinics})

@app.route('/api/clinics/<id>', methods=['GET'])
def get_clinic(id):
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Get patient count
    patients = Patient.find_by_clinic(db, clinic['id'])
    patient_count = len(patients)
    
    # Get appointment count
    appointments = Appointment.find_by_clinic(db, clinic['id'])
    appointment_count = len(appointments)
    
    # Get doctor count
    doctors = Doctor.find_by_clinic(db, clinic['id'])
    doctor_count = len(doctors)
    
    clinic['stats'] = {
        'patients': patient_count,
        'appointments': appointment_count,
        'doctors': doctor_count
    }
    
    return jsonify({'success': True, 'clinic': clinic})

@app.route('/api/clinics', methods=['POST'])
@token_required
def create_clinic(current_user):
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('address') or not data.get('phone'):
        return jsonify({'success': False, 'error': 'Name, address, and phone are required'}), 400
    
    # Create clinic
    now = datetime.datetime.utcnow().isoformat()
    
    clinic_data = {
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
    clinic_id = Clinic.create(db, clinic_data)
    
    # If user is a SUPER_ADMIN, add clinic to their clinicIds
    if current_user['role'] == 'SUPER_ADMIN':
        clinic_ids = json.loads(current_user.get('clinicIds', '[]'))
        clinic_ids.append(clinic_id)
        User.update(db, current_user['id'], {'clinicIds': json.dumps(clinic_ids)})
    
    clinic = Clinic.find_by_id(db, clinic_id)
    
    return jsonify({'success': True, 'clinic': clinic})

@app.route('/api/clinics/<id>', methods=['PATCH'])
@token_required
def update_clinic(current_user, id):
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
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
    
    if data.get('email'):
        update_data['email'] = data['email']
    
    if data.get('description'):
        update_data['description'] = data['description']
    
    Clinic.update(db, id, update_data)
    
    clinic = Clinic.find_by_id(db, id)
    
    return jsonify({'success': True, 'clinic': clinic})

@app.route('/api/clinics/<id>', methods=['DELETE'])
@token_required
def delete_clinic(current_user, id):
    db = get_db()
    clinic = Clinic.find_by_id(db, id)
    
    if not clinic:
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    
    # Check if clinic has associated data
    doctors = Doctor.find_by_clinic(db, id)
    if doctors:
        return jsonify({'success': False, 'error': 'Cannot delete clinic with associated doctors'}), 400
    
    patients = Patient.find_by_clinic(db, id)
    if patients:
        return jsonify({'success': False, 'error': 'Cannot delete clinic with associated patients'}), 400
    
    # Delete clinic
    Clinic.delete(db, id)
    
    # If user is a SUPER_ADMIN, remove clinic from their clinicIds
    if current_user['role'] == 'SUPER_ADMIN':
        clinic_ids = json.loads(current_user.get('clinicIds', '[]'))
        if id in clinic_ids:
            clinic_ids.remove(id)
            User.update(db, current_user['id'], {'clinicIds': json.dumps(clinic_ids)})
    
    return jsonify({'success': True})

# Add more routes for other resources...

if __name__ == '__main__':
    app.run(debug=True, port=5000)