import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, Input, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading, setUser, setUserProfile, setError } from "../../store/slices/authSlice";
import { authService, RegisterData as AuthRegisterData } from "../../services/authService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

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
}

export default function RegisterScreen({ navigation, onRegister, onNavigateToLogin }: RegisterScreenProps) {
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
      dispatch(setUser(user));

      // Fetch user profile
      const profile = await authService.getUserProfile(user.uid);
      if (profile) {
        dispatch(setUserProfile(profile));
      }

      // Navigate to main app
      navigation?.navigate("Main");
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
              if (onNavigateToLogin) {
                onNavigateToLogin();
              } else if (navigation) {
                navigation.navigate("Login");
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
        <Input
          icon="lock"
          placeholder="Password *"
          value={formData.password}
          onChangeText={(text) => updateField("password", text)}
          secureTextEntry
        />
        <Input
          icon="phone"
          placeholder="Phone"
          value={formData.phone}
          onChangeText={(text) => updateField("phone", text)}
          keyboardType="phone-pad"
        />
        <Input
          icon="home"
          placeholder="Street Address"
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
              placeholder="City"
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
              placeholder="State"
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
              placeholder="ZIP"
              placeholderTextColor={NG.c.muted2}
              style={{ color: NG.c.text, fontWeight: "700" }}
              value={formData.zip}
              onChangeText={(text) => updateField("zip", text)}
              keyboardType="numeric"
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
    </Screen>
  );
}

