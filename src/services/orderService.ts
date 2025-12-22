import { collection, getDocs, doc, setDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, OrderStatus } from '../types';

export const orderService = {
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const newOrder: Omit<Order, 'id'> = {
        ...order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = doc(collection(db, 'orders'));
      await setDoc(docRef, newOrder);

      return { id: docRef.id, ...newOrder };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create order');
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await docRef.get();
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch order');
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update order status');
    }
  },
};

