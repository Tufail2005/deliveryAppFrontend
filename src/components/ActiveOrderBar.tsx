import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ActiveOrderBar() {
  const router = useRouter();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    const checkOngoingOrder = async () => {
      try {
        // Read the stashed memory string key we assigned during checkout success
        const savedId = await SecureStore.getItemAsync("active_order_id");
        setActiveOrderId(savedId);
      } catch (err) {
        console.error("Error reading active order ID from SecureStore:", err);
      }
    };

    checkOngoingOrder();
    
    // Check again every 5 seconds in case the order status updates or finishes
    const interval = setInterval(checkOngoingOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  // If there is no active order running, render absolutely nothing!
  if (!activeOrderId) return null;

  return (
    <View style={styles.container} className="absolute bottom-6 left-6 right-6 z-50">
      <TouchableOpacity
        onPress={() => router.push("/(customer)/orders")} // Routes natively to your orders layout feed screen
        activeOpacity={0.9}
        className="flex-row items-center justify-between rounded-2xl px-5 py-4 shadow-xl"
        style={{ backgroundColor: "#FF863B" }} // Matches your primary brand accent theme color
      >
        <View className="flex-row items-center gap-3" style={{ flexDirection: "row", alignItems: "center" }}>
          <View className="bg-white/20 p-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 8 }}>
            <Ionicons name="fast-food" size={22} color="white" />
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text className="text-white font-bold text-sm" style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
              Your food is being prepared!
            </Text>
            <Text className="text-orange-100 text-xs mt-0.5" style={{ color: "#FFE4D6", fontSize: 12, marginTop: 2 }}>
              Tap here to track your live order
            </Text>
          </View>
        </View>
        
        <Ionicons name="arrow-forward-circle" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#FF863B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8, // Smooth shadow mapping for Android devices
  },
});