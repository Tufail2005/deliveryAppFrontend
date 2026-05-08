import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "./PrimaryButton";

// Define the data structure for the form
export interface ItemFormData {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

interface ItemFormModalProps {
  visible: boolean;
  initialData: ItemFormData | null; // null means "Create mode", object means "Edit mode"
  onClose: () => void;
  onSave: (data: ItemFormData) => void;
}

const CATEGORIES = ["Burger", "Pizza", "Drinks", "Sandwich", "Dessert"];

export default function ItemFormModal({
  visible,
  initialData,
  onClose,
  onSave,
}: ItemFormModalProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    description: "",
    price: "",
    category: "Burger",
    imageUrl: "",
    isAvailable: true,
  });

  // Whenever the modal opens, populate the form with initialData (if editing)
  // or reset it to blank (if creating a new item).
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Burger",
        imageUrl: "",
        isAvailable: true,
      });
    }
  }, [initialData, visible]);

  const handleSave = () => {
    // Basic validation
    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in the Name, Price, and Category.");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/60"
      >
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />

        <View className="bg-white rounded-t-[32px] pt-4 pb-8 max-h-[90%] relative shadow-lg">
          {/* Floating Close Button */}
          <View className="absolute -top-14 self-center">
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="px-6 pb-4 border-b border-gray-100">
            <Text className="text-2xl font-bold text-text">
              {initialData ? "Edit Item" : "Create New Item"}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="px-6 pt-4"
          >
            {/* Image URL Input */}
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Image URL
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <TextInput
                  value={formData.imageUrl}
                  onChangeText={(t) =>
                    setFormData({ ...formData, imageUrl: t })
                  }
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor="#9CA3AF"
                  className="text-base text-text"
                />
              </View>
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Item Name *
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <TextInput
                  value={formData.name}
                  onChangeText={(t) => setFormData({ ...formData, name: t })}
                  placeholder="e.g. Cheese Beast Burger"
                  placeholderTextColor="#9CA3AF"
                  className="text-base text-text"
                />
              </View>
            </View>

            {/* Price Input */}
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Price ($) *
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <TextInput
                  value={formData.price}
                  onChangeText={(t) => setFormData({ ...formData, price: t })}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  className="text-base text-text"
                />
              </View>
            </View>

            {/* Category Selector */}
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Category *
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-full mr-2 border ${
                      formData.category === cat
                        ? "bg-black border-black"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.category === cat ? "text-white" : "text-text"
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Description
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 h-24">
                <TextInput
                  value={formData.description}
                  onChangeText={(t) =>
                    setFormData({ ...formData, description: t })
                  }
                  placeholder="Describe the ingredients and flavor..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  style={{ textAlignVertical: "top" }}
                  className="flex-1 text-base text-text"
                />
              </View>
            </View>

            {/* Availability Switch */}
            <View className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8">
              <View>
                <Text className="text-base font-bold text-text">
                  Currently Available
                </Text>
                <Text className="text-xs text-text-muted mt-1">
                  Customers can order this item
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#86efac" }}
                thumbColor={formData.isAvailable ? "#16a34a" : "#f3f4f6"}
                onValueChange={(val) =>
                  setFormData({ ...formData, isAvailable: val })
                }
                value={formData.isAvailable}
              />
            </View>
          </ScrollView>

          {/* Sticky Save Button */}
          <View className="px-6 pt-4 border-t border-gray-100">
            <PrimaryButton title="Save Item Details" onPress={handleSave} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
