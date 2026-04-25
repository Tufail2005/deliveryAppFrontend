import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../src/components/BackButton";
import PrimaryButton from "../../../src/components/PrimaryButton";

export default function ItemDetailScreen() {
  // Catch the parameters passed from the FoodItemCard
  const { name, price, description, imageUrl } = useLocalSearchParams<{
    name: string;
    price: string;
    description: string;
    imageUrl: string;
  }>();

  const [quantity, setQuantity] = useState(1);

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image */}
        <View className="relative w-full h-80 bg-gray-200">
          <Image source={{ uri: imageUrl }} className="w-full h-full" />
          {/* Overlay Back Button */}
          <SafeAreaView className="absolute top-0 left-4">
            <View className="mt-2">
              <BackButton />
            </View>
          </SafeAreaView>
        </View>

        {/* Item Details */}
        <View className="px-6 py-6 pb-32">
          <Text className="text-3xl font-bold text-text mb-2">{name}</Text>
          <Text className="text-2xl font-bold text-primary mb-4">₹{price}</Text>

          <View className="w-full h-[1px] bg-gray-100 mb-4" />

          <Text className="text-lg font-bold text-text mb-2">Description</Text>
          <Text className="text-base text-text-muted leading-6 mb-6">
            {description}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-6 border-t border-gray-100 shadow-[0_-10px_15px_rgba(0,0,0,0.05)] flex-row justify-between items-center">
        {/* Quantity Selector */}
        <View className="flex-row items-center border border-primary rounded-xl overflow-hidden h-14 w-32">
          <TouchableOpacity
            className="flex-1 items-center justify-center bg-white"
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={24} color="#FF863B" />
          </TouchableOpacity>

          <View className="w-10 items-center justify-center bg-primary-light/10 h-full">
            <Text className="text-lg font-bold text-primary">{quantity}</Text>
          </View>

          <TouchableOpacity
            className="flex-1 items-center justify-center bg-white"
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={24} color="#FF863B" />
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <View className="flex-1 ml-4">
          <PrimaryButton
            title={`Add item • ₹${Number(price) * quantity}`}
            onPress={() => console.log("Added to cart")}
          />
        </View>
      </View>
    </View>
  );
}
