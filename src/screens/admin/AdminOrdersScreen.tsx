import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";
import { Order, OrderStatus } from "../../types";
import CustomModal from "../../components/Modal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading, setOrders, updateOrder, setError } from "../../store/slices/orderSlice";
import { orderService } from "../../services/orderService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

interface AdminOrdersScreenProps {
  navigation?: any;
}

const STATUS_OPTIONS: OrderStatus[] = ["pending", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersScreen({ navigation }: AdminOrdersScreenProps) {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector(state => state.orders);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (orders.length === 0) {
        try {
          dispatch(setLoading(true));
          const allOrders = await orderService.getAllOrders();
          dispatch(setOrders(allOrders));
        } catch (error: any) {
          dispatch(setError(error.message || "Failed to load orders"));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    loadOrders();
  }, []);

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

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (selectedOrder) {
      try {
        dispatch(setLoading(true));
        await orderService.updateOrderStatus(selectedOrder.id, newStatus);
        const updatedOrder = { ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString() };
        dispatch(updateOrder(updatedOrder));
        setShowStatusModal(false);
        setSelectedOrder(null);
      } catch (error: any) {
        dispatch(setError(error.message || "Failed to update order status"));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading && orders.length === 0) {
    return (
      <Screen>
        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
          Order Management
        </Text>
        <LoadingSpinner message="Loading orders..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
        Order Management
      </Text>

      {error && (
        <View style={{ marginTop: 12 }}>
          <ErrorMessage message={error} onRetry={() => {
            dispatch(setError(null));
            const loadOrders = async () => {
              try {
                dispatch(setLoading(true));
                const allOrders = await orderService.getAllOrders();
                dispatch(setOrders(allOrders));
              } catch (error: any) {
                dispatch(setError(error.message || "Failed to load orders"));
              } finally {
                dispatch(setLoading(false));
              }
            };
            loadOrders();
          }} />
        </View>
      )}

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



