// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {getFirestore} = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "skipli-employee-management.firebaseapp.com",
  projectId: "skipli-employee-management",
  storageBucket: "skipli-employee-management.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
  app,
  db
};