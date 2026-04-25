import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import BackButton from "./BackButton";

interface AuthLayoutProps {
  title: string;
  subtitle: string | React.ReactNode;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <View className="flex-1 bg-bg-dark">
      {/* Dark Header Section */}
      <SafeAreaView>
        <View className="px-6 pt-8 pb-12">
          <BackButton />
          <View className="mt-8 items-center px-4">
            <Text className="text-text-white text-3xl font-bold mb-3">
              {title}
            </Text>
            <Text className="text-gray-300 text-center text-sm leading-5">
              {subtitle}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Overlapping White Bottom Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-bg rounded-t-[32px] px-6 pt-8 shadow-lg"
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}
