import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router"; // 👈 Integrated useLocalSearchParams
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import your reusable components
import MenuItem from "../../src/components/MenuItem";
import ProfileHeader from "../../src/components/ProfileHeader";
import UserInfo from "../../src/components/UserInfo";

// Exact 1:1 structural typing match for your Prisma select query
interface UserProfile {
  id: string;
  name: string | null;
  phone: string;
  role: string;
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
  const router = useRouter();

  // 1. Hook into backward callback parameters from child screens
  const backParams = useLocalSearchParams<{
    updatedName?: string;
    updatedPhone?: string;
  }>();

  // Component local state managers
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Listener tracking incoming updates from Personal Info screen modal actions
  useEffect(() => {
    if (backParams.updatedName || backParams.updatedPhone) {
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          name: backParams.updatedName ?? prev.name,
          phone: backParams.updatedPhone ?? prev.phone,
        };
      });
    }
  }, [backParams.updatedName, backParams.updatedPhone]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!baseUrl) {
          throw new Error(
            "EXPO_PUBLIC_API_URL is missing from environment variables"
          );
        }

        // Fetch the stored token securely from device storage
        const token = await SecureStore.getItemAsync("auth_token");

        if (!token) {
          throw new Error(
            "No authentication token found. Redirecting to login..."
          );
        }

        // Query the /me route with your bearer verification token attached
        const response = await axios.get(`${baseUrl}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error(
            "Invalid response profile format payload from server"
          );
        }
      } catch (err: any) {
        console.error("Profile Fetch Error:", err);

        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          await SecureStore.deleteItemAsync("auth_token");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

      {/* --- CASE 1: RETRIEVING DATA --- */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : error ? (
        /* --- CASE 2: SECURE HANDSHAKE FAILURE --- */
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-gray-800 font-bold text-lg mt-2">
            Authentication Issue
          </Text>
          <Text className="text-gray-500 text-sm text-center mt-1 mb-6">
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            className="bg-primary px-6 py-3 rounded-xl shadow-sm"
          >
            <Text className="text-white font-bold">Go to Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* --- CASE 3: LIVE SECURED PROFILE RENDER --- */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        >
          {/* Dynamic properties mapped straight out of your database schema */}
          <UserInfo
            name={user?.name || "Valued Customer"}
            bio={`Phone: ${user?.phone}`} // Showing phone here since bio field doesn't exist
          />

          {/* Group 1: Account */}
          <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
            <MenuItem
              iconName="person-outline"
              title="Personal Info"
              onPress={() => {
                if (user) {
                  router.push({
                    pathname: "/(customer)/personal-info",
                    params: {
                      id: user.id,
                      name: user.name ?? "",
                      phone: user.phone,
                      role: user.role,
                    },
                  });
                }
              }}
            />
            <MenuItem
              iconName="location-outline"
              title="Addresses"
              onPress={() => router.push("/(customer)/addresses")}
              iconColor="#A753F3"
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
            {/* <MenuItem iconName="heart-outline" title="Favourite" onPress={() => {}} iconColor="#FF4B4B" /> */}
            {/* <MenuItem iconName="notifications-outline" title="Notifications" onPress={() => {}} /> */}
            <MenuItem
              iconName="card-outline"
              title="Payment Method"
              onPress={() => router.push("/(customer)/checkout")}
              iconColor="#0DB8F3"
            />
          </View>

          {/* Group 3: Support & Settings */}
          <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
            {/* <MenuItem iconName="help-circle-outline" title="FAQs" onPress={() => {}} /> */}
            <MenuItem
              iconName="chatbubble-ellipses-outline"
              title="User Reviews"
              onPress={() => {}}
              iconColor="#0DCC7B"
            />
            <MenuItem
              iconName="list-outline"
              title="My Orders"
              onPress={() => router.push("/(customer)/orders")}
            />
          </View>

          {/* Group 4: Logout */}
          <View className="bg-white rounded-3xl mx-4 py-2 mb-4 shadow-sm border border-gray-100">
            <MenuItem
              iconName="log-out-outline"
              title="Log Out"
              onPress={async () => {
                // Completely erase the current token on sign out
                await SecureStore.deleteItemAsync("auth_token");
                await SecureStore.deleteItemAsync(
                  `active_order_id_${user?.id}`
                );
                router.replace("/(auth)/login");
              }}
              iconColor="#FF4B4B"
              textColor="#FF4B4B"
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
