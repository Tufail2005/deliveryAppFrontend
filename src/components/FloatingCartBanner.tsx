import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../contexts/CartContext";

export default function FloatingCartBanner() {
  const router = useRouter();
  const { cartItems, total } = useCart();

  // Calculate the total number of items in the cart
  const totalItems = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0
  );

  // If the cart is empty, do not render the banner
  if (totalItems === 0) return null;

  return (
    <View className="absolute inset-x-0 bottom-0 px-6 pb-6">
      <View className="rounded-3xl bg-primary px-4 py-4 shadow-2xl flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold text-white">
            {totalItems} item{totalItems > 1 ? "s" : ""} in cart
          </Text>
          <Text className="text-base font-bold text-white">
            ₹{total.toFixed(2)} • Tap to review
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(customer)/cart")}
          className="flex-row items-center rounded-2xl bg-white px-4 py-3"
        >
          <Text className="mr-2 text-sm font-bold text-orange-500">
            View Cart
          </Text>
          <Ionicons name="cart" size={18} color="#F97316" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
