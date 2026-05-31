import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 🚀 Optional: If you use jwt-decode library, import it here. 
// Otherwise we can easily parse it natively using simple JS split methods:
const parseUserIdFromToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload).userId; // Extracts the exact ID signed by your backend Express route
  } catch (e) {
    return null;
  }
};

export default function ActiveOrderBar() {
  const router = useRouter();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    const checkOngoingOrder = async () => {
      try {
        const token = await SecureStore.getItemAsync("auth_token");
        if (!token) {
          setActiveOrderId(null);
          return;
        }

        const userId = parseUserIdFromToken(token);
        if (!userId) {
          setActiveOrderId(null);
          return;
        }

        // 🚀 FIXED: Reads the user-specific storage key string!
        const savedId = await SecureStore.getItemAsync(`active_order_id_${userId}`);
        setActiveOrderId(savedId);
      } catch (err) {
        console.error("Error reading active order ID from SecureStore:", err);
      }
    };

    checkOngoingOrder();
    
    const interval = setInterval(checkOngoingOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!activeOrderId) return null;

  return (
    <View style={styles.container} className="absolute bottom-6 left-6 right-6 z-50">
      <TouchableOpacity
        onPress={() => router.push("/(customer)/orders")} 
        activeOpacity={0.9}
        className="flex-row items-center justify-between rounded-2xl px-5 py-4 shadow-xl"
        style={{ backgroundColor: "#FF863B" }} 
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
    elevation: 8, 
  },
});