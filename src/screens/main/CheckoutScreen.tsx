import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { stripeService } from "../../services/stripeService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (paymentMethod === "No payment method saved") {
      Alert.alert("Payment Required", "Please select a payment method");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Extract numeric value from total string (e.g., "R381.00" -> 38100 cents)
      const totalAmount = parseFloat(total.replace(/[^0-9.]/g, '')) * 100; // Convert to cents

      // Create payment intent
      const clientSecret = await stripeService.createPaymentIntent(totalAmount, 'zar');

      // Process payment
      const result = await stripeService.processPayment(clientSecret);

      if (result.success) {
        if (onPlaceOrder) {
          onPlaceOrder(result.paymentIntentId);
        } else if (navigation) {
          navigation.navigate("OrderPlaced");
        }
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (error: any) {
      setError(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

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

      {error && (
        <View style={{ marginBottom: 12 }}>
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </View>
      )}

      <View style={{ flex: 1 }} />

      <View style={{ marginBottom: 18 }}>
        <PrimaryButton
          label={isProcessing ? "Processing..." : `Place Order - ${total}`}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        />
      </View>
      {isProcessing && <LoadingSpinner fullScreen message="Processing payment..." />}
    </Screen>
  );
}



