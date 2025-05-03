
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7hryn5uh9U6dIUOKswVrWRGIt38ZpfME",
  authDomain: "arco-v1.firebaseapp.com",
  projectId: "arco-v1",
  storageBucket: "arco-v1.applestorage.googleapis.com",
  messagingSenderId: "17097328210",
  appId: "1:17097328210:web:45bc7f61fc02b843e5018b",
  measurementId: "G-55V01G13JT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Crea una nueva instancia del proveedor de Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Crea la instancia de autenticación
export const auth = getAuth(app);
export default app;
