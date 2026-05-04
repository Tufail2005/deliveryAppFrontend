import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export interface GridFoodItem {
  id: string;
  name: string;
  restaurantName: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface FoodGridCardProps {
  item: GridFoodItem;
  onPress: (item: GridFoodItem) => void;
  onAdd?: (item: GridFoodItem) => void;
  className?: string;
}

export default function FoodGridCard({ item, onPress, onAdd, className }: FoodGridCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className={`w-[47%] bg-white rounded-4xl mb-4 shadow-sm border border-gray-100 overflow-hidden ${className ?? ""}`}
    >
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-32 bg-gray-50"
        resizeMode="cover"
      />

      <View className="p-4 pt-3">
        <Text className="text-base font-bold text-text mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-xs text-text-muted mb-3" numberOfLines={1}>
          {item.restaurantName}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-text">₹{item.price}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onAdd?.(item)}
            className="w-8 h-8 rounded-full bg-primary items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
