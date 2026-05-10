import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LiveOrdersScreen() {
  const router = useRouter();

  // 1. Get the dynamic restaurantId from the URL params
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

  const [activeTab, setActiveTab] = useState("PENDING");
  const [orders, setOrders] = useState<any[]>([]); // Start with an empty array instead of mock data

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // --- FETCH ORDERS FROM BACKEND ---
  const fetchOrders = async () => {
    if (!restaurantId) return;

    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const response = await axios.get(
        `${API_URL}/order/restaurant/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const backendOrders = response.data.orders || [];

      // Map Prisma Database structure to your existing Frontend UI structure
      const formattedOrders = backendOrders.map((o: any) => ({
        id: o.id,
        customerName: o.user?.name || "Guest User",
        status: o.status,
        totalAmount: o.totalAmount,
        items: o.items.map((i: any) => ({
          name: i.menuItem?.name || "Unknown Item",
          qty: i.quantity, // Prisma uses 'quantity', UI expects 'qty'
        })),
        time: new Date(o.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      Alert.alert("Error", "Could not load live orders.");
    }
  };

  // Fetch orders when the screen loads or when restaurantId changes
  useEffect(() => {
    fetchOrders();

    // Optional: You could set up a setInterval here to poll for new orders every 30 seconds
    // const interval = setInterval(fetchOrders, 30000);
    // return () => clearInterval(interval);
  }, [restaurantId]);

  // Filters orders based on the active tab
  const filteredOrders = orders.filter((o) => o.status === activeTab);

  // --- UPDATE ORDER STATUS ---
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");

      // Optimistic UI update (Instant feedback for the user)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      // API: PATCH /api/order/:id/status
      await axios.patch(
        `${API_URL}/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      // Revert if it fails
      Alert.alert("Error", "Failed to update order status");
      fetchOrders();
    }
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
                    #{order.id.split("-")[0].toUpperCase()}{" "}
                    {/* Trims long UUID for UI */}
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
                {order.items.map((item: any, idx: number) => (
                  <Text key={idx} className="text-base text-text mb-1">
                    <Text className="font-bold">{item.qty}x</Text> {item.name}
                  </Text>
                ))}
              </View>

              {/* Action Buttons based on status */}
              {order.status === "PENDING" && (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => updateOrderStatus(order.id, "CANCELLED")}
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
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
