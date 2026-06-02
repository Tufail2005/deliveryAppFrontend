import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function VerifyScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Hidden input ref to easily catch user taps on boxes
  const inputRef = useRef<TextInput>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const OTP_LENGTH = 4; // 🚀 FIXED: Enforced 4-digit length target constraint

  const handleTextChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, ""); // Restrict input strictly to numbers
    if (cleaned.length <= OTP_LENGTH) {
      setOtp(cleaned);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert("Error", `Please enter a valid ${OTP_LENGTH}-digit OTP code.`);
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
      
      const response = await axios.post(`${API_URL}/auth/verifyOtp`, {
        phone: formattedPhone,
        otp: otp,
      });

      const { token, user, isNewUser } = response.data;

      if (token) {
        await SecureStore.setItemAsync("auth_token", token);
      }

      if (user.role === "RESTAURANT_OWNER" || user.role === "SUPER_ADMIN") {
        router.replace("/(restaurant)/select-restaurant");
      } else {
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

  // Focus trigger helper for tap actions
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <AuthLayout
      title="Verify account"
      subtitle={`Enter the verification code sent to +91 ${phoneNumber}`}
    >
      <View className="mb-8 mt-4 items-center justify-center">
        {/* Invisible TextInput running underneath */}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={handleTextChange}
          maxLength={OTP_LENGTH}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoFocus={true}
          style={{ opacity: 0, position: 'absolute', width: 1, height: 1 }}
        />

        {/* 🚀 FIXED MINIMAL UI BOXES: 4 beautiful responsive square nodes */}
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={focusInput} 
          className="flex-row justify-between w-full max-w-[280px]"
        >
          {Array.from({ length: OTP_LENGTH }).map((_, index) => {
            const char = otp[index] || "";
            const isFocused = index === otp.length;

            return (
              <View
                key={index}
                className={`w-14 h-14 rounded-2xl bg-white border items-center justify-center shadow-sm ${
                  isFocused ? "border-primary" : "border-gray-200"
                }`}
                style={isFocused ? { borderColor: "#FF863B", borderWidth: 2 } : {}}
              >
                <Text className="text-xl font-bold text-text">
                  {char}
                </Text>
              </View>
            );
          })}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-4">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <PrimaryButton
          title="Verify & continue"
          onPress={handleVerify}
          disabled={otp.length !== OTP_LENGTH || loading}
        />
      )}
    </AuthLayout>
  );
}