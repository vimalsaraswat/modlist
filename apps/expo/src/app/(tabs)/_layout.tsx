import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "~/styles/colors";
import { authClient } from "~/utils/auth";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const { data: session } = authClient.useSession();

  if (!session) return <Redirect href="/" />;

  return (
    <Tabs
      initialRouteName="listings"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foreground,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 58 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
          elevation: 10, // Android shadow
          shadowColor: colors.foreground, // iOS shadow
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: "absolute",
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="listings"
        options={{
          title: "Listings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
              style={{ minWidth: size, minHeight: size, textAlign: "center" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
              style={{ minWidth: size, minHeight: size, textAlign: "center" }}
            />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
