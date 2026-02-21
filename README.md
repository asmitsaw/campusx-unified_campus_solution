# VegaERP - Unified Campus Super App

A centralized, role-based web application that consolidates academic and campus services into a single intelligent dashboard for institutions like NITs, IITs, and large state universities.

## 🎯 Problem Statement

Across India, large educational institutions operate multiple independent digital systems:
- **LMS Portal** - Learning management
- **Attendance Portal** - Class attendance tracking
- **Hostel Management** - Accommodation & dining
- **Exam Result Portal** - Academic performance
- **Placement System** - Career opportunities
- **Event Registration Site** - Campus activities
- **Library Database** - Resource management

**Challenge:** Students and faculty must:
- Log into multiple platforms daily
- Track deadlines manually
- Switch between different interfaces repeatedly
- Miss important notifications

## ✨ Solution

**VegaERP** is a unified campus super app that consolidates all these services under one intelligent dashboard with:
- ✅ Role-based authentication
- ✅ Unified dashboard for students and faculty
- ✅ 8+ integrated modules
- ✅ Smart notification system
- ✅ Responsive, modern UI

---

## 🏗️ Project Structure

```
vegaerp/
├── backend/                    # Express.js REST API
│   ├── config/                 # Configuration files
│   │   ├── db.js              # Database config
│   │   └── supabase.js        # Supabase client
│   ├── controllers/            # Business logic
│   │   ├── authcontroller.js
│   │   ├── attendancecontroller.js
│   │   ├── batchcontroller.js
│   │   ├── classcontroller.js
│   │   ├── dashboardcontroller.js
│   │   ├── eventcontroller.js
│   │   ├── hostelcontroller.js
│   │   ├── lib_controller.js
│   │   ├── materialController.js
│   │   ├── notesController.js
│   │   ├── notificationcontroller.js
│   │   ├── placementcontroller.js
│   │   └── ev_controller.js
│   ├── models/                 # Data models
│   │   ├── attendance.js
│   │   ├── borrow.js
│   │   ├── course.js
│   │   ├── event.js
│   │   ├── lib_bookModel.js
│   │   ├── notification.js
│   │   ├── placement.js
│   │   └── user.js
│   ├── routes/                 # API endpoints
│   │   ├── authroutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── batchroutes.js
│   │   ├── classroutes.js
│   │   ├── dashboardroutes.js
│   │   ├── eventroutes.js
│   │   ├── hostelroutes.js
│   │   ├── lib_routes.js
│   │   ├── materialRoutes.js
│   │   ├── notesRoutes.js
│   │   ├── notificationroutes.js
│   │   ├── placementroutes.js
│   │   └── ev_routes.js
│   ├── middleware/             # Express middleware
│   │   └── authmiddleware.js
│   ├── uploads/                # Stored media files
│   │   ├── events/
│   │   └── notes/
│   ├── server.js               # Express app entry point
│   ├── package.json
│   └── *.sql                   # Database setup scripts
│
└── frontend/                   # React + Vite SPA
    ├── src/
    │   ├── components/         # React components
    │   │   ├── layout/        # Layout wrappers
    │   │   │   ├── Layout.jsx
    │   │   │   ├── FacultyLayout.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── FacultySidebar.jsx
    │   │   │   ├── Header.jsx
    │   │   │   └── NotificationBell.jsx
    │   │   ├── ui/            # Reusable UI components
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   └── Input.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AuthContext.jsx
    │   ├── pages/              # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Attendance.jsx
    │   │   ├── Events.jsx
    │   │   ├── Hostel.jsx
    │   │   ├── Placement.jsx
    │   │   ├── LMS.jsx
    │   │   ├── Analytics.jsx
    │   │   ├── Login.jsx
    │   │   ├── faculty/        # Faculty-specific pages
    │   │   │   ├── FacultyDashboard.jsx
    │   │   │   ├── ManageAttendance.jsx
    │   │   │   ├── ManageEvents.jsx
    │   │   │   ├── ManageStudents.jsx
    │   │   │   ├── ManageLibrary.jsx
    │   │   │   ├── ManageHostel.jsx
    │   │   │   ├── ManagePlacements.jsx
    │   │   │   └── AdminPanel.jsx
    │   │   └── ...
    │   ├── context/            # React context (state management)
    │   │   └── AuthContext.jsx
    │   ├── utils/              # Utilities
    │   │   ├── api.js         # API client
    │   │   ├── cn.js          # Classname helper
    │   │   └── ...
    │   ├── assets/             # Images, icons, etc.
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx            # React entry point
    │   ├── index.css
    │   └── App.css
    ├── public/                 # Static files
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── eslint.config.js
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.2
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT + bcryptjs
- **File Upload:** Multer
- **Email:** Nodemailer
- **Development:** Nodemon

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3
- **Routing:** React Router 7
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Linting:** ESLint

---

## 📱 Key Features

### 1. **Authentication & Authorization**
- Role-based access control (RBAC)
- JWT-based session management
- Secure password hashing with bcryptjs

### 2. **Student Dashboard**
- Personalized academic overview
- Upcoming deadlines and events
- Academic performance analytics

### 3. **Attendance Management**
- Real-time attendance tracking
- Faculty attendance upload
- Student attendance history
- Librarian attendance for library visits

### 4. **Library Management**
- Digital library catalog
- Book borrowing system
- Library attendance tracking
- Resource management

### 5. **Event Management**
- Event registration and discovery
- Event participant tracking
- Event notifications
- Attendance in external events

### 6. **Placement System**
- Company recruitment information
- Student placement applications
- Training session schedules
- Placement analytics

### 7. **Hostel Management**
- Room allocation and management
- Hostel complaint system
- Mess menu management
- Resident status tracking

### 8. **Class & Batch Management**
- Faculty-student mapping
- Class scheduling
- Batch-wise course allocation
- Class announcements

### 9. **Notifications**
- Real-time notification system
- Multi-channel alerts
- Notification preferences

### 10. **LMS - Learning Management**
- Course material uploads
- Lecture notes sharing
- Academic resources

---

## 👥 User Roles

| Role | Permissions | Primary Module |
|------|-------------|-----------------|
| **Student** | View own attendance, events, placements, library, courses, profile | Dashboard |
| **Faculty** | Manage classes, upload attendance, create courses, post materials | Faculty Dashboard |
| **Event Manager** | Create events, manage registrations, send notifications | Event Management |
| **Librarian** | Manage library catalog, borrowing, attendance, books | Library Management |
| **Hostel Warden** | Manage rooms, complaints, mess menu, resident status | Hostel Management |
| **TPO** | Manage placements, companies, training sessions, analytics | Placement Management |
| **Admin** | Full system access, user management, system settings | Admin Panel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL/Supabase account
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret
   NODEMAILER_EMAIL=your_email@gmail.com
   NODEMAILER_PASSWORD=your_app_password
   ```

4. **Initialize database:** 
   Run the SQL setup scripts in order on your Supabase console:
   ```bash
   # Order of execution:
   1. lib_setup.sql           # Library system tables
   2. setup_batch_class.sql   # Batch and class management
   3. setup_attendance.sql    # Attendance tracking
   4. setup_notifications.sql # Notification system
   5. setup_placements.sql    # Placement system
   6. setup_hostel.sql        # Hostel management
   ```

5. **Start backend server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file (if needed):**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       - User registration
POST   /api/auth/login          - User login
GET    /api/auth/me             - Get current user profile
POST   /api/auth/logout         - User logout
```

### Dashboard
```
GET    /api/dashboard           - Get dashboard data (student/faculty specific)
```

### Attendance
```
GET    /api/attendance          - Get attendance records
POST   /api/attendance          - Mark attendance
PUT    /api/attendance/:id      - Update attendance
```

### Events
```
GET    /api/ev-events           - Get all events
POST   /api/ev-events           - Create event
GET    /api/ev-events/:id       - Get event details
POST   /api/ev-events/:id/register - Register for event
GET    /api/ev-events/:id/participants - Get event participants
```

### Library
```
GET    /api/library/books       - Get all books
POST   /api/library/borrow      - Borrow a book
POST   /api/library/return      - Return a book
GET    /api/library/my-books    - Get borrowed books
```

### Placements
```
GET    /api/placements          - Get placement opportunities
POST   /api/placements/:id/apply - Apply for placement
GET    /api/placements/my-applications - Get applications
GET    /api/placements/training-sessions - Get training modules
```

### Hostel
```
GET    /api/hostel/rooms        - Get hostel information
POST   /api/hostel/complaint    - File complaint
GET    /api/hostel/complaints   - Get complaints
GET    /api/hostel/mess-menu    - Get mess menu
```

### Classes & Batches
```
GET    /api/batches             - Get batch information
GET    /api/classes             - Get classes
POST   /api/classes/:id/attendance - Upload class attendance
```

### Notifications
```
GET    /api/notifications       - Get notifications
POST   /api/notifications/read  - Mark as read
GET    /api/notifications/unread-count - Get unread count
```

### Materials & Notes
```
GET    /api/materials           - Get course materials
POST   /api/materials           - Upload materials
GET    /api/notes               - Get notes
POST   /api/notes               - Create notes
```

---

## 📊 Database Schema

### Core Tables

**users**
- id (UUID, PK)
- name (TEXT)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- role (ENUM: student, faculty, event_manager, librarian, hostel_warden, tpo, admin)
- created_at (TIMESTAMP)

**notifications**
- id (UUID, PK)
- user_id (UUID, FK → users)
- title (TEXT)
- message (TEXT)
- type (TEXT)
- read (BOOLEAN)
- created_at (TIMESTAMP)

**events**
- id (UUID, PK)
- title (TEXT)
- description (TEXT)
- date (TIMESTAMP)
- location (TEXT)
- banner (TEXT)
- created_by (UUID, FK → users)
- created_at (TIMESTAMP)

**attendance_records**
- id (UUID, PK)
- student_id (UUID, FK → users)
- faculty_id (UUID, FK → users)
- date (DATE)
- status (ENUM: present, absent)
- class_id (UUID, FK → classes)

**placements**
- id (UUID, PK)
- company_name (TEXT)
- position (TEXT)
- stipend (NUMERIC)
- deadline (DATE)
- description (TEXT)

**hostel_rooms**
- id (UUID, PK)
- room_number (TEXT, UNIQUE)
- capacity (INTEGER)
- occupancy (INTEGER)

**batch_students**
- id (UUID, PK)
- batch_id (UUID, FK → batches)
- student_id (UUID, FK → users)

And more...

---

## ⚙️ Configuration

### Environment Variables - Backend

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase anonymous key |
| `JWT_SECRET` | Secret key for JWT token signing |
| `NODEMAILER_EMAIL` | Gmail address for email notifications |
| `NODEMAILER_PASSWORD` | Gmail app-specific password |

### Environment Variables - Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default: http://localhost:5000) |

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 📝 Development

### Code Quality

```bash
# Lint frontend code
cd frontend
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Adding New Features

1. Create a new route in `/backend/routes/`
2. Add corresponding controller in `/backend/controllers/`
3. Create frontend page in `/frontend/src/pages/`
4. Add route to `/frontend/src/App.jsx`
5. Update navigation if needed

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /"
**Solution:** Ensure backend server is running on port 5000

### Issue: CORS errors
**Solution:** Check that backend CORS is properly configured and frontend API URL is correct

### Issue: Database connection failed
**Solution:** Verify Supabase credentials and ensure all SQL setup scripts have been executed

### Issue: JWT token expired
**Solution:** Token expires after 24 hours; user must log in again

---

## 📦 Deployment

### Backend Deployment (Render, Railway, Heroku)
```bash
cd backend
# Ensure all environment variables are set in hosting platform
npm start
```

### Frontend Deployment (Vercel, Netlify, GitHub Pages)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💻 Project Status

**Status:** Active Development  
**Last Updated:** February 2026  
**Version:** 1.0.0 (Initial Release)

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- **GitHub Issues:** [Open an issue](../../issues)
- **Email:** support@vegaerp.dev

---

## 🎓 Educational Context

This application was developed as part of the **NIT Consortium's Unified Campus Super App** initiative to modernize academic and administrative services across large educational institutions in India.

**Original Problem Statement:** Consolidate 7+ independent digital systems (LMS, Attendance, Hostel, Results, Placements, Events, Library) used by students and faculty into a single, intelligent, role-based dashboard.

---

**Last Updated:** February 21, 2026

Made with ❤️ for educational institutions
