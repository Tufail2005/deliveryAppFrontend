import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import BackButton from "../../src/components/BackButton";
import PrimaryButton from "../../src/components/PrimaryButton";

interface UserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label: string | null | undefined;
  userId: string | null;
  isDefault: boolean; // 👈 ADDED NEW DB FIELD
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export default function AddressesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectable?: string }>();
  const isSelectable = params.selectable === "true";

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 👈 NEW: Track which address is currently communicating with the DB
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!baseUrl) throw new Error("EXPO_PUBLIC_API_URL is missing");
      const token = await SecureStore.getItemAsync("auth_token");
      if (!token) throw new Error("No authentication token found.");

      const response = await axios.get<UserAddress[]>(
        `${baseUrl}/user/addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setAddresses(response.data);
      } else {
        throw new Error("Invalid address format payload returned");
      }
    } catch (err: any) {
      console.error("Fetch Addresses Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to remove this delivery location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync("auth_token");
              if (!baseUrl || !token) return;

              await axios.delete(`${baseUrl}/user/address/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            } catch (err: any) {
              console.error("Deletion Endpoint Error:", err);
              Alert.alert("Error", "Could not remove address profile entry.");
            }
          },
        },
      ]
    );
  };

  // 👈 NEW: PATCH handler for updating the default address
  const handleSelectAddress = async (address: UserAddress) => {
    if (!isSelectable) return;

    setUpdatingId(address.id);

    try {
      const token = await SecureStore.getItemAsync("auth_token");

      // Update Database
      await axios.patch(
        `${baseUrl}/user/addresses/${address.id}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistically update React State
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === address.id,
        }))
      );

      // Pop perfectly back to Menu (Menu's useEffect will now natively fetch this active DB address)
      router.back();
    } catch (err) {
      console.error("Failed to set active address:", err);
      Alert.alert("Error", "Could not update your active delivery address.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getAddressIcon = (label: string | null | undefined) => {
    if (!label) return "location";
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("home")) return "home";
    if (lowerLabel.includes("work") || lowerLabel.includes("office"))
      return "briefcase";
    return "location";
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton
          onPress={() => (isSelectable ? router.back() : router.back())}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          <Text className="text-3xl font-bold text-text">
            {isSelectable ? "Select Location" : "My Address"}
          </Text>
          <Text className="mt-2 text-sm text-text-muted leading-6">
            {isSelectable
              ? "Tap a destination card below to choose your active delivery target location."
              : "Save your preferred delivery locations for faster checkout."}
          </Text>

          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-6 flex-row items-center gap-3">
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="text-red-700 font-semibold text-sm flex-1">
                {error}
              </Text>
            </View>
          ) : addresses.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <Ionicons name="map-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 font-semibold text-base mt-2">
                No addresses saved yet
              </Text>
            </View>
          ) : (
            <View className="mt-6 space-y-4">
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  disabled={!isSelectable || updatingId !== null}
                  onPress={() => handleSelectAddress(address)}
                  activeOpacity={isSelectable ? 0.7 : 1}
                  className={`rounded-4xl p-5 shadow-sm border mb-4 ${
                    // 👈 Visually highlight the Active Default address
                    address.isDefault
                      ? "border-primary bg-primary/5"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <View className="flex-row items-start gap-4">
                    <View
                      className={`h-12 w-12 rounded-2xl items-center justify-center ${
                        address.isDefault ? "bg-primary/20" : "bg-gray-100"
                      }`}
                    >
                      <Ionicons
                        name={getAddressIcon(address.label) as any}
                        size={20}
                        color={address.isDefault ? "#FF863B" : "#6B7280"}
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-base font-bold text-text">
                            {address.label || "Saved Location"}
                          </Text>
                          {/* 👈 Dynamic ACTIVE badge */}
                          {address.isDefault && (
                            <View className="bg-primary px-2 py-0.5 rounded-md">
                              <Text className="text-[10px] font-bold text-white uppercase">
                                Active
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* 👈 Loading spinner for the exact card being updated */}
                        {isSelectable &&
                          (updatingId === address.id ? (
                            <ActivityIndicator size="small" color="#FF863B" />
                          ) : (
                            <View
                              className={`w-5 h-5 rounded-full border items-center justify-center ${
                                address.isDefault
                                  ? "border-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {address.isDefault && (
                                <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </View>
                          ))}
                      </View>

                      <Text className="text-sm text-text-muted mt-2 leading-5">
                        {`${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row justify-end">
                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(address.id)}
                      disabled={updatingId !== null}
                      className="rounded-2xl bg-red-50 px-5 py-3 flex-row items-center gap-2"
                    >
                      <Ionicons name="trash" size={18} color="#F55002" />
                      <Text className="text-sm font-bold text-[#F55002]">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="mt-10 mb-8">
            <PrimaryButton
              title="Add new address"
              onPress={() => router.push("/(customer)/address-add")}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
