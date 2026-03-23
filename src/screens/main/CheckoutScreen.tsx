import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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

  const goToLogin = () => {
    navigation?.navigate("Login", { returnTo: "Checkout" });
  };

  const handlePlaceOrder = async () => {
    if (!user || !userProfile) {
      goToLogin();
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    if (displayPayment === "No payment method saved") {
      return;
    }

    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      setError(null);

      const totalAmount = parseFloat(displayTotal.replace(/[^0-9.]/g, "")) * 100;

      const clientSecret = await stripeService.createPaymentIntent(totalAmount, "zar");

      const result = await stripeService.processPayment(clientSecret);

      if (result.success) {
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
    } catch (err: any) {
      setError(err.message || "Failed to process payment");
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

  const primaryLabel = !user
    ? "Sign in to place order"
    : isProcessing || isOrderLoading
      ? "Processing..."
      : `Place Order - ${displayTotal}`;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 56 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
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
              <Text style={{ color: NG.c.muted, marginBottom: 14 }}>
                Sign in or create an account to complete your order. Your cart is saved — after logging in you can continue here.
              </Text>
              <PrimaryButton label="Go to sign in" onPress={goToLogin} />
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

          {error ? (
            <View style={{ marginTop: 12, marginBottom: 8 }}>
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </View>
          ) : null}

          <View style={{ height: 24 }} />

          <PrimaryButton
            label={primaryLabel}
            onPress={!user ? goToLogin : handlePlaceOrder}
            disabled={
              cartItems.length === 0 ||
              (Boolean(user) && (isProcessing || isOrderLoading || displayPayment === "No payment method saved"))
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal visible={showAddressModal} onClose={() => setShowAddressModal(false)} title="Change address">
        <ScrollView keyboardShouldPersistTaps="handled">
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
        <ScrollView keyboardShouldPersistTaps="handled">
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

      {(isProcessing || isOrderLoading) && user ? <LoadingSpinner fullScreen message="Processing payment..." /> : null}
    </Screen>
  );
}
