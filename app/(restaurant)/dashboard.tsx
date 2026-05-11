import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RestaurantDashboard() {
  const router = useRouter();
  // 1. Get the ID passed from the Selection Screen
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // --- NEW: Dashboard Stats State ---
  const [stats, setStats] = useState({
    count: 0,
    revenue: 0,
    todaysOrdersList: [],
  });
  const [isModalVisible, setModalVisible] = useState(false); // Controls the popup

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails();
      fetchDashboardStats(); // Fetch stats as soon as the dashboard loads
    }
  }, [restaurantId]);

  // 2. Fetch standard restaurant data (name, open/close status)
  const fetchRestaurantDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const response = await axios.get(
        `${API_URL}/customer/restaurants/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.data;
      setRestaurant(data);
      setIsOpen(data.isOpen);
    } catch (error) {
      console.error("Fetch details error:", error);
      Alert.alert("Error", "Could not load restaurant details");
    } finally {
      setLoading(false);
    }
  };

  // 3. --- NEW: Fetch Today's Dashboard Stats ---
  const fetchDashboardStats = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const response = await axios.get(
        `${API_URL}/order/restaurant/${restaurantId}/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Map the response data to our local state
      setStats({
        count: response.data.todayOrderCount || 0,
        revenue: response.data.todayRevenue || 0,
        todaysOrdersList: response.data.todaysOrders || [],
      });
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    }
  };

  // 4. Toggle Open/Close Status
  const toggleRestaurantStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const response = await axios.patch(
        `${API_URL}/restaurant/${restaurantId}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsOpen(response.data.isOpen);
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF863B" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header showing Real Name */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-1"
          >
            <Ionicons name="arrow-back" size={14} color="#9ca3af" />
            <Text className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
              Switch Restaurant
            </Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-text">
            {restaurant?.name}
          </Text>
        </View>

        {/* PROPERLY ATTACHED ONPRESS HERE */}
        <TouchableOpacity
          onPress={() => router.push("/(restaurant)/profile")}
          className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
        >
          <Ionicons name="person" size={20} color="#0d0d0d" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
      >
        {/* Real-time Toggle Status */}
        <View className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100 mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isOpen ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Ionicons
                name={isOpen ? "storefront" : "lock-closed"}
                size={24}
                color={isOpen ? "#16a34a" : "#dc2626"}
              />
            </View>
            <View>
              <Text className="text-lg font-bold text-text">
                Accepting Orders
              </Text>
              <Text
                className={`text-sm font-semibold ${
                  isOpen ? "text-green-600" : "text-red-600"
                }`}
              >
                {isOpen ? "Currently Open" : "Currently Closed"}
              </Text>
            </View>
          </View>
          <Switch onValueChange={toggleRestaurantStatus} value={isOpen} />
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between mb-8">
          {/* --- NEW: Clickable Today's Orders Card --- */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            className="w-[48%] bg-white rounded-3xl p-5 shadow-sm border border-gray-100 justify-between"
          >
            <View>
              <Text className="text-3xl font-bold text-text mb-1">
                {stats.count}
              </Text>
              <Text className="text-sm text-text-muted">Today's Orders</Text>
            </View>
            {/* Added a small prompt so the user knows it's clickable */}
            <Text className="text-xs font-bold text-primary mt-3">
              View List &rarr;
            </Text>
          </TouchableOpacity>

          {/* --- NEW: Dynamic Today's Revenue Card --- */}
          <View className="w-[48%] bg-white rounded-3xl p-5 shadow-sm border border-gray-100 justify-between">
            <View>
              <Text className="text-3xl font-bold text-text mb-1">
                ${stats.revenue.toFixed(2)}
              </Text>
              <Text className="text-sm text-text-muted">Today's Revenue</Text>
            </View>
          </View>
        </View>

        <Text className="text-xl font-bold text-text mb-4">Manage</Text>
        <View className="bg-white rounded-4xl p-2 shadow-sm border border-gray-100">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-gray-50"
            onPress={() =>
              router.push({
                pathname: "/(restaurant)/live-orders",
                params: { restaurantId },
              })
            }
          >
            <Text className="text-base font-bold text-text">Live Orders</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            onPress={() =>
              router.push({
                pathname: "/(restaurant)/menu-editor",
                params: { restaurantId },
              })
            }
          >
            <Text className="text-base font-bold text-text">
              Menu & Pricing
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- NEW: TODAY'S ORDERS MODAL --- */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          {/* Modal Header */}
          <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-text">Today's Orders</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#0D0D0D" />
            </TouchableOpacity>
          </View>

          {/* Modal List */}
          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {stats.todaysOrdersList.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons name="receipt-outline" size={64} color="#E5E7EB" />
                <Text className="text-center font-bold text-text-muted mt-4">
                  No orders placed today.
                </Text>
              </View>
            ) : (
              stats.todaysOrdersList.map((order: any) => (
                <View
                  key={order.id}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4"
                >
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-base font-bold text-text">
                      #{order.id.split("-")[0].toUpperCase()}
                    </Text>
                    <Text className="text-lg font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </Text>
                  </View>

                  <View className="mb-3">
                    <Text className="text-sm font-bold text-text mb-1">
                      {order.user?.name || "Guest User"}
                    </Text>
                    {order.items.map((item: any, i: number) => (
                      <Text key={i} className="text-sm text-text-muted">
                        <Text className="font-bold text-text">
                          {item.quantity}x
                        </Text>{" "}
                        {item.menuItem?.name || "Unknown Item"}
                      </Text>
                    ))}
                  </View>

                  <View className="pt-3 border-t border-gray-50 flex-row justify-between items-center">
                    <View className="bg-gray-50 px-3 py-1 rounded-full">
                      <Text className="text-xs font-bold text-text-muted uppercase">
                        {order.status}
                      </Text>
                    </View>
                    <Text className="text-xs font-bold text-text-muted">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              ))
            )}
            <View className="h-10" />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
