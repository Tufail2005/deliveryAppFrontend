import { Image, type ImageSourcePropType } from "react-native";

/** Bundled hero / list cover keyed by restaurant `id`. */
export const RESTAURANT_COVER_BY_ID: Record<string, ImageSourcePropType> = {
  "1": require("../../assets/restaurant-covers/mexican-breakfast.png"),
  "2": require("../../assets/restaurant-covers/asian-feast.png"),
  "3": require("../../assets/restaurant-covers/street-kitchen.png"),
  "4": require("../../assets/restaurant-covers/gourmet-spread.png"),
  "5": require("../../assets/restaurant-covers/salad-bar.png"),
  "6": require("../../assets/restaurant-covers/pizza-double.png"),
};

/** Metro-resolved URI for passing through router params / cart thumbnails. */
export function getRestaurantCoverUri(id: string): string | undefined {
  const src = RESTAURANT_COVER_BY_ID[id];
  if (!src) return undefined;
  return Image.resolveAssetSource(src)?.uri;
}
