import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, CartItem, Address, CardDetails } from '../types';

export const orderService = {
  // Create new order
  async createOrder(
    userId: string,
    userDetails: {
      name: string;
      surname: string;
      contactNumber: string;
      address: Address;
    },
    items: CartItem[],
    deliveryAddress: Address,
    cardDetails: CardDetails
  ): Promise<string> {
    try {
      const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

      const orderData: Omit<Order, 'id'> = {
        userId,
        userDetails,
        items,
        total,
        deliveryAddress,
        cardDetails,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create order');
    }
  },

  // Get user orders
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const ordersCollection = collection(db, 'orders');
      const q = query(
        ordersCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Order));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  // Get all orders (admin only)
  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersCollection = collection(db, 'orders');
      const q = query(ordersCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Order));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  // Get single order
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (!orderDoc.exists()) return null;
      return {
        id: orderDoc.id,
        ...orderDoc.data(),
        createdAt: orderDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: orderDoc.data().updatedAt?.toDate() || new Date(),
      } as Order;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch order');
    }
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update order status');
    }
  },
};

