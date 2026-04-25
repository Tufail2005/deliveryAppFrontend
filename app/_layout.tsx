// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack screenOptions={{headerShown: false}}/>;
// }

// app/_layout.tsx

// 1. IMPORT YOUR GLOBAL CSS HERE!
// (Adjust the path if your global.css is in a different folder, like '../src/global.css')
import "../global.css";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* We add this to hide the header for our new customer screens */}
      <Stack.Screen name="(customer)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
