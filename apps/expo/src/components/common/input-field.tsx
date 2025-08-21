import { Text, TextInput, View } from "react-native";

import { cn } from "~/lib/utils";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
}) => (
  <View className="mb-4 px-4">
    <Text className="mb-2 text-sm font-semibold text-foreground">{label}</Text>
    <TextInput
      className={cn(
        "rounded-lg border border-border bg-card/40 px-3 py-2 text-foreground",
        multiline && "min-h-[100px] text-start",
      )}
      textAlignVertical={multiline ? "top" : undefined}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      keyboardType={keyboardType}
    />
  </View>
);

export default InputField;
