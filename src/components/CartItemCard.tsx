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
        <Image
          source={{ uri: item.imageUrl }}
          className="w-24 h-24 rounded-3xl bg-gray-100"
        />

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-base font-bold text-text">{item.name}</Text>
            <Text className="text-sm font-semibold text-primary">₹{item.price}</Text>
          </View>
          <Text className="text-xs text-text-muted mt-2">
            {item.isVeg ? "Veg" : "Non-Veg"}
          </Text>
          <View className="mt-4 flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-2 py-1">
            <TouchableOpacity
              onPress={onDecrement}
              className="rounded-full p-2"
            >
              <Ionicons name="remove" size={18} color="#FF863B" />
            </TouchableOpacity>
            <Text className="mx-3 text-base font-bold text-text">{item.quantity}</Text>
            <TouchableOpacity
              onPress={onIncrement}
              className="rounded-full p-2"
            >
              <Ionicons name="add" size={18} color="#FF863B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
