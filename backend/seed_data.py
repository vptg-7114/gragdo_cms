import os
import json
import shutil
from database import get_db, init_db

def copy_data_files():
    """Copy data files from frontend data directory to backend data directory"""
    # Source directory (frontend data)
    source_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    
    # Destination directory (create if it doesn't exist)
    dest_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(dest_dir, exist_ok=True)
    
    # List of data files to copy
    data_files = [
        'users.json',
        'clinics.json',
        'doctors.json',
        'patients.json',
        'appointments.json',
        'prescriptions.json',
        'medicines.json',
        'rooms.json',
        'beds.json',
        'transactions.json',
        'invoices.json',
        'treatments.json'
    ]
    
    # Copy each file if it exists
    for file_name in data_files:
        source_file = os.path.join(source_dir, file_name)
        dest_file = os.path.join(dest_dir, file_name)
        
        if os.path.exists(source_file):
            print(f"Copying {file_name}...")
            shutil.copy2(source_file, dest_file)
            print(f"Successfully copied {file_name}")
        else:
            print(f"Source file {file_name} not found")

def transform_patient_data():
    """Transform patient data to match the database schema"""
    # Path to patient data file
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    patient_file = os.path.join(data_dir, 'patients.json')
    
    if not os.path.exists(patient_file):
        print("Patient data file not found")
        return
    
    try:
        # Read the patient data
        with open(patient_file, 'r') as f:
            patients = json.load(f)
        
        # Transform each patient
        transformed_patients = []
        for patient in patients:
            # Split name into first and last name if needed
            if 'name' in patient and ('firstName' not in patient or 'lastName' not in patient):
                name_parts = patient['name'].split(' ', 1)
                patient['firstName'] = name_parts[0]
                patient['lastName'] = name_parts[1] if len(name_parts) > 1 else ''
                del patient['name']
            
            transformed_patients.append(patient)
        
        # Write the transformed data back to the file
        with open(patient_file, 'w') as f:
            json.dump(transformed_patients, f, indent=2)
        
        print("Successfully transformed patient data")
    except Exception as e:
        print(f"Error transforming patient data: {e}")

def transform_prescription_data():
    """Transform prescription data to match the database schema"""
    # Path to prescription data file
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    prescription_file = os.path.join(data_dir, 'prescriptions.json')
    
    if not os.path.exists(prescription_file):
        print("Prescription data file not found")
        return
    
    try:
        # Read the prescription data
        with open(prescription_file, 'r') as f:
            prescriptions = json.load(f)
        
        # Transform each prescription
        for prescription in prescriptions:
            # Convert medications to array of objects if it's a string
            if 'medications' in prescription and isinstance(prescription['medications'], str):
                medications = prescription['medications'].split(', ')
                prescription['medications'] = [
                    {
                        'name': med.split(' ')[0],
                        'dosage': ' '.join(med.split(' ')[1:]),
                        'frequency': 'Once daily',
                        'duration': '7 days',
                        'quantity': 7
                    }
                    for med in medications
                ]
        
        # Write the transformed data back to the file
        with open(prescription_file, 'w') as f:
            json.dump(prescriptions, f, indent=2)
        
        print("Successfully transformed prescription data")
    except Exception as e:
        print(f"Error transforming prescription data: {e}")

def main():
    """Main function to prepare and seed data"""
    print("Starting data preparation...")
    
    # Copy data files from frontend to backend
    copy_data_files()
    
    # Transform data to match database schema
    transform_patient_data()
    transform_prescription_data()
    
    # Initialize the database
    init_db()
    
    print("Data preparation completed!")
    
    # Now run the seed script
    from seed import seed_data
    seed_data()

if __name__ == "__main__":
    main()