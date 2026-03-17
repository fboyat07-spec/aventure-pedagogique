import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

let firebaseReady = false;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
    firebaseReady = true;
  }
}

export const isFirebaseReady = () => firebaseReady;
export const db = firebaseReady ? admin.firestore() : null;

export async function verifyIdToken(idToken) {
  if (!firebaseReady) return null;
  return admin.auth().verifyIdToken(idToken);
}
