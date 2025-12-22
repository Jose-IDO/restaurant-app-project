import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodItem } from '../../types';

interface FoodState {
  items: FoodItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FoodState = {
  items: [],
  isLoading: false,
  error: null,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFoodItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addFoodItem: (state, action: PayloadAction<FoodItem>) => {
      state.items.push(action.payload);
    },
    updateFoodItem: (state, action: PayloadAction<FoodItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
    deleteFoodItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setFoodItems, addFoodItem, updateFoodItem, deleteFoodItem, setError } = foodSlice.actions;
export default foodSlice.reducer;

