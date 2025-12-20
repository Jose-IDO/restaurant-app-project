import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";

interface AdminOrdersScreenProps {
  navigation?: any;
}

const SAMPLE_ORDERS = [
  {
    id: "ORD001",
    customer: "John Doe",
    items: 3,
    total: 125.50,
    status: "pending",
    date: "2025-12-20",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    items: 2,
    total: 89.99,
    status: "preparing",
    date: "2025-12-20",
  },
  {
    id: "ORD003",
    customer: "Mike Johnson",
    items: 4,
    total: 156.75,
    status: "ready",
    date: "2025-12-19",
  },
];

export default function AdminOrdersScreen({ navigation }: AdminOrdersScreenProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#ffc107";
      case "preparing": return "#007bff";
      case "ready": return "#28a745";
      case "out_for_delivery": return "#6f42c1";
      case "delivered": return "#28a745";
      case "cancelled": return "#dc3545";
      default: return NG.c.muted;
    }
  };

  return (
    <Screen>
      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
        Order Management
      </Text>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        {SAMPLE_ORDERS.map((order) => (
          <Card key={order.id} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <View>
                <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 16 }}>Order #{order.id}</Text>
                <Text style={{ color: NG.c.muted, marginTop: 4 }}>{order.customer}</Text>
              </View>
              <View style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                backgroundColor: getStatusColor(order.status),
              }}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 11 }}>
                  {order.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <Text style={{ color: NG.c.muted }}>{order.items} items</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900" }}>R{order.total.toFixed(2)}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Pressable style={{ flex: 1 }}>
                <View style={{
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: NG.c.stroke,
                  alignItems: "center",
                }}>
                  <Text style={{ color: NG.c.text, fontWeight: "800", fontSize: 12 }}>View</Text>
                </View>
              </Pressable>
              <Pressable style={{ flex: 1 }}>
                <View style={{
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: NG.c.gold,
                  alignItems: "center",
                }}>
                  <Text style={{ color: "#151515", fontWeight: "800", fontSize: 12 }}>Update Status</Text>
                </View>
              </Pressable>
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

