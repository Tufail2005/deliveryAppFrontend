import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// IMPORT THE NEW MODAL HERE
import ItemFormModal, {
  ItemFormData,
} from "../../src/components/ItemFormModal";

const CATEGORIES = ["Burger", "Pizza", "Drinks"];

// Mock Menu Items
const INITIAL_MENU = [
  {
    id: "1",
    name: "Cheese Beast",
    category: "Burger",
    price: 38,
    isAvailable: true,
    description: "A cheesy delight.",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
  },
  {
    id: "2",
    name: "Spicy Chicken",
    category: "Burger",
    price: 35,
    isAvailable: false,
    description: "Very spicy.",
    imageUrl:
      "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=500&q=80",
  },
  {
    id: "3",
    name: "Margherita",
    category: "Pizza",
    price: 24,
    isAvailable: true,
    description: "Classic.",
    imageUrl:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&q=80",
  },
];

export default function MenuEditorScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState("Burger");
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);

  // --- MODAL STATE ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormData | null>(null);

  const filteredItems = menuItems.filter((item) => item.category === activeCat);

  // Toggle Stock
  const toggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Delete Item
  const deleteItem = (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to remove this item from your menu?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setMenuItems((prev) => prev.filter((i) => i.id !== id)),
        },
      ]
    );
  };

  // --- HANDLE MODAL ACTIONS ---
  const handleOpenCreate = () => {
    setEditingItem(null); // Passing null opens it in "Create" mode
    setModalVisible(true);
  };

  const handleOpenEdit = (item: any) => {
    // Convert numbers to strings for the TextInput
    setEditingItem({ ...item, price: item.price.toString() });
    setModalVisible(true);
  };

  const handleSaveItem = (data: ItemFormData) => {
    if (data.id) {
      // EDIT: Update existing item
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? { ...data, id: data.id as string, price: Number(data.price) }
            : item
        )
      );
    } else {
      // CREATE: Generate a fake ID and add to list
      const newItem = {
        ...data,
        id: Date.now().toString(),
        price: Number(data.price),
      };
      setMenuItems((prev) => [...prev, newItem]);
    }
    setModalVisible(false); // Close modal on success
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

        {/* ADD BUTTON TRIGGERS MODAL */}
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
      <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
        {filteredItems.map((item) => (
          <View
            key={item.id}
            className={`bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4 flex-row ${
              !item.isAvailable && "opacity-60"
            }`}
          >
            <Image
              source={{ uri: item.imageUrl }}
              className="w-20 h-20 rounded-2xl bg-gray-100 mr-4"
            />

            <View className="flex-1 justify-between py-1">
              <View>
                <Text
                  className="text-base font-bold text-text"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-lg font-bold text-primary mt-1">
                  ${item.price}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center gap-2">
                  <Switch
                    trackColor={{ false: "#E5E7EB", true: "#86efac" }}
                    thumbColor={item.isAvailable ? "#16a34a" : "#f3f4f6"}
                    onValueChange={() => toggleAvailability(item.id)}
                    value={item.isAvailable}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                  <Text className="text-xs font-semibold text-text-muted">
                    {item.isAvailable ? "In Stock" : "Out of Stock"}
                  </Text>
                </View>

                <View className="flex-row gap-4">
                  {/* PENCIL BUTTON TRIGGERS EDIT */}
                  <TouchableOpacity
                    onPress={() => handleOpenEdit(item)}
                    className="p-2 -m-2"
                  >
                    <Ionicons name="pencil" size={20} color="#3b82f6" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <Ionicons name="trash" size={20} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* RENDER THE MODAL AT THE BOTTOM OF THE FILE */}
      <ItemFormModal
        visible={isModalVisible}
        initialData={editingItem}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
      />
    </SafeAreaView>
  );
}
