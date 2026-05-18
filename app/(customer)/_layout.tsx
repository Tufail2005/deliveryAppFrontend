import { Stack } from "expo-router";
import React from "react";
import { CartProvider } from "../../src/contexts/CartContext";

export default function CustomerLayout() {
  return (
    <CartProvider>
      {/* Return the context wrapper accurately */}
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
