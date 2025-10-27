# Admin Dashboard Setup

## Overview
The admin dashboard provides system-wide analytics and user management for DevLink administrators. Access is controlled via email verification against an environment variable.

## Setup Instructions

### 1. Configure Admin Email

Add the following to your `.env.local` file:

```env
ADMIN_EMAIL=your-admin-email@gmail.com
```

**Important:** Use the exact email address associated with your Google account that you'll use to sign in.

### 2. Restart Development Server

After adding the environment variable, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## How It Works

### Authentication Flow

1. **User Login**: User signs in with Google or GitHub
2. **Email Check**: System compares user's email with `ADMIN_EMAIL` from `.env.local`
3. **Route Redirect**:
   - **If Admin**: Redirected to `/admin` dashboard
   - **If Regular User**: Redirected to `/home` dashboard

### Admin Dashboard Features

#### 📊 **System Statistics**
- **Total Users**: All registered users
- **Total Links**: All created links across platform
- **Total Clicks**: Sum of all link clicks
- **Active Users**: Users who have created at least one link

#### 👥 **User Management Table**
View all users with:
- User ID
- Name and Email
- Username (clickable to view public profile)
- Auth Provider (Google/GitHub)
- Link Count
- Total Clicks
- Account Creation Date

### API Endpoints

#### Check Admin Status
```typescript
GET /api/admin/check
// Returns: { isAdmin: boolean, email: string }
```

#### Get Admin Statistics
```typescript
GET /api/admin/stats
// Returns: { stats: { totalUsers, totalLinks, totalClicks, activeUsers } }
// Requires: Admin authentication
```

#### Get All Users
```typescript
GET /api/admin/users
// Returns: { users: User[] }
// Requires: Admin authentication
```

## Security

### Access Control
- ✅ All admin API routes verify admin status before returning data
- ✅ Admin check compares email with environment variable
- ✅ Non-admin users get 403 Forbidden response
- ✅ Unauthenticated requests get 401 Unauthorized

### Route Protection
- `/admin` page checks admin status on mount
- Non-admin users are redirected to `/home`
- Admin routes require valid Clerk authentication

## Testing Admin Access

### As Admin User:
1. Set `ADMIN_EMAIL` in `.env.local` to your Google email
2. Restart the dev server
3. Sign in with that Google account
4. You should be redirected to `/admin` instead of `/home`
5. See system-wide statistics and all users

### As Regular User:
1. Sign in with a different Google account (not matching `ADMIN_EMAIL`)
2. You should be redirected to `/home`
3. See only your personal analytics
4. Cannot access `/admin` (will redirect to `/home`)

## Sidebar Navigation

The sidebar dynamically shows:
- **For Admin**: "Admin" link (with shield icon) instead of "Home"
- **For Users**: "Home" link (with home icon)

Both admin and regular users can access:
- Edit Links
- Profile
- Theme
- Logout

## Environment Variables Required

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=DevLink

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Access
ADMIN_EMAIL=admin@example.com
```

## Troubleshooting

### Admin Access Not Working

1. **Check Email Match**
   - Ensure `ADMIN_EMAIL` exactly matches your Google account email
   - Check for typos or extra spaces

2. **Restart Server**
   - Environment variables only load on server start
   - Stop and restart: `npm run dev`

3. **Check Console**
   - Open browser console for errors
   - Check server terminal for error messages

4. **Verify .env.local**
   - File must be named exactly `.env.local`
   - Must be in project root directory
   - Should not be committed to git

### Still Redirecting to /home

1. Clear browser cache and cookies
2. Sign out and sign back in
3. Check terminal for "ADMIN_EMAIL not set" message
4. Verify email in Clerk dashboard matches ADMIN_EMAIL

## Production Deployment

When deploying to production:

1. Add `ADMIN_EMAIL` to your hosting platform's environment variables
2. Use the same email you'll sign in with
3. Never commit `.env.local` to version control
4. Consider using multiple admin emails (requires code modification)

## Future Enhancements

Potential admin features to add:
- Multiple admin emails support
- User deletion/suspension
- Link moderation
- Analytics export
- Email notifications
- Activity logs
- Custom admin roles
