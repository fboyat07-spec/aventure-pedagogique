# FCM Setup (KidAI)

## 1) Firebase Console
- Open project `aventure-pedagogique`.
- Go to **Cloud Messaging**.
- Ensure Firebase Cloud Messaging API is enabled.

## 2) Service Account (Render backend)
- Keep `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` configured.
- `DEV_BYPASS_AUTH` must stay `false` in production.

## 3) Registering a device token
- Open app settings screen.
- Use **Auto Detect Token (Device)** on a real Android/iOS build, or paste a valid FCM token manually.
- Click **Register Device Token**.

## 4) Push tests
- Click **Send Test Push** to validate transport.
- Click **Send Smart Nudge Push** to send adaptive notification text.

## 5) Production notes
- Tokens can expire or be revoked.
- Backend auto-removes invalid tokens when Firebase returns `registration-token-not-registered`.
- Track opens with `POST /v1/notifications/opened`.
- Auto token detection is not available in web build.
