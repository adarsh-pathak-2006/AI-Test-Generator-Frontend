# AI Quiz Generator - Frontend

This is a Next.js application that serves as the frontend for the AI Quiz Generator platform.

## Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Make sure `NEXT_PUBLIC_API_URL` in `.env` is set to your local Django backend (usually `http://127.0.0.1:8000`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deploying to Vercel

Vercel is the easiest way to deploy a Next.js application.

1. **Push your code to GitHub**: Ensure this `frontend` directory is pushed to its own GitHub repository (which it looks like you've already done as `AI-Test-Generator-Frontend`).
2. **Log in to Vercel**: Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
3. **Add New Project**: Click "Add New..." > "Project".
4. **Import Repository**: Select your `AI-Test-Generator-Frontend` repository.
5. **Configure Environment Variables**: 
   - Expand the "Environment Variables" section.
   - Add a new variable with the key `NEXT_PUBLIC_API_URL`
   - Set its value to your production Django backend URL (e.g., `https://my-backend.onrender.com`). Do not include a trailing slash.
6. **Deploy**: Click the "Deploy" button. Vercel will automatically build and host your Next.js application!

**Important**: Make sure your Django backend has your new Vercel URL added to `CORS_ALLOWED_ORIGINS` (or keep `CORS_ALLOW_ALL_ORIGINS = True` if you prefer).
