import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isVeg: boolean;
}

export default function FoodItemCard({ item }: { item: FoodItem }) {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to the dynamic item detail page, passing the item data
    router.push({
      pathname: "/(customer)/item/[id]",
      params: {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row justify-between py-6 border-b border-gray-100 bg-bg"
    >
      {/* Left Column: Details */}
      <View className="flex-1 pr-4 justify-center">
        {/* Veg / Non-Veg Indicator */}
        <View
          className={`w-4 h-4 border items-center justify-center mb-2 ${
            item.isVeg ? "border-accent-green" : "border-red-500"
          }`}
        >
          <View
            className={`w-2 h-2 rounded-full ${
              item.isVeg ? "bg-accent-green" : "bg-red-500"
            }`}
          />
        </View>

        <Text className="text-lg font-bold text-text mb-1">{item.name}</Text>
        <Text className="text-base font-semibold text-text mb-2">
          ₹{item.price}
        </Text>
        <Text className="text-sm text-text-muted leading-5" numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      {/* Right Column: Image & Add Button */}
      <View className="relative w-36 h-36">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full rounded-2xl bg-gray-100"
        />
        {/* Absolute positioned ADD button overlapping the bottom of the image */}
        <TouchableOpacity className="absolute -bottom-4 self-center w-28 h-10 bg-white rounded-xl shadow-md border border-gray-100 items-center justify-center">
          <Text className="text-primary font-bold text-lg">ADD</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
