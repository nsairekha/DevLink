# Database Setup Guide

## Prerequisites
- MySQL installed on your system
- Database credentials configured in `.env.local`

## Environment Variables

Add the following to your `.env.local` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=DevLink
```

## Database Setup Steps

### 1. Create the Database and Tables

First time setup - run the main table creation script:

```bash
mysql -u root -p < src/config/table.sql
```

Or manually in MySQL:

```sql
mysql -u root -p
source src/config/table.sql
```

### 2. Run Migrations (if updating existing database)

If you already have tables and need to add the new columns:

```bash
mysql -u root -p DevLink < src/config/migration.sql
```

## Database Schema

### Users Table
- `id` - Primary key
- `clerk_user_id` - Clerk authentication ID
- `email` - User email
- `name` - Full name
- `image_url` - Profile picture URL
- `provider` - Auth provider (google, github, clerk)
- `username` - Unique username
- `bio` - User bio (max 80 characters)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Links Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `link_type` - Type: 'social' or 'project'
- `title` - Link title
- `url` - Link URL
- `icon` - Icon name (e.g., 'FaInstagram')
- `is_visible` - Visibility status (boolean)
- `clicks` - Click count
- `display_order` - Display order
- `created_at` - Timestamp
- `updated_at` - Timestamp

## API Endpoints

### Links Management

#### GET /api/links
Fetch all links for a user
```
Query params: userId (Clerk user ID)
```

#### POST /api/links
Create a new link
```json
{
  "clerkUserId": "user_xxx",
  "type": "social" | "project",
  "title": "Instagram",
  "url": "https://instagram.com/username",
  "icon": "FaInstagram"
}
```

#### PUT /api/links
Update a link
```json
{
  "linkId": "123",
  "clerkUserId": "user_xxx",
  "title": "Updated Title",
  "url": "https://...",
  "isVisible": true
}
```

#### DELETE /api/links
Delete a link
```
Query params: linkId, userId
```

### Bio Management

#### GET /api/bio
Fetch user bio
```
Query params: userId (Clerk user ID)
```

#### PUT /api/bio
Update user bio
```json
{
  "clerkUserId": "user_xxx",
  "bio": "Your bio text (max 80 chars)"
}
```

## Features Implemented

✅ Create, Read, Update, Delete links
✅ Toggle link visibility
✅ Save and update user bio
✅ Social media links with icons
✅ Project links
✅ Click tracking (structure in place)
✅ Display order management
✅ Automatic data fetching on page load
✅ Real-time updates with database sync

## Testing the Setup

1. Start your MySQL server
2. Run the database scripts
3. Start the Next.js dev server: `npm run dev`
4. Navigate to the edit-links page
5. Add links and bio - they should persist in the database

## Troubleshooting

### Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check `.env.local` credentials
- Ensure database exists: `SHOW DATABASES;`

### Table Issues
- Check if tables exist: `SHOW TABLES;`
- Verify table structure: `DESCRIBE users;` or `DESCRIBE links;`
- Re-run migration if needed

### API Errors
- Check browser console for errors
- Check terminal/server logs
- Verify user is authenticated with Clerk
