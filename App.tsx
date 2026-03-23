import 'react-native-gesture-handler';
import React, { useEffect, Component } from 'react';
import { View, Text, StyleSheet, Platform, AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { store } from './src/store';
import { setUser, setUserProfile, setLoading } from './src/store/slices/authSlice';
import { auth } from './src/config/firebase';
import { authService } from './src/services/authService';
import { sessionActivityService } from './src/services/sessionActivityService';
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
    if (Platform.OS === 'android') {
      try {
        const NavigationBar = require('expo-navigation-bar');
        NavigationBar.setVisibilityAsync('hidden').catch(() => {});
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      dispatch(setLoading(false));
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const inactiveTooLong = await sessionActivityService.isInactiveBeyondThreshold();
        if (inactiveTooLong) {
          await sessionActivityService.clearActivity();
          await signOut(auth);
          dispatch(setLoading(false));
          return;
        }
        await sessionActivityService.recordActivity();
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
  }, [dispatch]);

  /** Reset inactivity timer whenever the app becomes active while logged in. */
  useEffect(() => {
    const sub = (state: AppStateStatus) => {
      if (state === 'active' && auth?.currentUser) {
        sessionActivityService.recordActivity();
      }
    };
    const subscription = AppState.addEventListener('change', sub);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <AppNavigator />
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
