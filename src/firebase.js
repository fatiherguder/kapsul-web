import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
const firebaseConfig = {
  apiKey: "AIzaSyBFNjKeJtaEstRP7_ssekPYA_9qRjfeYDM",
  authDomain: "kapsul-15d69.firebaseapp.com",
  projectId: "kapsul-15d69",
  storageBucket: "kapsul-15d69.appspot.com",
  messagingSenderId: "1052518641134",
  appId: "1:1052518641134:web:abb2e881303838cddfb2ff"
};

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();

  
  export {storage, firebase as default};