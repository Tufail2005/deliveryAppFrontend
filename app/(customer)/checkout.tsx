import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../src/components/BackButton";
import PrimaryButton from "../../src/components/PrimaryButton";
import { useCart } from "../../src/contexts/CartContext";

const PAYMENT_METHODS = [
  { id: "cash", title: "Cash" },
  { id: "visa", title: "Visa" },
  { id: "mastercard", title: "Mastercard" },
  { id: "paypal", title: "Paypal" },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { total } = useCart();
  const [method, setMethod] = useState("mastercard");
  const [hasCard, setHasCard] = useState(true);

  const handlePay = () => {
    router.push("/(customer)/success");
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6 flex-row items-center justify-between">
        <BackButton />
        <Text className="text-base font-bold text-primary">Payment</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="rounded-[32px] bg-white p-5 shadow-sm border border-gray-100">
          <Text className="text-base font-semibold text-text mb-4">Select payment method</Text>
          <View className="flex-row gap-3 flex-wrap">
            {PAYMENT_METHODS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  setMethod(option.id);
                  if (option.id !== "mastercard") setHasCard(false);
                }}
                className={`w-[45%] rounded-3xl px-4 py-4 border ${
                  method === option.id ? "border-primary bg-primary/10" : "border-gray-200 bg-gray-50"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons
                    name={
                      option.id === "cash"
                        ? "cash-outline"
                        : option.id === "visa"
                        ? "card-outline"
                        : option.id === "mastercard"
                        ? "card-outline"
                        : "logo-paypal"
                    }
                    size={20}
                    color={method === option.id ? "#FF863B" : "#6B7280"}
                  />
                  <Text className={`text-sm font-semibold ${method === option.id ? "text-primary" : "text-text"}`}>
                    {option.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm border border-gray-100">
          {hasCard ? (
            <View>
              <Text className="text-base font-semibold text-text mb-4">Master Card</Text>
              <View className="rounded-[28px] bg-primary/10 p-5 shadow-sm border border-primary/20">
                <Text className="text-sm text-text-muted mb-3">**** **** **** 436</Text>
                <Text className="text-lg font-bold text-text mb-2">Mastercard</Text>
                <Text className="text-sm text-text-muted">Valid thru 08/28</Text>
              </View>
              <TouchableOpacity
                onPress={() => setHasCard(false)}
                className="mt-4 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 items-center"
              >
                <Text className="text-sm font-semibold text-primary">+ Add new</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className="rounded-[28px] bg-gray-100 p-6 items-center justify-center">
                <Text className="text-2xl">💳</Text>
                <Text className="mt-3 text-sm text-text-muted text-center">
                  No master card added. You can add a mastercard and save it for later.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setHasCard(true)}
                className="mt-4 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 items-center"
              >
                <Text className="text-sm font-semibold text-primary">+ Add new</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="border-t border-gray-100 bg-white px-6 py-5">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-sm text-text-muted">Total</Text>
          <Text className="text-2xl font-bold text-text">₹{total}</Text>
        </View>
        <PrimaryButton title="Pay & confirm" onPress={handlePay} />
      </View>
    </View>
  );
}
