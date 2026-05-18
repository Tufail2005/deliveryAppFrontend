import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "./PrimaryButton";

interface RestaurantFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function RestaurantFormModal({
  visible,
  onClose,
  onSave,
}: RestaurantFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: 0,
    longitude: 0,
    imageUrl: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to upload a cover banner."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as any,
      allowsEditing: true,
      aspect: [16, 9], // Landscape wide aspect ratio for store banners
      quality: 0.8,
    });

    if (result.canceled) return;
    const asset = result.assets[0];

    const fileSizeMB = asset.fileSize ? asset.fileSize / (1024 * 1024) : 0;
    if (fileSizeMB > 15) {
      Alert.alert(
        "File Too Large",
        "Please select an image smaller than 15MB."
      );
      return;
    }

    uploadToImageKit(asset.uri);
  };

  const uploadToImageKit = async (uri: string) => {
    setIsUploading(true);
    try {
      const token = await SecureStore.getItemAsync("auth_token");

      const authResponse = await axios.get(`${API_URL}/upload/imagekit-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { signature, expire, token: imageKitToken } = authResponse.data;

      const fileData = new FormData();
      fileData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: `restaurant-banner-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
      fileData.append(
        "publicKey",
        process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY!
      );
      fileData.append("signature", signature);
      fileData.append("expire", expire.toString());
      fileData.append("token", imageKitToken);
      fileData.append("folder", "/restaurant_banners");
      fileData.append("fileName", "filename");

      const uploadResponse = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        fileData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setFormData((prev) => ({ ...prev, imageUrl: uploadResponse.data.url }));
    } catch (error) {
      console.error("Banner Upload Error:", error);
      Alert.alert("Upload Failed", "Could not upload store banner.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.street ||
      !formData.city ||
      !formData.zipCode
    ) {
      Alert.alert(
        "Error",
        "Please fill in the store name and full address details."
      );
      return;
    }
    onSave(formData);
    setFormData({
      name: "",
      description: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: 0,
      longitude: 0,
      imageUrl: "",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/60"
      >
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />
        <View className="bg-white rounded-t-[40px] pt-4 pb-8 max-h-[90%] relative shadow-lg">
          <View className="absolute -top-14 self-center">
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="px-6 pb-4 border-b border-gray-100">
            <Text className="text-2xl font-bold text-text">
              Register Restaurant
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="px-6 pt-4"
          >
            <View className="mb-6">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Store Banner Image
              </Text>
              <TouchableOpacity
                onPress={handlePickImage}
                disabled={isUploading}
                className="w-full h-40 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden"
              >
                {isUploading ? (
                  <ActivityIndicator size="large" color="#FF863B" />
                ) : formData.imageUrl ? (
                  <Image
                    source={{ uri: formData.imageUrl }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                    <Text className="text-xs text-text-muted mt-2 font-bold uppercase">
                      Upload Cover Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Text className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              Basic Information
            </Text>
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted mb-2">
                Restaurant Name *
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(t) => setFormData({ ...formData, name: t })}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-base"
                placeholder="e.g. The Spicy Hub"
              />
            </View>
            <View className="mb-6">
              <Text className="text-sm font-bold text-text-muted mb-2">
                Description
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(t) =>
                  setFormData({ ...formData, description: t })
                }
                multiline
                numberOfLines={3}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-base h-24"
                placeholder="Tell customers about your kitchen..."
              />
            </View>
            <Text className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              Location Details
            </Text>
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted mb-2">
                Street Address *
              </Text>
              <TextInput
                value={formData.street}
                onChangeText={(t) => setFormData({ ...formData, street: t })}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-base"
                placeholder="123 Food Street"
              />
            </View>
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-bold text-text-muted mb-2">
                  City *
                </Text>
                <TextInput
                  value={formData.city}
                  onChangeText={(t) => setFormData({ ...formData, city: t })}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-base"
                  placeholder="Mumbai"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-text-muted mb-2">
                  State
                </Text>
                <TextInput
                  value={formData.state}
                  onChangeText={(t) => setFormData({ ...formData, state: t })}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-base"
                  placeholder="MH"
                />
              </View>
            </View>
            <View className="mb-8">
              <Text className="text-sm font-bold text-text-muted mb-2">
                Zip Code *
              </Text>
              <TextInput
                value={formData.zipCode}
                onChangeText={(t) => setFormData({ ...formData, zipCode: t })}
                keyboardType="numeric"
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-base"
                placeholder="400001"
              />
            </View>
          </ScrollView>
          <View className="px-6 pt-4 border-t border-gray-100">
            <PrimaryButton
              title="Create Restaurant"
              onPress={handleSave}
              disabled={isUploading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
