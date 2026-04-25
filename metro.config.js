import { getDefaultConfig } from "expo/metro-config";

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "@/global.css" });
