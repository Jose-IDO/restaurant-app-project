import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { sessionActivityService } from './sessionActivityService';
import { UserProfile } from '../store/slices/authSlice';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<User> {
    if (!auth || !db) throw new Error('App not configured. Add Firebase env vars in Expo EAS → Project → Environment variables (preview/production), then rebuild.');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
        isAdmin: false,
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  async login(email: string, password: string): Promise<User> {
    if (!auth) throw new Error('App not configured. Add Firebase env vars in Expo EAS → Project → Environment variables (preview/production), then rebuild.');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async logout(): Promise<void> {
    if (!auth) return;
    try {
      await sessionActivityService.clearActivity();
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (!db) throw new Error('App not configured.');
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  async checkAdminStatus(uid: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(uid);
      return profile?.isAdmin || false;
    } catch (error) {
      return false;
    }
  },
};

