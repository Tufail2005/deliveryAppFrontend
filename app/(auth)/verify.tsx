import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import OtpInput from "../../src/components/OtpInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("Verifying code:", otp);
    // Add logic to verify code with backend here
  };

  const SubtitleComponent = () => (
    <Text className="text-gray-300 text-center text-sm leading-5">
      We have sent a code to your email{"\n"}
      <Text className="font-bold text-text-white">
        {email || "example@gmail.com"}
      </Text>
    </Text>
  );

  return (
    <AuthLayout title="Verification" subtitle={<SubtitleComponent />}>
      {/* Header Row for OTP */}
      <View className="flex-row justify-between items-end mb-2 w-full">
        <Text className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Code
        </Text>
        <TouchableOpacity>
          <Text className="text-xs text-text-muted font-medium">
            <Text className="text-text font-bold underline decoration-text">
              Resend
            </Text>{" "}
            in 50sec
          </Text>
        </TouchableOpacity>
      </View>

      <OtpInput length={4} onComplete={setOtp} />

      <PrimaryButton
        title="Verify"
        onPress={handleVerify}
        disabled={otp.length !== 4}
      />
    </AuthLayout>
  );
}
