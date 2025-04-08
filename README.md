# 💃 Dance Class Booking System

This is a full-stack web application using a MVC that allows users to register, log in, and book dance classe. Admins can manage users, courses, classes, and bookings via an admin dashboard.

---

## 🚀 How to Run the Site

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
- User registration & login
- Session-based authentication
- Organiser/admin role distinction

### 📚 Courses & Classes
- View all available courses and class details
- Class details include date, time, location, price
- Classes grouped under relevant courses

### 📅 Booking System
- Logged-in users can book available classes
- Booking confirmation page
- Prevent duplicate bookings by the same user
- Users can view and cancel their bookings

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
- ✅ **User Booking History**: Users can view a list of all their booked classes.
- ✅ **Booking Cancellation**: Users can cancel their own class bookings directly.
- ✅ **Admin User Management**: Admins can promote/demote/delete users.
- ✅ **Access Control Middleware**: Prevent unauthorised access to routes using `checkAuthenticated` and `checkOrganiser`.
