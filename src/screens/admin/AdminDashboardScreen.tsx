import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Card, NG } from "../../components/ui/noirGold.ui";

interface AdminDashboardScreenProps {
  navigation?: any;
}

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  return (
    <Screen>
      <Text style={{ color: NG.c.gold, fontWeight: "900", fontSize: 22, marginTop: 4 }}>
        Dashboard
      </Text>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="shopping-bag" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>24</Text>
              <Text style={{ color: NG.c.muted, marginTop: 5 }}>Total Orders</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="dollar-sign" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>R12,450</Text>
              <Text style={{ color: NG.c.muted, marginTop: 5 }}>Revenue</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="coffee" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>15</Text>
              <Text style={{ color: NG.c.muted, marginTop: 5 }}>Menu Items</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, minWidth: "45%" }}>
            <View style={{ alignItems: "center" }}>
              <Feather name="users" size={32} color={NG.c.gold} />
              <Text style={{ color: NG.c.text, fontWeight: "900", fontSize: 24, marginTop: 10 }}>156</Text>
              <Text style={{ color: NG.c.muted, marginTop: 5 }}>Customers</Text>
            </View>
          </Card>
        </View>

        <Card>
          <Text style={{ color: NG.c.gold, fontWeight: "900", marginBottom: 15 }}>Recent Orders</Text>
          <Text style={{ color: NG.c.muted }}>Order management will be displayed here</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

