import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-rM_gE33XSgD002OlFmBSFhbaXUkuexY",
  authDomain: "fi-uber-auth.firebaseapp.com",
  projectId: "fi-uber-auth",
  storageBucket: "fi-uber-auth.appspot.com",
  messagingSenderId: "82078037515",
  appId: "1:82078037515:web:897d1fda4499bccfddf90e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider}

// import * as firebase from "firebase";

// const firebaseConfig = {
//   apiKey: "AIzaSyD-rM_gE33XSgD002OlFmBSFhbaXUkuexY",
//   authDomain: "fi-uber-auth.firebaseapp.com",
//   projectId: "fi-uber-auth",
//   storageBucket: "fi-uber-auth.appspot.com",
//   messagingSenderId: "82078037515",
//   appId: "1:82078037515:web:897d1fda4499bccfddf90e"
// };


// let app;
// if(firebase.apps.length === 0){
//   app = firebase.initializeApp(firebaseConfig);
// } else {
//   app = firebase.app()
// }

// const auth = firebase.auth()

// export { auth }