import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store"; // 🚀 1. Imported SecureStore
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../src/components/PrimaryButton";

export default function LandingScreen() {
  const router = useRouter();
  
  // 🚀 2. State to handle the splash/checking phase smoothly
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Look for your saved login token
        const token = await SecureStore.getItemAsync("auth_token");

        if (token) {
          // 🎯 ZOMATO STYLE: User is verified, skip straight to home menu feed
          router.replace("/(customer)/menu");
          return; // Exit execution early so state doesn't toggle
        }
      } catch (error) {
        console.error("Error reading device session data:", error);
      } finally {
        // No token found or read failure, unlock layout for login actions
        setIsCheckingSession(false);
      }
    };

    checkUserSession();
  }, []);

  // 🚀 3. While looking inside storage keys, show a clean background loading state
  if (isCheckingSession) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color="#FF863B" />
      </View>
    );
  }

  // --- Normal welcome screen layout builds only if user is logged out ---
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 py-8 justify-between">
        <View className="mt-10">
          <Text className="text-4xl font-extrabold text-text mb-4">
            Discover great food near you.
          </Text>
          <Text className="text-base leading-7 text-text-muted">
            Browse restaurants, pick your favorites, and checkout in seconds.
          </Text>
        </View>

        <View className="space-y-4 mb-8">
          <PrimaryButton
            title="Login to continue"
            onPress={() => router.push("/(auth)/login")}
          />
          <TouchableOpacity
            onPress={() => router.push("/(customer)/menu")}
            className="h-14 rounded-3xl items-center justify-center bg-gray-100 mt-4" // Added clear spacing margin top
          >
            <Text className="text-base font-bold text-text">Continue as guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}