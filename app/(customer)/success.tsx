import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg items-center justify-center px-6">
      <View className="items-center justify-center rounded-3xl bg-primary/10 w-72 h-72">
        <View className="items-center justify-center rounded-3xl bg-white w-44 h-44 shadow-sm">
          <Text className="text-6xl">💰</Text>
        </View>
      </View>

      <Text className="mt-12 text-3xl font-bold text-text text-center">
        Congratulations!
      </Text>
      <Text className="mt-3 text-center text-base text-text-muted leading-7 px-6">
        You successfully made a payment, enjoy our service!
      </Text>

      <View className="mt-14 w-full">
        <PrimaryButton
          title="Track order"
          onPress={() => router.push("/(customer)/orders")}
        />
      </View>
    </SafeAreaView>
  );
}
