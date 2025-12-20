import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface CheckoutScreenProps {
  navigation?: any;
  deliveryAddress?: string;
  paymentMethod?: string;
  total?: string;
  onEditAddress?: () => void;
  onEditPayment?: () => void;
  onPlaceOrder?: () => void;
}

export default function CheckoutScreen({
  navigation,
  deliveryAddress = "No address saved",
  paymentMethod = "No payment method saved",
  total = "R381.00",
  onEditAddress,
  onEditPayment,
  onPlaceOrder,
}: CheckoutScreenProps) {
  return (
    <Screen>
      <Pressable onPress={() => navigation?.goBack()}>
        <View style={{ width: 40, height: 40, justifyContent: "center" }}>
          <Feather name="arrow-left" size={24} color={NG.c.text} />
        </View>
      </Pressable>

      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 6 }}>
        Checkout
      </Text>

      <View style={{ height: 18 }} />

      <Text style={{ color: NG.c.text, fontWeight: "900", marginBottom: 10 }}>Delivery Address</Text>
      <Card style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Feather name="map-pin" size={16} color={NG.c.gold} />
          <Text style={{ color: NG.c.muted, fontWeight: "800" }}>{deliveryAddress}</Text>
        </View>
        <Pressable onPress={onEditAddress}>
          <Feather name="edit-2" size={16} color="rgba(237,237,237,0.6)" />
        </Pressable>
      </Card>

      <View style={{ height: 18 }} />

      <Text style={{ color: NG.c.text, fontWeight: "900", marginBottom: 10 }}>Payment Method</Text>
      <Pressable onPress={onEditPayment}>
        <Card>
          <Text style={{ color: NG.c.muted, fontWeight: "800" }}>{paymentMethod}</Text>
        </Card>
      </Pressable>

      <View style={{ flex: 1 }} />

      <View style={{ marginBottom: 18 }}>
        <PrimaryButton
          label={`Place Order - ${total}`}
          onPress={() => {
            if (onPlaceOrder) {
              onPlaceOrder();
            } else if (navigation) {
              navigation.navigate("OrderPlaced");
            }
          }}
        />
      </View>
    </Screen>
  );
}

