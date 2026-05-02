import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <SafeAreaView className="bg-primary px-6 pb-8">
        <View className="pt-4">
          <BackButton />
        </View>
        <View className="mt-14 mb-8">
          <Text className="text-4xl font-extrabold text-white mb-4">{title}</Text>
          <Text className="text-base text-white/80 leading-7">{subtitle}</Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-bg rounded-t-[32px] px-6 pt-8"
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}
