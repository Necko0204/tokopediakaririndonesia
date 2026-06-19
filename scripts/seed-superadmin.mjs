import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (Object.values(firebaseConfig).some((value) => !value || value.startsWith("your_"))) {
  throw new Error("Firebase environment variables are missing. Check your .env file.");
}

const superAdmin = {
  id: "a0",
  name: "Super Admin",
  code: "000001",
  registrations: 0,
  todayDeposits: 0,
  monthDeposits: 0,
  todayWithdrawals: 0,
  monthWithdrawals: 0,
  username: "superadmin",
  password: "super123",
  role: "super_admin",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ref = doc(db, "admins", superAdmin.id);
const existing = await getDoc(ref);

if (existing.exists()) {
  console.log("Super admin already exists at admins/a0. No changes made.");
} else {
  await setDoc(ref, superAdmin);
  console.log("Super admin created at admins/a0.");
}
