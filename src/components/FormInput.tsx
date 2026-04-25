import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
}

export default function FormInput({ label, ...rest }: FormInputProps) {
  return (
    <View className="w-full mb-6">
      <Text className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
        {label}
      </Text>
      <TextInput
        className="w-full h-16 bg-gray-100 rounded-xl px-4 text-base text-text"
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </View>
  );
}
