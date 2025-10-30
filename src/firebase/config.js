import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC0DMN4fZYYxEnBNxLwDWfT_q4cE2JxTqU",
  authDomain: "the-usual-f3f4e.firebaseapp.com",
  projectId: "the-usual-f3f4e",
  storageBucket: "the-usual-f3f4e.firebasestorage.app",
  messagingSenderId: "66983482947",
  appId: "1:66983482947:web:aeafa1c5a4f9b6ad35a6f6",
  measurementId: "G-T8HQ3MN273"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Auto-enable test mode on localhost to bypass reCAPTCHA 401 errors
// In test mode, SMS is NOT sent; use Firebase Console test phone numbers
let isAppVerificationDisabled = false
try {
  const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(window.location.host)
  if (isLocalhost && auth?.settings) {
    auth.settings.appVerificationDisabledForTesting = true
    isAppVerificationDisabled = true
    console.warn('[Firebase] Test mode enabled on localhost. SMS will NOT be sent. Use Firebase Console test phone numbers.')
    console.warn('[Firebase] Add test numbers: Console → Authentication → Sign-in method → Phone → Add phone numbers for testing')
  }
} catch (_) {
  // ignore
}

// Helper to enable test mode at runtime (call this in dev to skip SMS and use Firebase test phone numbers)
export function enablePhoneAuthTestMode(reason = 'manual') {
  try {
    if (auth?.settings) {
      auth.settings.appVerificationDisabledForTesting = true
      isAppVerificationDisabled = true
      console.warn(`[Firebase] Test mode enabled (${reason}). SMS will NOT be sent. Use Firebase Console test phone numbers/codes.`)
      return true
    }
  } catch (_) {
    // ignore
  }
  return false
}

// Helper to disable test mode and send real SMS
export function disablePhoneAuthTestMode() {
  try {
    if (auth?.settings) {
      auth.settings.appVerificationDisabledForTesting = false
      isAppVerificationDisabled = false
      console.log('[Firebase] Test mode disabled. SMS will be sent.')
      return true
    }
  } catch (_) {
    // ignore
  }
  return false
}

export { app, auth, firebaseConfig, isAppVerificationDisabled }
