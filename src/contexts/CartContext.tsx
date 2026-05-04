import { Ionicons } from "@expo/vector-icons";
import React, { createContext, useContext, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  isVeg: boolean;
  restaurantId: string;
  restaurantName: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // State to manage the Conflict Popup
  const [conflictState, setConflictState] = useState<{
    visible: boolean;
    pendingItem: CartItem | null;
  }>({ visible: false, pendingItem: null });

  const addToCart = (newItem: CartItem) => {
    // 1. Check if the cart has items AND the new item is from a DIFFERENT restaurant
    if (
      cartItems.length > 0 &&
      cartItems[0].restaurantId !== newItem.restaurantId
    ) {
      // Pause the addition and show the modal
      setConflictState({ visible: true, pendingItem: newItem });
      return;
    }

    // 2. Normal add logic (if cart is empty OR restaurant matches)
    executeAdd(newItem);
  };

  // Helper function to actually add the item
  const executeAdd = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  // Function called when the user clicks "Yes" or "No" on the modal
  const resolveConflict = (replaceCart: boolean) => {
    if (replaceCart && conflictState.pendingItem) {
      // Clear old cart and add the new item
      setCartItems([conflictState.pendingItem]);
    }
    // Hide the modal
    setConflictState({ visible: false, pendingItem: null });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total =
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    (cartItems.length > 0 ? 49 : 0);

  // Derive restaurant names for the UI message
  const currentRestaurantName =
    cartItems.length > 0 ? cartItems[0].restaurantName : "";
  const pendingRestaurantName = conflictState.pendingItem?.restaurantName || "";

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}

      {/* --- GLOBAL CONFLICT MODAL --- */}
      <Modal
        visible={conflictState.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => resolveConflict(false)}
      >
        {/* Removed px-6 to allow the inner view to control its exact width */}
        <View className="flex-1 items-center justify-center bg-black/60">
          {/* DECREASED WIDTH: w-10/12 | INCREASED HEIGHT: min-h-[320px] */}
          <View className="w-10/12 min-h-80 rounded-4xl bg-white p-6 shadow-xl flex-col">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-text">
                Replace cart item?
              </Text>
              <TouchableOpacity onPress={() => resolveConflict(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Added flex-1 so the text takes up the extra vertical space */}
            <Text className="flex-1 text-base leading-6 text-text-muted mt-2">
              Your cart contains dishes from{" "}
              <Text className="font-bold text-text">
                {currentRestaurantName}
              </Text>
              . Do you want to discard the selection and add dishes from{" "}
              <Text className="font-bold text-text">
                {pendingRestaurantName}
              </Text>
              ?
            </Text>

            {/* Added mt-auto to push the buttons firmly to the bottom */}
            <View className="mt-auto flex-row gap-4 pt-4">
              <TouchableOpacity
                onPress={() => resolveConflict(false)}
                className="flex-1 items-center justify-center rounded-2xl bg-gray-100 py-4"
              >
                <Text className="text-base font-bold text-text">No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => resolveConflict(true)}
                className="flex-1 items-center justify-center rounded-2xl bg-primary py-4"
              >
                <Text className="text-base font-bold text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
