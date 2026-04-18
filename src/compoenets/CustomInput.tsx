import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface CustomInputProps extends Omit<TextInputProps, "style"> {
  prefix?: string;
  containerStyle?: StyleProp<ViewStyle>; // For the outer View (margins, padding, etc.)
  inputStyle?: StyleProp<TextStyle>; // For the inner TextInput (fonts, colors, etc.)
}

export default function CustomInput({
  prefix,
  containerStyle,
  inputStyle,
  ...rest
}: CustomInputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {prefix && <Text style={styles.prefix}>{prefix}</Text>}

      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#F9FAFB",
    width: "100%",
  },
  prefix: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#111827",
  },
});
