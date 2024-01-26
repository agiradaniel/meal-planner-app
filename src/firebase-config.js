// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPqFCRrLqUNv5vUGAwHQY9DOgtGxl1SeM",
  authDomain: "meal-planner-app-35d67.firebaseapp.com",
  projectId: "meal-planner-app-35d67",
  storageBucket: "meal-planner-app-35d67.appspot.com",
  messagingSenderId: "1004564652754",
  appId: "1:1004564652754:web:f5aaba3c765c0f07be030b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);