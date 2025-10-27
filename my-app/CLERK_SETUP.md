# Clerk Authentication Setup - Social Login Only

## Remove Email/Password Authentication

To disable email/password login and keep only Google and GitHub authentication, follow these steps:

### 1. Go to Clerk Dashboard
Visit: https://dashboard.clerk.com

### 2. Select Your Application
Choose your DevLink application from the dashboard

### 3. Navigate to User & Authentication
- Click on **"User & Authentication"** in the left sidebar
- Click on **"Email, Phone, Username"**

### 4. Disable Email/Password Authentication
- Find **"Email address"** section
- Toggle OFF **"Require"** for email address (if you only want social)
- Or keep email ON but disable password authentication
- Make sure **"Password"** authentication strategy is turned OFF

### 5. Configure Social Connections
- Go to **"Social Connections"** in the left sidebar
- Enable **Google** (if not already enabled)
  - Click "Add connection"
  - Select Google
  - Follow the setup instructions
- Enable **GitHub** (if not already enabled)
  - Click "Add connection"
  - Select GitHub
  - Follow the setup instructions

### 6. Disable Other Authentication Methods
- Go to **"Email, Phone, Username"** settings
- Ensure the following are DISABLED:
  - ❌ Email verification code (if you don't want email-only login)
  - ❌ Password authentication
  - ❌ Phone number authentication
  - ❌ Username-based authentication

### 7. Save Settings
- Make sure to save all changes
- Test the authentication flow

## Current Configuration

The `SignIn` component in the app is configured to use:
- Social providers: Google and GitHub
- No email/password fields should appear if properly configured in Clerk dashboard

## Testing

1. Clear your browser cookies and cache
2. Navigate to `/auth/login`
3. You should ONLY see:
   - Google sign-in button
   - GitHub sign-in button
   - NO email/password input fields

## Important Notes

⚠️ **The authentication methods are controlled by Clerk Dashboard settings**

The component configuration in the code only affects the UI appearance, but the actual authentication methods available are determined by your Clerk Dashboard settings.

## Environment Variables

Make sure your `.env.local` has the correct Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Redirect URLs

The sign-in component is configured to redirect to `/dashboard` after successful authentication.

## Support

If you need help:
- Clerk Documentation: https://clerk.com/docs
- Clerk Support: https://clerk.com/support
