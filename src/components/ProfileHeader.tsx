import React from "react";
import { Text, View } from "react-native";
import BackButton from "./BackButton";

interface ProfileHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

export default function ProfileHeader({
  title,
  rightElement,
}: ProfileHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 pt-6 bg-white">
      <View className="flex-1 items-start">
        <BackButton />
      </View>
      <Text className="flex-2 text-center text-lg font-bold text-text">
        {title}
      </Text>
      <View className="flex-1 items-end justify-center">{rightElement}</View>
    </View>
  );
}
