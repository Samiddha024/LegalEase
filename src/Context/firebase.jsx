import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp ,getDocs} from 'firebase/firestore'; // Correct imports for Firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Correct import for getDownloadURL

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const FirebaseAuth = getAuth(app);

const storage = getStorage(app);
const db = getFirestore(app); // Correct Firestore initialization
export const FirebaseContext = createContext(null);

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = (props) => {
  const [User, setUser] = useState(null);

  const signupUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(FirebaseAuth, email, password);
  };

  const loginUserWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(FirebaseAuth, email, password);
  };

  const getCurrentUser = () => {
    return User;
  };

  const SignOut = async () => {
    await signOut(FirebaseAuth);
    setUser(null); // Update current user state to null after signing out
  };

  const uploadDocuments = async (file) => {
    const currentUser = FirebaseAuth.currentUser; // Get the current user
  
    if (!currentUser) {
      console.error("No user is logged in");
      return;
    }
  
    const userId = currentUser.uid; // Get user ID
    const storageRef = ref(storage, `documents/${userId}/${file.name}`); // Create a unique path for the file in storage
  
    try {
      console.log("Uploading document:", file.name);
      
      // Upload the document to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Document uploaded, fetching URL...");
  
      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Store document metadata in Firestore
      const docRef = await addDoc(collection(db, "users", userId, "documents"), {
        fileName: file.name,
        downloadURL: downloadURL,
        uploadedAt: serverTimestamp(), // Store the upload timestamp
      });
  
      console.log("Document uploaded successfully:", docRef.id);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };
  

  const fetchingDocuments = async () => {
    const currentUser = FirebaseAuth.currentUser; // Get the current user
    
    if (!currentUser) {
      console.error("No user is logged in");
      return;
    }
  
    const userId = currentUser.uid; // Get user ID
    //console.log(userId);
  
    try {
      const docsCollectionRef = collection(db, 'users', userId, 'documents'); // Reference to user's documents subcollection
      const docsSnapshot = await getDocs(docsCollectionRef); // Fetch all documents in the collection
  
      const documents = docsSnapshot.docs.map(doc => ({
        id: doc.id,  // Document ID
        ...doc.data() // Spread the document data
      }));
  
      console.log("Fetched documents:", documents);
      return documents; // Return the fetched documents array
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  


  // const uploadDocuments=(doc)=>{
  //   const docRef =  ref(storage,`iamges`);
  //   uploadBytes(docRef, doc).then(()=>{
  //     alert("Document uploaded successfully");
  //   })
  // }
  useEffect(() => {
    const subscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      setUser(user); // Update current user state
    });

    // Clean up the listener on unmount
    return () => subscribe(); // Call subscribe to unsubscribe
  }, []);

  return (
    <FirebaseContext.Provider value={{ loginUserWithEmailAndPassword, signupUserWithEmailAndPassword, getCurrentUser, SignOut, uploadDocuments,fetchingDocuments }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
