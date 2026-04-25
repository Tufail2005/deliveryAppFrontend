import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export default function OtpInput({ length = 4, onComplete }: OtpInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Pass full string to parent
    onComplete(newCode.join(""));

    // Auto-advance to next input
    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Auto-backspace to previous input
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View className="flex-row justify-between w-full mb-8 mt-2">
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) {
              inputs.current[index] = ref;
            }
          }}
          className="w-[70px] h-[70px] bg-gray-100 rounded-xl text-center text-2xl font-bold text-text"
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
}
