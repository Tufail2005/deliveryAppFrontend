import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyScreen() {
  // Catch the phone parameter passed from the login screen
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    // TODO: Wire this up to POST /api/auth/verify-otp
    console.log(`Verifying OTP: ${otp} for Phone: ${phone}`);

    // MOCK NAVIGATION: We will replace this with real logic later
    alert("Login Successful! (Mock)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter OTP 🔒</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to +91 {phone}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="• • • • • •"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            autoFocus
            textAlign="center"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, otp.length === 6 ? styles.buttonActive : null]}
          onPress={handleVerifyOtp}
          disabled={otp.length < 6}
        >
          <Text style={styles.buttonText}>Verify & Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
  backButton: {
    position: "absolute",
    top: 50,
    left: 24,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "bold",
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
    lineHeight: 24,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 64,
    marginBottom: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 24,
    letterSpacing: 8,
    color: "#111827",
    fontWeight: "bold",
  },
  button: {
    height: 56,
    backgroundColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
