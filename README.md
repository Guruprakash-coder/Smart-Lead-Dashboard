# Smart Leads Dashboard

A full-stack Lead Management Dashboard built using the MERN stack with TypeScript.
This project was developed as part of a Full Stack Internship Assignment to demonstrate scalable architecture, clean coding practices, authentication, filtering, pagination, RBAC, and responsive UI development.

---

## 🚀 Tech Stack

### Frontend

* React.js
* TypeScript
* TailwindCSS
* Axios
* React Router DOM
* Context API / Redux *(replace with what you used)*
* React Hook Form *(if used)*

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

### Additional Tools

* Docker
* CSV Export
* Debounced Search

---

# ✨ Features

## 🔐 Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes
* Password Hashing using bcrypt
* Role-Based Access Control

  * Admin
  * Sales User

---

## 📋 Leads Management

* Create Lead
* Update Lead
* Delete Lead
* View Leads List
* View Single Lead Details

### Lead Fields

* Name
* Email
* Status

  * New
  * Contacted
  * Qualified
  * Lost
* Source

  * Website
  * Instagram
  * Referral
* Created At

---

## 🔎 Advanced Filtering & Search

* Filter by Status
* Filter by Source
* Search by Name or Email
* Sort by:

  * Latest
  * Oldest
* Multiple filters working together

---

## 📄 Pagination

* Backend Pagination
* 10 records per page
* Pagination Metadata included in API response

---

## 🎨 UI Features

* Responsive Dashboard
* Reusable Components
* Loading States
* Empty States
* Error Handling UI
* Form Validation
* Clean Folder Structure
* Dark Mode *(if implemented)*

---

# 📁 Project Structure

```bash
smart-leads-dashboard/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── config/
│   │   ├── types/
│   │   └── app.ts
│   │
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# ⚙️ Environment Variables

Create a `.env` file in the server directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

---

# 🐳 Docker Setup

## Run using Docker

```bash
docker-compose up --build
```

---

# 💻 Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/smart-leads-dashboard.git
```

## 2️⃣ Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

## 3️⃣ Start Development Servers

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

# 📌 API Endpoints

## Auth Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |

---

## Leads Routes

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | /api/leads     | Get All Leads   |
| GET    | /api/leads/:id | Get Single Lead |
| POST   | /api/leads     | Create Lead     |
| PUT    | /api/leads/:id | Update Lead     |
| DELETE | /api/leads/:id | Delete Lead     |

---

# 📤 CSV Export

* Export filtered leads data into CSV format
* Supports current filter and search states

---

# 🔒 Role-Based Access Control

## Admin

* Full access to all leads
* Create, Update, Delete operations

## Sales User

* Limited permissions based on role configuration

---

# 🧠 Key Highlights

* Fully TypeScript-based architecture
* RESTful API design
* Clean and scalable folder structure
* Centralized error handling
* Request validation
* Reusable UI components
* Debounced search implementation
* Backend pagination using skip & limit
* Secure JWT authentication flow

---

# 🌐 Deployment

## Frontend

Deployed on: *(Add your frontend deployment link here)*

## Backend

Deployed on: *(Add your backend deployment link here)*

---

# 📄 API Documentation

API Documentation: *(Add Postman collection or Swagger link here)*

---

# 👨‍💻 Author

Developed by **Guruprakash S**


