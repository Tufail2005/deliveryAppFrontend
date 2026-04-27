import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../../src/components/BackButton";
import FoodItemCard, { FoodItem } from "../../../src/components/FoodItemCard";

const MENU_BY_RESTAURANT: Record<string, FoodItem[]> = {
  "1": [
    {
      id: "1-1",
      name: "Farmhouse Pizza",
      price: 399,
      description: "Tomato basil sauce, mozzarella, mushrooms, peppers and olives.",
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
      isVeg: true,
    },
    {
      id: "1-2",
      name: "Cheese Burst Garlic Bread",
      price: 179,
      description: "Oven-baked bread topped with garlic butter and melted cheese.",
      imageUrl:
        "https://images.unsplash.com/photo-1601924582971-4595d33c8135?w=500&q=80",
      isVeg: true,
    },
    {
      id: "1-3",
      name: "Mango Smoothie",
      price: 149,
      description: "Fresh mango blend with yogurt and orange sherbet.",
      imageUrl:
        "https://images.unsplash.com/photo-1598515212460-154bceb2f6ac?w=500&q=80",
      isVeg: true,
    },
  ],
  "2": [
    {
      id: "2-1",
      name: "Spicy Chicken Burger",
      price: 249,
      description: "Crispy chicken patty with lettuce, cheese, and fiery mayo.",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      isVeg: false,
    },
    {
      id: "2-2",
      name: "French Fries",
      price: 129,
      description: "Crispy golden fries seasoned with garlic and herbs.",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
      isVeg: true,
    },
    {
      id: "2-3",
      name: "Cola Float",
      price: 99,
      description: "Cold cola topped with creamy vanilla ice cream.",
      imageUrl:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80",
      isVeg: true,
    },
  ],
  "3": [
    {
      id: "3-1",
      name: "Chocolate Lava Cake",
      price: 179,
      description: "Warm cake with molten chocolate center and vanilla ice cream.",
      imageUrl:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80",
      isVeg: true,
    },
    {
      id: "3-2",
      name: "Berry Cheesecake",
      price: 229,
      description: "Creamy cheesecake with a mixed berry compote topping.",
      imageUrl:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80",
      isVeg: true,
    },
    {
      id: "3-3",
      name: "Cold Brew Coffee",
      price: 119,
      description: "Smooth cold brew served with a citrus twist.",
      imageUrl:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80",
      isVeg: true,
    },
  ],
};

export default function RestaurantScreen() {
  const router = useRouter();
  const { id, name, imageUrl, cuisine, rating, eta, costForTwo } = useLocalSearchParams<{
    id: string;
    name: string;
    imageUrl: string;
    cuisine: string;
    rating: string;
    eta: string;
    costForTwo: string;
  }>();

  const items = MENU_BY_RESTAURANT[id ?? "1"] || [];

  return (
    <View className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative h-96 bg-gray-100">
          <Image
            source={{ uri: imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80" }}
            className="w-full h-full"
          />
          <SafeAreaView className="absolute top-0 left-0 right-0 px-4 py-4">
            <BackButton />
          </SafeAreaView>
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-8">
            <Text className="text-3xl font-black text-white">{name || "Restaurant"}</Text>
            <Text className="mt-2 text-sm text-gray-200">{cuisine || "Indian, Fast Food"}</Text>
          </View>
        </View>

        <View className="px-6 py-6 space-y-4">
          <View className="flex-row items-center justify-between rounded-[24px] bg-white px-5 py-4 shadow-sm border border-gray-100">
            <View>
              <Text className="text-xs uppercase tracking-[0.2em] text-text-muted">Delivery</Text>
              <Text className="text-lg font-bold text-text mt-1">{eta || "25-30 min"}</Text>
            </View>
            <View>
              <Text className="text-xs uppercase tracking-[0.2em] text-text-muted">Cost</Text>
              <Text className="text-lg font-bold text-text mt-1">{costForTwo || "₹399 for two"}</Text>
            </View>
          </View>

          <View className="rounded-[28px] bg-white p-5 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-text mb-3">Popular Dishes</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {['Pizza', 'Burgers', 'Desserts', 'Beverages'].map((tag) => (
                <View key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                  <Text className="text-xs font-semibold text-text-muted">{tag}</Text>
                </View>
              ))}
            </View>
            <Text className="text-sm text-text-muted leading-6">
              {`Discover curated items from this kitchen. Each dish is prepared fresh to order and delivered hot.`}
            </Text>
          </View>

          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-text">Menu</Text>
              <TouchableOpacity onPress={() => router.push("/(customer)/cart")}> 
                <Text className="text-sm font-semibold text-primary">View cart</Text>
              </TouchableOpacity>
            </View>
            <View className="space-y-4">
              {items.map((item) => (
                <FoodItemCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
