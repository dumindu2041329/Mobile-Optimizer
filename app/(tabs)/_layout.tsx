import React from "react";
import { Tabs } from "expo-router";
import { colors } from "@/constants/colors";
import { 
  Home, 
  HardDrive, 
  Battery, 
  Zap, 
  AppWindow 
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="storage"
        options={{
          title: "Storage",
          tabBarIcon: ({ color, size }) => (
            <HardDrive size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="battery"
        options={{
          title: "Battery",
          tabBarIcon: ({ color, size }) => (
            <Battery size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: "Performance",
          tabBarIcon: ({ color, size }) => (
            <Zap size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="apps"
        options={{
          title: "Apps",
          tabBarIcon: ({ color, size }) => (
            <AppWindow size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}