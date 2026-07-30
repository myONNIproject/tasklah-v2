import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdl29jRzF1MRHZPrEqzOoZjsKNUcgVerg",
  authDomain: "tasklah-v2.firebaseapp.com",
  projectId: "tasklah-v2",
  storageBucket: "tasklah-v2.firebasestorage.app",
  messagingSenderId: "158439171358",
  appId: "1:158439171358:web:4dabf09334d9e27191150f",
  measurementId: "G-QQWLWMFMLW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);