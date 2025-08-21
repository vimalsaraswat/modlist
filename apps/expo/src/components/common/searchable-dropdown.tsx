import React, { useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";

interface Option {
  label: string;
  value: string | number;
}

interface SearchableDropdownProps {
  options: Option[];
  selectedValue?: string | number | null;
  onSelect: (value: Option) => void;
  placeholder?: string;
  modalTitle?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options = [],
  selectedValue,
  onSelect,
  placeholder = "Select an option...",
  modalTitle = "Select Option",
}) => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === selectedValue) ?? null,
    [selectedValue, options],
  );

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, options]);

  const handleSelect = (option: Option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchText("");
    Keyboard.dismiss();
  };

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        className={clsx(
          "flex-row items-center justify-between rounded-lg border border-border bg-card px-3 py-3",
          !selectedOption && "text-muted-foreground",
        )}
        onPress={() => setIsOpen(true)}
      >
        <Text
          className={clsx(
            "text-base",
            selectedOption ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
      </Pressable>

      {/* Modal for Search + List */}
      <Modal visible={isOpen} animationType="slide" transparent>
        {/* Backdrop */}
        <Pressable
          className="absolute inset-0 bg-black/30"
          onPress={() => setIsOpen(false)}
        />

        <View className="absolute bottom-0 left-0 right-0 max-h-[60%] rounded-t-2xl bg-background shadow-xl">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <Text className="text-lg font-bold text-foreground">
              {modalTitle}
            </Text>
            <Pressable onPress={() => setIsOpen(false)}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </Pressable>
          </View>

          {/* Search Input */}
          <View className="m-4 flex-row items-center rounded-lg border border-border bg-card px-3">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
              className="ml-2 flex-1 py-2 text-foreground"
              autoFocus
            />
          </View>

          {/* Options List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => String(item.value)}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => {
              const isSelected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={clsx(
                    "flex-row items-center px-4 py-3 active:opacity-70",
                    isSelected && "bg-primary/10",
                  )}
                >
                  <Text
                    className={clsx(
                      "flex-1 text-base",
                      isSelected
                        ? "font-semibold text-primary"
                        : "text-foreground",
                    )}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#2563EB"
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <Text className="px-4 py-6 text-center text-muted-foreground">
                No results found
              </Text>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

export default SearchableDropdown;
