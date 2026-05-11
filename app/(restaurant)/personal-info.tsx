import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import your reusable components
import ProfileHeader from "../../src/components/ProfileHeader";
import UserInfo from "../../src/components/UserInfo";

export default function OwnerPersonalInfoScreen() {
  const router = useRouter();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");

      const response = await axios.get(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF863B" />
      </View>
    );
  }

  // Safely extract the data to render
  const user = profileData?.user || {};
  const roleDisplay = user.role?.replace("_", " ") || "Merchant";

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header with EDIT button */}
      <ProfileHeader
        title="Personal Info"
        rightElement={
          <TouchableOpacity onPress={() => console.log("Edit Info Clicked")}>
            <Text className="text-primary font-bold tracking-wider text-sm uppercase">
              Edit
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
        <UserInfo
          name={user.name || "Owner Name"}
          bio={roleDisplay}
          imageUrl="https://i.pravatar.cc/150?img=11" // Hardcoded placeholder
        />

        {/* Info Card */}
        <View className="bg-white rounded-3xl mx-4 p-6 mt-4 shadow-sm border border-gray-100">
          {/* Detail Row 1: Name */}
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="person" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Full Name
              </Text>
              <Text className="text-base font-bold text-text">
                {user.name || "Not provided"}
              </Text>
            </View>
          </View>

          {/* Detail Row 2: Phone */}
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="call" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Phone Number
              </Text>
              <Text className="text-base font-bold text-text">
                {user.phone ? `+91 ${user.phone}` : "No phone available"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
