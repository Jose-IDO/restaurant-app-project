import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";
import ScreenHeader from "../../components/ScreenHeader";
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

/** Main kitchen flow (left → right). Cancelled handled separately. */
const PIPELINE: OrderStatus[] = ["pending", "preparing", "ready", "out_for_delivery", "delivered"];
const ALL_FILTER: (OrderStatus | "all")[] = ["all", ...PIPELINE, "cancelled"];

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "pending": return "#ffc107";
    case "preparing": return "#007bff";
    case "ready": return "#28a745";
    case "out_for_delivery": return "#6f42c1";
    case "delivered": return "#28a745";
    case "cancelled": return "#dc3545";
    default: return NG.c.muted;
  }
}

function shortLabel(status: OrderStatus) {
  switch (status) {
    case "pending": return "Pending";
    case "preparing": return "Prep";
    case "ready": return "Ready";
    case "out_for_delivery": return "Out";
    case "delivered": return "Done";
    case "cancelled": return "Cancel";
    default: return status;
  }
}

function OrderPipelineRow({
  status,
  onSelectStage,
}: {
  status: OrderStatus;
  onSelectStage: (s: OrderStatus) => void;
}) {
  const activeIndex = PIPELINE.indexOf(status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <View style={{ paddingVertical: 8, alignItems: "center" }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: "#dc3545" }}>
          <Text style={{ color: "#fff", fontWeight: "900" }}>Order cancelled</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ color: NG.c.muted, fontSize: 12, marginBottom: 10, fontWeight: "700" }}>Order stage (tap a step to move)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4, alignItems: "flex-start" }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          {PIPELINE.map((st, i) => {
            const reached = i <= activeIndex;
            const isCurrent = st === status;
            return (
              <View key={st} style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => onSelectStage(st)} style={{ alignItems: "center", width: 64 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: reached ? getStatusColor(st) : NG.c.panel,
                      borderWidth: 2,
                      borderColor: isCurrent ? NG.c.gold : NG.c.stroke,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {reached ? (
                      <Feather name="check" size={18} color="#fff" />
                    ) : (
                      <Text style={{ color: NG.c.muted, fontSize: 14, fontWeight: "800" }}>{i + 1}</Text>
                    )}
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: isCurrent ? NG.c.gold : NG.c.muted,
                      fontSize: 10,
                      marginTop: 6,
                      textAlign: "center",
                      fontWeight: isCurrent ? "800" : "600",
                    }}
                  >
                    {shortLabel(st)}
                  </Text>
                </Pressable>
                {i < PIPELINE.length - 1 ? (
                  <View
                    style={{
                      width: 12,
                      height: 4,
                      backgroundColor: i < activeIndex ? getStatusColor(PIPELINE[i]) : "rgba(255,255,255,0.12)",
                      marginTop: 18,
                    }}
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default function AdminOrdersScreen({ navigation }: AdminOrdersScreenProps) {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector(state => state.orders);
  const { width } = useWindowDimensions();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const allOrders = await orderService.getAllOrders();
      dispatch(setOrders(allOrders));
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to load orders"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    try {
      dispatch(setLoading(true));
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      const updatedOrder = { ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString() };
      dispatch(updateOrder(updatedOrder));
      setSelectedOrder(updatedOrder);
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to update order status"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredOrders =
    selectedStatus === "all" ? orders : orders.filter(order => order.status === selectedStatus);

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading && orders.length === 0) {
    return (
      <Screen>
        <ScreenHeader
          title="Order Management"
          onBack={() => navigation?.navigate("AdminDashboard")}
        />
        <LoadingSpinner message="Loading orders..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title="Order Management"
        onBack={() => navigation?.navigate("AdminDashboard")}
      />

      {error ? (
        <View style={{ marginTop: 8 }}>
          <ErrorMessage message={error} onRetry={() => { dispatch(setError(null)); loadOrders(); }} />
        </View>
      ) : null}

      {/* Filter chips: compact rounded rects, wrap left→right */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        {ALL_FILTER.map((status) => {
          const selected = selectedStatus === status;
          const label =
            status === "all"
              ? "All"
              : status === "out_for_delivery"
                ? "Out"
                : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
          return (
            <Pressable
              key={String(status)}
              onPress={() => setSelectedStatus(status)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                minHeight: 40,
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: selected ? NG.c.gold : NG.c.panel2,
                borderWidth: 1,
                borderColor: selected ? "transparent" : NG.c.stroke,
              }}
            >
              <Text
                style={{
                  color: selected ? "#151515" : NG.c.text,
                  fontWeight: "800",
                  fontSize: 13,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={{ marginTop: 8 }} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <Card>
            <Text style={{ color: NG.c.muted, textAlign: "center" }}>No orders in this filter</Text>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Pressable key={order.id} onPress={() => openOrder(order)}>
              <Card style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 16 }}>Order #{order.id.slice(0, 8)}…</Text>
                    <Text style={{ color: NG.c.muted, marginTop: 4 }}>{order.customerName}</Text>
                    <Text style={{ color: NG.c.muted2, marginTop: 2, fontSize: 11 }}>{formatDate(order.createdAt)}</Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: getStatusColor(order.status),
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 11 }}>
                      {shortLabel(order.status)}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: NG.c.muted }}>{order.items.length} items</Text>
                    <Text style={{ color: NG.c.gold, fontWeight: "900" }}>R{order.total.toFixed(2)}</Text>
                  </View>
                  <Text style={{ color: NG.c.muted2, fontSize: 11 }} numberOfLines={2}>
                    {order.deliveryAddress}
                  </Text>
                </View>

                <Text style={{ color: NG.c.gold, fontSize: 12, marginTop: 10, fontWeight: "700" }}>
                  Tap to view items & change stage →
                </Text>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>

      <CustomModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedOrder(null);
        }}
        title={selectedOrder ? `Order #${selectedOrder.id.slice(0, 12)}` : "Order"}
      >
        {selectedOrder ? (
          <ScrollView style={{ maxHeight: width * 1.1 }} showsVerticalScrollIndicator={false}>
            <OrderPipelineRow status={selectedOrder.status} onSelectStage={handleStatusChange} />

            <View style={{ marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 8 }}>Items in this order</Text>
              {selectedOrder.items.map((item, index) => (
                <View
                  key={index}
                  style={{ marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: NG.c.stroke }}
                >
                  <Text style={{ color: NG.c.text, fontWeight: "800" }}>{item.foodItemTitle}</Text>
                  <Text style={{ color: NG.c.muted, fontSize: 12 }}>
                    Qty {item.quantity} × R{item.price.toFixed(2)}
                  </Text>
                  {item.specialInstructions ? (
                    <Text style={{ color: NG.c.muted2, fontSize: 11, marginTop: 4 }}>Note: {item.specialInstructions}</Text>
                  ) : null}
                </View>
              ))}
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 6 }}>Customer</Text>
              <Text style={{ color: NG.c.text }}>{selectedOrder.customerName}</Text>
              <Text style={{ color: NG.c.muted, fontSize: 12 }}>{selectedOrder.customerEmail}</Text>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 6 }}>Delivery</Text>
              <Text style={{ color: NG.c.text, fontSize: 12 }}>{selectedOrder.deliveryAddress}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 14, marginTop: 12, borderTopWidth: 1, borderTopColor: NG.c.stroke }}>
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Total</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 18 }}>R{selectedOrder.total.toFixed(2)}</Text>
            </View>

            <Text style={{ color: NG.c.muted2, fontSize: 11, marginTop: 14 }}>
              Whole order shares one stage. Tap a circle above to move this order to that stage.
            </Text>
          </ScrollView>
        ) : null}
      </CustomModal>
    </Screen>
  );
}
