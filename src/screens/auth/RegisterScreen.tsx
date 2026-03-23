import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, Input, PasswordInput, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading, setUser, setUserProfile, setError } from "../../store/slices/authSlice";
import { authService, RegisterData as AuthRegisterData } from "../../services/authService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { sessionActivityService } from "../../services/sessionActivityService";
import type { RootStackParamList } from "../../navigation/AppNavigator";

interface RegisterScreenProps {
  navigation?: any;
  onRegister?: (data: RegisterData) => void;
  onNavigateToLogin?: () => void;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  cardLast4?: string;
  cardExpiry?: string;
}

export default function RegisterScreen({ navigation, onRegister, onNavigateToLogin }: RegisterScreenProps) {
  const route = useRoute<RouteProp<RootStackParamList, "Register">>();
  const returnTo = route.params?.returnTo;

  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    cardLast4: "",
    cardExpiry: "",
  });

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      dispatch(setError("Please fill in all required fields"));
      return;
    }

    if (formData.password.length < 6) {
      dispatch(setError("Password must be at least 6 characters"));
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const registerData: AuthRegisterData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        address: (formData.street && formData.city && formData.zip) ? {
          street: formData.street,
          city: formData.city,
          zip: formData.zip,
          country: formData.state || "South Africa",
        } : undefined,
      };

      const user = await authService.register(registerData);
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
      dispatch(setError(error.message || "Registration failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };


  const updateField = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 48 : 0}
      >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
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
              if (onNavigateToLogin) {
                onNavigateToLogin();
              } else if (navigation) {
                navigation.navigate("Login", returnTo ? { returnTo } : undefined);
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
            <Text style={{ color: NG.c.text, fontWeight: "900" }}>Login</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              // Already on Sign Up, do nothing
            }}
            style={{
              flex: 1,
              backgroundColor: NG.c.gold,
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#151515", fontWeight: "900" }}>Sign Up</Text>
          </Pressable>
        </View>

        <View style={{ height: 14 }} />

        <Text style={{ color: NG.c.muted, fontSize: 13, marginBottom: 12, lineHeight: 18 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "800" }}>*</Text> Required: first name, last name, email, and password (min. 6 characters).{"\n"}
          All other fields are optional, including phone, address, and card details.
        </Text>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Input
            icon="user"
            placeholder="First Name *"
            width="48%"
            value={formData.firstName}
            onChangeText={(text) => updateField("firstName", text)}
          />
          <Input
            icon="user"
            placeholder="Last Name *"
            width="48%"
            value={formData.lastName}
            onChangeText={(text) => updateField("lastName", text)}
          />
        </View>

        <Input
          icon="mail"
          placeholder="Email *"
          value={formData.email}
          onChangeText={(text) => updateField("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordInput
          placeholder="Password *"
          value={formData.password}
          onChangeText={(text) => updateField("password", text)}
        />
        <Input
          icon="phone"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChangeText={(text) => updateField("phone", text)}
          keyboardType="phone-pad"
        />
        <Input
          icon="home"
          placeholder="Street address (optional)"
          value={formData.street}
          onChangeText={(text) => updateField("street", text)}
        />

        <View style={{ flexDirection: "row", gap: 12, marginTop: 0 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: NG.c.panel2,
              borderRadius: NG.r.md,
              borderWidth: 1,
              borderColor: NG.c.stroke,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            <TextInput
              placeholder="City (optional)"
              placeholderTextColor={NG.c.muted2}
              style={{ color: NG.c.text, fontWeight: "700" }}
              value={formData.city}
              onChangeText={(text) => updateField("city", text)}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: NG.c.panel2,
              borderRadius: NG.r.md,
              borderWidth: 1,
              borderColor: NG.c.stroke,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            <TextInput
              placeholder="Province (optional)"
              placeholderTextColor={NG.c.muted2}
              style={{ color: NG.c.text, fontWeight: "700" }}
              value={formData.state}
              onChangeText={(text) => updateField("state", text)}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: NG.c.panel2,
              borderRadius: NG.r.md,
              borderWidth: 1,
              borderColor: NG.c.stroke,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            <TextInput
              placeholder="Postal code (optional)"
              placeholderTextColor={NG.c.muted2}
              style={{ color: NG.c.text, fontWeight: "700" }}
              value={formData.zip}
              onChangeText={(text) => updateField("zip", text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={{ color: NG.c.gold, fontWeight: "800", marginTop: 20, marginBottom: 8 }}>Card details (optional — for testing)</Text>
        <Text style={{ color: NG.c.muted, fontSize: 12, marginBottom: 10 }}>Optional. Use a test card if you try checkout, e.g. 4242 4242 4242 4242</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Last 4 digits"
              placeholderTextColor={NG.c.muted2}
              style={{
                backgroundColor: NG.c.panel2,
                borderRadius: NG.r.md,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: NG.c.text,
                fontWeight: "700",
              }}
              value={formData.cardLast4}
              onChangeText={(text) => updateField("cardLast4", text.replace(/\D/g, "").slice(0, 4))}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor={NG.c.muted2}
              style={{
                backgroundColor: NG.c.panel2,
                borderRadius: NG.r.md,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: NG.c.text,
                fontWeight: "700",
              }}
              value={formData.cardExpiry}
              onChangeText={(text) => updateField("cardExpiry", text.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d{0,2})/, "$1/$2").replace(/\/$/, ""))}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        {error && (
          <View style={{ marginTop: 12 }}>
            <ErrorMessage message={error} onDismiss={() => dispatch(setError(null))} />
          </View>
        )}

        <View style={{ marginTop: 18 }}>
          <PrimaryButton 
            label={isLoading ? "Creating account..." : "Create Account"} 
            onPress={handleSubmit} 
            disabled={isLoading}
          />
        </View>
        {isLoading && <LoadingSpinner message="Creating account..." />}
      </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

