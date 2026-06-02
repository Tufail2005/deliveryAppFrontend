import { useRazorpay } from "@codearcade/expo-razorpay";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import BackButton from "../../src/components/BackButton";
import PrimaryButton from "../../src/components/PrimaryButton";
import { useCart } from "../../src/contexts/CartContext";

const PAYMENT_METHODS = [
  { id: "upi", title: "UPI (GPay/PhonePe)", icon: "flash-outline" as const },
  { id: "card", title: "Credit/Debit Card", icon: "card-outline" as const },
  { id: "cash", title: "Cash on Delivery", icon: "cash-outline" as const },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, total, clearCart } = useCart();
  const { openCheckout, RazorpayUI } = useRazorpay();

  const [method, setMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Dynamic Address State ---
  const [addressId, setAddressId] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const token = await SecureStore.getItemAsync("auth_token");

        // Hits the new streamlined single-object endpoint
        const response = await axios.get(`${API_URL}/user/addresses/default`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const activeAddress = response.data;

        // Bypasses the array map completely
        if (activeAddress && activeAddress.id) {
          setAddressId(activeAddress.id);
        }
      } catch (error) {
        console.error("Could not fetch active address:", error);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchSavedAddress();
  }, []);

  const handlePayAndConfirm = async () => {
    // 1. Safety Checks
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add items to your cart before checking out."
      );
      return;
    }

    if (!addressId) {
      Alert.alert(
        "Missing Address",
        "Please add a delivery address before placing an order."
      );
      return;
    }

    if (method === "cash") {
      Alert.alert("COD Selected", "Process order with Cash on Delivery?");
      return;
    }

    setIsProcessing(true);

    try {
      const token = await SecureStore.getItemAsync("auth_token");

      // Wrapping quantity in Number() ensures Zod's validation rules clear smoothly
      const formattedItems = cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: Number(item.quantity),
      }));

      // Construct valid payload object definitions
      const orderPayload = {
        restaurantId: cartItems[0].restaurantId,
        addressId: addressId,
        items: formattedItems,
      };

      // Hit your place-order backend track controller
      const orderResponse = await axios.post(
        `${API_URL}/order/place-order`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order, paymentDetails } = orderResponse.data;

      // Configure Razorpay parameters
      const checkoutOptions: any = {
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID!,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        order_id: paymentDetails.razorpayOrderId,
        name: "Asu bhai Delivery",
        description: `Order Payment`,
        theme: { color: "#FF863B" },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
      };

      if (method === "upi") {
        checkoutOptions.method = "upi";
      }

      // Fire up the native integration handler
      openCheckout(checkoutOptions, {
        onSuccess: async (data) => {
          try {
            const verificationResponse = await axios.post(
              `${API_URL}/order/verify-payment`,
              {
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_signature: data.razorpay_signature,
                database_order_id: order.id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verificationResponse.data.success) {
              // 🚀 FIXED: Dynamic, multi-account isolation tracking sequence logic
              // Binds the active order string directly to the active customer row ID row parameters!
              if (order?.userId) {
                await SecureStore.setItemAsync(
                  `active_order_id_${order.userId}`,
                  order.id
                );
              } else {
                // Fallback option in case userId isn't exposed directly on the root order object layout
                await SecureStore.setItemAsync("active_order_id", order.id);
              }

              clearCart();
              router.replace("/(customer)/success");
            }
          } catch (verifyErr: any) {
            console.error(
              "Verification Error:",
              verifyErr?.response?.data || verifyErr
            );
            Alert.alert(
              "Payment Error",
              "Security signature validation failed."
            );
          } finally {
            setIsProcessing(false);
          }
        },
        onFailure: (error: any) => {
          setIsProcessing(false);
          const errorMessage =
            error?.description ||
            error?.message ||
            "User closed payment window.";
          Alert.alert("Transaction Aborted", errorMessage);
        },
      });
    } catch (err: any) {
      if (err.response && err.response.data) {
        console.error(
          "BACKEND REJECTION DETAILS:",
          JSON.stringify(err.response.data, null, 2)
        );

        let errorMsg =
          err.response.data.message || "Invalid data sent to server";
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          errorMsg = err.response.data.errors[0].message;
        }

        Alert.alert("Validation Error", errorMsg);
      } else {
        console.error("Payment initialization failure:", err);
        Alert.alert("Checkout Error", "Failed to create your order session.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6 flex-row items-center justify-between">
        <BackButton />
        <Text className="text-base font-bold text-primary">
          Payment Methods
        </Text>
        <View className="w-12" />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="rounded-[32px] bg-white p-5 shadow-sm border border-gray-100">
          <Text className="text-base font-semibold text-text mb-4">
            Select payment method
          </Text>
          <View className="flex-col gap-3">
            {PAYMENT_METHODS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setMethod(option.id)}
                className={`w-full rounded-2xl px-5 py-4 border flex-row items-center justify-between ${
                  method === option.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <View className="flex-row items-center gap-4">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      method === option.id ? "bg-primary/20" : "bg-gray-200"
                    }`}
                  >
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={method === option.id ? "#FF863B" : "#4B5563"}
                    />
                  </View>
                  <Text
                    className={`text-base font-bold ${
                      method === option.id ? "text-primary" : "text-text"
                    }`}
                  >
                    {option.title}
                  </Text>
                </View>

                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${
                    method === option.id ? "border-primary" : "border-gray-400"
                  }`}
                >
                  {method === option.id && (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm border border-gray-100 items-center justify-center p-6">
          <Ionicons
            name={
              method === "upi"
                ? "logo-android"
                : method === "card"
                ? "card"
                : "cash"
            }
            size={36}
            color="#9CA3AF"
          />
          <Text className="mt-3 text-sm text-text-muted text-center leading-5">
            {method === "upi"
              ? "Clicking Pay will launch an instant drawer showing installed UPI utility apps on this phone."
              : method === "card"
              ? "Pay securely using credit card networks, debit accounts, or saved international token systems."
              : "Pay directly using hard currency notes when your delivery agent drops off the carrier items."}
          </Text>
        </View>

        {!addressId && !loadingAddress && (
          <View className="mt-6 bg-red-50 border border-red-200 p-4 rounded-2xl flex-row items-center gap-3">
            <Ionicons name="warning-outline" size={20} color="#EF4444" />
            <Text className="text-red-600 font-medium flex-1 text-sm">
              No delivery address found. Please add an address to continue.
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="border-t border-gray-100 bg-white px-6 pt-5 pb-14">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-sm text-text-muted">Total Bill Amount</Text>
          <Text className="text-2xl font-bold text-text">₹{total}</Text>
        </View>
        <PrimaryButton
          title={
            loadingAddress
              ? "Loading..."
              : isProcessing
              ? "Connecting Gateway..."
              : "Pay & confirm"
          }
          onPress={handlePayAndConfirm}
          disabled={isProcessing || loadingAddress}
        />
      </View>

      {RazorpayUI}
    </View>
  );
}
