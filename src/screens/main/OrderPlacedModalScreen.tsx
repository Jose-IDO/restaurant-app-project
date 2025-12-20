import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NG } from "../../components/ui/noirGold.ui";

interface OrderPlacedModalScreenProps {
  navigation?: any;
  onBackToMenu?: () => void;
}

export default function OrderPlacedModalScreen({ navigation, onBackToMenu }: OrderPlacedModalScreenProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", paddingHorizontal: 18 }}>
      <View style={{
        backgroundColor: NG.c.panel2,
        borderRadius: NG.r.xl,
        borderWidth: 1,
        borderColor: NG.c.stroke,
        padding: 18,
        alignItems: "center",
      }}>
        <View style={{
          width: 44, height: 44,
          borderRadius: 999,
          backgroundColor: NG.c.gold,
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Feather name="check" size={22} color="#151515" />
        </View>

        <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 18, marginTop: 12 }}>
          Order Placed!
        </Text>
        <Text style={{ color: NG.c.muted, textAlign: "center", marginTop: 8, lineHeight: 18 }}>
          Your order has been confirmed and will be prepared shortly.
        </Text>

        <Pressable
          onPress={() => {
            if (onBackToMenu) {
              onBackToMenu();
            } else if (navigation) {
              navigation.navigate("Home");
            }
          }}
        >
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginTop: 14 }}>Back to Menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

