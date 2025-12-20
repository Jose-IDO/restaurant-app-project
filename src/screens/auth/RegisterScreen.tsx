import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, Input, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

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
  const [isSignup, setIsSignup] = useState(true);

  const handleSubmit = () => {
    if (onRegister) {
      onRegister(formData);
    }
  };

  const handleTabSwitch = () => {
    setIsSignup(!isSignup);
    if (!isSignup && onNavigateToLogin) {
      onNavigateToLogin();
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
            onPress={handleTabSwitch}
            style={{
              flex: 1,
              backgroundColor: !isSignup ? NG.c.gold : "transparent",
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: !isSignup ? "#151515" : NG.c.text, fontWeight: "900" }}>Login</Text>
          </Pressable>
          <Pressable
            onPress={handleTabSwitch}
            style={{
              flex: 1,
              backgroundColor: isSignup ? NG.c.gold : "transparent",
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: isSignup ? "#151515" : NG.c.text, fontWeight: "900" }}>Sign Up</Text>
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

        <View style={{ marginTop: 18 }}>
          <PrimaryButton label="Create Account" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </Screen>
  );
}

