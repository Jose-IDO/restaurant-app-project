import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card, NG, PrimaryButton } from "./ui/noirGold.ui";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <Card style={{ backgroundColor: "rgba(220, 53, 69, 0.1)", borderColor: "#dc3545" }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <Feather name="alert-circle" size={20} color="#dc3545" />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#dc3545", fontWeight: "900", marginBottom: 4 }}>
            Error
          </Text>
          <Text style={{ color: NG.c.text, fontSize: 13, lineHeight: 18 }}>
            {message}
          </Text>
          {(onRetry || onDismiss) && (
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              {onRetry && (
                <Pressable onPress={onRetry} style={{ flex: 1 }}>
                  <View style={{
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: NG.c.gold,
                    alignItems: "center",
                  }}>
                    <Text style={{ color: "#151515", fontWeight: "800", fontSize: 12 }}>
                      Retry
                    </Text>
                  </View>
                </Pressable>
              )}
              {onDismiss && (
                <Pressable onPress={onDismiss} style={{ flex: 1 }}>
                  <View style={{
                    paddingVertical: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: NG.c.stroke,
                    alignItems: "center",
                  }}>
                    <Text style={{ color: NG.c.text, fontWeight: "800", fontSize: 12 }}>
                      Dismiss
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}
        </View>
        {onDismiss && !onRetry && (
          <Pressable onPress={onDismiss}>
            <Feather name="x" size={18} color={NG.c.muted} />
          </Pressable>
        )}
      </View>
    </Card>
  );
}

