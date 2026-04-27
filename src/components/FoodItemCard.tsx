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
      activeOpacity={0.9}
      className="mb-4 rounded-[28px] bg-white p-4 shadow-sm border border-gray-100 flex-row"
    >
      <View className="flex-1 pr-4 justify-between">
        <View>
          <Text className="text-lg font-bold text-text mb-1">{item.name}</Text>
          <Text className="text-sm text-text-muted leading-6" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text className="mt-4 text-lg font-bold text-primary">₹{item.price}</Text>
      </View>
      <Image
        source={{ uri: item.imageUrl }}
        className="w-28 h-28 rounded-3xl bg-gray-100"
      />
    </TouchableOpacity>
  );
}
