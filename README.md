# Learning Platform - MERN Stack

A modular learning platform where users can register, explore structured courses, and complete chapters. The platform supports different user roles (admin and learner) with role-based access control.

## Features

- JWT-based authentication
- Role-based access control (Admin/Learner)
- Course management with nested structure (Courses → Sections → Units → Chapters)
- Interactive questions (MCQ, Fill in the blank, Text-based)
- Progress tracking
- Responsive design

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Mobile**: Flutter (Optional)

## Project Structure

```
learning-platform/
├── backend/           # Express.js backend
├── frontend/          # Next.js frontend
└── mobile/           # Flutter mobile app (optional)
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file with the following variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env.local file with the following variables:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Course Endpoints

- GET /api/courses - Get all courses
- POST /api/courses - Create a new course (Admin only)
- GET /api/courses/:id - Get course details
- PUT /api/courses/:id - Update course (Admin only)
- DELETE /api/courses/:id - Delete course (Admin only)

### Progress Endpoints

- GET /api/progress - Get user progress
- POST /api/progress - Save progress
- PUT /api/progress/:id - Update progress

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

## License

MIT
