import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Firebase Storage 추가

const firebaseConfig = {
    apiKey: "AIzaSyDGCoRSq1X7ZXiDn-vdsA9dgsNfPjiBaxA",
    authDomain: "lidge-d70e4.firebaseapp.com",
    projectId: "lidge-d70e4",
    storageBucket: "lidge-d70e4.appspot.com",
    messagingSenderId: "201160863342",
    appId: "1:201160863342:web:c0c62b53a6ff7fe8bf007f",
    measurementId: "G-CK6J6DHVWR"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);