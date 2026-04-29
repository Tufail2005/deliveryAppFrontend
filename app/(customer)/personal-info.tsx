import React from "react";
import { ScrollView, Text, View } from "react-native";
import BackButton from "../../src/components/BackButton";

export default function PersonalInfoScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-text">Personal Info</Text>
        <Text className="mt-2 text-sm text-text-muted leading-6">
          Review the personal details linked to your account.
        </Text>

        <View className="mt-6 rounded-[32px] bg-white p-6 shadow-sm border border-gray-100">
          <View className="items-center justify-center rounded-full bg-primary/10 h-24 w-24 self-center mb-6">
            <Text className="text-4xl">👤</Text>
          </View>

          {[
            { label: "Full name", value: "Vishal Khadok" },
            { label: "Email", value: "hello@halallab.co" },
            { label: "Phone number", value: "+1 408-841-0926" },
          ].map((field) => (
            <View key={field.label} className="mb-5">
              <Text className="text-xs uppercase tracking-[0.18em] text-text-muted mb-2">
                {field.label}
              </Text>
              <View className="rounded-3xl bg-gray-100 px-4 py-4">
                <Text className="text-base text-text">{field.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
