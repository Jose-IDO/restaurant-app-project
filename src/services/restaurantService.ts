import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { imageStorageService } from './imageStorageService';
import { RestaurantInfo } from '../types';

const RESTAURANT_INFO_ID = 'restaurant-info';

export const restaurantService = {
  async getRestaurantInfo(): Promise<RestaurantInfo | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, 'restaurantInfo', RESTAURANT_INFO_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as RestaurantInfo;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch restaurant info');
    }
  },

  async updateRestaurantInfo(updates: Partial<RestaurantInfo>): Promise<void> {
    if (!db) throw new Error('App not configured.');
    try {
      const docRef = doc(db, 'restaurantInfo', RESTAURANT_INFO_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date(),
        });
      } else {
        await setDoc(docRef, {
          id: RESTAURANT_INFO_ID,
          ...updates,
          updatedAt: new Date(),
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update restaurant info');
    }
  },

  async uploadRestaurantImage(uri: string, filename: string): Promise<string> {
    return imageStorageService.uploadImage(uri, `restaurant_${filename}`);
  },
};

