import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../src/components/BackButton";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export default function AddAddressScreen() {
  const router = useRouter();

  // Form input management hooks
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [apartment, setApartment] = useState("");
  const [label, setLabel] = useState("home");

  // 🚀 FIXED: Dynamic fields for City and State instead of hardcoded strings
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // State hooks to store physical coordinates
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Submission and error boundaries
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatically query device position on screen mount and reverse-geocode address
  useEffect(() => {
    const getDeviceLocation = async () => {
      try {
        setFetchingLocation(true);

        setError(null);
        
        // Request runtime permission from iOS/Android operating systems
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError(
            "Permission to access location was denied. Using default coordinates."
          );
          // Fallback placeholders if user blocks access
          setLatitude(26.52);
          setLongitude(93.96);
          setError("Permission to access location was denied. Please fill in details manually.");
          return;
        }

        // Grab the actual physical GPS reading
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const lat = currentPosition.coords.latitude;
        const lng = currentPosition.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        // 🚀 SMART ADDITION: Convert lat/lng coordinates into a readable address structure
        const geocodeResults = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (geocodeResults.length > 0) {
          const place = geocodeResults[0];
          // Dynamically populate fields with fallback options
          setCity(place.city || place.subregion || place.district || "");
          setState(place.region || "");
          if (place.postalCode) {
            setZipCode(place.postalCode);
          }
        }
      } catch (err) {
        console.error("Error reading device coordinates or geocoding:", err);
        setError("Could not retrieve GPS location automatically.");
      } finally {
        setFetchingLocation(false);
      }
    };

    getDeviceLocation();
  }, []);

  const handleSaveLocation = async () => {
    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setError("Please complete all address details before saving.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (!baseUrl) {
        throw new Error("EXPO_PUBLIC_API_URL environment variable is missing");
      }

      const token = await SecureStore.getItemAsync("auth_token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const formattedStreet = apartment.trim()
        ? `Apt ${apartment.trim()}, ${street.trim()}`
        : street.trim();

      // Dynamic data payload containing parsed user inputs
      const payload = {
        street: formattedStreet,
        city: city.trim(),         
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: "India",
        label: label.charAt(0).toUpperCase() + label.slice(1), 
        latitude: latitude ?? 26.52,  
        longitude: longitude ?? 93.96 
      };

      const response = await axios.post(`${baseUrl}/user/address`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.data) {
        router.replace("/(customer)/addresses");
      }
    } catch (err: any) {
      console.error("Add Address Submission Crash:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?._errors?.[0] ||
          "Failed to save address details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-6">
        <BackButton />
      </View>

      <ScrollView
        className="px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-3xl font-bold text-text">Save Location</Text>
        <Text className="mt-2 text-sm text-text-muted leading-6">
          Add your address details below.
        </Text>

        {error && (
          <View className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex-row items-center gap-3">
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text className="text-red-700 font-semibold text-sm flex-1">
              {error}
            </Text>
          </View>
        )}

        {/* Address Section */}
        <Text className="mt-8 text-lg font-semibold text-text">Address</Text>
        <FormInput
          label="Street Address"
          placeholder="Enter your street address"
          value={street}
          onChangeText={setStreet}
          editable={!submitting}
        />

        <FormInput
          label="Apartment/Suite (Optional)"
          placeholder="Apt, Suite, Floor, etc."
          value={apartment}
          onChangeText={setApartment}
          editable={!submitting}
        />

        <View className="flex-row gap-4">
          <View className="flex-1">
            {/* 🚀 FIXED: Editable City Input with a clear placeholder text */}
            <FormInput
              label="City"
              placeholder="Enter City"
              value={city}
              onChangeText={setCity}
              editable={!submitting}
            />
          </View>
          <View className="flex-1">
            {/* 🚀 FIXED: Editable State Input with a clear placeholder text */}
            <FormInput
              label="State"
              placeholder="Enter State"
              value={state}
              onChangeText={setState}
              editable={!submitting}
            />
          </View>
        </View>

        <FormInput
          label="Zip Code"
          placeholder="Enter zip code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
          editable={!submitting}
        />

        {/* Label Selection */}
        <Text className="mt-8 text-lg font-semibold text-text">Label as</Text>
        <View className="flex-row items-center gap-3 mt-4 mb-4">
          {[
            { key: "home", text: "Home" },
            { key: "work", text: "Work" },
            { key: "other", text: "Other" },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setLabel(option.key)}
              disabled={submitting}
              className={`flex-1 rounded-full px-4 py-3 items-center justify-center border ${
                label === option.key
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  label === option.key ? "text-primary" : "text-text"
                }`}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-8 mb-4">
          {submitting ? (
            <ActivityIndicator size="large" color="#FF863B" />
          ) : (
            <PrimaryButton
              title="Save location"
              disabled={fetchingLocation}
              onPress={handleSaveLocation}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
