import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { removeFromCart, updateQuantity, clearCart, CartItem } from "../../store/slices/cartSlice";

interface CartWithItemsScreenProps {
  navigation?: any;
  onCheckout?: () => void;
}

export default function CartWithItemsScreen({
  navigation,
  onCheckout,
}: CartWithItemsScreenProps) {
  const dispatch = useAppDispatch();
  const { items, subtotal, deliveryFee, total } = useAppSelector(state => state.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    dispatch(updateQuantity({ id, quantity: qty }));
  };
  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Pressable onPress={() => navigation?.goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather name="arrow-left" size={22} color={NG.c.text} />
            <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>Your Cart</Text>
          </View>
        </Pressable>
        <Pressable onPress={handleClearCart}>
          <Text style={{ color: NG.c.gold, fontWeight: "800" }}>Clear</Text>
        </Pressable>
      </View>

      <View style={{ height: 16 }} />

      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <CartRow
            item={item}
            onRemove={() => handleRemoveItem(item.id)}
            onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
            onEdit={() => navigation?.navigate("EditCartItem", { cartItemId: item.id })}
          />
          {index < items.length - 1 && <View style={{ height: 12 }} />}
        </React.Fragment>
      ))}

      <View style={{ flex: 1 }} />

      <View style={{ paddingTop: 12, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
        <Row label="Subtotal" value={`R${subtotal.toFixed(2)}`} />
        <Row label="Delivery Fee" value={`R${deliveryFee.toFixed(2)}`} />

        <View style={{ height: 10 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>Total</Text>
          <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>R{total.toFixed(2)}</Text>
        </View>

        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <PrimaryButton
            label="Proceed to Checkout"
            onPress={() => {
              if (onCheckout) {
                onCheckout();
              } else if (navigation) {
                navigation.navigate("Checkout");
              }
            }}
            disabled={items.length === 0}
          />
        </View>
      </View>
    </Screen>
  );
}

function CartRow({
  item,
  onRemove,
  onUpdateQuantity,
  onEdit,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
  onEdit?: () => void;
}) {
  const hasImage = item.foodItemImage && item.foodItemImage.trim() !== "";
  const drinkTotal = (item.selectedDrink?.price ?? 0) * item.quantity;
  const itemTotal =
    (item.price * item.quantity) +
    item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0) * item.quantity +
    drinkTotal;
  const parts: string[] = [];
  if (item.selectedExtras.length > 0) parts.push(`Extras: ${item.selectedExtras.map(e => e.name).join(", ")}`);
  if (item.selectedSides?.length) parts.push(`Sides: ${item.selectedSides.map(s => s.name).join(", ")}`);
  if (item.selectedDrink) parts.push(`Drink: ${item.selectedDrink.name}`);
  if (item.removedIngredients?.length) parts.push(`No: ${item.removedIngredients.join(", ")}`);
  if (item.addedIngredients?.length) parts.push(`Extra: ${item.addedIngredients.join(", ")}`);
  const optionsText = parts.join(" • ");

  return (
    <View style={{
      backgroundColor: NG.c.panel2,
      borderRadius: NG.r.lg,
      borderWidth: 1,
      borderColor: NG.c.stroke,
      padding: 12,
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
    }}>
      {hasImage ? (
        <Image source={{ uri: item.foodItemImage }} style={{ width: 56, height: 56, borderRadius: 12 }} />
      ) : (
        <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: NG.c.panel2, alignItems: "center", justifyContent: "center" }}>
          <Feather name="image" size={24} color={NG.c.muted2} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: NG.c.text, fontWeight: "900" }}>{item.foodItemTitle}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {onEdit && (
              <Pressable onPress={onEdit}>
                <Feather name="edit-2" size={16} color={NG.c.gold} />
              </Pressable>
            )}
            <Pressable onPress={onRemove}>
              <Feather name="trash-2" size={18} color="rgba(237,237,237,0.60)" />
            </Pressable>
          </View>
        </View>
        {optionsText ? (
          <Text style={{ color: NG.c.muted, marginTop: 6, fontSize: 12 }} numberOfLines={2}>
            {optionsText}
          </Text>
        ) : null}
        {item.specialInstructions && (
          <Text style={{ color: NG.c.muted2, marginTop: 4, fontSize: 11 }} numberOfLines={1}>
            Note: {item.specialInstructions}
          </Text>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <QtyTiny qty={item.quantity} onUpdateQuantity={onUpdateQuantity} />
          <Text style={{ color: NG.c.gold, fontWeight: "900" }}>R{itemTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

function QtyTiny({ qty, onUpdateQuantity }: { qty: number; onUpdateQuantity: (qty: number) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Pressable onPress={() => onUpdateQuantity(Math.max(1, qty - 1))}>
        <Circle icon="minus" />
      </Pressable>
      <Text style={{ color: NG.c.text, fontWeight: "900" }}>{qty}</Text>
      <Pressable onPress={() => onUpdateQuantity(qty + 1)}>
        <Circle icon="plus" />
      </Pressable>
    </View>
  );
}

function Circle({ icon }: { icon: "minus" | "plus" }) {
  return (
    <View style={{
      width: 26, height: 26,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: NG.c.panel,
      borderWidth: 1,
      borderColor: NG.c.stroke,
    }}>
      <Feather name={icon} size={14} color={NG.c.gold} />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
      <Text style={{ color: NG.c.muted }}>{label}</Text>
      <Text style={{ color: NG.c.text, fontWeight: "800" }}>{value}</Text>
    </View>
  );
}



