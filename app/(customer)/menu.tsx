// import { CATEGORY_UI_CONFIG } from "@/src/constants/allCatagories";
// import { ItemCategory } from "@/src/types/catagories";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import type { ComponentProps } from "react";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import ActiveOrderBar from "../../src/components/ActiveOrderBar";
// import CategoryPill from "../../src/components/CategoryPill";
// import FloatingCartBanner from "../../src/components/FloatingCartBanner";
// import FoodGridCard, { GridFoodItem } from "../../src/components/FoodGridCard";
// import ItemDetailModal from "../../src/components/itemDetailModel";
// import RestaurantCard, {
//   Restaurant,
// } from "../../src/components/RestaurantCard";
// import { useCart } from "../../src/contexts/CartContext";

// type IonName = ComponentProps<typeof Ionicons>["name"];

// interface ApiItemsResponse {
//   items: GridFoodItem[];
// }

// interface ApiRestaurantsResponse {
//   restaurants: Restaurant[];
// }

// interface UserAddress {
//   id: string;
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   label: string | null | undefined;
//   isDefault: boolean;
// }

// const getCategoryUI = (cat: ItemCategory) => {
//   const config = CATEGORY_UI_CONFIG[cat];
//   return {
//     id: cat,
//     title: config.title,
//     image: "image" in config ? config.image : undefined,
//     icon: "icon" in config ? (config.icon as IonName) : undefined,
//   };
// };

// const MENU_CATEGORIES = [
//   { id: "all", title: "All", icon: "flame" as const, image: undefined },
//   ...Object.values(ItemCategory).map((cat) => getCategoryUI(cat)),
// ];

// const baseUrl = process.env.EXPO_PUBLIC_API_URL;

// export default function MenuScreen() {
//   const router = useRouter();
//   const params = useLocalSearchParams<{ selectedAddressLabel?: string }>();

//   const [activeCategory, setActiveCategory] = useState<string>("all");
//   const [search, setSearch] = useState("");
//   const [selectedItem, setSelectedItem] = useState<GridFoodItem | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const [items, setItems] = useState<GridFoodItem[]>([]);
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [restaurantLoading, setRestaurantLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [addresses, setAddresses] = useState<UserAddress[]>([]);
//   const [selectedAddressLabel, setSelectedAddressLabel] =
//     useState<string>("Loading...");
//   const [addressLoading, setAddressLoading] = useState(true);

//   useFocusEffect(
//     useCallback(() => {
//       const fetchActiveAddress = async () => {
//         try {
//           if (selectedAddressLabel === "Loading...") setAddressLoading(true);


//           const token = await SecureStore.getItemAsync("auth_token");
//           if (!token || !baseUrl) {
//             setSelectedAddressLabel("Select location");
//             return;
//           }

//           // 1. Hit the endpoint
//           const response = await axios.get<UserAddress>( // 👈 Now typed as a single object, not an array []
//             `${baseUrl}/user/addresses/default`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           const activeAddress = response.data;

//           // 2. Simply check if the object exists
//           if (activeAddress && activeAddress.id) {
//             setSelectedAddressLabel(
//               activeAddress.label || `${activeAddress.street}, ${activeAddress.city}`
//             );
//           } else {
//             setSelectedAddressLabel("Select location");
//           }
//         } catch (err) {
//           console.error("Failed to fetch default address:", err);
//           setSelectedAddressLabel("Select location");
//         } finally {
//           setAddressLoading(false);
//         }
//       };

//       fetchActiveAddress();
//     }, [])
//   );

//   useEffect(() => {
//     if (params.selectedAddressLabel) {
//       setSelectedAddressLabel(params.selectedAddressLabel);
//     }
//   }, [params.selectedAddressLabel]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         if (!baseUrl) {
//           throw new Error("API URL not configured");
//         }

//         const response = await axios.get<ApiItemsResponse>(
//           `${baseUrl}/customer/item`,
//           {
//             params: {
//               category:
//                 activeCategory === "all"
//                   ? undefined
//                   : activeCategory.toUpperCase(),
//             },
//           }
//         );

//         if (response.data?.items) {
//           setItems(response.data.items);
//         } else {
//           throw new Error("Invalid API response format");
//         }
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to fetch items";
//         console.error("Connection failed:", errorMessage);
//         setError(errorMessage);
//         setItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, [activeCategory, baseUrl]);

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       setRestaurantLoading(true);
//       try {
//         if (!baseUrl) return;
//         const response = await axios.get<ApiRestaurantsResponse>(
//           `${baseUrl}/customer/restaurants`
//         );
//         if (response.data?.restaurants) {
//           setRestaurants(response.data.restaurants);
//         }
//       } catch (err) {
//         console.error("Failed fetching live restaurant entries:", err);
//       } finally {
//         setRestaurantLoading(false);
//       }
//     };

//     fetchRestaurants();
//   }, [baseUrl]);

//   const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

//   const getItemQuantity = (itemId: string) => {
//     const cartItem = cartItems.find((i: any) => i.id === itemId);
//     return cartItem ? cartItem.quantity : 0;
//   };

//   const handleIncrease = (item: GridFoodItem) => {
//     const currentQty = getItemQuantity(item.id);
//     updateQuantity(item.id, currentQty + 1);
//   };

//   const handleDecrease = (item: GridFoodItem) => {
//     const currentQty = getItemQuantity(item.id);
//     if (currentQty <= 1) {
//       removeFromCart(item.id);
//     } else {
//       updateQuantity(item.id, currentQty - 1);
//     }
//   };

//   const getRestaurantName = (restId: string) => {
//     const found = restaurants.find((r) => r.id === restId);
//     return found ? found.name : "this kitchen";
//   };

//   const quickAdd = (item: GridFoodItem) => {
//     addToCart({
//       id: item.id,
//       name: item.name,
//       price: item.price,
//       quantity: 1,
//       imageUrl: item.imageUrl,
//       isVeg: true,
//       restaurantId: item.restaurantId,
//       restaurantName: getRestaurantName(item.restaurantId),
//     });
//   };

//   const handleOpenItem = (item: GridFoodItem) => {
//     setSelectedItem(item);
//     setModalVisible(true);
//   };

//   const handleAddToCart = (
//     item: GridFoodItem,
//     textNumber: number,
//     instructions: string
//   ) => {
//     addToCart({
//       id: item.id,
//       name: item.name,
//       price: item.price,
//       quantity: textNumber,
//       imageUrl: item.imageUrl,
//       isVeg: true,
//       restaurantId: item.restaurantId,
//       restaurantName: getRestaurantName(item.restaurantId),
//     });
//     setModalVisible(false);
//   };

//   const filteredRestaurants = useMemo(
//     () =>
//       restaurants.filter((restaurant) => {
//         const query = search.toLowerCase().trim();
//         return restaurant.name.toLowerCase().includes(query);
//       }),
//     [search, restaurants]
//   );

//   const isSearching = search.trim().length > 0;

//   return (
//     <SafeAreaView className="flex-1 bg-bg">
//       {restaurantLoading && restaurants.length === 0 ? (
//         <View className="pt-8 flex items-center justify-center">
//           <ActivityIndicator size="large" color="#FF863B" />
//         </View>
//       ) : (
//         <FlatList
//           key="restaurants-list"
//           data={filteredRestaurants}
//           keyExtractor={(item) => item.id}
          
//           // 🚀 FIXED HERE: Moved layout directly into the prop so it doesn't unmount on keystroke!
//           ListHeaderComponent={
//             <View className="px-6 pt-6">
//               <View className="flex-row items-center justify-between mb-6">
//                 <View>
//                   <Text className="text-xs uppercase tracking-[0.3em] text-primary font-bold">
//                     Deliver to
//                   </Text>
//                   <TouchableOpacity
//                     onPress={() =>
//                       router.push({
//                         pathname: "/(customer)/addresses",
//                         params: { selectable: "true" },
//                       })
//                     }
//                     className="mt-3 flex-row items-center gap-2"
//                   >
//                     <Text className="text-base font-bold text-text">
//                       {selectedAddressLabel || "Select location"}
//                     </Text>
//                     <Ionicons name="chevron-down" size={18} color="#0D0D0D" />
//                   </TouchableOpacity>
//                 </View>

//                 <TouchableOpacity
//                   onPress={() => router.push("/(customer)/profile")}
//                   className="h-13 w-13 rounded-full overflow-hidden shadow-sm border border-gray-100"
//                 >
//                   <Image
//                     source={require("../../assets/images/user.png")}
//                     className="w-full h-full bg-gray-200"
//                   />
//                 </TouchableOpacity>
//               </View>

//               <Text className="text-3xl font-bold text-text">Hey,</Text>
//               <Text className="text-3xl font-bold text-text">Good Afternoon!</Text>

//               <View className="mt-6 rounded-3xl bg-white px-4 py-4 shadow-sm border border-gray-100 flex-row items-center gap-3">
//                 <Ionicons name="search" size={20} color="#D1D5DB" />
//                 <TextInput
//                   value={search}
//                   onChangeText={setSearch}
//                   placeholder="Search restaurants by name..."
//                   className="flex-1 text-base text-text"
//                   placeholderTextColor="#9CA3AF"
//                 />
//                 {isSearching && (
//                   <TouchableOpacity onPress={() => setSearch("")}>
//                     <Ionicons name="close-circle" size={20} color="#9CA3AF" />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {!isSearching ? (
//                 <>
//                   <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     className="mt-6 -mx-6 pl-6"
//                     contentContainerStyle={{ paddingRight: 24 }}
//                   >
//                     {MENU_CATEGORIES.map((category) => (
//                       <CategoryPill
//                         key={category.id}
//                         title={category.title}
//                         imageSource={category.image}
//                         iconName={category.icon}
//                         isActive={activeCategory === category.id}
//                         onPress={() => setActiveCategory(category.id)}
//                       />
//                     ))}
//                   </ScrollView>

//                   {error && (
//                     <View className="bg-red-100 border border-red-300 rounded-lg p-3 mt-6 mb-2">
//                       <Text className="text-red-700 text-sm font-semibold">Error Loading Feed</Text>
//                       <Text className="text-red-600 text-xs mt-1">{error}</Text>
//                     </View>
//                   )}

//                   {activeCategory === "all" && (
//                     <View className="mt-8">
//                       <View className="flex-row items-center justify-between px-0 mb-4">
//                         <Text className="text-xl font-bold text-text">Discover Items</Text>
//                       </View>

//                       <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         className="-mx-6 pl-6"
//                         contentContainerStyle={{ paddingRight: 24 }}
//                       >
//                         {loading ? (
//                           <ActivityIndicator size="small" color="#FF863B" className="py-8 pl-6" />
//                         ) : items.length > 0 ? (
//                           items.map((item) => (
//                             <FoodGridCard
//                               key={item.id}
//                               item={item}
//                               className="mr-4 w-[190px]"
//                               onPress={() => handleOpenItem(item)}
//                               onAdd={quickAdd}
//                               cartQuantity={getItemQuantity(item.id)}
//                               onIncrease={handleIncrease}
//                               onDecrease={handleDecrease}
//                             />
//                           ))
//                         ) : (
//                           <View className="py-8 pl-6">
//                             <Text className="text-gray-400 font-semibold">
//                               No food options available to explore.
//                             </Text>
//                           </View>
//                         )}
//                       </ScrollView>
//                     </View>
//                   )}

//                   {activeCategory !== "all" && (
//                     <View className="mt-8">
//                       <View className="flex-row items-center justify-between px-0 mb-4">
//                         <Text className="text-xl font-bold text-text">
//                           {MENU_CATEGORIES.find((c) => c.id === activeCategory)?.title}
//                         </Text>
//                       </View>

//                       <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         className="-mx-6 pl-6"
//                         contentContainerStyle={{ paddingRight: 24 }}
//                       >
//                         {loading ? (
//                           <ActivityIndicator size="small" color="#FF863B" className="py-8 pl-6" />
//                         ) : items.length > 0 ? (
//                           items.map((item) => (
//                             <FoodGridCard
//                               key={item.id}
//                               item={item}
//                               className="mr-4 w-[190px]"
//                               onPress={() => handleOpenItem(item)}
//                               onAdd={quickAdd}
//                               cartQuantity={getItemQuantity(item.id)}
//                               onIncrease={handleIncrease}
//                               onDecrease={handleDecrease}
//                             />
//                           ))
//                         ) : (
//                           <View className="py-8 pl-6">
//                             <Text className="text-gray-400 font-semibold">
//                               No kitchen items prepared for this category today.
//                             </Text>
//                           </View>
//                         )}
//                       </ScrollView>
//                     </View>
//                   )}

//                   <View className="mt-8 mb-4">
//                     <Text className="text-xl font-bold text-text">Open Restaurants</Text>
//                   </View>
//                 </>
//               ) : (
//                 <View className="mt-6 mb-4">
//                   <Text className="text-xl font-bold text-text">
//                     Search Results ({filteredRestaurants.length})
//                   </Text>
//                 </View>
//               )}
//             </View>
//           }
//           renderItem={({ item }) => (
//             <View className="px-6">
//               <RestaurantCard
//                 restaurant={item}
//                 onPress={() =>
//                   router.push({
//                     pathname: "/(customer)/restaurant/[id]",
//                     params: {
//                       id: item.id,
//                       name: item.name,
//                       imageUrl: item.imageUrl,
//                       rating: item.rating.toString(),
//                       eta: item.eta,
//                       description: item.description ?? "",
//                     },
//                   })
//                 }
//               />
//             </View>
//           )}
//           ListEmptyComponent={
//             <View className="py-12 flex items-center justify-center">
//               <Text className="text-gray-400 font-semibold text-base">
//                 No matching restaurants found.
//               </Text>
//             </View>
//           }
//           contentContainerStyle={{ paddingBottom: 120 }}
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       <ItemDetailModal
//         visible={modalVisible}
//         item={selectedItem}
//         onClose={() => setModalVisible(false)}
//         onAddToCart={handleAddToCart}
//       />

//       <FloatingCartBanner />
//       <ActiveOrderBar />
//     </SafeAreaView>
//   );
// }

import { CATEGORY_UI_CONFIG } from "@/src/constants/allCatagories";
import { ItemCategory } from "@/src/types/catagories";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import type { ComponentProps } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import ActiveOrderBar from "../../src/components/ActiveOrderBar";
import CategoryPill from "../../src/components/CategoryPill";
import FloatingCartBanner from "../../src/components/FloatingCartBanner";
import FoodGridCard, { GridFoodItem } from "../../src/components/FoodGridCard";
import ItemDetailModal from "../../src/components/itemDetailModel";
import RestaurantCard, {
  Restaurant,
} from "../../src/components/RestaurantCard";
import ServiceNotAvailable from "../../src/components/ServiceNotAvailable"; // 🚀 IMPORTED SEPARATE COMPONENT
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
    icon: "icon" in config ? (config.icon as IonName) : undefined,
  };
};

const MENU_CATEGORIES = [
  { id: "all", title: "All", icon: "flame" as const, image: undefined },
  ...Object.values(ItemCategory).map((cat) => getCategoryUI(cat)),
];

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectedAddressLabel?: string }>();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<GridFoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [items, setItems] = useState<GridFoodItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedAddressLabel, setSelectedAddressLabel] =
    useState<string>("Loading...");
  const [addressLoading, setAddressLoading] = useState(true);
  
  // Track active user city explicitly to update queries
  const [currentCity, setCurrentCity] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const fetchActiveAddress = async () => {
        try {
          if (selectedAddressLabel === "Loading...") setAddressLoading(true);

          const token = await SecureStore.getItemAsync("auth_token");
          if (!token || !baseUrl) {
            setSelectedAddressLabel("Select location");
            return;
          }

          const response = await axios.get<UserAddress>(
            `${baseUrl}/user/addresses/default`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const activeAddress = response.data;

          if (activeAddress && activeAddress.id) {
            setSelectedAddressLabel(
              activeAddress.label || `${activeAddress.street}, ${activeAddress.city}`
            );
            setCurrentCity(activeAddress.city);
          } else {
            setSelectedAddressLabel("Select location");
            setCurrentCity("");
          }
        } catch (err) {
          console.error("Failed to fetch default address:", err);
          setSelectedAddressLabel("Select location");
          setCurrentCity("");
        } finally {
          setAddressLoading(false);
        }
      };

      fetchActiveAddress();
    }, [])
  );

  useEffect(() => {
    if (params.selectedAddressLabel) {
      setSelectedAddressLabel(params.selectedAddressLabel);
    }
  }, [params.selectedAddressLabel]);

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

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!baseUrl || !currentCity) return;
      
      setRestaurantLoading(true);
      try {
        const response = await axios.get<ApiRestaurantsResponse>(
          `${baseUrl}/customer/restaurants`,
          {
            params: { city: currentCity }
          }
        );
        if (response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        }
      } catch (err) {
        console.error("Failed fetching live restaurant entries:", err);
        setRestaurants([]);
      } finally {
        setRestaurantLoading(false);
      }
    };

    fetchRestaurants();
  }, [baseUrl, currentCity]);

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
    textNumber: number,
    instructions: string
  ) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: textNumber,
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
        const query = search.toLowerCase().trim();
        return restaurant.name.toLowerCase().includes(query);
      }),
    [search, restaurants]
  );

  const isSearching = search.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {restaurantLoading && restaurants.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <FlatList
          key="restaurants-list"
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="px-6 pt-6">
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-xs uppercase tracking-[0.3em] text-primary font-bold">
                    Deliver to
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(customer)/addresses",
                        params: { selectable: "true" },
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
                  className="h-13 w-13 rounded-full overflow-hidden shadow-sm border border-gray-100"
                >
                  <Image
                    source={require("../../assets/images/user.png")}
                    className="w-full h-full bg-gray-200"
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-3xl font-bold text-text">Hey,</Text>
              <Text className="text-3xl font-bold text-text">Good Afternoon!</Text>

              <View className="mt-6 rounded-3xl bg-white px-4 py-4 shadow-sm border border-gray-100 flex-row items-center gap-3">
                <Ionicons name="search" size={20} color="#D1D5DB" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search restaurants by name..."
                  className="flex-1 text-base text-text"
                  placeholderTextColor="#9CA3AF"
                />
                {isSearching && (
                  <TouchableOpacity onPress={() => setSearch("")}>
                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {restaurants.length > 0 && !isSearching && (
                <>
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

                  {error && (
                    <View className="bg-red-100 border border-red-300 rounded-lg p-3 mt-6 mb-2">
                      <Text className="text-red-700 text-sm font-semibold">Error Loading Feed</Text>
                      <Text className="text-red-600 text-xs mt-1">{error}</Text>
                    </View>
                  )}

                  {activeCategory === "all" && (
                    <View className="mt-8">
                      <View className="flex-row items-center justify-between px-0 mb-4">
                        <Text className="text-xl font-bold text-text">Discover Items</Text>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="-mx-6 pl-6"
                        contentContainerStyle={{ paddingRight: 24 }}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#FF863B" className="py-8 pl-6" />
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
                          <ActivityIndicator size="small" color="#FF863B" className="py-8 pl-6" />
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

                  <View className="mt-8 mb-4">
                    <Text className="text-xl font-bold text-text">Open Restaurants</Text>
                  </View>
                </>
              )}

              {isSearching && restaurants.length > 0 && (
                <View className="mt-6 mb-4">
                  <Text className="text-xl font-bold text-text">
                    Search Results ({filteredRestaurants.length})
                  </Text>
                </View>
              )}
            </View>
          }
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
          
          // 🚀 SEPARATED COMPONENT MOUNT POINT HANDLER
          ListEmptyComponent={
            isSearching ? (
              <View className="py-12 flex items-center justify-center">
                <Text className="text-gray-400 font-semibold text-base">
                  No matching restaurants found.
                </Text>
              </View>
            ) : (
              <ServiceNotAvailable currentCity={currentCity} />
            )
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
      <ActiveOrderBar />
    </SafeAreaView>
  );
}