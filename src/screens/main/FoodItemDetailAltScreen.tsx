import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Pill, Divider, PrimaryButton, NG } from "../../components/ui/noirGold.ui";

interface FoodItemDetailAltScreenProps {
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
  };
  onAddToCart?: () => void;
}

const DEFAULT_ITEM = {
  id: "1",
  name: "Chocolate Soufflé",
  description: "Decadent dark chocolate soufflé with vanilla bean ice cream",
  price: 24.00,
  image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1400&q=70",
  ingredients: ["Dark Chocolate", "Eggs", "Sugar", "Vanilla Ice Cream", "Gold Leaf"],
};

export default function FoodItemDetailAltScreen({
  route,
  navigation,
  itemId,
  foodItem = DEFAULT_ITEM,
  onAddToCart,
}: FoodItemDetailAltScreenProps) {
  const item = foodItem || DEFAULT_ITEM;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    }
    navigation?.goBack();
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

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 230 }}
        />

        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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

          <Divider />
        </View>
      </ScrollView>

      <View style={{ position: "absolute", left: 18, right: 18, bottom: 20 }}>
        <PrimaryButton
          label={`Add to Cart - R${item.price.toFixed(2)}`}
          icon="shopping-bag"
          onPress={handleAddToCart}
        />
      </View>
    </Screen>
  );
}

