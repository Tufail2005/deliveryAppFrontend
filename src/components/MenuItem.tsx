import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  iconColor?: string;
  textColor?: string;
}

export default function MenuItem({
  iconName,
  title,
  onPress,
  iconColor = "#FF863B",
  textColor = "#0D0D0D",
}: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-6 py-4"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <Text className="text-base font-semibold" style={{ color: textColor }}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
