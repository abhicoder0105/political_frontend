# Political Frontend

React/Vite frontend for the Rails political backend.

## Run Locally

1. Start the Rails backend:

```powershell
cd C:\Users\LENOVO\OneDrive\Documents\political_backend
ruby bin\rails server -p 3000
```

2. Start the frontend:

```powershell
cd C:\Users\LENOVO\OneDrive\Documents\political_frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

3. Open:

```text
http://127.0.0.1:5173/
```

## Environment

Copy `.env.example` to `.env` and set:

```text
VITE_API_URL=http://localhost:3000
```

The Rails backend CORS default allows Vite dev URLs on ports `5173`, `5174`, and `5175`.

## Admin Login

Seed credentials from the Rails backend:

```text
Mobile: 9999999999
Password: admin123
```

## Implemented Routes

- `/` public home
- `/profile` Rakesh Shukla public profile
- `/news` and `/news/:id`
- `/campaigns` and `/campaigns/:id`
- `/campaigns/:id/support`
- `/request/new`
- `/request/status`
- `/login`
- `/admin/dashboard`
- `/admin/requests` and `/admin/requests/:id`
- `/admin/campaigns` and `/admin/campaigns/:id`
- `/admin/pr`
- `/admin/population`
- `/admin/work`
- `/admin/areas`
- `/admin/team`
- `/admin/users`
- `/admin/roles`
- `/admin/reports`
- `/admin/settings`

## Backend API Alignment

The frontend uses the Rails API endpoints directly:

- Public data: `/api/public/home`, `/api/public/profile`, `/api/public/campaigns`, `/api/public/pr_posts`, `/api/public/work_dones`
- Requests: `/api/public/requests`, `/api/public_requests/:id/track`
- OTP: `/api/otp/send`, `/api/otp/verify`
- Admin auth: `/api/auth/admin_login`
- Admin data: `/api/analytics/summary`, `/api/admin/requests`, `/api/campaigns`, `/api/pr_posts`, `/api/population_records`, `/api/work_dones`, `/api/areas`, `/api/users`, `/api/permissions`, `/api/role_permissions`

## Notes

This repo is a React DOM frontend. It does not contain React Native Web primitives such as `View`, `ScrollView`, or `TouchableOpacity`; the React Native Web raw text error belongs to the mobile repo if it still appears there.
