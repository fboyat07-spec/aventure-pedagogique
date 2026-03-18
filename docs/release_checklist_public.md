# KidAI Public Release Checklist

## 1) Security
- Rotate OpenAI and Firebase keys before release.
- Verify no secrets are committed (`.env`, service account JSON, API keys).
- Enforce `DEV_BYPASS_AUTH=false` in production.
- Validate Render environment variables are set and masked.

## 2) Stability
- `/health` returns `status: ok` on Render.
- `/v1/ops/status` shows OpenAI and Firebase ready.
- `/v1/ops/metrics` has no spike in 5xx before release.
- Rate limiting active on tutor/exercises/homework routes.

## 3) Functional QA
- Welcome -> profile -> onboarding flow works.
- Diagnostic flow completes and returns placement.
- Exercise submission validates correct/incorrect answers.
- Missions can complete and award XP.
- Parent dashboard shows summary + recommendations.
- Settings can sync offline queue.
- Homework scanner returns analysis for a valid image URL.

## 4) Analytics
- `session_start` events received.
- `exercise_submitted` and `lesson_completed` events received.
- `quest_completed` and `diagnostic_completed` events received.
- Drop-risk logic updates after 24h/48h inactivity windows.

## 5) Deployment
- Frontend exported (`expo export -p web`) and deployed to Firebase Hosting.
- Backend commit pushed to `main` and deployed on Render.
- Verify production URLs:
  - https://aventure-pedagogique.web.app
  - https://aventure-pedagogique.onrender.com/health

## 6) Post-release Monitoring (first 72h)
- Check error rate and latency every 6 hours.
- Check drop-risk ratio daily.
- Validate OCR/tutor fallback rate.
- Confirm no auth failures spike.
