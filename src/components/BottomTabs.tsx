import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NG } from "./ui/noirGold.ui";

interface TabItem {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  route?: string;
}

interface BottomTabsProps {
  activeTab?: string;
  onTabPress?: (route: string) => void;
}

export function BottomTabs({ activeTab = "Menu", onTabPress }: BottomTabsProps) {
  const tabs: TabItem[] = [
    { label: "Menu", icon: "coffee", route: "Home" },
    { label: "Cart", icon: "shopping-bag", route: "Cart" },
    { label: "Profile", icon: "user", route: "Profile" },
  ];

  return (
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
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <Pressable
            key={tab.label}
            onPress={() => onTabPress?.(tab.route || tab.label)}
          >
            <View style={{ alignItems: "center", gap: 6 }}>
              <Feather
                name={tab.icon}
                size={18}
                color={isActive ? NG.c.gold : "rgba(237,237,237,0.55)"}
              />
              <Text style={{
                color: isActive ? NG.c.gold : "rgba(237,237,237,0.55)",
                fontWeight: "800",
                fontSize: 12,
              }}>
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

