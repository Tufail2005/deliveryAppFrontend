// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack screenOptions={{headerShown: false}}/>;
// }


import "../global.css";

import { Stack } from "expo-router";
import { CartProvider } from "../src/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* We add this to hide the header for our new customer screens */}
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
