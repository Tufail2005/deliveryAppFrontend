import { CATEGORY_UI_CONFIG } from "@/src/constants/allCatagories";
import { ItemCategory } from "@/src/types/catagories";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import type { ComponentProps } from "react";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveOrderBar from "../../src/components/ActiveOrderBar"; // 🚀 1. Imported your live tracking banner
import CategoryPill from "../../src/components/CategoryPill";
import FloatingCartBanner from "../../src/components/FloatingCartBanner";
import FoodGridCard, { GridFoodItem } from "../../src/components/FoodGridCard";
import ItemDetailModal from "../../src/components/itemDetailModel";
import RestaurantCard, {
  Restaurant,
} from "../../src/components/RestaurantCard";
import { useCart } from "../../src/contexts/CartContext";

type IonName = ComponentProps<typeof Ionicons>["name"];

interface ApiItemsResponse {
  items: GridFoodItem[];
}

interface ApiRestaurantsResponse {
  restaurants: Restaurant[];
}

interface UserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label: string | null | undefined;
  isDefault: boolean;
}

const getCategoryUI = (cat: ItemCategory) => {
  const config = CATEGORY_UI_CONFIG[cat];
  return {
    id: cat,
    title: config.title,
    image: "image" in config ? config.image : undefined,
    icon: "icon" in config ? config.icon : undefined,
  };
};

const MENU_CATEGORIES = [
  { id: "all", title: "All", icon: "flame" as const, image: undefined },
  ...Object.values(ItemCategory).map((cat) => getCategoryUI(cat)),
];

const visibleCategories = MENU_CATEGORIES.slice(0, 9);
const remainingCount = MENU_CATEGORIES.length - 9;
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

if (!baseUrl) {
  console.warn("EXPO_PUBLIC_API_URL environment variable is not set");
}

export default function MenuScreen() {
  const router = useRouter();

  // 1. Hook up search parameters to parse values returned backward from address selections
  const params = useLocalSearchParams<{ selectedAddressLabel?: string }>();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<GridFoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Core application database hooks state tracking
  const [items, setItems] = useState<GridFoodItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address state management
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressLabel, setSelectedAddressLabel] =
    useState<string>("Loading...");
  const [addressLoading, setAddressLoading] = useState(true);

  // Fetch user's saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setAddressLoading(true);
        const token = await SecureStore.getItemAsync("auth_token");

        if (!token || !baseUrl) {
          setSelectedAddressLabel("Select location");
          return;
        }

        const response = await axios.get<UserAddress[]>(
          `${baseUrl}/user/addresses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setAddresses(response.data);

          // 👈 DIRECT DATABASE LOOKUP
          // Find the active address natively, fallback to index 0 just in case
          const activeAddress =
            response.data.find((addr) => addr.isDefault) || response.data[0];

          const homeAddress = response.data.find(
            (addr) => addr.label?.toLowerCase() === "home"
          );
          const defaultAddress = homeAddress || response.data[0];
          setSelectedAddressLabel(
            activeAddress.label ||
              `${activeAddress.street}, ${activeAddress.city}`
          );
        } else {
          setSelectedAddressLabel("Select location");
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        setSelectedAddressLabel("Select location");
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Update selected address when params change
  useEffect(() => {
    if (params.selectedAddressLabel) {
      setSelectedAddressLabel(params.selectedAddressLabel);
    }
  }, [params.selectedAddressLabel]);

  // Fetch live contextual food items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!baseUrl) {
          throw new Error("API URL not configured");
        }

        const response = await axios.get<ApiItemsResponse>(
          `${baseUrl}/customer/item`,
          {
            params: {
              category:
                activeCategory === "all"
                  ? undefined
                  : activeCategory.toUpperCase(),
            },
          }
        );

        if (response.data?.items) {
          setItems(response.data.items);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch items";
        console.error("Connection failed:", errorMessage);
        setError(errorMessage);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeCategory, baseUrl]);

  // Fetch live restaurant directory profiles on application mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      setRestaurantLoading(true);
      try {
        if (!baseUrl) return;
        const response = await axios.get<ApiRestaurantsResponse>(
          `${baseUrl}/customer/restaurants`
        );
        if (response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        }
      } catch (err) {
        console.error("Failed fetching live restaurant entries:", err);
      } finally {
        setRestaurantLoading(false);
      }
    };

    fetchRestaurants();
  }, [baseUrl]);

  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  const getItemQuantity = (itemId: string) => {
    const cartItem = cartItems.find((i: any) => i.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleIncrease = (item: GridFoodItem) => {
    const currentQty = getItemQuantity(item.id);
    updateQuantity(item.id, currentQty + 1);
  };

  const handleDecrease = (item: GridFoodItem) => {
    const currentQty = getItemQuantity(item.id);
    if (currentQty <= 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, currentQty - 1);
    }
  };

  const getRestaurantName = (restId: string) => {
    const found = restaurants.find((r) => r.id === restId);
    return found ? found.name : "this kitchen";
  };

  const quickAdd = (item: GridFoodItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      isVeg: true,
      restaurantId: item.restaurantId,
      restaurantName: getRestaurantName(item.restaurantId),
    });
  };

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
      restaurantId: item.restaurantId,
      restaurantName: getRestaurantName(item.restaurantId),
    });
    setModalVisible(false);
  };

  const filteredRestaurants = useMemo(
    () =>
      restaurants.filter((restaurant) => {
        const query = search.toLowerCase();
        return restaurant.name.toLowerCase().includes(query);
      }),
    [search, restaurants]
  );

  const renderHeader = () => (
    <View className="px-6 pt-6">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xs uppercase tracking-[0.3em] text-primary font-bold">
            Deliver to
          </Text>

          {/* 2. Dispatches selectable flag configurations directly down routing payload metrics */}
          
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(customer)/addresses",
                params: { selectable: "true" }, // 👈 Forces selection mechanics over normal viewing mode safely!
              })
            }
            className="mt-3 flex-row items-center gap-2"
          >
            <Text className="text-base font-bold text-text">
              {selectedAddressLabel || "Select location"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#0D0D0D" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(customer)/profile")}
          className="h-14 w-14 rounded-full overflow-hidden shadow-sm border border-gray-100"
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=11" }}
            className="w-full h-full bg-gray-200"
          />
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-6 -mx-6 pl-6"
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {visibleCategories.map((category) => (
          <CategoryPill
            key={category.id}
            title={category.title}
            imageSource={category.image}
            iconName={category.icon}
            isActive={activeCategory === category.id}
            onPress={() => setActiveCategory(category.id)}
          />
        ))}
        {remainingCount > 0 && (
          <CategoryPill
            title="See All"
            iconName="grid-outline"
            iconColor="#6B7280"
            isActive={false}
            onPress={() => router.push("/(customer)/all-categories" as any)}
          />
        )}
      </ScrollView>

      {error && (
        <View className="bg-red-100 border border-red-300 rounded-lg p-3 mt-6 mb-2">
          <Text className="text-red-700 text-sm font-semibold">
            Error Loading Feed
          </Text>
          <Text className="text-red-600 text-xs mt-1">{error}</Text>
        </View>
      )}

      {activeCategory === "all" && (
        <View className="mt-8">
          <View className="flex-row items-center justify-between px-0 mb-4">
            <Text className="text-xl font-bold text-text">Discover Items</Text>
            <TouchableOpacity
              onPress={() => router.push("/(customer)/orders")}
              className="px-2 py-1"
            >
              <Text className="text-sm font-semibold text-primary">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-6 pl-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FF863B"
                className="py-8 pl-6"
              />
            ) : items.length > 0 ? (
              items.map((item) => (
                <FoodGridCard
                  key={item.id}
                  item={item}
                  className="mr-4 w-[190px]"
                  onPress={() => handleOpenItem(item)}
                  onAdd={quickAdd}
                  cartQuantity={getItemQuantity(item.id)}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))
            ) : (
              <View className="py-8 pl-6">
                <Text className="text-gray-400 font-semibold">
                  No food options available to explore.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {activeCategory !== "all" && (
        <View className="mt-8">
          <View className="flex-row items-center justify-between px-0 mb-4">
            <Text className="text-xl font-bold text-text">
              {MENU_CATEGORIES.find((c) => c.id === activeCategory)?.title}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-6 pl-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FF863B"
                className="py-8 pl-6"
              />
            ) : items.length > 0 ? (
              items.map((item) => (
                <FoodGridCard
                  key={item.id}
                  item={item}
                  className="mr-4 w-[190px]"
                  onPress={() => handleOpenItem(item)}
                  onAdd={quickAdd}
                  cartQuantity={getItemQuantity(item.id)}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))
            ) : (
              <View className="py-8 pl-6">
                <Text className="text-gray-400 font-semibold">
                  No kitchen items prepared for this category today.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

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
      {restaurantLoading && restaurants.length === 0 ? (
        <View className="pt-8 flex items-center justify-center">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <FlatList
          key="restaurants-list"
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
                      rating: item.rating.toString(),
                      eta: item.eta,
                      description: item.description ?? "",
                    },
                  })
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="py-12 flex items-center justify-center">
              <Text className="text-gray-400 font-semibold text-base">
                No active partner kitchens found.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ItemDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />

      <FloatingCartBanner />

      {/* 🚀 2. MOUNTED HERE: Renders the active order bar beautifully over your list layout layer */}
      <ActiveOrderBar />
    </SafeAreaView>
  );
}