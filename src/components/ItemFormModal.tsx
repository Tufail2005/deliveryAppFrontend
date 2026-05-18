import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "./PrimaryButton";

export interface ItemFormData {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

interface ItemFormModalProps {
  visible: boolean;
  initialData: ItemFormData | null;
  onClose: () => void;
  onSave: (data: ItemFormData) => void;
}

const CATEGORIES = ["Burger", "Pizza", "Beverages", "Sandwich", "Desserts"];

export default function ItemFormModal({
  visible,
  initialData,
  onClose,
  onSave,
}: ItemFormModalProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    description: "",
    price: "",
    category: "Burger",
    imageUrl: "",
    isAvailable: true,
  });

  const [isUploading, setIsUploading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Burger",
        imageUrl: "",
        isAvailable: true,
      });
    }
  }, [initialData, visible]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to upload an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as any, // Cast to any to bypass the TS type check
      allowsEditing: true,
      aspect: [1, 1],
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

      // 1. Fetch credentials from your backend using Axios as normal
      const authResponse = await axios.get(`${API_URL}/upload/imagekit-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { signature, expire, token: imageKitToken } = authResponse.data;

      // 2. Parse file properties explicitly
      const filename = uri.split("/").pop() || `upload-${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : `image/jpeg`;

      // 3. Construct FormData explicitly
      const fileData = new FormData();

      // We cast to any here to stop TypeScript from complaining about the custom object layout
      fileData.append("file", {
        uri: uri,
        name: filename,
        type: fileType,
      } as any);

      fileData.append(
        "publicKey",
        process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY!
      );
      fileData.append("signature", signature);
      fileData.append("expire", expire.toString());
      fileData.append("token", imageKitToken);
      fileData.append("folder", "/menu_items");
      fileData.append("fileName", filename);

      // 4. Use native fetch instead of Axios for the direct ImageKit call
      // DO NOT add a "Content-Type" header here manually. Let fetch generate the multipart boundary string natively.
      const response = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: fileData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("ImageKit Error Raw Response:", responseData);
        throw new Error(responseData.message || "Failed to upload to ImageKit");
      }

      // 5. Update state with the clean cloud URL string
      setFormData((prev: any) => ({ ...prev, imageUrl: responseData.url }));
    } catch (error) {
      console.error("Upload Error Detailed Log:", error);
      Alert.alert("Upload Failed", "Could not complete image upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      Alert.alert("Error", "Please fill in the Name, Price, and Category.");
      return;
    }
    onSave(formData);
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
        <View className="bg-white rounded-t-[32px] pt-4 pb-8 max-h-[90%] relative shadow-lg">
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
              {initialData ? "Edit Item" : "Create New Item"}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="px-6 pt-4"
          >
            <View className="mb-6 items-center">
              <TouchableOpacity
                onPress={handlePickImage}
                disabled={isUploading}
                className="w-32 h-32 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden"
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
                    <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
                    <Text className="text-xs text-text-muted mt-2 font-bold uppercase">
                      Add Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Item Name *
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <TextInput
                  value={formData.name}
                  onChangeText={(t) => setFormData({ ...formData, name: t })}
                  placeholder="e.g. Cheese Beast Burger"
                  placeholderTextColor="#9CA3AF"
                  className="text-base text-text"
                />
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Price ($) *
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <TextInput
                  value={formData.price}
                  onChangeText={(t) => setFormData({ ...formData, price: t })}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  className="text-base text-text"
                />
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Category *
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-full mr-2 border ${
                      formData.category === cat
                        ? "bg-black border-black"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        formData.category === cat ? "text-white" : "text-text"
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                Description
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 h-24">
                <TextInput
                  value={formData.description}
                  onChangeText={(t) =>
                    setFormData({ ...formData, description: t })
                  }
                  placeholder="Describe the ingredients..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  style={{ textAlignVertical: "top" }}
                  className="flex-1 text-base text-text"
                />
              </View>
            </View>
            <View className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8">
              <View>
                <Text className="text-base font-bold text-text">
                  Currently Available
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#86efac" }}
                thumbColor={formData.isAvailable ? "#16a34a" : "#f3f4f6"}
                onValueChange={(val) =>
                  setFormData({ ...formData, isAvailable: val })
                }
                value={formData.isAvailable}
              />
            </View>
          </ScrollView>
          <View className="px-6 pt-4 border-t border-gray-100">
            <PrimaryButton
              title="Save Item Details"
              onPress={handleSave}
              disabled={isUploading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
