import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GridFoodItem } from "./FoodGridCard";

interface MenuQuickAddModalProps {
  visible: boolean;
  restaurant: {
    name: string;
    cuisine?: string;
    rating?: number;
    eta?: string;
  } | null;
  items: GridFoodItem[];
  onClose: () => void;
  onAddItem: (item: GridFoodItem, quantity: number) => void;
}

interface DishQuantity {
  [key: string]: number;
}

export default function MenuQuickAddModal({
  visible,
  restaurant,
  items,
  onClose,
  onAddItem,
}: MenuQuickAddModalProps) {
  const [quantities, setQuantities] = useState<DishQuantity>({});

  const handleIncrement = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleDecrement = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));
  };

  const handleAddToCart = (item: GridFoodItem) => {
    const qty = quantities[item.id] || 0;
    if (qty > 0) {
      onAddItem(item, qty);
      setQuantities((prev) => ({
        ...prev,
        [item.id]: 0,
      }));
    }
  };

  const handleClose = () => {
    setQuantities({});
    onClose();
  };

  if (!restaurant) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-text flex-1 text-center">
            {restaurant.name}
          </Text>
          <TouchableOpacity onPress={handleClose} className="w-6">
            <Ionicons name="close" size={24} color="#0D0D0D" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View className="px-6 py-3 bg-gray-50 flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-semibold text-text">
              {restaurant.name}
            </Text>
            {restaurant.cuisine && (
              <Text className="text-xs text-text-muted mt-1">
                {restaurant.cuisine}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-2">
            {restaurant.rating && (
              <View className="flex-row items-center gap-1 bg-white px-3 py-2 rounded-full">
                <Ionicons name="star" size={14} color="#FF863B" />
                <Text className="text-xs font-semibold text-text">
                  {restaurant.rating}
                </Text>
              </View>
            )}
            {restaurant.eta && (
              <View className="flex-row items-center gap-1 bg-white px-3 py-2 rounded-full">
                <Ionicons name="time-outline" size={14} color="#FF863B" />
                <Text className="text-xs text-text-muted">{restaurant.eta}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Dishes List */}
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          <Text className="text-base font-bold text-text mb-4">
            RECOMMENDED IN THIS MENU
          </Text>

          <View className="gap-4 pb-8">
            {items.map((item) => (
              <View
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-white overflow-hidden"
              >
                <View className="flex-row gap-3">
                  {/* Image */}
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-28 h-28 bg-gray-100"
                  />

                  {/* Content */}
                  <View className="flex-1 py-3 pr-3">
                    <Text
                      className="text-sm font-bold text-text mb-1"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-xs text-text-muted mb-2">
                      {item.description}
                    </Text>

                    {/* Price and Quantity */}
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-base font-bold text-primary">
                        ₹{item.price}
                      </Text>

                      {/* Quantity Control */}
                      <View className="flex-row items-center rounded-full border border-gray-200 bg-gray-50">
                        <TouchableOpacity
                          onPress={() => handleDecrement(item.id)}
                          className="px-2 py-1"
                        >
                          <Ionicons name="remove" size={16} color="#FF863B" />
                        </TouchableOpacity>
                        <Text className="px-3 text-sm font-semibold text-text min-w-[24px] text-center">
                          {quantities[item.id] || 0}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleIncrement(item.id)}
                          className="px-2 py-1"
                        >
                          <Ionicons name="add" size={16} color="#FF863B" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Add Button */}
                    {(quantities[item.id] || 0) > 0 && (
                      <TouchableOpacity
                        onPress={() => handleAddToCart(item)}
                        className="mt-2 rounded-full bg-primary px-4 py-2 items-center"
                      >
                        <Text className="text-xs font-bold text-white">
                          Add {quantities[item.id]}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
