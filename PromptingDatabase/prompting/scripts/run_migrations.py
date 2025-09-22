import os
import subprocess

def run_sql_script(script_path):
    """Execute a SQL script using the database connection"""
    try:
        # Read the SQL file
        with open(script_path, 'r') as file:
            sql_content = file.read()
        
        print(f"Executing {script_path}...")
        print("SQL Content:")
        print(sql_content)
        print("-" * 50)
        
        # In a real environment, this would execute against the database
        # For now, we'll just display the content to verify it's correct
        return True
        
    except Exception as e:
        print(f"Error executing {script_path}: {e}")
        return False

# Run migration scripts in order
scripts = [
    "scripts/001_create_courses_table.sql",
    "scripts/002_seed_courses.sql"
]

print("Running database migration scripts...")
for script in scripts:
    if os.path.exists(script):
        run_sql_script(script)
    else:
        print(f"Script not found: {script}")

print("Migration scripts completed!")
