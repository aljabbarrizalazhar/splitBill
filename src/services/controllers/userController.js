import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const addUser = async (userId, name, email) => {
    await setDoc(doc(db, 'users', userId), {
      name,
      email,
    });
  };