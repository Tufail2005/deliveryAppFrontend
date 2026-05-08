import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import OtpInput from "../../src/components/OtpInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function VerifyScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    try {
      // 1. Here we will normally make your API call to your backend
      // const response = await fetch('/api/auth/verifyOtp', { body: { phone: phoneNumber, otp }})
      // const data = await response.json()

      // MOCK DATA: Simulating a backend response where the user is an owner
      const mockBackendResponse = {
        success: true,
        user: {
          role: "RESTAURANT_OWNER", // Change to "CUSTOMER" to test the other route!
          token: "jwt_token_here",
        },
      };

      if (mockBackendResponse.success) {
        // Check the role and route accordingly using replace()
        if (
          mockBackendResponse.user.role === "RESTAURANT_OWNER" ||
          mockBackendResponse.user.role === "SUPER_ADMIN"
        ) {
          router.replace("/(restaurant)/dashboard");
        } else {
          router.replace("/(customer)/menu");
        }
      }
    } catch (error) {
      Alert.alert("Verification Failed", "Invalid OTP code.");
    }
  };

  const SubtitleComponent = () => (
    <Text className="text-gray-200 text-center text-sm leading-6">
      We sent a one-time code to
      <Text className="text-white font-bold">
        {" "}
        {phoneNumber || "your number"}
      </Text>
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
