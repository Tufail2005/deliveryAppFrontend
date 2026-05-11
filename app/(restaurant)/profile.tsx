import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import your reusable components
import MenuItem from "../../src/components/MenuItem";
import ProfileHeader from "../../src/components/ProfileHeader";
import UserInfo from "../../src/components/UserInfo";

export default function OwnerProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ProfileHeader
        title="Owner Profile"
        rightElement={
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm border border-gray-100">
            <Ionicons name="settings-outline" size={20} color="#0d0d0d" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
      >
        {/* Replace with actual owner data later */}
        <UserInfo
          name="Vishal Khadok"
          bio="Restaurant Owner"
          imageUrl="https://i.pravatar.cc/150?img=11"
        />

        {/* Group 1: Account & Business */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="person-outline"
            title="Personal Info"
            onPress={() => router.push("/(restaurant)/personal-info")}
          />
          <MenuItem
            iconName="business-outline"
            title="Business Details"
            onPress={() => {}}
            iconColor="#A753F3"
          />
        </View>

        {/* Group 2: Financials & App */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="wallet-outline"
            title="Payout Methods"
            onPress={() => {}}
            iconColor="#0DCC7B" // Green for money
          />
          <MenuItem
            iconName="notifications-outline"
            title="Order Notifications"
            onPress={() => {}}
            iconColor="#0DB8F3"
          />
        </View>

        {/* Group 3: Support */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="headset-outline"
            title="Merchant Support"
            onPress={() => {}}
            iconColor="#FF863B"
          />
          <MenuItem
            iconName="document-text-outline"
            title="Terms & Policies"
            onPress={() => {}}
          />
        </View>

        {/* Group 4: Logout */}
        <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
          <MenuItem
            iconName="log-out-outline"
            title="Log Out"
            onPress={handleLogout}
            iconColor="#FF4B4B"
            textColor="#FF4B4B"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
