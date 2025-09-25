# SETUP CONNECT - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Authentication System](#authentication-system)
5. [Database Schema](#database-schema)
6. [File Structure](#file-structure)
7. [User Interface Components](#user-interface-components)
8. [Backend Components](#backend-components)
9. [Frontend Architecture](#frontend-architecture)
10. [Development Setup Instructions](#development-setup-instructions)
11. [Testing Guidelines](#testing-guidelines)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

**SETUP CONNECT** is a modern web application built for the Department of Science and Technology (DOST) using a full-stack architecture with Laravel backend and React frontend.

### Key Features
- User management system with role-based access control
- Photo upload and management
- Responsive mobile-first design
- Modern SPA experience with Inertia.js
- Secure authentication and authorization

### Technology Stack
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS v3
- **SPA Framework**: Inertia.js
- **Database**: MySQL
- **Build Tool**: Vite
- **Authentication**: Laravel Breeze-style authentication
- **File Storage**: Laravel Storage with public disk

---

## Architecture Overview

```
SETUP_CONNECT/
├── 📁 Backend (Laravel 12)
│   ├── Routes, Controllers, Models
│   ├── Database Migrations & Seeders
│   ├── Authentication & Authorization
│   └── File Upload Management
│
├── 📁 Frontend (React + TypeScript)
│   ├── Inertia.js Pages
│   ├── Reusable Components
│   ├── TypeScript Interfaces
│   └── TailwindCSS Styling
│
└── 📁 Assets & Configuration
    ├── Vite Build Configuration
    ├── Database Configuration
    └── Environment Settings
```

---

## Authentication System

### User Types
1. **Administrator** - Full system access
2. **PSTO Staff** - User management capabilities  
3. **Cooperator** - Basic access (view only)

### Security Features
- Session-based authentication
- Route protection middleware
- Role-based access control (RBAC)
- CSRF protection
- Input validation and sanitization

### Default Credentials
```
Email: admin@setupconnect.com
Password: admin123
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'psto_staff', 'cooperator') DEFAULT 'cooperator',
    is_active BOOLEAN DEFAULT TRUE,
    photo VARCHAR(255) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Supporting Tables
- `password_reset_tokens` - Password reset functionality
- `sessions` - Session management
- `cache` - Application caching
- `jobs` - Queue management

---

## File Structure

### Backend (Laravel)
```
app/
├── Enums/
│   └── UserType.php                 # User type enumeration
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   └── LoginController.php  # Authentication logic
│   │   ├── DashboardController.php  # Dashboard functionality
│   │   └── UserController.php       # User CRUD operations
│   └── Middleware/
│       └── HandleInertiaRequests.php # Inertia.js middleware
├── Models/
│   └── User.php                     # User model with relationships
└── Providers/
    └── AuthServiceProvider.php      # Authorization gates
```

### Frontend (React + TypeScript)
```
resources/js/
├── Layouts/
│   └── AuthenticatedLayout.tsx      # Main app layout
├── Pages/
│   ├── Auth/
│   │   └── Login.tsx               # Login page
│   ├── Users/
│   │   ├── Index.tsx               # User list
│   │   ├── Create.tsx              # Create user form
│   │   ├── Edit.tsx                # Edit user form
│   │   └── Show.tsx                # User profile view
│   └── Dashboard.tsx               # Main dashboard
├── types/
│   └── index.ts                    # TypeScript interfaces
└── app.tsx                         # App entry point
```

---

## User Interface Components

### 1. Login Page (Auth/Login.tsx)
**Key Features:**
- DOST logo integration
- Responsive form design
- Error handling
- Remember me functionality
- Form validation

### 2. Dashboard (Dashboard.tsx)
**Key Features:**
- User profile display with photo
- Statistics cards
- Quick action buttons
- Role-based menu visibility

### 3. User Management (Users/)

**Index.tsx - User List:**
- Paginated data table
- Photo thumbnails
- Status indicators
- Action buttons (View/Edit/Delete)

**Create.tsx - Add New User:**
- Photo upload with preview
- Form validation
- User type selection
- Password confirmation

**Edit.tsx - Update User:**
- Photo management
- Optional password change
- Status toggle
- Data preservation

**Show.tsx - User Profile:**
- Detailed user information
- Large photo display
- Status badges
- Action buttons

---

## Backend Components

### 1. UserController.php
```php
class UserController extends Controller
{
    // Index: List users with pagination
    public function index() {
        $users = User::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Users/Index', ['users' => $users]);
    }
    
    // Store: Create new user with photo upload
    public function store(Request $request) {
        // Validation, photo handling, user creation
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'user_type' => ['required', Rule::in(array_column(UserType::cases(), 'value'))],
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('user-photos', 'public');
            $userData['photo'] = $photoPath;
        }
        
        User::create($userData);
        return redirect()->route('users.index');
    }
    
    // Update: Modify user with optional photo update
    public function update(Request $request, User $user) {
        // Update logic with file management
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                Storage::disk('public')->delete($user->photo);
            }
            $photoPath = $request->file('photo')->store('user-photos', 'public');
            $userData['photo'] = $photoPath;
        }
        
        $user->update($userData);
        return redirect()->route('users.index');
    }
    
    // Destroy: Delete user and cleanup files
    public function destroy(User $user) {
        if ($user->photo && Storage::disk('public')->exists($user->photo)) {
            Storage::disk('public')->delete($user->photo);
        }
        $user->delete();
        return redirect()->route('users.index');
    }
}
```

### 2. User Model
```php
class User extends Authenticatable
{
    protected $fillable = [
        'name', 'email', 'password', 'user_type', 'is_active', 'photo'
    ];
    
    protected function casts(): array {
        return [
            'user_type' => UserType::class,
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }
    
    // Helper methods
    public function isAdmin(): bool {
        return $this->user_type === UserType::ADMIN;
    }
    
    public function isPSTOStaff(): bool {
        return $this->user_type === UserType::PSTO_STAFF;
    }
    
    public function isCooperator(): bool {
        return $this->user_type === UserType::COOPERATOR;
    }
}
```

### 3. Authorization System
```php
// AuthServiceProvider.php
Gate::define('manage-users', function ($user) {
    return $user->user_type === UserType::ADMIN || 
           $user->user_type === UserType::PSTO_STAFF;
});
```

---

## Frontend Architecture

### 1. Inertia.js Integration
```typescript
// app.tsx - Main entry point
createInertiaApp({
    title: (title) => `${title} - SETUP CONNECT`,
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.tsx`, 
        import.meta.glob('./Pages/**/*.tsx')
    ),
    setup({ el, App, props }) {
        const root = createRoot(el)
        root.render(<App {...props} />)
    },
});
```

### 2. TypeScript Interfaces
```typescript
// types/index.ts
export interface User {
    id: number;
    name: string;
    email: string;
    user_type: 'admin' | 'psto_staff' | 'cooperator';
    is_active: boolean;
    photo?: string;
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: { user: User };
    errors: Record<string, string>;
    success?: string;
}
```

### 3. File Upload Handling
```typescript
// Photo upload logic in Edit.tsx
const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setData('photo', file);
        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    }
};

// Form submission with FormData
const submit: FormEventHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('_method', 'PUT');
    // ... append other fields
    if (data.photo) formData.append('photo', data.photo);
    
    router.post(`/users/${user.id}`, formData);
};
```

---

## Development Setup Instructions

### Prerequisites
- **PHP 8.2+** with extensions: mbstring, openssl, pdo, tokenizer, xml, ctype, json, bcmath, fileinfo
- **Composer** (PHP package manager)
- **Node.js 20.19+** or **22.12+**
- **npm** or **yarn**
- **MySQL 8.0+** or **MariaDB 10.3+**
- **Git**

### Complete Setup Instructions for Development Team

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd SETUP_CONNECT
```

#### Step 2: Backend Setup
```bash
# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

#### Step 3: Database Configuration
**Edit .env file:**
```env
APP_NAME="SETUP CONNECT"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=setup_connect
DB_USERNAME=root
DB_PASSWORD=your_password
```

**Create database:**
```sql
CREATE DATABASE setup_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Step 4: Run Migrations & Seeders
```bash
# Run database migrations
php artisan migrate

# Seed default admin user
php artisan db:seed --class=AdminUserSeeder

# Or run all migrations and seeders fresh
php artisan migrate:fresh --seed
```

#### Step 5: Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Build assets for development
npm run dev

# Or build for production
npm run build
```

#### Step 6: Storage Setup
```bash
# Create storage symbolic link
php artisan storage:link

# Set proper permissions (Linux/Mac)
chmod -R 775 storage bootstrap/cache
```

#### Step 7: File Upload Directory
```bash
# Create images directory
mkdir public/images

# Copy DOST logo to public/images/dost_logo.png
# (Manual step - copy the provided logo file)
```

#### Step 8: Start Development Servers

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
# Accessible at: http://127.0.0.1:8000
```

**Terminal 2 - Vite Dev Server (Optional for hot reloading):**
```bash
npm run dev
# Accessible at: http://localhost:5173
```

---

## Testing the Application

### 1. Login Test
- Navigate to `http://127.0.0.1:8000`
- Use credentials: `admin@setupconnect.com` / `admin123`
- Verify DOST logo appears correctly

### 2. User Management Test
- Create new user with photo upload
- Edit existing user and update photo
- View user profile
- Delete user (except self)

### 3. Responsive Design Test
- Test on mobile devices
- Verify navigation works on all screen sizes
- Check photo uploads on different devices

---

## Deployment Considerations

### Production Environment
```bash
# Set production environment
APP_ENV=production
APP_DEBUG=false

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev

# Build production assets
npm run build
```

### Server Requirements
- **Web Server**: Apache/Nginx with PHP-FPM
- **PHP**: 8.2+ with required extensions
- **Database**: MySQL 8.0+ or MariaDB 10.3+
- **Storage**: Adequate space for user photo uploads
- **SSL**: HTTPS recommended for production

---

## Common Development Commands

```bash
# Database operations
php artisan migrate:fresh --seed    # Reset database
php artisan migrate:rollback        # Rollback last migration
php artisan db:seed                 # Run seeders only

# Cache management
php artisan cache:clear             # Clear application cache
php artisan config:clear            # Clear config cache
php artisan route:clear             # Clear route cache

# Asset building
npm run dev                         # Development build with watching
npm run build                       # Production build
npm run preview                     # Preview production build

# Laravel operations
php artisan make:controller Name    # Create controller
php artisan make:model Name         # Create model
php artisan make:migration Name     # Create migration
```

---

## Development Best Practices

### 1. Code Organization
- Follow Laravel naming conventions
- Use TypeScript for all React components
- Implement proper error handling
- Write descriptive comments

### 2. Database
- Always use migrations for schema changes
- Create seeders for test data
- Use proper foreign key constraints
- Index frequently queried columns

### 3. Security
- Validate all user inputs
- Use Laravel's built-in security features
- Implement proper file upload validation
- Never store sensitive data in frontend

### 4. Frontend
- Use TypeScript interfaces consistently
- Implement proper error boundaries
- Follow React best practices
- Ensure responsive design

---

## Troubleshooting Guide

### Common Issues

#### 1. Photo Upload Errors
```bash
# Check storage permissions
chmod -R 775 storage
php artisan storage:link
```

#### 2. Vite Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Database Connection
```bash
# Check MySQL service status
# Verify credentials in .env file
php artisan migrate:status
```

#### 4. Missing Dependencies
```bash
# Update Composer
composer update
# Update NPM packages
npm update
```

---

## Support & Maintenance

### Key Files to Monitor
- `.env` - Environment configuration
- `composer.json` - PHP dependencies
- `package.json` - Node.js dependencies  
- `database/migrations/` - Database schema changes

### Backup Strategy
- Database: Regular MySQL dumps
- Files: User uploaded photos in `storage/app/public/`
- Code: Git repository with proper branching

### Performance Optimization
- Enable Laravel caching in production
- Optimize images for web delivery
- Use CDN for static assets
- Monitor database query performance

---

## Project Completion Summary

The SETUP CONNECT application has been successfully developed with the following key achievements:

1. ✅ **Modern Full-Stack Architecture** - Laravel 12 + React 18 + TypeScript
2. ✅ **Complete User Management System** - CRUD operations with role-based access
3. ✅ **Photo Upload & Management** - Secure file handling with preview functionality
4. ✅ **Responsive Design** - Mobile-first approach with TailwindCSS
5. ✅ **DOST Branding Integration** - Official logo in login and navigation
6. ✅ **Security Implementation** - Authentication, authorization, and input validation
7. ✅ **Professional UI/UX** - Clean, modern interface suitable for government use
8. ✅ **Development Ready** - Complete setup instructions and documentation

The application is now ready for deployment and can serve as a foundation for future enhancements and features.

---

**Document Version**: 1.0  
**Last Updated**: September 25, 2025  
**Project**: SETUP CONNECT - DOST  
**Technology Stack**: Laravel 12 + React 18 + TypeScript + TailwindCSS