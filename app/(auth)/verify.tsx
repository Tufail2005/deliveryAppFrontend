import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import OtpInput from "../../src/components/OtpInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function VerifyScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    router.push("/(customer)/menu");
  };

  const SubtitleComponent = () => (
    <Text className="text-gray-200 text-center text-sm leading-6">
      We sent a one-time code to
      <Text className="text-white font-bold"> {phoneNumber || "your number"}</Text>
    </Text>
  );

  return (
    <AuthLayout title="Verify your account" subtitle={<SubtitleComponent />}>
      <View className="mb-4 w-full">
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
          Verification code
        </Text>
        <OtpInput length={4} onComplete={setOtp} />
      </View>

      <PrimaryButton
        title="Verify & continue"
        onPress={handleVerify}
        disabled={otp.length !== 4}
      />

      <TouchableOpacity className="mt-4 self-center">
        <Text className="text-sm text-primary font-semibold">
          Didn’t receive it? Resend code
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
}
