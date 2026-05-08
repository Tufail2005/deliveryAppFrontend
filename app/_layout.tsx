import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "../src/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      {/* Apply globally to the root stack */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(restaurant)" />
      </Stack>
    </CartProvider>
  );
}
