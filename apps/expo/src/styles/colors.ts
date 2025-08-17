import { useColorScheme } from "react-native";

export const useThemeColors = () => {
  const colorScheme = useColorScheme();

  const light = {
    background: "hsl(24 100% 98.0392%)",
    foreground: "hsl(346.6667 7.9646% 22.1569%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(346.6667 7.9646% 22.1569%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(346.6667 7.9646% 22.1569%)",
    primary: "hsl(11.625 100% 68.6275%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(8.5714 100% 95.8824%)",
    secondaryForeground: "hsl(9.913 47.3251% 47.6471%)",
    muted: "hsl(15 100% 96.0784%)",
    mutedForeground: "hsl(25 5.2632% 44.7059%)",
    accent: "hsl(26.1069 98.4962% 73.9216%)",
    accentForeground: "hsl(346.6667 7.9646% 22.1569%)",
    destructive: "hsl(355.4913 77.5785% 56.2745%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(14.6341 100% 91.9608%)",
    input: "hsl(14.6341 100% 91.9608%)",
    ring: "hsl(11.625 100% 68.6275%)",
  };

  const dark = {
    background: "hsl(336 13.5135% 14.5098%)",
    foreground: "hsl(21.4286 35% 92.1569%)",
    card: "hsl(324 9.6154% 20.3922%)",
    cardForeground: "hsl(21.4286 35% 92.1569%)",
    popover: "hsl(324 9.6154% 20.3922%)",
    popoverForeground: "hsl(21.4286 35% 92.1569%)",
    primary: "hsl(11.625 100% 68.6275%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(325 9.375% 25.098%)",
    secondaryForeground: "hsl(21.4286 35% 92.1569%)",
    muted: "hsl(324 9.6154% 20.3922%)",
    mutedForeground: "hsl(22.2222 25.2336% 79.0196%)",
    accent: "hsl(26.1069 98.4962% 73.9216%)",
    accentForeground: "hsl(336 13.5135% 14.5098%)",
    destructive: "hsl(355.4913 77.5785% 56.2745%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(325 9.375% 25.098%)",
    input: "hsl(325 9.375% 25.098%)",
    ring: "hsl(11.625 100% 68.6275%)",
  };

  return colorScheme === "dark" ? dark : light;
};
