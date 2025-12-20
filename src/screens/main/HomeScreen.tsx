import React from "react";
import { View, Text, Image, ScrollView, Pressable, Dimensions } from "react-native";
import { Screen, TitleLogo, NG } from "../../components/ui/noirGold.ui";
import { FoodCategory } from "../../types";
import { FOOD_ITEMS, FoodItem } from "../../data/foodItems";

interface HomeScreenProps {
  navigation?: any;
  foodItems?: FoodItem[];
  onItemPress?: (itemId: string) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7; // 70% of screen width for each card

const CATEGORIES: FoodCategory[] = ["Starters", "Mains", "Desserts", "Drinks", "Sides"];

function FoodCard({ item, onPress }: { item: FoodItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={{
        width: CARD_WIDTH,
        backgroundColor: NG.c.panel,
        borderRadius: NG.r.lg,
        borderWidth: 1,
        borderColor: NG.c.stroke,
        overflow: "hidden",
        marginRight: 12,
      }}>
        <Image source={{ uri: item.img }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
        <View style={{ padding: 12 }}>
          <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 16 }}>{item.title}</Text>
          <Text numberOfLines={2} style={{ color: NG.c.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
            {item.sub}
          </Text>
          <Text style={{ color: NG.c.gold, marginTop: 10, fontWeight: "900", fontSize: 16 }}>
            R{item.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function CategorySection({ 
  category, 
  items, 
  onItemPress 
}: { 
  category: FoodCategory; 
  items: FoodItem[]; 
  onItemPress: (item: FoodItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ 
        color: NG.c.gold, 
        fontWeight: "900", 
        fontSize: 20, 
        marginBottom: 12,
        paddingHorizontal: 18,
      }}>
        {category}
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingRight: 6 }}
        nestedScrollEnabled={true}
      >
        {items.map((item) => (
          <FoodCard key={item.id} item={item} onPress={() => onItemPress(item)} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen({ navigation, foodItems = FOOD_ITEMS, onItemPress }: HomeScreenProps) {
  const handleItemPress = (item: FoodItem) => {
    if (onItemPress) {
      onItemPress(item.id);
    } else if (navigation) {
      navigation.navigate("FoodItemDetail", { 
        itemId: item.id,
        foodItem: item 
      });
    }
  };

  // Group items by category
  const itemsByCategory = CATEGORIES.map(category => ({
    category,
    items: foodItems.filter(item => item.category === category),
  }));

  return (
    <Screen>
      <TitleLogo subtitle="Fine Dining Experience" />
      
      <ScrollView 
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        nestedScrollEnabled={true}
      >
        {itemsByCategory.map(({ category, items }) => (
          <CategorySection
            key={category}
            category={category}
            items={items}
            onItemPress={handleItemPress}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}
