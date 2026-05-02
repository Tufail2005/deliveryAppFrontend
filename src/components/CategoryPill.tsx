import { Ionicons } from "@expo/vector-icons";
import React, { type ComponentProps } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CategoryPillProps {
  title: string;
  imageSource?: ImageSourcePropType;
  /** When set, renders this icon centered in the avatar ring (used for “All”). */
  iconName?: ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  isActive: boolean;
  onPress: () => void;
}

export default function CategoryPill({
  title,
  imageSource,
  iconName,
  iconColor,
  isActive,
  onPress,
}: CategoryPillProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="mr-5 items-center w-[76px]">
      <View
        className={`h-[68px] w-[68px] rounded-[22px] items-center justify-center overflow-hidden bg-white shadow-sm border-2 ${
          isActive ? "border-primary" : "border-gray-100"
        }`}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            className="w-[52px] h-[52px]"
            resizeMode="contain"
          />
        ) : iconName ? (
          <View className="w-[52px] h-[52px] items-center justify-center rounded-2xl bg-orange-50">
            <Ionicons
              name={iconName}
              size={26}
              color={iconColor ?? "#FF863B"}
            />
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        className={`mt-2 text-center text-[13px] w-full px-1 ${
          isActive ? "font-bold text-text" : "font-semibold text-text-muted"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
