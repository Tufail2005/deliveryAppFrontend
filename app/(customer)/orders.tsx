import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../src/components/BackButton";

const ONGOING = [
  {
    id: "#242432",
    restaurant: "McDonald",
    status: "Ongoing",
    total: 40.15,
    date: "30 Jan, 12:30",
    items: 2,
  },
];

const HISTORY = [
  {
    id: "#162432",
    restaurant: "Pizza Hut",
    status: "Completed",
    total: 35.25,
    date: "29 Jan, 12:30",
    items: 3,
  },
  {
    id: "#240112",
    restaurant: "Starbucks",
    status: "Canceled",
    total: 10.2,
    date: "30 Jan, 12:30",
    items: 1,
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("history");
  const orders = activeTab === "ongoing" ? ONGOING : HISTORY;

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-text">My Orders</Text>
        <View className="mt-4 flex-row rounded-full bg-gray-100 p-2">
          {[
            { id: "ongoing", label: "Ongoing" },
            { id: "history", label: "History" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-full px-4 py-3 items-center ${
                activeTab === tab.id ? "bg-white shadow-sm" : "bg-transparent"
              }`}
            >
              <Text className={`font-semibold ${activeTab === tab.id ? "text-text" : "text-text-muted"}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6 space-y-4">
          {orders.map((order) => (
            <View key={order.id} className="rounded-[28px] bg-white p-5 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-base font-bold text-text">{order.restaurant}</Text>
                  <Text className="text-xs text-text-muted mt-1">{order.date} • {order.items} items</Text>
                </View>
                <Text className={`text-sm font-bold ${order.status === "Canceled" ? "text-red-500" : "text-primary"}`}>
                  {order.status}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-text-muted">{order.id}</Text>
                <Text className="text-sm font-semibold text-text">${order.total.toFixed(2)}</Text>
              </View>

              <View className="mt-4 flex-row gap-3">
                <TouchableOpacity className="flex-1 rounded-3xl border border-primary px-4 py-3 items-center">
                  <Text className="text-sm font-semibold text-primary">Rate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(customer)/menu")}
                  className="flex-1 rounded-3xl bg-primary px-4 py-3 items-center"
                >
                  <Text className="text-sm font-semibold text-white">Re-Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
