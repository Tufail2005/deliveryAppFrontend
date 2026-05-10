import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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
    latitude: 0, // Placeholder
    longitude: 0, // Placeholder
  });

  const handleSave = () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.street ||
      !formData.city ||
      !formData.zipCode
    ) {
      alert("Please fill in name and full address details.");
      return;
    }
    onSave(formData);
    // Reset form
    setFormData({
      name: "",
      description: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: 0,
      longitude: 0,
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
            {/* Basic Info */}
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

            {/* Address Info */}
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
            <PrimaryButton title="Create Restaurant" onPress={handleSave} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
