# DigiGo Care API Documentation

## Base URL

- Production: `https://digigocare.com/api`
- Development: `http://localhost:8000/api`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require authentication.

### JWT Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## API Endpoints

### Authentication

#### Login

- **URL**: `/auth/login/`
- **Method**: `POST`
- **Description**: Authenticate a user and get access and refresh tokens
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "string" // "SUPER_ADMIN", "ADMIN", "STAFF", "DOCTOR"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string",
      "clinicId": "string",
      "clinicIds": ["string"] // For SUPER_ADMIN role
    },
    "access": "string", // JWT access token
    "refresh": "string" // JWT refresh token
  }
  ```

#### Signup

- **URL**: `/auth/signup/`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "string", // "SUPER_ADMIN", "ADMIN", "STAFF", "DOCTOR"
    "clinicId": "string", // Required for ADMIN, STAFF, DOCTOR roles
    "password": "string",
    "confirm_password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string",
      "clinicId": "string",
      "clinicIds": ["string"] // For SUPER_ADMIN role
    },
    "access": "string", // JWT access token
    "refresh": "string" // JWT refresh token
  }
  ```

#### Forgot Password

- **URL**: `/auth/forgot-password/`
- **Method**: `POST`
- **Description**: Request a password reset link
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```

#### Reset Password

- **URL**: `/auth/reset-password/`
- **Method**: `POST`
- **Description**: Reset a user's password using a token
- **Request Body**:
  ```json
  {
    "token": "string",
    "new_password": "string",
    "confirm_password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successful"
  }
  ```

#### Logout

- **URL**: `/auth/logout/`
- **Method**: `POST`
- **Description**: Log out a user by clearing their token
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Get Current User

- **URL**: `/auth/me/`
- **Method**: `GET`
- **Description**: Get the currently authenticated user's information
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string",
      "clinicId": "string",
      "clinicIds": ["string"] // For SUPER_ADMIN role
    }
  }
  ```

#### Refresh Token

- **URL**: `/auth/token/refresh/`
- **Method**: `POST`
- **Description**: Get a new access token using a refresh token
- **Request Body**:
  ```json
  {
    "refresh": "string" // JWT refresh token
  }
  ```
- **Response**:
  ```json
  {
    "access": "string" // New JWT access token
  }
  ```

#### Change Password

- **URL**: `/auth/change-password/`
- **Method**: `POST`
- **Description**: Change a user's password
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "current_password": "string",
    "new_password": "string",
    "confirm_password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

#### Verify Email

- **URL**: `/auth/verify-email/`
- **Method**: `POST`
- **Description**: Verify a user's email address
- **Request Body**:
  ```json
  {
    "token": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Email verified successfully"
  }
  ```

### Profile

#### Get Profile

- **URL**: `/profile/`
- **Method**: `GET`
- **Description**: Get a user's profile information
- **Authentication**: Required
- **Query Parameters**:
  - `userId` (optional): User ID (if not provided, returns the current user's profile)
- **Response**:
  ```json
  {
    "success": true,
    "profile": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "string",
      "address": "string",
      "bio": "string",
      "profileImage": "string",
      "clinic": {
        "id": "string",
        "name": "string",
        "address": "string"
      },
      "clinicIds": ["string"],
      "clinics": [
        {
          "id": "string",
          "name": "string",
          "address": "string"
        }
      ],
      "createdAt": "string"
    }
  }
  ```

#### Update Profile

- **URL**: `/profile/`
- **Method**: `PATCH`
- **Description**: Update a user's profile information
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "userId": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "bio": "string",
    "profileImage": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### Clinics

#### Get All Clinics

- **URL**: `/clinics/`
- **Method**: `GET`
- **Description**: Get a list of all clinics
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "clinics": [
      {
        "id": "string",
        "name": "string",
        "address": "string",
        "phone": "string",
        "email": "string",
        "description": "string",
        "stats": {
          "patients": 0,
          "appointments": 0,
          "doctors": 0
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Clinic

- **URL**: `/clinics/{id}/`
- **Method**: `GET`
- **Description**: Get a clinic by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "clinic": {
      "id": "string",
      "name": "string",
      "address": "string",
      "phone": "string",
      "email": "string",
      "description": "string",
      "stats": {
        "patients": 0,
        "appointments": 0,
        "doctors": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Clinic

- **URL**: `/clinics/`
- **Method**: `POST`
- **Description**: Create a new clinic
- **Authentication**: Required (SUPER_ADMIN role)
- **Request Body**:
  ```json
  {
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "description": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "clinic": {
      "id": "string",
      "name": "string",
      "address": "string",
      "phone": "string",
      "email": "string",
      "description": "string",
      "stats": {
        "patients": 0,
        "appointments": 0,
        "doctors": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Clinic

- **URL**: `/clinics/{id}/`
- **Method**: `PATCH`
- **Description**: Update a clinic by ID
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Path Parameters**:
  - `id`: Clinic ID
- **Request Body**:
  ```json
  {
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "description": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "clinic": {
      "id": "string",
      "name": "string",
      "address": "string",
      "phone": "string",
      "email": "string",
      "description": "string",
      "stats": {
        "patients": 0,
        "appointments": 0,
        "doctors": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Clinic

- **URL**: `/clinics/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a clinic by ID
- **Authentication**: Required (SUPER_ADMIN role)
- **Path Parameters**:
  - `id`: Clinic ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### Doctors

#### Get All Doctors

- **URL**: `/doctors/`
- **Method**: `GET`
- **Description**: Get a list of all doctors, optionally filtered by clinic
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "doctors": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "specialization": "string",
        "qualification": "string",
        "experience": 0,
        "consultationFee": 0,
        "isAvailable": true,
        "clinic": "string",
        "schedules": [
          {
            "id": "string",
            "dayOfWeek": 0,
            "dayName": "string",
            "startTime": "string",
            "endTime": "string",
            "isActive": true
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Doctor

- **URL**: `/doctors/{id}/`
- **Method**: `GET`
- **Description**: Get a doctor by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Doctor ID
- **Response**:
  ```json
  {
    "success": true,
    "doctor": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "specialization": "string",
      "qualification": "string",
      "experience": 0,
      "consultationFee": 0,
      "isAvailable": true,
      "clinic": "string",
      "schedules": [
        {
          "id": "string",
          "dayOfWeek": 0,
          "dayName": "string",
          "startTime": "string",
          "endTime": "string",
          "isActive": true
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Doctor

- **URL**: `/doctors/`
- **Method**: `POST`
- **Description**: Create a new doctor
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "specialization": "string",
    "qualification": "string",
    "experience": 0,
    "consultationFee": 0,
    "clinicId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "doctor": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "specialization": "string",
      "qualification": "string",
      "experience": 0,
      "consultationFee": 0,
      "isAvailable": true,
      "clinic": "string",
      "schedules": [],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Doctor

- **URL**: `/doctors/{id}/`
- **Method**: `PATCH`
- **Description**: Update a doctor by ID
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Path Parameters**:
  - `id`: Doctor ID
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "specialization": "string",
    "qualification": "string",
    "experience": 0,
    "consultationFee": 0,
    "isAvailable": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "doctor": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "specialization": "string",
      "qualification": "string",
      "experience": 0,
      "consultationFee": 0,
      "isAvailable": true,
      "clinic": "string",
      "schedules": [
        {
          "id": "string",
          "dayOfWeek": 0,
          "dayName": "string",
          "startTime": "string",
          "endTime": "string",
          "isActive": true
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Doctor

- **URL**: `/doctors/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a doctor by ID
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Path Parameters**:
  - `id`: Doctor ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Toggle Doctor Availability

- **URL**: `/doctors/{id}/toggle-availability/`
- **Method**: `POST`
- **Description**: Toggle a doctor's availability
- **Authentication**: Required (SUPER_ADMIN, ADMIN, or DOCTOR role)
- **Path Parameters**:
  - `id`: Doctor ID
- **Response**:
  ```json
  {
    "success": true,
    "doctor": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "specialization": "string",
      "qualification": "string",
      "experience": 0,
      "consultationFee": 0,
      "isAvailable": true,
      "clinic": "string",
      "schedules": [
        {
          "id": "string",
          "dayOfWeek": 0,
          "dayName": "string",
          "startTime": "string",
          "endTime": "string",
          "isActive": true
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Patients

#### Get All Patients

- **URL**: `/patients/`
- **Method**: `GET`
- **Description**: Get a list of all patients, optionally filtered by clinic
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "patients": [
      {
        "id": "string",
        "patientId": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "gender": "string",
        "dateOfBirth": "string",
        "age": 0,
        "bloodGroup": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "postalCode": "string",
        "medicalHistory": "string",
        "allergies": "string",
        "emergencyContact": {
          "name": "string",
          "relationship": "string",
          "phone": "string"
        },
        "clinic": "string",
        "isActive": true,
        "documents": [
          {
            "id": "string",
            "documentId": "string",
            "name": "string",
            "type": "string",
            "fileUrl": "string",
            "size": 0,
            "patient": "string",
            "appointment": "string",
            "clinic": "string",
            "tags": ["string"],
            "notes": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Patient

- **URL**: `/patients/{id}/`
- **Method**: `GET`
- **Description**: Get a patient by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Patient ID
- **Response**:
  ```json
  {
    "success": true,
    "patient": {
      "id": "string",
      "patientId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "gender": "string",
      "dateOfBirth": "string",
      "age": 0,
      "bloodGroup": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "medicalHistory": "string",
      "allergies": "string",
      "emergencyContact": {
        "name": "string",
        "relationship": "string",
        "phone": "string"
      },
      "clinic": "string",
      "isActive": true,
      "documents": [
        {
          "id": "string",
          "documentId": "string",
          "name": "string",
          "type": "string",
          "fileUrl": "string",
          "size": 0,
          "patient": "string",
          "appointment": "string",
          "clinic": "string",
          "tags": ["string"],
          "notes": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Patient

- **URL**: `/patients/`
- **Method**: `POST`
- **Description**: Create a new patient
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "gender": "string",
    "dateOfBirth": "string",
    "bloodGroup": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "medicalHistory": "string",
    "allergies": "string",
    "emergencyContact": {
      "name": "string",
      "relationship": "string",
      "phone": "string"
    },
    "clinicId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "patient": {
      "id": "string",
      "patientId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "gender": "string",
      "dateOfBirth": "string",
      "age": 0,
      "bloodGroup": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "medicalHistory": "string",
      "allergies": "string",
      "emergencyContact": {
        "name": "string",
        "relationship": "string",
        "phone": "string"
      },
      "clinic": "string",
      "isActive": true,
      "documents": [],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Patient

- **URL**: `/patients/{id}/`
- **Method**: `PATCH`
- **Description**: Update a patient by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Patient ID
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "gender": "string",
    "dateOfBirth": "string",
    "bloodGroup": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "medicalHistory": "string",
    "allergies": "string",
    "emergencyContact": {
      "name": "string",
      "relationship": "string",
      "phone": "string"
    },
    "isActive": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "patient": {
      "id": "string",
      "patientId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "gender": "string",
      "dateOfBirth": "string",
      "age": 0,
      "bloodGroup": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "medicalHistory": "string",
      "allergies": "string",
      "emergencyContact": {
        "name": "string",
        "relationship": "string",
        "phone": "string"
      },
      "clinic": "string",
      "isActive": true,
      "documents": [
        {
          "id": "string",
          "documentId": "string",
          "name": "string",
          "type": "string",
          "fileUrl": "string",
          "size": 0,
          "patient": "string",
          "appointment": "string",
          "clinic": "string",
          "tags": ["string"],
          "notes": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Patient

- **URL**: `/patients/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a patient by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Patient ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Get Patient Documents

- **URL**: `/patients/{id}/documents/`
- **Method**: `GET`
- **Description**: Get all documents for a patient
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Patient ID
- **Response**:
  ```json
  {
    "success": true,
    "documents": [
      {
        "id": "string",
        "documentId": "string",
        "name": "string",
        "type": "string",
        "fileUrl": "string",
        "size": 0,
        "patient": "string",
        "appointment": "string",
        "clinic": "string",
        "tags": ["string"],
        "notes": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

### Appointments

#### Get All Appointments

- **URL**: `/appointments/`
- **Method**: `GET`
- **Description**: Get a list of all appointments, optionally filtered by clinic, doctor, patient, or status
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID
  - `patientId` (optional): Filter by patient ID
  - `status` (optional): Filter by status
- **Response**:
  ```json
  {
    "success": true,
    "appointments": [
      {
        "id": "string",
        "appointmentId": "string",
        "patient": "string",
        "doctor": "string",
        "clinic": "string",
        "appointmentDate": "string",
        "startTime": "string",
        "endTime": "string",
        "duration": 0,
        "type": "string",
        "status": "string",
        "concern": "string",
        "notes": "string",
        "vitals": {
          "temperature": 0,
          "bloodPressure": "string",
          "heartRate": 0,
          "respiratoryRate": 0,
          "oxygenSaturation": 0,
          "weight": 0,
          "height": 0
        },
        "cancelledAt": "string",
        "cancelledBy": "string",
        "cancelReason": "string",
        "followUpDate": "string",
        "isFollowUp": true,
        "previousAppointment": "string",
        "patientDetails": {
          "patientId": "string",
          "name": "string",
          "phone": "string",
          "gender": "string",
          "age": 0
        },
        "doctorDetails": {
          "name": "string",
          "specialization": "string"
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Appointment

- **URL**: `/appointments/{id}/`
- **Method**: `GET`
- **Description**: Get an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "string",
      "concern": "string",
      "notes": "string",
      "vitals": {
        "temperature": 0,
        "bloodPressure": "string",
        "heartRate": 0,
        "respiratoryRate": 0,
        "oxygenSaturation": 0,
        "weight": 0,
        "height": 0
      },
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Appointment

- **URL**: `/appointments/`
- **Method**: `POST`
- **Description**: Create a new appointment
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "patientId": "string",
    "doctorId": "string",
    "clinicId": "string",
    "appointmentDate": "string",
    "startTime": "string",
    "endTime": "string",
    "duration": 0,
    "type": "string",
    "concern": "string",
    "notes": "string",
    "isFollowUp": true,
    "previousAppointmentId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "string",
      "concern": "string",
      "notes": "string",
      "vitals": null,
      "cancelledAt": null,
      "cancelledBy": null,
      "cancelReason": null,
      "followUpDate": null,
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Appointment

- **URL**: `/appointments/{id}/`
- **Method**: `PATCH`
- **Description**: Update an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Request Body**:
  ```json
  {
    "appointmentDate": "string",
    "startTime": "string",
    "endTime": "string",
    "duration": 0,
    "type": "string",
    "status": "string",
    "concern": "string",
    "notes": "string",
    "vitals": {
      "temperature": 0,
      "bloodPressure": "string",
      "heartRate": 0,
      "respiratoryRate": 0,
      "oxygenSaturation": 0,
      "weight": 0,
      "height": 0
    },
    "followUpDate": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "string",
      "concern": "string",
      "notes": "string",
      "vitals": {
        "temperature": 0,
        "bloodPressure": "string",
        "heartRate": 0,
        "respiratoryRate": 0,
        "oxygenSaturation": 0,
        "weight": 0,
        "height": 0
      },
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Appointment

- **URL**: `/appointments/{id}/`
- **Method**: `DELETE`
- **Description**: Delete an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Cancel Appointment

- **URL**: `/appointments/{id}/cancel/`
- **Method**: `PATCH`
- **Description**: Cancel an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Request Body**:
  ```json
  {
    "cancelReason": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "CANCELLED",
      "concern": "string",
      "notes": "string",
      "vitals": {
        "temperature": 0,
        "bloodPressure": "string",
        "heartRate": 0,
        "respiratoryRate": 0,
        "oxygenSaturation": 0,
        "weight": 0,
        "height": 0
      },
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Check In Appointment

- **URL**: `/appointments/{id}/check-in/`
- **Method**: `PATCH`
- **Description**: Check in an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "CHECKED_IN",
      "concern": "string",
      "notes": "string",
      "vitals": {
        "temperature": 0,
        "bloodPressure": "string",
        "heartRate": 0,
        "respiratoryRate": 0,
        "oxygenSaturation": 0,
        "weight": 0,
        "height": 0
      },
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Start Appointment

- **URL**: `/appointments/{id}/start/`
- **Method**: `PATCH`
- **Description**: Start an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "IN_PROGRESS",
      "concern": "string",
      "notes": "string",
      "vitals": {
        "temperature": 0,
        "bloodPressure": "string",
        "heartRate": 0,
        "respiratoryRate": 0,
        "oxygenSaturation": 0,
        "weight": 0,
        "height": 0
      },
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Complete Appointment

- **URL**: `/appointments/{id}/complete/`
- **Method**: `PATCH`
- **Description**: Complete an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Request Body**:
  ```json
  {
    "vitals": {
      "temperature": 0,
      "bloodPressure": "string",
      "heartRate": 0,
      "respiratoryRate": 0,
      "oxygenSaturation": 0,
      "weight": 0,
      "height": 0
    },
    "notes": "string",
    "followUpDate": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "COMPLETED",
      "concern": "string",
      "notes": "string",
      "vitals": {
        "temperature": 0,
        "bloodPressure": "string",
        "heartRate": 0,
        "respiratoryRate": 0,
        "oxygenSaturation": 0,
        "weight": 0,
        "height": 0
      },
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Reschedule Appointment

- **URL**: `/appointments/{id}/reschedule/`
- **Method**: `PATCH`
- **Description**: Reschedule an appointment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Appointment ID
- **Request Body**:
  ```json
  {
    "appointmentDate": "string",
    "startTime": "string",
    "endTime": "string",
    "duration": 0
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "appointment": {
      "id": "string",
      "appointmentId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "endTime": "string",
      "duration": 0,
      "type": "string",
      "status": "RESCHEDULED",
      "concern": "string",
      "notes": "string",
      "vitals": {
        "temperature": 0,
        "bloodPressure": "string",
        "heartRate": 0,
        "respiratoryRate": 0,
        "oxygenSaturation": 0,
        "weight": 0,
        "height": 0
      },
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": true,
      "previousAppointment": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "phone": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Prescriptions

#### Get All Prescriptions

- **URL**: `/prescriptions/`
- **Method**: `GET`
- **Description**: Get a list of all prescriptions, optionally filtered by clinic, doctor, or patient
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID
  - `patientId` (optional): Filter by patient ID
- **Response**:
  ```json
  {
    "success": true,
    "prescriptions": [
      {
        "id": "string",
        "prescriptionId": "string",
        "patient": "string",
        "doctor": "string",
        "clinic": "string",
        "appointment": "string",
        "diagnosis": "string",
        "instructions": "string",
        "followUpDate": "string",
        "isActive": true,
        "document": "string",
        "documentUrl": "string",
        "medications": [
          {
            "id": "string",
            "name": "string",
            "dosage": "string",
            "frequency": "string",
            "duration": "string",
            "instructions": "string",
            "medicine": "string",
            "quantity": 0
          }
        ],
        "patientDetails": {
          "patientId": "string",
          "name": "string",
          "gender": "string",
          "age": 0
        },
        "doctorDetails": {
          "name": "string",
          "specialization": "string"
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Prescription

- **URL**: `/prescriptions/{id}/`
- **Method**: `GET`
- **Description**: Get a prescription by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Prescription ID
- **Response**:
  ```json
  {
    "success": true,
    "prescription": {
      "id": "string",
      "prescriptionId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointment": "string",
      "diagnosis": "string",
      "instructions": "string",
      "followUpDate": "string",
      "isActive": true,
      "document": "string",
      "documentUrl": "string",
      "medications": [
        {
          "id": "string",
          "name": "string",
          "dosage": "string",
          "frequency": "string",
          "duration": "string",
          "instructions": "string",
          "medicine": "string",
          "quantity": 0
        }
      ],
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Prescription

- **URL**: `/prescriptions/`
- **Method**: `POST`
- **Description**: Create a new prescription
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "patientId": "string",
    "doctorId": "string",
    "clinicId": "string",
    "appointmentId": "string",
    "diagnosis": "string",
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "duration": "string",
        "instructions": "string",
        "medicineId": "string",
        "quantity": 0
      }
    ],
    "instructions": "string",
    "followUpDate": "string",
    "document": "file"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "prescription": {
      "id": "string",
      "prescriptionId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointment": "string",
      "diagnosis": "string",
      "instructions": "string",
      "followUpDate": "string",
      "isActive": true,
      "document": "string",
      "documentUrl": "string",
      "medications": [
        {
          "id": "string",
          "name": "string",
          "dosage": "string",
          "frequency": "string",
          "duration": "string",
          "instructions": "string",
          "medicine": "string",
          "quantity": 0
        }
      ],
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Prescription

- **URL**: `/prescriptions/{id}/`
- **Method**: `PATCH`
- **Description**: Update a prescription by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Prescription ID
- **Request Body**:
  ```json
  {
    "diagnosis": "string",
    "medications": [
      {
        "id": "string",
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "duration": "string",
        "instructions": "string",
        "medicineId": "string",
        "quantity": 0
      }
    ],
    "instructions": "string",
    "followUpDate": "string",
    "isActive": true,
    "document": "file"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "prescription": {
      "id": "string",
      "prescriptionId": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "appointment": "string",
      "diagnosis": "string",
      "instructions": "string",
      "followUpDate": "string",
      "isActive": true,
      "document": "string",
      "documentUrl": "string",
      "medications": [
        {
          "id": "string",
          "name": "string",
          "dosage": "string",
          "frequency": "string",
          "duration": "string",
          "instructions": "string",
          "medicine": "string",
          "quantity": 0
        }
      ],
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Prescription

- **URL**: `/prescriptions/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a prescription by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Prescription ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### Medicines

#### Get All Medicines

- **URL**: `/medicines/`
- **Method**: `GET`
- **Description**: Get a list of all medicines, optionally filtered by clinic or active status
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `isActive` (optional): Filter by active status (true/false)
- **Response**:
  ```json
  {
    "success": true,
    "medicines": [
      {
        "id": "string",
        "medicineId": "string",
        "name": "string",
        "manufacturer": "string",
        "batchNumber": "string",
        "type": "string",
        "dosage": "string",
        "manufacturedDate": "string",
        "expiryDate": "string",
        "price": 0,
        "stock": 0,
        "reorderLevel": 0,
        "clinic": "string",
        "isActive": true,
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Medicine

- **URL**: `/medicines/{id}/`
- **Method**: `GET`
- **Description**: Get a medicine by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Medicine ID
- **Response**:
  ```json
  {
    "success": true,
    "medicine": {
      "id": "string",
      "medicineId": "string",
      "name": "string",
      "manufacturer": "string",
      "batchNumber": "string",
      "type": "string",
      "dosage": "string",
      "manufacturedDate": "string",
      "expiryDate": "string",
      "price": 0,
      "stock": 0,
      "reorderLevel": 0,
      "clinic": "string",
      "isActive": true,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Medicine

- **URL**: `/medicines/`
- **Method**: `POST`
- **Description**: Create a new medicine
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "string",
    "manufacturer": "string",
    "batchNumber": "string",
    "type": "string",
    "dosage": "string",
    "manufacturedDate": "string",
    "expiryDate": "string",
    "price": 0,
    "stock": 0,
    "reorderLevel": 0,
    "clinicId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "medicine": {
      "id": "string",
      "medicineId": "string",
      "name": "string",
      "manufacturer": "string",
      "batchNumber": "string",
      "type": "string",
      "dosage": "string",
      "manufacturedDate": "string",
      "expiryDate": "string",
      "price": 0,
      "stock": 0,
      "reorderLevel": 0,
      "clinic": "string",
      "isActive": true,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Medicine

- **URL**: `/medicines/{id}/`
- **Method**: `PATCH`
- **Description**: Update a medicine by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Medicine ID
- **Request Body**:
  ```json
  {
    "name": "string",
    "manufacturer": "string",
    "batchNumber": "string",
    "type": "string",
    "dosage": "string",
    "manufacturedDate": "string",
    "expiryDate": "string",
    "price": 0,
    "stock": 0,
    "reorderLevel": 0,
    "isActive": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "medicine": {
      "id": "string",
      "medicineId": "string",
      "name": "string",
      "manufacturer": "string",
      "batchNumber": "string",
      "type": "string",
      "dosage": "string",
      "manufacturedDate": "string",
      "expiryDate": "string",
      "price": 0,
      "stock": 0,
      "reorderLevel": 0,
      "clinic": "string",
      "isActive": true,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Medicine

- **URL**: `/medicines/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a medicine by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Medicine ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Update Medicine Stock

- **URL**: `/medicines/{id}/update-stock/`
- **Method**: `PATCH`
- **Description**: Update a medicine's stock by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Medicine ID
- **Request Body**:
  ```json
  {
    "quantity": 0,
    "isAddition": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "medicine": {
      "id": "string",
      "medicineId": "string",
      "name": "string",
      "manufacturer": "string",
      "batchNumber": "string",
      "type": "string",
      "dosage": "string",
      "manufacturedDate": "string",
      "expiryDate": "string",
      "price": 0,
      "stock": 0,
      "reorderLevel": 0,
      "clinic": "string",
      "isActive": true,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Rooms

#### Get All Rooms

- **URL**: `/rooms/`
- **Method**: `GET`
- **Description**: Get a list of all rooms, optionally filtered by clinic or active status
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `isActive` (optional): Filter by active status (true/false)
- **Response**:
  ```json
  {
    "success": true,
    "rooms": [
      {
        "id": "string",
        "roomId": "string",
        "roomNumber": "string",
        "roomType": "string",
        "floor": 0,
        "totalBeds": 0,
        "availableBeds": 0,
        "occupiedBeds": 0,
        "reservedBeds": 0,
        "clinic": "string",
        "isActive": true,
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Room

- **URL**: `/rooms/{id}/`
- **Method**: `GET`
- **Description**: Get a room by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Room ID
- **Response**:
  ```json
  {
    "success": true,
    "room": {
      "id": "string",
      "roomId": "string",
      "roomNumber": "string",
      "roomType": "string",
      "floor": 0,
      "totalBeds": 0,
      "availableBeds": 0,
      "occupiedBeds": 0,
      "reservedBeds": 0,
      "clinic": "string",
      "isActive": true,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Room

- **URL**: `/rooms/`
- **Method**: `POST`
- **Description**: Create a new room
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "roomNumber": "string",
    "roomType": "string",
    "floor": 0,
    "totalBeds": 0,
    "clinicId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "room": {
      "id": "string",
      "roomId": "string",
      "roomNumber": "string",
      "roomType": "string",
      "floor": 0,
      "totalBeds": 0,
      "availableBeds": 0,
      "occupiedBeds": 0,
      "reservedBeds": 0,
      "clinic": "string",
      "isActive": true,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Room

- **URL**: `/rooms/{id}/`
- **Method**: `PATCH`
- **Description**: Update a room by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Room ID
- **Request Body**:
  ```json
  {
    "roomNumber": "string",
    "roomType": "string",
    "floor": 0,
    "totalBeds": 0,
    "isActive": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "room": {
      "id": "string",
      "roomId": "string",
      "roomNumber": "string",
      "roomType": "string",
      "floor": 0,
      "totalBeds": 0,
      "availableBeds": 0,
      "occupiedBeds": 0,
      "reservedBeds": 0,
      "clinic": "string",
      "isActive": true,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Room

- **URL**: `/rooms/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a room by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Room ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### Beds

#### Get All Beds

- **URL**: `/beds/`
- **Method**: `GET`
- **Description**: Get a list of all beds, optionally filtered by room or status
- **Authentication**: Required
- **Query Parameters**:
  - `roomId` (optional): Filter by room ID
  - `status` (optional): Filter by status
- **Response**:
  ```json
  {
    "success": true,
    "beds": [
      {
        "id": "string",
        "bedId": "string",
        "bedNumber": 0,
        "room": "string",
        "status": "string",
        "patient": "string",
        "admissionDate": "string",
        "dischargeDate": "string",
        "clinic": "string",
        "notes": "string",
        "patientDetails": {
          "patientId": "string",
          "name": "string",
          "gender": "string",
          "age": 0
        },
        "roomDetails": {
          "roomNumber": "string",
          "roomType": "string",
          "floor": 0
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Bed

- **URL**: `/beds/{id}/`
- **Method**: `GET`
- **Description**: Get a bed by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Bed ID
- **Response**:
  ```json
  {
    "success": true,
    "bed": {
      "id": "string",
      "bedId": "string",
      "bedNumber": 0,
      "room": "string",
      "status": "string",
      "patient": "string",
      "admissionDate": "string",
      "dischargeDate": "string",
      "clinic": "string",
      "notes": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "roomDetails": {
        "roomNumber": "string",
        "roomType": "string",
        "floor": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Bed

- **URL**: `/beds/`
- **Method**: `POST`
- **Description**: Create a new bed
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "bedNumber": 0,
    "roomId": "string",
    "clinicId": "string",
    "notes": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "bed": {
      "id": "string",
      "bedId": "string",
      "bedNumber": 0,
      "room": "string",
      "status": "AVAILABLE",
      "patient": null,
      "admissionDate": null,
      "dischargeDate": null,
      "clinic": "string",
      "notes": "string",
      "patientDetails": null,
      "roomDetails": {
        "roomNumber": "string",
        "roomType": "string",
        "floor": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Bed

- **URL**: `/beds/{id}/`
- **Method**: `PATCH`
- **Description**: Update a bed by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Bed ID
- **Request Body**:
  ```json
  {
    "bedNumber": 0,
    "status": "string",
    "notes": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "bed": {
      "id": "string",
      "bedId": "string",
      "bedNumber": 0,
      "room": "string",
      "status": "string",
      "patient": "string",
      "admissionDate": "string",
      "dischargeDate": "string",
      "clinic": "string",
      "notes": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "roomDetails": {
        "roomNumber": "string",
        "roomType": "string",
        "floor": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Bed

- **URL**: `/beds/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a bed by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Bed ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Assign Bed

- **URL**: `/beds/{id}/assign/`
- **Method**: `PATCH`
- **Description**: Assign a patient to a bed by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Bed ID
- **Request Body**:
  ```json
  {
    "patientId": "string",
    "admissionDate": "string",
    "dischargeDate": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "bed": {
      "id": "string",
      "bedId": "string",
      "bedNumber": 0,
      "room": "string",
      "status": "OCCUPIED",
      "patient": "string",
      "admissionDate": "string",
      "dischargeDate": "string",
      "clinic": "string",
      "notes": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "roomDetails": {
        "roomNumber": "string",
        "roomType": "string",
        "floor": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Discharge Bed

- **URL**: `/beds/{id}/discharge/`
- **Method**: `PATCH`
- **Description**: Discharge a patient from a bed by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Bed ID
- **Response**:
  ```json
  {
    "success": true,
    "bed": {
      "id": "string",
      "bedId": "string",
      "bedNumber": 0,
      "room": "string",
      "status": "AVAILABLE",
      "patient": null,
      "admissionDate": null,
      "dischargeDate": null,
      "clinic": "string",
      "notes": "string",
      "patientDetails": null,
      "roomDetails": {
        "roomNumber": "string",
        "roomType": "string",
        "floor": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Reserve Bed

- **URL**: `/beds/{id}/reserve/`
- **Method**: `PATCH`
- **Description**: Reserve a bed by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Bed ID
- **Response**:
  ```json
  {
    "success": true,
    "bed": {
      "id": "string",
      "bedId": "string",
      "bedNumber": 0,
      "room": "string",
      "status": "RESERVED",
      "patient": null,
      "admissionDate": null,
      "dischargeDate": null,
      "clinic": "string",
      "notes": "string",
      "patientDetails": null,
      "roomDetails": {
        "roomNumber": "string",
        "roomType": "string",
        "floor": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Get Beds by Room

- **URL**: `/beds/room/{roomId}/`
- **Method**: `GET`
- **Description**: Get all beds for a room by room ID
- **Authentication**: Required
- **Path Parameters**:
  - `roomId`: Room ID
- **Response**:
  ```json
  {
    "success": true,
    "beds": [
      {
        "id": "string",
        "bedId": "string",
        "bedNumber": 0,
        "room": "string",
        "status": "string",
        "patient": "string",
        "admissionDate": "string",
        "dischargeDate": "string",
        "clinic": "string",
        "notes": "string",
        "patientDetails": {
          "patientId": "string",
          "name": "string",
          "gender": "string",
          "age": 0
        },
        "roomDetails": {
          "roomNumber": "string",
          "roomType": "string",
          "floor": 0
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

### Transactions

#### Get All Transactions

- **URL**: `/transactions/`
- **Method**: `GET`
- **Description**: Get a list of all transactions, optionally filtered by clinic, patient, or type
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `patientId` (optional): Filter by patient ID
  - `type` (optional): Filter by transaction type
- **Response**:
  ```json
  {
    "success": true,
    "transactions": [
      {
        "id": "string",
        "transactionId": "string",
        "amount": 0,
        "type": "string",
        "description": "string",
        "paymentMethod": "string",
        "paymentStatus": "string",
        "invoice": "string",
        "appointment": "string",
        "patient": "string",
        "doctor": "string",
        "clinic": "string",
        "receipt": "string",
        "receiptUrl": "string",
        "patientDetails": {
          "patientId": "string",
          "name": "string",
          "gender": "string",
          "age": 0
        },
        "doctorDetails": {
          "name": "string",
          "specialization": "string"
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Transaction

- **URL**: `/transactions/{id}/`
- **Method**: `GET`
- **Description**: Get a transaction by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Transaction ID
- **Response**:
  ```json
  {
    "success": true,
    "transaction": {
      "id": "string",
      "transactionId": "string",
      "amount": 0,
      "type": "string",
      "description": "string",
      "paymentMethod": "string",
      "paymentStatus": "string",
      "invoice": "string",
      "appointment": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "receipt": "string",
      "receiptUrl": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Transaction

- **URL**: `/transactions/`
- **Method**: `POST`
- **Description**: Create a new transaction
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "amount": 0,
    "type": "string",
    "description": "string",
    "paymentMethod": "string",
    "paymentStatus": "string",
    "invoiceId": "string",
    "appointmentId": "string",
    "patientId": "string",
    "doctorId": "string",
    "clinicId": "string",
    "receipt": "file"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "transaction": {
      "id": "string",
      "transactionId": "string",
      "amount": 0,
      "type": "string",
      "description": "string",
      "paymentMethod": "string",
      "paymentStatus": "string",
      "invoice": "string",
      "appointment": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "receipt": "string",
      "receiptUrl": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Transaction

- **URL**: `/transactions/{id}/`
- **Method**: `PATCH`
- **Description**: Update a transaction by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Transaction ID
- **Request Body**:
  ```json
  {
    "description": "string",
    "paymentMethod": "string",
    "paymentStatus": "string",
    "receipt": "file"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "transaction": {
      "id": "string",
      "transactionId": "string",
      "amount": 0,
      "type": "string",
      "description": "string",
      "paymentMethod": "string",
      "paymentStatus": "string",
      "invoice": "string",
      "appointment": "string",
      "patient": "string",
      "doctor": "string",
      "clinic": "string",
      "receipt": "string",
      "receiptUrl": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "doctorDetails": {
        "name": "string",
        "specialization": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Transaction

- **URL**: `/transactions/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a transaction by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Transaction ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Get Transaction Summary

- **URL**: `/transactions/summary/`
- **Method**: `GET`
- **Description**: Get a summary of transactions for a clinic
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId`: Clinic ID
  - `period` (optional): Period for the summary (day, week, month, year)
- **Response**:
  ```json
  {
    "success": true,
    "summary": {
      "period": "string",
      "income": 0,
      "expense": 0,
      "refund": 0,
      "net": 0,
      "paymentMethods": {
        "CASH": 0,
        "CREDIT_CARD": 0,
        "DEBIT_CARD": 0,
        "UPI": 0,
        "BANK_TRANSFER": 0,
        "CHEQUE": 0,
        "INSURANCE": 0
      },
      "transactionCount": 0
    }
  }
  ```

### Invoices

#### Get All Invoices

- **URL**: `/billing/invoices/`
- **Method**: `GET`
- **Description**: Get a list of all invoices, optionally filtered by clinic, patient, or status
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `patientId` (optional): Filter by patient ID
  - `status` (optional): Filter by status
- **Response**:
  ```json
  {
    "success": true,
    "invoices": [
      {
        "id": "string",
        "invoiceId": "string",
        "patient": "string",
        "clinic": "string",
        "appointment": "string",
        "items": [
          {
            "id": "string",
            "description": "string",
            "quantity": 0,
            "unitPrice": 0,
            "amount": 0,
            "type": "string",
            "medicineId": "string",
            "treatmentId": "string"
          }
        ],
        "subtotal": 0,
        "discount": 0,
        "tax": 0,
        "total": 0,
        "dueDate": "string",
        "status": "string",
        "notes": "string",
        "document": "string",
        "documentUrl": "string",
        "patientDetails": {
          "patientId": "string",
          "name": "string",
          "gender": "string",
          "age": 0
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Invoice

- **URL**: `/billing/invoices/{id}/`
- **Method**: `GET`
- **Description**: Get an invoice by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Invoice ID
- **Response**:
  ```json
  {
    "success": true,
    "invoice": {
      "id": "string",
      "invoiceId": "string",
      "patient": "string",
      "clinic": "string",
      "appointment": "string",
      "items": [
        {
          "id": "string",
          "description": "string",
          "quantity": 0,
          "unitPrice": 0,
          "amount": 0,
          "type": "string",
          "medicineId": "string",
          "treatmentId": "string"
        }
      ],
      "subtotal": 0,
      "discount": 0,
      "tax": 0,
      "total": 0,
      "dueDate": "string",
      "status": "string",
      "notes": "string",
      "document": "string",
      "documentUrl": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Create Invoice

- **URL**: `/billing/invoices/`
- **Method**: `POST`
- **Description**: Create a new invoice
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "patientId": "string",
    "clinicId": "string",
    "appointmentId": "string",
    "items": [
      {
        "description": "string",
        "quantity": 0,
        "unitPrice": 0,
        "amount": 0,
        "type": "string",
        "medicineId": "string",
        "treatmentId": "string"
      }
    ],
    "subtotal": 0,
    "discount": 0,
    "tax": 0,
    "total": 0,
    "dueDate": "string",
    "notes": "string",
    "document": "file"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "invoice": {
      "id": "string",
      "invoiceId": "string",
      "patient": "string",
      "clinic": "string",
      "appointment": "string",
      "items": [
        {
          "id": "string",
          "description": "string",
          "quantity": 0,
          "unitPrice": 0,
          "amount": 0,
          "type": "string",
          "medicineId": "string",
          "treatmentId": "string"
        }
      ],
      "subtotal": 0,
      "discount": 0,
      "tax": 0,
      "total": 0,
      "dueDate": "string",
      "status": "DRAFT",
      "notes": "string",
      "document": "string",
      "documentUrl": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Update Invoice

- **URL**: `/billing/invoices/{id}/`
- **Method**: `PATCH`
- **Description**: Update an invoice by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Invoice ID
- **Request Body**:
  ```json
  {
    "items": [
      {
        "id": "string",
        "description": "string",
        "quantity": 0,
        "unitPrice": 0,
        "amount": 0,
        "type": "string",
        "medicineId": "string",
        "treatmentId": "string"
      }
    ],
    "discount": 0,
    "tax": 0,
    "dueDate": "string",
    "status": "string",
    "notes": "string",
    "document": "file"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "invoice": {
      "id": "string",
      "invoiceId": "string",
      "patient": "string",
      "clinic": "string",
      "appointment": "string",
      "items": [
        {
          "id": "string",
          "description": "string",
          "quantity": 0,
          "unitPrice": 0,
          "amount": 0,
          "type": "string",
          "medicineId": "string",
          "treatmentId": "string"
        }
      ],
      "subtotal": 0,
      "discount": 0,
      "tax": 0,
      "total": 0,
      "dueDate": "string",
      "status": "string",
      "notes": "string",
      "document": "string",
      "documentUrl": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### Delete Invoice

- **URL**: `/billing/invoices/{id}/`
- **Method**: `DELETE`
- **Description**: Delete an invoice by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Invoice ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Record Payment

- **URL**: `/billing/payment/`
- **Method**: `POST`
- **Description**: Record a payment for an invoice
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "invoiceId": "string",
    "amount": 0,
    "paymentMethod": "string",
    "description": "string",
    "patientId": "string",
    "clinicId": "string",
    "receipt": "file"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "transaction": {
      "id": "string",
      "transactionId": "string",
      "amount": 0,
      "type": "INCOME",
      "description": "string",
      "paymentMethod": "string",
      "paymentStatus": "PAID",
      "invoice": "string",
      "patient": "string",
      "clinic": "string",
      "receipt": "string",
      "receiptUrl": "string",
      "patientDetails": {
        "patientId": "string",
        "name": "string",
        "gender": "string",
        "age": 0
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Treatments

#### Get All Treatments

- **URL**: `/treatments/`
- **Method**: `GET`
- **Description**: Get a list of all treatments
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "treatments": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "cost": 0,
        "duration": 0,
        "clinic": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Delete Treatment

- **URL**: `/treatments/{id}/`
- **Method**: `DELETE`
- **Description**: Delete a treatment by ID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: Treatment ID
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### Dashboard

#### Get Dashboard Stats

- **URL**: `/dashboard/stats/`
- **Method**: `GET`
- **Description**: Get dashboard statistics
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID
- **Response**:
  ```json
  {
    "success": true,
    "stats": {
      "todayAppointments": 0,
      "todayPatients": 0,
      "totalPatients": 0,
      "malePatients": 0,
      "femalePatients": 0,
      "childPatients": 0,
      "availableDoctors": 0,
      "checkIns": 0,
      "appointments": 0
    }
  }
  ```

#### Get Recent Appointments

- **URL**: `/dashboard/appointments/`
- **Method**: `GET`
- **Description**: Get recent appointments
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID
- **Response**:
  ```json
  {
    "success": true,
    "appointments": [
      {
        "id": "string",
        "appointmentId": "string",
        "patient": "string",
        "doctor": "string",
        "clinic": "string",
        "appointmentDate": "string",
        "startTime": "string",
        "endTime": "string",
        "duration": 0,
        "type": "string",
        "status": "string",
        "concern": "string",
        "patientDetails": {
          "patientId": "string",
          "name": "string",
          "phone": "string",
          "gender": "string",
          "age": 0
        },
        "doctorDetails": {
          "name": "string",
          "specialization": "string"
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

#### Get Doctors Activity

- **URL**: `/dashboard/doctors-activity/`
- **Method**: `GET`
- **Description**: Get doctors activity
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "doctorsActivity": [
      {
        "id": "string",
        "name": "string",
        "specialization": "string",
        "isAvailable": true,
        "appointments": {
          "inProgress": 0,
          "completed": 0,
          "pending": 0,
          "total": 0
        }
      }
    ]
  }
  ```

#### Get Recent Reports

- **URL**: `/dashboard/reports/`
- **Method**: `GET`
- **Description**: Get recent reports
- **Authentication**: Required
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "reports": [
      {
        "id": "string",
        "title": "string",
        "type": "string",
        "generatedDate": "string",
        "size": "string",
        "format": "string"
      }
    ]
  }
  ```

### Admin Dashboard

#### Get Admin Dashboard Stats

- **URL**: `/admin/stats/`
- **Method**: `GET`
- **Description**: Get admin dashboard statistics
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Query Parameters**:
  - `clinicId`: Clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "stats": {
      "totalPatients": 0,
      "appointments": 0,
      "doctors": 0,
      "staff": 0
    }
  }
  ```

#### Get Admin Doctors

- **URL**: `/admin/doctors/`
- **Method**: `GET`
- **Description**: Get doctors for admin dashboard
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Query Parameters**:
  - `clinicId`: Clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "doctors": [
      {
        "id": "string",
        "name": "string",
        "specialization": "string",
        "isAvailable": true,
        "appointmentCount": 0
      }
    ]
  }
  ```

#### Get Admin Staff

- **URL**: `/admin/staff/`
- **Method**: `GET`
- **Description**: Get staff for admin dashboard
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Query Parameters**:
  - `clinicId`: Clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "staff": [
      {
        "id": "string",
        "name": "string",
        "role": "string",
        "isAvailable": true
      }
    ]
  }
  ```

#### Get Admin Transactions

- **URL**: `/admin/transactions/`
- **Method**: `GET`
- **Description**: Get transactions for admin dashboard
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Query Parameters**:
  - `clinicId`: Clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "transactions": [
      {
        "id": "string",
        "doctorName": "string",
        "testName": "string",
        "date": "string",
        "amount": 0
      }
    ]
  }
  ```

#### Get Admin Appointments

- **URL**: `/admin/appointments/`
- **Method**: `GET`
- **Description**: Get appointments for admin dashboard
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Query Parameters**:
  - `clinicId`: Clinic ID
- **Response**:
  ```json
  {
    "success": true,
    "appointments": [
      {
        "id": "string",
        "sNo": 0,
        "name": "string",
        "phoneNumber": "string",
        "email": "string",
        "age": 0,
        "gender": "string",
        "action": "string"
      }
    ]
  }
  ```

### Analytics

#### Get Analytics Data

- **URL**: `/analytics/`
- **Method**: `GET`
- **Description**: Get analytics data
- **Authentication**: Required (SUPER_ADMIN or ADMIN role)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "revenue": {
        "thisMonth": 0,
        "lastMonth": 0,
        "growth": 0
      },
      "patients": {
        "total": 0,
        "growth": 0
      },
      "appointments": {
        "completionRate": 0,
        "total": 0
      }
    }
  }
  ```

## Data Types

### User Roles

- `SUPER_ADMIN`: Super administrator with access to all clinics
- `ADMIN`: Administrator of a specific clinic
- `STAFF`: Staff member of a specific clinic
- `DOCTOR`: Doctor of a specific clinic

### Appointment Status

- `SCHEDULED`: Appointment is scheduled
- `CONFIRMED`: Appointment is confirmed
- `CHECKED_IN`: Patient has checked in for the appointment
- `IN_PROGRESS`: Appointment is in progress
- `COMPLETED`: Appointment is completed
- `CANCELLED`: Appointment is cancelled
- `NO_SHOW`: Patient did not show up for the appointment
- `RESCHEDULED`: Appointment is rescheduled

### Appointment Type

- `REGULAR`: Regular appointment
- `EMERGENCY`: Emergency appointment
- `FOLLOW_UP`: Follow-up appointment
- `CONSULTATION`: Consultation appointment
- `PROCEDURE`: Procedure appointment
- `CHECKUP`: Checkup appointment
- `VACCINATION`: Vaccination appointment
- `LABORATORY`: Laboratory appointment

### Gender

- `MALE`: Male
- `FEMALE`: Female
- `OTHER`: Other

### Blood Group

- `A+`: A positive
- `A-`: A negative
- `B+`: B positive
- `B-`: B negative
- `AB+`: AB positive
- `AB-`: AB negative
- `O+`: O positive
- `O-`: O negative

### Medicine Type

- `TABLET`: Tablet
- `CAPSULE`: Capsule
- `SYRUP`: Syrup
- `INJECTION`: Injection
- `CREAM`: Cream
- `OINTMENT`: Ointment
- `DROPS`: Drops
- `INHALER`: Inhaler
- `POWDER`: Powder
- `LOTION`: Lotion

### Bed Status

- `AVAILABLE`: Bed is available
- `OCCUPIED`: Bed is occupied
- `RESERVED`: Bed is reserved
- `MAINTENANCE`: Bed is under maintenance

### Room Type

- `GENERAL`: General room
- `PRIVATE`: Private room
- `SEMI_PRIVATE`: Semi-private room
- `ICU`: Intensive Care Unit
- `EMERGENCY`: Emergency room
- `OPERATION_THEATER`: Operation theater
- `LABOR`: Labor room
- `NURSERY`: Nursery

### Transaction Type

- `INCOME`: Income transaction
- `EXPENSE`: Expense transaction
- `REFUND`: Refund transaction

### Payment Method

- `CASH`: Cash payment
- `CREDIT_CARD`: Credit card payment
- `DEBIT_CARD`: Debit card payment
- `UPI`: UPI payment
- `BANK_TRANSFER`: Bank transfer payment
- `CHEQUE`: Cheque payment
- `INSURANCE`: Insurance payment

### Payment Status

- `PAID`: Payment is paid
- `PENDING`: Payment is pending
- `CANCELLED`: Payment is cancelled
- `REFUNDED`: Payment is refunded
- `PARTIALLY_PAID`: Payment is partially paid

### Invoice Status

- `DRAFT`: Invoice is in draft state
- `SENT`: Invoice is sent to the patient
- `PAID`: Invoice is paid
- `OVERDUE`: Invoice is overdue
- `CANCELLED`: Invoice is cancelled
- `PARTIALLY_PAID`: Invoice is partially paid

### Invoice Item Type

- `CONSULTATION`: Consultation fee
- `MEDICINE`: Medicine
- `TREATMENT`: Treatment
- `PROCEDURE`: Procedure
- `LABORATORY`: Laboratory test
- `ROOM_CHARGE`: Room charge
- `OTHER`: Other

### Document Type

- `REPORT`: Medical report
- `PRESCRIPTION`: Prescription
- `INVOICE`: Invoice
- `RECEIPT`: Receipt
- `CONSENT_FORM`: Consent form
- `MEDICAL_RECORD`: Medical record
- `INSURANCE`: Insurance document
- `OTHER`: Other document