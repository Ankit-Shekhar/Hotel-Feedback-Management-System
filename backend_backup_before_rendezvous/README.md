# Backend (Express + MongoDB)

## Local development
1. Install dependencies:
   `npm install`
2. Copy env template:
   `cp .env.example .env`
3. Set required values in `.env`.
4. Run dev server:
   `npm run dev`

## Production start command
- `npm start`

## Health check
- `GET /api/health`

## Required environment variables
- `MONGODB_URL`
- `CORS_ORIGIN` (comma-separated if multiple origins)
- `ADMIN_TOKEN_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Optional environment variables
- `REDIS_URL` or `REDIS_HOST` + `REDIS_PORT` (+ username/password)
- `PORT` (default: 8000)
- `ADMIN_TOKEN_EXPIRY` (default: `7d`)

## Admin seed safety
- By default, admin seed is disabled.
- To seed once intentionally, set:
  - `SEED_DEFAULT_ADMIN=true`
  - `DEFAULT_ADMIN_USERNAME=<username>`
  - `DEFAULT_ADMIN_PASSWORD=<strong password>`
- Keep `SEED_DEFAULT_ADMIN=false` in production after initial seed.

## Render deployment notes
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Ensure CORS origin includes your Vercel frontend domain.
