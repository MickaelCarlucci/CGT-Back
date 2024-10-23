import admin from 'firebase-admin';

const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Corrige le formatage des sauts de ligne
  }),
  databaseURL: process.env.NEXT_URL
};

admin.initializeApp(firebaseConfig);

export default admin;
