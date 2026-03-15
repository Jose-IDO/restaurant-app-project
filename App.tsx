import 'react-native-gesture-handler';
import React, { useEffect, Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from './src/store';
import { setUser, setUserProfile, setLoading } from './src/store/slices/authSlice';
import { auth } from './src/config/firebase';
import { authService } from './src/services/authService';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>Please close and reopen the app.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser(user));
        try {
          const profile = await authService.getUserProfile(user.uid);
          if (profile) dispatch(setUserProfile(profile));
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
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0C0E',
    padding: 24,
  },
  errorTitle: { color: '#EDEDED', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  errorText: { color: 'rgba(237,237,237,0.7)', fontSize: 14 },
});
