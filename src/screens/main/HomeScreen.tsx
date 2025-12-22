import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, TitleLogo, NG } from "../../components/ui/noirGold.ui";
import { FoodCategory, FoodItem } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading, setFoodItems, setError } from "../../store/slices/foodSlice";
import { foodService } from "../../services/foodService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

interface HomeScreenProps {
  navigation?: any;
  foodItems?: FoodItem[];
  onItemPress?: (itemId: string) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7; // 70% of screen width for each card

const CATEGORIES: FoodCategory[] = ["Starters", "Mains", "Desserts", "Drinks", "Sides"];

function FoodCard({ item, onPress }: { item: FoodItem; onPress: () => void }) {
  const hasImage = item.img && item.img.trim() !== "";

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
        {hasImage ? (
          <Image source={{ uri: item.img }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
        ) : (
          <View style={{ width: "100%", height: 180, backgroundColor: NG.c.panel2, alignItems: "center", justifyContent: "center" }}>
            <Feather name="image" size={48} color={NG.c.muted2} />
            <Text style={{ color: NG.c.muted2, fontSize: 12, marginTop: 8 }}>No image</Text>
          </View>
        )}
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

export default function HomeScreen({ navigation, foodItems, onItemPress }: HomeScreenProps) {
  const dispatch = useAppDispatch();
  const { items: reduxFoodItems, isLoading, error } = useAppSelector(state => state.food);
  const displayItems = foodItems || reduxFoodItems;

  useEffect(() => {
    const loadFoodItems = async () => {
      if (reduxFoodItems.length === 0) {
        try {
          dispatch(setLoading(true));
          const items = await foodService.getAllFoodItems();
          dispatch(setFoodItems(items));
        } catch (error: any) {
          dispatch(setError(error.message || "Failed to load menu items"));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    loadFoodItems();
  }, []);

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
    items: displayItems.filter(item => item.category === category),
  }));

  if (isLoading && displayItems.length === 0) {
    return (
      <Screen>
        <TitleLogo subtitle="Fine Dining Experience" />
        <LoadingSpinner message="Loading menu..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <TitleLogo subtitle="Fine Dining Experience" />
      
      {error && (
        <View style={{ marginTop: 12, paddingHorizontal: 18 }}>
          <ErrorMessage message={error} onRetry={() => {
            dispatch(setError(null));
            const loadFoodItems = async () => {
              try {
                dispatch(setLoading(true));
                const items = await foodService.getAllFoodItems();
                dispatch(setFoodItems(items));
              } catch (error: any) {
                dispatch(setError(error.message || "Failed to load menu items"));
              } finally {
                dispatch(setLoading(false));
              }
            };
            loadFoodItems();
          }} />
        </View>
      )}
      
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
        {displayItems.length === 0 && !isLoading && (
          <View style={{ alignItems: "center", padding: 40 }}>
            <Feather name="coffee" size={48} color={NG.c.muted2} />
            <Text style={{ color: NG.c.muted, marginTop: 12 }}>No menu items available</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
