import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA71PeE-4kddq04j177E7e6Rpx8wDuMM1w",
  authDomain: "upload-image-project-8bae6.firebaseapp.com",
  projectId: "upload-image-project-8bae6",
  storageBucket: "upload-image-project-8bae6.appspot.com",
  messagingSenderId: "593976536823",
  appId: "1:593976536823:web:faf0c12ee3724e9392edf2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
