import React, { useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Dimensions, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Screen, PrimaryButton, Card, NG, Input } from "../../components/ui/noirGold.ui";
import { FoodCategory, FoodItem } from "../../types";
import CustomModal from "../../components/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading, setFoodItems, addFoodItem, updateFoodItem, deleteFoodItem, setError } from "../../store/slices/foodSlice";
import { foodService } from "../../services/foodService";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

interface AdminFoodManagementScreenProps {
  navigation?: any;
}

export default function AdminFoodManagementScreen({ navigation }: AdminFoodManagementScreenProps) {
  const dispatch = useAppDispatch();
  const { items: foodItems, isLoading, error: reduxError } = useAppSelector(state => state.food);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const error = localError || reduxError;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    sub: "",
    img: "",
    category: "Starters" as FoodCategory,
    price: "",
    description: "",
    ingredients: "",
  });

  const filteredItems = selectedCategory
    ? foodItems.filter(item => item.category === selectedCategory)
    : foodItems;

  const categories: FoodCategory[] = ["Starters", "Mains", "Desserts", "Drinks", "Sides"];

  const handleAddItem = () => {
    setFormData({
      title: "",
      sub: "",
      img: "",
      category: "Starters",
      price: "",
      description: "",
      ingredients: "",
    });
    setSelectedImage(null);
    setEditingItem(null);
    setLocalError(null);
    dispatch(setError(null));
    setShowAddModal(true);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to pick image');
    }
  };

  const handleEditItem = (item: FoodItem) => {
    setFormData({
      title: item.title,
      sub: item.sub,
      img: item.img,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      ingredients: item.ingredients.join(", "),
    });
    setSelectedImage(null);
    setEditingItem(item);
    setLocalError(null);
    dispatch(setError(null));
    setShowAddModal(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      dispatch(setLoading(true));
      setLocalError(null);
      dispatch(setError(null));
      const item = foodItems.find(i => i.id === itemId);
      await foodService.deleteFoodItem(itemId, item?.img);
      dispatch(deleteFoodItem(itemId));
    } catch (error: any) {
      setLocalError(error.message || 'Failed to delete item');
      dispatch(setError(error.message || 'Failed to delete item'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSaveItem = async () => {
    if (!formData.title || !formData.price) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      setLocalError(null);
      dispatch(setError(null));

      const itemData = {
        title: formData.title,
        sub: formData.sub,
        img: formData.img,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        ingredients: formData.ingredients.split(",").map(i => i.trim()).filter(i => i),
        extras: editingItem?.extras || [],
        isAvailable: true,
      };

      if (editingItem) {
        await foodService.updateFoodItem(editingItem.id, itemData, selectedImage || undefined);
        const updatedItem = await foodService.getFoodItemById(editingItem.id);
        if (updatedItem) {
          dispatch(updateFoodItem(updatedItem));
        }
      } else {
        const newItem = await foodService.createFoodItem(itemData, selectedImage || undefined);
        dispatch(addFoodItem(newItem));
      }

      setShowAddModal(false);
      setEditingItem(null);
      setSelectedImage(null);
    } catch (error: any) {
      setLocalError(error.message || 'Failed to save item');
      dispatch(setError(error.message || 'Failed to save item'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
          Food Management
        </Text>
        <Pressable onPress={handleAddItem}>
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
              <Pressable style={{ flex: 1 }} onPress={() => handleEditItem(item)}>
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
              <Pressable style={{ flex: 1 }} onPress={() => handleDeleteItem(item.id)}>
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

      {isLoading && <LoadingSpinner fullScreen message="Saving item..." />}
      {error && (
        <View style={{ position: "absolute", top: 60, left: 18, right: 18, zIndex: 1000 }}>
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </View>
      )}

      <CustomModal
        visible={showAddModal}
        onClose={() => {
          if (!isLoading) {
            setShowAddModal(false);
            setEditingItem(null);
            setSelectedImage(null);
            setLocalError(null);
            dispatch(setError(null));
          }
        }}
        title={editingItem ? "Edit Food Item" : "Add Food Item"}
      >
        <View style={{ gap: 12 }}>
          {error && <ErrorMessage message={error} onDismiss={() => { setLocalError(null); dispatch(setError(null)); }} />}
          <Input
            icon="type"
            placeholder="Item Name"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          <Input
            icon="file-text"
            placeholder="Subtitle"
            value={formData.sub}
            onChangeText={(text) => setFormData({ ...formData, sub: text })}
          />
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: NG.c.text, fontWeight: "800", marginBottom: 8, fontSize: 13 }}>
              Food Image
            </Text>
            {(selectedImage || formData.img) && (
              <View style={{ marginBottom: 12 }}>
                <Image
                  source={{ uri: selectedImage || formData.img }}
                  style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 8 }}
                  resizeMode="cover"
                />
                {selectedImage && (
                  <Pressable onPress={() => setSelectedImage(null)}>
                    <Text style={{ color: "#ff3b30", fontWeight: "800", fontSize: 12, textAlign: "center" }}>
                      Remove Image
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
            <Pressable onPress={pickImage}>
              <View style={{
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                borderStyle: "dashed",
                alignItems: "center",
                backgroundColor: NG.c.panel,
              }}>
                <Feather name="upload" size={24} color={NG.c.gold} />
                <Text style={{ color: NG.c.text, fontWeight: "800", marginTop: 8 }}>
                  {selectedImage || formData.img ? "Change Image" : "Upload Image"}
                </Text>
                <Text style={{ color: NG.c.muted2, fontSize: 11, marginTop: 4 }}>
                  Tap to select from gallery
                </Text>
              </View>
            </Pressable>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: NG.c.text, fontWeight: "800", marginBottom: 8, fontSize: 13 }}>
              Category
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setFormData({ ...formData, category: cat })}
                >
                  <View style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: formData.category === cat ? NG.c.gold : NG.c.panel2,
                    borderWidth: 1,
                    borderColor: formData.category === cat ? "transparent" : NG.c.stroke,
                  }}>
                    <Text style={{
                      color: formData.category === cat ? "#151515" : NG.c.text,
                      fontWeight: "800",
                      fontSize: 12,
                    }}>
                      {cat}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
          <Input
            icon="dollar-sign"
            placeholder="Price"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            keyboardType="decimal-pad"
          />
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: NG.c.text, fontWeight: "800", marginBottom: 8, fontSize: 13 }}>
              Description
            </Text>
            <TextInput
              style={{
                backgroundColor: NG.c.panel2,
                borderRadius: NG.r.md,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                padding: 12,
                color: NG.c.text,
                minHeight: 80,
                textAlignVertical: "top",
              }}
              placeholder="Item description"
              placeholderTextColor={NG.c.muted2}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
            />
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: NG.c.text, fontWeight: "800", marginBottom: 8, fontSize: 13 }}>
              Ingredients (comma-separated)
            </Text>
            <TextInput
              style={{
                backgroundColor: NG.c.panel2,
                borderRadius: NG.r.md,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                padding: 12,
                color: NG.c.text,
                minHeight: 60,
                textAlignVertical: "top",
              }}
              placeholder="Ingredient 1, Ingredient 2, ..."
              placeholderTextColor={NG.c.muted2}
              value={formData.ingredients}
              onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
              multiline
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <PrimaryButton
              label={editingItem ? "Update Item" : "Add Item"}
              onPress={handleSaveItem}
              disabled={isLoading}
            />
          </View>
          {isLoading && <LoadingSpinner message="Saving..." />}
        </View>
      </CustomModal>
    </Screen>
  );
}

