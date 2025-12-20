import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  img: string;
  qty: string;
}

interface CartWithItemsScreenProps {
  navigation?: any;
  items?: CartItem[];
  subtotal?: string;
  deliveryFee?: string;
  total?: string;
  onClearCart?: () => void;
  onRemoveItem?: (id: string) => void;
  onUpdateQuantity?: (id: string, qty: number) => void;
  onCheckout?: () => void;
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: "1",
    title: "Chocolate Soufflé",
    subtitle: "Add-ons: Extra Ice Cream",
    price: "R58.00",
    img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=70",
    qty: "2",
  },
  {
    id: "2",
    title: "Wagyu Beef Steak",
    subtitle: "Add-ons: Foie Gras Topping, Truffle Sauce",
    price: "R318.00",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=70",
    qty: "2",
  },
];

export default function CartWithItemsScreen({
  navigation,
  items = DEFAULT_ITEMS,
  subtotal = "R376.00",
  deliveryFee = "R5.00",
  total = "R381.00",
  onClearCart,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}: CartWithItemsScreenProps) {
  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Pressable onPress={() => navigation?.goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather name="arrow-left" size={22} color={NG.c.text} />
            <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>Your Cart</Text>
          </View>
        </Pressable>
        <Pressable onPress={onClearCart}>
          <Text style={{ color: NG.c.gold, fontWeight: "800" }}>Clear</Text>
        </Pressable>
      </View>

      <View style={{ height: 16 }} />

      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <CartRow
            item={item}
            onRemove={() => onRemoveItem?.(item.id)}
            onUpdateQuantity={(qty) => onUpdateQuantity?.(item.id, qty)}
          />
          {index < items.length - 1 && <View style={{ height: 12 }} />}
        </React.Fragment>
      ))}

      <View style={{ flex: 1 }} />

      <View style={{ paddingTop: 12, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
        <Row label="Subtotal" value={subtotal} />
        <Row label="Delivery Fee" value={deliveryFee} />

        <View style={{ height: 10 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>Total</Text>
          <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>{total}</Text>
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
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  const qty = parseInt(item.qty) || 1;

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
      <Image source={{ uri: item.img }} style={{ width: 56, height: 56, borderRadius: 12 }} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: NG.c.text, fontWeight: "900" }}>{item.title}</Text>
          <Pressable onPress={onRemove}>
            <Feather name="trash-2" size={18} color="rgba(237,237,237,0.60)" />
          </Pressable>
        </View>
        <Text style={{ color: NG.c.muted, marginTop: 6, fontSize: 12 }} numberOfLines={1}>
          {item.subtitle}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <QtyTiny qty={qty} onUpdateQuantity={onUpdateQuantity} />
          <Text style={{ color: NG.c.gold, fontWeight: "900" }}>{item.price}</Text>
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

