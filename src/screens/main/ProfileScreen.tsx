import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";
import ProfileLoggedInScreen from "./ProfileLoggedInScreen";

interface ProfileScreenProps {
  navigation?: any;
  isLoggedIn?: boolean;
  onLoginPress?: () => void;
}

export default function ProfileScreen({ navigation, isLoggedIn, onLoginPress }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userProfile } = useAppSelector(state => state.auth);
  const isUserLoggedIn = isLoggedIn !== undefined ? isLoggedIn : isAuthenticated;

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      // Even if logout fails, clear local state
      dispatch(logout());
    }
  };

  if (!isUserLoggedIn) {
    return (
      <Screen>
        <Pressable onPress={() => navigation?.goBack()}>
          <View style={{ width: 40, height: 40, justifyContent: "center" }}>
            <Feather name="arrow-left" size={24} color={NG.c.text} />
          </View>
        </Pressable>

        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
          Profile
        </Text>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Feather name="user" size={58} color="rgba(237,237,237,0.65)" />
          <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 18, marginTop: 14 }}>
            Please Login
          </Text>

          <View style={{ width: "70%", marginTop: 18 }}>
            <PrimaryButton
              label="Login / Sign up"
              onPress={() => {
                if (onLoginPress) {
                  onLoginPress();
                } else if (navigation) {
                  navigation.navigate("Login");
                }
              }}
            />
          </View>
          <Text style={{ color: NG.c.muted, fontSize: 12, marginTop: 14, textAlign: "center" }}>
            Sign in to place orders and view history. Use the credentials in the README to access the admin dashboard.
          </Text>
        </View>
      </Screen>
    );
  }

  // Show logged in profile
  return (
    <ProfileLoggedInScreen
      navigation={navigation}
      user={userProfile ? {
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        address: userProfile.address ? 
          `${userProfile.address.street}, ${userProfile.address.city}, ${userProfile.address.zip}` : 
          undefined,
      } : undefined}
      onLogout={handleLogout}
    />
  );
}

