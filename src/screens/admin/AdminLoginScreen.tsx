import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, Input, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface AdminLoginScreenProps {
  navigation?: any;
  onLogin?: (email: string, password: string) => void;
}

export default function AdminLoginScreen({ navigation, onLogin }: AdminLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
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

        <TitleLogo subtitle="Admin Portal" />

        <View style={{ height: 18 }} />

        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, textAlign: "center", marginBottom: 20 }}>
          Admin Login
        </Text>

        <Input
          icon="mail"
          placeholder="Admin Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={{ marginBottom: 12 }} />
        <Input
          icon="lock"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={{ marginTop: 18 }}>
          <PrimaryButton label="Login" icon="lock" onPress={handleLogin} />
        </View>
      </ScrollView>
    </Screen>
  );
}

