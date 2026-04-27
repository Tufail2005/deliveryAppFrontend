import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CategoryPill from "../../src/components/CategoryPill";
import ImageCategoryCard from "../../src/components/ImageCategoryCard";
import RestaurantCard, { Restaurant } from "../../src/components/RestaurantCard";

const CATEGORIES = [
  {
    id: "1",
    title: "Pizza",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
  },
  {
    id: "2",
    title: "Burger",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  },
  {
    id: "3",
    title: "Desserts",
    imageUrl:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80",
  },
  {
    id: "4",
    title: "Drinks",
    imageUrl:
      "https://images.unsplash.com/photo-1542444459-db22c1d5ed3f?w=500&q=80",
  },
];

const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "The Grand Kitchen",
    cuisine: "North Indian • Fast Food",
    rating: 4.8,
    eta: "25-30 min",
    costForTwo: "₹450 for two",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    badge: "Top Rated",
    offer: "20% off on first order",
  },
  {
    id: "2",
    name: "Burger Lab",
    cuisine: "Burgers • Fries",
    rating: 4.6,
    eta: "18-22 min",
    costForTwo: "₹320 for two",
    imageUrl:
      "https://images.unsplash.com/photo-1605477019003-2e533f64db7f?w=500&q=80",
    badge: "Popular",
    offer: "Free soft drink",
  },
  {
    id: "3",
    name: "Sweet Cravings",
    cuisine: "Desserts • Beverages",
    rating: 4.9,
    eta: "12-18 min",
    costForTwo: "₹280 for two",
    imageUrl:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80",
    badge: "Trending",
    offer: "Buy 1 get 1 on shakes",
  },
];

export default function MenuScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("1");

  const filteredRestaurants = useMemo(
    () =>
      RESTAURANTS.filter((restaurant) => {
        if (activeCategory === "1") return true;
        if (activeCategory === "2") return restaurant.cuisine.includes("Burgers");
        if (activeCategory === "3") return restaurant.cuisine.includes("Desserts");
        if (activeCategory === "4") return restaurant.cuisine.includes("Beverages") || restaurant.name.includes("Kitchen");
        return true;
      }),
    [activeCategory]
  );

  const renderHeader = () => (
    <View className="px-6 pt-6">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-sm text-text-muted">Good afternoon</Text>
          <Text className="text-3xl font-bold text-text">Explore restaurants</Text>
        </View>
        <TouchableOpacity className="h-14 w-14 rounded-3xl bg-white items-center justify-center shadow-sm">
          <Text className="text-xl">📍</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between mb-5">
        <TouchableOpacity
          onPress={() => router.push("/(customer)/orders")}
          className="rounded-3xl bg-white px-4 py-3 shadow-sm border border-gray-100"
        >
          <Text className="text-sm font-semibold text-text">Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(customer)/profile")}
          className="rounded-3xl bg-white px-4 py-3 shadow-sm border border-gray-100"
        >
          <Text className="text-sm font-semibold text-text">Profile</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-base text-text-muted mb-4">
        Choose a category and order from the best nearby kitchens.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {CATEGORIES.map((category) => (
          <CategoryPill
            key={category.id}
            title={category.title}
            imageUrl={category.imageUrl}
            isActive={activeCategory === category.id}
            onPress={() => setActiveCategory(category.id)}
          />
        ))}
      </ScrollView>

      <Text className="text-xl font-bold text-text mb-4">Featured collections</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        {CATEGORIES.map((category) => (
          <ImageCategoryCard
            key={category.id}
            title={category.title}
            imageUrl={category.imageUrl}
            onPress={() => setActiveCategory(category.id)}
          />
        ))}
      </ScrollView>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-text">Popular restaurants</Text>
        <TouchableOpacity onPress={() => router.push("/(customer)/cart")}> 
          <Text className="text-sm font-semibold text-primary">View cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View className="px-6">
            <RestaurantCard
              restaurant={item}
              onPress={() =>
                router.push({
                  pathname: "/(customer)/restaurant/[id]",
                  params: {
                    id: item.id,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    cuisine: item.cuisine,
                    rating: item.rating.toString(),
                    eta: item.eta,
                    costForTwo: item.costForTwo,
                  },
                })
              }
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
