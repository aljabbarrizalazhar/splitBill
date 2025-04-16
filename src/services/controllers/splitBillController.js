import { db } from '../../firebase/firebaseConfig';
import {
  addDoc,
  getDocs,
  updateDoc,
  setDoc,
  writeBatch,
  deleteDoc,
  collection,
  query,
  where,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

export const addSplitBill = async (splitBillData) => {
  try {
    const docRef = await addDoc(collection(db, 'splitBills'), {
      title: splitBillData.title,
      totalAmount: Number(splitBillData.totalAmount),
      splitMethod: splitBillData.splitMethod,
      createdBy: splitBillData.createdBy,
      payment: splitBillData.payment,
      createdAt: serverTimestamp(),
    });

    if (splitBillData.splitMethod !== 'Equal Split') {
      const membersCollectionRef = collection(
        db,
        'splitBills',
        docRef.id,
        'members'
      );

      const memberPromises = splitBillData.members.map((member) =>
        setDoc(doc(membersCollectionRef), member)
      );

      await Promise.all(memberPromises);
    } else {
      const splitBillRef = doc(db, 'splitBills', docRef.id);
      await updateDoc(splitBillRef, {
        amountToPay: splitBillData.amountToPay,
        member: splitBillData.member,
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding split bill: ', error);
    throw error;
  }
};

export const getSplitBillsByUserId = async (userId) => {
  try {
    const splitBillsRef = collection(db, 'splitBills');
    const q = query(splitBillsRef, where('createdBy', '==', userId));
    const querySnapshot = await getDocs(q);

    const splitBills = [];
    querySnapshot.forEach((doc) => {
      splitBills.push({ id: doc.id, ...doc.data() });
    });

    return splitBills;
  } catch (error) {
    console.error('Error getting split bills: ', error);
  }
};

export const getSplitBillById = async (splitBillId) => {
  try {
    const splitBillDocRef = doc(db, 'splitBills', splitBillId);

    const docSnapshot = await getDoc(splitBillDocRef);

    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting split bill by ID: ', error);
    throw error;
  }
};

export const createSplitBillMembers = async (
  splitBillId,
  SplitBillMethod,
  splitBillAmount,
  members
) => {
  try {
    const membersCollectionRef = collection(
      db,
      'splitBills',
      splitBillId,
      'members'
    );
    const batch = writeBatch(db);

    members.forEach((member) => {
      const memberDocRef = doc(membersCollectionRef);
      let formedMember = { name: member.name, amountToPay: 0, percentage: 0 };

      if (SplitBillMethod === 'Equal Split') {
        const amountToPay = splitBillAmount / members.length;
        formedMember = { ...formedMember, amountToPay };
      } else if (SplitBillMethod === 'Split by Percentage') {
        const amountToPay = (splitBillAmount * member.value) / 100;
        formedMember = {
          ...formedMember,
          amountToPay,
          percentage: member.value,
        };
      } else if (SplitBillMethod === 'Split by Order') {
        formedMember = { ...formedMember, amountToPay: member.value };
      }

      batch.set(memberDocRef, formedMember);
    });

    await batch.commit();

    console.log('Split bill and members created successfully');
  } catch (error) {
    console.error('Error creating split bill and members:', error);
  }
};

export const setSplitBillPayment = async (splitBillId, method, information) => {
  try {
    const splitBillRef = doc(db, 'splitBills', splitBillId);

    await updateDoc(splitBillRef, {
      payment: {
        method,
        information,
      },
    });
  } catch (error) {
    console.error('Error setting split bill payment:', error);
  }
};

export const getSplitBillWithMembersbyId = async (splitBillId) => {
  try {
    const splitBillDocRef = doc(db, 'splitBills', splitBillId);
    const splitBillDocSnapshot = await getDoc(splitBillDocRef);

    if (!splitBillDocSnapshot.exists()) {
      throw new Error('Split Bill tidak ditemukan');
    }

    const splitBillData = splitBillDocSnapshot.data();

    const membersCollectionRef = collection(
      db,
      'splitBills',
      splitBillId,
      'members'
    );
    const membersQuerySnapshot = await getDocs(membersCollectionRef);

    const members = [];
    membersQuerySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });

    const result = {
      ...splitBillData,
      members,
    };

    return result;
  } catch (error) {
    console.error('Error fetching split bill with members: ', error);
    throw error;
  }
};

export const deleteSubcollection = async (splitBillId) => {
  const membersRef = collection(db, 'splitBills', splitBillId, 'members');

  const membersSnapshot = await getDocs(membersRef);

  const deletePromises = membersSnapshot.docs.map((memberDoc) => {
    return deleteDoc(memberDoc.ref);
  });

  await Promise.all(deletePromises);
};

export const deleteSplitBill = async (splitBillId) => {
  try {
    await deleteSubcollection(splitBillId);

    const splitBillDocRef = doc(db, 'splitBills', splitBillId);
    await deleteDoc(splitBillDocRef);
  } catch (error) {
    console.error('Gagal menghapus split bill dan subkoleksinya:', error);
  }
};
