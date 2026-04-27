import { Stack } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaProvider as RNSafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const SafeAreaProvider = styled(RNSafeAreaView);

export default function RootLayout() {
  return (
    <SafeAreaProvider className="flex-1 bg-background pt-20">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* We add this to hide the header for our new customer screens */}
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
