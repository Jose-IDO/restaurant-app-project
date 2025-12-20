import React, { useState } from "react";
import { View, Text, Image, FlatList, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, Pill, NG } from "../../components/ui/noirGold.ui";
import { FoodCategory } from "../../types";

interface FoodItem {
  id: string;
  title: string;
  sub: string;
  img: string;
  category: FoodCategory;
  price: number;
}

interface HomeScreenProps {
  navigation?: any;
  foodItems?: FoodItem[];
  categories?: FoodCategory[];
  onItemPress?: (itemId: string) => void;
}

const DEFAULT_CATEGORIES: FoodCategory[] = ["Starters", "Mains", "Burgers", "Dessert", "Beverages", "Alcohols"];

const DEFAULT_DATA: FoodItem[] = [
  {
    id: "1",
    title: "Seared Scallops",
    sub: "Pan-seared scallops with cauliflower purée...",
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=70",
    category: "Starters",
    price: 24.99,
  },
  {
    id: "2",
    title: "Oysters Rockefeller",
    sub: "Fresh oysters baked with spinach, parmesan...",
    img: "https://images.unsplash.com/photo-1541542684-4bf98d9f7c25?auto=format&fit=crop&w=1200&q=70",
    category: "Starters",
    price: 28.99,
  },
  {
    id: "3",
    title: "Foie Gras Terrine",
    sub: "House-made foie gras with fig compote...",
    img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=70",
    category: "Starters",
    price: 32.99,
  },
  {
    id: "4",
    title: "Wagyu Beef Steak",
    sub: "A5 Japanese Wagyu ribeye with roasted garnish...",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=70",
    category: "Mains",
    price: 89.99,
  },
];

function FoodCard({ item, onPress }: { item: FoodItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={{
        flex: 1,
        backgroundColor: NG.c.panel,
        borderRadius: NG.r.lg,
        borderWidth: 1,
        borderColor: NG.c.stroke,
        overflow: "hidden",
        margin: 6,
      }}>
        <Image source={{ uri: item.img }} style={{ width: "100%", height: 120 }} />
        <View style={{ padding: 12 }}>
          <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 14 }}>{item.title}</Text>
          <Text numberOfLines={2} style={{ color: NG.c.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
            {item.sub}
          </Text>
          <Text style={{ color: NG.c.gold, marginTop: 8, fontWeight: "900", fontSize: 14 }}>
            R{item.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation, foodItems = DEFAULT_DATA, categories = DEFAULT_CATEGORIES, onItemPress }: HomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);

  const filteredItems = selectedCategory
    ? foodItems.filter(item => item.category === selectedCategory)
    : foodItems;

  const handleItemPress = (itemId: string) => {
    if (onItemPress) {
      onItemPress(itemId);
    } else if (navigation) {
      navigation.navigate("FoodItemDetail", { itemId });
    }
  };

  return (
    <Screen>
      <TitleLogo subtitle="Fine Dining Experience" />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <Pill
          label="All"
          selected={selectedCategory === null}
          leftIcon={<Feather name="x" size={14} color={selectedCategory === null ? "#151515" : NG.c.text} />}
          onPress={() => setSelectedCategory(null)}
        />
        {categories.map((cat) => (
          <Pill
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            leftIcon={<Feather name="coffee" size={14} color={selectedCategory === cat ? "#151515" : NG.c.text} />}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </View>

      <FlatList
        style={{ marginTop: 14 }}
        data={filteredItems}
        keyExtractor={(x) => x.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 110 }}
        renderItem={({ item }) => <FoodCard item={item} onPress={() => handleItemPress(item.id)} />}
      />

      {/* Bottom tab UI (static) */}
      <View style={{
        position: "absolute",
        left: 0, right: 0, bottom: 0,
        paddingHorizontal: 26,
        paddingTop: 10, paddingBottom: 18,
        borderTopWidth: 1,
        borderTopColor: NG.c.stroke,
        backgroundColor: "#0B0C0E",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        <TabItem label="Menu" icon="coffee" active onPress={() => {}} />
        <TabItem label="Cart" icon="shopping-bag" onPress={() => navigation?.navigate("Cart")} />
        <TabItem label="Profile" icon="user" onPress={() => navigation?.navigate("Profile")} />
      </View>
    </Screen>
  );
}

function TabItem({ label, icon, active, onPress }: { label: string; icon: keyof typeof Feather.glyphMap; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={{ alignItems: "center", gap: 6 }}>
        <Feather name={icon} size={18} color={active ? NG.c.gold : "rgba(237,237,237,0.55)"} />
        <Text style={{ color: active ? NG.c.gold : "rgba(237,237,237,0.55)", fontWeight: "800", fontSize: 12 }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

