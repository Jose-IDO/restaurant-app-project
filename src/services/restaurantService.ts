import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { RestaurantInfo } from '../types';

const RESTAURANT_INFO_ID = 'restaurant-info';

export const restaurantService = {
  async getRestaurantInfo(): Promise<RestaurantInfo | null> {
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
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `restaurant-assets/${filename}`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload image');
    }
  },
};

