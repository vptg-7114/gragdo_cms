# DigiGo Care API Documentation

This document provides a comprehensive overview of all API endpoints available in the DigiGo Care Clinic Management System.

## Base URL

```
https://api.digigocare.com/api
```

For local development:

```
http://localhost:8000/api
```

## Authentication

Most endpoints require authentication. The API uses JWT (JSON Web Token) authentication.

### Headers

For authenticated requests, include the following header:

```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

#### Login

```
POST /auth/login/
```

Authenticates a user and returns access and refresh tokens.

**Request Body:**

| Field    | Type   | Required | Description                                                |
|----------|--------|----------|------------------------------------------------------------|
| email    | string | Yes      | User's email address                                       |
| password | string | Yes      | User's password                                            |
| role     | string | Yes      | User's role (SUPER_ADMIN, ADMIN, STAFF, DOCTOR)            |

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "clinicId": "string",
    "clinicIds": ["string"]
  },
  "access": "string",
  "refresh": "string"
}
```

#### Signup

```
POST /auth/signup/
```

Registers a new user.

**Request Body:**

| Field           | Type   | Required | Description                                                |
|-----------------|--------|----------|------------------------------------------------------------|
| firstName       | string | Yes      | User's first name                                          |
| lastName        | string | Yes      | User's last name                                           |
| email           | string | Yes      | User's email address                                       |
| phone           | string | Yes      | User's phone number                                        |
| role            | string | Yes      | User's role (SUPER_ADMIN, ADMIN, STAFF, DOCTOR)            |
| clinicId        | string | No       | Clinic ID (required for ADMIN, STAFF, DOCTOR roles)        |
| password        | string | Yes      | User's password                                            |
| confirm_password| string | Yes      | Confirmation of password                                   |

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "clinicId": "string",
    "clinicIds": ["string"]
  },
  "access": "string",
  "refresh": "string"
}
```

#### Forgot Password

```
POST /auth/forgot-password/
```

Sends a password reset link to the user's email.

**Request Body:**

| Field | Type   | Required | Description         |
|-------|--------|----------|---------------------|
| email | string | Yes      | User's email address|

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Reset Password

```
POST /auth/reset-password/
```

Resets a user's password using a token.

**Request Body:**

| Field           | Type   | Required | Description                  |
|-----------------|--------|----------|------------------------------|
| token           | string | Yes      | Password reset token         |
| new_password    | string | Yes      | New password                 |
| confirm_password| string | Yes      | Confirmation of new password |

**Response:**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

#### Logout

```
POST /auth/logout/
```

Logs out the current user.

**Response:**

```json
{
  "success": true
}
```

#### Get Current User

```
GET /auth/me/
```

Returns the currently authenticated user.

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "clinicId": "string",
    "clinicIds": ["string"]
  }
}
```

#### Refresh Token

```
POST /auth/token/refresh/
```

Refreshes an access token using a refresh token.

**Request Body:**

| Field   | Type   | Required | Description    |
|---------|--------|----------|----------------|
| refresh | string | Yes      | Refresh token  |

**Response:**

```json
{
  "access": "string",
  "refresh": "string"
}
```

## Profile Endpoints

### Get User Profile

```
GET /profile/
```

Returns the user's profile information.

**Query Parameters:**

| Parameter | Type   | Required | Description                                |
|-----------|--------|----------|--------------------------------------------|
| userId    | string | No       | User ID (optional if authenticated)        |

**Response:**

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
    "createdAt": "string"
  }
}
```

### Update User Profile

```
PATCH /profile/
```

Updates the user's profile information.

**Request Body:**

| Field        | Type   | Required | Description                |
|--------------|--------|----------|----------------------------|
| userId       | string | Yes      | User ID                    |
| name         | string | No       | User's name                |
| email        | string | No       | User's email address       |
| phone        | string | No       | User's phone number        |
| address      | string | No       | User's address             |
| bio          | string | No       | User's bio                 |
| profileImage | string | No       | User's profile image URL   |

**Response:**

```json
{
  "success": true
}
```

## Clinic Endpoints

### Get All Clinics

```
GET /clinics/
```

Returns a list of all clinics.

**Response:**

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

### Get Clinic by ID

```
GET /clinics/{id}/
```

Returns a specific clinic by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Clinic ID   |

**Response:**

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

### Create Clinic

```
POST /clinics/
```

Creates a new clinic.

**Request Body:**

| Field       | Type   | Required | Description           |
|-------------|--------|----------|-----------------------|
| name        | string | Yes      | Clinic name           |
| address     | string | Yes      | Clinic address        |
| phone       | string | Yes      | Clinic phone number   |
| email       | string | No       | Clinic email address  |
| description | string | No       | Clinic description    |

**Response:**

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

### Update Clinic

```
PATCH /clinics/{id}/
```

Updates a clinic.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Clinic ID   |

**Request Body:**

| Field       | Type   | Required | Description           |
|-------------|--------|----------|-----------------------|
| name        | string | No       | Clinic name           |
| address     | string | No       | Clinic address        |
| phone       | string | No       | Clinic phone number   |
| email       | string | No       | Clinic email address  |
| description | string | No       | Clinic description    |

**Response:**

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

### Delete Clinic

```
DELETE /clinics/{id}/
```

Deletes a clinic.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Clinic ID   |

**Response:**

```json
{
  "success": true
}
```

## Doctor Endpoints

### Get All Doctors

```
GET /doctors/
```

Returns a list of all doctors.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |

**Response:**

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
      "schedules": [],
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Get Doctor by ID

```
GET /doctors/{id}/
```

Returns a specific doctor by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Doctor ID   |

**Response:**

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

### Create Doctor

```
POST /doctors/
```

Creates a new doctor.

**Request Body:**

| Field           | Type   | Required | Description                |
|-----------------|--------|----------|----------------------------|
| name            | string | Yes      | Doctor name                |
| email           | string | No       | Doctor email address       |
| phone           | string | Yes      | Doctor phone number        |
| specialization  | string | Yes      | Doctor specialization      |
| qualification   | string | No       | Doctor qualification       |
| experience      | number | No       | Years of experience        |
| consultationFee | number | No       | Consultation fee           |
| clinicId        | string | Yes      | Clinic ID                  |

**Response:**

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

### Update Doctor

```
PATCH /doctors/{id}/
```

Updates a doctor.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Doctor ID   |

**Request Body:**

| Field           | Type    | Required | Description                |
|-----------------|---------|----------|----------------------------|
| name            | string  | No       | Doctor name                |
| email           | string  | No       | Doctor email address       |
| phone           | string  | No       | Doctor phone number        |
| specialization  | string  | No       | Doctor specialization      |
| qualification   | string  | No       | Doctor qualification       |
| experience      | number  | No       | Years of experience        |
| consultationFee | number  | No       | Consultation fee           |
| isAvailable     | boolean | No       | Availability status        |

**Response:**

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

### Delete Doctor

```
DELETE /doctors/{id}/
```

Deletes a doctor.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Doctor ID   |

**Response:**

```json
{
  "success": true
}
```

### Toggle Doctor Availability

```
POST /doctors/{id}/toggle-availability/
```

Toggles a doctor's availability status.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Doctor ID   |

**Response:**

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

## Patient Endpoints

### Get All Patients

```
GET /patients/
```

Returns a list of all patients.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |

**Response:**

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
      "emergencyContact": {},
      "clinic": "string",
      "isActive": true,
      "documents": [],
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Get Patient by ID

```
GET /patients/{id}/
```

Returns a specific patient by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Patient ID  |

**Response:**

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
    "emergencyContact": {},
    "clinic": "string",
    "isActive": true,
    "documents": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Create Patient

```
POST /patients/
```

Creates a new patient.

**Request Body:**

| Field           | Type    | Required | Description                |
|-----------------|---------|----------|----------------------------|
| firstName       | string  | Yes      | Patient first name         |
| lastName        | string  | Yes      | Patient last name          |
| email           | string  | No       | Patient email address      |
| phone           | string  | Yes      | Patient phone number       |
| gender          | string  | Yes      | Gender (MALE, FEMALE, OTHER)|
| dateOfBirth     | string  | Yes      | Date of birth (YYYY-MM-DD) |
| bloodGroup      | string  | No       | Blood group                |
| address         | string  | No       | Patient address            |
| city            | string  | No       | Patient city               |
| state           | string  | No       | Patient state              |
| postalCode      | string  | No       | Patient postal code        |
| medicalHistory  | string  | No       | Medical history            |
| allergies       | string  | No       | Allergies                  |
| emergencyContact| object  | No       | Emergency contact details  |
| clinicId        | string  | Yes      | Clinic ID                  |

**Response:**

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
    "emergencyContact": {},
    "clinic": "string",
    "isActive": true,
    "documents": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Update Patient

```
PATCH /patients/{id}/
```

Updates a patient.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Patient ID  |

**Request Body:**

| Field           | Type    | Required | Description                |
|-----------------|---------|----------|----------------------------|
| firstName       | string  | No       | Patient first name         |
| lastName        | string  | No       | Patient last name          |
| email           | string  | No       | Patient email address      |
| phone           | string  | No       | Patient phone number       |
| gender          | string  | No       | Gender (MALE, FEMALE, OTHER)|
| dateOfBirth     | string  | No       | Date of birth (YYYY-MM-DD) |
| bloodGroup      | string  | No       | Blood group                |
| address         | string  | No       | Patient address            |
| city            | string  | No       | Patient city               |
| state           | string  | No       | Patient state              |
| postalCode      | string  | No       | Patient postal code        |
| medicalHistory  | string  | No       | Medical history            |
| allergies       | string  | No       | Allergies                  |
| emergencyContact| object  | No       | Emergency contact details  |
| isActive        | boolean | No       | Active status              |

**Response:**

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
    "emergencyContact": {},
    "clinic": "string",
    "isActive": true,
    "documents": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Delete Patient

```
DELETE /patients/{id}/
```

Deletes a patient.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Patient ID  |

**Response:**

```json
{
  "success": true
}
```

### Get Patient Documents

```
GET /patients/{id}/documents/
```

Returns a list of documents for a specific patient.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Patient ID  |

**Response:**

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
      "tags": [],
      "notes": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

## Appointment Endpoints

### Get All Appointments

```
GET /appointments/
```

Returns a list of all appointments.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |
| doctorId  | string | No       | Filter by doctor ID        |
| patientId | string | No       | Filter by patient ID       |
| status    | string | No       | Filter by status           |

**Response:**

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
      "vitals": {},
      "cancelledAt": "string",
      "cancelledBy": "string",
      "cancelReason": "string",
      "followUpDate": "string",
      "isFollowUp": false,
      "previousAppointment": "string",
      "patientDetails": {},
      "doctorDetails": {},
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Get Appointment by ID

```
GET /appointments/{id}/
```

Returns a specific appointment by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Create Appointment

```
POST /appointments/
```

Creates a new appointment.

**Request Body:**

| Field               | Type    | Required | Description                |
|---------------------|---------|----------|----------------------------|
| patientId           | string  | Yes      | Patient ID                 |
| doctorId            | string  | Yes      | Doctor ID                  |
| clinicId            | string  | Yes      | Clinic ID                  |
| appointmentDate     | string  | Yes      | Appointment date (YYYY-MM-DD)|
| startTime           | string  | Yes      | Start time (HH:MM)         |
| endTime             | string  | Yes      | End time (HH:MM)           |
| duration            | number  | Yes      | Duration in minutes        |
| type                | string  | Yes      | Appointment type           |
| concern             | string  | Yes      | Patient concern            |
| notes               | string  | No       | Additional notes           |
| isFollowUp          | boolean | No       | Is this a follow-up appointment?|
| previousAppointmentId| string  | No       | Previous appointment ID    |

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Update Appointment

```
PATCH /appointments/{id}/
```

Updates an appointment.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Request Body:**

| Field           | Type    | Required | Description                |
|-----------------|---------|----------|----------------------------|
| appointmentDate | string  | No       | Appointment date (YYYY-MM-DD)|
| startTime       | string  | No       | Start time (HH:MM)         |
| endTime         | string  | No       | End time (HH:MM)           |
| duration        | number  | No       | Duration in minutes        |
| type            | string  | No       | Appointment type           |
| concern         | string  | No       | Patient concern            |
| notes           | string  | No       | Additional notes           |
| status          | string  | No       | Appointment status         |
| vitals          | object  | No       | Patient vitals             |
| followUpDate    | string  | No       | Follow-up date (YYYY-MM-DD)|
| action          | string  | No       | Action to perform (checkIn, start, complete, reschedule, cancel)|

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Delete Appointment

```
DELETE /appointments/{id}/
```

Deletes an appointment.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Response:**

```json
{
  "success": true
}
```

### Check In Appointment

```
PATCH /appointments/{id}/check-in/
```

Checks in an appointment.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Start Appointment

```
PATCH /appointments/{id}/start/
```

Starts an appointment.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Complete Appointment

```
PATCH /appointments/{id}/complete/
```

Completes an appointment.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Request Body:**

| Field        | Type    | Required | Description                |
|--------------|---------|----------|----------------------------|
| vitals       | object  | No       | Patient vitals             |
| notes        | string  | No       | Additional notes           |
| followUpDate | string  | No       | Follow-up date (YYYY-MM-DD)|

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Reschedule Appointment

```
PATCH /appointments/{id}/reschedule/
```

Reschedules an appointment.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Request Body:**

| Field           | Type    | Required | Description                |
|-----------------|---------|----------|----------------------------|
| appointmentDate | string  | Yes      | New appointment date (YYYY-MM-DD)|
| startTime       | string  | Yes      | New start time (HH:MM)     |
| endTime         | string  | Yes      | New end time (HH:MM)       |
| duration        | number  | Yes      | New duration in minutes    |

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Cancel Appointment

```
PATCH /appointments/{id}/cancel/
```

Cancels an appointment.

**Path Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| id        | string | Yes      | Appointment ID |

**Request Body:**

| Field        | Type   | Required | Description                |
|--------------|--------|----------|----------------------------|
| cancelReason | string | Yes      | Reason for cancellation    |

**Response:**

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
    "vitals": {},
    "cancelledAt": "string",
    "cancelledBy": "string",
    "cancelReason": "string",
    "followUpDate": "string",
    "isFollowUp": false,
    "previousAppointment": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## Prescription Endpoints

### Get All Prescriptions

```
GET /prescriptions/
```

Returns a list of all prescriptions.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |
| doctorId  | string | No       | Filter by doctor ID        |
| patientId | string | No       | Filter by patient ID       |

**Response:**

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
      "medications": [],
      "instructions": "string",
      "followUpDate": "string",
      "isActive": true,
      "document": "string",
      "documentUrl": "string",
      "patientDetails": {},
      "doctorDetails": {},
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Get Prescription by ID

```
GET /prescriptions/{id}/
```

Returns a specific prescription by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Prescription ID |

**Response:**

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
    "medications": [],
    "instructions": "string",
    "followUpDate": "string",
    "isActive": true,
    "document": "string",
    "documentUrl": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Create Prescription

```
POST /prescriptions/
```

Creates a new prescription.

**Request Body:**

| Field        | Type    | Required | Description                |
|--------------|---------|----------|----------------------------|
| patientId    | string  | Yes      | Patient ID                 |
| doctorId     | string  | Yes      | Doctor ID                  |
| clinicId     | string  | Yes      | Clinic ID                  |
| appointmentId| string  | Yes      | Appointment ID             |
| diagnosis    | string  | Yes      | Diagnosis                  |
| medications  | array   | Yes      | Medications                |
| instructions | string  | No       | Instructions               |
| followUpDate | string  | No       | Follow-up date (YYYY-MM-DD)|
| document     | file    | No       | Prescription document      |

**Medication Object:**

| Field        | Type    | Required | Description                |
|--------------|---------|----------|----------------------------|
| name         | string  | Yes      | Medication name            |
| dosage       | string  | Yes      | Dosage                     |
| frequency    | string  | Yes      | Frequency                  |
| duration     | string  | Yes      | Duration                   |
| instructions | string  | No       | Instructions               |
| medicineId   | string  | No       | Medicine ID (from inventory)|
| quantity     | number  | Yes      | Quantity                   |

**Response:**

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
    "medications": [],
    "instructions": "string",
    "followUpDate": "string",
    "isActive": true,
    "document": "string",
    "documentUrl": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Update Prescription

```
PATCH /prescriptions/{id}/
```

Updates a prescription.

**Path Parameters:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Prescription ID |

**Request Body:**

| Field        | Type    | Required | Description                |
|--------------|---------|----------|----------------------------|
| diagnosis    | string  | No       | Diagnosis                  |
| medications  | array   | No       | Medications                |
| instructions | string  | No       | Instructions               |
| followUpDate | string  | No       | Follow-up date (YYYY-MM-DD)|
| isActive     | boolean | No       | Active status              |
| document     | file    | No       | Prescription document      |

**Response:**

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
    "medications": [],
    "instructions": "string",
    "followUpDate": "string",
    "isActive": true,
    "document": "string",
    "documentUrl": "string",
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Delete Prescription

```
DELETE /prescriptions/{id}/
```

Deletes a prescription.

**Path Parameters:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Prescription ID |

**Response:**

```json
{
  "success": true
}
```

## Medicine Endpoints

### Get All Medicines

```
GET /medicines/
```

Returns a list of all medicines.

**Query Parameters:**

| Parameter | Type    | Required | Description                |
|-----------|---------|----------|----------------------------|
| clinicId  | string  | No       | Filter by clinic ID        |
| isActive  | boolean | No       | Filter by active status    |

**Response:**

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

### Get Medicine by ID

```
GET /medicines/{id}/
```

Returns a specific medicine by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description  |
|-----------|--------|----------|--------------|
| id        | string | Yes      | Medicine ID  |

**Response:**

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

### Create Medicine

```
POST /medicines/
```

Creates a new medicine.

**Request Body:**

| Field            | Type    | Required | Description                |
|------------------|---------|----------|----------------------------|
| name             | string  | Yes      | Medicine name              |
| manufacturer     | string  | Yes      | Manufacturer               |
| batchNumber      | string  | Yes      | Batch number               |
| type             | string  | Yes      | Medicine type              |
| dosage           | string  | Yes      | Dosage                     |
| manufacturedDate | string  | Yes      | Manufactured date (YYYY-MM-DD)|
| expiryDate       | string  | Yes      | Expiry date (YYYY-MM-DD)   |
| price            | number  | Yes      | Price                      |
| stock            | number  | Yes      | Stock quantity             |
| reorderLevel     | number  | No       | Reorder level              |
| clinicId         | string  | Yes      | Clinic ID                  |

**Response:**

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

### Update Medicine

```
PATCH /medicines/{id}/
```

Updates a medicine.

**Path Parameters:**

| Parameter | Type   | Required | Description  |
|-----------|--------|----------|--------------|
| id        | string | Yes      | Medicine ID  |

**Request Body:**

| Field            | Type    | Required | Description                |
|------------------|---------|----------|----------------------------|
| name             | string  | No       | Medicine name              |
| manufacturer     | string  | No       | Manufacturer               |
| batchNumber      | string  | No       | Batch number               |
| type             | string  | No       | Medicine type              |
| dosage           | string  | No       | Dosage                     |
| manufacturedDate | string  | No       | Manufactured date (YYYY-MM-DD)|
| expiryDate       | string  | No       | Expiry date (YYYY-MM-DD)   |
| price            | number  | No       | Price                      |
| stock            | number  | No       | Stock quantity             |
| reorderLevel     | number  | No       | Reorder level              |
| isActive         | boolean | No       | Active status              |
| action           | string  | No       | Action to perform (updateStock)|

**Response:**

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

### Delete Medicine

```
DELETE /medicines/{id}/
```

Deletes a medicine.

**Path Parameters:**

| Parameter | Type   | Required | Description  |
|-----------|--------|----------|--------------|
| id        | string | Yes      | Medicine ID  |

**Response:**

```json
{
  "success": true
}
```

### Update Medicine Stock

```
PATCH /medicines/{id}/update-stock/
```

Updates a medicine's stock.

**Path Parameters:**

| Parameter | Type   | Required | Description  |
|-----------|--------|----------|--------------|
| id        | string | Yes      | Medicine ID  |

**Request Body:**

| Field      | Type    | Required | Description                |
|------------|---------|----------|----------------------------|
| quantity   | number  | Yes      | Quantity to add/remove     |
| isAddition | boolean | Yes      | True to add, false to remove|

**Response:**

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

## Room Endpoints

### Get All Rooms

```
GET /rooms/
```

Returns a list of all rooms.

**Query Parameters:**

| Parameter | Type    | Required | Description                |
|-----------|---------|----------|----------------------------|
| clinicId  | string  | No       | Filter by clinic ID        |
| isActive  | boolean | No       | Filter by active status    |

**Response:**

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

### Get Room by ID

```
GET /rooms/{id}/
```

Returns a specific room by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

**Response:**

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

### Create Room

```
POST /rooms/
```

Creates a new room.

**Request Body:**

| Field      | Type    | Required | Description                |
|------------|---------|----------|----------------------------|
| roomNumber | string  | Yes      | Room number                |
| roomType   | string  | Yes      | Room type                  |
| floor      | number  | Yes      | Floor number               |
| totalBeds  | number  | Yes      | Total number of beds       |
| clinicId   | string  | Yes      | Clinic ID                  |

**Response:**

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

### Update Room

```
PATCH /rooms/{id}/
```

Updates a room.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

**Request Body:**

| Field      | Type    | Required | Description                |
|------------|---------|----------|----------------------------|
| roomNumber | string  | No       | Room number                |
| roomType   | string  | No       | Room type                  |
| floor      | number  | No       | Floor number               |
| totalBeds  | number  | No       | Total number of beds       |
| isActive   | boolean | No       | Active status              |

**Response:**

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

### Delete Room

```
DELETE /rooms/{id}/
```

Deletes a room.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

**Response:**

```json
{
  "success": true
}
```

## Bed Endpoints

### Get All Beds

```
GET /beds/
```

Returns a list of all beds.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| roomId    | string | No       | Filter by room ID          |
| status    | string | No       | Filter by status           |

**Response:**

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
      "patientDetails": {},
      "roomDetails": {},
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Get Bed by ID

```
GET /beds/{id}/
```

Returns a specific bed by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Bed ID      |

**Response:**

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
    "patientDetails": {},
    "roomDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Create Bed

```
POST /beds/
```

Creates a new bed.

**Request Body:**

| Field     | Type    | Required | Description                |
|-----------|---------|----------|----------------------------|
| bedNumber | number  | Yes      | Bed number                 |
| roomId    | string  | Yes      | Room ID                    |
| clinicId  | string  | Yes      | Clinic ID                  |
| notes     | string  | No       | Additional notes           |

**Response:**

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
    "patientDetails": {},
    "roomDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Update Bed

```
PATCH /beds/{id}/
```

Updates a bed.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Bed ID      |

**Request Body:**

| Field     | Type    | Required | Description                |
|-----------|---------|----------|----------------------------|
| bedNumber | number  | No       | Bed number                 |
| status    | string  | No       | Bed status                 |
| notes     | string  | No       | Additional notes           |
| action    | string  | No       | Action to perform (assign, discharge, reserve)|

**Response:**

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
    "patientDetails": {},
    "roomDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Delete Bed

```
DELETE /beds/{id}/
```

Deletes a bed.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Bed ID      |

**Response:**

```json
{
  "success": true
}
```

### Assign Bed

```
PATCH /beds/{id}/assign/
```

Assigns a patient to a bed.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Bed ID      |

**Request Body:**

| Field         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| patientId     | string | Yes      | Patient ID                 |
| admissionDate | string | Yes      | Admission date (YYYY-MM-DD)|
| dischargeDate | string | No       | Discharge date (YYYY-MM-DD)|

**Response:**

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
    "patientDetails": {},
    "roomDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Discharge Bed

```
PATCH /beds/{id}/discharge/
```

Discharges a patient from a bed.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Bed ID      |

**Response:**

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
    "roomDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Reserve Bed

```
PATCH /beds/{id}/reserve/
```

Reserves a bed.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Bed ID      |

**Response:**

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
    "roomDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Get Beds by Room

```
GET /beds/room/{roomId}/
```

Returns a list of beds for a specific room.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| roomId    | string | Yes      | Room ID     |

**Response:**

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
      "patientDetails": {},
      "roomDetails": {},
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

## Transaction Endpoints

### Get All Transactions

```
GET /transactions/
```

Returns a list of all transactions.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |
| patientId | string | No       | Filter by patient ID       |
| type      | string | No       | Filter by transaction type |

**Response:**

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
      "patientDetails": {},
      "doctorDetails": {},
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Get Transaction by ID

```
GET /transactions/{id}/
```

Returns a specific transaction by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Transaction ID  |

**Response:**

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
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Create Transaction

```
POST /transactions/
```

Creates a new transaction.

**Request Body:**

| Field         | Type    | Required | Description                |
|---------------|---------|----------|----------------------------|
| amount        | number  | Yes      | Transaction amount         |
| type          | string  | Yes      | Transaction type           |
| description   | string  | Yes      | Transaction description    |
| paymentMethod | string  | Yes      | Payment method             |
| paymentStatus | string  | Yes      | Payment status             |
| invoiceId     | string  | No       | Invoice ID                 |
| appointmentId | string  | No       | Appointment ID             |
| patientId     | string  | No       | Patient ID                 |
| doctorId      | string  | No       | Doctor ID                  |
| clinicId      | string  | Yes      | Clinic ID                  |
| receipt       | file    | No       | Receipt document           |

**Response:**

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
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Update Transaction

```
PATCH /transactions/{id}/
```

Updates a transaction.

**Path Parameters:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Transaction ID  |

**Request Body:**

| Field         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| description   | string | No       | Transaction description    |
| paymentMethod | string | No       | Payment method             |
| paymentStatus | string | No       | Payment status             |
| receipt       | file   | No       | Receipt document           |

**Response:**

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
    "patientDetails": {},
    "doctorDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Delete Transaction

```
DELETE /transactions/{id}/
```

Deletes a transaction.

**Path Parameters:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Transaction ID  |

**Response:**

```json
{
  "success": true
}
```

### Get Transaction Summary

```
GET /transactions/summary/
```

Returns a summary of transactions.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | Yes      | Clinic ID                  |
| period    | string | No       | Period (day, week, month, year)|

**Response:**

```json
{
  "success": true,
  "summary": {
    "period": "string",
    "income": 0,
    "expense": 0,
    "refund": 0,
    "net": 0,
    "paymentMethods": {},
    "transactionCount": 0
  }
}
```

## Invoice Endpoints

### Get All Invoices

```
GET /billing/invoices/
```

Returns a list of all invoices.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |
| patientId | string | No       | Filter by patient ID       |
| status    | string | No       | Filter by status           |

**Response:**

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
      "items": [],
      "subtotal": 0,
      "discount": 0,
      "tax": 0,
      "total": 0,
      "dueDate": "string",
      "status": "string",
      "notes": "string",
      "document": "string",
      "documentUrl": "string",
      "patientDetails": {},
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Get Invoice by ID

```
GET /billing/invoices/{id}/
```

Returns a specific invoice by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Invoice ID  |

**Response:**

```json
{
  "success": true,
  "invoice": {
    "id": "string",
    "invoiceId": "string",
    "patient": "string",
    "clinic": "string",
    "appointment": "string",
    "items": [],
    "subtotal": 0,
    "discount": 0,
    "tax": 0,
    "total": 0,
    "dueDate": "string",
    "status": "string",
    "notes": "string",
    "document": "string",
    "documentUrl": "string",
    "patientDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Create Invoice

```
POST /billing/invoices/
```

Creates a new invoice.

**Request Body:**

| Field         | Type    | Required | Description                |
|---------------|---------|----------|----------------------------|
| patientId     | string  | Yes      | Patient ID                 |
| clinicId      | string  | Yes      | Clinic ID                  |
| appointmentId | string  | No       | Appointment ID             |
| items         | array   | Yes      | Invoice items              |
| discount      | number  | Yes      | Discount amount            |
| tax           | number  | Yes      | Tax amount                 |
| dueDate       | string  | Yes      | Due date (YYYY-MM-DD)      |
| notes         | string  | No       | Additional notes           |
| document      | file    | No       | Invoice document           |

**Invoice Item Object:**

| Field        | Type    | Required | Description                |
|--------------|---------|----------|----------------------------|
| description  | string  | Yes      | Item description           |
| quantity     | number  | Yes      | Quantity                   |
| unitPrice    | number  | Yes      | Unit price                 |
| amount       | number  | Yes      | Total amount               |
| type         | string  | Yes      | Item type                  |
| medicineId   | string  | No       | Medicine ID                |
| treatmentId  | string  | No       | Treatment ID               |

**Response:**

```json
{
  "success": true,
  "invoice": {
    "id": "string",
    "invoiceId": "string",
    "patient": "string",
    "clinic": "string",
    "appointment": "string",
    "items": [],
    "subtotal": 0,
    "discount": 0,
    "tax": 0,
    "total": 0,
    "dueDate": "string",
    "status": "string",
    "notes": "string",
    "document": "string",
    "documentUrl": "string",
    "patientDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Update Invoice

```
PATCH /billing/invoices/{id}/
```

Updates an invoice.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Invoice ID  |

**Request Body:**

| Field    | Type    | Required | Description                |
|----------|---------|----------|----------------------------|
| items    | array   | No       | Invoice items              |
| discount | number  | No       | Discount amount            |
| tax      | number  | No       | Tax amount                 |
| dueDate  | string  | No       | Due date (YYYY-MM-DD)      |
| status   | string  | No       | Invoice status             |
| notes    | string  | No       | Additional notes           |
| document | file    | No       | Invoice document           |

**Response:**

```json
{
  "success": true,
  "invoice": {
    "id": "string",
    "invoiceId": "string",
    "patient": "string",
    "clinic": "string",
    "appointment": "string",
    "items": [],
    "subtotal": 0,
    "discount": 0,
    "tax": 0,
    "total": 0,
    "dueDate": "string",
    "status": "string",
    "notes": "string",
    "document": "string",
    "documentUrl": "string",
    "patientDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Delete Invoice

```
DELETE /billing/invoices/{id}/
```

Deletes an invoice.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Invoice ID  |

**Response:**

```json
{
  "success": true
}
```

### Record Payment

```
POST /billing/payment/
```

Records a payment for an invoice.

**Request Body:**

| Field         | Type    | Required | Description                |
|---------------|---------|----------|----------------------------|
| invoiceId     | string  | Yes      | Invoice ID                 |
| amount        | number  | Yes      | Payment amount             |
| paymentMethod | string  | Yes      | Payment method             |
| description   | string  | Yes      | Payment description        |
| patientId     | string  | Yes      | Patient ID                 |
| clinicId      | string  | Yes      | Clinic ID                  |
| document      | file    | No       | Payment receipt            |

**Response:**

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
    "patientDetails": {},
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## Treatment Endpoints

### Get All Treatments

```
GET /treatments/
```

Returns a list of all treatments.

**Response:**

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

### Delete Treatment

```
DELETE /treatments/{id}/
```

Deletes a treatment.

**Path Parameters:**

| Parameter | Type   | Required | Description   |
|-----------|--------|----------|---------------|
| id        | string | Yes      | Treatment ID  |

**Response:**

```json
{
  "success": true
}
```

## Admin Dashboard Endpoints

### Get Admin Dashboard Stats

```
GET /admin/stats/
```

Returns statistics for the admin dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | Yes      | Clinic ID                  |

**Response:**

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

### Get Admin Doctors

```
GET /admin/doctors/
```

Returns doctors for the admin dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | Yes      | Clinic ID                  |

**Response:**

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

### Get Admin Staff

```
GET /admin/staff/
```

Returns staff for the admin dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | Yes      | Clinic ID                  |

**Response:**

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

### Get Admin Transactions

```
GET /admin/transactions/
```

Returns transactions for the admin dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | Yes      | Clinic ID                  |

**Response:**

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

### Get Admin Appointments

```
GET /admin/appointments/
```

Returns appointments for the admin dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | Yes      | Clinic ID                  |

**Response:**

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

## Dashboard Endpoints

### Get Dashboard Stats

```
GET /dashboard/stats/
```

Returns statistics for the dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |
| doctorId  | string | No       | Filter by doctor ID        |

**Response:**

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

### Get Recent Appointments

```
GET /dashboard/appointments/
```

Returns recent appointments for the dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |
| doctorId  | string | No       | Filter by doctor ID        |

**Response:**

```json
{
  "success": true,
  "appointments": [
    {
      "id": "string",
      "patientId": "string",
      "patientName": "string",
      "doctorName": "string",
      "appointmentDate": "string",
      "startTime": "string",
      "status": "string"
    }
  ]
}
```

### Get Doctors Activity

```
GET /dashboard/doctors-activity/
```

Returns doctors activity for the dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |

**Response:**

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

### Get Recent Reports

```
GET /dashboard/reports/
```

Returns recent reports for the dashboard.

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| clinicId  | string | No       | Filter by clinic ID        |

**Response:**

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

## Analytics Endpoints

### Get Analytics Data

```
GET /analytics/
```

Returns analytics data.

**Response:**

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

### Appointment Status

- `SCHEDULED`: Appointment is scheduled
- `CONFIRMED`: Appointment is confirmed
- `CHECKED_IN`: Patient has checked in
- `IN_PROGRESS`: Appointment is in progress
- `COMPLETED`: Appointment is completed
- `CANCELLED`: Appointment is cancelled
- `NO_SHOW`: Patient did not show up
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

- `GENERAL`: General ward
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