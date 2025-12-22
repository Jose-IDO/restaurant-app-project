import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG, PrimaryButton } from "../../components/ui/noirGold.ui";
import { OrderStatus } from "../../types";

interface AdminDashboardScreenProps {
  navigation?: any;
}

// Sample data - will be replaced with Firebase data
const DASHBOARD_STATS = {
  totalOrders: 152,
  totalRevenue: 13000.00,
  menuItems: 15,
  customers: 156,
  pendingOrders: 8,
  preparingOrders: 12,
  readyOrders: 5,
};

const RECENT_ORDERS = [
  {
    id: "ORD001",
    customer: "John Doe",
    total: 146.97,
    status: "pending" as OrderStatus,
    time: "10:30 AM",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    total: 86.98,
    status: "preparing" as OrderStatus,
    time: "11:15 AM",
  },
  {
    id: "ORD003",
    customer: "Mike Johnson",
    total: 196.96,
    status: "ready" as OrderStatus,
    time: "2:00 PM",
  },
];

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const getStatusColor = (status: OrderStatus) => {
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
          Dashboard
        </Text>
        <Pressable onPress={() => navigation?.navigate("AdminRestaurantSettings")}>
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: NG.c.panel2,
            borderWidth: 1,
            borderColor: NG.c.stroke,
          }}>
            <Feather name="settings" size={18} color={NG.c.gold} />
          </View>
        </Pressable>
      </View>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="shopping-bag" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>
                {DASHBOARD_STATS.totalOrders}
              </Text>
              <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }}>Total Orders</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="dollar-sign" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 20, marginTop: 10 }}>
                R{DASHBOARD_STATS.totalRevenue.toLocaleString()}
              </Text>
              <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }}>Revenue</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="coffee" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>
                {DASHBOARD_STATS.menuItems}
              </Text>
              <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }}>Menu Items</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="users" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>
                {DASHBOARD_STATS.customers}
              </Text>
              <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }}>Customers</Text>
            </View>
          </Card>
        </View>

        <Card style={{ marginBottom: 16 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Order Status</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <View style={{ flex: 1, minWidth: "30%" }}>
              <View style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: NG.c.panel,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                alignItems: "center",
              }}>
                <Text style={{ color: "#ffc107", fontWeight: "900", fontSize: 20 }}>
                  {DASHBOARD_STATS.pendingOrders}
                </Text>
                <Text style={{ color: NG.c.muted, fontSize: 11, marginTop: 4 }}>Pending</Text>
              </View>
            </View>
            <View style={{ flex: 1, minWidth: "30%" }}>
              <View style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: NG.c.panel,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                alignItems: "center",
              }}>
                <Text style={{ color: "#007bff", fontWeight: "900", fontSize: 20 }}>
                  {DASHBOARD_STATS.preparingOrders}
                </Text>
                <Text style={{ color: NG.c.muted, fontSize: 11, marginTop: 4 }}>Preparing</Text>
              </View>
            </View>
            <View style={{ flex: 1, minWidth: "30%" }}>
              <View style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: NG.c.panel,
                borderWidth: 1,
                borderColor: NG.c.stroke,
                alignItems: "center",
              }}>
                <Text style={{ color: "#28a745", fontWeight: "900", fontSize: 20 }}>
                  {DASHBOARD_STATS.readyOrders}
                </Text>
                <Text style={{ color: NG.c.muted, fontSize: 11, marginTop: 4 }}>Ready</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
            <Text style={{ color: NG.c.gold, fontWeight: "900" }}>Recent Orders</Text>
            <Pressable onPress={() => navigation?.navigate("AdminOrders")}>
              <Text style={{ color: NG.c.gold, fontWeight: "800", fontSize: 12 }}>View All</Text>
            </Pressable>
          </View>
          {RECENT_ORDERS.map((order) => (
            <View
              key={order.id}
              style={{
                marginBottom: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: NG.c.stroke,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <View>
                  <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 14 }}>Order #{order.id}</Text>
                  <Text style={{ color: NG.c.muted, fontSize: 11, marginTop: 2 }}>{order.customer}</Text>
                </View>
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  backgroundColor: getStatusColor(order.status),
                }}>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 10 }}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: NG.c.muted2, fontSize: 11 }}>{order.time}</Text>
                <Text style={{ color: NG.c.gold, fontWeight: "900" }}>R{order.total.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <Pressable style={{ flex: 1 }} onPress={() => navigation?.navigate("AdminFood")}>
            <Card style={{ alignItems: "center", paddingVertical: 16 }}>
              <Feather name="coffee" size={24} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "800", marginTop: 8, fontSize: 12 }}>
                Manage Menu
              </Text>
            </Card>
          </Pressable>
          <Pressable style={{ flex: 1 }} onPress={() => navigation?.navigate("AdminOrders")}>
            <Card style={{ alignItems: "center", paddingVertical: 16 }}>
              <Feather name="shopping-bag" size={24} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "800", marginTop: 8, fontSize: 12 }}>
                View Orders
              </Text>
            </Card>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}



