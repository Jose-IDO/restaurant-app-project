import React, { useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, PrimaryButton, Card, NG } from "../../components/ui/noirGold.ui";
import { FOOD_ITEMS } from "../../data/foodItems";
import { FoodCategory } from "../../types";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

interface AdminFoodManagementScreenProps {
  navigation?: any;
}

export default function AdminFoodManagementScreen({ navigation }: AdminFoodManagementScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);

  const filteredItems = selectedCategory
    ? FOOD_ITEMS.filter(item => item.category === selectedCategory)
    : FOOD_ITEMS;

  const categories: FoodCategory[] = ["Starters", "Mains", "Desserts", "Drinks", "Sides"];

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
          Food Management
        </Text>
        <Pressable>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: NG.c.gold,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Feather name="plus" size={20} color="#151515" />
          </View>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <Pressable
          onPress={() => setSelectedCategory(null)}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 999,
            backgroundColor: selectedCategory === null ? NG.c.gold : NG.c.panel2,
            borderWidth: 1,
            borderColor: selectedCategory === null ? "transparent" : NG.c.stroke,
          }}
        >
          <Text style={{
            color: selectedCategory === null ? "#151515" : NG.c.text,
            fontWeight: "800",
            fontSize: 13,
          }}>
            All
          </Text>
        </Pressable>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: selectedCategory === cat ? NG.c.gold : NG.c.panel2,
              borderWidth: 1,
              borderColor: selectedCategory === cat ? "transparent" : NG.c.stroke,
            }}
          >
            <Text style={{
              color: selectedCategory === cat ? "#151515" : NG.c.text,
              fontWeight: "800",
              fontSize: 13,
            }}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingRight: 18 }}
        nestedScrollEnabled={true}
      >
        {filteredItems.map((item) => (
          <Card key={item.id} style={{ width: CARD_WIDTH, marginRight: 12 }}>
            <Image source={{ uri: item.img }} style={{ width: "100%", height: 150, borderRadius: 10, marginBottom: 12 }} />
            <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }} numberOfLines={2}>
              {item.sub}
            </Text>
            <Text style={{ color: NG.c.gold, marginTop: 10, fontWeight: "900" }}>
              R{item.price.toFixed(2)}
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Pressable style={{ flex: 1 }}>
                <View style={{
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: NG.c.stroke,
                  alignItems: "center",
                }}>
                  <Feather name="edit" size={16} color={NG.c.gold} />
                </View>
              </Pressable>
              <Pressable style={{ flex: 1 }}>
                <View style={{
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ff3b30",
                  alignItems: "center",
                }}>
                  <Feather name="trash-2" size={16} color="#ff3b30" />
                </View>
              </Pressable>
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

