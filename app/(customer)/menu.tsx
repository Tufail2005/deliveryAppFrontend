import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import React, { useMemo, useState } from "react";
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
import FoodGridCard, { GridFoodItem } from "../../src/components/FoodGridCard";
import ItemDetailModal from "../../src/components/itemDetailModel";
import RestaurantCard, { Restaurant } from "../../src/components/RestaurantCard";
import { getRestaurantCoverUri } from "../../src/constants/restaurantCovers";
import { useCart } from "../../src/contexts/CartContext";

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

const POPULAR_ITEMS: GridFoodItem[] = [
  {
    id: "p1",
    name: "Double Breast Chicken Burger",
    restaurantName: "Burger Tree",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    description: "Crispy chicken, fresh lettuce and signature sauce.",
  },
  {
    id: "p2",
    name: "Veg Snacker Burger",
    restaurantName: "Burger Singh",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1606755962776-7a4e3f70e8d7?auto=format&fit=crop&w=800&q=80",
    description: "Spiced veggie patty with melted cheese and chutney.",
  },
  {
    id: "p3",
    name: "Chicken Slaw Burger",
    restaurantName: "Burger Junction",
    price: 69,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "Juicy chicken, slaw and tangy mayo in a toasted bun.",
  },
];

const CATEGORY_ITEMS: { [key: string]: GridFoodItem[] } = {
  burger: [
    {
      id: "b1",
      name: "Classic Beef Burger",
      restaurantName: "Burger Tree",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
      description: "Juicy beef patty with lettuce, tomato, and mayo.",
    },
    {
      id: "b2",
      name: "Veg Snacker",
      restaurantName: "Burger Singh",
      price: 49,
      imageUrl: "https://images.unsplash.com/photo-1606755962776-7a4e3f70e8d7?auto=format&fit=crop&w=800&q=80",
      description: "Crispy veggie patty with cheese and chutney.",
    },
    {
      id: "b3",
      name: "Chicken Slaw",
      restaurantName: "Burger Junction",
      price: 69,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      description: "Fried chicken with coleslaw and spicy mayo.",
    },
    {
      id: "b4",
      name: "Cheese Beast",
      restaurantName: "Burger Bistro",
      price: 89,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
      description: "Triple cheese with bacon and crispy fries.",
    },
  ],
  pizza: [
    {
      id: "pz1",
      name: "Margherita",
      restaurantName: "Sole Margherita",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&q=80",
      description: "Classic pizza with fresh mozzarella and basil.",
    },
    {
      id: "pz2",
      name: "Pepperoni",
      restaurantName: "Sole Margherita",
      price: 279,
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=500&q=80",
      description: "Loaded with pepperoni and melted cheese.",
    },
    {
      id: "pz3",
      name: "Veggie Supreme",
      restaurantName: "Green Crust",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1511689915941-5055fed14442?w=500&q=80",
      description: "Fresh vegetables with olive oil and herbs.",
    },
  ],
  noodles: [
    {
      id: "n1",
      name: "Chow Mein",
      restaurantName: "Lotus Nine",
      price: 129,
      imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221fcf4f?w=500&q=80",
      description: "Crispy noodles with vegetables and soy sauce.",
    },
    {
      id: "n2",
      name: "Ramen Bowl",
      restaurantName: "Ramen House",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1618341996804-d9b63f8dd8c4?w=500&q=80",
      description: "Japanese ramen with rich broth and toppings.",
    },
    {
      id: "n3",
      name: "Pad Thai",
      restaurantName: "Thai Spice",
      price: 119,
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
      description: "Thai noodles with peanut sauce and lime.",
    },
  ],
  cake: [
    {
      id: "c1",
      name: "Chocolate Cake",
      restaurantName: "Sweet Bakes",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
      description: "Rich chocolate cake with smooth frosting.",
    },
    {
      id: "c2",
      name: "Cheesecake",
      restaurantName: "Sweet Bakes",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1615521471907-36ec42b67497?w=500&q=80",
      description: "Creamy cheesecake with berry topping.",
    },
  ],
  biryani: [
    {
      id: "br1",
      name: "Hyderabadi Biryani",
      restaurantName: "Biryani House",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=500&q=80",
      description: "Authentic Hyderabadi biryani with basmati rice.",
    },
    {
      id: "br2",
      name: "Chicken Biryani",
      restaurantName: "Rice Palace",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1559866150-cd4628902249?w=500&q=80",
      description: "Fragrant chicken with aromatic spices.",
    },
    {
      id: "br3",
      name: "Veg Biryani",
      restaurantName: "Green Rice",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1584622800694-64553f1ec4d3?w=500&q=80",
      description: "Mixed vegetables with basmati rice.",
    },
  ],
  wrap: [
    {
      id: "w1",
      name: "Chicken Shawarma",
      restaurantName: "Shawarma King",
      price: 129,
      imageUrl: "https://images.unsplash.com/photo-1599599810694-cd5e3b0f0d4b?w=500&q=80",
      description: "Spiced chicken wrapped in pita bread.",
    },
    {
      id: "w2",
      name: "Veg Wrap",
      restaurantName: "Wrap Master",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1606787620884-c0dec3b7b754?w=500&q=80",
      description: "Fresh vegetables in a soft tortilla.",
    },
    {
      id: "w3",
      name: "Beef Burrito",
      restaurantName: "Mexican Kitchen",
      price: 179,
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80",
      description: "Seasoned beef with beans and rice.",
    },
  ],
  sandwich: [
    {
      id: "s1",
      name: "Grilled Chicken",
      restaurantName: "Sandwich Co",
      price: 139,
      imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80",
      description: "Chargrilled chicken on multigrain bread.",
    },
    {
      id: "s2",
      name: "Club Sandwich",
      restaurantName: "Cafe Express",
      price: 169,
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80",
      description: "Triple decker with chicken, bacon, and veggies.",
    },
    {
      id: "s3",
      name: "Veggie Delight",
      restaurantName: "Green Cafe",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
      description: "Fresh vegetables with mayo on whole wheat.",
    },
  ],
  momos: [
    {
      id: "m1",
      name: "Chicken Momos",
      restaurantName: "Momo House",
      price: 89,
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
      description: "Steamed dumplings with spiced chicken filling.",
    },
    {
      id: "m2",
      name: "Veg Momos",
      restaurantName: "Momo Paradise",
      price: 69,
      imageUrl: "https://images.unsplash.com/photo-1608270861620-7aae4d755744?w=500&q=80",
      description: "Vegetable dumplings with ginger sauce.",
    },
    {
      id: "m3",
      name: "Pork Momos",
      restaurantName: "Asian Bites",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1609501676725-3d2f0b1a4b97?w=500&q=80",
      description: "Steamed pork dumplings with chili oil.",
    },
  ],
};

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
      isVeg: true,
    });
    setModalVisible(false);
  };

  const filteredRestaurants = useMemo(
    () =>
      RESTAURANTS.filter((restaurant) => {
        const query = search.toLowerCase();
        const matchesSearch =
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query);
        if (search && !matchesSearch) return false;
        return true;
      }),
    [search]
  );

  const filteredCategoryItems = useMemo(() => {
    if (activeCategory === "all") return [];
    const items = CATEGORY_ITEMS[activeCategory] || [];
    const query = search.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.restaurantName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [activeCategory, search]);

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

      {activeCategory === "all" && (
        <View className="mt-8">
          <View className="flex-row items-center justify-between px-0 mb-4">
            <Text className="text-xl font-bold text-text">Popular Items</Text>
            <TouchableOpacity
              onPress={() => router.push("/(customer)/orders")}
              className="px-2 py-1"
            >
              <Text className="text-sm font-semibold text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-6 pl-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {POPULAR_ITEMS.map((item) => (
              <FoodGridCard
                key={item.id}
                item={item}
                className="mr-4 w-[190px]"
                onPress={() => handleOpenItem(item)}
              />
            ))}
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
            {filteredCategoryItems.map((item) => (
              <FoodGridCard
                key={item.id}
                item={item}
                className="mr-4 w-[190px]"
                onPress={() => handleOpenItem(item)}
              />
            ))}
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

      <ItemDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
}
