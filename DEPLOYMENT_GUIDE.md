# Deployment Environment Setup Guide

## Required Environment Variables

Create a `.env` file in your project root with these variables:

```env
# Database - Use a hosted MySQL database (not localhost)
# Examples: PlanetScale, Railway, AWS RDS, or any MySQL hosting provider
DATABASE_URL="mysql://username:password@host:port/database_name"

# JWT Secret - Generate a strong random string (at least 32 characters)
# You can generate one with: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-here-min-32-chars"

# Optional: For local development
NODE_ENV="production"
```

## Database Setup for Hosting

### Option 1: PlanetScale (Recommended - Free Tier Available)
1. Sign up at https://planetscale.com
2. Create a new database
3. Get your connection string
4. Update `DATABASE_URL` in your environment variables

### Option 2: Railway
1. Sign up at https://railway.app
2. Add a MySQL database
3. Copy the connection URL
4. Update `DATABASE_URL`

### Option 3: Any MySQL Provider
Make sure your database connection string format is:
```
mysql://username:password@hostname:port/database
```

## Deployment Steps

### 1. Database Migration
Before deploying, run:
```bash
npx prisma migrate deploy
npx prisma generate
```

### 2. Build Configuration
Your `next.config.ts` is set up correctly. Make sure you have:
```typescript
const nextConfig = {
  reactCompiler: true,
};
```

### 3. Hosting Platforms

#### Vercel (Recommended for Next.js)
1. Connect your GitHub repo to Vercel
2. Add environment variables in Project Settings
3. Deploy

#### Railway
1. Connect your repository
2. Add environment variables
3. Deploy

#### Render
1. Create a new Web Service
2. Connect your repository
3. Add environment variables
4. Set build command: `npm install && npx prisma generate && npm run build`
5. Set start command: `npm start`

## Troubleshooting Login/Signup Issues

### If users can't login after deployment:

1. **Check JWT_SECRET is set** - Without this, auth tokens won't work
2. **Verify DATABASE_URL is accessible** - The database must be reachable from the hosting server
3. **Check Prisma migrations ran** - The database tables must exist
4. **Cookie settings are fixed** - I've updated cookies to work over HTTP/HTTPS

## Files Modified

1. `prisma/schema.prisma` - Added `url = env("DATABASE_URL")`
2. `lib/auth.ts` - Added production check for JWT_SECRET
3. `app/api/login/route.ts` - Fixed cookie secure setting
4. `app/api/auth/session/route.ts` - Fixed cookie secure setting

## Next Steps

1. Get a hosted MySQL database
2. Set your `DATABASE_URL` environment variable
3. Set your `JWT_SECRET` environment variable
4. Run `npx prisma migrate deploy` to create database tables
5. Deploy your application
6. Test login/signup functionality

## Security Note

For production, consider:
- Using `secure: true` for cookies once you have HTTPS enabled
- Setting up proper CORS headers
- Using a more secure database password
- Enabling database SSL connections
