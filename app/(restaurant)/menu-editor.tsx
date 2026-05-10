import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// IMPORT THE MODAL
import ItemFormModal, {
  ItemFormData,
} from "../../src/components/ItemFormModal";

// Title case for UI Display
const CATEGORIES = [
  "All",
  "Burger",
  "Pizza",
  "Beverages",
  "Sandwich",
  "Desserts",
];

export default function MenuEditorScreen() {
  const router = useRouter();
  // 1. Get the dynamic restaurantId from the URL params!
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [menuItems, setMenuItems] = useState<any[]>([]); // Start empty

  // --- MODAL STATE ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormData | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // --- FETCH ITEMS (GET) ---
  const fetchMenu = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const response = await axios.get(
        `${API_URL}/restaurant/${restaurantId}/items`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMenuItems(response.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch menu:", error);
      Alert.alert("Error", "Could not load menu items from server.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when screen loads
  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  // Filter items. We lowercase both sides to safely match "BURGER" from DB to "Burger" in UI
  const filteredItems =
    activeCat === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category?.toLowerCase() === activeCat.toLowerCase()
        );

  // --- TOGGLE STOCK (PATCH) ---
  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // 1. Optimistic UI update (feels instant to user)
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: newStatus } : item
      )
    );

    try {
      // 2. Background API call
      const token = await SecureStore.getItemAsync("auth_token");
      await axios.patch(
        `${API_URL}/restaurant/item/${id}`,
        { isAvailable: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      // Revert if it fails
      Alert.alert("Error", "Could not update availability.");
      fetchMenu();
    }
  };

  // --- DELETE ITEM (DELETE) ---
  const deleteItem = (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to remove this item from your menu?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync("auth_token");
              await axios.delete(`${API_URL}/restaurant/delete-item/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              // Refresh the list after deleting
              fetchMenu();
            } catch (error) {
              Alert.alert("Error", "Failed to delete item.");
            }
          },
        },
      ]
    );
  };

  // --- OPEN MODAL FOR NEW ITEM ---
  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  // --- OPEN MODAL FOR EDITING ---
  const handleOpenEdit = (item: any) => {
    const safeCategory = item.category
      ? item.category.charAt(0).toUpperCase() +
        item.category.slice(1).toLowerCase()
      : "Burger";
    setEditingItem({
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      // Format category for the UI Modal (e.g. "BURGER" -> "Burger")
      category: safeCategory,
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable,
    });
    setModalVisible(true);
  };

  // --- SAVE FORM (POST / PATCH) ---
  const handleSaveItem = async (data: ItemFormData) => {
    const token = await SecureStore.getItemAsync("auth_token");

    // Most backends using Prisma Enums expect ALL_CAPS
    const formattedCategory = data.category.toUpperCase();

    try {
      if (data.id) {
        // --- EDIT EXISTING ITEM ---
        await axios.patch(
          `${API_URL}/restaurant/item/${data.id}`,
          {
            name: data.name,
            price: Number(data.price),
            description: data.description,
            imageUrl: data.imageUrl,
            isAvailable: data.isAvailable,
            category: formattedCategory,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // --- CREATE NEW ITEM ---
        await axios.post(
          `${API_URL}/restaurant/add-item`,
          {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            imageUrl: data.imageUrl,
            category: formattedCategory, // Pass upper case
            restaurantId: restaurantId, // Use the dynamic ID from the URL!
            isAvailable: data.isAvailable,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh list to show new data and close modal
      fetchMenu();
      setModalVisible(false);
    } catch (error: any) {
      console.error(error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Could not save item"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#0D0D0D" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-text">Menu Editor</Text>
        </View>

        <TouchableOpacity
          onPress={handleOpenCreate}
          className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={24} color="#FF863B" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View className="bg-white pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 pt-4"
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCat(cat)}
              className={`px-5 py-2 rounded-full mr-3 border ${
                activeCat === cat
                  ? "bg-black border-black"
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
      </View>

      {/* Menu Items List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
          {filteredItems.length === 0 ? (
            <View className="items-center mt-10">
              <Text className="text-text-muted">
                No items found in {activeCat}.
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <View
                key={item.id}
                className={`bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4 flex-row ${
                  !item.isAvailable && "opacity-60"
                }`}
              >
                {/* Safe image rendering (fallback if no url) */}
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-20 h-20 rounded-2xl bg-gray-100 mr-4"
                  />
                ) : (
                  <View className="w-20 h-20 rounded-2xl bg-gray-100 mr-4 items-center justify-center">
                    <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                  </View>
                )}

                <View className="flex-1 justify-between py-1">
                  <View>
                    <Text
                      className="text-base font-bold text-text"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-lg font-bold text-primary mt-1">
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center gap-2">
                      <Switch
                        trackColor={{ false: "#E5E7EB", true: "#86efac" }}
                        thumbColor={item.isAvailable ? "#16a34a" : "#f3f4f6"}
                        onValueChange={() =>
                          toggleAvailability(item.id, item.isAvailable)
                        }
                        value={item.isAvailable}
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                      />
                      <Text className="text-xs font-semibold text-text-muted">
                        {item.isAvailable ? "In Stock" : "Out of Stock"}
                      </Text>
                    </View>

                    <View className="flex-row gap-4">
                      <TouchableOpacity
                        onPress={() => handleOpenEdit(item)}
                        className="p-2 -m-2"
                      >
                        <Ionicons name="pencil" size={20} color="#3b82f6" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => deleteItem(item.id)}
                        className="p-2 -m-2"
                      >
                        <Ionicons name="trash" size={20} color="#dc2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
          <View className="h-10" />
        </ScrollView>
      )}

      {/* MODAL */}
      <ItemFormModal
        visible={isModalVisible}
        initialData={editingItem}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
      />
    </SafeAreaView>
  );
}
