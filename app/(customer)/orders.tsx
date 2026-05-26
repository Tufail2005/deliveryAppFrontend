import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../src/components/BackButton";

interface OrderItem {
  id: string;
  rawId: string;
  restaurant: string;
  status: string;
  rawStatus: string;
  isOngoing: boolean;
  total: number;
  date: string;
  items: number;
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const ITEMS_PER_PAGE = 10;

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ongoing" | "history">("ongoing");
  
  // Pagination State Management Pools
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Status State Management Flags
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Core Request Data Execution Engine
  const fetchOrders = async (targetPage: number, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (targetPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      if (!baseUrl) throw new Error("EXPO_PUBLIC_API_URL is missing");
      const token = await SecureStore.getItemAsync("auth_token");
      if (!token) throw new Error("Authentication token found empty.");

      // 1. Trigger the safe HTTP request specifying parameter context mapping
      const response = await axios.get<{ success: boolean; orders: OrderItem[]; hasMore: boolean }>(
        `${baseUrl}/order/customer-order`,
        {
          params: { type: activeTab, page: targetPage, limit: ITEMS_PER_PAGE },
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success && Array.isArray(response.data.orders)) {
        setOrders((prev) => (targetPage === 1 ? response.data.orders : [...prev, ...response.data.orders]));
        setHasMore(response.data.hasMore);
        setPage(targetPage);
      }
    } catch (err: any) {
      console.error("Fetch Orders Error:", err);
      setError(err.response?.data?.message || "Could not retrieve order details.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Re-fetch everything cleanly when the user swaps navigation tabs
  useEffect(() => {
    setOrders([]);
    setHasMore(true);
    fetchOrders(1, false);
  }, [activeTab]);

  const handleRefresh = () => {
    fetchOrders(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      fetchOrders(page + 1, false);
    }
  };

  // Memoized Header component layout to satisfy FlatList tracking architectures
  const renderHeader = () => (
    <View className="pt-6 mb-4">
      <Text className="text-3xl font-bold text-text">My Orders</Text>
      
      {/* Tab Select Controller */}
      <View className="mt-4 flex-row rounded-full bg-gray-100 p-2">
        {(["ongoing", "history"] as const).map((tabId) => (
          <TouchableOpacity
            key={tabId}
            onPress={() => setActiveTab(tabId)}
            className={`flex-1 rounded-full px-4 py-3 items-center ${
              activeTab === tabId ? "bg-white shadow-sm" : "bg-transparent"
            }`}
          >
            <Text className={`font-semibold capitalize ${activeTab === tabId ? "text-text" : "text-text-muted"}`}>
              {tabId}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Bottom footer spinner loader while next batch is processing
  const renderFooter = () => {
    if (!loadingMore) return <View className="h-10" />;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#FF863B" />
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View className="rounded-[28px] bg-white p-5 shadow-sm border border-gray-100 mb-4 mx-0.5">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 pr-2">
          <Text className="text-base font-bold text-text" numberOfLines={1}>
            {item.restaurant}
          </Text>
          <Text className="text-xs text-text-muted mt-1">{item.date} • {item.items} items</Text>
        </View>
        <Text className={`text-sm font-bold ${
          item.rawStatus === "CANCELLED" 
            ? "text-red-500" 
            : item.rawStatus === "DELIVERED" 
            ? "text-gray-400" 
            : "text-primary"
        }`}>
          {item.status}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-text-muted font-mono">{item.id}</Text>
        <Text className="text-sm font-semibold text-text">₹{item.total.toFixed(2)}</Text>
      </View>

      <View className="mt-4 flex-row gap-3">
        <TouchableOpacity 
          disabled={item.isOngoing}
          className={`flex-1 rounded-3xl border px-4 py-3 items-center ${
            item.isOngoing ? "border-gray-200 bg-gray-50" : "border-primary"
          }`}
        >
          <Text className={`text-sm font-semibold ${item.isOngoing ? "text-gray-300" : "text-primary"}`}>
            Rate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(customer)/menu")}
          className="flex-1 rounded-3xl bg-primary px-4 py-3 items-center"
        >
          <Text className="text-sm font-semibold text-white">Re-Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      {/* Fixed Back Button Layout Container Zone */}
      <View className="px-6 pt-2">
        <BackButton />
      </View>

      {loading && page === 1 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.rawId}
          renderItem={renderOrderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#FF863B"]} />
          }
          ListEmptyComponent={
            error ? (
              <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-4 flex-row items-center gap-3">
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-red-700 font-semibold text-sm flex-1">{error}</Text>
              </View>
            ) : (
              <View className="py-20 items-center justify-center">
                <Ionicons name="receipt-outline" size={56} color="#D1D5DB" />
                <Text className="text-gray-400 font-semibold text-base mt-3">
                  No {activeTab} records found.
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}