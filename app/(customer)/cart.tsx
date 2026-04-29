import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import BackButton from "../../src/components/BackButton";
import CartItemCard from "../../src/components/CartItemCard";
import PrimaryButton from "../../src/components/PrimaryButton";
import { useCart } from "../../src/contexts/CartContext";

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity } = useCart();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const deliveryFee = 49;
  const total = subtotal + (cartItems.length > 0 ? deliveryFee : 0);

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 px-6 items-center justify-center">
          <Text className="text-2xl font-bold text-text mb-2">Your cart is empty</Text>
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
              <Text className="text-lg font-bold text-text mb-4">Order summary</Text>
              <View className="flex-row justify-between py-3">
                <Text className="text-sm text-text-muted">Subtotal</Text>
                <Text className="text-sm font-semibold text-text">₹{subtotal}</Text>
              </View>
              <View className="flex-row justify-between py-3">
                <Text className="text-sm text-text-muted">Delivery</Text>
                <Text className="text-sm font-semibold text-text">₹{deliveryFee}</Text>
              </View>
              <View className="my-3 h-px bg-gray-100" />
              <View className="flex-row justify-between">
                <Text className="text-base font-bold text-text">Total</Text>
                <Text className="text-base font-bold text-primary">₹{total}</Text>
              </View>
            </View>
          </ScrollView>

          <View className="border-t border-gray-100 bg-white px-6 py-5">
            <PrimaryButton
              title="Proceed to payment"
              onPress={() => router.push("/(customer)/checkout")}
              disabled={cartItems.length === 0}
            />
          </View>
        </>
      )}
    </View>
  );
}
