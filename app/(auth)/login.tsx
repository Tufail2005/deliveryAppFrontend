import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// 1. Import your brand new reusable components!
import CustomButton from "../../src/compoenets/CustomButton";
import CustomInput from "../../src/compoenets/CustomInput";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    router.push({ pathname: "/(auth)/verify", params: { phone } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back! 👋</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to login or register.
        </Text>

        {/* 2. Using your Custom Input */}
        <CustomInput
          prefix="+91"
          placeholder="9876543210"
          keyboardType="numeric"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          autoFocus
          containerStyle={{ marginBottom: 24 }}
        />

        {/* 3. Using your Custom Button */}
        <CustomButton
          title="Send OTP"
          onPress={handleSendOtp}
          disabled={phone.length < 10}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// 4. The StyleSheet is now tiny! It ONLY handles layout for this specific screen.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
});
