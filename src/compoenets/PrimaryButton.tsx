import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function PrimaryButton({
  title,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`w-full h-14 rounded-xl items-center justify-center ${
        disabled ? "bg-primary/50" : "bg-primary"
      }`}
      disabled={disabled}
      {...rest}
    >
      <Text className="text-text-white font-bold text-base tracking-widest uppercase">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
