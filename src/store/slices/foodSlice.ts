import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodItem, FoodCategory } from '../../types';

interface FoodState {
  items: FoodItem[];
  categories: FoodCategory[];
  selectedCategory: FoodCategory | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FoodState = {
  items: [],
  categories: ['Starters', 'Mains', 'Burgers', 'Dessert', 'Beverages', 'Alcohols'],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setFoodItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<FoodCategory | null>) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addFoodItem: (state, action: PayloadAction<FoodItem>) => {
      state.items.push(action.payload);
    },
    updateFoodItem: (state, action: PayloadAction<FoodItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteFoodItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { 
  setFoodItems, 
  setSelectedCategory, 
  setLoading, 
  setError,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = foodSlice.actions;
export default foodSlice.reducer;

