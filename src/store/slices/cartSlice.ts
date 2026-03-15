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
  selectedSides?: Array<{ id: string; name: string }>;
  selectedDrink?: { id: string; name: string; price: number };
  removedIngredients?: string[];
  addedIngredients?: string[];
  category?: string;
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
    const drinkTotal = (item.selectedDrink?.price ?? 0) * item.quantity;
    return sum + itemTotal + extrasTotal + drinkTotal;
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
      const p = action.payload;
      const existingItemIndex = state.items.findIndex(
        item =>
          item.foodItemId === p.foodItemId &&
          JSON.stringify(item.selectedExtras) === JSON.stringify(p.selectedExtras) &&
          item.specialInstructions === p.specialInstructions &&
          JSON.stringify(item.selectedSides ?? []) === JSON.stringify(p.selectedSides ?? []) &&
          (item.selectedDrink?.id ?? null) === (p.selectedDrink?.id ?? null) &&
          JSON.stringify(item.removedIngredients ?? []) === JSON.stringify(p.removedIngredients ?? []) &&
          JSON.stringify(item.addedIngredients ?? []) === JSON.stringify(p.addedIngredients ?? [])
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += p.quantity;
      } else {
        state.items.push(p);
      }

      const totals = calculateTotals(state.items, state.deliveryFee);
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },
    updateCartItem: (state, action: PayloadAction<{ id: string; updates: Partial<CartItem> }>) => {
      const { id, updates } = action.payload;
      const idx = state.items.findIndex(i => i.id === id);
      if (idx >= 0 && updates) {
        state.items[idx] = { ...state.items[idx], ...updates };
        const totals = calculateTotals(state.items, state.deliveryFee);
        state.subtotal = totals.subtotal;
        state.total = totals.total;
      }
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

export const { addToCart, removeFromCart, updateQuantity, updateCartItem, clearCart, setDeliveryFee } = cartSlice.actions;
export default cartSlice.reducer;

