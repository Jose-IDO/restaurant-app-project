import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, Input, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface LoginScreenProps {
  navigation?: any;
  onLogin?: (email: string, password: string) => void;
  onNavigateToSignup?: () => void;
}

export default function LoginScreen({ navigation, onLogin, onNavigateToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (onLogin) {
      onLogin(email, password);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable onPress={() => navigation?.goBack()}>
          <View style={{ width: 40, height: 40, justifyContent: "center" }}>
            <Feather name="arrow-left" size={24} color={NG.c.text} />
          </View>
        </Pressable>

        <TitleLogo subtitle="Exquisite Dining Experience" />

        <View style={{ height: 18 }} />

        {/* Segmented tabs */}
        <View style={{
          flexDirection: "row",
          backgroundColor: NG.c.panel2,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: NG.c.stroke,
          padding: 4,
        }}>
          <Pressable
            onPress={() => {
              // Already on Login, do nothing
            }}
            style={{
              flex: 1,
              backgroundColor: NG.c.gold,
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#151515", fontWeight: "900" }}>Login</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (onNavigateToSignup) {
                onNavigateToSignup();
              } else if (navigation) {
                navigation.navigate("Register");
              }
            }}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: NG.c.text, fontWeight: "900" }}>Sign Up</Text>
          </Pressable>
        </View>

        <View style={{ height: 14 }} />

        <Input
          icon="mail"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          icon="lock"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={{ marginTop: 18 }}>
          <PrimaryButton label="Login" onPress={handleSubmit} />
        </View>

        <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: NG.c.stroke }} />

        <Pressable
          style={{
            marginTop: 16,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: NG.c.stroke,
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Text style={{ color: NG.c.text, fontWeight: "900" }}>G</Text>
          <Text style={{ color: NG.c.text, fontWeight: "800" }}>Continue with Google</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation?.navigate("AdminMain")}
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: NG.c.muted, fontWeight: "700", fontSize: 14 }}>
            Admin
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

