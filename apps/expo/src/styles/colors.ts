import { useColorScheme } from "react-native";

export const useThemeColors = () => {
  const colorScheme = useColorScheme();

  const light = {
    background: "hsl(24 100% 98.0392%)",
    foreground: "hsl(346.6667 7.9646% 22.1569%)",
    primary: "hsl(11.625 100% 68.6275%)",
    secondary: "hsl(8.5714 100% 95.8824%)",
    border: "hsl(14.6341 100% 91.9608%)",
  };

  const dark = {
    background: "hsl(336 13.5135% 14.5098%)",
    foreground: "hsl(21.4286 35% 92.1569%)",
    primary: "hsl(11.625 100% 68.6275%)",
    secondary: "hsl(325 9.375% 25.098%)",
    border: "hsl(325 9.375% 25.098%)",
  };

  return colorScheme === "dark" ? dark : light;
};
