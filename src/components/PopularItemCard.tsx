import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export interface PopularItem {
  id: string;
  name: string;
  restaurantName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  eta: string;
  imageUrl: string;
}

interface PopularItemCardProps {
  item: PopularItem;
  onPress: () => void;
}

export default function PopularItemCard({ item, onPress }: PopularItemCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mr-4 w-[190px] rounded-[32px] overflow-hidden bg-white border border-gray-100 shadow-sm"
    >
      <View className="relative w-full h-40 bg-gray-100">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute top-3 left-3 rounded-full bg-[#EFFCF0] border border-[#16A34A] px-3 py-1">
          <Text className="text-[10px] font-bold uppercase text-[#16A34A]">Popular</Text>
        </View>

        <View className="absolute top-3 right-3 h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          <Ionicons name="add" size={20} color="#EF4444" />
        </View>
      </View>

      <View className="px-4 pb-4 pt-3">
        <Text className="text-base font-bold text-text leading-5" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-[11px] text-text-muted mt-2" numberOfLines={1}>
          by {item.restaurantName}
        </Text>

        <View className="mt-3 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={12} color="#16A34A" />
              <Text className="text-[11px] font-semibold text-text">{item.rating.toFixed(1)}</Text>
              <Text className="text-[11px] text-text-muted">• {item.eta}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-base font-bold text-[#EF4444]">₹{item.price}</Text>
            {item.originalPrice ? (
              <Text className="text-[11px] text-text-muted line-through">
                ₹{item.originalPrice}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
