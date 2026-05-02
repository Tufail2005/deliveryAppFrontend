import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import your reusable components
import MenuItem from "../../src/components/MenuItem";
import ProfileHeader from "../../src/components/ProfileHeader";
import UserInfo from "../../src/components/UserInfo";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ProfileHeader
        title="Profile"
        rightElement={
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm border border-gray-100">
            <Ionicons name="ellipsis-horizontal" size={20} color="#0d0d0d" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
      >
        {/* Reusable User Info Component */}
        <UserInfo
          name="Vishal Khadok"
          bio="I love fast food"
          imageUrl="https://i.pravatar.cc/150?img=11"
        />

        {/* Group 1: Account */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="person-outline"
            title="Personal Info"
            onPress={() => router.push("/(customer)/personal-info")}
          />
          <MenuItem
            iconName="location-outline"
            title="Addresses"
            onPress={() => router.push("/(customer)/addresses")}
            iconColor="#A753F3" // Purple
          />
        </View>

        {/* Group 2: App Features */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="cart-outline"
            title="Cart"
            onPress={() => router.push("/(customer)/cart")}
            iconColor="#0DB8F3"
          />
          <MenuItem
            iconName="heart-outline"
            title="Favourite"
            onPress={() => {}}
            iconColor="#FF4B4B"
          />
          <MenuItem
            iconName="notifications-outline"
            title="Notifications"
            onPress={() => {}}
          />
          <MenuItem
            iconName="card-outline"
            title="Payment Method"
            onPress={() => router.push("/(customer)/checkout")}
            iconColor="#0DB8F3"
          />
        </View>

        {/* Group 3: Support & Settings */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="help-circle-outline"
            title="FAQs"
            onPress={() => {}}
          />
          <MenuItem
            iconName="chatbubble-ellipses-outline"
            title="User Reviews"
            onPress={() => {}}
            iconColor="#0DCC7B"
          />
          <MenuItem
            iconName="settings-outline"
            title="Settings"
            onPress={() => {}}
          />
        </View>

        {/* Group 4: Logout */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="log-out-outline"
            title="Log Out"
            onPress={() => router.push("/(auth)/login")}
            iconColor="#FF4B4B"
            textColor="#FF4B4B"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
