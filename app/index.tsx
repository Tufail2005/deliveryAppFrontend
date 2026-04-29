import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import PrimaryButton from "../src/components/PrimaryButton";

export default function LandingScreen() {
  const router = useRouter();

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
            className="h-14 rounded-3xl items-center justify-center bg-gray-100"
          >
            <Text className="text-base font-bold text-text">Continue as guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
