import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import OtpInput from "../../src/components/OtpInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function VerifyScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Actual API call to verifyOtp
      // Format phone number with country code if not already present
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const response = await axios.post(`${API_URL}/auth/verifyOtp`, {
        phone: formattedPhone,
        otp: otp,
      });

      const { token, user } = response.data;

      // Store the JWT token securely
      if (token) {
        await SecureStore.setItemAsync("auth_token", token);
      }

      // Route based on role
      if (user.role === "RESTAURANT_OWNER" || user.role === "SUPER_ADMIN") {
        router.replace("/(restaurant)/select-restaurant");
      } else {
        // For customers: check if user is new
        // If isNewUser is true or user doesn't have complete profile, navigate to onboarding
        if (user.isNewUser || !user.isProfileComplete) {
          router.replace({
            pathname: "/(auth)/onboarding",
            params: { phoneNumber, token },
          });
        } else {
          router.replace("/(customer)/menu");
        }
      }
    } catch (error: any) {
      console.error("Verify OTP Error:", error.response?.data || error.message);
      Alert.alert(
        "Verification Failed",
        error.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify account"
      subtitle="Enter your phone number to continue"
    >
      <View className="mb-4 w-full">
        <OtpInput length={6} onComplete={setOtp} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF863B" />
      ) : (
        <PrimaryButton
          title="Verify & continue"
          onPress={handleVerify}
          disabled={otp.length < 4} // Adjust based on your OTP length
        />
      )}
    </AuthLayout>
  );
}
