import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Divider, PrimaryButton, NG } from "../../components/ui/noirGold.ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateCartItem } from "../../store/slices/cartSlice";
import { FoodItem } from "../../types";

interface EditCartItemScreenProps {
  route?: { params?: { cartItemId: string } };
  navigation?: any;
}

export default function EditCartItemScreen({ route, navigation }: EditCartItemScreenProps) {
  const cartItemId = route?.params?.cartItemId;
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector(state => state.cart);
  const { items: foodItems } = useAppSelector(state => state.food);

  const cartItem = cartItems.find(i => i.id === cartItemId);
  const item: FoodItem | null = cartItem
    ? (foodItems.find(f => f.id === cartItem.foodItemId) || null)
    : null;

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<{ id: string; name: string; price: number } | null>(null);
  const [optionalIngredientIncluded, setOptionalIngredientIncluded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!cartItem || !item) return;
    setQuantity(cartItem.quantity);
    setSelectedExtras(cartItem.selectedExtras.map(e => e.id));
    setSpecialInstructions(cartItem.specialInstructions || "");
    setSelectedSides(cartItem.selectedSides?.map(s => s.id) ?? []);
    setSelectedDrink(cartItem.selectedDrink ?? null);
    const defaults: Record<string, boolean> = {};
    item.optionalIngredients?.forEach(opt => {
      const removed = cartItem.removedIngredients?.includes(opt.name);
      const added = cartItem.addedIngredients?.includes(opt.name);
      defaults[opt.id] = added ? true : (removed ? false : (opt.defaultIncluded !== false));
    });
    setOptionalIngredientIncluded(defaults);
  }, [cartItem?.id, item?.id]);

  if (!cartItem || !item) {
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
    item.extras?.forEach(extra => {
      if (selectedExtras.includes(extra.id)) total += extra.price;
    });
    const drinkAdd = selectedDrink?.price ?? 0;
    return (total + drinkAdd) * quantity;
  };

  const handleSave = () => {
    if (item.sideOptions && item.sideOptions.length > 0 && (selectedSides.length < 1 || selectedSides.length > 2)) {
      return;
    }

    const selectedExtrasData = item.extras?.filter(extra => selectedExtras.includes(extra.id)) || [];
    const sidesData =
      item.sideOptions && selectedSides.length > 0
        ? (selectedSides.map(id => item!.sideOptions!.find(s => s.id === id)).filter(Boolean) as Array<{ id: string; name: string }>)
        : undefined;
    const removedIngredients = item.optionalIngredients
      ?.filter(opt => opt.defaultIncluded && !optionalIngredientIncluded[opt.id])
      .map(o => o.name);
    const addedIngredients = item.optionalIngredients
      ?.filter(opt => !opt.defaultIncluded && optionalIngredientIncluded[opt.id])
      .map(o => o.name);

    dispatch(
      updateCartItem({
        id: cartItemId!,
        updates: {
          quantity,
          selectedExtras: selectedExtrasData,
          specialInstructions: specialInstructions || undefined,
          selectedSides: sidesData?.length ? sidesData : undefined,
          selectedDrink: selectedDrink || undefined,
          removedIngredients: removedIngredients?.length ? removedIngredients : undefined,
          addedIngredients: addedIngredients?.length ? addedIngredients : undefined,
        },
      })
    );
    navigation?.goBack();
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId) ? prev.filter(id => id !== extraId) : [...prev, extraId]
    );
  };
  const toggleSide = (sideId: string) => {
    if (!item?.sideOptions) return;
    setSelectedSides(prev => {
      if (prev.includes(sideId)) return prev.filter(id => id !== sideId);
      if (prev.length >= 2) return prev;
      return [...prev, sideId];
    });
  };
  const toggleOptionalIngredient = (optId: string) => {
    setOptionalIngredientIncluded(prev => ({ ...prev, [optId]: !prev[optId] }));
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

      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          {item.img && item.img.trim() !== "" ? (
            <Image source={{ uri: item.img }} style={{ width: 64, height: 64, borderRadius: 12 }} />
          ) : (
            <View style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: NG.c.panel2, alignItems: "center", justifyContent: "center" }}>
              <Feather name="image" size={28} color={NG.c.muted2} />
            </View>
          )}
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ color: NG.c.text, fontSize: 20, fontWeight: "900" }}>{item.title}</Text>
            <Text style={{ color: NG.c.gold, fontWeight: "800" }}>R{item.price.toFixed(2)}</Text>
          </View>
        </View>

        {item.sideOptions && item.sideOptions.length > 0 && (
          <>
            <Divider />
            <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Sides (pick 1 or 2)</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {item.sideOptions.map(side => (
                <Pressable key={side.id} onPress={() => toggleSide(side.id)}>
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: selectedSides.includes(side.id) ? NG.c.gold : NG.c.stroke,
                      backgroundColor: selectedSides.includes(side.id) ? NG.c.gold + "22" : "transparent",
                    }}
                  >
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
                    {drink.price > 0 && <Text style={{ color: NG.c.gold, fontWeight: "800" }}>+ R{drink.price.toFixed(2)}</Text>}
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 1,
                        borderColor: NG.c.stroke,
                        backgroundColor: selectedDrink?.id === drink.id ? NG.c.gold : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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
            {item.optionalIngredients.map(opt => (
              <Pressable key={opt.id} onPress={() => toggleOptionalIngredient(opt.id)}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 }}>
                  <Text style={{ color: NG.c.text, fontWeight: "800" }}>{opt.name}</Text>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: NG.c.stroke,
                      backgroundColor: optionalIngredientIncluded[opt.id] !== false ? NG.c.gold : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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
            <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Extras</Text>
            {item.extras.map(extra => (
              <Pressable key={extra.id} onPress={() => toggleExtra(extra.id)}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 }}>
                  <Text style={{ color: NG.c.text, fontWeight: "800" }}>{extra.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: NG.c.gold, fontWeight: "800" }}>+ R{extra.price.toFixed(2)}</Text>
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: NG.c.stroke,
                        backgroundColor: selectedExtras.includes(extra.id) ? NG.c.gold : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedExtras.includes(extra.id) ? <Feather name="check" size={14} color="#151515" /> : null}
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}

        <Divider />
        <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 10 }}>Special Instructions</Text>
        <TextInput
          placeholder="Any special requests?"
          placeholderTextColor={NG.c.muted2}
          style={{
            color: NG.c.text,
            minHeight: 44,
            backgroundColor: NG.c.panel2,
            borderRadius: NG.r.md,
            borderWidth: 1,
            borderColor: NG.c.stroke,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          multiline
        />

        <Divider />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900" }}>Quantity</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <View style={{ width: 34, height: 34, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: NG.c.panel2, borderWidth: 1, borderColor: NG.c.stroke }}>
                <Feather name="minus" size={18} color={NG.c.gold} />
              </View>
            </Pressable>
            <Text style={{ color: NG.c.text, fontWeight: "900", minWidth: 44, textAlign: "center" }}>{quantity}</Text>
            <Pressable onPress={() => setQuantity(quantity + 1)}>
              <View style={{ width: 34, height: 34, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: NG.c.panel2, borderWidth: 1, borderColor: NG.c.stroke }}>
                <Feather name="plus" size={18} color={NG.c.gold} />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: "absolute", left: 18, right: 18, bottom: 20 }}>
        <PrimaryButton label={`Save changes - R${calculateTotal().toFixed(2)}`} onPress={handleSave} />
      </View>
    </Screen>
  );
}
