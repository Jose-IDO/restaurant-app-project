import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";
import { Order, OrderStatus } from "../../types";

interface OrderHistoryScreenProps {
  navigation?: any;
  orders?: Order[];
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD001",
    userId: "user1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { foodItemId: "1", foodItemTitle: "Seared Scallops", quantity: 2, price: 22.99 },
      { foodItemId: "4", foodItemTitle: "Wagyu Beef Steak", quantity: 1, price: 75.99 },
    ],
    subtotal: 121.97,
    deliveryFee: 25.00,
    total: 146.97,
    status: "delivered",
    deliveryAddress: "123 Main St, City",
    paymentMethod: "Credit Card",
    createdAt: "2025-12-18T10:30:00Z",
    updatedAt: "2025-12-18T12:00:00Z",
  },
  {
    id: "ORD002",
    userId: "user1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { foodItemId: "5", foodItemTitle: "Lobster Thermidor", quantity: 1, price: 42.99 },
    ],
    subtotal: 42.99,
    deliveryFee: 25.00,
    total: 67.99,
    status: "delivered",
    deliveryAddress: "123 Main St, City",
    paymentMethod: "Stripe",
    createdAt: "2025-12-15T14:20:00Z",
    updatedAt: "2025-12-15T16:00:00Z",
  },
];

export default function OrderHistoryScreen({ navigation, orders = SAMPLE_ORDERS }: OrderHistoryScreenProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <Screen>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={() => navigation?.goBack()}>
          <View style={{ width: 40, height: 40, justifyContent: "center", marginRight: 10 }}>
            <Feather name="arrow-left" size={24} color={NG.c.text} />
          </View>
        </Pressable>
        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22 }}>
          Order History
        </Text>
      </View>

      {orders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Feather name="package" size={64} color={NG.c.muted2} />
          <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 18, marginTop: 16 }}>
            No Orders Yet
          </Text>
          <Text style={{ color: NG.c.muted, marginTop: 8, textAlign: "center" }}>
            Your order history will appear here
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.map((order) => (
            <Card key={order.id} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 16 }}>
                    Order #{order.id}
                  </Text>
                  <Text style={{ color: NG.c.muted, marginTop: 4, fontSize: 12 }}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                  backgroundColor: getStatusColor(order.status),
                }}>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 11 }}>
                    {order.status.toUpperCase().replace("_", " ")}
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: NG.c.muted, fontSize: 12, marginBottom: 4 }}>Items</Text>
                {order.items.slice(0, 2).map((item, index) => (
                  <Text key={index} style={{ color: NG.c.text, fontSize: 13 }}>
                    {item.quantity}x {item.foodItemTitle}
                  </Text>
                ))}
                {order.items.length > 2 && (
                  <Text style={{ color: NG.c.muted2, fontSize: 12, marginTop: 4 }}>
                    +{order.items.length - 2} more items
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
                <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 16 }}>
                  R{order.total.toFixed(2)}
                </Text>
                <Pressable onPress={() => handleViewOrder(order)}>
                  <View style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: NG.c.stroke,
                  }}>
                    <Text style={{ color: NG.c.gold, fontWeight: "800", fontSize: 12 }}>
                      View Details
                    </Text>
                  </View>
                </Pressable>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            maxHeight: "80%",
          }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 20 }}>
                Order #{selectedOrder.id}
              </Text>
              <Pressable onPress={() => setSelectedOrder(null)}>
                <Feather name="x" size={20} color={NG.c.text} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 8 }}>Order Details</Text>
                  <Text style={{ color: NG.c.muted, fontSize: 12 }}>Date: {formatDate(selectedOrder.createdAt)}</Text>
                  <Text style={{ color: NG.c.muted, fontSize: 12 }}>Status: {selectedOrder.status.toUpperCase().replace("_", " ")}</Text>
                  <Text style={{ color: NG.c.muted, fontSize: 12 }}>Payment: {selectedOrder.paymentMethod}</Text>
                </View>
                <View>
                  <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 8 }}>Items</Text>
                  {selectedOrder.items.map((item, index) => (
                    <View key={index} style={{ marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: NG.c.stroke }}>
                      <Text style={{ color: NG.c.text, fontWeight: "800" }}>{item.foodItemTitle}</Text>
                      <Text style={{ color: NG.c.muted, fontSize: 12 }}>Qty: {item.quantity} × R{item.price.toFixed(2)}</Text>
                      {item.specialInstructions && (
                        <Text style={{ color: NG.c.muted2, fontSize: 11, marginTop: 4 }}>Note: {item.specialInstructions}</Text>
                      )}
                    </View>
                  ))}
                </View>
                <View>
                  <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 8 }}>Delivery</Text>
                  <Text style={{ color: NG.c.text, fontSize: 12 }}>{selectedOrder.deliveryAddress}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 12, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
                  <Text style={{ color: NG.c.text, fontWeight: "800" }}>Total</Text>
                  <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>R{selectedOrder.total.toFixed(2)}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </Screen>
  );
}

