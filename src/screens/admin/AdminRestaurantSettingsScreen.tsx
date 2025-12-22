import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG, Input, PrimaryButton } from "../../components/ui/noirGold.ui";
import { RestaurantInfo } from "../../types";

interface AdminRestaurantSettingsScreenProps {
  navigation?: any;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminRestaurantSettingsScreen({ navigation }: AdminRestaurantSettingsScreenProps) {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    id: "1",
    name: "Bon Appetit",
    description: "Exquisite fine dining experience",
    address: "123 Fine Dining Street, City",
    phone: "+27 12 345 6789",
    email: "info@bonappetit.com",
    openingHours: {
      Monday: { open: "11:00", close: "22:00", closed: false },
      Tuesday: { open: "11:00", close: "22:00", closed: false },
      Wednesday: { open: "11:00", close: "22:00", closed: false },
      Thursday: { open: "11:00", close: "22:00", closed: false },
      Friday: { open: "11:00", close: "23:00", closed: false },
      Saturday: { open: "11:00", close: "23:00", closed: false },
      Sunday: { open: "12:00", close: "21:00", closed: false },
    },
    deliveryFee: 25.00,
    minimumOrder: 100.00,
  });

  const updateField = (field: keyof RestaurantInfo, value: any) => {
    setRestaurantInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateHours = (day: string, field: "open" | "close" | "closed", value: string | boolean) => {
    setRestaurantInfo(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    // TODO: Save to Firebase
    console.log("Saving restaurant info:", restaurantInfo);
  };

  return (
    <Screen>
      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
        Restaurant Settings
      </Text>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 16, fontSize: 16 }}>
            Basic Information
          </Text>
          <Input
            icon="type"
            placeholder="Restaurant Name"
            value={restaurantInfo.name}
            onChangeText={(text) => updateField("name", text)}
          />
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: NG.c.text, fontWeight: "800", marginBottom: 8, fontSize: 13 }}>
              Description
            </Text>
            <TextInput
              style={{
                backgroundColor: NG.c.panel2,
                borderRadius: NG.r.md,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                padding: 12,
                color: NG.c.text,
                minHeight: 80,
                textAlignVertical: "top",
              }}
              placeholder="Restaurant description"
              placeholderTextColor={NG.c.muted2}
              value={restaurantInfo.description}
              onChangeText={(text) => updateField("description", text)}
              multiline
            />
          </View>
          <Input
            icon="map-pin"
            placeholder="Address"
            value={restaurantInfo.address}
            onChangeText={(text) => updateField("address", text)}
          />
          <Input
            icon="phone"
            placeholder="Phone"
            value={restaurantInfo.phone}
            onChangeText={(text) => updateField("phone", text)}
            keyboardType="phone-pad"
          />
          <Input
            icon="mail"
            placeholder="Email"
            value={restaurantInfo.email}
            onChangeText={(text) => updateField("email", text)}
            keyboardType="email-address"
          />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 16, fontSize: 16 }}>
            Opening Hours
          </Text>
          {DAYS.map((day) => (
            <View key={day} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Text style={{ color: NG.c.text, fontWeight: "800", fontSize: 13 }}>{day}</Text>
                <Pressable
                  onPress={() => updateHours(day, "closed", !restaurantInfo.openingHours[day]?.closed)}
                >
                  <View style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                    backgroundColor: restaurantInfo.openingHours[day]?.closed ? "#ff3b30" : NG.c.gold,
                  }}>
                    <Text style={{ color: "#151515", fontWeight: "800", fontSize: 11 }}>
                      {restaurantInfo.openingHours[day]?.closed ? "Closed" : "Open"}
                    </Text>
                  </View>
                </Pressable>
              </View>
              {!restaurantInfo.openingHours[day]?.closed && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: NG.c.muted, fontSize: 11, marginBottom: 4 }}>Open</Text>
                    <TextInput
                      style={{
                        backgroundColor: NG.c.panel,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: NG.c.stroke,
                        padding: 10,
                        color: NG.c.text,
                      }}
                      placeholder="11:00"
                      placeholderTextColor={NG.c.muted2}
                      value={restaurantInfo.openingHours[day]?.open || ""}
                      onChangeText={(text) => updateHours(day, "open", text)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: NG.c.muted, fontSize: 11, marginBottom: 4 }}>Close</Text>
                    <TextInput
                      style={{
                        backgroundColor: NG.c.panel,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: NG.c.stroke,
                        padding: 10,
                        color: NG.c.text,
                      }}
                      placeholder="22:00"
                      placeholderTextColor={NG.c.muted2}
                      value={restaurantInfo.openingHours[day]?.close || ""}
                      onChangeText={(text) => updateHours(day, "close", text)}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 16, fontSize: 16 }}>
            Delivery Settings
          </Text>
          <Input
            icon="dollar-sign"
            placeholder="Delivery Fee"
            value={restaurantInfo.deliveryFee.toString()}
            onChangeText={(text) => updateField("deliveryFee", parseFloat(text) || 0)}
            keyboardType="decimal-pad"
          />
          <Input
            icon="shopping-bag"
            placeholder="Minimum Order Amount"
            value={restaurantInfo.minimumOrder.toString()}
            onChangeText={(text) => updateField("minimumOrder", parseFloat(text) || 0)}
            keyboardType="decimal-pad"
          />
        </Card>

        <View style={{ marginBottom: 20 }}>
          <PrimaryButton label="Save Changes" onPress={handleSave} icon="save" />
        </View>
      </ScrollView>
    </Screen>
  );
}

