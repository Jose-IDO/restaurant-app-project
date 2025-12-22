import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";
import { Order, OrderStatus } from "../../types";
import CustomModal from "../../components/Modal";

interface AdminOrdersScreenProps {
  navigation?: any;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD001",
    userId: "user1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+27 12 345 6789",
    items: [
      { foodItemId: "1", foodItemTitle: "Seared Scallops", quantity: 2, price: 22.99 },
      { foodItemId: "4", foodItemTitle: "Wagyu Beef Steak", quantity: 1, price: 75.99 },
    ],
    subtotal: 121.97,
    deliveryFee: 25.00,
    total: 146.97,
    status: "pending",
    deliveryAddress: "123 Main St, City",
    paymentMethod: "Credit Card",
    createdAt: "2025-12-20T10:30:00Z",
    updatedAt: "2025-12-20T10:30:00Z",
  },
  {
    id: "ORD002",
    userId: "user2",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [
      { foodItemId: "5", foodItemTitle: "Lobster Thermidor", quantity: 1, price: 42.99 },
      { foodItemId: "7", foodItemTitle: "Chocolate Soufflé", quantity: 1, price: 18.99 },
    ],
    subtotal: 61.98,
    deliveryFee: 25.00,
    total: 86.98,
    status: "preparing",
    deliveryAddress: "456 Oak Ave, City",
    paymentMethod: "Stripe",
    createdAt: "2025-12-20T11:15:00Z",
    updatedAt: "2025-12-20T11:20:00Z",
  },
  {
    id: "ORD003",
    userId: "user3",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    items: [
      { foodItemId: "4", foodItemTitle: "Wagyu Beef Steak", quantity: 2, price: 75.99 },
      { foodItemId: "13", foodItemTitle: "Truffle Fries", quantity: 2, price: 9.99 },
    ],
    subtotal: 171.96,
    deliveryFee: 25.00,
    total: 196.96,
    status: "ready",
    deliveryAddress: "789 Pine Rd, City",
    paymentMethod: "Credit Card",
    createdAt: "2025-12-19T14:00:00Z",
    updatedAt: "2025-12-19T14:45:00Z",
  },
];

const STATUS_OPTIONS: OrderStatus[] = ["pending", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersScreen({ navigation }: AdminOrdersScreenProps) {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

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

  const filteredOrders = selectedStatus === "all"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (selectedOrder) {
      setOrders(prev => prev.map(order =>
        order.id === selectedOrder.id
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ));
      setShowStatusModal(false);
      setSelectedOrder(null);
      // TODO: Update in Firebase
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Screen>
      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
        Order Management
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingRight: 18 }}
      >
        <Pressable
          onPress={() => setSelectedStatus("all")}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 999,
            backgroundColor: selectedStatus === "all" ? NG.c.gold : NG.c.panel2,
            borderWidth: 1,
            borderColor: selectedStatus === "all" ? "transparent" : NG.c.stroke,
            marginRight: 8,
          }}
        >
          <Text style={{
            color: selectedStatus === "all" ? "#151515" : NG.c.text,
            fontWeight: "800",
            fontSize: 13,
          }}>
            All
          </Text>
        </Pressable>
        {STATUS_OPTIONS.map((status) => (
          <Pressable
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: selectedStatus === status ? NG.c.gold : NG.c.panel2,
              borderWidth: 1,
              borderColor: selectedStatus === status ? "transparent" : NG.c.stroke,
              marginRight: 8,
            }}
          >
            <Text style={{
              color: selectedStatus === status ? "#151515" : NG.c.text,
              fontWeight: "800",
              fontSize: 13,
            }}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <Card>
            <Text style={{ color: NG.c.muted, textAlign: "center" }}>No orders found</Text>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 16 }}>Order #{order.id}</Text>
                  <Text style={{ color: NG.c.muted, marginTop: 4 }}>{order.customerName}</Text>
                  <Text style={{ color: NG.c.muted2, marginTop: 2, fontSize: 11 }}>{formatDate(order.createdAt)}</Text>
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

              <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ color: NG.c.muted }}>{order.items.length} items</Text>
                  <Text style={{ color: NG.c.gold, fontWeight: "900" }}>R{order.total.toFixed(2)}</Text>
                </View>
                <Text style={{ color: NG.c.muted2, fontSize: 11 }}>{order.deliveryAddress}</Text>
              </View>

              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <Pressable style={{ flex: 1 }} onPress={() => handleViewOrder(order)}>
                  <View style={{
                    paddingVertical: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: NG.c.stroke,
                    alignItems: "center",
                  }}>
                    <Text style={{ color: NG.c.text, fontWeight: "800", fontSize: 12 }}>View Details</Text>
                  </View>
                </Pressable>
                <Pressable style={{ flex: 1 }} onPress={() => handleUpdateStatus(order)}>
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
          ))
        )}
      </ScrollView>

      {/* Order Detail Modal */}
      <CustomModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedOrder(null);
        }}
        title={`Order #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 8 }}>Customer Information</Text>
              <Text style={{ color: NG.c.text }}>{selectedOrder.customerName}</Text>
              <Text style={{ color: NG.c.muted, fontSize: 12 }}>{selectedOrder.customerEmail}</Text>
              {selectedOrder.customerPhone && (
                <Text style={{ color: NG.c.muted, fontSize: 12 }}>{selectedOrder.customerPhone}</Text>
              )}
            </View>
            <View>
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 8 }}>Order Items</Text>
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
        )}
      </CustomModal>

      {/* Status Update Modal */}
      <CustomModal
        visible={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
        }}
        title="Update Order Status"
      >
        <View style={{ gap: 12 }}>
          {STATUS_OPTIONS.map((status) => (
            <Pressable key={status} onPress={() => handleStatusChange(status)}>
              <View style={{
                padding: 14,
                borderRadius: 8,
                backgroundColor: selectedOrder?.status === status ? NG.c.gold : NG.c.panel2,
                borderWidth: 1,
                borderColor: selectedOrder?.status === status ? "transparent" : NG.c.stroke,
              }}>
                <Text style={{
                  color: selectedOrder?.status === status ? "#151515" : NG.c.text,
                  fontWeight: "800",
                }}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </CustomModal>
    </Screen>
  );
}



