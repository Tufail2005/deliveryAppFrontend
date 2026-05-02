import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProfileHeader from "../../src/components/ProfileHeader";
import UserInfo from "../../src/components/UserInfo";

export default function PersonalInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header with EDIT button */}
      <ProfileHeader
        title="Personal Info"
        rightElement={
          <TouchableOpacity>
            <Text className="text-primary font-bold tracking-wider text-sm uppercase">
              Edit
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
        <UserInfo
          name="Vishal Khadok"
          bio="I love fast food"
          imageUrl="https://i.pravatar.cc/150?img=11"
        />

        {/* Info Card */}
        <View className="bg-white rounded-3xl mx-4 p-6 mt-4 shadow-sm border border-gray-100">
          {/* Detail Row 1 */}
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="person" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Full Name
              </Text>
              <Text className="text-base font-bold text-text">
                Vishal Khadok
              </Text>
            </View>
          </View>

          {/* Detail Row 2 */}
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="mail" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Email
              </Text>
              <Text className="text-base font-bold text-text">
                hello@halallab.co
              </Text>
            </View>
          </View>

          {/* Detail Row 3 */}
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="call" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Phone Number
              </Text>
              <Text className="text-base font-bold text-text">
                408-841-0926
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
