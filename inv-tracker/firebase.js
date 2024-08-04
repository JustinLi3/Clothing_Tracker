// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK_9LYoxCpgFabjM_a_dF4HPvpeMIwsbo",
  authDomain: "inv-tracker-4448a.firebaseapp.com",
  projectId: "inv-tracker-4448a",
  storageBucket: "inv-tracker-4448a.appspot.com",
  messagingSenderId: "949582339011",
  appId: "1:949582339011:web:01522a1818d0c59ccffb76",
  measurementId: "G-40654F7STC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore};