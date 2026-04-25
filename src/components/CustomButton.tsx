// src/components/CustomButton.tsx
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function CustomButton({
  title,
  disabled,
  style,
  ...rest
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonActive,
        style, // Allows you to pass extra styles from the parent screen if needed
      ]}
      disabled={disabled}
      {...rest}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonActive: {
    backgroundColor: "#EF4444", // Swiggy/Zomato Red
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB", // Grayed out
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
