import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router"; // 👈 Integrated useLocalSearchParams
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../src/components/BackButton";
import PrimaryButton from "../../src/components/PrimaryButton";

// 1:1 structural typing match for your precise Prisma Address Schema
interface UserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label: string | null | undefined; // e.g., "Home", "Office"
  userId: string | null;
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export default function AddressesScreen() {
  const router = useRouter();
  
  // 1. Grab routing parameters to verify if opened via the Menu dropdown
  const params = useLocalSearchParams<{ selectable?: string }>();
  const isSelectable = params.selectable === "true"; // Evaluates to true only if called by Menu screen

  // Component local state trackers
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved user delivery profiles from backend databases
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!baseUrl) {
        throw new Error("EXPO_PUBLIC_API_URL is missing from environment variables");
      }

      const token = await SecureStore.getItemAsync("auth_token");

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await axios.get<UserAddress[]>(`${baseUrl}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setAddresses(response.data);
      } else {
        throw new Error("Invalid address format payload returned from server");
      }
    } catch (err: any) {
      console.error("Fetch Addresses Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Secure deletion orchestration pipeline handler
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

              // Fire request to your explicit Express router setup: router.delete("/address/:id", protect, deleteAddress);
              await axios.delete(`${baseUrl}/user/address/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              // Instantly slice the removed item from React local view state tracking arrays
              setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            } catch (err: any) {
              console.error("Deletion Endpoint Error:", err);
              Alert.alert("Error", "Could not remove address profile entry at this time.");
            }
          },
        },
      ]
    );
  };

  // 2. Selection execution pipeline handler pushing chosen state backward to Menu screen
  const handleSelectAddress = (address: UserAddress) => {
    if (!isSelectable) return; // Completely ignores click triggers if opened through settings dashboard layout tracks

    router.replace({
      pathname: "/(customer)/menu",
      params: {
        selectedAddressLabel: address.label || `${address.street}, ${address.city}`,
      },
    });
  };

  // Safe layout symbol builder mapping your custom enum tracking configurations
  const getAddressIcon = (label: string | null | undefined) => {
    if (!label) return "location"; 

    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("home")) return "home";
    if (lowerLabel.includes("work") || lowerLabel.includes("office")) return "briefcase";
    
    return "location"; 
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        {/* Conditional back tracking to make sure users pop cleanly into the caller root stacks */}
        <BackButton 
          onPress={() => isSelectable ? router.replace("/(customer)/menu") : router.back()} 
        />
      </View>

      {/* --- CASE 1: LOADING RETRIEVAL TRACKS --- */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF863B" />
        </View>
      ) : (
        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* Dynamic contextual headings configuration mapping */}
          <Text className="text-3xl font-bold text-text">
            {isSelectable ? "Select Location" : "My Address"}
          </Text>
          <Text className="mt-2 text-sm text-text-muted leading-6">
            {isSelectable 
              ? "Tap a destination card below to choose your active delivery target location." 
              : "Save your preferred delivery locations for faster checkout."}
          </Text>

          {/* --- CASE 2: API HANDSHAKE ERROR BAR --- */}
          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-6 flex-row items-center gap-3">
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="text-red-700 font-semibold text-sm flex-1">{error}</Text>
            </View>
          ) : addresses.length === 0 ? (
            /* --- CASE 3: EMPTY LOGGED BUCKET VIEW --- */
            <View className="py-12 items-center justify-center">
              <Ionicons name="map-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 font-semibold text-base mt-2">No addresses saved yet</Text>
            </View>
          ) : (
            /* --- CASE 4: LIVE SECURED FEED MAP BLOCKS --- */
            <View className="mt-6 space-y-4">
              {addresses.map((address) => (
                /* Wrap entire layout item within a conditional selectable container component */
                <TouchableOpacity
                  key={address.id}
                  disabled={!isSelectable}
                  onPress={() => handleSelectAddress(address)}
                  activeOpacity={isSelectable ? 0.7 : 1}
                  className={`rounded-4xl bg-white p-5 shadow-sm border mb-4 ${
                    isSelectable ? "border-primary/30 bg-orange-50/5" : "border-gray-100"
                  }`}
                >
                  <View className="flex-row items-start gap-4">
                    <View className="h-12 w-12 rounded-2xl bg-primary/10 items-center justify-center">
                      <Ionicons
                        name={getAddressIcon(address.label) as any}
                        size={20}
                        color="#FF863B"
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base font-bold text-text">
                          {address.label || "Saved Location"}
                        </Text>
                        
                        {/* Dynamic decorative selection badge visual element */}
                        {isSelectable && (
                          <View className="bg-primary/10 px-2.5 py-1 rounded-full">
                            <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">Select</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-text-muted mt-2 leading-5">
                        {`${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`}
                      </Text>
                    </View>
                  </View>

                  {/* Clean, Expanded Delete-Only Action Row Block Layout */}
                  <View className="mt-4 flex-row justify-end">
                    <TouchableOpacity 
                      onPress={() => handleDeleteAddress(address.id)}
                      className="rounded-2xl bg-red-50 px-5 py-3 flex-row items-center gap-2"
                    >
                      <Ionicons name="trash" size={18} color="#F55002" />
                      <Text className="text-sm font-bold text-[#F55002]">Remove</Text>
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