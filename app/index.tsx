// import "@/global.css";
// import { Redirect } from "expo-router";
// export default function Index() {
//   return <Redirect href="/(auth)/login" />;
// }
import "@/global.css";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}