import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, Address, CardDetails } from '../types';

export const authService = {
  // Register new user
  async register(
    email: string,
    password: string,
    name: string,
    surname: string,
    contactNumber: string,
    address: Address,
    cardDetails: CardDetails
  ): Promise<User> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: `${name} ${surname}` });

      // Create user document in Firestore
      const userData: User = {
        uid: firebaseUser.uid,
        email: email,
        name,
        surname,
        contactNumber,
        address,
        cardDetails: [cardDetails],
        isAdmin: false,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user data');
    }
  },

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  // Add card details
  async addCard(cardDetails: CardDetails): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('User not authenticated');

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) throw new Error('User not found');

      const userData = userDoc.data() as User;
      const cards = userData.cardDetails || [];
      
      // If this is the first card or marked as default, set it as default
      if (cards.length === 0 || cardDetails.isDefault) {
        cards.forEach(card => card.isDefault = false);
        cardDetails.isDefault = true;
      }

      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        cardDetails: [...cards, cardDetails],
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add card');
    }
  },
};

