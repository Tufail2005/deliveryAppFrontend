import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RESTAURANT_COVER_BY_ID } from "../constants/restaurantCovers";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  eta: string;
  costForTwo: string;
  /** Fallback when no bundled cover exists for `id`. */
  imageUrl?: string;
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
  const coverSource =
    RESTAURANT_COVER_BY_ID[restaurant.id] ??
    (restaurant.imageUrl ? { uri: restaurant.imageUrl } : undefined);
  const distanceText = restaurant.costForTwo.toLowerCase().includes("km")
    ? restaurant.costForTwo
    : "1 km";
  const ratingMeta = restaurant.badge ? `By ${restaurant.badge}` : "By 5.4K+";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-4 rounded-[28px] overflow-hidden bg-white border border-gray-100 shadow-sm"
    >
      {coverSource ? (
        <Image
          source={coverSource}
          className="w-full h-[200px]"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-[200px] bg-gray-200" />
      )}

      <View className="px-4 pt-2.5 pb-3">
        <View className="flex-row justify-between items-start gap-2">
          <Text className="flex-1 text-2xl font-bold text-text leading-5">
            {restaurant.name}
          </Text>
          <View className="items-end">
            <View className="rounded-full border border-accent-green px-2 py-0.5 shrink-0 flex-row items-center gap-0.5">
              <Ionicons name="star" size={11} color="#0DCC7B" />
              <Text className="text-text text-sm font-bold">
                {restaurant.rating.toFixed(1)}
              </Text>
            </View>
            <Text className="text-text-muted text-[11px] mt-0.5 leading-tight">{ratingMeta}</Text>
          </View>
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="cloudy-outline" size={13} color="#6B7280" />
          <Text className="text-text-muted text-sm ml-1.5 leading-5">{restaurant.eta}</Text>
          <Text className="text-gray-300 text-sm mx-1.5">|</Text>
          <Text className="text-text-muted text-sm leading-5">{distanceText}</Text>
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="pricetag" size={12} color="#2563EB" />
          <Text className="text-blue-600 text-sm ml-1.5 font-semibold leading-5 shrink">
            {restaurant.offer ?? "50% OFF on select items"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
