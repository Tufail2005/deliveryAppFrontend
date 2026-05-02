import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function LocationAccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg items-center justify-center px-6">
      <View className="items-center justify-center rounded-full bg-primary/10 w-72 h-72">
        <View className="items-center justify-center rounded-full bg-white w-44 h-44 shadow-sm">
          <View className="items-center justify-center rounded-full bg-primary/20 w-28 h-28">
            <Ionicons name="location-sharp" size={42} color="#FF863B" />
          </View>
        </View>
      </View>

      <Text className="mt-14 text-3xl font-extrabold text-text text-center">
        Access your location
      </Text>
      <Text className="mt-3 text-center text-base text-text-muted leading-7 px-6">
        DFOOD will access your location only while using the app.
      </Text>

      <View className="mt-12 w-full">
        <PrimaryButton
          title="Access location"
          onPress={() => router.push("/(customer)/menu")}
        />
      </View>
    </SafeAreaView>
  );
}
