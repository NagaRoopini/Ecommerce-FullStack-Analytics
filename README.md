# E-Commerce Sales & Customer Analytics Platform

A full-stack web application for analyzing e-commerce sales, customer behavior, product performance, regional sales, and payment trends.

The application combines a React.js frontend, FastAPI backend, and Aiven Cloud MySQL database to provide interactive analytics through a single deployed web application.

---

## 🚀 Live Demo

**Live Application:**  
https://ecommerce-fullstack-analytics.onrender.com


---

## 📌 Project Overview

The E-Commerce Sales & Customer Analytics Platform is designed to transform raw e-commerce sales data into meaningful business insights.

The application allows users to:

- Register and log in securely
- View overall sales performance
- Analyze monthly sales
- Analyze category-wise sales
- Analyze category-wise profit
- Analyze regional sales
- Identify top-performing products
- Analyze customer spending and orders
- Analyze payment methods
- View order details
- Upload sales data through CSV
- Access analytics through REST APIs

The project uses a cloud-hosted MySQL database through Aiven and is deployed on Render.

---

## 🏗️ System Architecture

```text
                    React.js Frontend
                           │
                           │ Axios / REST API
                           ▼
                    FastAPI Backend
                           │
             ┌─────────────┴─────────────┐
             │                           │
       Authentication              Analytics APIs
             │                           │
             └─────────────┬─────────────┘
                           ▼
                  Aiven Cloud MySQL
                           │
                    ┌──────┴──────┐
                    │             │
                  users          sales
🛠️ Technologies Used
Frontend
React.js
JavaScript
Tailwind CSS
Recharts
Axios
Vite
Backend
Python
FastAPI
REST APIs
Pandas
NumPy
Python-JOSE
Passlib
bcrypt
Database
MySQL
Aiven Cloud MySQL
MySQL Connector/Python
Authentication
JWT
bcrypt password hashing
Deployment & Tools
Render
Git
GitHub
VS Code
✨ Features
🔐 Authentication
User registration
User login
Password hashing using bcrypt
JWT-based authentication
Protected API endpoints
Automatic token handling
📊 Dashboard

The dashboard provides an overview of the e-commerce business.

It includes:

Total sales
Total profit
Total orders
Total customers
Sales trends
Category performance
Regional performance
📈 Sales Analytics

The Sales Analytics section provides insights into:

Monthly sales
Sales trends
Category-wise sales
Profit analysis
Overall business performance

Interactive charts are created using Recharts.

📦 Product Analytics

Product analytics provides:

Top-selling products
Product-wise sales
Product performance
Product contribution to overall sales
👥 Customer Analytics

Customer analytics provides:

Top customers
Customer spending
Number of orders
Customer-wise sales
Customer-wise profit
🌎 Regional Analytics

Regional analytics provides:

Region-wise sales
Regional performance
City-level sales information
💳 Payment Analytics

The application analyzes sales based on payment methods.

Examples include:

UPI
Credit Card
Debit Card
Cash
Net Banking
🧾 Orders

The Orders section provides:

Order ID
Order date
Customer
Product
Category
Quantity
Sales
Profit
Region
Payment method
📤 CSV Upload

Users can upload e-commerce sales data through CSV files.

The backend processes the uploaded data and stores it in the MySQL database.

🗄️ Database

The application uses Aiven Cloud MySQL as the production database.

Sales Table
Order_ID
Order_Date
Customer_ID
Category
Product
Quantity
Sales
Discount
Profit
Region
City
Payment_Mode
Users Table
id
name
email
password
created_at

The project contains 10,000 sales records for analytics.

🔌 REST API Endpoints
Authentication
POST /api/auth/login
POST /api/auth/register
Dashboard
GET /api/dashboard/summary
Analytics
GET /api/analytics/monthly-sales
GET /api/analytics/category-sales
GET /api/analytics/category-profit
GET /api/analytics/region-sales
GET /api/analytics/top-products
GET /api/analytics/top-customers
GET /api/analytics/payment-methods
GET /api/analytics/summary
Orders
GET /api/orders
Data Upload
POST /api/upload
Health & Database
GET /api/health
GET /api/test-db

⚙️ Local Setup
1. Clone the repository
git clone https://github.com/NagaRoopini/Ecommerce-FullStack-Analytics.git
cd Ecommerce-FullStack-Analytics
2. Create Python virtual environment
python -m venv .venv

Activate it on Windows:

.venv\Scripts\activate
3. Install backend dependencies
pip install -r backend/requirements.txt
4. Configure environment variables

Create:

backend/.env

Add your own Aiven MySQL credentials:

AIVEN_MYSQL_HOST=your_aiven_host
AIVEN_MYSQL_PORT=your_aiven_port
AIVEN_MYSQL_USER=your_aiven_user
AIVEN_MYSQL_PASSWORD=your_aiven_password
AIVEN_MYSQL_DATABASE=defaultdb
AIVEN_MYSQL_SSL_CA=../dataset/aiven-ca.pem

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256

Never commit .env or passwords to GitHub.

5. Setup database
cd backend
python setup_database.py
6. Upload dataset
python upload_data.py
7. Start FastAPI backend

From the backend directory:

uvicorn app.main:app --reload

Backend will run at:

http://127.0.0.1:8000
8. Start frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend will run at:

http://localhost:5173
🚀 Deployment

The application is deployed using Render.

The production deployment contains both:

React frontend
FastAPI backend

The React application is built during deployment and served by FastAPI.

Build Command
pip install -r backend/requirements.txt && cd frontend && npm install && npm run build
Start Command
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
🔒 Security

The project follows basic security practices:

Passwords are hashed using bcrypt.
Authentication uses JWT tokens.
Database credentials are stored using environment variables.
.env files are excluded from Git.
Aiven MySQL connection uses SSL.
API authentication is handled using protected routes.
📊 Dataset

The project uses an e-commerce sales dataset containing 10,000 records.

The dataset contains information about:

Orders
Customers
Products
Categories
Quantity
Sales
Discounts
Profit
Regions
Cities
Payment methods
🎯 Project Objectives

The main objectives of this project are:

Build a complete full-stack web application.
Store and manage e-commerce data using MySQL.
Develop REST APIs using FastAPI.
Create interactive analytics dashboards.
Implement secure user authentication.
Analyze customer and product performance.
Deploy the application to the cloud.
Provide business insights through visualizations.


👩‍💻 Developer

Battu Naga Roopini

B.Tech – Information Technology

GitHub:
https://github.com/NagaRoopini