// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb59FVNBmHXFtdbKEzaG3b4lz-EtUZcrI",
  authDomain: "constructn-web-staging.firebaseapp.com",
  projectId: "constructn-web-staging",
  storageBucket: "constructn-web-staging.appspot.com",
  messagingSenderId: "220339342182",
  appId: "1:220339342182:web:b2a8065c3101dfa8ee96a7",
  measurementId: "G-DDHNPY68NG"
};

// Initialize Firebase
export const firebaseapp = initializeApp(firebaseConfig);