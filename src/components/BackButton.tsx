import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

// 1. Declare the optional onPress property type definition interface
interface BackButtonProps {
  onPress?: () => void; // 👈 Made optional with '?' so it remains fully backwards-compatible
}

// 2. Destructure the onPress prop from the incoming component arguments
export default function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      // 3. Conditional execution: Uses the custom handler if passed, defaults to router.back() if empty
      onPress={onPress ? onPress : () => router.back()}
      className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
    >
      <Ionicons name="chevron-back" size={24} color="#0d0d0d" />
    </TouchableOpacity>
  );
}