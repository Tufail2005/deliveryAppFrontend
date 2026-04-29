import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../src/components/BackButton";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";
import { useCart } from "../../src/contexts/CartContext";

const PAYMENT_METHODS = [
  { id: "card", title: "Credit / Debit Card" },
  { id: "upi", title: "UPI" },
  { id: "wallet", title: "Wallet" },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, total } = useCart();
  const [method, setMethod] = useState("card");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handleConfirmPayment = () => {
    router.push({
      pathname: "/(customer)/orders",
      params: { orderPlaced: "true" },
    });
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-text">Checkout</Text>
        <Text className="mt-2 text-sm text-text-muted leading-6">
          Finalize your order and choose a secure payment method.
        </Text>

        {/* Order Items Summary */}
        <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm border border-gray-100">
          <Text className="text-base font-bold text-text mb-4">Order summary</Text>
          <View className="space-y-3">
            {cartItems.map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center pb-3 border-b border-gray-100"
              >
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-text">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-text-muted mt-1">
                    Qty: {item.quantity}
                  </Text>
                </View>
                <Text className="text-sm font-bold text-text">
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}
            <View className="pt-3 flex-row justify-between">
              <Text className="text-sm text-text-muted">Subtotal</Text>
              <Text className="text-sm font-semibold text-text">₹{subtotal}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted">Delivery</Text>
              <Text className="text-sm font-semibold text-text">₹49</Text>
            </View>
            <View className="my-2 h-px bg-gray-100" />
            <View className="flex-row justify-between">
              <Text className="text-base font-bold text-text">Total</Text>
              <Text className="text-base font-bold text-primary">₹{total}</Text>
            </View>
          </View>
        </View>

        <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm border border-gray-100">
          <Text className="text-base font-bold text-text mb-4">Payment method</Text>
          <View className="flex-row gap-3">
            {PAYMENT_METHODS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setMethod(option.id)}
                className={`flex-1 rounded-3xl border px-4 py-4 ${
                  method === option.id
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    method === option.id ? "text-primary" : "text-text"
                  }`}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {method === "card" && (
          <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-text mb-4">Card details</Text>
            <FormInput label="Cardholder name" value={name} onChangeText={setName} />
            <FormInput
              label="Card number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
            />
            <View className="flex-row gap-4">
              <View className="flex-1">
                <FormInput
                  label="Expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        )}

        <View className="mt-6 rounded-[32px] bg-primary-light/10 px-5 py-5">
          <Text className="text-sm text-primary font-semibold">Safe payment</Text>
          <Text className="text-sm text-text-muted mt-2 leading-6">
            Your payment is secured with encrypted checkout and trusted processing.
          </Text>
        </View>
      </ScrollView>

      <View className="border-t border-gray-100 bg-white px-6 py-5">
        <PrimaryButton
          title={`Confirm order - ₹${total}`}
          onPress={handleConfirmPayment}
          disabled={method === "card" && (!name || !cardNumber || !expiry || !cvv)}
        />
      </View>
    </View>
  );
}
