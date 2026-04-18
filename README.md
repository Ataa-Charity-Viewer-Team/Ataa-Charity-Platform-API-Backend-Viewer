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

| Technology         | Purpose             |
| ------------------ | ------------------- |
| Node.js            | Runtime Environment |
| Express.js         | Web Framework       |
| MongoDB            | Database            |
| Mongoose           | ODM                 |
| Joi                | Request Validation  |
| JWT                | Authentication      |
| bcrypt             | Password Hashing    |
| Helmet             | Security Headers    |
| express-rate-limit | API Protection      |
| Cloudinary         | Media Storage       |
| Multer             | File Upload         |
| Nodemailer         | Email Service       |
| Groq SDK           | AI Integration      |

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





## 🛠 Full Tech Stack & Tools

| Category              | Technology           | Purpose                                      |
| --------------------- | -------------------- | -------------------------------------------- |
| Runtime               | Node.js              | JavaScript Runtime Environment               |
| Framework             | Express.js           | Backend Web Framework                        |
| Database              | MongoDB              | NoSQL Database                               |
| ODM                   | Mongoose             | MongoDB Object Data Modeling                 |
| Validation            | Joi                  | Request Data Validation                      |
| Authentication        | JSON Web Token (JWT) | Secure Authentication System                 |
| Security              | bcrypt               | Password Hashing                             |
| Security              | Helmet               | Secure HTTP Headers                          |
| Security              | express-rate-limit   | API Rate Limiting                            |
| Security              | cors                 | Cross-Origin Resource Sharing                |
| Environment Config    | dotenv               | Manage Environment Variables                 |
| Encryption            | crypto-js            | Data Encryption                              |
| File Upload           | Multer               | Handle File Uploads                          |
| Cloud Storage         | Cloudinary           | Image & Media Hosting                        |
| Email Service         | Nodemailer           | Send Emails                                  |
| AI Integration        | Groq SDK             | AI Features Integration                      |
| Background Jobs       | node-cron            | Scheduled Tasks (Cron Jobs)                  |
| Unique IDs            | nanoid               | Generate Unique Identifiers                  |
| Deployment            | Vercel               | Hosting & Deployment Platform                |
| Serverless Support    | @vercel/functions    | Serverless Functions Handling                |
| Architecture Pattern  | MVC + Modular Design | Scalable Project Structure                   |
| Error Handling        | Custom Middleware    | Centralized Error Handling                   |
| API Features          | Pagination System    | Data Pagination & Filtering                  |
| API Features          | RESTful API          | Standard API Design                          |
