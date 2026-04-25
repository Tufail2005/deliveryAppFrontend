import { useRouter } from "expo-router";
import React, { useState } from "react";
import AuthLayout from "../../src/components/AuthLayout";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function ForgotPasswordScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSendCode = () => {
    // Add logic to hit your backend API here
    router.push({
      pathname: "/(auth)/verify",
      params: { phoneNumber },
    });
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Please enter your phone number to receive a verification code."
    >
      <FormInput
        label="Phone Number"
        placeholder="123-456-7890"
        keyboardType="phone-pad"
        autoCapitalize="none"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <PrimaryButton
        title="Send Code"
        onPress={handleSendCode}
        disabled={!phoneNumber}
      />
    </AuthLayout>
  );
}
