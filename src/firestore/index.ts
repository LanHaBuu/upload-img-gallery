import { db } from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

const create = async (data: any) => {
  const docRef = await addDoc(collection(db, "images"), {
    ...data,
    createdAt: new Date().getTime(),
  });

  return docRef;
};

const getAll = async () => {
  try {
    const q = query(collection(db, "images"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

export const fsImage = {
  create,
  getAll,
};
