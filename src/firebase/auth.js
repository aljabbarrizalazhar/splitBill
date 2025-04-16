import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider  } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig";

export const doCreateUser = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; 
    await updateProfile(user, { displayName: name }).catch((error) => {
        console.log('Error updating profile:', error.message);
    });

    return userCredential;
};

export const updateUserName = async (name, uid) => {
    try {
      const userDocRef = doc(db, "users", uid);

      await updateDoc(userDocRef, {
        name: name, 
      });
  
      const user = auth.currentUser;

      if (user && user.uid === uid) {
        await updateProfile(user, {
          displayName: name, 
        }).catch((error) => {
          console.error('Error updating displayName:', error.message);
        });
      }
    } catch (error) {
      console.error('Error updating user name:', error.message);
    }
  };

  export const changeUserPassword = async (uid, password, newPassword) => {
    try {
      const user = auth.currentUser;
      
      if (user && user.uid === uid) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        if (password === newPassword) {
          throw new Error('Password baru tidak boleh sama dengan password lama.');
        }
  
        await updatePassword(user, newPassword);
        console.log('Password berhasil diubah');
      } else {
        throw new Error('User tidak ditemukan atau tidak cocok.');
      }
    } catch (error) {
      console.error('Error updating password:', error.message);
      throw error;
    }
  };

export const doSignIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const { uid } = userCredential.user
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    await updateProfile(userCredential.user, {
        displayName: userDocSnap.data().name,
      }).catch((error) => {
        console.log('Error updating profile:', error.message);
    });
      console.log(userDocSnap.data().name)
    return userCredential;
};

export const doSignOut = () => {
    return auth.signOut();
}