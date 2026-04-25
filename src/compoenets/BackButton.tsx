import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
    >
      <Ionicons name="chevron-back" size={24} color="#0d0d0d" />
    </TouchableOpacity>
  );
}
