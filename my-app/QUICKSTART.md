# ⚡ DevLink Quick Start Guide

Get DevLink running in under 5 minutes!

## 🚀 Fast Setup (Local Development)

### Step 1: Clone & Install (1 min)
```bash
git clone https://github.com/nsairekha/DevLink.git
cd DevLink/my-app
npm install
```

### Step 2: Database Setup (2 min)
```bash
# Start MySQL (if not running)
mysql.server start  # macOS
# or
sudo service mysql start  # Linux

# Create database
mysql -u root -p
```

```sql
CREATE DATABASE DevLink;
USE DevLink;

-- Copy and paste contents from:
-- src/config/table.sql
-- src/config/clicks_log_table.sql
```

### Step 3: Clerk Setup (1 min)
1. Go to [clerk.com](https://clerk.com) and create account
2. Create new application
3. Enable Google & GitHub OAuth
4. Copy your API keys

### Step 4: Environment Variables (30 sec)
Create `my-app/.env.local`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=DevLink

# Clerk (get from dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=your@email.com
```

### Step 5: Run! (30 sec)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 Test Your Installation

1. ✅ Sign up with Google/GitHub
2. ✅ Create your username
3. ✅ Add a link
4. ✅ View analytics
5. ✅ Generate QR code
6. ✅ Visit `localhost:3000/yourusername`

---

## 🐛 Common Issues

### Database Connection Failed
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env.local
# Check DB_HOST, DB_USER, DB_PASSWORD
```

### Clerk Authentication Error
```bash
# Verify keys in .env.local
# Check you're using correct environment (test/prod)
# Ensure http://localhost:3000 is in Clerk allowed domains
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📱 Quick Feature Tour

### Add Your First Link
1. Go to **Edit Links**
2. Click **Add Link**
3. Choose **Social** or **Project**
4. Fill in title and URL
5. Toggle visibility

### Customize Theme
1. Go to **Theme**
2. Pick a background (color/gradient/image)
3. Choose button style
4. Select font family
5. Click **Save Theme**

### View Analytics
1. Go to **Home** (Analytics)
2. See your link performance
3. Change date range
4. Export data as CSV/JSON

### Share Your Profile
1. Go to **Theme**
2. Click **QR Code** to generate
3. Or click **Copy Link**
4. Visit `/yourusername` to see live page
5. Click **Share** button on profile

---

## 🎨 Customization Ideas

### Backgrounds
- Solid colors: `#ffffff`, `#000000`, `#3b82f6`
- Gradients: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Images: Upload to `public/theme/` and use `/theme/your-image.jpg`

### Button Styles
- **Fill**: Solid background
- **Outline**: Border only
- **Shadow**: Elevated look
- **Soft Shadow**: Subtle depth

### Fonts
- Inter (default, modern)
- Poppins (friendly)
- Roboto (classic)
- Montserrat (bold)
- Open Sans (readable)
- Lato (professional)

---

## 🚀 Deploy to Production

Ready to go live? See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Recommended: Vercel**
```bash
npm i -g vercel
vercel
```

---

## 📖 Full Documentation

- **README.md** - Complete feature list
- **DEPLOYMENT.md** - Production deployment
- **ENHANCEMENTS.md** - What's new

---

## 💬 Need Help?

- 📧 Email: support@devlink.com
- 💻 GitHub Issues: [Report a bug](https://github.com/nsairekha/DevLink/issues)
- 📖 Docs: Full documentation in README.md

---

## 🎉 You're Ready!

Start sharing your links with the world! 🔗

Your profile will be at: `http://localhost:3000/yourusername`

---

**Happy Linking! 🚀**
