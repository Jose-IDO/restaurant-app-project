import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Pill, Divider, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import { FoodItem } from "../../types";

interface FoodItemDetailScreenProps {
  route?: any;
  navigation?: any;
  itemId?: string;
  foodItem?: any;
  onAddToCart?: (data: CartData) => void;
}

export interface CartData {
  itemId: string;
  quantity: number;
  selectedExtras: string[];
  specialInstructions?: string;
}

export default function FoodItemDetailScreen({
  route,
  navigation,
  itemId,
  foodItem,
  onAddToCart,
}: FoodItemDetailScreenProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Get item from route params or find by ID
  const routeParams = route?.params || {};
  const routeItem = routeParams.foodItem;
  const routeItemId = routeParams.itemId || itemId;
  
  const dispatch = useAppDispatch();
  const { items: foodItems } = useAppSelector(state => state.food);

  // Priority: route foodItem > prop foodItem > find by ID from Redux > find by ID from static data
  let item: FoodItem | null = routeItem || foodItem;
  
  if (!item && routeItemId) {
    item = foodItems.find(foodItem => foodItem.id === routeItemId) || null;
  }

  useEffect(() => {
    // Reset state when item changes
    setQuantity(1);
    setSelectedExtras([]);
    setSpecialInstructions("");
  }, [item?.id]);

  if (!item) {
    return (
      <Screen>
        <View style={{ padding: 20 }}>
          <Text style={{ color: NG.c.text }}>Item not found</Text>
        </View>
      </Screen>
    );
  }

  const calculateTotal = () => {
    let total = item.price || 0;
    item.extras?.forEach((extra: any) => {
      if (selectedExtras.includes(extra.id)) {
        total += extra.price;
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;

    const selectedExtrasData = item.extras?.filter(extra => selectedExtras.includes(extra.id)) || [];

    dispatch(addToCart({
      id: `${item.id}_${Date.now()}`,
      foodItemId: item.id,
      foodItemTitle: item.title,
      foodItemImage: item.img,
      price: item.price,
      quantity,
      selectedExtras: selectedExtrasData,
      specialInstructions: specialInstructions || undefined,
    }));

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
        {item?.img && item.img.trim() !== "" ? (
          <Image
            source={{ uri: item.img }}
            style={{ width: "100%", height: 230 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: "100%", height: 230, backgroundColor: NG.c.panel2, alignItems: "center", justifyContent: "center" }}>
            <Feather name="image" size={64} color={NG.c.muted2} />
            <Text style={{ color: NG.c.muted2, fontSize: 14, marginTop: 12 }}>No image available</Text>
          </View>
        )}

        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={{ color: NG.c.text, fontSize: 28, fontWeight: "900" }}>{item?.title || item?.name || "Item"}</Text>
            <Text style={{ color: NG.c.gold, fontSize: 18, fontWeight: "900" }}>R{item?.price?.toFixed(2) || "0.00"}</Text>
          </View>

          <Text style={{ color: NG.c.muted, marginTop: 8, lineHeight: 18 }}>
            {item?.description || item?.sub || ""}
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

