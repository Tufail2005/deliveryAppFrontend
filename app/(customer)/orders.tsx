import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../src/components/BackButton";

const ORDERS = [
  {
    id: "#1024",
    restaurant: "The Grand Kitchen",
    status: "Delivered",
    total: 749,
    date: "Apr 25, 2026",
  },
  {
    id: "#1019",
    restaurant: "Burger Lab",
    status: "In progress",
    total: 509,
    date: "Apr 24, 2026",
  },
];

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-text">Your orders</Text>
        <Text className="mt-2 text-sm text-text-muted leading-6">
          Track your recent orders and reorder your favorites.
        </Text>

        <View className="mt-6 space-y-4">
          {ORDERS.map((order) => (
            <View key={order.id} className="rounded-[28px] bg-white p-5 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-base font-bold text-text">{order.restaurant}</Text>
                  <Text className="text-xs uppercase tracking-[0.18em] text-text-muted mt-2">{order.id}</Text>
                </View>
                <View className="rounded-full bg-accent-green/10 px-3 py-2">
                  <Text className="text-xs font-semibold text-accent-green">{order.status}</Text>
                </View>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-text-muted">{order.date}</Text>
                <Text className="text-sm font-semibold text-text">₹{order.total}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-8 rounded-[32px] bg-primary/10 p-5">
          <Text className="text-base font-bold text-primary">Need help with an order?</Text>
          <Text className="text-sm text-text-muted leading-6 mt-2">
            Reach out to support if you have questions about delivery or refunds.
          </Text>
          <TouchableOpacity onPress={() => router.push("/(customer)/menu")} className="mt-4 rounded-3xl bg-primary px-4 py-3 items-center">
            <Text className="text-sm font-bold text-white">Browse more restaurants</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
