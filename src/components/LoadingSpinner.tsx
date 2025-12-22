import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { NG } from "./ui/noirGold.ui";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
      <ActivityIndicator size="large" color={NG.c.gold} />
      {message && (
        <Text style={{ color: NG.c.muted, marginTop: 12, fontSize: 14 }}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}>
        {content}
      </View>
    );
  }

  return content;
}

