import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ServiceNotAvailableProps {
    currentCity?: string;
    }

    export default function ServiceNotAvailable({ currentCity }: ServiceNotAvailableProps) {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center px-8 pt-12 pb-20">
        <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4 border border-gray-100">
            {/* 🚀 FIXED: Swapped 'location-off-outline' to a universally safe alternative icon name */}
            <Ionicons name="location-outline" size={38} color="#9CA3AF" />
        </View>
        
        <Text className="text-xl font-bold text-text text-center">
            Service Not Available
        </Text>
        
        <Text className="mt-2 text-sm text-text-muted text-center leading-6 max-w-[280px]">
            We haven't launched our services in {currentCity || "this area"} yet. Our partners are expanding fast!
        </Text>

        <TouchableOpacity
            onPress={() =>
            router.push({
                pathname: "/(customer)/addresses",
                params: { selectable: "true" },
            })
            }
            className="mt-6 bg-primary px-6 py-3 rounded-full shadow-sm active:opacity-90"
        >
            <Text className="text-white text-sm font-bold">
            Change Location
            </Text>
        </TouchableOpacity>
        </View>
    );
}