import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GridFoodItem } from "./FoodGridCard";
import PrimaryButton from "./PrimaryButton";

interface ItemDetailModalProps {
  visible: boolean;
  item: GridFoodItem | null;
  onClose: () => void;
  onAddToCart: (
    item: GridFoodItem,
    quantity: number,
    instructions: string
  ) => void;
}

const COOKING_TAGS = ["Less Spicy", "Non spicy", "Mild spicy", "Extra Masala"];

export default function ItemDetailModal({
  visible,
  item,
  onClose,
  onAddToCart,
}: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity, instructions);
    // Reset state for next time
    setQuantity(1);
    setInstructions("");
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
        {/* Clickable background to close modal */}
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Modal Container */}
        <View className="bg-white rounded-t-4xl pt-4 pb-8 max-h-[85%] relative shadow-lg">
          {/* Floating Close Button */}
          <View className="absolute -top-14 self-center">
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Image Section */}
            <View className="px-4 mb-4">
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-56 rounded-3xl bg-gray-100"
                resizeMode="cover"
              />
            </View>

            {/* Title Section */}
            <View className="px-6 mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="w-4 h-4 border border-accent-green items-center justify-center">
                  <View className="w-2 h-2 rounded-full bg-accent-green" />
                </View>
                <Text className="text-xl font-bold text-text">{item.name}</Text>
              </View>
              <Text className="text-sm font-semibold text-accent-green">
                Highly reordered
              </Text>
              <Text className="text-sm text-text-muted mt-3 leading-5">
                {item.description}
              </Text>
            </View>

            <View className="w-full h-1px bg-gray-100 mb-6" />

            {/* Cooking Request Section */}
            <View className="px-6 mb-6">
              <Text className="text-base font-bold text-text mb-3">
                Add a cooking request (optional)
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 h-24 mb-4">
                <TextInput
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder="e.g. Don't make it too spicy"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  className="flex-1 text-sm text-text text-top"
                  style={{ textAlignVertical: "top" }}
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row overflow-visible"
              >
                {COOKING_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() =>
                      setInstructions((prev) =>
                        prev ? `${prev}, ${tag}` : tag
                      )
                    }
                    className="border border-gray-200 rounded-full px-4 py-2 mr-3 bg-white"
                  >
                    <Text className="text-sm text-text-muted">{tag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Sticky Bottom Footer */}
          <View className="flex-row items-center justify-between px-6 pt-4 bg-white border-t border-gray-100">
            {/* Quantity Selector */}
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-2 py-3 w-32">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex-1 items-center justify-center"
              >
                <Ionicons name="remove" size={20} color="#FF863B" />
              </TouchableOpacity>
              <Text className="px-2 text-lg font-bold text-text">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="flex-1 items-center justify-center"
              >
                <Ionicons name="add" size={20} color="#FF863B" />
              </TouchableOpacity>
            </View>

            {/* Add Button */}
            <View className="flex-1 ml-4">
              <PrimaryButton
                title={`Add item $${(item.price * quantity).toFixed(2)}`}
                onPress={handleAdd}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
