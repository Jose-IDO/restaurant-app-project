import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NG } from '../components/ui/noirGold.ui';
import { useAppSelector } from '../store/hooks';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import FoodItemDetailScreen from '../screens/main/FoodItemDetailScreen';
import CartScreen from '../screens/main/CartScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProfileLoggedInScreen from '../screens/main/ProfileLoggedInScreen';
import OrderPlacedModalScreen from '../screens/main/OrderPlacedModalScreen';
import OrderHistoryScreen from '../screens/main/OrderHistoryScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import EditCartItemScreen from '../screens/main/EditCartItemScreen';

// Admin Screens (admin access only by logging in with admin credentials)
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminFoodManagementScreen from '../screens/admin/AdminFoodManagementScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import AdminRestaurantSettingsScreen from '../screens/admin/AdminRestaurantSettingsScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: { returnTo?: 'Checkout' } | undefined;
  Register: { returnTo?: 'Checkout' } | undefined;
  FoodItemDetail: { itemId: string };
  EditCartItem: { cartItemId: string };
  Cart: undefined;
  Checkout: undefined;
  Profile: undefined;
  OrderPlaced: undefined;
  OrderHistory: undefined;
  EditProfile: undefined;
  AdminMain: undefined;
  AdminRestaurantSettings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  AdminFood: undefined;
  AdminOrders: undefined;
  AdminAnalytics: undefined;
  AdminRestaurantSettings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const TAB_BAR_BASE_HEIGHT = 70;
const TAB_BAR_PADDING_BOTTOM = 18;

const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + bottomInset;
  const paddingBottom = TAB_BAR_PADDING_BOTTOM + bottomInset;

  return (
  <MainTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0B0C0E',
        borderTopWidth: 1,
        borderTopColor: NG.c.stroke,
        paddingTop: 10,
        paddingBottom,
        height: tabBarHeight,
      },
      tabBarActiveTintColor: NG.c.gold,
      tabBarInactiveTintColor: 'rgba(237,237,237,0.55)',
      tabBarLabelStyle: {
        fontWeight: '800',
        fontSize: 12,
      },
    }}
  >
    <MainTab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Menu',
        tabBarIcon: ({ color }) => <Feather name="coffee" size={18} color={color} />,
      }}
    />
    <MainTab.Screen
      name="Cart"
      component={CartScreen}
      options={{
        tabBarLabel: 'Cart',
        tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={18} color={color} />,
      }}
    />
    <MainTab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }) => <Feather name="user" size={18} color={color} />,
      }}
    />
  </MainTab.Navigator>
  );
};

const AdminNavigator = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + bottomInset;
  const paddingBottom = TAB_BAR_PADDING_BOTTOM + bottomInset;

  return (
  <AdminTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0B0C0E',
        borderTopWidth: 1,
        borderTopColor: NG.c.stroke,
        paddingTop: 10,
        paddingBottom,
        height: tabBarHeight,
      },
      tabBarActiveTintColor: NG.c.gold,
      tabBarInactiveTintColor: 'rgba(237,237,237,0.55)',
      tabBarLabelStyle: {
        fontWeight: '800',
        fontSize: 12,
      },
    }}
  >
    <AdminTab.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color }) => <Feather name="home" size={18} color={color} />,
      }}
    />
    <AdminTab.Screen
      name="AdminFood"
      component={AdminFoodManagementScreen}
      options={{
        tabBarLabel: 'Food',
        tabBarIcon: ({ color }) => <Feather name="coffee" size={18} color={color} />,
      }}
    />
    <AdminTab.Screen
      name="AdminOrders"
      component={AdminOrdersScreen}
      options={{
        tabBarLabel: 'Orders',
        tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={18} color={color} />,
      }}
    />
    <AdminTab.Screen
      name="AdminAnalytics"
      component={AdminAnalyticsScreen}
      options={{
        tabBarLabel: 'Analytics',
        tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={18} color={color} />,
      }}
    />
  </AdminTab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isAdmin } = useAppSelector(state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isAdmin: state.auth.isAdmin,
  }));

  // Guests start on Main (menu) and can browse; login required only to place order. Admin only via Login with admin credentials.
  const initialRoute = !isAuthenticated ? "Main" : isAdmin ? "AdminMain" : "Main";

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="FoodItemDetail" component={FoodItemDetailScreen} />
            <Stack.Screen name="EditCartItem" component={EditCartItemScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderPlaced" component={OrderPlacedModalScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        ) : isAdmin ? (
          <>
            <Stack.Screen name="AdminMain" component={AdminNavigator} />
            <Stack.Screen name="AdminRestaurantSettings" component={AdminRestaurantSettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="FoodItemDetail" component={FoodItemDetailScreen} />
            <Stack.Screen name="EditCartItem" component={EditCartItemScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderPlaced" component={OrderPlacedModalScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

