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
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Track original GPS text to know if the user changed the location manually
  const [originalGpsText, setOriginalGpsText] = useState("");

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
        
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLatitude(26.52);
          setLongitude(93.96);
          setError("Location permission denied. Please enter the address manually below.");
          return;
        }

        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const lat = currentPosition.coords.latitude;
        const lng = currentPosition.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        const geocodeResults = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (geocodeResults.length > 0) {
          const place = geocodeResults[0];
          const calculatedCity = place.city || place.subregion || place.district || "";
          const calculatedState = place.region || "";
          
          setCity(calculatedCity);
          setState(calculatedState);
          if (place.postalCode) {
            setZipCode(place.postalCode);
          }

          // Lock a reference string of the GPS text setup
          setOriginalGpsText(`${calculatedCity}, ${calculatedState}`.toLowerCase().trim());
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

      let finalLatitude = latitude;
      let finalLongitude = longitude;

      const currentFormText = `${city.trim()}, ${state.trim()}`.toLowerCase().trim();

      // 🚀 FIXED: If user edited the address text manually to order for their sister,
      // bypass the phone's hardware GPS and find the real coordinates of the typed town!
      if (currentFormText !== originalGpsText || !finalLatitude || !finalLongitude) {
        const lookupString = `${street.trim()}, ${city.trim()}, ${state.trim()}, ${zipCode.trim()}, India`;
        
        const forwardGeocodeResults = await Location.geocodeAsync(lookupString);
        
        if (forwardGeocodeResults.length > 0) {
          finalLatitude = forwardGeocodeResults[0].latitude;
          finalLongitude = forwardGeocodeResults[0].longitude;
        } else {
          // Try a broader search with just city, state, and zip code if street address lookup fails
          const broaderLookupString = `${city.trim()}, ${state.trim()}, ${zipCode.trim()}, India`;
          const broaderResults = await Location.geocodeAsync(broaderLookupString);
          
          if (broaderResults.length > 0) {
            finalLatitude = broaderResults[0].latitude;
            finalLongitude = broaderResults[0].longitude;
          } else {
            throw new Error("Could not pinpoint the geographic coordinates for this address. Please double-check your spelling.");
          }
        }
      }

      const formattedStreet = apartment.trim()
        ? `Apt ${apartment.trim()}, ${street.trim()}`
        : street.trim();

      const payload = {
        street: formattedStreet,
        city: city.trim(),         
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: "India",
        label: label.charAt(0).toUpperCase() + label.slice(1), 
        latitude: finalLatitude,  
        longitude: finalLongitude 
      };

      const response = await axios.post(`${baseUrl}/user/address`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201 || response.data) {
        router.replace("/(customer)/addresses");
      }
    } catch (err: any) {
      console.error("Add Address Submission Crash:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
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
          <View className="mt-4 bg-text-muted/10 border border-text-muted/20 rounded-2xl p-4 flex-row items-center gap-3">
            <Ionicons name="alert-circle" size={20} color="#3E444E" />
            <Text className="text-text font-semibold text-sm flex-1">
              {error}
            </Text>
          </View>
        )}

        {fetchingLocation && (
          <View className="mt-4 bg-primary/10 rounded-2xl p-4 flex-row items-center gap-3">
            <ActivityIndicator size="small" color="#FF863B" />
            <Text className="text-primary font-medium text-sm">
              Fetching current location details...
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
            <FormInput
              label="City"
              placeholder="Enter City"
              value={city}
              onChangeText={setCity}
              editable={!submitting}
            />
          </View>
          <View className="flex-1">
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