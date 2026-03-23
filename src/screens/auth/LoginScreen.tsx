import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, Input, PasswordInput, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading, setUser, setUserProfile, setError } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";
import { sessionActivityService } from "../../services/sessionActivityService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import type { RootStackParamList } from "../../navigation/AppNavigator";

interface LoginScreenProps {
  navigation?: any;
  onLogin?: (email: string, password: string) => void;
  onNavigateToSignup?: () => void;
}

export default function LoginScreen({ navigation, onLogin, onNavigateToSignup }: LoginScreenProps) {
  const route = useRoute<RouteProp<RootStackParamList, "Login">>();
  const returnTo = route.params?.returnTo;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleSubmit = async () => {
    if (!email || !password) {
      dispatch(setError("Please enter email and password"));
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const user = await authService.login(email, password);
      await sessionActivityService.recordActivity();
      dispatch(setUser(user));

      const profile = await authService.getUserProfile(user.uid);
      if (profile) {
        dispatch(setUserProfile(profile));
      }

      if (profile?.isAdmin) {
        navigation?.navigate("AdminMain");
      } else if (returnTo === "Checkout") {
        navigation?.navigate("Checkout");
      } else {
        navigation?.navigate("Main");
      }
    } catch (error: any) {
      dispatch(setError(error.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 48 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => navigation?.goBack()}>
            <View style={{ width: 40, height: 40, justifyContent: "center" }}>
              <Feather name="arrow-left" size={24} color={NG.c.text} />
            </View>
          </Pressable>

          <TitleLogo subtitle="Exquisite Dining Experience" />

          <View style={{ height: 18 }} />

          <View
            style={{
              flexDirection: "row",
              backgroundColor: NG.c.panel2,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: NG.c.stroke,
              padding: 4,
            }}
          >
            <Pressable
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
                  navigation.navigate("Register", returnTo ? { returnTo } : undefined);
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
          <PasswordInput placeholder="Password" value={password} onChangeText={setPassword} />

          {error && (
            <View style={{ marginTop: 12 }}>
              <ErrorMessage message={error} onDismiss={() => dispatch(setError(null))} />
            </View>
          )}

          <View style={{ marginTop: 18 }}>
            <PrimaryButton label={isLoading ? "Logging in..." : "Login"} onPress={handleSubmit} disabled={isLoading} />
          </View>
          {isLoading && <LoadingSpinner message="Logging in..." />}

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
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
