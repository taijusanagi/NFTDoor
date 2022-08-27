import admin from "firebase-admin";

import { tableName } from "./common";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "nftdoor-193e9",
      clientEmail: "firebase-adminsdk-ocrbc@nftdoor-193e9.iam.gserviceaccount.com",
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
        : undefined,
    }),
  });
}

const firestore = admin.firestore();
export { firestore, tableName };
