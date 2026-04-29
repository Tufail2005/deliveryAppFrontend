import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../src/components/BackButton";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function AddAddressScreen() {
  const router = useRouter();
  const [label, setLabel] = useState("home");

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-text">Save Location</Text>
        <Text className="mt-2 text-sm text-text-muted leading-6">
          Pick the map location and add your address details below.
        </Text>

        <View className="mt-6 rounded-[32px] bg-gray-100 p-5 items-center justify-center">
          <View className="h-48 w-full rounded-[32px] bg-white items-center justify-center shadow-sm border border-gray-200">
            <Ionicons name="location-sharp" size={48} color="#FF863B" />
            <Text className="mt-4 text-sm text-text-muted">Move to edit location</Text>
          </View>
          <View className="mt-4 w-full rounded-[28px] bg-white p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center gap-3">
              <Ionicons name="location-outline" size={20} color="#4B5563" />
              <Text className="text-sm text-text">3235 Royal Ln. Mesa, New Jersey 34567</Text>
            </View>
          </View>
        </View>

        <View className="mt-6 space-y-4">
          <FormInput label="Street" placeholder="Hason Nagar" />
          <FormInput label="Post code" placeholder="34567" keyboardType="numeric" />
          <FormInput label="Appartment" placeholder="345" keyboardType="numeric" />

          <Text className="text-sm font-bold text-text-muted uppercase tracking-[0.18em]">
            Label as
          </Text>
          <View className="flex-row items-center gap-3">
            {[
              { key: "home", text: "Home" },
              { key: "work", text: "Work" },
              { key: "other", text: "Other" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setLabel(option.key)}
                className={`flex-1 rounded-full px-4 py-3 items-center justify-center border ${
                  label === option.key
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    label === option.key ? "text-primary" : "text-text"
                  }`}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-8">
          <PrimaryButton
            title="Save location"
            onPress={() => router.push("/(customer)/addresses")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
