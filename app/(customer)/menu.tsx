import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import type { ComponentProps } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryPill from "../../src/components/CategoryPill";
import RestaurantCard, { Restaurant } from "../../src/components/RestaurantCard";
import { getRestaurantCoverUri } from "../../src/constants/restaurantCovers";

type IonName = ComponentProps<typeof Ionicons>["name"];

type MenuCategory = {
  id: string;
  title: string;
  /** Matches against restaurant name + cuisine (lowercased); empty ⇒ “All”. */
  filterTerms: string[];
  image?: ImageSourcePropType;
  icon?: IonName;
};

const CATEGORY_IMAGES = {
  noodles: require("../../assets/categories/noodles.png"),
  cake: require("../../assets/categories/cake.png"),
  biryani: require("../../assets/categories/biryani.png"),
  burger: require("../../assets/categories/burger.png"),
  wrap: require("../../assets/categories/wrap.png"),
  sandwich: require("../../assets/categories/sandwich.png"),
  momos: require("../../assets/categories/momos.png"),
  pizza: require("../../assets/categories/pizza.png"),
} as const;

const MENU_CATEGORIES: MenuCategory[] = [
  { id: "all", title: "All", filterTerms: [], icon: "flame" },
  { id: "noodles", title: "Noodles", filterTerms: ["noodle", "ramen", "pho"], image: CATEGORY_IMAGES.noodles },
  { id: "cake", title: "Cakes", filterTerms: ["cake", "dessert", "sweet"], image: CATEGORY_IMAGES.cake },
  { id: "biryani", title: "Biryani", filterTerms: ["biryani", "rice bowl", "indian rice"], image: CATEGORY_IMAGES.biryani },
  { id: "burger", title: "Burger", filterTerms: ["burger"], image: CATEGORY_IMAGES.burger },
  { id: "wrap", title: "Wraps", filterTerms: ["wrap", "burrito", "shawarma", "kebab"], image: CATEGORY_IMAGES.wrap },
  { id: "sandwich", title: "Sandwich", filterTerms: ["sandwich"], image: CATEGORY_IMAGES.sandwich },
  { id: "momos", title: "Momos", filterTerms: ["momo", "dumpling", "dim sum", "gyoza"], image: CATEGORY_IMAGES.momos },
  { id: "pizza", title: "Pizza", filterTerms: ["pizza"], image: CATEGORY_IMAGES.pizza },
];

const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Casa Mañana",
    cuisine: "Mexican • Breakfast • Brunch",
    rating: 4.8,
    eta: "22 min",
    costForTwo: "Free delivery",
    badge: "Brunch fave",
    offer: "Free salsa on weekends",
  },
  {
    id: "2",
    name: "Lotus Nine",
    cuisine: "Asian • Chinese • Rice • Healthy",
    rating: 4.7,
    eta: "19 min",
    costForTwo: "Free delivery",
    badge: "Steam fresh",
    offer: "$5 off combos",
  },
  {
    id: "3",
    name: "Yellow Pot Alley",
    cuisine: "Street food • Dumpling • Traditional",
    rating: 4.9,
    eta: "16 min",
    costForTwo: "Free delivery",
    badge: "Local hit",
    offer: "Handmade specials daily",
  },
  {
    id: "4",
    name: "Carving Table",
    cuisine: "Mediterranean • Italian • Gourmet",
    rating: 4.85,
    eta: "25 min",
    costForTwo: "Free delivery",
    badge: "Chef’s pick",
    offer: "Charcuterie board add-on",
  },
  {
    id: "5",
    name: "Verde Garden",
    cuisine: "Salads • Healthy • Bowls • Vegan-friendly",
    rating: 4.6,
    eta: "18 min",
    costForTwo: "Free delivery",
    badge: "Fresh",
    offer: "2-for-1 lunch bowls Mon–Thu",
  },
  {
    id: "6",
    name: "Sole Margherita",
    cuisine: "Pizza • Italian • Wood-fired",
    rating: 4.92,
    eta: "24 min",
    costForTwo: "Free delivery",
    badge: "Top rated",
    offer: "Any two pizzas −15%",
  },
];

export default function MenuScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredRestaurants = useMemo(
    () =>
      RESTAURANTS.filter((restaurant) => {
        const query = search.toLowerCase();
        const matchesSearch =
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query);
        if (search && !matchesSearch) return false;
        const cat = MENU_CATEGORIES.find((c) => c.id === activeCategory);
        if (!cat || cat.filterTerms.length === 0) return true;
        const haystack = `${restaurant.name} ${restaurant.cuisine}`.toLowerCase();
        return cat.filterTerms.some((term) => haystack.includes(term));
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
            <Text className="text-base font-bold text-text">
              Halal Lab office
            </Text>
            <Ionicons name="chevron-down" size={18} color="#0D0D0D" />
          </TouchableOpacity>
        </View>

        {/* --- CHANGED: Profile Avatar Button --- */}
        <TouchableOpacity
          onPress={() => router.push("/(customer)/profile")} // Routes to profile.tsx
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
        {MENU_CATEGORIES.map((category) => (
          <CategoryPill
            key={category.id}
            title={category.title}
            imageSource={category.image}
            iconName={category.icon}
            isActive={activeCategory === category.id}
            onPress={() => setActiveCategory(category.id)}
          />
        ))}
      </ScrollView>

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
                    imageUrl: getRestaurantCoverUri(item.id) ?? item.imageUrl ?? "",
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
