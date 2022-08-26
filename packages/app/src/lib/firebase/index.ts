import { getApps, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtynt3MEKh1l3R-ZimdHeX1rqC0X2YDnw",
  authDomain: "nftdoor-193e9.firebaseapp.com",
  projectId: "nftdoor-193e9",
  storageBucket: "nftdoor-193e9.appspot.com",
  messagingSenderId: "499623123743",
  appId: "1:499623123743:web:66af94b38040654168ae2a",
  measurementId: "G-6X609FPE1W",
};

let app;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
}
const firestore = getFirestore(app);
const storage = getStorage(app);

if (typeof window !== "undefined") {
  if (process.env.NODE_ENV !== "production") {
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
  }
}

export { firestore, storage };
