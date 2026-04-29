import { useRouter } from "expo-router";
import React, { useState } from "react";
import AuthLayout from "../../src/components/AuthLayout";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    router.push({
      pathname: "/(auth)/verify",
      params: { phoneNumber },
    });
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
