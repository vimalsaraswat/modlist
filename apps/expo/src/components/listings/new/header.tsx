import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useThemeColors } from "~/styles/colors";

const Header = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <View className="flex-row items-center justify-between border-b border-border bg-card px-4 pb-3 pt-2">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
        <Feather name="arrow-left" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text
        className="mr-2 flex-1 text-xl font-bold text-foreground"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
};

export default Header;
