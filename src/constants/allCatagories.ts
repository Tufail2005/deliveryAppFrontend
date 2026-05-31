// src/constants/categories.ts
import { ItemCategory } from "../types/catagories";

export const CATEGORY_UI_CONFIG = {
    [ItemCategory.BURGER]: {
        title: "Burgers",
        image: require("../../assets/categories/burger.png"),
    },
    [ItemCategory.PIZZA]: {
        title: "Pizza",
        image: require("../../assets/categories/pizza.png"),
    },
    [ItemCategory.BIRYANI]: {
        title: "Biryani",
        image: require("../../assets/categories/biryani.png"),
    },
    [ItemCategory.MOMO]: {
        title: "Momos",
        image: require("../../assets/categories/momos.png"),
    },
    [ItemCategory.CHINESE]: {
        title: "Noodles",
        image: require("../../assets/categories/noodles.png"),
    },
    [ItemCategory.DESSERTS]: {
        title: "Cakes",
        image: require("../../assets/categories/cake.png"),
    },
    [ItemCategory.ROLLS]: { 
        title: "Rolls",
        image: require("../../assets/categories/wrap.png"), 
    },
    [ItemCategory.SANDWICH]: {
        title: "Sandwich",
        image: require("../../assets/categories/sandwich.png"),
    },
    // [ItemCategory.OTHERS]: {
    //     title: "Others",
    //     icon: "fast-food" as const,
    // },
} as const;