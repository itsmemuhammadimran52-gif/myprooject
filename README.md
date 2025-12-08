# Pro Thumbnail Generator

High‑CTR thumbnail generator for creators. React + Vite frontend with Firebase authentication, AI‑powered image generation, and an email verification flow using Nodemailer.

## Features
- AI thumbnail generation with category, emotion, text and background controls
- Image cropping, adjustments, and text editing with outlines and fonts
- Subscription pricing UI with monthly/yearly toggle and savings display
- Authentication: email/password, Google, Apple, Microsoft
- Email verification via Nodemailer before account creation
- User profiles stored in Firestore, per‑plan generation limits
- Local caching of generated thumbnails for faster UX

## Tech Stack
- Frontend: `React`, `Vite`, `TypeScript`, `Tailwind‑style classes`
- Auth & data: `Firebase Auth`, `Firestore`, `Storage`
- AI integration: `@google/genai`
- Server (verification): `Express`, `Nodemailer`, `dotenv`, `cors`

## Project Structure
```
components/           # UI pages and panels (Home, Pricing, Login, Signup, Tool, etc.)
services/             # Firebase, AI (Gemini), cache helpers
server/index.js       # Email verification API (send code, verify code)
App.tsx               # App shell, routing/state, generation flows
index.tsx, index.html # Vite entry
vite.config.ts        # Vite configuration
```

## Getting Started
### Prerequisites
- Node.js 18+
- A Firebase project (Auth, Firestore, Storage enabled)
- SMTP credentials (e.g., Gmail App Password) for email verification

### Installation
```
npm install
```

### Environment Variables
Create a `.env` file at the project root (do not commit secrets). Example:
```
VITE_GEMINI_API_KEY=your_gemini_api_key

# Verification API server
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
VERIFY_PORT=5000

# Frontend -> backend base URL
VITE_API_URL=http://localhost:5000
```

### Development
Run the verification server and the client in separate terminals:
- Start API server: `npm run server` (default: http://localhost:5000)
- Start client: `npm run dev` (default: http://localhost:3000 or next available port)

### Production
- Build: `npm run build`
- Preview static build: `npm run preview`

## Core Workflows
### Email Verification (Signup)
1. User enters signup details and submits
2. API `POST /api/send-verification` sends a 6‑digit code to the email and stores it in Firestore with a 10‑minute expiry
3. User enters the code; client calls `POST /api/verify-code`
4. On success, the app creates the Firebase account and user profile

### Authentication & Profiles
- Social sign‑in via Google/Apple/Microsoft
- Email/password sign‑in and profile creation in Firestore
- Generation limits tracked per plan

### Pricing UI
- Monthly/Yearly toggle with a configurable discount
- Savings badge and strike‑through original yearly cost

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview production build
- `npm run server` — start verification API

## Troubleshooting
- Unexpected end of JSON input when parsing API responses:
  - Ensure `VITE_API_URL` points to the verification server (e.g., `http://localhost:5000`)
  - Verify the server is running and returning JSON `{ ok: true }` or `{ error: string }`
  - The client includes safe JSON parsing to avoid crashes if the body is empty
- Port conflicts:
  - Vite will auto‑select a free port; check terminal for the actual URL
  - Set `VERIFY_PORT` to choose the API server port
- SMTP errors:
  - Use an app‑specific password for Gmail SMTP
  - Verify host/port and that your SMTP provider allows programmatic access

## Security
- Do not commit real API keys or passwords
- Keep `.env` locally and distribute secrets via your deployment environment

## License
Apache‑2.0
