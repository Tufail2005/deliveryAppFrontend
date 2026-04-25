import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

interface CategoryPillProps {
  title: string;
  imageUrl: string;
  isActive: boolean;
  onPress: () => void;
}

export default function CategoryPill({
  title,
  imageUrl,
  isActive,
  onPress,
}: CategoryPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      // Notice the flex-row, gap-2, and adjusted padding (pl-2 is smaller so the image touches the left edge)
      className={`pl-2 pr-5 py-2 rounded-full border mr-3 flex-row items-center gap-2 ${
        isActive ? "bg-primary border-primary" : "bg-white border-gray-200"
      }`}
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-8 h-8 rounded-full bg-gray-100"
      />
      <Text
        className={`font-bold text-sm ${
          isActive ? "text-text-white" : "text-text-muted"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
