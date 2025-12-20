import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface ProfileScreenProps {
  navigation?: any;
  isLoggedIn?: boolean;
  onLoginPress?: () => void;
}

export default function ProfileScreen({ navigation, isLoggedIn = false, onLoginPress }: ProfileScreenProps) {
  if (!isLoggedIn) {
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
              label="Login / Sign Up"
              onPress={() => {
                if (onLoginPress) {
                  onLoginPress();
                } else if (navigation) {
                  navigation.navigate("Login");
                }
              }}
            />
          </View>
          <View style={{ width: "70%", marginTop: 12 }}>
            <Pressable
              onPress={() => navigation?.navigate("AdminLogin")}
              style={{
                paddingVertical: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                alignItems: "center",
              }}
            >
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Admin Login</Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    );
  }

  // Logged in profile view will be added later
  return (
    <Screen>
      <Text style={{ color: NG.c.text, fontSize: 22, fontWeight: "900" }}>Profile</Text>
      <Text style={{ color: NG.c.muted, marginTop: 10 }}>Logged in user profile (to be implemented)</Text>
    </Screen>
  );
}

