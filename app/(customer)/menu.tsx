import React from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../src/components/BackButton";
import FoodItemCard, { FoodItem } from "../../src/components/FoodItemCard";
import VisualCategoryCard from "../../src/components/VisualCategoryCard";

// --- DUMMY DATA ---
const VISUAL_CATEGORIES = [
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
];

const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "Farmhouse Pizza",
    price: 399,
    description: "A combination of onion, capsicum, tomato & grilled mushroom.",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    isVeg: true,
  },
  {
    id: "2",
    name: "Spicy Chicken Burger",
    price: 249,
    description:
      "Crispy fried chicken patty with spicy mayo and fresh lettuce.",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    isVeg: false,
  },
  {
    id: "3",
    name: "Choco Lava Cake",
    price: 129,
    description: "Chocolate lover's delight with a gooey chocolate center.",
    imageUrl:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80",
    isVeg: true,
  },
];

export default function MenuScreen() {
  // This function renders the top half of the screen (Header + Categories)
  const renderHeader = () => (
    <View>
      {/* 1. Restaurant Header */}
      <View className="px-4 py-2 flex-row items-center gap-4 pb-6">
        <BackButton />
        <View>
          <Text className="text-2xl font-bold text-text">
            The Grand Kitchen
          </Text>
          <Text className="text-sm text-text-muted">
            North Indian, Fast Food • 4.5 ⭐
          </Text>
        </View>
      </View>

      {/* 2. Visual Categories Section */}
      <View className="px-4 mb-8">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-xl font-bold text-text">The Categories</Text>
          <TouchableOpacity>
            <Text className="text-sm font-bold text-primary">View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="overflow-visible"
        >
          {VISUAL_CATEGORIES.map((cat) => (
            <VisualCategoryCard
              key={cat.id}
              title={cat.title}
              imageUrl={cat.imageUrl}
              onPress={() => console.log(`Selected ${cat.title}`)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 3. Recommended Title (Right before the FlatList items start) */}
      <View className="px-4 mb-2">
        <Text className="text-xl font-bold text-text">Recommended</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <FlatList
        data={FOOD_ITEMS}
        keyExtractor={(item) => item.id}
        // Inject the entire top UI above the list of food items
        ListHeaderComponent={renderHeader}
        // Render the food items we built earlier
        renderItem={({ item }) => (
          <View className="px-4">
            <FoodItemCard item={item} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
