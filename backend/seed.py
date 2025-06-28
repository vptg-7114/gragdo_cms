import os
import json
import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash
from database import get_db, init_db

def seed_data():
    """Seed the database with data from JSON files"""
    print("Starting data seeding process...")
    
    # Initialize the database
    init_db()
    
    # Connect to the database
    db = get_db()
    cursor = db.cursor()
    
    # Check if we already have data
    cursor.execute('SELECT COUNT(*) as count FROM users')
    result = cursor.fetchone()
    
    if result['count'] > 1:  # More than just the default super admin
        print("Database already contains data. Skipping seed.")
        db.close()
        return
    
    # Path to data directory
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    
    if not os.path.exists(data_dir):
        print(f"Data directory not found: {data_dir}")
        db.close()
        return
    
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
            print(f"Importing data for {table}...")
            with open(json_file, 'r') as f:
                try:
                    records = json.load(f)
                    
                    # Special handling for users table to hash passwords
                    if table == 'users':
                        for record in records:
                            if 'password' in record:
                                record['password'] = generate_password_hash(record['password'])
                    
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
                    
                    print(f"Successfully imported {len(records)} records for {table}")
                except Exception as e:
                    print(f"Error importing data for {table}: {e}")
        else:
            print(f"No data file found for {table}")
    
    db.commit()
    db.close()
    print("Data seeding completed!")

if __name__ == "__main__":
    seed_data()