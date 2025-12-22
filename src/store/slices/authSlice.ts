import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload;
      state.isAdmin = action.payload?.isAdmin || false;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.userProfile = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
    },
  },
});

export const { setLoading, setUser, setUserProfile, setError, logout } = authSlice.actions;
export default authSlice.reducer;

