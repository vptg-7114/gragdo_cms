import os
import json
import sqlite3
from database import get_db, dict_factory

def seed_data():
    """Seed the database with data from JSON files"""
    print("Starting data seeding process...")
    
    # Get database connection
    conn = get_db()
    cursor = conn.cursor()
    
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
    
    # Get the data directory path
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    for table in tables:
        json_file = os.path.join(data_dir, f'{table}.json')
        
        if os.path.exists(json_file):
            print(f"Importing data for {table}...")
            
            try:
                # Get table schema to check column names
                cursor.execute(f"PRAGMA table_info({table})")
                table_columns = [col['name'] for col in cursor.fetchall()]
                
                # Read JSON data
                with open(json_file, 'r') as f:
                    records = json.load(f)
                
                # Check existing records to avoid duplicates
                cursor.execute(f"SELECT id FROM {table}")
                existing_ids = [row['id'] for row in cursor.fetchall()]
                
                # For email uniqueness in users table
                existing_emails = []
                if table == 'users':
                    cursor.execute("SELECT email FROM users")
                    existing_emails = [row['email'] for row in cursor.fetchall()]
                
                from werkzeug.security import generate_password_hash
                
                for record in records:
                    # Skip if record already exists
                    if record.get('id') in existing_ids:
                        continue
                    
                    # Skip if email already exists (for users table)
                    if table == 'users' and record.get('email') in existing_emails:
                        continue
                        
                    # Filter out keys that don't exist in the table schema
                    filtered_record = {k: v for k, v in record.items() if k in table_columns}
                    
                    # Handle special cases for each table
                    if table == 'users':
                        # Hash the password
                        if 'password' in filtered_record:
                            filtered_record['password'] = generate_password_hash(filtered_record['password'])
                    
                    elif table == 'patients':
                        # Handle name field if it exists but firstName/lastName are required
                        if 'name' in record and 'firstName' not in filtered_record and 'lastName' not in filtered_record:
                            name_parts = record['name'].split(' ', 1)
                            filtered_record['firstName'] = name_parts[0]
                            filtered_record['lastName'] = name_parts[1] if len(name_parts) > 1 else ''
                    
                    elif table == 'appointments':
                        # Ensure required fields are present
                        if 'appointmentDate' in filtered_record and 'startTime' not in filtered_record:
                            filtered_record['startTime'] = '09:00'
                            filtered_record['endTime'] = '09:30'
                    
                    # Convert any nested objects to JSON strings
                    for key, value in filtered_record.items():
                        if isinstance(value, (dict, list)):
                            filtered_record[key] = json.dumps(value)
                    
                    # Skip if record is empty after filtering
                    if not filtered_record:
                        continue
                    
                    # Get column names and values
                    columns = ', '.join(filtered_record.keys())
                    placeholders = ', '.join(['?'] * len(filtered_record))
                    
                    # Insert record
                    try:
                        query = f'INSERT INTO {table} ({columns}) VALUES ({placeholders})'
                        cursor.execute(query, list(filtered_record.values()))
                    except sqlite3.Error as e:
                        print(f"Error inserting record into {table}: {e}")
                        # Continue with next record
                
                conn.commit()
                print(f"Successfully imported data for {table}")
                
            except Exception as e:
                print(f"Error importing data for {table}: {e}")
        else:
            print(f"No data file found for {table}")
    
    conn.close()
    print("Data seeding completed")

if __name__ == "__main__":
    seed_data()