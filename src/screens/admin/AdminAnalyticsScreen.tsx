import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";

interface AdminAnalyticsScreenProps {
  navigation?: any;
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 72; // Account for padding

// Sample data - will be replaced with Firebase data
const SALES_DATA = [
  { day: "Mon", value: 1200 },
  { day: "Tue", value: 1900 },
  { day: "Wed", value: 1500 },
  { day: "Thu", value: 2200 },
  { day: "Fri", value: 2800 },
  { day: "Sat", value: 3200 },
  { day: "Sun", value: 1800 },
];

const TOP_ITEMS = [
  { name: "Wagyu Beef Steak", orders: 45, revenue: 3419.55 },
  { name: "Lobster Thermidor", orders: 32, revenue: 1375.68 },
  { name: "Chocolate Soufflé", orders: 28, revenue: 531.72 },
  { name: "Seared Scallops", orders: 25, revenue: 574.75 },
  { name: "Duck Confit", orders: 22, revenue: 813.78 },
];

const CATEGORY_REVENUE = [
  { category: "Mains", revenue: 8450, percentage: 65 },
  { category: "Starters", revenue: 2100, percentage: 16 },
  { category: "Desserts", revenue: 1200, percentage: 9 },
  { category: "Drinks", revenue: 700, percentage: 5 },
  { category: "Sides", revenue: 550, percentage: 4 },
];

export default function AdminAnalyticsScreen({ navigation }: AdminAnalyticsScreenProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  const maxSalesValue = Math.max(...SALES_DATA.map(d => d.value));

  const BarChart = ({ data, maxValue }: { data: typeof SALES_DATA; maxValue: number }) => {
    return (
      <View style={{ height: 200, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 20 }}>
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 160;
          return (
            <View key={index} style={{ alignItems: "center", flex: 1 }}>
              <View style={{ width: "80%", alignItems: "center" }}>
                <View
                  style={{
                    width: "100%",
                    height: height,
                    backgroundColor: NG.c.gold,
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
                <Text style={{ color: NG.c.muted, fontSize: 10 }}>{item.day}</Text>
                <Text style={{ color: NG.c.text, fontSize: 9, marginTop: 2 }}>R{(item.value / 100).toFixed(0)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
          Analytics
        </Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {(["week", "month", "year"] as const).map((range) => (
            <Pressable
              key={range}
              onPress={() => setTimeRange(range)}
            >
              <View style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: timeRange === range ? NG.c.gold : NG.c.panel2,
                borderWidth: 1,
                borderColor: timeRange === range ? "transparent" : NG.c.stroke,
              }}>
                <Text style={{
                  color: timeRange === range ? "#151515" : NG.c.text,
                  fontWeight: "800",
                  fontSize: 11,
                }}>
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
          <BarChart data={SALES_DATA} maxValue={maxSalesValue} />
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Top Selling Items</Text>
          <View style={{ gap: 12 }}>
            {TOP_ITEMS.map((item, index) => (
              <View key={index} style={{
                marginBottom: index < TOP_ITEMS.length - 1 ? 12 : 0,
                paddingBottom: index < TOP_ITEMS.length - 1 ? 12 : 0,
                borderBottomWidth: index < TOP_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: NG.c.stroke,
              }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <Text style={{ color: NG.c.text, fontWeight: "800", fontSize: 14 }}>{index + 1}. {item.name}</Text>
                  <Text style={{ color: NG.c.gold, fontWeight: "900" }}>{item.orders} orders</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: NG.c.muted2, fontSize: 11 }}>Revenue</Text>
                  <Text style={{ color: NG.c.muted, fontSize: 12 }}>R{item.revenue.toFixed(2)}</Text>
                </View>
                <View style={{
                  marginTop: 6,
                  height: 4,
                  backgroundColor: NG.c.panel,
                  borderRadius: 2,
                  overflow: "hidden",
                }}>
                  <View style={{
                    width: `${(item.orders / TOP_ITEMS[0].orders) * 100}%`,
                    height: "100%",
                    backgroundColor: NG.c.gold,
                  }} />
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Revenue by Category</Text>
          <View style={{ gap: 12 }}>
            {CATEGORY_REVENUE.map((item, index) => (
              <View key={index} style={{
                marginBottom: index < CATEGORY_REVENUE.length - 1 ? 12 : 0,
                paddingBottom: index < CATEGORY_REVENUE.length - 1 ? 12 : 0,
                borderBottomWidth: index < CATEGORY_REVENUE.length - 1 ? 1 : 0,
                borderBottomColor: NG.c.stroke,
              }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <Text style={{ color: NG.c.text, fontWeight: "800" }}>{item.category}</Text>
                  <Text style={{ color: NG.c.gold, fontWeight: "900" }}>R{item.revenue.toFixed(2)}</Text>
                </View>
                <View style={{
                  height: 6,
                  backgroundColor: NG.c.panel,
                  borderRadius: 3,
                  overflow: "hidden",
                }}>
                  <View style={{
                    width: `${item.percentage}%`,
                    height: "100%",
                    backgroundColor: NG.c.gold,
                  }} />
                </View>
                <Text style={{ color: NG.c.muted2, fontSize: 10, marginTop: 4 }}>{item.percentage}% of total revenue</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Summary</Text>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Total Revenue</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 16 }}>R13,000.00</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Total Orders</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 16 }}>152</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: NG.c.text, fontWeight: "800" }}>Average Order Value</Text>
              <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 16 }}>R85.53</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}



