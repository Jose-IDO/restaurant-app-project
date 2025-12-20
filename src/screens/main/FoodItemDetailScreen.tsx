import React, { useState } from "react";
import { View, Text, Image, ScrollView, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Pill, Divider, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface FoodItemDetailScreenProps {
  route?: any;
  navigation?: any;
  itemId?: string;
  foodItem?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    ingredients?: string[];
    extras?: Array<{ id: string; name: string; price: number }>;
  };
  onAddToCart?: (data: CartData) => void;
}

export interface CartData {
  itemId: string;
  quantity: number;
  selectedExtras: string[];
  specialInstructions?: string;
}

const DEFAULT_ITEM = {
  id: "1",
  name: "Chocolate Soufflé",
  description: "Decadent dark chocolate soufflé with vanilla bean ice cream",
  price: 24.00,
  image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1400&q=70",
  ingredients: ["Dark Chocolate", "Eggs", "Sugar", "Vanilla Ice Cream", "Gold Leaf"],
  extras: [
    { id: "1", name: "Extra Ice Cream", price: 5.00 },
    { id: "2", name: "Berry Compote", price: 6.00 },
  ],
};

export default function FoodItemDetailScreen({
  route,
  navigation,
  itemId,
  foodItem = DEFAULT_ITEM,
  onAddToCart,
}: FoodItemDetailScreenProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const item = foodItem || DEFAULT_ITEM;

  const calculateTotal = () => {
    let total = item.price;
    item.extras?.forEach(extra => {
      if (selectedExtras.includes(extra.id)) {
        total += extra.price;
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        itemId: item.id,
        quantity,
        selectedExtras,
        specialInstructions,
      });
    }
    navigation?.goBack();
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: 18, paddingTop: 10 }}>
        <Pressable onPress={() => navigation?.goBack()}>
          <View style={{ width: 40, height: 40, justifyContent: "center" }}>
            <Feather name="arrow-left" size={24} color={NG.c.text} />
          </View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 230 }}
        />

        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={{ color: NG.c.text, fontSize: 28, fontWeight: "900" }}>{item.name}</Text>
            <Text style={{ color: NG.c.gold, fontSize: 18, fontWeight: "900" }}>R{item.price.toFixed(2)}</Text>
          </View>

          <Text style={{ color: NG.c.muted, marginTop: 8, lineHeight: 18 }}>
            {item.description}
          </Text>

          {item.ingredients && item.ingredients.length > 0 && (
            <>
              <Divider />
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Ingredients</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {item.ingredients.map((ingredient, index) => (
                  <Pill key={index} label={ingredient} />
                ))}
              </View>
            </>
          )}

          {item.extras && item.extras.length > 0 && (
            <>
              <Divider />
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Add Extras</Text>
              {item.extras.map(extra => (
                <ExtraRow
                  key={extra.id}
                  label={extra.name}
                  price={`+ R${extra.price.toFixed(2)}`}
                  checked={selectedExtras.includes(extra.id)}
                  onToggle={() => toggleExtra(extra.id)}
                />
              ))}
            </>
          )}

          <Divider />

          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Special Instructions</Text>
          <View style={{
            backgroundColor: NG.c.panel2,
            borderRadius: NG.r.md,
            borderWidth: 1,
            borderColor: NG.c.stroke,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}>
            <TextInput
              placeholder="Any special requests?"
              placeholderTextColor={NG.c.muted2}
              style={{ color: NG.c.text, minHeight: 44 }}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
            />
          </View>

          <Divider />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: NG.c.gold, fontWeight: "900" }}>Quantity</Text>
            <QtyUI quantity={quantity} onQuantityChange={setQuantity} />
          </View>
        </View>
      </ScrollView>

      <View style={{ position: "absolute", left: 18, right: 18, bottom: 20 }}>
        <PrimaryButton
          label={`Add to Cart - R${calculateTotal().toFixed(2)}`}
          icon="shopping-bag"
          onPress={handleAddToCart}
        />
      </View>
    </Screen>
  );
}

function ExtraRow({ label, price, checked, onToggle }: { label: string; price: string; checked: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 }}>
        <View>
          <Text style={{ color: NG.c.text, fontWeight: "800" }}>{label}</Text>
          <Text style={{ color: NG.c.gold, marginTop: 4, fontWeight: "800" }}>{price}</Text>
        </View>
        <View style={{
          width: 18, height: 18,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: NG.c.stroke,
          backgroundColor: checked ? NG.c.gold : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {checked ? <Feather name="check" size={14} color="#151515" /> : null}
        </View>
      </View>
    </Pressable>
  );
}

function QtyUI({ quantity, onQuantityChange }: { quantity: number; onQuantityChange: (qty: number) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Pressable onPress={() => onQuantityChange(Math.max(1, quantity - 1))}>
        <View style={{
          width: 34, height: 34,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: NG.c.panel2,
          borderWidth: 1,
          borderColor: NG.c.stroke,
        }}>
          <Feather name="minus" size={18} color={NG.c.gold} />
        </View>
      </Pressable>
      <View style={{
        width: 44, height: 34,
        borderRadius: 10,
        backgroundColor: NG.c.panel2,
        borderWidth: 1,
        borderColor: NG.c.stroke,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Text style={{ color: NG.c.text, fontWeight: "900" }}>{quantity}</Text>
      </View>
      <Pressable onPress={() => onQuantityChange(quantity + 1)}>
        <View style={{
          width: 34, height: 34,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: NG.c.panel2,
          borderWidth: 1,
          borderColor: NG.c.stroke,
        }}>
          <Feather name="plus" size={18} color={NG.c.gold} />
        </View>
      </Pressable>
    </View>
  );
}

