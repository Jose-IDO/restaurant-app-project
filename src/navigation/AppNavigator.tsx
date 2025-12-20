import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { NG } from '../components/ui/noirGold.ui';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import FoodItemDetailScreen from '../screens/main/FoodItemDetailScreen';
import CartEmptyScreen from '../screens/main/CartEmptyScreen';
import CartWithItemsScreen from '../screens/main/CartWithItemsScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProfileLoggedInScreen from '../screens/main/ProfileLoggedInScreen';
import OrderPlacedModalScreen from '../screens/main/OrderPlacedModalScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  FoodItemDetail: { itemId: string };
  Cart: undefined;
  Checkout: undefined;
  Profile: undefined;
  OrderPlaced: undefined;
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

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0B0C0E',
        borderTopWidth: 1,
        borderTopColor: NG.c.stroke,
        paddingTop: 10,
        paddingBottom: 18,
        height: 70,
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
      component={CartEmptyScreen}
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

const AppNavigator = () => {
  // For now, default to not authenticated - will be connected to Redux later
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? "Main" : "Login"}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="FoodItemDetail" component={FoodItemDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderPlaced" component={OrderPlacedModalScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="FoodItemDetail" component={FoodItemDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderPlaced" component={OrderPlacedModalScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

