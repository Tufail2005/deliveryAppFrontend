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
import RestaurantFormModal from "../../src/components/RestaurantFormModal";

export default function SelectRestaurantScreen() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  const fetchMyRestaurants = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const response = await axios.get(`${API_URL}/restaurant/my-restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(response.data.data);
    } catch (error) {
      console.error("Error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = async (formData: any) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const response = await axios.post(
        `${API_URL}/restaurant/add-restaurant`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Restaurant registered successfully!");
        setModalVisible(false);
        fetchMyRestaurants(); // Refresh the list
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create restaurant"
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF863B" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-6 pt-8">
        <Text className="text-3xl font-bold text-text mb-2">
          Your Restaurants
        </Text>
        <Text className="text-sm text-text-muted mb-8">
          Select or create a restaurant to manage.
        </Text>

        {restaurants.map((res: any) => (
          <TouchableOpacity
            key={res.id}
            onPress={() =>
              router.push({
                pathname: "/(restaurant)/dashboard",
                params: { restaurantId: res.id },
              })
            }
            className="bg-white rounded-4xl p-6 mb-4 shadow-sm border border-gray-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center">
                <Ionicons name="restaurant" size={24} color="#FF863B" />
              </View>
              <View>
                <Text className="text-lg font-bold text-text">{res.name}</Text>
                <Text className="text-xs text-text-muted">
                  {res.address?.city}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* Trigger Modal Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="border-2 border-dashed border-gray-300 rounded-4xl p-8 items-center justify-center mt-4"
        >
          <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
            <Ionicons name="add" size={28} color="#9CA3AF" />
          </View>
          <Text className="text-base font-bold text-gray-400">
            Add New Restaurant
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* The Popup Form */}
      <RestaurantFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddRestaurant}
      />
    </SafeAreaView>
  );
}
