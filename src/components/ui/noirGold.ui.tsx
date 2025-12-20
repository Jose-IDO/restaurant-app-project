import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

export const NG = {
  c: {
    bg: "#0B0C0E",
    bg2: "#101215",
    panel: "#15171A",
    panel2: "#1B1E22",
    stroke: "rgba(255,255,255,0.08)",
    text: "#EDEDED",
    muted: "rgba(237,237,237,0.70)",
    muted2: "rgba(237,237,237,0.45)",
    gold: "#D6B13F",
  },
  r: { xl: 22, lg: 18, md: 14, sm: 10 },
};

export function Screen({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <LinearGradient colors={[NG.c.bg, NG.c.bg2, NG.c.bg]} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: padded ? 18 : 0, paddingTop: 10 }}>
        {children}
      </View>
    </LinearGradient>
  );
}

export function TitleLogo({
  subtitle = "Fine Dining Experience",
}: {
  subtitle?: string;
}) {
  return (
    <View style={{ alignItems: "center", marginTop: 6 }}>
      <Text style={{ color: NG.c.gold, fontSize: 34, fontWeight: "900" }}>Noir & Gold</Text>
      <Text style={{ color: NG.c.muted, marginTop: 6 }}>{subtitle}</Text>
    </View>
  );
}

export function Pill({
  label,
  selected,
  leftIcon,
  onPress,
}: {
  label: string;
  selected?: boolean;
  leftIcon?: React.ReactNode;
  onPress?: () => void;
}) {
  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: selected ? NG.c.gold : NG.c.panel2,
        borderWidth: 1,
        borderColor: selected ? "transparent" : NG.c.stroke,
      }}
    >
      {leftIcon}
      <Text style={{ color: selected ? "#151515" : NG.c.text, fontWeight: "800", fontSize: 13 }}>
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}) {
  const content = (
    <View
      style={[
        {
          backgroundColor: NG.c.panel2,
          borderRadius: NG.r.lg,
          borderWidth: 1,
          borderColor: NG.c.stroke,
          padding: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

export function PrimaryButton({
  label,
  icon,
  onPress,
  disabled,
}: {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        style={{
          backgroundColor: disabled ? NG.c.panel2 : NG.c.gold,
          borderRadius: NG.r.lg,
          paddingVertical: 14,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {icon ? <Feather name={icon} size={18} color={disabled ? NG.c.muted : "#151515"} /> : null}
        <Text style={{ color: disabled ? NG.c.muted : "#151515", fontWeight: "900" }}>{label}</Text>
      </View>
    </Pressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          borderRadius: 999,
          borderWidth: 1,
          borderColor: NG.c.stroke,
          paddingVertical: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: NG.c.text, fontWeight: "800" }}>{label}</Text>
      </View>
    </Pressable>
  );
}

export function Input({
  icon,
  placeholder,
  width,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  width?: any;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: NG.c.panel2,
        borderRadius: NG.r.md,
        borderWidth: 1,
        borderColor: NG.c.stroke,
        paddingHorizontal: 12,
        paddingVertical: 12,
        width: width ?? "100%",
        marginBottom: 12,
      }}
    >
      <Feather name={icon} size={16} color={NG.c.gold} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={NG.c.muted2}
        style={{ flex: 1, color: NG.c.text, fontWeight: "700" }}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

export function Divider({ mt = 16, mb = 16 }: { mt?: number; mb?: number }) {
  return <View style={{ height: 1, backgroundColor: NG.c.stroke, marginTop: mt, marginBottom: mb }} />;
}

