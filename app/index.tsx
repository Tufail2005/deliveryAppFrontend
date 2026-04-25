// import "@/global.css";
// import { Link } from "expo-router";
// import { Text, View } from "react-native";

// export default function App() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-xl font-bold color-primary">
//         Welcome to Nativewind!
//       </Text>

//       <Link href="/(auth)/login" className="mt-4 rounded bg-primary text-white p-4 ">login</Link>

//       <Link href="/(auth)/verify" className="mt-4 rounded bg-primary text-white p-4 ">verify</Link>
//     </View>
//   );
// }

import { Redirect } from "expo-router";

export default function Index() {
  // Temporarily skip login for testing the UI
  return <Redirect href="/(customer)/menu" />;
}
