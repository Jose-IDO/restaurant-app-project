import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";
import { orderService } from "../../services/orderService";
import { Order } from "../../types";

interface AdminAnalyticsScreenProps {
  navigation?: any;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getStartDate(range: "week" | "month" | "year"): Date {
  const now = new Date();
  const d = new Date(now);
  if (range === "week") {
    d.setDate(d.getDate() - 7);
  } else if (range === "month") {
    d.setMonth(d.getMonth() - 1);
  } else {
    d.setFullYear(d.getFullYear() - 1);
  }
  return d;
}

function computeSalesByDay(orders: Order[], range: "week" | "month" | "year"): { day: string; value: number }[] {
  const start = getStartDate(range);
  if (range === "week") {
    const buckets: Record<number, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      buckets[d.getTime()] = 0;
    }
    orders.forEach(o => {
      const created = new Date(o.createdAt);
      if (created >= start) {
        const dayStart = new Date(created);
        dayStart.setHours(0, 0, 0, 0);
        const key = dayStart.getTime();
        if (buckets[key] !== undefined) buckets[key] += o.total;
        else buckets[key] = o.total;
      }
    });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.getTime();
      return { day: DAY_LABELS[d.getDay()], value: buckets[key] ?? 0 };
    });
  }
  if (range === "month") {
    const buckets: Record<string, number> = {};
    for (let w = 0; w < 4; w++) {
      buckets[`w${w}`] = 0;
    }
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    orders.forEach(o => {
      const created = new Date(o.createdAt);
      if (created >= start) {
        const weekIndex = Math.floor((created.getTime() - start.getTime()) / weekMs);
        const w = Math.min(weekIndex, 3);
        buckets[`w${w}`] = (buckets[`w${w}`] ?? 0) + o.total;
      }
    });
    return ["Week 1", "Week 2", "Week 3", "Week 4"].map((day, i) => ({ day, value: buckets[`w${i}`] ?? 0 }));
  }
  const buckets: Record<number, number> = {};
  for (let m = 0; m < 12; m++) {
    const d = new Date(start.getFullYear(), start.getMonth() + m, 1);
    buckets[d.getMonth() + d.getFullYear() * 12] = 0;
  }
  orders.forEach(o => {
    const created = new Date(o.createdAt);
    if (created >= start) {
      const key = created.getMonth() + created.getFullYear() * 12;
      buckets[key] = (buckets[key] ?? 0) + o.total;
    }
  });
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = d.getMonth() + d.getFullYear() * 12;
    return { day: MONTH_LABELS[d.getMonth()], value: buckets[key] ?? 0 };
  });
}

function computeTopItems(orders: Order[]): { name: string; orders: number; revenue: number }[] {
  const byTitle: Record<string, { orders: number; revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(line => {
      const rev = (line.price * line.quantity) + (line.extras?.reduce((s, e) => s + e.price, 0) ?? 0) * line.quantity + (line.selectedDrink?.price ?? 0) * line.quantity;
      const key = line.foodItemTitle;
      if (!byTitle[key]) byTitle[key] = { orders: 0, revenue: 0 };
      byTitle[key].orders += line.quantity;
      byTitle[key].revenue += rev;
    });
  });
  return Object.entries(byTitle)
    .map(([name, data]) => ({ name, orders: data.orders, revenue: data.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

function computeCategoryRevenue(orders: Order[]): { category: string; revenue: number; percentage: number }[] {
  const byCat: Record<string, number> = {};
  let total = 0;
  orders.forEach(order => {
    order.items.forEach(line => {
      const rev = (line.price * line.quantity) + (line.extras?.reduce((s, e) => s + e.price, 0) ?? 0) * line.quantity + (line.selectedDrink?.price ?? 0) * line.quantity;
      const cat = line.category || "Other";
      byCat[cat] = (byCat[cat] ?? 0) + rev;
      total += rev;
    });
  });
  return Object.entries(byCat)
    .map(([category, revenue]) => ({ category, revenue, percentage: total > 0 ? Math.round((revenue / total) * 100) : 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

export default function AdminAnalyticsScreen({ navigation }: AdminAnalyticsScreenProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getAllOrders();
        if (!cancelled) setOrders(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const start = useMemo(() => getStartDate(timeRange), [timeRange]);
  const filteredOrders = useMemo(() => orders.filter(o => new Date(o.createdAt) >= start), [orders, start]);
  const salesData = useMemo(() => computeSalesByDay(filteredOrders, timeRange), [filteredOrders, timeRange]);
  const topItems = useMemo(() => computeTopItems(filteredOrders), [filteredOrders]);
  const categoryRevenue = useMemo(() => computeCategoryRevenue(filteredOrders), [filteredOrders]);
  const totalRevenue = useMemo(() => filteredOrders.reduce((s, o) => s + o.total, 0), [filteredOrders]);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const maxSalesValue = Math.max(1, ...salesData.map(d => d.value));

  const BarChart = ({ data, maxValue }: { data: { day: string; value: number }[]; maxValue: number }) => (
    <View style={{ height: 200, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 20 }}>
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.value / maxValue) * 160 : 0;
        return (
          <View key={index} style={{ alignItems: "center", flex: 1 }}>
            <View style={{ width: "80%", alignItems: "center" }}>
              <View
                style={{
                  width: "100%",
                  height: Math.max(height, 2),
                  backgroundColor: NG.c.gold,
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
              <Text style={{ color: NG.c.muted, fontSize: 10 }} numberOfLines={1}>{item.day}</Text>
              <Text style={{ color: NG.c.text, fontSize: 9, marginTop: 2 }}>R{(item.value).toFixed(0)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <Screen>
        <Text style={{ color: NG.c.muted, textAlign: "center", marginTop: 40 }}>Loading analytics...</Text>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Text style={{ color: NG.c.muted, textAlign: "center", marginTop: 40 }}>{error}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>Analytics</Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {(["week", "month", "year"] as const).map((range) => (
            <Pressable key={range} onPress={() => setTimeRange(range)}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: timeRange === range ? NG.c.gold : NG.c.panel2,
                  borderWidth: 1,
                  borderColor: timeRange === range ? "transparent" : NG.c.stroke,
                }}
              >
                <Text
                  style={{
                    color: timeRange === range ? "#151515" : NG.c.text,
                    fontWeight: "800",
                    fontSize: 11,
                  }}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 8 }}>Sales Overview</Text>
          <Text style={{ color: NG.c.muted, fontSize: 12, marginBottom: 4 }}>
            Revenue for the {timeRange}
          </Text>
          {filteredOrders.length === 0 ? (
            <Text style={{ color: NG.c.muted2, marginTop: 20 }}>No orders in this period</Text>
          ) : (
            <BarChart data={salesData} maxValue={maxSalesValue} />
          )}
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Top Selling Items</Text>
          {topItems.length === 0 ? (
            <Text style={{ color: NG.c.muted2 }}>No items in this period</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {topItems.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: index < topItems.length - 1 ? 12 : 0,
                    paddingBottom: index < topItems.length - 1 ? 12 : 0,
                    borderBottomWidth: index < topItems.length - 1 ? 1 : 0,
                    borderBottomColor: NG.c.stroke,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <Text style={{ color: NG.c.text, fontWeight: "800", fontSize: 14 }} numberOfLines={1}>
                      {index + 1}. {item.name}
                    </Text>
                    <Text style={{ color: NG.c.gold, fontWeight: "900" }}>{item.orders} orders</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: NG.c.muted2, fontSize: 11 }}>Revenue</Text>
                    <Text style={{ color: NG.c.muted, fontSize: 12 }}>R{item.revenue.toFixed(2)}</Text>
                  </View>
                  <View
                    style={{
                      marginTop: 6,
                      height: 4,
                      backgroundColor: NG.c.panel,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${topItems[0].revenue > 0 ? (item.revenue / topItems[0].revenue) * 100 : 0}%`,
                        height: "100%",
                        backgroundColor: NG.c.gold,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Revenue by Category</Text>
          {categoryRevenue.length === 0 ? (
            <Text style={{ color: NG.c.muted2 }}>No category data in this period</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {categoryRevenue.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: index < categoryRevenue.length - 1 ? 12 : 0,
                    paddingBottom: index < categoryRevenue.length - 1 ? 12 : 0,
                    borderBottomWidth: index < categoryRevenue.length - 1 ? 1 : 0,
                    borderBottomColor: NG.c.stroke,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <Text style={{ color: NG.c.text, fontWeight: "800" }}>{item.category}</Text>
                    <Text style={{ color: NG.c.gold, fontWeight: "900" }}>R{item.revenue.toFixed(2)}</Text>
                  </View>
                  <View
                    style={{
                      height: 6,
                      backgroundColor: NG.c.panel,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${item.percentage}%`,
                        height: "100%",
                        backgroundColor: NG.c.gold,
                      }}
                    />
                  </View>
                  <Text style={{ color: NG.c.muted2, fontSize: 10, marginTop: 4 }}>{item.percentage}% of total revenue</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Summary</Text>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Total Revenue</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 16 }}>R{totalRevenue.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Total Orders</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 16 }}>{totalOrdersCount}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Average Order Value</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 16 }}>R{avgOrderValue.toFixed(2)}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}
