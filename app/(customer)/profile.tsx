import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../src/components/BackButton";
import PrimaryButton from "../../src/components/PrimaryButton";

const ITEMS = [
  { title: "Personal Info", icon: "person-circle-outline", route: "personal-info" },
  { title: "Addresses", icon: "location-outline", route: "addresses" },
  { title: "Cart", icon: "cart-outline", route: "cart" },
  { title: "Favourite", icon: "heart-outline", route: "" },
  { title: "Notifications", icon: "notifications-outline", route: "" },
  { title: "Payment Method", icon: "card-outline", route: "checkout" },
  { title: "FAQs", icon: "help-circle-outline", route: "" },
  { title: "User Reviews", icon: "chatbubble-ellipses-outline", route: "" },
  { title: "Settings", icon: "settings-outline", route: "" },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-text">Profile</Text>
        <Text className="mt-2 text-sm text-text-muted leading-6">
          Manage your account, saved addresses, and payment details.
        </Text>

        <View className="mt-6 rounded-[32px] bg-white p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center gap-4">
            <View className="h-20 w-20 rounded-full bg-primary/10 items-center justify-center">
              <Text className="text-3xl">👤</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-text">Vishal Khadok</Text>
              <Text className="mt-1 text-sm text-text-muted">I love fast food</Text>
            </View>
          </View>
        </View>

        <View className="mt-6 space-y-3">
          {ITEMS.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => item.route && router.push(`/(customer)/${item.route}`)}
              className="rounded-[28px] bg-white p-4 shadow-sm border border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <View className="h-12 w-12 rounded-3xl bg-gray-100 items-center justify-center">
                  <Ionicons name={item.icon as any} size={20} color="#FF863B" />
                </View>
                <Text className="text-base font-semibold text-text">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title="Log Out"
          onPress={() => router.push("/(auth)/login")}
          className="mt-8"
        />
      </ScrollView>
    </View>
  );
}
