import { Tabs } from "expo-router";
import {
  CalendarDays,
  ChefHat,
  Refrigerator,
  ShoppingBasket,
  User,
} from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#10b981", // Emerald 500
        tabBarInactiveTintColor: "#a1a1aa", // Zinc 400
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f4f4f5", // Zinc 100
          elevation: 0,
          shadowOpacity: 0,
        },
        sceneStyle: {
          backgroundColor: "#fafafa", // Zinc 50
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pantry",
          tabBarIcon: ({ color }) => <Refrigerator size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: "Shopping",
          tabBarIcon: ({ color }) => <ShoppingBasket size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: "Planner",
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => <ChefHat size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
