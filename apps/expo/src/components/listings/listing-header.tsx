import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";

import FavouriteButton from "./favourite-btn";

interface ListingHeaderProps {
  title: string;
  listingId: string;
  initialIsFavourited: boolean;
}

const ListingHeader = ({
  title,
  listingId,
  initialIsFavourited,
}: ListingHeaderProps) => {
  const navigation = useNavigation();

  // const handleShare = () => {
  //   // TODO: Implement share functionality
  //   console.log("Sharing listing:", title);
  // };

  return (
    <View className="flex-row items-center justify-between border-b border-border bg-card px-4 pb-3 pt-2">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
        <Feather name="arrow-left" size={24} className="text-red-700" />
      </TouchableOpacity>
      <Text
        className="mr-2 flex-1 text-xl font-bold text-foreground"
        numberOfLines={1}
      >
        {title}
      </Text>

      <View className="flex-row items-center">
        <FavouriteButton
          listingId={listingId}
          initialIsFavourited={initialIsFavourited}
        />

        {/*<TouchableOpacity onPress={handleShare} className="ml-2 p-2">
          <Feather name="share" size={24} color="#1DA1F2" />
        </TouchableOpacity>*/}
      </View>
    </View>
  );
};

export default ListingHeader;
