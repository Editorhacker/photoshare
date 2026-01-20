import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY ,
  authDomain: import.meta.env.VITE_AUTHDOMAIN, //"YOUR_PROJECT.firebaseapp.com"
  projectId: import.meta.env.VITE_PROJECTID ,//"YOUR_PROJECT_ID"
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_SENDERID,
  appId: import.meta.env.VITE_APPID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
