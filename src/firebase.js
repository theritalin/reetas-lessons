const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC9l6Xff33j5plpMTCSpUSqEj2YgqRBA3Y",
  authDomain: "reetas-lesson.firebaseapp.com",
  projectId: "reetas-lesson",
  storageBucket: "reetas-lesson.appspot.com",
  messagingSenderId: "1038938267062",
  appId: "1:1038938267062:web:9df816e73ce56eceed7517",
  measurementId: "G-K2J3EH0QHW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(`Db: ${db}`);
module.exports = db;
