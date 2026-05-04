import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#fff8f1] px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-full">
          <View className="items-center">
            <View className="items-center justify-center rounded-full bg-orange-100 w-52 h-52 shadow-md mt-50">
              <View className="items-center justify-center rounded-[28px] bg-white w-36 h-36 shadow-sm">
                <Text className="text-7xl">💰</Text>
              </View>
            </View>

            <Text className="mt-10 text-3xl font-bold text-text text-center">
              Congratulations!
            </Text>
            <Text className="mt-4 text-center text-base text-text-muted leading-7 px-4">
              You successfully made a payment, enjoy our service!
            </Text>
          </View>

          <View className="mt-130 mx-10">
            <PrimaryButton
              title="Track order"
              onPress={() => router.push("/(customer)/orders")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
