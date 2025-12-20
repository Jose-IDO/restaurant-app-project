import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NG } from "./ui/noirGold.ui";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ quantity, onQuantityChange, min = 1, max }: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (!max || quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Pressable onPress={handleDecrease}>
        <View style={{
          width: 34, height: 34,
          borderRadius: 999,
          backgroundColor: NG.c.panel2,
          borderWidth: 1,
          borderColor: NG.c.stroke,
          alignItems: "center",
          justifyContent: "center",
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

      <Pressable onPress={handleIncrease}>
        <View style={{
          width: 34, height: 34,
          borderRadius: 999,
          backgroundColor: NG.c.panel2,
          borderWidth: 1,
          borderColor: NG.c.stroke,
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Feather name="plus" size={18} color={NG.c.gold} />
        </View>
      </Pressable>
    </View>
  );
}

