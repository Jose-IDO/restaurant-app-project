import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";

interface AdminAnalyticsScreenProps {
  navigation?: any;
}

export default function AdminAnalyticsScreen({ navigation }: AdminAnalyticsScreenProps) {
  return (
    <Screen>
      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
        Analytics
      </Text>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Sales Overview</Text>
          <View style={{ height: 200, backgroundColor: NG.c.panel, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
            <Feather name="bar-chart-2" size={48} color={NG.c.muted} />
            <Text style={{ color: NG.c.muted, marginTop: 10 }}>Chart will be displayed here</Text>
          </View>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Top Selling Items</Text>
          <View style={{ gap: 12 }}>
            {["Wagyu Beef Steak", "Lobster Thermidor", "Chocolate Soufflé"].map((item, index) => (
              <View key={index} style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: NG.c.stroke,
              }}>
                <Text style={{ color: NG.c.text, fontWeight: "800" }}>{index + 1}. {item}</Text>
                <Text style={{ color: NG.c.gold, fontWeight: "900" }}>45 orders</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Revenue by Category</Text>
          <View style={{ gap: 12 }}>
            {[
              { category: "Mains", revenue: "R8,450" },
              { category: "Starters", revenue: "R2,100" },
              { category: "Desserts", revenue: "R1,200" },
              { category: "Drinks", revenue: "R700" },
            ].map((item, index) => (
              <View key={index} style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: NG.c.stroke,
              }}>
                <Text style={{ color: NG.c.text, fontWeight: "800" }}>{item.category}</Text>
                <Text style={{ color: NG.c.gold, fontWeight: "900" }}>{item.revenue}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

