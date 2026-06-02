import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Format input so users can only type numeric values up to 10 digits maximum
  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, ""); // Strip spaces, dashes, or non-numeric characters
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
    }
  };

  // Validation boundary rule check (Must be exactly 10 digits)
  const isPhoneLengthValid = phoneNumber.length === 10;

  const handleContinue = async () => {
    if (!isPhoneLengthValid) return; 

    setLoading(true);
    try {
      const formattedPhone = `+91${phoneNumber}`;
      
      const response = await axios.post(`${API_URL}/auth/sendOtp`, {
        phone: formattedPhone,
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
      <View className="mb-6">
        {/* Clean, uniform form title styling */}
        <Text className="text-sm font-semibold text-text mb-2">Phone Number</Text>
        
        {/* 🚀 FIXED UI CONTAINER: Single outer box handling the entire phone row layout smoothly */}
        <View className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 h-14 shadow-sm">
          {/* +91 Indicator attached securely on the left flank */}
          <Text className="text-base font-bold text-text border-r border-gray-200 pr-3 mr-3 h-6 leading-6">
            +91
          </Text>
          
          {/* 🚀 FIXED RAW TEXTINPUT: Eliminates 'label is missing' errors and aligns natively */}
          <TextInput
            placeholder="9876543210"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            maxLength={10} 
            className="flex-1 h-full text-base font-medium text-text"
            style={{ paddingVertical: 0 }} // Cleans up weird OS specific padding defaults
            editable={!loading}
          />
        </View>
      </View>

      <PrimaryButton
        title={loading ? "Sending OTP..." : "Continue"}
        onPress={handleContinue}
        disabled={!isPhoneLengthValid || loading} 
      />
    </AuthLayout>
  );
}