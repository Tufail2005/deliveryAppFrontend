import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../contexts/CartContext";

export default function FloatingCartBanner() {
  const router = useRouter();
  
  // 🚀 FIXED: Brought in clearCart from your custom CartContext state manager
  const { cartItems, total, clearCart } = useCart();

  // Calculate the total number of items in the cart
  const totalItems = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0
  );

  // If the cart is empty, do not render the banner at all
  if (totalItems === 0) return null;

  return (
    <View className="absolute inset-x-0 bottom-0 px-6 pb-6 flex-row items-center gap-3">
      {/* Main Review and Checkout Action Container Block */}
      <TouchableOpacity
        onPress={() => router.push("/(customer)/cart")}
        activeOpacity={0.9}
        className="flex-1 rounded-3xl bg-primary px-5 py-4 shadow-2xl flex-row items-center justify-between"
      >
        <View>
          <Text className="text-sm font-semibold text-white">
            {totalItems} item{totalItems > 1 ? "s" : ""} in cart
          </Text>
          <Text className="text-base font-bold text-white mt-0.5">
            ₹{total.toFixed(2)}
          </Text>
        </View>
        
        <View className="flex-row items-center rounded-2xl bg-white px-4 py-2.5">
          <Text className="mr-2 text-sm font-bold text-primary">
            Review
          </Text>
          <Ionicons name="chevron-forward-circle" size={18} color="#FF863B" />
        </View>
      </TouchableOpacity>

      {/* 🚀 FIXED DELETE BUTTON: Trash icon built seamlessly on the right side */}
      <TouchableOpacity
        onPress={() => {
          // Instantly empties the cart array, causing the banner to automatically vanish
          clearCart(); 
        }}
        activeOpacity={0.7}
        className="w-14 h-14 bg-white rounded-3xl items-center justify-center border border-gray-100 shadow-2xl"
      >
        <Ionicons name="trash-outline" size={22} color="#FF4B4B" />
      </TouchableOpacity>
    </View>
  );
}