import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  eta: string;
  costForTwo: string;
  imageUrl: string;
  badge: string;
  offer?: string;
}

export default function RestaurantCard({
  restaurant,
  onPress,
}: {
  restaurant: Restaurant;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-4 rounded-[28px] overflow-hidden bg-white border border-gray-100 shadow-sm"
    >
      <View className="flex-row">
        <Image
          source={{ uri: restaurant.imageUrl }}
          className="w-32 h-32"
        />
        <View className="flex-1 p-4">
          <View className="flex-row justify-between items-start">
            <Text className="text-lg font-bold text-text">{restaurant.name}</Text>
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-primary text-xs font-bold">{restaurant.badge}</Text>
            </View>
          </View>

          <Text className="text-sm text-text-muted mt-1">{restaurant.cuisine}</Text>

          <View className="flex-row items-center mt-3 gap-2">
            <View className="rounded-full bg-accent-green/10 px-2 py-1">
              <Text className="text-accent-green text-xs font-semibold">
                ⭐ {restaurant.rating.toFixed(1)}
              </Text>
            </View>
            <Text className="text-xs text-text-muted">{restaurant.eta}</Text>
            <Text className="text-xs text-text-muted">{restaurant.costForTwo}</Text>
          </View>

          {restaurant.offer ? (
            <View className="mt-3 rounded-2xl border border-primary/20 bg-primary-light/10 px-3 py-2">
              <Text className="text-primary text-xs font-semibold">{restaurant.offer}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
