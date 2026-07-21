# Asset & Inventory Management System

A full-stack, role-based Asset & Inventory Management System for tracking organizational assets from procurement through retirement — built with **Laravel** (REST API) and **React**.

Designed and built as a complete production-style application: authentication, role-based access control, asset lifecycle tracking, assignment workflows, employee requests, damage reporting, depreciation calculation, and immutable audit logging.

---

## ✨ Features

### Authentication & Access Control
- Token-based authentication via Laravel Sanctum
- Role-based access control (Super Admin, Inventory Manager, Employee)
- Granular, permission-based authorization (separate from role checks)
- Route-level and API-level protection

### Asset Management
- Full CRUD for asset categories and individual assets
- Serial number / barcode-ready fields for physical tracking
- Search, filter (by category/status), and pagination
- Status lifecycle: `available → assigned → damaged → scrapped`

### Assignment Workflow
- Assign available assets to employees
- Return/reassignment support with full history
- Automatic asset status sync on assign/return

### Employee Requests
- Employees submit asset requests with justification
- Admin approval workflow: `pending → approved → dispatched` or `rejected`
- Full request history visible to both employee and admin

### Damage Reporting
- Employees report damaged assets with photo upload
- Admin triage workflow: `pending review → in repair → repaired / replaced / scrapped`
- Asset status automatically syncs with repair outcome

### Financial Tracking
- Straight-line depreciation calculation per asset
- Historical valuation records (not just current value)
- Financial summary reporting

### Reporting & Auditing
- PDF and CSV export for inventory reports
- Append-only, immutable audit log — every significant action (logins, asset changes, approvals, role changes) is recorded and cannot be edited or deleted
- Low-stock detection with automated email alerts

### User Management
- Admin-managed user accounts with role assignment
- Deactivate/reactivate accounts (soft-disable, not hard delete)
- Active sessions are immediately revoked on deactivation

---

## 🛠 Tech Stack

**Backend**
- Laravel 13 (REST API)
- MySQL
- Laravel Sanctum — token authentication
- DomPDF — PDF generation
- Laravel Excel — CSV/XLSX export
- Laravel Notifications — email alerts (WhatsApp-ready channel architecture)

**Frontend**
- React (Vite)
- React Router
- Axios
- Tailwind CSS v4

---

## 🏗 Architecture

Inventory-Management/
├── backend/ # Laravel REST API
│ ├── app/
│ │ ├── Http/
│ │ │ ├── Controllers/Api/ # API controllers (Admin/, Auth/)
│ │ │ ├── Middleware/ # CheckRole, CheckPermission
│ │ │ ├── Requests/ # Form Request validation classes
│ │ │ └── Resources/ # API response transformers
│ │ ├── Models/ # Eloquent models
│ │ ├── Services/ # Business logic (Depreciation, Audit)
│ │ ├── Notifications/ # Email notification classes
│ │ └── Exports/ # Laravel Excel export classes
│ └── database/
│ ├── migrations/
│ └── seeders/
└── frontend/ # React SPA
└── src/
├── api/ # Axios client + per-resource endpoint modules
├── components/ # Shared layout components (Sidebar, etc.)
├── context/ # AuthContext (global auth state)
├── pages/ # Route-level page components
└── routes/ # Route protection (ProtectedRoute)


The backend follows a layered architecture — **Controller → Service → Model** — with validation isolated into Form Request classes and JSON output shaped through API Resources, keeping controllers thin and business logic testable and reusable.

---

## 🔐 Roles & Permissions

| Role | Access |
|---|---|
| **Super Admin** | Full system access, including user management and audit logs |
| **Inventory Manager** | Asset/category management, assignments, request approvals, reports |
| **Employee** | Submit requests, report damage, view own assignments |

Permissions are checked independently of role, allowing fine-grained control (e.g. `approve-requests`, `export-reports`, `view-financial-reports`) without hardcoding role names throughout the codebase.

---

## 🗄 Database Schema (Core Entities)

`users` · `roles` · `permissions` · `role_permissions` · `categories` · `assets` · `asset_assignments` · `asset_requests` · `damage_reports` · `repairs` · `depreciation_records` · `audit_logs`

Audit logs are append-only by design — no `updated_at` column exists on the table, and the model throws on any update/delete attempt at the code level.

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm
- MySQL

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your database in `.env`:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_management
DB_USERNAME=root
DB_PASSWORD=


Run migrations and seed initial roles/permissions:
```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and expects the backend API at `http://127.0.0.1:8000`.

### Default Seeded Account

Email: test@example.com
Password: password
Role: Super Admin


---

## 📡 API Overview

All endpoints are prefixed with `/api`. Authentication uses Bearer tokens via Sanctum.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Authenticate and receive a token |
| `GET` | `/me` | Current authenticated user |
| `GET/POST` | `/admin/categories` | Category management |
| `GET/POST` | `/admin/assets` | Asset management |
| `GET/POST` | `/admin/assignments` | Asset assignment |
| `POST` | `/admin/assignments/{id}/return` | Return an assigned asset |
| `GET/POST` | `/requests` | Asset requisitions (own or all, role-dependent) |
| `POST` | `/requests/{id}/approve` \| `/reject` \| `/dispatch` | Requisition review |
| `GET/POST` | `/damage-reports` | Damage reports (with image upload) |
| `PATCH` | `/damage-reports/{id}/status` | Update repair status |
| `GET` | `/admin/reports/assets/pdf` \| `/csv` | Export inventory report |
| `GET` | `/admin/audit-logs` | View audit trail (Super Admin only) |

---

## 🧪 Testing

Manual end-to-end testing covered:
- Authentication (valid/invalid credentials, deactivated accounts, session persistence)
- Role-based access control (route-level and API-level enforcement)
- Full CRUD + validation on Categories and Assets, including delete-protection guards
- Assignment lifecycle and automatic status synchronization
- Request approval workflow (submit → approve/reject → dispatch)
- Damage report workflow with image upload and asset status sync
- Report generation (PDF/CSV) and audit log capture

---

## 📄 License

This project was built as a portfolio/academic project and is available for reference and learning purposes.

Aur GitHub repo ke "About" section (settings gear icon ke pass) mein ye chhota description daal dena:

A full-stack Asset & Inventory Management System built with Laravel (REST API) and React. Features role-based access control, asset lifecycle tracking, assignment workflows, damage reporting, depreciation calculation, and audit logging.

Other Topics :

laravel react tailwindcss sanctum mysql rbac inventory-management rest-api full-stack
