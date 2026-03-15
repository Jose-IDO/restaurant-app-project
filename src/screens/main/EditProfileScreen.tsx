import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUserProfile, setError } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function EditProfileScreen({ navigation }: { navigation?: any }) {
  const dispatch = useAppDispatch();
  const { user, userProfile } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [cardDisplay, setCardDisplay] = useState("");

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setEmail(userProfile.email || "");
      setPhone(userProfile.phone || "");
      setStreet(userProfile.address?.street || "");
      setCity(userProfile.address?.city || "");
      setZip(userProfile.address?.zip || "");
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user?.uid) return;
    if (!name.trim() || !email.trim()) {
      dispatch(setError("Name and email are required"));
      return;
    }
    try {
      setLoading(true);
      dispatch(setError(null));
      await authService.updateUserProfile(user.uid, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address:
          street.trim() && city.trim() && zip.trim()
            ? { street: street.trim(), city: city.trim(), zip: zip.trim(), country: "South Africa" }
            : undefined,
      });
      const updated = await authService.getUserProfile(user.uid);
      if (updated) dispatch(setUserProfile(updated));
      navigation?.goBack();
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to update profile"));
    } finally {
      setLoading(false);
    }
  };

  const error = useAppSelector((s) => s.auth.error);

  return (
    <Screen>
      <Pressable onPress={() => navigation?.goBack()}>
        <View style={{ width: 40, height: 40, justifyContent: "center" }}>
          <Feather name="arrow-left" size={24} color={NG.c.text} />
        </View>
      </Pressable>

      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 6 }}>
        Edit profile
      </Text>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Full name *</Text>
        <TextInput
          style={{
            backgroundColor: NG.c.panel2,
            borderRadius: 10,
            padding: 12,
            color: NG.c.text,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: NG.c.stroke,
          }}
          placeholder="Name"
          placeholderTextColor={NG.c.muted2}
          value={name}
          onChangeText={setName}
        />
        <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Email *</Text>
        <TextInput
          style={{
            backgroundColor: NG.c.panel2,
            borderRadius: 10,
            padding: 12,
            color: NG.c.text,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: NG.c.stroke,
          }}
          placeholder="Email"
          placeholderTextColor={NG.c.muted2}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Phone</Text>
        <TextInput
          style={{
            backgroundColor: NG.c.panel2,
            borderRadius: 10,
            padding: 12,
            color: NG.c.text,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: NG.c.stroke,
          }}
          placeholder="Phone"
          placeholderTextColor={NG.c.muted2}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Text style={{ color: NG.c.gold, fontWeight: "800", marginTop: 10, marginBottom: 8 }}>Address</Text>
        <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Street</Text>
        <TextInput
          style={{
            backgroundColor: NG.c.panel2,
            borderRadius: 10,
            padding: 12,
            color: NG.c.text,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: NG.c.stroke,
          }}
          placeholder="Street"
          placeholderTextColor={NG.c.muted2}
          value={street}
          onChangeText={setStreet}
        />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: NG.c.muted, marginBottom: 6 }}>City</Text>
            <TextInput
              style={{
                backgroundColor: NG.c.panel2,
                borderRadius: 10,
                padding: 12,
                color: NG.c.text,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: NG.c.stroke,
              }}
              placeholder="City"
              placeholderTextColor={NG.c.muted2}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Zip</Text>
            <TextInput
              style={{
                backgroundColor: NG.c.panel2,
                borderRadius: 10,
                padding: 12,
                color: NG.c.text,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: NG.c.stroke,
              }}
              placeholder="Zip"
              placeholderTextColor={NG.c.muted2}
              value={zip}
              onChangeText={setZip}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Card (display only, e.g. •••• 4242)</Text>
        <TextInput
          style={{
            backgroundColor: NG.c.panel2,
            borderRadius: 10,
            padding: 12,
            color: NG.c.text,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: NG.c.stroke,
          }}
          placeholder="•••• 4242"
          placeholderTextColor={NG.c.muted2}
          value={cardDisplay}
          onChangeText={setCardDisplay}
        />

        {error && (
          <View style={{ marginBottom: 12 }}>
            <ErrorMessage message={error} onDismiss={() => dispatch(setError(null))} />
          </View>
        )}

        <PrimaryButton label={loading ? "Saving..." : "Save changes"} onPress={handleSave} disabled={loading} />
      </ScrollView>

      {loading && <LoadingSpinner fullScreen message="Saving..." />}
    </Screen>
  );
}
