import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface CartEmptyScreenProps {
  navigation?: any;
  onBrowseMenu?: () => void;
}

export default function CartEmptyScreen({ navigation, onBrowseMenu }: CartEmptyScreenProps) {
  return (
    <Screen>
      <Pressable onPress={() => navigation?.goBack()}>
        <View style={{ width: 40, height: 40, justifyContent: "center" }}>
          <Feather name="arrow-left" size={24} color={NG.c.text} />
        </View>
      </Pressable>

      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>
        Your Cart
      </Text>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Feather name="shopping-bag" size={54} color="rgba(237,237,237,0.65)" />
        <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 16, marginTop: 14 }}>
          Your cart is empty
        </Text>

        <View style={{ width: "70%", marginTop: 16 }}>
          <PrimaryButton
            label="Browse Menu"
            onPress={() => {
              if (onBrowseMenu) {
                onBrowseMenu();
              } else if (navigation) {
                navigation.navigate("Home");
              }
            }}
          />
        </View>
      </View>
    </Screen>
  );
}

