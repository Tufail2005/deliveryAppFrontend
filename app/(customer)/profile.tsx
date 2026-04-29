import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../src/components/BackButton";
import PrimaryButton from "../../src/components/PrimaryButton";

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
          <Text className="text-sm uppercase tracking-[0.2em] text-text-muted mb-3">Account</Text>
          <Text className="text-lg font-bold text-text">Aashish Dutta</Text>
          <Text className="text-sm text-text-muted mt-1">ashis@example.com</Text>
          <Text className="text-sm text-text-muted">+91 9876543210</Text>
        </View>

        <View className="mt-6 space-y-4">
          {[
            { title: "Saved addresses", subtitle: "Home, work, and more" },
            { title: "Payment methods", subtitle: "Cards and wallets" },
            { title: "Help & support", subtitle: "Contact us for issues" },
          ].map((item) => (
            <TouchableOpacity
              key={item.title}
              className="rounded-[28px] bg-white p-5 shadow-sm border border-gray-100"
              onPress={() => console.log(item.title)}
            >
              <Text className="text-base font-semibold text-text">{item.title}</Text>
              <Text className="text-sm text-text-muted mt-2">{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title="Logout"
          onPress={() => router.push("/(auth)/login")}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
}
