import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from './src/store';
import { setUser, setUserProfile, setLoading } from './src/store/slices/authSlice';
import { auth } from './src/config/firebase';
import { authService } from './src/services/authService';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser(user));
        try {
          const profile = await authService.getUserProfile(user.uid);
          if (profile) {
            dispatch(setUserProfile(profile));
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      } else {
        dispatch(setUser(null));
        dispatch(setUserProfile(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppNavigator />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
