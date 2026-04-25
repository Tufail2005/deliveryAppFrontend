import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

interface VisualCategoryCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
}

export default function VisualCategoryCard({
  title,
  imageUrl,
  onPress,
}: VisualCategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-28 h-32 mr-4 rounded-2xl overflow-hidden bg-gray-200"
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="w-full h-full justify-end"
        resizeMode="cover"
      >
        {/* Dark gradient overlay to make text pop */}
        <View className="bg-black/40 w-full p-2 pt-6">
          <Text className="text-white font-bold text-xs tracking-wider">
            {title.toUpperCase()}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
