# Public Profile Access

## Public Routes Configuration

The following routes are now publicly accessible without authentication:

### User Profile Pages
- **Route**: `/{username}`
- **Example**: `http://localhost:3000/johndoe`
- **Description**: Anyone can view user profiles without logging in

### Public API Endpoints
- **Route**: `/api/public-profile?username={username}`
- **Description**: Fetches user profile and links data
- **Authentication**: Not required

- **Route**: `/api/track-click`
- **Description**: Tracks link clicks for analytics
- **Authentication**: Not required

### Protected Routes
All other routes require authentication:
- `/home` - Dashboard/Analytics
- `/edit-links` - Link management
- `/profile` - User settings
- `/theme` - Theme customization
- All other API endpoints

## How It Works

The middleware (`src/middleware.ts`) uses Clerk's authentication to:
1. Allow public access to username pages and related APIs
2. Protect all dashboard and management pages
3. Require authentication for user-specific API endpoints

## Testing Public Access

1. **Log out** of your account (or use incognito mode)
2. Visit any user profile: `http://localhost:3000/{username}`
3. You should be able to:
   - ✅ View the profile
   - ✅ See all visible links
   - ✅ Click on links (tracked)
   - ✅ See custom theme
4. You should NOT be able to:
   - ❌ Access `/home`, `/edit-links`, `/profile`, `/theme`
   - ❌ Edit any content
   - ❌ Access protected APIs

## Sharing Profiles

Users can now share their profile links with anyone:
- Share URL: `https://yourapp.com/username`
- No login required for visitors
- Full theme customization visible
- Click tracking works for analytics

## Security

- Public access is read-only
- Only visible links are shown
- User data editing requires authentication
- API endpoints are properly segregated
