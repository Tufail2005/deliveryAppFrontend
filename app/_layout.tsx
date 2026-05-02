import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "../src/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
