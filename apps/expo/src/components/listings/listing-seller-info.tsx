import React from "react";
import { Image, Text, View } from "react-native";

import { authClient } from "~/utils/auth";
import MessageSellerButton from "./message-seller-btn";

interface User {
  id: string;
  name: string;
  image?: string | null;
  createdAt: Date;
}

interface Listing {
  id: string;
  title: string;
  image: string;
  description: string;
}

interface ListingSellerInfoProps {
  seller: User;
  sellerId: string;
  listing: Listing;
}

const ListingSellerInfo = ({
  seller,
  sellerId,
  listing,
}: ListingSellerInfoProps) => {
  const { data: session } = authClient.useSession();

  return (
    <View>
      <View className="rounded-xl border border-border bg-card p-4">
        <View className="mb-4 flex-row items-center">
          {seller.image && (
            <Image
              source={{ uri: seller.image }}
              className="mr-3 h-12 w-12 rounded-full"
            />
          )}
          <View>
            <Text className="text-lg font-semibold text-foreground">
              {seller.name}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Member since {new Date(seller.createdAt).getFullYear()}
            </Text>
          </View>
        </View>
        {session?.user.id && sellerId !== session.user.id && (
          <MessageSellerButton sellerId={sellerId} listing={listing} />
        )}
      </View>
    </View>
  );
};

export default ListingSellerInfo;
