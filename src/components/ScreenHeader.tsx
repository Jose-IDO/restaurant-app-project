import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NG } from "./ui/noirGold.ui";

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export default function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        minHeight: 44,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={{ marginRight: 10, padding: 4 }}>
            <Feather name="arrow-left" size={24} color={NG.c.text} />
          </Pressable>
        ) : null}
        <Text
          style={{
            color: NG.c.gold,
            fontWeight: "900",
            fontSize: 22,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {right ? <View style={{ marginLeft: 8 }}>{right}</View> : null}
    </View>
  );
}
