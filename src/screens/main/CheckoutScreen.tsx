import React, { useState } from "react";
import { View, Text, Pressable, Alert, TextInput, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import { addOrder, setLoading } from "../../store/slices/orderSlice";
import { stripeService } from "../../services/stripeService";
import { orderService } from "../../services/orderService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import CustomModal from "../../components/Modal";

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
  deliveryAddress: propAddress,
  paymentMethod: propPayment,
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
  const [overrideAddress, setOverrideAddress] = useState<{ street: string; city: string; zip: string } | null>(null);
  const [overridePayment, setOverridePayment] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editAddressForm, setEditAddressForm] = useState({ street: "", city: "", zip: "" });
  const [editPaymentLabel, setEditPaymentLabel] = useState("");

  const defaultAddressStr = userProfile?.address
    ? `${userProfile.address.street || ""}, ${userProfile.address.city || ""}, ${userProfile.address.zip || ""}`.trim()
    : "";
  const displayAddress = propAddress || (overrideAddress ? `${overrideAddress.street}, ${overrideAddress.city}, ${overrideAddress.zip}`.trim() : null) || defaultAddressStr || "No address saved";
  const displayPayment = propPayment || overridePayment || "No payment method saved";
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
            selectedSides: item.selectedSides,
            selectedDrink: item.selectedDrink,
            removedIngredients: item.removedIngredients,
            addedIngredients: item.addedIngredients,
            category: item.category,
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

  const handleOpenAddressModal = () => {
    if (onEditAddress) {
      onEditAddress();
      return;
    }
    setEditAddressForm(overrideAddress || (userProfile?.address ? {
      street: userProfile.address.street || "",
      city: userProfile.address.city || "",
      zip: userProfile.address.zip || "",
    } : { street: "", city: "", zip: "" }));
    setShowAddressModal(true);
  };

  const handleSaveAddress = () => {
    if (editAddressForm.street.trim() && editAddressForm.city.trim() && editAddressForm.zip.trim()) {
      setOverrideAddress({ ...editAddressForm });
      setShowAddressModal(false);
    }
  };

  const handleOpenPaymentModal = () => {
    if (onEditPayment) {
      onEditPayment();
      return;
    }
    setEditPaymentLabel(overridePayment || "Test card •••• 4242");
    setShowPaymentModal(true);
  };

  const handleSavePayment = () => {
    setOverridePayment(editPaymentLabel.trim() || null);
    setShowPaymentModal(false);
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

      {!user && (
        <Card style={{ marginTop: 18, backgroundColor: NG.c.panel2, borderColor: NG.c.gold }}>
          <Text style={{ color: NG.c.text, fontWeight: "800", marginBottom: 10 }}>Sign in to place order</Text>
          <Text style={{ color: NG.c.muted, marginBottom: 14 }}>You need to be logged in to complete your order.</Text>
          <PrimaryButton label="Sign in" onPress={() => navigation?.navigate("Login")} />
        </Card>
      )}

      <View style={{ height: 18 }} />

      <Text style={{ color: NG.c.text, fontWeight: "900", marginBottom: 10 }}>Delivery Address</Text>
      <Card style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
          <Feather name="map-pin" size={16} color={NG.c.gold} />
          <Text style={{ color: NG.c.muted, fontWeight: "800", flex: 1 }}>{displayAddress}</Text>
        </View>
        <Pressable onPress={handleOpenAddressModal}>
          <Feather name="edit-2" size={16} color="rgba(237,237,237,0.6)" />
        </Pressable>
      </Card>

      <View style={{ height: 18 }} />

      <Text style={{ color: NG.c.text, fontWeight: "900", marginBottom: 10 }}>Payment Method</Text>
      <Pressable onPress={handleOpenPaymentModal}>
        <Card>
          <Text style={{ color: NG.c.muted, fontWeight: "800" }}>{displayPayment}</Text>
        </Card>
      </Pressable>

      <CustomModal visible={showAddressModal} onClose={() => setShowAddressModal(false)} title="Change address">
        <ScrollView>
          <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Street</Text>
          <TextInput
            style={{ backgroundColor: NG.c.panel, borderRadius: 10, padding: 12, color: NG.c.text, marginBottom: 12, borderWidth: 1, borderColor: NG.c.stroke }}
            placeholder="Street address"
            placeholderTextColor={NG.c.muted2}
            value={editAddressForm.street}
            onChangeText={(t) => setEditAddressForm((p) => ({ ...p, street: t }))}
          />
          <Text style={{ color: NG.c.muted, marginBottom: 6 }}>City</Text>
          <TextInput
            style={{ backgroundColor: NG.c.panel, borderRadius: 10, padding: 12, color: NG.c.text, marginBottom: 12, borderWidth: 1, borderColor: NG.c.stroke }}
            placeholder="City"
            placeholderTextColor={NG.c.muted2}
            value={editAddressForm.city}
            onChangeText={(t) => setEditAddressForm((p) => ({ ...p, city: t }))}
          />
          <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Postal code</Text>
          <TextInput
            style={{ backgroundColor: NG.c.panel, borderRadius: 10, padding: 12, color: NG.c.text, marginBottom: 16, borderWidth: 1, borderColor: NG.c.stroke }}
            placeholder="Zip / Code"
            placeholderTextColor={NG.c.muted2}
            value={editAddressForm.zip}
            onChangeText={(t) => setEditAddressForm((p) => ({ ...p, zip: t }))}
          />
          <PrimaryButton label="Use this address" onPress={handleSaveAddress} />
        </ScrollView>
      </CustomModal>

      <CustomModal visible={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Payment method">
        <ScrollView>
          <Text style={{ color: NG.c.muted, marginBottom: 6 }}>Card (e.g. Test card •••• 4242)</Text>
          <TextInput
            style={{ backgroundColor: NG.c.panel, borderRadius: 10, padding: 12, color: NG.c.text, marginBottom: 16, borderWidth: 1, borderColor: NG.c.stroke }}
            placeholder="Test card •••• 4242"
            placeholderTextColor={NG.c.muted2}
            value={editPaymentLabel}
            onChangeText={setEditPaymentLabel}
          />
          <PrimaryButton label="Use this card" onPress={handleSavePayment} />
        </ScrollView>
      </CustomModal>

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
          disabled={isProcessing || isOrderLoading || cartItems.length === 0 || !user}
        />
      </View>
      {(isProcessing || isOrderLoading) && <LoadingSpinner fullScreen message="Processing payment..." />}
    </Screen>
  );
}



