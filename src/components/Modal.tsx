import React from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NG } from "./ui/noirGold.ui";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function CustomModal({ visible, onClose, title, children }: ModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        paddingHorizontal: 18,
      }}>
        <View style={{
          backgroundColor: NG.c.panel2,
          borderRadius: NG.r.xl,
          borderWidth: 1,
          borderColor: NG.c.stroke,
          padding: 18,
          maxHeight: "90%",
        }}>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}>
            <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 20 }}>
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: NG.c.panel,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Feather name="x" size={18} color={NG.c.text} />
              </View>
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

