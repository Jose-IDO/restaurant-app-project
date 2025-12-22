import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { FoodItem } from '../types';

export const foodService = {
  async getAllFoodItems(): Promise<FoodItem[]> {
    try {
      const q = query(collection(db, 'foodItems'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FoodItem[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch food items');
    }
  },

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    try {
      const docRef = doc(db, 'foodItems', id);
      const docSnap = await docRef.get();
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FoodItem;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch food item');
    }
  },

  async createFoodItem(item: Omit<FoodItem, 'id'>, imageUri?: string): Promise<FoodItem> {
    try {
      let imageUrl = item.img;

      // Upload image if provided
      if (imageUri) {
        imageUrl = await this.uploadFoodImage(imageUri, `food_${Date.now()}`);
      }

      const newItem: Omit<FoodItem, 'id'> = {
        ...item,
        img: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = doc(collection(db, 'foodItems'));
      await setDoc(docRef, newItem);

      return { id: docRef.id, ...newItem };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create food item');
    }
  },

  async updateFoodItem(id: string, updates: Partial<FoodItem>, imageUri?: string): Promise<void> {
    try {
      const updateData: any = {
        ...updates,
        updatedAt: new Date(),
      };

      // Upload new image if provided
      if (imageUri) {
        updateData.img = await this.uploadFoodImage(imageUri, `food_${id}_${Date.now()}`);
      }

      const docRef = doc(db, 'foodItems', id);
      await updateDoc(docRef, updateData);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update food item');
    }
  },

  async deleteFoodItem(id: string, imageUrl?: string): Promise<void> {
    try {
      // Delete image from storage if exists
      if (imageUrl) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Failed to delete image from storage:', error);
        }
      }

      const docRef = doc(db, 'foodItems', id);
      await deleteDoc(docRef);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete food item');
    }
  },

  async uploadFoodImage(uri: string, filename: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `food-images/${filename}`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload image');
    }
  },
};

