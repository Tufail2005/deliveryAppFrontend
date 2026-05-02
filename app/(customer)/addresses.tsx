import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../src/components/BackButton";
import PrimaryButton from "../../src/components/PrimaryButton";

const ADDRESSES = [
  {
    id: "home",
    title: "Home",
    subtitle: "2464 Royal Ln. Mesa, New Jersey 45463",
    icon: "home",
  },
  {
    id: "work",
    title: "Work",
    subtitle: "3891 Ranchview Dr. Richardson, California 62639",
    icon: "briefcase",
  },
];

export default function AddressesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-text">My Address</Text>
        <Text className="mt-2 text-sm text-text-muted leading-6">
          Save your preferred delivery locations for faster checkout.
        </Text>

        <View className="mt-6 space-y-4">
          {ADDRESSES.map((address) => (
            <View
              key={address.id}
              className="rounded-[32px] bg-white p-5 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-start gap-4">
                <View className="h-12 w-12 rounded-2xl bg-primary/10 items-center justify-center">
                  <Ionicons name={address.icon as any} size={20} color="#FF863B" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-text">{address.title}</Text>
                  <Text className="text-sm text-text-muted mt-2">{address.subtitle}</Text>
                </View>
              </View>

              <View className="mt-4 flex-row justify-end gap-4">
                <TouchableOpacity className="rounded-2xl bg-primary/10 px-4 py-3">
                  <Ionicons name="pencil" size={18} color="#FF863B" />
                </TouchableOpacity>
                <TouchableOpacity className="rounded-2xl bg-red-50 px-4 py-3">
                  <Ionicons name="trash" size={18} color="#F55002" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-10">
          <PrimaryButton
            title="Add new address"
            onPress={() => router.push("/(customer)/address-add")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
