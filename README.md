# 🎓 Smart Charity Donation Platform – Backend API

> Graduation Project – Faculty of Computer Science  
> Secure, Scalable & Production-Ready Backend System  

---

## 📌 Project Overview

Smart Charity Donation Platform is a secure and scalable backend system designed to manage a modern digital charity ecosystem.

The system provides authentication, donation management, AI-powered analysis, secure file uploads, and real-time notifications — built following RESTful architecture and best backend practices.

---

## 🚀 Core Features

- 🔐 JWT Authentication & Role-Based Authorization
- 🛡 Secure Password Hashing (bcrypt)
- 📊 Admin Dashboard & Advanced Statistics
- 💰 Donation Management System
- 🏥 Charity Management
- 🤖 AI Integration (Groq SDK)
- ☁ Cloud Image Upload (Cloudinary)
- 📩 Email Service (Nodemailer)
- ⚡ Rate Limiting & Security Headers
- 📑 Pagination & Filtering
- 🧾 Request Validation using Joi
- 🛡 Global Error Handling Middleware

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Joi | Request Validation |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Helmet | Security Headers |
| express-rate-limit | API Protection |
| Cloudinary | Media Storage |
| Multer | File Upload |
| Nodemailer | Email Service |
| Groq SDK | AI Integration |

---

## 🔐 Security Architecture

- Environment-based configuration (.env)
- JWT access tokens
- Encrypted passwords
- API rate limiting
- HTTP security headers
- Input validation layer (Joi)
- Centralized error handling
- 

---

## 🌍 API Base URL

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev
PORT=
DB_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
GROQ_API_KEY=
src/
 ├── modules/
 ├── middleware/
 ├── database/
 ├── utils/
 └── index.js
