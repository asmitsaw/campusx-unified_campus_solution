---
description: File naming convention for faculty/role-based pages to avoid team clashes
---

# File Naming Convention for Role-Based Pages

Each team member works on a specific role's pages. Use the following **prefix convention** to prevent file name clashes in `frontend/src/pages/faculty/`:

## Prefixes by Role

| Role | Prefix | Owner | Example Files |
|------|--------|-------|---------------|
| Hostel Warden | `warden_` or `Warden` | Warden team | `WardenDashboard.jsx`, `ManageHostel.jsx` |
| Librarian | `lib_` | Library team | `lib_ManageLibrary.jsx`, `lib_Profile.jsx` |
| TPO (Placement) | `tpo_` | Placement team | `ManagePlacements.jsx` |
| Event Manager | `event_` | Events team | `ManageEvents.jsx` |
| Faculty | (no prefix) | Faculty team | `ManageAttendance.jsx`, `ManageStudents.jsx` |
| Admin | `admin_` or `Admin` | Admin team | `AdminPanel.jsx` |

## Rules

1. **New pages** must use the role prefix if they are role-specific
2. **Shared pages** (used by multiple roles) keep generic names like `FacultyDashboard.jsx` 
3. **Dashboard files** for each role should be named `<Role>Dashboard.jsx`:
   - `WardenDashboard.jsx`
   - `lib_Dashboard.jsx` (librarian already uses `lib_` prefix)
   - `FacultyDashboard.jsx` (shared dispatcher, delegates to role-specific dashboards)
4. **Never overwrite** a teammate's file — check existing files first
5. **Importing**: The shared `FacultyDashboard.jsx` acts as a router and delegates to role-specific dashboards:
   ```jsx
   if (role === "hostel_warden") return <WardenDashboard />;
   if (role === "librarian") return <LibrarianDashboard />;
   // etc.
   ```

## Backend Convention

Backend files use lowercase with role hint:
- Controllers: `hostelcontroller.js`, `lib_controller.js`
- Routes: `hostelroutes.js`, `lib_routes.js`
- SQL schemas: `setup_hostel.sql`, `setup_library.sql`
