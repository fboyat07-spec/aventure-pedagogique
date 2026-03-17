# KidAI Learning V2 — Runbook (Chronological)

This page is the single, up-to-date guide to run and extend the project in VS Code.

## 0) Repo location
`C:\Users\Florian\Documents\KidAI`

## 1) Prerequisites
- Node.js LTS installed.
- VS Code installed.
- A Firebase project (for auth + Firestore) when you want real data.
- An OpenAI API key when you want real AI generation.

## 2) Configuration (env)
### Backend env
Create or update:
`C:\Users\Florian\Documents\KidAI\backend\.env`

Minimum for local demo (no real Firebase):
```
PORT=3000
DEV_BYPASS_AUTH=true
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5
```

For real Firebase:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
DEV_BYPASS_AUTH=false
```

### Frontend env (optional)
The app auto-detects your dev machine IP in Expo. You can override it:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/v1
```

For real Firebase auth in the app:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## 3) Install dependencies
Open a PowerShell terminal in VS Code.

Backend:
```
cd C:\Users\Florian\Documents\KidAI\backend
npm install
```

Frontend:
```
cd C:\Users\Florian\Documents\KidAI\frontend
npm install
```

If `npm` is blocked by PowerShell policy, run:
```
& "C:\Program Files\nodejs\npm.cmd" install
```

## 4) Start backend API
```
cd C:\Users\Florian\Documents\KidAI\backend
npm run dev
```
Backend listens on `http://localhost:3000`.

Health check:
```
GET http://localhost:3000/health
```

## 5) Start mobile app
```
cd C:\Users\Florian\Documents\KidAI\frontend
npm run start
```

Use Expo Go (Android/iOS) or Android Studio / Xcode simulator.

## 6) Project docs
- Product spec: `C:\Users\Florian\Documents\KidAI\docs\kidai_v2_spec.md`
- OpenAPI: `C:\Users\Florian\Documents\KidAI\docs\openapi.yaml`
- Firestore schema: `C:\Users\Florian\Documents\KidAI\docs\firestore_schema.md`
- Wireframes: `C:\Users\Florian\Documents\KidAI\docs\wireframes_rn.md`
- Safe Codex prompt: `C:\Users\Florian\Documents\KidAI\docs\codex_prompt.txt`

## 7) Core flows to test
1. Launch app ? Welcome ? onboarding.
2. Home loads skills list from backend.
3. Exercise generation via `/v1/exercises/generate`.
4. Tutor chat via `/v1/tutor/chat`.
5. Parent dashboard (local demo data).

## 8) Next milestones (optional)
- Replace demo data with Firestore reads/writes.
- Add real analytics instrumentation.
- Ship teacher/classroom modules.
- Add OCR and voice tutor integrations.

## 9) Known constraints
- OpenAI responses are mocked if `OPENAI_API_KEY` is empty.
- Firebase is optional for local demo; enable it to persist data.
