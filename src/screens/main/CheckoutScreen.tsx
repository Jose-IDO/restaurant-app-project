import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import { addOrder, setLoading } from "../../store/slices/orderSlice";
import { stripeService } from "../../services/stripeService";
import { orderService } from "../../services/orderService";
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
  deliveryAddress,
  paymentMethod,
  total: propTotal,
  onEditAddress,
  onEditPayment,
  onPlaceOrder,
}: CheckoutScreenProps) {
  const dispatch = useAppDispatch();
  const { items: cartItems, subtotal: cartSubtotal, deliveryFee: cartDeliveryFee, total: cartTotal } = useAppSelector(state => state.cart);
  const { user, userProfile } = useAppSelector(state => state.auth);
  const { isLoading: isOrderLoading } = useAppSelector(state => state.orders);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayAddress = deliveryAddress || userProfile?.address ? 
    `${userProfile?.address?.street || ""}, ${userProfile?.address?.city || ""}, ${userProfile?.address?.zip || ""}`.trim() || "No address saved" :
    "No address saved";
  const displayPayment = paymentMethod || "No payment method saved";
  const displayTotal = propTotal || `R${cartTotal.toFixed(2)}`;

  const handlePlaceOrder = async () => {
    if (!user || !userProfile) {
      Alert.alert("Login Required", "Please login to place an order");
      navigation?.navigate("Login");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty");
      return;
    }

    if (displayPayment === "No payment method saved") {
      Alert.alert("Payment Required", "Please select a payment method");
      return;
    }

    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      setError(null);

      // Extract numeric value from total string (e.g., "R381.00" -> 38100 cents)
      const totalAmount = parseFloat(displayTotal.replace(/[^0-9.]/g, '')) * 100; // Convert to cents

      // Create payment intent
      const clientSecret = await stripeService.createPaymentIntent(totalAmount, 'zar');

      // Process payment
      const result = await stripeService.processPayment(clientSecret);

      if (result.success) {
        // Create order
        const order = await orderService.createOrder({
          userId: user.uid,
          customerName: userProfile.name,
          customerEmail: userProfile.email,
          customerPhone: userProfile.phone,
          items: cartItems.map(item => ({
            foodItemId: item.foodItemId,
            foodItemTitle: item.foodItemTitle,
            quantity: item.quantity,
            price: item.price,
            extras: item.selectedExtras,
            specialInstructions: item.specialInstructions,
          })),
          subtotal: cartSubtotal,
          deliveryFee: cartDeliveryFee,
          total: cartTotal,
          status: "pending",
          deliveryAddress: displayAddress,
          paymentMethod: displayPayment,
          paymentIntentId: result.paymentIntentId,
        });

        dispatch(addOrder(order));
        dispatch(clearCart());

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
      dispatch(setLoading(false));
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
          <Feather name="map-pin" size={16} color={NG.c.gold} />
          <Text style={{ color: NG.c.muted, fontWeight: "800", flex: 1 }}>{displayAddress}</Text>
        </View>
        <Pressable onPress={onEditAddress}>
          <Feather name="edit-2" size={16} color="rgba(237,237,237,0.6)" />
        </Pressable>
      </Card>

      <View style={{ height: 18 }} />

      <Text style={{ color: NG.c.text, fontWeight: "900", marginBottom: 10 }}>Payment Method</Text>
      <Pressable onPress={onEditPayment}>
        <Card>
          <Text style={{ color: NG.c.muted, fontWeight: "800" }}>{displayPayment}</Text>
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
          label={isProcessing || isOrderLoading ? "Processing..." : `Place Order - ${displayTotal}`}
          onPress={handlePlaceOrder}
          disabled={isProcessing || isOrderLoading || cartItems.length === 0}
        />
      </View>
      {(isProcessing || isOrderLoading) && <LoadingSpinner fullScreen message="Processing payment..." />}
    </Screen>
  );
}



