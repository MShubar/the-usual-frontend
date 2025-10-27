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

// For development only - use test phone numbers
// Go to Firebase Console → Authentication → Phone → Add test phone number
// Example: +1 650-555-3434 with code 123456

export { app, auth }
