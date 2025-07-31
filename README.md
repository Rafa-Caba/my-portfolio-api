# 🔧 Portfolio Project – Backend (API)

**Last updated:** 2025-07-31

## 🚀 Tech Stack
- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- Cloudinary (image upload)
- JWT Auth + Refresh tokens
- CORS and multer middleware

## ✅ Features Implemented

### User Model
- Extended `IUser` schema:
  - `quickFacts: string[]`
  - `visibility.quickFacts`
- Role-based access (Admin, Editor, Viewer)
- Profile image storage (Cloudinary)

### Auth Routes
- `/auth/register` & `/auth/login`
- `/auth/refresh` – refresh token handler
- JWT middleware and token verification

### User Routes
- `GET /users/profile` (authenticated)
- `PUT /users/:id` (update with file + quickFacts + visibility)
- Validation for visibility and quickFacts
- Automatic cloudinary cleanup on image update

### Public Endpoints
- `/api/public-projects`
- Dynamic visibility filtering for public-facing content

## ✅ Highlights
- Defensive coding for JSON-parsing fields (e.g., quickFacts)
- Schema-type-safe visibility filtering
- File upload middleware integration with user image updates
- Fully working personal and public settings
