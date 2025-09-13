import { Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "~/styles/colors";
import { authClient } from "~/utils/auth";

export default function SignOut() {
  const theme = useThemeColors();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          authClient
            .signOut()
            .then(() => router.replace("/"))
            .catch((err) => console.error("Sign out failed", err));
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="flex-row items-center justify-center rounded-lg bg-destructive/10 p-3"
    >
      <Ionicons name="log-out-outline" size={14} color={theme.destructive} />
    </TouchableOpacity>
  );
}
