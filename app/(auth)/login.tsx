import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Call the sendOtp route
      const response = await axios.post(`${API_URL}/auth/sendOtp`, {
        phone: phoneNumber,
      });

      if (response.data.success || response.status === 200) {
        router.push({
          pathname: "/(auth)/verify",
          params: { phoneNumber },
        });
      }
    } catch (error: any) {
      console.error("Send OTP Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Could not connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your phone number to continue and discover nearby restaurants."
    >
      <FormInput
        label="Phone Number"
        placeholder="9876543210"
        keyboardType="phone-pad"
        autoCapitalize="none"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <PrimaryButton
        title="Continue"
        onPress={handleContinue}
        disabled={phoneNumber.length < 10}
      />
    </AuthLayout>
  );
}
