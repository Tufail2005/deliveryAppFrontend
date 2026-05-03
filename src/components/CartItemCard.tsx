import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  isVeg: boolean;
}

export default function CartItemCard({
  item,
  onIncrement,
  onDecrement,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <View className="mb-4 rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm">
      <View className="flex-row items-center gap-4">
        {/* Image */}
        <Image
          source={{ uri: item.imageUrl }}
          className="h-24 w-24 rounded-3xl bg-gray-100"
        />

        {/* Content Container */}
        <View className="flex-1 justify-between h-24">
          {/* Top Section: Name and Veg Tag */}
          <View>
            <Text className="text-base font-bold text-text" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="mt-1 text-xs text-text-muted">
              {item.isVeg ? "Veg" : "Non-Veg"}
            </Text>
          </View>

          {/* Bottom Section: Price and Buttons in one row */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-primary">
              ₹{item.price * item.quantity}
            </Text>

            <View className="flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-1 py-1">
              <TouchableOpacity
                onPress={onDecrement}
                className="rounded-full p-2"
              >
                <Ionicons name="remove" size={16} color="#FF863B" />
              </TouchableOpacity>
              
              <Text className="mx-2 text-base font-bold text-text">
                {item.quantity}
              </Text>
              
              <TouchableOpacity
                onPress={onIncrement}
                className="rounded-full p-2"
              >
                <Ionicons name="add" size={16} color="#FF863B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}