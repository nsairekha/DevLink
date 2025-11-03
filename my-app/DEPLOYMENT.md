# 🚀 DevLink Deployment Guide

Complete guide to deploying DevLink to production.

## 📋 Pre-Deployment Checklist

- [ ] MySQL database set up and accessible
- [ ] Clerk account configured with OAuth providers
- [ ] All environment variables ready
- [ ] Database migrations run successfully
- [ ] Test the app locally first

## 🌐 Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Automatic deployments from Git
- ✅ Built-in CDN and edge network
- ✅ Zero configuration
- ✅ Free SSL certificates
- ✅ Optimized for Next.js

### Steps

#### 1. Prepare Your Project
```bash
# Ensure your code is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Set Up Database
Option A: **PlanetScale** (Recommended)
```bash
# Create account at planetscale.com
# Create new database
# Get connection string
```

Option B: **Railway**
```bash
# Create account at railway.app
# Deploy MySQL
# Get connection string
```

Option C: **Your Own MySQL Server**
- Ensure it's accessible from the internet
- Whitelist Vercel IPs or use 0.0.0.0/0 (less secure)

#### 3. Deploy to Vercel

**Using Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: **my-app**
   - Build Command: `npm run build`
   - Output Directory: `.next`

**Using Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd my-app
vercel
```

#### 4. Add Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

```env
# Database
DB_HOST=your-db-host.com
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=DevLink
DB_PORT=3306

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/create-profile

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

#### 5. Configure Clerk for Production

1. Go to [clerk.com](https://clerk.com) dashboard
2. Select your application
3. **Domains** > Add production domain:
   - `https://your-domain.vercel.app`
4. **API Keys** > Use **Production** keys
5. **OAuth** > Update redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
6. **Webhooks** (Optional):
   - Endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`

#### 6. Deploy & Test
```bash
# Redeploy with new env variables
vercel --prod

# Visit your site
open https://your-domain.vercel.app
```

### Custom Domain Setup

1. **In Vercel:**
   - Go to Project Settings > Domains
   - Add your custom domain (e.g., `devlink.com`)
   - Copy DNS records

2. **In Your Domain Registrar:**
   - Add the DNS records provided by Vercel
   - Wait for propagation (5-30 minutes)

3. **Update Environment Variables:**
   ```env
   NEXT_PUBLIC_APP_URL=https://devlink.com
   ```

4. **Update Clerk URLs:**
   - Add custom domain to allowed domains
   - Update redirect URLs

---

## 🐳 Option 2: Docker

### Dockerfile
Create `Dockerfile` in `my-app/`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: ./my-app
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - DB_USER=devlink
      - DB_PASSWORD=secure_password
      - DB_NAME=DevLink
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUB_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET}
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: DevLink
      MYSQL_USER: devlink
      MYSQL_PASSWORD: secure_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./my-app/src/config:/docker-entrypoint-initdb.d

volumes:
  mysql_data:
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☁️ Option 3: AWS (EC2 + RDS)

### 1. Set Up RDS MySQL
1. Go to AWS RDS Console
2. Create MySQL 8.x database
3. Configure security group (allow port 3306)
4. Note the endpoint and credentials

### 2. Set Up EC2 Instance
```bash
# Launch Ubuntu 22.04 instance
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install git

# Clone your repo
git clone https://github.com/yourusername/devlink.git
cd devlink/my-app

# Install dependencies
npm install

# Create .env.local with production values
nano .env.local

# Build
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start app
pm2 start npm --name "devlink" -- start

# Save PM2 config
pm2 save
pm2 startup
```

### 3. Configure Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/devlink

# Add this content:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/devlink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Set Up SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo systemctl reload nginx
```

---

## 🔒 Security Checklist

- [ ] Use environment variables for secrets
- [ ] Enable SSL/HTTPS
- [ ] Set up CORS properly
- [ ] Use strong database passwords
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Use Clerk's security features
- [ ] Implement CSP headers

---

## 📊 Post-Deployment

### 1. Run Database Migrations
```bash
# Connect to production database
mysql -h your-db-host -u your-user -p

# Run migrations
source table.sql
source clicks_log_table.sql
```

### 2. Set Up Monitoring

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Error Tracking with Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 3. Set Up Backups

**Automated MySQL Backups:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$DATE.sql
# Upload to S3 or your storage
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

### 4. Performance Optimization

**Enable Caching:**
- Configure Vercel's edge caching
- Use Redis for session storage
- Enable Next.js Image Optimization

**Monitor Performance:**
- Set up Lighthouse CI
- Use Vercel Analytics
- Monitor database queries

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
mysql -h your-host -u your-user -p

# Check firewall
telnet your-host 3306

# Verify env variables
echo $DB_HOST
```

### Build Failures
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Clerk Authentication Issues
- Verify production keys are used
- Check domain is whitelisted
- Confirm redirect URLs match

### Performance Issues
- Enable Next.js caching
- Optimize images
- Use CDN for static assets
- Add database indexes

---

## 📞 Support

Need help? 
- 📧 Email: support@devlink.com
- 💬 Discord: [Join our server](https://discord.gg/devlink)
- 📖 Docs: [docs.devlink.com](https://docs.devlink.com)

---

## 🎉 Success!

Your DevLink instance should now be live! 🚀

Visit your site and:
1. Create your first account
2. Set up your profile
3. Add some links
4. Share your profile!

Happy linking! 🔗
