import { useRouter } from "expo-router";
import React, { useState } from "react";
import AuthLayout from "../../src/compoenets/AuthLayout";
import FormInput from "../../src/compoenets/FormInput";
import PrimaryButton from "../../src/compoenets/PrimaryButton";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendCode = () => {
    // Add logic to hit your backend API here
    router.push({
      pathname: "/(auth)/verify",
      params: { email },
    });
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Please enter your phone number to receive a verification code."
    >
      <FormInput
        label="Email"
        placeholder="example@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <PrimaryButton
        title="Send Code"
        onPress={handleSendCode}
        disabled={!email.includes("@")}
      />
    </AuthLayout>
  );
}
