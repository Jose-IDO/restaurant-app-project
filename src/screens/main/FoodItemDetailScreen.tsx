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
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<{ id: string; name: string; price: number } | null>(null);
  const [optionalIngredientIncluded, setOptionalIngredientIncluded] = useState<Record<string, boolean>>({});

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
    setQuantity(1);
    setSelectedExtras([]);
    setSpecialInstructions("");
    setSelectedSides([]);
    setSelectedDrink(null);
    const defaults: Record<string, boolean> = {};
    item?.optionalIngredients?.forEach(opt => {
      defaults[opt.id] = opt.defaultIncluded !== false;
    });
    setOptionalIngredientIncluded(defaults);
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
    const drinkAdd = selectedDrink?.price ?? 0;
    return (total + drinkAdd) * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;

    if (item.sideOptions && item.sideOptions.length > 0) {
      if (selectedSides.length < 1 || selectedSides.length > 2) {
        return; // validation: need 1 or 2 sides
      }
    }

    const selectedExtrasData = item.extras?.filter(extra => selectedExtras.includes(extra.id)) || [];
    const sidesData = item.sideOptions && selectedSides.length > 0
      ? selectedSides
          .map(id => item!.sideOptions!.find(s => s.id === id))
          .filter(Boolean) as Array<{ id: string; name: string }>
      : undefined;
    const removedIngredients = item.optionalIngredients
      ?.filter(opt => opt.defaultIncluded && !optionalIngredientIncluded[opt.id])
      .map(o => o.name);
    const addedIngredients = item.optionalIngredients
      ?.filter(opt => !opt.defaultIncluded && optionalIngredientIncluded[opt.id])
      .map(o => o.name);

    dispatch(addToCart({
      id: `${item.id}_${Date.now()}`,
      foodItemId: item.id,
      foodItemTitle: item.title,
      foodItemImage: item.img,
      price: item.price,
      quantity,
      selectedExtras: selectedExtrasData,
      specialInstructions: specialInstructions || undefined,
      selectedSides: sidesData?.length ? sidesData : undefined,
      selectedDrink: selectedDrink || undefined,
      removedIngredients: removedIngredients?.length ? removedIngredients : undefined,
      addedIngredients: addedIngredients?.length ? addedIngredients : undefined,
      category: item.category,
    }));

    navigation?.goBack();
  };

  const toggleSide = (sideId: string) => {
    if (!item?.sideOptions) return;
    setSelectedSides(prev => {
      if (prev.includes(sideId)) {
        return prev.filter(id => id !== sideId);
      }
      if (prev.length >= 2) return prev;
      return [...prev, sideId];
    });
  };

  const toggleOptionalIngredient = (optId: string) => {
    setOptionalIngredientIncluded(prev => ({ ...prev, [optId]: !prev[optId] }));
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

          {item.sideOptions && item.sideOptions.length > 0 && (
            <>
              <Divider />
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Choose your sides (pick 1 or 2)</Text>
              <Text style={{ color: NG.c.muted, fontSize: 12, marginBottom: 10 }}>Price included</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {item.sideOptions.map(side => (
                  <Pressable key={side.id} onPress={() => toggleSide(side.id)}>
                    <View style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: selectedSides.includes(side.id) ? NG.c.gold : NG.c.stroke,
                      backgroundColor: selectedSides.includes(side.id) ? NG.c.gold + "22" : "transparent",
                    }}>
                      <Text style={{ color: NG.c.text, fontWeight: "800" }}>{side.name}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {item.drinkOptions && item.drinkOptions.length > 0 && (
            <>
              <Divider />
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Drink</Text>
              {item.drinkOptions.map(drink => (
                <Pressable key={drink.id} onPress={() => setSelectedDrink(selectedDrink?.id === drink.id ? null : drink)}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 }}>
                    <Text style={{ color: NG.c.text, fontWeight: "800" }}>{drink.name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      {drink.price > 0 && (
                        <Text style={{ color: NG.c.gold, fontWeight: "800" }}>+ R{drink.price.toFixed(2)}</Text>
                      )}
                      <View style={{
                        width: 18, height: 18,
                        borderRadius: 9,
                        borderWidth: 1,
                        borderColor: NG.c.stroke,
                        backgroundColor: selectedDrink?.id === drink.id ? NG.c.gold : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {selectedDrink?.id === drink.id ? <Feather name="check" size={12} color="#151515" /> : null}
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {item.optionalIngredients && item.optionalIngredients.length > 0 && (
            <>
              <Divider />
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Customise</Text>
              <Text style={{ color: NG.c.muted, fontSize: 12, marginBottom: 10 }}>Include or remove optional ingredients</Text>
              {item.optionalIngredients.map(opt => (
                <Pressable key={opt.id} onPress={() => toggleOptionalIngredient(opt.id)}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 }}>
                    <Text style={{ color: NG.c.text, fontWeight: "800" }}>{opt.name}</Text>
                    <View style={{
                      width: 18, height: 18,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: NG.c.stroke,
                      backgroundColor: optionalIngredientIncluded[opt.id] !== false ? NG.c.gold : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {optionalIngredientIncluded[opt.id] !== false ? <Feather name="check" size={14} color="#151515" /> : null}
                    </View>
                  </View>
                </Pressable>
              ))}
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
        {item.sideOptions && item.sideOptions.length > 0 && (selectedSides.length < 1 || selectedSides.length > 2) && (
          <Text style={{ color: NG.c.muted, fontSize: 12, marginBottom: 8, textAlign: "center" }}>Please select 1 or 2 sides</Text>
        )}
        <PrimaryButton
          label={`Add to Cart - R${calculateTotal().toFixed(2)}`}
          icon="shopping-bag"
          onPress={handleAddToCart}
          disabled={!!(item.sideOptions?.length && (selectedSides.length < 1 || selectedSides.length > 2))}
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

