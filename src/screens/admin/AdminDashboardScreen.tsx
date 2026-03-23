import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG, GhostButton } from "../../components/ui/noirGold.ui";
import ScreenHeader from "../../components/ScreenHeader";
import { OrderStatus } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";

interface AdminDashboardScreenProps {
  navigation?: any;
}

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(state => state.orders);
  const { items: foodItems } = useAppSelector(state => state.food);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert("Log out", "Sign out and return to the customer app?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            setLoggingOut(true);
            await authService.logout();
            dispatch(logoutAction());
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Could not log out");
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const dashboardStats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const menuItems = foodItems.length;
    const uniqueCustomers = new Set(orders.map(order => order.userId)).size;
    const pendingOrders = orders.filter(order => order.status === "pending").length;
    const preparingOrders = orders.filter(order => order.status === "preparing").length;
    const readyOrders = orders.filter(order => order.status === "ready").length;

    return {
      totalOrders,
      totalRevenue,
      menuItems,
      customers: uniqueCustomers,
      pendingOrders,
      preparingOrders,
      readyOrders,
    };
  }, [orders, foodItems]);

  const recentOrders = useMemo(() => {
    return orders
      .slice(0, 3)
      .map(order => ({
        id: order.id,
        customer: order.customerName,
        total: order.total,
        status: order.status,
        time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
  }, [orders]);
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
      <ScreenHeader
        title="Dashboard"
        onBack={handleLogout}
        right={
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
        }
      />

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="shopping-bag" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>
                {dashboardStats.totalOrders}
              </Text>
              <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }}>Total Orders</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 32, lineHeight: 36 }}>R</Text>
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 20, marginTop: 6 }}>
                {dashboardStats.totalRevenue.toLocaleString()}
              </Text>
              <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }}>Revenue</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="coffee" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>
                {dashboardStats.menuItems}
              </Text>
              <Text style={{ color: NG.c.muted, marginTop: 5, fontSize: 12 }}>Menu Items</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="users" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>
                {dashboardStats.customers}
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
                  {dashboardStats.pendingOrders}
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
                  {dashboardStats.preparingOrders}
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
                  {dashboardStats.readyOrders}
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
          {recentOrders.map((order) => (
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

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
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

        <View style={{ marginBottom: 28 }}>
          <GhostButton
            label={loggingOut ? "Logging out..." : "Log out"}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}



