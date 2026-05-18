import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../../src/components/BackButton";
import FloatingCartBanner from "../../../src/components/FloatingCartBanner";
import FoodGridCard, {
  GridFoodItem,
} from "../../../src/components/FoodGridCard";
import ItemDetailModal from "../../../src/components/itemDetailModel";
import { useCart } from "../../../src/contexts/CartContext";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/6546548/pexels-photo-6546548.jpeg";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

interface ApiItemsResponse {
  items: GridFoodItem[];
}

export default function RestaurantScreen() {
  const { id, name, imageUrl, rating, eta, description } = useLocalSearchParams<{
    id: string;
    name: string;
    imageUrl: string;
    rating: string;
    eta: string;
    description: string;
  }>();

  const [selectedItem, setSelectedItem] = useState<GridFoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // States for live database items
  const [items, setItems] = useState<GridFoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();

  // Fetch ALL items for this specific restaurant without passing a category constraint
  useEffect(() => {
    const fetchEntireMenu = async () => {
      if (!id || !baseUrl) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiItemsResponse>(`${baseUrl}/customer/restaurants/${id}/items`, {
          params: {
            restaurantId: id as string, // Only pass the restaurant ID to get everything!
          },
        });

        if (response.data?.items) {
          setItems(response.data.items);
        } else {
          throw new Error("Invalid format returned from menu server");
        }
      } catch (err) {
        console.error("Error pulling full restaurant menu items:", err);
        setError("Could not load the menu details.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntireMenu();
  }, [id]);

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
      isVeg: true,
      restaurantId: id || "rest_1",
      restaurantName: name || item.restaurantName,
    });
    setModalVisible(false);
  };

  const renderHeader = () => (
    <View>
      <View className="relative w-full h-72 bg-gray-100 rounded-b-[40px] overflow-hidden">
        <Image
          source={{
            uri: imageUrl || FALLBACK_IMAGE,
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <SafeAreaView className="absolute top-0 w-full px-6 pt-4 flex-row justify-between">
          <BackButton />
          <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
            <Ionicons name="ellipsis-horizontal" size={24} color="#0D0D0D" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <View className="px-6 pt-6 mb-2">
        <View className="flex-row items-center gap-6 mb-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={18} color="#FF863B" />
            <Text className="text-sm font-bold text-text">
              {rating ? Number(rating).toFixed(1) : "4.0"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="car-outline" size={20} color="#FF863B" />
            <Text className="text-sm text-text-muted">1 km</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={20} color="#FF863B" />
            <Text className="text-sm text-text-muted">{eta || "25-35 min"}</Text>
          </View>
        </View>

        <Text className="text-3xl font-bold text-text mb-2">
          {name || "Kitchen Partner"}
        </Text>
        <Text className="text-sm text-text-muted leading-6 mb-6">
          {description? description:"Delicious meals prepared fresh daily with quality ingredients. Scroll down to see our full available menu"}
        </Text>

        <Text className="text-xl font-bold text-text mb-2">
          Full Menu ({items.length} items)
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {error && (
        <View className="bg-red-100 border border-red-300 rounded-lg p-3 mx-6 mt-4">
          <Text className="text-red-700 text-sm font-semibold">{error}</Text>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center pt-10">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <FoodGridCard item={item} onPress={handleOpenItem} />
          )}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 24,
          }}
          ListEmptyComponent={
            <View className="py-12 flex items-center justify-center">
              <Text className="text-gray-400 font-semibold text-base">
                No items are loaded in the menu for this kitchen yet.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      )}

      <ItemDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />

      <FloatingCartBanner />
    </View>
  );
}