import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-rM_gE33XSgD002OlFmBSFhbaXUkuexY",
  authDomain: "fi-uber-auth.firebaseapp.com",
  projectId: "fi-uber-auth",
  storageBucket: "fi-uber-auth.appspot.com",
  messagingSenderId: "82078037515",
  appId: "1:82078037515:web:897d1fda4499bccfddf90e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export {auth}
