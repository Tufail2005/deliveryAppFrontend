import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../../src/components/BackButton";
import FoodGridCard, {
  GridFoodItem,
} from "../../../src/components/FoodGridCard";
import ItemDetailModal from "../../../src/components/itemDetailModel";
import { useCart } from "../../../src/contexts/CartContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80";

const CATEGORIES = ["Burger", "Sandwich", "Pizza", "Drinks"];

const MENU_ITEMS: GridFoodItem[] = [
  {
    id: "f1",
    name: "Burger Ferguson",
    restaurantName: "Spicy Restaurant",
    price: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    description:
      "A classic burger with fresh lettuce, tomato, and our secret spicy sauce.",
  },
  {
    id: "f2",
    name: "Rockin' Burgers",
    restaurantName: "Cafecafachino",
    price: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1594212204688-a38db6770fec?w=500&q=80",
    description: "Double patty burger packed with flavor and melted cheese.",
  },
  {
    id: "f3",
    name: "Cheese Beast",
    restaurantName: "Burger Bistro",
    price: 38,
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
    description: "Overflowing with three types of cheese and crispy bacon.",
  },
  {
    id: "f4",
    name: "Spicy Chicken",
    restaurantName: "Halal Lab",
    price: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=500&q=80",
    description: "Crispy fried chicken breast with jalapeños and spicy mayo.",
  },
];

export default function RestaurantScreen() {
  const { name, imageUrl, rating, eta, costForTwo } = useLocalSearchParams<{
    name: string;
    imageUrl: string;
    rating: string;
    eta: string;
    costForTwo: string;
  }>();

  const [activeCat, setActiveCat] = useState("Burger");

  // Modal State Variables
  const [selectedItem, setSelectedItem] = useState<GridFoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { addToCart } = useCart();

  const handleOpenItem = (item: GridFoodItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleAddToCart = (
    item: GridFoodItem,
    quantity: number,
    instructions: string
  ) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      imageUrl: item.imageUrl,
      isVeg: true, // You can make this dynamic later
    });
    console.log(
      `Added ${quantity}x ${item.name} with instructions: ${instructions}`
    );
    setModalVisible(false); // Close modal on success
  };

  const renderHeader = () => (
    <View>
      <View className="relative w-full h-72 bg-gray-100 rounded-b-[40px] overflow-hidden">
        <Image
          source={{
            uri:
              imageUrl ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
          }}
          className="w-full h-full"
        />
        <SafeAreaView className="absolute top-0 w-full px-6 pt-4 flex-row justify-between">
          <BackButton />
          <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
            <Ionicons name="ellipsis-horizontal" size={24} color="#0D0D0D" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <View className="px-6 pt-6">
        <View className="flex-row items-center gap-6 mb-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="star-outline" size={20} color="#FF863B" />
            <Text className="text-sm font-bold text-text">
              {rating || "4.7"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="car-outline" size={20} color="#FF863B" />
            <Text className="text-sm text-text-muted">
              {costForTwo || "Free"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={20} color="#FF863B" />
            <Text className="text-sm text-text-muted">{eta || "20 min"}</Text>
          </View>
        </View>

        <Text className="text-3xl font-bold text-text mb-2">
          {name || "Spicy Restaurant"}
        </Text>
        <Text className="text-sm text-text-muted leading-6 mb-6">
          Maecenas sed diam eget risus varius blandit sit amet non magna.
          Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8 overflow-visible"
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCat(cat)}
              className={`px-6 py-3 rounded-full mr-3 border ${
                activeCat === cat
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`font-semibold ${
                  activeCat === cat ? "text-white" : "text-text"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text className="text-xl font-bold text-text mb-4">
          {activeCat} ({MENU_ITEMS.length})
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        // 👇 Now we pass handleOpenItem instead of routing! 👇
        renderItem={({ item }) => (
          <FoodGridCard item={item} onPress={handleOpenItem} />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 24,
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />

      {/* Inject the Modal here! */}
      <ItemDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}
