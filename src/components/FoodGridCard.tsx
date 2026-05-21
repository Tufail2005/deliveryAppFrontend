import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export interface GridFoodItem {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface FoodGridCardProps {
  item: GridFoodItem;
  onPress: (item: GridFoodItem) => void;
  onAdd?: (item: GridFoodItem) => void;

  cartQuantity?: number;
  onIncrease?: (item: GridFoodItem) => void;
  onDecrease?: (item: GridFoodItem) => void;
  className?: string;
}

export default function FoodGridCard({
  item,
  onPress,
  onAdd,
  cartQuantity = 0, // Default to 0
  onIncrease,
  onDecrease,
  className,
}: FoodGridCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className={`w-[47%] bg-white rounded-4xl mb-4 shadow-sm border border-gray-100 overflow-hidden ${
        className ?? ""
      }`}
    >
      <Image
        source={{
          uri:
            item.imageUrl ||
            "https://images.pexels.com/photos/6546548/pexels-photo-6546548.jpeg",
        }}
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
          {cartQuantity > 0 ? (
            // Show + / - Counter
            <View className="flex-row items-center bg-primary rounded-full px-2 py-1 shadow-sm">
              <TouchableOpacity
                onPress={() => onDecrease?.(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="w-6 h-6 items-center justify-center"
              >
                <Ionicons name="remove" size={16} color="#fff" />
              </TouchableOpacity>

              <Text className="text-white font-bold px-2">{cartQuantity}</Text>

              <TouchableOpacity
                onPress={() => onIncrease?.(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="w-6 h-6 items-center justify-center"
              >
                <Ionicons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            // Show Normal Add Button
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onAdd?.(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="w-8 h-8 rounded-full bg-primary items-center justify-center shadow-sm"
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
