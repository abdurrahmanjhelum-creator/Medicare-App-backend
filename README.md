# Medicare Hospital Management Backend

Complete NestJS backend for Medicare Hospital Management System with MongoDB.

## Features

### Authentication Module
- **Patient Registration** - Naye patients ko register karne ke liye
- **Doctor Registration** - Naye doctors ko register karne ke liye
- **Login** - JWT token based authentication
- **Forgot Password** - OTP based password reset
- **Role-based Access** - Patient aur Doctor roles ke saath authorization

### Appointments Module
- **Book Appointment** - Patients appointments book kar sakte hain
- **View Appointments** - Patients apne appointments dekh sakte hain
- **Cancel Appointment** - Patients appointments cancel kar sakte hain
- **Doctor Appointments** - Doctors apne appointments manage kar sakte hain
- **Update Status** - Doctors appointment status update kar sakte hain (confirmed, completed, rejected)

### Chat Module
- **Send Message** - Doctor aur patient ke beech messaging
- **View Conversations** - Saari conversations dekh sakte hain
- **View Messages** - Specific conversation ke messages dekh sakte hain
- **Mark as Read** - Messages ko read mark kar sakte hain
- **Delete Message** - Apne messages delete kar sakte hain

### Patients Module
- **Get Profile** - Patient ka apna profile dekh sakte hain
- **Update Profile** - Patient apna profile update kar sakte hain
- **View Patient** - Doctors patient ki details dekh sakte hain

### Doctors Module
- **Get All Doctors** - Saari verified doctors ki list
- **Search Doctors** - Specialization, rating, fee ke base par search
- **Get Doctor Details** - Doctor ki complete details
- **Update Profile** - Doctor apna profile update kar sakte hain

### Medical Records Module
- **Create Record** - Doctors medical records create kar sakte hain
- **View Records** - Patients apne medical records dekh sakte hain
- **Update Record** - Doctors medical records update kar sakte hain

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt

## Installation

1. Dependencies install karein:
```bash
npm install
```

2. Environment variables set karein `.env` file mein:
```env
MONGODB_URI=mongodb://localhost:27017/medicare
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=development
```

3. MongoDB start karein:
```bash
# Windows mein
mongod

# Ya MongoDB Compass se connect karein
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

Server will run on: `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/register/doctor` - Doctor registration
- `POST /api/auth/forgot-password` - OTP send karein
- `POST /api/auth/verify-otp` - OTP verify karein
- `POST /api/auth/reset-password` - Password reset karein
- `GET /api/auth/me` - Current user info

### Appointments
- `POST /api/appointments` - Appointment book karein (patient only)
- `GET /api/appointments` - Patient ke appointments (patient only)
- `GET /api/appointments/:id` - Appointment details (patient only)
- `DELETE /api/appointments/cancel` - Appointment cancel (patient only)
- `GET /api/appments/doctor/my-appointments` - Doctor ke appointments (doctor only)
- `PUT /api/appointments/:id/status` - Status update (doctor only)

### Chat
- `POST /api/chat/send` - Message bhejein
- `GET /api/chat/messages` - Messages lein
- `GET /api/chat/conversations` - Conversations lein
- `PUT /api/chat/messages/:userId/read` - Mark as read
- `DELETE /api/chat/messages/:id` - Message delete

### Patients
- `GET /api/patients/profile` - Patient profile (patient only)
- `PUT /api/patients/profile` - Profile update (patient only)
- `GET /api/patients/:id` - Patient details (doctor only)

### Doctors
- `GET /api/doctors` - Saare doctors (public)
- `GET /api/doctors/:id` - Doctor details (public)
- `GET /api/doctors/profile/me` - Doctor profile (doctor only)
- `PUT /api/doctors/profile/me` - Profile update (doctor only)

### Medical Records
- `POST /api/medical-records` - Record create (doctor only)
- `GET /api/medical-records/patient/:patientId` - Patient records (doctor only)
- `GET /api/medical-records/my-records` - Apne records (patient only)
- `GET /api/medical-records/:id` - Record details
- `PUT /api/medical-records/:id` - Record update (doctor only)

## Response Format

Success Response:
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error Response:
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint",
  "method": "POST",
  "message": "Error message",
  "error": "Bad Request"
}
```

## Authentication

Protected endpoints ke liye JWT token required hai. Header mein token send karein:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### User Collection
- email, password, role (patient/doctor), name, phone, profileImage
- isActive, otp, otpExpires

### Patient Collection
- userId, cnic, dob, fatherName, age, bloodGroup
- medicalHistory, allergies, emergencyContact

### Doctor Collection
- userId, pmdcLicenceNumber, specialization, qualification
- experience, clinic, fee, bio, availableDays, availableSlots
- rating, totalReviews, isVerified

### Appointment Collection
- patientId, patientName, doctorId, doctorName, doctorImage
- specialization, time, date, type, location, status
- patientNotes, doctorNotes, cancellationReason

### Message Collection
- senderId, senderName, receiverId, receiverName
- content, isRead

### Medical Record Collection
- patientId, patientName, doctorId, doctorName
- diagnosis, prescription, notes, attachments, appointmentId

## Notes

- Sabhi endpoints mein detailed Urdu/Hindi comments hain
- JWT token 7 days valid rehta hai (configurable)
- Password reset OTP 15 minutes valid rehta hai
- Doctor verification admin se hoti hai (currently auto-verified)
- Video call system alag se add hoga (WebRTC ya Agora/Twilio se)

## Next Steps

1. MongoDB connection ensure karein
2. `.env` file configure karein
3. Server start karein
4. Postman ya Flutter app se test karein
