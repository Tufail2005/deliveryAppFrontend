import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BackButton from "../../../src/components/BackButton";
import PrimaryButton from "../../../src/components/PrimaryButton";
import { useCart } from "../../../src/contexts/CartContext";

export default function ItemDetailScreen() {
  const { name, price, description, imageUrl, id } = useLocalSearchParams<{
    id: string;
    name: string;
    price: string;
    description: string;
    imageUrl: string;
  }>();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!id || !name || !price || !imageUrl) return;
    
    addToCart({
      id,
      name,
      price: Number(price),
      quantity,
      imageUrl,
      isVeg: true,
    });
    
    router.push("/(customer)/cart");
  };

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="relative h-88 bg-gray-100">
          <Image source={{ uri: imageUrl }} className="w-full h-full" />
          <View className="absolute top-0 left-0 right-0 p-4">
            <BackButton />
          </View>
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-8">
            <Text className="text-3xl font-extrabold text-white">{name}</Text>
            <Text className="text-sm text-gray-200 mt-2">
              Freshly prepared and carefully packed for a perfect delivery.
            </Text>
          </View>
        </View>

        <View className="px-6 py-6 space-y-6">
          <View className="rounded-[28px] bg-white p-5 shadow-sm border border-gray-100">
            <Text className="text-2xl font-bold text-text mb-3">₹{price}</Text>
            <View className="flex-row items-center justify-between mb-4">
              <View className="rounded-full border border-accent-green/20 bg-accent-green/10 px-3 py-1">
                <Text className="text-sm font-semibold text-accent-green">Veg</Text>
              </View>
              <View className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
                <Text className="text-sm font-semibold text-primary">Best seller</Text>
              </View>
            </View>
            <Text className="text-sm leading-6 text-text-muted">{description}</Text>
          </View>

          <View className="rounded-[28px] bg-white p-5 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-text mb-4">Details</Text>
            <View className="space-y-4">
              {[
                { label: "Delivery time", value: "25-30 min" },
                { label: "Calories", value: "420 kcal" },
                { label: "Spice level", value: "Medium" },
              ].map((info) => (
                <View key={info.label} className="flex-row justify-between">
                  <Text className="text-sm text-text-muted">{info.label}</Text>
                  <Text className="text-sm font-semibold text-text">{info.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-5 shadow-[0_-10px_20px_rgba(0,0,0,0.06)]">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center rounded-3xl border border-gray-200 bg-gray-50 px-3 py-2">
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3"
            >
              <Ionicons name="remove" size={20} color="#FF863B" />
            </TouchableOpacity>
            <Text className="px-4 text-base font-bold text-text">{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              className="px-3"
            >
              <Ionicons name="add" size={20} color="#FF863B" />
            </TouchableOpacity>
          </View>
          <Text className="text-base font-bold text-text">Total ₹{Number(price) * quantity}</Text>
        </View>

        <PrimaryButton
          title="Add to cart"
          onPress={handleAddToCart}
        />
      </View>
    </View>
  );
}
