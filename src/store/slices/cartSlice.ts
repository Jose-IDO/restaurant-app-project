import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  foodItemId: string;
  foodItemTitle: string;
  foodItemImage: string;
  price: number;
  quantity: number;
  selectedExtras: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const calculateTotals = (items: CartItem[], deliveryFee: number = 25) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const extrasTotal = item.selectedExtras.reduce((extrasSum, extra) => extrasSum + extra.price, 0) * item.quantity;
    return sum + itemTotal + extrasTotal;
  }, 0);
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
};

const initialState: CartState = {
  items: [],
  ...calculateTotals([], 25),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        item => item.foodItemId === action.payload.foodItemId &&
        JSON.stringify(item.selectedExtras) === JSON.stringify(action.payload.selectedExtras) &&
        item.specialInstructions === action.payload.specialInstructions
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items, state.deliveryFee);
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(state.items, state.deliveryFee);
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        const totals = calculateTotals(state.items, state.deliveryFee);
        state.subtotal = totals.subtotal;
        state.total = totals.total;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.total = state.deliveryFee;
    },
    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
      const totals = calculateTotals(state.items, action.payload);
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setDeliveryFee } = cartSlice.actions;
export default cartSlice.reducer;

