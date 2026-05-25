import axios from "axios";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import AuthLayout from "../../src/components/AuthLayout";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";

interface OnboardingParams {
  phoneNumber: string;
  token: string;
}

export default function OnboardingScreen() {
  const { phoneNumber, token } = useLocalSearchParams() as unknown as OnboardingParams;
  const router = useRouter();

  // User profile fields
  const [name, setName] = useState("");

  // Address fields
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Golaghat");
  const [state, setState] = useState("Assam");
  const [zipCode, setZipCode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Auto-fetch device location on mount
  useEffect(() => {
    const getDeviceLocation = async () => {
      try {
        setFetchingLocation(true);

        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Location Permission",
            "Location access was denied. You can add it manually."
          );
          setLatitude(26.52);
          setLongitude(93.96);
          return;
        }

        // Get current GPS position
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLatitude(currentPosition.coords.latitude);
        setLongitude(currentPosition.coords.longitude);
      } catch (err) {
        console.error("Error fetching location:", err);
        // Use fallback coordinates
        setLatitude(26.52);
        setLongitude(93.96);
      } finally {
        setFetchingLocation(false);
      }
    };

    getDeviceLocation();
  }, []);

  const handleComplete = async () => {
    if (!name.trim() || !street.trim() || !zipCode.trim()) {
      Alert.alert(
        "Validation Error",
        "Please fill in name, street address, and zip code"
      );
      return;
    }

    setLoading(true);
    try {
      const formattedStreet = apartment.trim()
        ? `Apt ${apartment.trim()}, ${street.trim()}`
        : street.trim();

      // Create address using the /address endpoint
      const addressResponse = await axios.post(
        `${API_URL}/user/address`,
        {
          street: formattedStreet,
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          country: "India",
          latitude: latitude ?? 26.52,
          longitude: longitude ?? 93.96,
          label: "Home", // Default label for initial address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (addressResponse.status === 201 || addressResponse.data.success) {
        // Navigate to menu page
        router.replace("/(customer)/menu");
      }
    } catch (error: any) {
      console.error(
        "Address Creation Error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.errors?._errors?.[0] ||
          "Failed to save address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome!"
      subtitle="Complete your profile to get started with amazing food delivery."
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* User Profile Section */}
        <Text className="mt-6 text-lg font-semibold text-text">Personal Info</Text>
        <FormInput
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        {/* Address Section */}
        <Text className="mt-8 text-lg font-semibold text-text">Address</Text>
        <FormInput
          label="Street Address"
          placeholder="Enter your street address"
          value={street}
          onChangeText={setStreet}
          editable={!loading}
        />

        <FormInput
          label="Apartment/Suite (Optional)"
          placeholder="Apt, Suite, Floor, etc."
          value={apartment}
          onChangeText={setApartment}
          editable={!loading}
        />

        <View className="flex-row gap-4">
          <View className="flex-1">
            <FormInput
              label="City"
              placeholder="City"
              value={city}
              onChangeText={setCity}
              editable={!loading}
            />
          </View>
          <View className="flex-1">
            <FormInput
              label="State"
              placeholder="State"
              value={state}
              onChangeText={setState}
              editable={!loading}
            />
          </View>
        </View>

        <FormInput
          label="Zip Code"
          placeholder="Enter zip code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
          editable={!loading}
        />

        <View className="mt-8 mb-4">
          {loading ? (
            <ActivityIndicator size="large" color="#FF863B" />
          ) : (
            <PrimaryButton
              title="Continue to Menu"
              onPress={handleComplete}
              disabled={
                !name.trim() ||
                !street.trim() ||
                !zipCode.trim() ||
                loading ||
                fetchingLocation
              }
            />
          )}
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
