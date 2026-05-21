import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProfileHeader from "../../src/components/ProfileHeader";
import UserInfo from "../../src/components/UserInfo";

interface PersonalInfoParams {
  id: string;
  name: string;
  phone: string;
  role: string;
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export default function PersonalInfoScreen() {
  const router = useRouter(); // 👈 Initialized router to push data backward
  const params = useLocalSearchParams<Partial<PersonalInfoParams>>();

  // Main screen display states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Modal control and form states
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Network submission state trackers
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load routing parameters instantly on screen mount
  useEffect(() => {
    if (params.name) setName(params.name);
    if (params.phone) setPhone(params.phone);
  }, [params]);

  // Open popup and initialize form buffers with current values
  const handleOpenEditModal = () => {
    setEditName(name);
    setEditPhone(phone);
    setError(null);
    setModalVisible(true);
  };

  // Process the database write update request action
  const handleSaveChanges = async () => {
    if (!editName.trim() || !editPhone.trim()) {
      setError("Name and Phone fields cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (!baseUrl) throw new Error("EXPO_PUBLIC_API_URL is missing");

      const token = await SecureStore.getItemAsync("auth_token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await axios.put(
        `${baseUrl}/user/update`,
        { name: editName.trim(), phone: editPhone.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedName = editName.trim();
        const updatedPhone = editPhone.trim();

        // Sync local states
        setName(updatedName);
        setPhone(updatedPhone);
        setModalVisible(false); // Close popup
        
        // 👈 Trigger Alert with a callback that forces the profile page to sync up parameters
        Alert.alert("Success", "Profile details updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.replace({
                pathname: "/(customer)/profile", // Adjust this path if your profile dashboard file is named differently
                params: {
                  updatedName: updatedName,
                  updatedPhone: updatedPhone
                },
              });
            },
          },
        ]);
      }
    } catch (err: any) {
      console.error("Update Request Error:", err);
      setError(err.response?.data?.message || "Failed to update profile data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Static Header showing standard Edit command link */}
      <ProfileHeader
        title="Personal Info"
        rightElement={
          <TouchableOpacity onPress={handleOpenEditModal}>
            <Text className="text-primary font-bold tracking-wider text-sm uppercase">
              Edit
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
        <UserInfo
          name={name || "Valued Customer"}
          bio={`Account Type: ${params.role || "CUSTOMER"}`}
          imageUrl="https://i.pravatar.cc/150?img=11"
        />

        {/* Read-Only Info Display Card Layout */}
        <View className="bg-white rounded-3xl mx-4 p-6 mt-4 shadow-sm border border-gray-100">
          {/* Detail Row 1: Full Name */}
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="person" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Full Name
              </Text>
              <Text className="text-base font-bold text-text">{name || "Not provided"}</Text>
            </View>
          </View>

          {/* Detail Row 2: Email */}
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="mail" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Email
              </Text>
              <Text className="text-base font-bold text-gray-400">Not provided</Text>
            </View>
          </View>

          {/* Detail Row 3: Phone Number */}
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="call" size={20} color="#FF863B" />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-1 uppercase tracking-[0.18em]">
                Phone Number
              </Text>
              <Text className="text-base font-bold text-text">{phone || "Not provided"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- POPUP EDIT FORM MODAL CONTAINER --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!submitting) setModalVisible(false);
        }}
      >
        {/* Dark blurred background overlay zone */}
        <View className="flex-1 justify-end bg-black/40">
          
          {/* Main Form Sheet Block Container */}
          <View className="bg-white rounded-t-[36px] p-6 shadow-xl space-y-5">
            
            {/* Header Content Row */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-text">Edit Profile</Text>
              <TouchableOpacity 
                disabled={submitting} 
                onPress={() => setModalVisible(false)}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {error && (
              <View className="bg-red-50 border border-red-100 rounded-2xl p-4 flex-row items-center gap-3">
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-red-700 font-semibold text-sm flex-1">{error}</Text>
              </View>
            )}

            {/* Field Inputs Content Zone */}
            <View className="space-y-4">
              <View>
                <Text className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Full Name</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  editable={!submitting}
                  placeholder="Enter your name"
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-base font-semibold text-text"
                />
              </View>

              <View>
                <Text className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Phone Number</Text>
                <TextInput
                  value={editPhone}
                  onChangeText={setEditPhone}
                  editable={!submitting}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-base font-semibold text-text"
                />
              </View>
            </View>

            {/* Action Buttons Row Container Block */}
            <View className="pt-4 flex-row gap-4">
              <TouchableOpacity
                disabled={submitting}
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-gray-100 p-4 rounded-2xl items-center justify-center"
              >
                <Text className="text-text-muted font-bold text-base">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={submitting}
                onPress={handleSaveChanges}
                className="flex-1 bg-primary p-4 rounded-2xl items-center justify-center shadow-sm"
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-base">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}