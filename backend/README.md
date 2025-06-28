# DigiGo Care Backend API

This is the backend API for the DigiGo Care Clinic Management System. It's built with Flask and uses SQLite for data storage.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Run the application:
   ```
   python app.py
   ```

The API will be available at http://localhost:5000/api

## Database Seeding

The application automatically initializes the database and creates a default super admin user. If you want to seed the database with demo data from the JSON files in the `data` directory, you can run:

```
python seed.py
```

This will import data from the following JSON files (if they exist):
- users.json
- clinics.json
- doctors.json
- patients.json
- appointments.json
- prescriptions.json
- medicines.json
- rooms.json
- beds.json
- transactions.json
- invoices.json
- treatments.json

## API Documentation

The API provides endpoints for managing:
- Authentication (login, signup, password reset)
- Clinics
- Doctors
- Patients
- Appointments
- Prescriptions
- Medicines
- Rooms and Beds
- Transactions and Invoices
- Dashboard statistics and analytics

## Database

The application uses SQLite for data storage. The database file is `digigo_care.db` and is created automatically when the application starts.

## Deployment

To deploy the backend separately from the frontend:

1. Set up a server with Python installed
2. Clone the repository
3. Follow the setup steps above
4. Configure a production server like Gunicorn:
   ```
   pip install gunicorn
   gunicorn app:app
   ```
5. Set up a reverse proxy with Nginx or similar

## Environment Variables

- `FLASK_APP`: The Flask application entry point
- `FLASK_ENV`: The environment (development or production)
- `FLASK_DEBUG`: Enable debug mode (1) or disable (0)
- `JWT_SECRET_KEY`: Secret key for JWT token generation
- `CORS_ORIGINS`: Allowed origins for CORS (comma-separated)