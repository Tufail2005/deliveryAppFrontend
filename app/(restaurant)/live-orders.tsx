import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Order Data (Matches your Prisma Order schema structure)
const INITIAL_ORDERS = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    status: "PENDING",
    totalAmount: 45.5,
    items: [
      { name: "Cheese Beast", qty: 2 },
      { name: "Coke", qty: 1 },
    ],
    time: "10:30 AM",
  },
  {
    id: "ORD-002",
    customerName: "Sarah Smith",
    status: "PENDING",
    totalAmount: 32.0,
    items: [{ name: "Spicy Chicken", qty: 1 }],
    time: "10:35 AM",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    status: "PREPARING",
    totalAmount: 89.0,
    items: [{ name: "Burger Ferguson", qty: 4 }],
    time: "10:15 AM",
  },
];

export default function LiveOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Filters orders based on the active tab
  const filteredOrders = orders.filter((o) => o.status === activeTab);

  // Simulates the PATCH /api/orders/:id/status endpoint
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row items-center gap-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#0D0D0D" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text">Live Orders</Text>
      </View>

      {/* Top Tabs */}
      <View className="flex-row bg-white px-6 pt-2 border-b border-gray-100">
        {["PENDING", "PREPARING", "OUT_FOR_DELIVERY"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 pb-4 items-center border-b-2 ${
              activeTab === tab ? "border-primary" : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === tab ? "text-primary" : "text-text-muted"
              }`}
            >
              {tab.replace(/_/g, " ")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="receipt-outline" size={64} color="#E5E7EB" />
            <Text className="text-text-muted mt-4 font-semibold">
              No orders in this queue.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View
              key={order.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
            >
              <View className="flex-row justify-between items-start mb-4 border-b border-gray-50 pb-4">
                <View>
                  <Text className="text-lg font-bold text-text">
                    #{order.id}
                  </Text>
                  <Text className="text-sm text-text-muted mt-1">
                    {order.customerName} • {order.time}
                  </Text>
                </View>
                <Text className="text-xl font-bold text-primary">
                  ${order.totalAmount.toFixed(2)}
                </Text>
              </View>

              <View className="mb-6">
                {order.items.map((item, idx) => (
                  <Text key={idx} className="text-base text-text mb-1">
                    <Text className="font-bold">{item.qty}x</Text> {item.name}
                  </Text>
                ))}
              </View>

              {/* Action Buttons based on status */}
              {order.status === "PENDING" && (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => console.log("Cancel Order")}
                    className="flex-1 bg-red-50 py-3 rounded-xl items-center"
                  >
                    <Text className="text-red-600 font-bold">Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateOrderStatus(order.id, "PREPARING")}
                    className="flex-2 bg-primary py-3 rounded-xl items-center"
                  >
                    <Text className="text-white font-bold">Accept & Prep</Text>
                  </TouchableOpacity>
                </View>
              )}

              {order.status === "PREPARING" && (
                <TouchableOpacity
                  onPress={() =>
                    updateOrderStatus(order.id, "OUT_FOR_DELIVERY")
                  }
                  className="w-full bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">
                    Mark as Ready for Delivery
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
