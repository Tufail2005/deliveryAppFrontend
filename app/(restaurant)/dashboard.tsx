import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RestaurantDashboard() {
  const router = useRouter();

  // State for the restaurant open/close toggle
  const [isOpen, setIsOpen] = useState(true);

  const toggleRestaurantStatus = () => {
    // Here you will eventually make the PATCH /api/restaurants/:id/toggle-status API call
    setIsOpen(!isOpen);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">
            Owner Dashboard
          </Text>
          <Text className="text-2xl font-bold text-text">Spicy Restaurant</Text>
        </View>
        <TouchableOpacity className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
          <Ionicons name="person" size={20} color="#0d0d0d" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
      >
        {/* Open/Close Toggle Card */}
        <View className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-6 flex-row items-center justify-between">
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
          <Switch
            trackColor={{ false: "#fca5a5", true: "#86efac" }}
            thumbColor={isOpen ? "#16a34a" : "#dc2626"}
            ios_backgroundColor="#fca5a5"
            onValueChange={toggleRestaurantStatus}
            value={isOpen}
          />
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row justify-between mb-8">
          <View className="w-[48%] bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-4">
              <Ionicons name="receipt-outline" size={20} color="#FF863B" />
            </View>
            <Text className="text-3xl font-bold text-text mb-1">12</Text>
            <Text className="text-sm text-text-muted">Today's Orders</Text>
          </View>

          <View className="w-[48%] bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mb-4">
              <Ionicons name="cash-outline" size={20} color="#16a34a" />
            </View>
            <Text className="text-3xl font-bold text-text mb-1">$450</Text>
            <Text className="text-sm text-text-muted">Today's Revenue</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-text mb-4">Manage</Text>

        {/* Action Menu */}
        <View className="bg-white rounded-4xl p-2 shadow-sm border border-gray-100">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-gray-50"
            onPress={() => router.push("/(restaurant)/live-orders" as any)}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                <Ionicons name="list-outline" size={24} color="#3b82f6" />
              </View>
              <Text className="text-base font-bold text-text">Live Orders</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="bg-red-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">3 New</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            onPress={() => router.push("/(restaurant)/menu-editor" as any)}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-purple-50 items-center justify-center">
                <Ionicons name="restaurant-outline" size={24} color="#a855f7" />
              </View>
              <Text className="text-base font-bold text-text">
                Menu & Pricing
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
