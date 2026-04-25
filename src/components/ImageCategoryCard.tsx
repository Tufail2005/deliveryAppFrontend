import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, Text, TouchableOpacity } from "react-native";

interface ImageCategoryCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
}

export default function ImageCategoryCard({
  title,
  imageUrl,
  onPress,
}: ImageCategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      // w-36 h-48 gives that tall, portrait look from your screenshot
      className="w-36 h-48 mr-4 rounded-[24px] overflow-hidden shadow-sm"
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="w-full h-full justify-end"
        resizeMode="cover"
      >
        {/* The Gradient Overlay: Fades from transparent down to dark black */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          className="absolute bottom-0 left-0 right-0 h-1/2 justify-end p-4 pt-10"
        >
          <Text className="text-white font-extrabold text-lg tracking-widest uppercase">
            {title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}
