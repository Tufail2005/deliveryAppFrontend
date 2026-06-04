import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BackButton from "../../src/components/BackButton";
import CartItemCard from "../../src/components/CartItemCard";
import PrimaryButton from "../../src/components/PrimaryButton";
import { useCart } from "../../src/contexts/CartContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity } = useCart();

  // State to hold the real backend calculations
  const [calculating, setCalculating] = useState(false);
  const [addressMissing, setAddressMissing] = useState(false);
  const [breakdown, setBreakdown] = useState({
    subTotal: 0,
    deliveryFee: 0,
    taxAmount: 0,
    totalAmount: 0,
  });

  // Calculate live prices whenever the screen opens or cartItems change
  useFocusEffect(
    useCallback(() => {
      const fetchLivePrices = async () => {
        if (cartItems.length === 0) return;

        setCalculating(true);
        setAddressMissing(false);

        try {
          const token = await SecureStore.getItemAsync("auth_token");

          // 1. Get the user's active address
          const addressRes = await axios.get(
            `${API_URL}/user/addresses/default`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const activeAddress = addressRes.data;

          if (!activeAddress || !activeAddress.id) {
            setAddressMissing(true);
            return;
          }

          // 2. Format items to match Zod Schema requirements
          const formattedItems = cartItems.map((item) => ({
            menuItemId: item.id,
            quantity: Number(item.quantity),
          }));

          const payload = {
            restaurantId: cartItems[0].restaurantId,
            addressId: activeAddress.id,
            items: formattedItems,
          };

          // 3. Ask backend for the real price breakdown
          const priceRes = await axios.post(
            `${API_URL}/order/calculate-price`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setBreakdown(priceRes.data.breakdown);
        } catch (error) {
          console.error("Failed to calculate live prices:", error);
        } finally {
          setCalculating(false);
        }
      };

      fetchLivePrices();
    }, [cartItems]) // Re-runs instantly if they add/remove item quantity
  );

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 px-6 items-center justify-center">
          <Text className="text-2xl font-bold text-text mb-2">
            Your cart is empty
          </Text>
          <Text className="text-center text-text-muted mb-6">
            Start adding items from restaurants to get started.
          </Text>
          <PrimaryButton
            title="Browse restaurants"
            onPress={() => router.push("/(customer)/menu")}
          />
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-3xl font-bold text-text">Your cart</Text>
            <Text className="mt-2 text-sm text-text-muted leading-6">
              Review your selected items before checkout.
            </Text>

            <View className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                />
              ))}
            </View>

            <View className="mt-6 rounded-[32px] bg-white p-6 shadow-sm border border-gray-100">
              <Text className="text-lg font-bold text-text mb-4">
                Order summary
              </Text>

              {addressMissing ? (
                <View className="py-4 items-center">
                  <Text className="text-sm text-red-500 font-medium text-center">
                    Please add a delivery address to calculate delivery fees and
                    taxes.
                  </Text>
                  <TouchableOpacity
                    className="mt-2"
                    onPress={() => router.push("/(customer)/addresses" as any)}
                  >
                    <Text className="text-primary font-bold">
                      Select Address
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : calculating ? (
                <View className="py-8 items-center justify-center">
                  <ActivityIndicator size="small" color="#FF863B" />
                  <Text className="text-text-muted text-xs mt-2">
                    Calculating final prices...
                  </Text>
                </View>
              ) : (
                <>
                  <View className="flex-row justify-between py-3">
                    <Text className="text-sm text-text-muted">Subtotal</Text>
                    <Text className="text-sm font-semibold text-text">
                      ₹{breakdown.subTotal}
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-3">
                    <Text className="text-sm text-text-muted">Delivery</Text>
                    <Text className="text-sm font-semibold text-text">
                      ₹{breakdown.deliveryFee}
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-3">
                    <Text className="text-sm text-text-muted">Tax (GST)</Text>
                    <Text className="text-sm font-semibold text-text">
                      ₹{breakdown.taxAmount}
                    </Text>
                  </View>
                  <View className="my-3 h-px bg-gray-100" />
                  <View className="flex-row justify-between">
                    <Text className="text-base font-bold text-text">Total</Text>
                    <Text className="text-base font-bold text-primary">
                      ₹{breakdown.totalAmount}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View className="border-t border-gray-100 bg-white px-6 pt-8 pb-14">
            <PrimaryButton
              title={calculating ? "Calculating..." : "Proceed to payment"}
              onPress={() => router.push("/(customer)/checkout")}
              disabled={cartItems.length === 0 || calculating || addressMissing}
            />
          </View>
        </>
      )}
    </View>
  );
}
