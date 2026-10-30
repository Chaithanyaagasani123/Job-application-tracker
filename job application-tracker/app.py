# app.py
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Database Setup Configuration Connection Settings
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",         # Replace with your MySQL username
        password="*******", # Replace with your MySQL password
        database="kanban_db"
    )

@app.route('/')
def home():
    return render_template('index.html')

# 1. GET ALL JOBS
@app.get('/api/jobs')
def get_jobs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jobs")
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(jobs)

# 2. ADD A NEW JOB CARD

# 2. ADD A NEW JOB CARD
@app.post('/api/jobs')
def add_job():
    # Fallback to get json data even if headers are missing
    data = request.get_json(force=True) 
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO jobs (company_name, job_title) VALUES (%s, %s)",
        (data['company_name'], data['job_title'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Job added successfully"}), 201


# 3. UPDATE JOB COLUMN STATUS
@app.put('/api/jobs/<int:job_id>')
def update_job(job_id):
    data = request.get_json(force=True)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE jobs SET status = %s WHERE id = %s",
        (data['status'], job_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Status updated successfully"})

if __name__ == '__main__':
    app.run(debug=True)
