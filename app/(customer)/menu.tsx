import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import RestaurantCard, { Restaurant } from "../../src/components/RestaurantCard";

const CATEGORIES = [
  { id: "1", title: "All", icon: "flame-outline" },
  { id: "2", title: "Hot Dog", icon: "fast-food-outline" },
  { id: "3", title: "Burger", icon: "fast-food-outline" },
  { id: "4", title: "Pizza", icon: "pizza-outline" },
];

const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Rose Garden Restaurant",
    cuisine: "Burger • Chicken • Rice • Wings",
    rating: 4.7,
    eta: "20 min",
    costForTwo: "Free delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    badge: "Top Rated",
    offer: "20% off on first order",
  },
  {
    id: "2",
    name: "Café Bloom",
    cuisine: "Salads • Healthy • Bowls",
    rating: 4.5,
    eta: "18 min",
    costForTwo: "Free delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8c5d?w=500&q=80",
    badge: "Fresh",
    offer: "Healthy picks",
  },
];

export default function MenuScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("1");
  const [search, setSearch] = useState("");

  const filteredRestaurants = useMemo(
    () =>
      RESTAURANTS.filter((restaurant) => {
        const query = search.toLowerCase();
        const matchesSearch =
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query);
        if (search && !matchesSearch) return false;
        if (activeCategory === "1") return true;
        return restaurant.cuisine.toLowerCase().includes(activeCategory === "2" ? "hot dog" : activeCategory === "3" ? "burger" : "pizza");
      }),
    [activeCategory, search]
  );

  const renderHeader = () => (
    <View className="px-6 pt-6">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xs uppercase tracking-[0.3em] text-primary font-bold">
            Deliver to
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(customer)/addresses")}
            className="mt-3 flex-row items-center gap-2"
          >
            <Text className="text-base font-bold text-text">Halal Lab office</Text>
            <Ionicons name="chevron-down" size={18} color="#0D0D0D" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(customer)/cart")}
          className="h-14 w-14 rounded-3xl bg-black items-center justify-center shadow-sm"
        >
          <Ionicons name="cart" size={24} color="#fff" />
          <View className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-primary items-center justify-center">
            <Text className="text-xs font-bold text-white">2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text className="text-3xl font-bold text-text">Hey Halal,</Text>
      <Text className="text-3xl font-bold text-text">Good Afternoon!</Text>

      <View className="mt-6 rounded-3xl bg-white px-4 py-4 shadow-sm border border-gray-100 flex-row items-center gap-3">
        <Ionicons name="search" size={20} color="#D1D5DB" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search dishes, restaurants"
          className="flex-1 text-base text-text"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View className="mt-6 flex-row items-center gap-3">
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setActiveCategory(category.id)}
            className={`rounded-full px-4 py-3 flex-row items-center gap-2 ${
              activeCategory === category.id ? "bg-primary" : "bg-gray-100"
            }`}
          >
            <Ionicons name={category.icon as any} size={18} color={activeCategory === category.id ? "#fff" : "#374151"} />
            <Text className={`${activeCategory === category.id ? "text-white" : "text-text"} font-semibold`}>
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-8 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-text">Open Restaurants</Text>
        <TouchableOpacity onPress={() => router.push("/(customer)/orders")}> 
          <Text className="text-sm font-semibold text-primary">See all</Text>
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
