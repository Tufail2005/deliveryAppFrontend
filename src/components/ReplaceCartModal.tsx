import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ReplaceCartModalProps {
  visible: boolean;
  currentRestaurant: string;
  newRestaurant: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ReplaceCartModal({
  visible,
  currentRestaurant,
  newRestaurant,
  onCancel,
  onConfirm,
}: ReplaceCartModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-xl font-bold text-text">Replace cart item?</Text>
              <Text className="mt-2 text-sm text-text-muted leading-6">
                Your cart contains dishes from {currentRestaurant}. Do you want to discard the selection and add dishes from {newRestaurant}?
              </Text>
            </View>
            <TouchableOpacity onPress={onCancel} className="p-2">
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between gap-3 mt-6">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 items-center"
            >
              <Text className="text-sm font-semibold text-text">No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 rounded-3xl bg-primary px-4 py-3 items-center"
            >
              <Text className="text-sm font-semibold text-white">Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
