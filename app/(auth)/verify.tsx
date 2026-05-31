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
    if (otp.length < 4) {
      Alert.alert("Error", "Please enter a valid OTP code.");
      return;
    }

    setLoading(true);
    try {
      // Format phone number string parameters natively for consistency
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
      
      const response = await axios.post(`${API_URL}/auth/verifyOtp`, {
        phone: formattedPhone,
        otp: otp,
      });

      const { token, user, isNewUser } = response.data;

      // Store the session token securely
      if (token) {
        await SecureStore.setItemAsync("auth_token", token);
      }

      // Check user role parameters
      if (user.role === "RESTAURANT_OWNER" || user.role === "SUPER_ADMIN") {
        router.replace("/(restaurant)/select-restaurant");
      } else {
        // 🚀 NAVIGATION FLOW FIXED HERE:
        // If they are brand new, OR their profile is missing an address/name, route to onboarding.
        // If they already exist in your DB with complete profile data, skip onboarding entirely!
        if (isNewUser || !user.isProfileComplete) {
          router.replace({
            pathname: "/(auth)/onboarding",
            params: { phoneNumber, token },
          });
        } else {
          router.replace("/(customer)/menu");
        }
      }
    } catch (error: any) {
      console.error("Verify OTP Screen Error:", error.response?.data || error.message);
      Alert.alert(
        "Verification Failed",
        error.response?.data?.message || "Invalid OTP code entered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify account"
      subtitle="Enter the verification code sent to your mobile number"
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
          disabled={otp.length < 4}
        />
      )}
    </AuthLayout>
  );
}