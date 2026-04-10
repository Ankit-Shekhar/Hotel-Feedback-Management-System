# Frontend (Vite + React)

## Local development
1. Install dependencies:
	`npm install`
2. Copy env template and set backend URL:
	`cp .env.example .env`
3. Start dev server:
	`npm run dev`

## Required environment variable
- `VITE_API_BASE_URL`:
  Full backend API base URL, including `/api`.

Example:
`VITE_API_BASE_URL=https://your-render-backend.onrender.com/api`

## Production build
- `npm run build`
- `npm run preview`

## Vercel deployment notes
- This project includes `vercel.json` with SPA rewrites so deep links work.
- In Vercel project settings, add:
  - `VITE_API_BASE_URL=https://<your-render-domain>/api`
- Redeploy frontend after backend URL or CORS origin changes.
