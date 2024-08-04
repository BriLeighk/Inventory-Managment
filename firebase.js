// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4J-ycGpohyyWIWe8gvtuO4d31GL5NgeQ",
  authDomain: "inventory-management-e7778.firebaseapp.com",
  projectId: "inventory-management-e7778",
  storageBucket: "inventory-management-e7778.appspot.com",
  messagingSenderId: "691870478635",
  appId: "1:691870478635:web:034e7dad8b58765ee8156e",
  measurementId: "G-5ZFR7W1VKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Check if the code is running in a browser environment
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics();
      // ... initialize analytics ...
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}

export {firestore}
