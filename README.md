# 💃 Dance Class Booking System

This is a full-stack web application using a MVC that allows users to register, log in, and book dance classes. Admins can manage users, courses, classes, and bookings via an admin dashboard.

---

## 💻 Live version

Head over to the live version: https://zayd-hussain-wad2-cw-4c8b73e87e34.herokuapp.com/

## 🚀 How to Run the Site (Locally)

### 🔧 Requirements
- Node.js (v18+)
- npm

### 📦 Setup Instructions

1. **Unzip the project folder**  
   Extract the contents of the provided ZIP file.

2. **Navigate into the project**  
   ```bash
   cd web-app-dev-cw2
   ```

3. **Install dependencies**  
   ```bash
   npm install
   ```

    ```bash
   npm install bcrypt body-parser express-session express gray-nedb mustache-express nedb pdfkit sqlite3

   ```

4. **Start the server**  
   ```bash
   node index.js
   ```

5. **Visit the site**  
   Open your browser and go to:  
   `http://localhost:3000`

---

## ✨ Features Implemented

### 🔐 Authentication
- User registration and login
- Session-based authentication
- Organiser/admin role distinction

### 📚 Courses & Classes
- View all available courses and class details
- Class details include date, time, location, price
- Classes grouped under relevant courses

### 📅 Booking System
- Guests & logged in users can book available classes
- Booking confirmation page for both gusts and returning users
- Prevented duplicate bookings by the same user
- Logged in users can view and cancel their bookings

### 🧑‍💼 Admin Panel
- Add/edit/delete courses and classes
- View class-specific booking lists
- Export class bookings as a downloadable PDF
- Manage users:
  - View all users
  - Promote users to organisers
  - Demote organisers
  - Delete users

---

## 🛠️ Additional Features (Not in Original Spec)

- ✅ **PDF Export**: Admins can download a PDF list of all users booked into a class.
- ✅ **User Account Creation / Booking History**: Users can create an account, view and manage a list of all their booked classes.
- ✅ **Booking Cancellation**: Users can cancel their own class bookings directly.
