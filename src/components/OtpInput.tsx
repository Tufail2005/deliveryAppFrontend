import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

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
    onComplete(newCode.join(""));
    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
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
            if (ref) inputs.current[index] = ref;
          }}
          style={styles.input}
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

const styles = StyleSheet.create({
  input: {
    width: 70,
    height: 70,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D0D0D",
  },
});