import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNvd-26iXm7g3og2bqKCPHWsr-qi6kClg",
  authDomain: "undangan-fitria.firebaseapp.com",
  projectId: "undangan-fitria",
  storageBucket: "undangan-fitria.firebasestorage.app",
  messagingSenderId: "976874549706",
  appId: "1:976874549706:web:eddece095c082c7e3edf33",
  measurementId: "G-BZ9XMWN5M0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };