import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { FoodItem, FoodCategory } from '../types';

export const foodService = {
  // Get all food items
  async getAllFoodItems(): Promise<FoodItem[]> {
    try {
      const foodCollection = collection(db, 'foodItems');
      const snapshot = await getDocs(foodCollection);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodItem));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch food items');
    }
  },

  // Get food items by category
  async getFoodItemsByCategory(category: FoodCategory): Promise<FoodItem[]> {
    try {
      const foodCollection = collection(db, 'foodItems');
      const q = query(foodCollection, where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodItem));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch food items by category');
    }
  },

  // Get single food item
  async getFoodItemById(id: string): Promise<FoodItem | null> {
    try {
      const foodDoc = await getDoc(doc(db, 'foodItems', id));
      if (!foodDoc.exists()) return null;
      return { id: foodDoc.id, ...foodDoc.data() } as FoodItem;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch food item');
    }
  },

  // Add food item (admin only)
  async addFoodItem(foodItem: Omit<FoodItem, 'id'>, imageUri?: string): Promise<string> {
    try {
      let imageUrl = foodItem.image;

      // Upload image if provided
      if (imageUri) {
        const imageRef = ref(storage, `foodItems/${Date.now()}_${foodItem.name}`);
        // Note: In React Native, you'll need to convert the URI to a blob
        // This is a simplified version
        imageUrl = await getDownloadURL(imageRef);
      }

      const foodData = {
        ...foodItem,
        image: imageUrl,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'foodItems'), foodData);
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add food item');
    }
  },

  // Update food item (admin only)
  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'foodItems', id), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update food item');
    }
  },

  // Delete food item (admin only)
  async deleteFoodItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'foodItems', id));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete food item');
    }
  },
};

