import React from "react";
import { Image, Text, View } from "react-native";

interface UserInfoProps {
  name: string;
  bio: string;
  imageUrl: string;
}

export default function UserInfo({ name, bio, imageUrl }: UserInfoProps) {
  return (
    <View className="flex-row items-center px-6 py-4 mb-4">
      <Image
        source={{ uri: imageUrl }}
        className="w-20 h-20 rounded-full bg-gray-200 mr-4"
      />
      <View>
        <Text className="text-xl font-bold text-text mb-1">{name}</Text>
        <Text className="text-sm text-text-muted">{bio}</Text>
      </View>
    </View>
  );
}
