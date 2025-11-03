import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import toast from "react-hot-toast";

// Firebase configuration - replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAWx5AgqPA3M3QwAMDlRza22Vzm6oQfW1U",
  authDomain: "ecommerce-300ff.firebaseapp.com",
  projectId: "ecommerce-300ff",
  storageBucket: "ecommerce-300ff.firebasestorage.app",
  messagingSenderId: "508783268387",
  appId: "1:508783268387:web:f1e5d959d6a47e1be39796"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection reference
const USERS_COLLECTION = 'users';

const fetchAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    toast.error("Error fetching users: " + error.message);
    throw error;
  }
};

export const getUsers = async () => {
  return await fetchAllUsers();
};

export const getUserById = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    toast.error("Error fetching user: " + error.message);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    toast.error("Error fetching user by email: " + error.message);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    // Check if email already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      toast.error('Email already exists');
      return;
    }

    const userId = crypto.randomUUID();
    const newUser = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      phone: userData.phone || '',
      address: userData.address || '',
      orders: userData.orders || [],
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, USERS_COLLECTION, userId), newUser);

    return { id: userId, ...newUser };
  } catch (error) {
    toast.error('Error adding user: ' + error.message);
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const userDoc = await getUserById(userId);
    if (!userDoc) {
      toast.error('User not found');
      return;
    }

    // Check if email is being updated and if it already exists
    if (updates.email && updates.email !== userDoc.email) {
      const emailExists = await getUserByEmail(updates.email);
      if (emailExists) {
        toast.error('Email already exists');
        return;
      }
    }

    const updatedData = {
      ...userDoc,
      ...updates,
    };

    await setDoc(doc(db, USERS_COLLECTION, userId), updatedData);
    return { id: userId, ...updatedData };
  } catch (error) {
    toast.error('Error updating user: ' + error.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const userDoc = await getUserById(userId);
    if (!userDoc) {
      toast.error('User not found');
      return;
    }

    await deleteDoc(doc(db, USERS_COLLECTION, userId));
    return true;
  } catch (error) {
    toast.error('Error deleting user: ' + error.message);
    throw error;
  }
};

export const addCartOrdersToUser = async (userId, cartItems, itemsList = '') => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      toast.error('User not found');
      return;
    }

    const orderItems = cartItems.map(item => ({
      displayString: itemsList,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      name: item.name,
      timestamp: new Date().toISOString()
    }));
    const updatedOrders = [...(user.orders || []), ...orderItems];
    await setDoc(doc(db, USERS_COLLECTION, userId), {
      ...user,
      orders: updatedOrders
    });

    return { ...user, orders: updatedOrders };
  } catch (error) {
    toast.error('Error adding cart orders: ' + error.message);
    throw error;
  }
};

export const addOrderToUser = async (userId, order) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      toast.error('User not found');
      return;
    }

    const newOrder = {
      orderId: Date.now(),
      productId: order.productId,
      quantity: order.quantity,
      price: order.price,
      total: order.total,
      date: new Date().toISOString(),
      ...order
    };

    const updatedOrders = [...(user.orders || []), newOrder];

    await setDoc(doc(db, USERS_COLLECTION, userId), {
      ...user,
      orders: updatedOrders
    });

    return { ...user, orders: updatedOrders };
  } catch (error) {
    toast.error('Error adding order: ' + error.message);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  const user = await getUserById(userId);
  return user ? user.orders || [] : [];
};



export const loginUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      toast.error('Invalid email or password');
      return;
    }

    const { password: _, confirmPassword: __, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    toast.error('Error logging in: ' + error.message);
    throw error;
  }
};