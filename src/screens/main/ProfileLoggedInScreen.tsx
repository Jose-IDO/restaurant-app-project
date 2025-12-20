import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, Divider, GhostButton, NG } from "../../components/ui/noirGold.ui";

interface ProfileLoggedInScreenProps {
  navigation?: any;
  user?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  onLogout?: () => void;
}

export default function ProfileLoggedInScreen({ navigation, user, onLogout }: ProfileLoggedInScreenProps) {
  const displayName = user?.name || "User";
  const initials = displayName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const email = user?.email || "";
  const phone = user?.phone || "—";
  const address = user?.address || "Not set";

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

      <View style={{ alignItems: "center", marginTop: 18 }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 999,
            backgroundColor: NG.c.panel2,
            borderWidth: 1,
            borderColor: NG.c.stroke,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 28 }}>{initials}</Text>
          <View
            style={{
              position: "absolute",
              right: -2,
              bottom: -2,
              width: 30,
              height: 30,
              borderRadius: 999,
              backgroundColor: NG.c.gold,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 3,
              borderColor: NG.c.bg,
            }}
          >
            <Feather name="camera" size={14} color="#151515" />
          </View>
        </View>

        <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 18, marginTop: 12 }}>
          {displayName}
        </Text>
        <Text style={{ color: NG.c.muted, marginTop: 6 }}>{email}</Text>
      </View>

      <View style={{ height: 22 }} />

      <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>
        Personal Information
      </Text>

      <Card>
        <Row icon="user" label="Full Name" value={displayName} />
        <Divider mt={12} mb={12} />
        <Row icon="mail" label="Email" value={email} />
        <Divider mt={12} mb={12} />
        <Row icon="phone" label="Phone" value={phone} />
      </Card>

      <View style={{ height: 18 }} />

      <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>
        Delivery Address
      </Text>

      <Card>
        <Row icon="map-pin" label="Address" value={address} />
      </Card>

      <View style={{ height: 18 }} />

      <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>
        Payment Methods
      </Text>

      <Card style={{ alignItems: "center" }}>
        <Text style={{ color: NG.c.muted }}>No payment methods saved</Text>
      </Card>

      <View style={{ flex: 1 }} />

      <GhostButton label="Logout" onPress={onLogout} />
    </Screen>
  );
}

function Row({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Feather name={icon} size={16} color={NG.c.gold} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: NG.c.muted2, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: NG.c.text, fontWeight: "800", marginTop: 4 }}>{value}</Text>
      </View>
    </View>
  );
}

