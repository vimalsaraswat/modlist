import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useThemeColors } from "~/styles/colors";

const BackButton = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Feather name="arrow-left" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

export default BackButton;
