import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../../src/components/BackButton";
import PrimaryButton from "../../../src/components/PrimaryButton";
import { useCart } from "../../../src/contexts/CartContext";
import {
  getRestaurantCoverUri,
  RESTAURANT_COVER_BY_ID,
} from "../../../src/constants/restaurantCovers";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80";

export default function RestaurantScreen() {
  const router = useRouter();
  const { id, name, imageUrl, cuisine, rating, eta, costForTwo } = useLocalSearchParams<{
    id: string;
    name: string;
    imageUrl: string;
    cuisine: string;
    rating: string;
    eta: string;
    costForTwo: string;
  }>();

  const [selectedSize, setSelectedSize] = useState("14\"");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const price = 32;

  const bundledCover = id ? RESTAURANT_COVER_BY_ID[id as string] : undefined;
  const cartThumbUri =
    (id ? getRestaurantCoverUri(id as string) : undefined) ??
    imageUrl ??
    FALLBACK_IMAGE;

  const handleAddToCart = () => {
    if (!id || !name) return;
    addToCart({
      id,
      name,
      price,
      quantity,
      imageUrl: cartThumbUri,
      isVeg: true,
    });
    router.push("/(customer)/cart");
  };

  return (
    <View className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative h-96 bg-gray-100">
          <Image
            source={
              bundledCover ?? {
                uri: imageUrl || FALLBACK_IMAGE,
              }
            }
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute top-0 left-0 right-0 px-4 py-4 flex-row justify-between">
            <BackButton />
            <TouchableOpacity className="h-12 w-12 rounded-full bg-white items-center justify-center shadow-sm">
              <Ionicons name="heart-outline" size={22} color="#FF863B" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 py-6 space-y-6">
          <View>
            <Text className="text-3xl font-bold text-text">{name || "Burger Bistro"}</Text>
            <Text className="text-sm text-text-muted mt-2">{cuisine || "Rose Garden"}</Text>

            <View className="mt-5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="star" size={18} color="#FF863B" />
                <Text className="text-sm font-bold text-text">{rating || "4.7"}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="car" size={18} color="#4B5563" />
                <Text className="text-sm text-text-muted">Free</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time" size={18} color="#4B5563" />
                <Text className="text-sm text-text-muted">{eta || "20 min"}</Text>
              </View>
            </View>

            <Text className="mt-5 text-sm text-text-muted leading-6">
              Maecenas sed diam eget risus varius blandit sit amet magna. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
            </Text>
          </View>

          <View className="rounded-[32px] bg-white p-5 shadow-sm border border-gray-100">
            <Text className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Size</Text>
            <View className="flex-row justify-between">
              {['10\"', '14\"', '16\"'].map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`flex-1 mx-1 rounded-3xl px-4 py-3 items-center justify-center ${
                    selectedSize === size ? "bg-primary text-white" : "bg-gray-100"
                  }`}
                >
                  <Text className={`${selectedSize === size ? "text-white" : "text-text"} font-semibold`}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Ingredients</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
              {['nutrition-outline', 'egg-outline', 'leaf-outline', 'flame-outline'].map((icon) => (
                <View key={icon} className="h-20 w-20 rounded-3xl bg-gray-100 items-center justify-center">
                  <Ionicons name={icon as any} size={24} color="#FF863B" />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-5">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-xs uppercase tracking-[0.2em] text-text-muted">Price</Text>
            <Text className="text-2xl font-bold text-text">${price}</Text>
          </View>
          <View className="flex-row items-center rounded-full bg-black px-4 py-3">
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Ionicons name="remove" size={22} color="#fff" />
            </TouchableOpacity>
            <Text className="px-4 text-lg font-bold text-white">{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <PrimaryButton title="Add to cart" onPress={handleAddToCart} />
      </View>
    </View>
  );
}
