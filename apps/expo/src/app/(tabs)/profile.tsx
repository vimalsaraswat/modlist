// // import React from "react";
// // import { Pressable, Text, View } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { useRouter } from "expo-router";

// // import { authClient } from "~/utils/auth";

// // export default function ProfileScreen() {
// //   const router = useRouter();
// //   const { data: session } = authClient.useSession();

// //   const logout = async () => {
// //     // Trigger logout mutation or clear session
// //     await authClient.signOut();
// //     router.replace("/");
// //   };

// //   return (
// //     <SafeAreaView className="flex-1 bg-background px-4">
// //       <Text className="mb-6 text-2xl font-bold text-foreground">Profile</Text>
// //       {session?.user ? (
// //         <View>
// //           <Text className="mb-2 text-lg text-foreground">
// //             Name: {session.user.name}
// //           </Text>
// //           <Text className="mb-6 text-lg text-foreground">
// //             Email: {session.user.email}
// //           </Text>
// //           <Pressable
// //             onPress={logout}
// //             className="rounded-lg bg-destructive px-6 py-3"
// //           >
// //             <Text className="text-center font-semibold text-white">Logout</Text>
// //           </Pressable>
// //         </View>
// //       ) : (
// //         <Text className="text-foreground">Not logged in</Text>
// //       )}
// //     </SafeAreaView>
// //   );
// // }

// import React, { useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Image,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import clsx from "clsx";

// import { trpc } from "~/utils/api";
// import { authClient } from "~/utils/auth";
// import { formatTimeAgo } from "~/utils/date";

// // Types
// interface UserListing {
//   id: string;
//   title: string;
//   price: number;
//   images: string[];
//   status: "active" | "sold" | "draft" | "pending";
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface FavouriteListing {
//   id: string;
//   title: string;
//   price: number;
//   images: string[];
//   createdAt: Date;
// }

// interface GarageCar {
//   id: string;
//   make: string;
//   model: string;
//   year: number;
//   image: string;
//   isOwned: boolean;
// }

// // Components
// const ProfileHeader = ({
//   user,
//   onEdit,
// }: {
//   user: { name: string; email: string; image: string | null } | null;
//   onEdit: () => void;
// }) => (
//   <View className="mb-6 flex-row items-center">
//     {user?.image ? (
//       <Image source={{ uri: user.image }} className="h-16 w-16 rounded-full" />
//     ) : (
//       <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
//         <Text className="text-2xl font-bold text-white">
//           {user?.name?.charAt(0).toUpperCase() || "U"}
//         </Text>
//       </View>
//     )}

//     <View className="ml-4 flex-1">
//       <View className="flex-row items-center justify-between">
//         <Text className="text-xl font-bold text-foreground" numberOfLines={1}>
//           {user?.name || "User"}
//         </Text>
//         <TouchableOpacity onPress={onEdit} className="p-2">
//           <Ionicons name="create-outline" size={20} color="#1DA1F2" />
//         </TouchableOpacity>
//       </View>
//       <Text className="text-muted-foreground" numberOfLines={1}>
//         {user?.email}
//       </Text>
//     </View>
//   </View>
// );

// const StatCard = ({
//   title,
//   value,
//   icon,
//   onPress,
// }: {
//   title: string;
//   value: string | number;
//   icon: string;
//   onPress?: () => void;
// }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     className={clsx(
//       "flex-1 rounded-xl border border-border bg-card p-4",
//       onPress && "active:opacity-80",
//     )}
//   >
//     <View className="mb-2 flex-row items-center">
//       <Ionicons name={icon} size={20} color="#1DA1F2" />
//       <Text className="ml-2 text-sm text-muted-foreground">{title}</Text>
//     </View>
//     <Text className="text-2xl font-bold text-foreground">{value}</Text>
//   </TouchableOpacity>
// );

// const ListingItem = ({
//   listing,
//   onPress,
// }: {
//   listing: UserListing;
//   onPress: () => void;
// }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     className="mb-3 flex-row overflow-hidden rounded-xl border border-border bg-card active:opacity-90"
//   >
//     <Image
//       source={{ uri: listing.images[0] || "https://placehold.co/100" }}
//       className="h-20 w-20"
//     />
//     <View className="flex-1 p-3">
//       <Text className="mb-1 font-semibold text-foreground" numberOfLines={1}>
//         {listing.title}
//       </Text>
//       <Text className="mb-2 font-bold text-primary">
//         ₹{listing.price.toLocaleString()}
//       </Text>
//       <View className="flex-row items-center justify-between">
//         <View
//           className={clsx(
//             "rounded-full px-2 py-1",
//             listing.status === "active" && "bg-green-500/20",
//             listing.status === "sold" && "bg-blue-500/20",
//             listing.status === "draft" && "bg-yellow-500/20",
//             listing.status === "pending" && "bg-orange-500/20",
//           )}
//         >
//           <Text
//             className={clsx(
//               "text-xs font-medium",
//               listing.status === "active" && "text-green-600",
//               listing.status === "sold" && "text-blue-600",
//               listing.status === "draft" && "text-yellow-600",
//               listing.status === "pending" && "text-orange-600",
//             )}
//           >
//             {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
//           </Text>
//         </View>
//         <Text className="text-xs text-muted-foreground">
//           {formatTimeAgo(listing.updatedAt)}
//         </Text>
//       </View>
//     </View>
//   </TouchableOpacity>
// );

// const FavouriteItem = ({
//   listing,
//   onPress,
// }: {
//   listing: FavouriteListing;
//   onPress: () => void;
// }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     className="mb-3 overflow-hidden rounded-xl border border-border bg-card active:opacity-90"
//   >
//     <View className="flex-row">
//       <Image
//         source={{ uri: listing.images[0] || "https://placehold.co/100" }}
//         className="h-16 w-16"
//       />
//       <View className="flex-1 p-3">
//         <Text className="mb-1 font-semibold text-foreground" numberOfLines={1}>
//           {listing.title}
//         </Text>
//         <Text className="font-bold text-primary">
//           ₹{listing.price.toLocaleString()}
//         </Text>
//       </View>
//       <TouchableOpacity className="p-3">
//         <Ionicons name="heart" size={20} color="#EF4444" />
//       </TouchableOpacity>
//     </View>
//   </TouchableOpacity>
// );

// const GarageCarItem = ({ car }: { car: GarageCar }) => (
//   <View className="mb-3 overflow-hidden rounded-xl border border-border bg-card">
//     <Image
//       source={{ uri: car.image || "https://placehold.co/200" }}
//       className="h-32 w-full"
//       resizeMode="cover"
//     />
//     <View className="p-3">
//       <View className="flex-row items-center justify-between">
//         <Text className="font-semibold text-foreground">
//           {car.year} {car.make} {car.model}
//         </Text>
//         {car.isOwned && (
//           <View className="rounded-full bg-green-500/20 px-2 py-1">
//             <Text className="text-xs font-medium text-green-600">Owned</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   </View>
// );

// const SectionHeader = ({
//   title,
//   action,
//   actionText,
// }: {
//   title: string;
//   action?: () => void;
//   actionText?: string;
// }) => (
//   <View className="mb-3 mt-6 flex-row items-center justify-between">
//     <Text className="text-lg font-bold text-foreground">{title}</Text>
//     {action && (
//       <TouchableOpacity onPress={action}>
//         <Text className="font-medium text-primary">{actionText}</Text>
//       </TouchableOpacity>
//     )}
//   </View>
// );

// const EmptyState = ({
//   title,
//   message,
//   icon,
//   action,
//   actionText,
// }: {
//   title: string;
//   message: string;
//   icon: string;
//   action?: () => void;
//   actionText?: string;
// }) => (
//   <View className="items-center rounded-xl border border-border bg-card p-6">
//     <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-muted">
//       <Ionicons name={icon} size={28} color="#9CA3AF" />
//     </View>
//     <Text className="mb-1 text-center text-lg font-semibold text-foreground">
//       {title}
//     </Text>
//     <Text className="mb-4 text-center text-muted-foreground">{message}</Text>
//     {action && (
//       <TouchableOpacity
//         onPress={action}
//         className="rounded-lg bg-primary px-4 py-2"
//       >
//         <Text className="font-medium text-foreground">{actionText}</Text>
//       </TouchableOpacity>
//     )}
//   </View>
// );

// export default function ProfileScreen() {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState<
//     "listings" | "favourites" | "garage"
//   >("listings");
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const { data: session } = authClient.useSession();

//   const { data: userStats } = useQuery(trpc.user.stats.queryOptions());

//   const { data: userListings = [], refetch: refetchListings } = useQuery(
//     trpc.user.listings.queryOptions(),
//   );

//   const { data: favouriteListings = [], refetch: refetchFavourites } = useQuery(
//     trpc.user.favourites.queryOptions(),
//   );

//   const { data: garageCars = [], refetch: refetchGarage } = useQuery(
//     trpc.user.garage.queryOptions(),
//   );

//   const logout = async () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: async () => {
//           await authClient.signOut();
//           router.replace("/");
//         },
//       },
//     ]);
//   };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await Promise.all([
//       queryClient.invalidateQueries(trpc.user.stats.pathFilter()),
//       queryClient.invalidateQueries(trpc.user.listings.pathFilter()),
//       queryClient.invalidateQueries(trpc.user.favourites.pathFilter()),
//       queryClient.invalidateQueries(trpc.user.garage.pathFilter()),
//     ]);
//     setIsRefreshing(false);
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "listings":
//         return userListings.length > 0 ? (
//           <View>
//             {userListings.map((listing) => (
//               <ListingItem
//                 key={listing.id}
//                 listing={listing}
//                 onPress={() => router.push(`/listings/${listing.id}`)}
//               />
//             ))}
//           </View>
//         ) : (
//           <EmptyState
//             title="No Listings"
//             message="You haven't created any listings yet"
//             icon="pricetag-outline"
//             action={() => router.push("/listings/new")}
//             actionText="Create Listing"
//           />
//         );

//       case "favourites":
//         return favouriteListings.length > 0 ? (
//           <View>
//             {favouriteListings.map((listing) => (
//               <FavouriteItem
//                 key={listing.id}
//                 listing={listing}
//                 onPress={() => router.push(`/listings/${listing.id}`)}
//               />
//             ))}
//           </View>
//         ) : (
//           <EmptyState
//             title="No Favourites"
//             message="Your favourite listings will appear here"
//             icon="heart-outline"
//           />
//         );

//       case "garage":
//         return garageCars.length > 0 ? (
//           <View>
//             {garageCars.map((car) => (
//               <GarageCarItem key={car.id} car={car} />
//             ))}
//           </View>
//         ) : (
//           <EmptyState
//             title="Empty Garage"
//             message="Add your cars to your garage collection"
//             icon="car-outline"
//             action={() => router.push("/profile/garage/add")}
//             actionText="Add Car"
//           />
//         );
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={handleRefresh}
//             tintColor="#1DA1F2"
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="px-4 pt-2">
//           {/* Header */}
//           <ProfileHeader
//             user={session?.user || null}
//             onEdit={() => router.push("/profile/edit")}
//           />

//           {/* Stats */}
//           <View className="mb-6 flex-row gap-3">
//             <StatCard
//               title="Listings"
//               value={userStats?.listingsCount || 0}
//               icon="pricetag-outline"
//               onPress={() => setActiveTab("listings")}
//             />
//             <StatCard
//               title="Favourites"
//               value={userStats?.favouritesCount || 0}
//               icon="heart-outline"
//               onPress={() => setActiveTab("favourites")}
//             />
//           </View>

//           {/* Garage Preview */}
//           <SectionHeader
//             title="My Garage"
//             action={() => router.push("/profile/garage")}
//             actionText="View All"
//           />

//           {garageCars.length > 0 ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {garageCars.slice(0, 3).map((car) => (
//                 <View key={car.id} className="mr-3">
//                   <Image
//                     source={{ uri: car.image || "https://placehold.co/100" }}
//                     className="h-24 w-24 rounded-lg"
//                   />
//                   <Text
//                     className="mt-1 text-center text-xs text-foreground"
//                     numberOfLines={1}
//                   >
//                     {car.make} {car.model}
//                   </Text>
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <TouchableOpacity
//               onPress={() => router.push("/profile/garage/add")}
//               className="items-center rounded-xl border border-border bg-card p-6"
//             >
//               <Ionicons name="add-circle-outline" size={32} color="#1DA1F2" />
//               <Text className="mt-2 font-medium text-primary">Add Car</Text>
//             </TouchableOpacity>
//           )}

//           {/* Tabs */}
//           <View className="mb-4 mt-6 flex-row rounded-lg bg-muted p-1">
//             <TouchableOpacity
//               onPress={() => setActiveTab("listings")}
//               className={clsx(
//                 "flex-1 items-center rounded-md py-2",
//                 activeTab === "listings" && "bg-background shadow-sm",
//               )}
//             >
//               <Text
//                 className={clsx(
//                   "font-medium",
//                   activeTab === "listings"
//                     ? "text-foreground"
//                     : "text-muted-foreground",
//                 )}
//               >
//                 My Listings
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setActiveTab("favourites")}
//               className={clsx(
//                 "flex-1 items-center rounded-md py-2",
//                 activeTab === "favourites" && "bg-background shadow-sm",
//               )}
//             >
//               <Text
//                 className={clsx(
//                   "font-medium",
//                   activeTab === "favourites"
//                     ? "text-foreground"
//                     : "text-muted-foreground",
//                 )}
//               >
//                 Favourites
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setActiveTab("garage")}
//               className={clsx(
//                 "flex-1 items-center rounded-md py-2",
//                 activeTab === "garage" && "bg-background shadow-sm",
//               )}
//             >
//               <Text
//                 className={clsx(
//                   "font-medium",
//                   activeTab === "garage"
//                     ? "text-foreground"
//                     : "text-muted-foreground",
//                 )}
//               >
//                 Garage
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Content */}
//           {renderContent()}

//           {/* Logout */}
//           <TouchableOpacity
//             onPress={logout}
//             className="mb-4 mt-8 flex-row items-center justify-center rounded-lg bg-destructive/10 px-6 py-4"
//           >
//             <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//             <Text className="ml-2 font-semibold text-destructive">Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";

import { authClient } from "~/utils/auth";

// Mock Data
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  image: "https://placehold.co/400x400/1DA1F2/white?text=AJ",
};

const mockStats = {
  listingsCount: 12,
  favouritesCount: 8,
  garageCount: 3,
};

const mockListings = [
  {
    id: "1",
    title: "Garrett GT2860RS Turbo Kit",
    price: 45000,
    images: ["https://placehold.co/400x300/1DA1F2/white?text=Turbo"],
    status: "active" as const,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    title: "BC Racing BR Coilovers",
    price: 28000,
    images: ["https://placehold.co/400x300/10B981/white?text=Coilovers"],
    status: "sold" as const,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    title: "AEM FIC Fuel Injectors",
    price: 15000,
    images: ["https://placehold.co/400x300/F59E0B/white?text=Fuel"],
    status: "draft" as const,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 259200000),
  },
];

const mockFavourites = [
  {
    id: "101",
    title: "HKS Hi-Power Exhaust",
    price: 32000,
    images: ["https://placehold.co/400x300/8B5CF6/white?text=Exhaust"],
    createdAt: new Date(Date.now() - 432000000),
  },
  {
    id: "102",
    title: "TEIN Flex Z Coilovers",
    price: 38000,
    images: ["https://placehold.co/400x300/EC4899/white?text=TEIN"],
    createdAt: new Date(Date.now() - 345600000),
  },
  {
    id: "103",
    title: "APEXi S-AFC NEO",
    price: 18000,
    images: ["https://placehold.co/400x300/06B6D4/white?text=APEXi"],
    createdAt: new Date(Date.now() - 259200000),
  },
];

const mockGarage = [
  {
    id: "201",
    make: "Mazda",
    model: "RX-7",
    year: 2002,
    image: "https://placehold.co/400x300/EF4444/white?text=RX-7",
    isOwned: true,
  },
  {
    id: "202",
    make: "Nissan",
    model: "350Z",
    year: 2005,
    image: "https://placehold.co/400x300/F97316/white?text=350Z",
    isOwned: false,
  },
  {
    id: "203",
    make: "Subaru",
    model: "WRX STI",
    year: 2011,
    image: "https://placehold.co/400x300/10B981/white?text=STI",
    isOwned: true,
  },
];

// Components
const ProfileHeader = ({
  user,
  onEdit,
}: {
  user: { name: string; email: string; image: string | null } | null;
  onEdit: () => void;
}) => (
  <View className="mb-6 flex-row items-center">
    {user?.image ? (
      <Image source={{ uri: user.image }} className="h-16 w-16 rounded-full" />
    ) : (
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Text className="text-2xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </Text>
      </View>
    )}

    <View className="ml-4 flex-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground" numberOfLines={1}>
          {user?.name || "User"}
        </Text>
        {/*<TouchableOpacity onPress={onEdit} className="p-2">
          <Ionicons name="create-outline" size={20} color="#1DA1F2" />
        </TouchableOpacity>*/}
      </View>
      <Text className="text-muted-foreground" numberOfLines={1}>
        {user?.email}
      </Text>
    </View>
  </View>
);

const StatCard = ({
  title,
  value,
  icon,
  onPress,
}: {
  title: string;
  value: string | number;
  icon: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={clsx(
      "flex-1 rounded-xl border border-border bg-card p-4",
      onPress && "active:opacity-80",
    )}
  >
    <View className="mb-2 flex-row items-center">
      <Ionicons name={icon} size={20} color="#1DA1F2" />
      <Text className="ml-2 text-sm text-muted-foreground">{title}</Text>
    </View>
    <Text className="text-2xl font-bold text-foreground">{value}</Text>
  </TouchableOpacity>
);

const ListingItem = ({
  listing,
  onPress,
}: {
  listing: (typeof mockListings)[0];
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-3 flex-row overflow-hidden rounded-xl border border-border bg-card active:opacity-90"
  >
    <Image
      source={{ uri: listing.images[0] || "https://placehold.co/100" }}
      className="h-20 w-20"
    />
    <View className="flex-1 p-3">
      <Text className="mb-1 font-semibold text-foreground" numberOfLines={1}>
        {listing.title}
      </Text>
      <Text className="mb-2 font-bold text-primary">
        ₹{listing.price.toLocaleString()}
      </Text>
      <View className="flex-row items-center justify-between">
        <View
          className={clsx(
            "rounded-full px-2 py-1",
            listing.status === "active" && "bg-green-500/20",
            listing.status === "sold" && "bg-blue-500/20",
            listing.status === "draft" && "bg-yellow-500/20",
            listing.status === "pending" && "bg-orange-500/20",
          )}
        >
          <Text
            className={clsx(
              "text-xs font-medium",
              listing.status === "active" && "text-green-600",
              listing.status === "sold" && "text-blue-600",
              listing.status === "draft" && "text-yellow-600",
              listing.status === "pending" && "text-orange-600",
            )}
          >
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground">
          {formatTimeAgo(listing.updatedAt)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const FavouriteItem = ({
  listing,
  onPress,
}: {
  listing: (typeof mockFavourites)[0];
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-3 overflow-hidden rounded-xl border border-border bg-card active:opacity-90"
  >
    <View className="flex-row">
      <Image
        source={{ uri: listing.images[0] || "https://placehold.co/100" }}
        className="h-16 w-16"
      />
      <View className="flex-1 p-3">
        <Text className="mb-1 font-semibold text-foreground" numberOfLines={1}>
          {listing.title}
        </Text>
        <Text className="font-bold text-primary">
          ₹{listing.price.toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity className="p-3">
        <Ionicons name="heart" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const GarageCarItem = ({ car }: { car: (typeof mockGarage)[0] }) => (
  <View className="mb-3 overflow-hidden rounded-xl border border-border bg-card">
    <Image
      source={{ uri: car.image || "https://placehold.co/200" }}
      className="h-32 w-full"
      resizeMode="cover"
    />
    <View className="p-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-foreground">
          {car.year} {car.make} {car.model}
        </Text>
        {car.isOwned && (
          <View className="rounded-full bg-green-500/20 px-2 py-1">
            <Text className="text-xs font-medium text-green-600">Owned</Text>
          </View>
        )}
      </View>
    </View>
  </View>
);

const SectionHeader = ({
  title,
  action,
  actionText,
}: {
  title: string;
  action?: () => void;
  actionText?: string;
}) => (
  <View className="mb-3 mt-6 flex-row items-center justify-between">
    <Text className="text-lg font-bold text-foreground">{title}</Text>
    {action && (
      <TouchableOpacity onPress={action}>
        <Text className="font-medium text-primary">{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const EmptyState = ({
  title,
  message,
  icon,
  action,
  actionText,
}: {
  title: string;
  message: string;
  icon: string;
  action?: () => void;
  actionText?: string;
}) => (
  <View className="items-center rounded-xl border border-border bg-card p-6">
    <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <Ionicons name={icon} size={28} color="#9CA3AF" />
    </View>
    <Text className="mb-1 text-center text-lg font-semibold text-foreground">
      {title}
    </Text>
    <Text className="mb-4 text-center text-muted-foreground">{message}</Text>
    {action && (
      <TouchableOpacity
        onPress={action}
        className="rounded-lg bg-primary px-4 py-2"
      >
        <Text className="font-medium text-foreground">{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Helper function
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return "Just now";
};

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "listings" | "favourites" | "garage"
  >("favourites");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: session } = authClient.useSession();

  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await authClient.signOut();
          router.replace("/");
        },
      },
    ]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "listings":
        return mockListings.length > 0 ? (
          <View>
            {mockListings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing}
                onPress={() => router.push(`/listings/${listing.id}`)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No Listings"
            message="You haven't created any listings yet"
            icon="pricetag-outline"
            action={() => router.push("/listings/new")}
            actionText="Create Listing"
          />
        );

      case "favourites":
        return mockFavourites.length > 0 ? (
          <View>
            {mockFavourites.map((listing) => (
              <FavouriteItem
                key={listing.id}
                listing={listing}
                onPress={() => router.push(`/listings/${listing.id}`)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No Favourites"
            message="Your favourite listings will appear here"
            icon="heart-outline"
          />
        );

      case "garage":
        return mockGarage.length > 0 ? (
          <View>
            {mockGarage.map((car) => (
              <GarageCarItem key={car.id} car={car} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="Empty Garage"
            message="Add your cars to your garage collection"
            icon="car-outline"
            action={() => router.push("/profile/garage/add")}
            actionText="Add Car"
          />
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-2">
          {/* Header */}
          <ProfileHeader
            user={session?.user || mockUser}
            onEdit={() => router.push("/profile/edit")}
          />

          {/* Logout */}
          <TouchableOpacity
            onPress={logout}
            className="mb-4 mt-8 flex-row items-center justify-center rounded-lg bg-destructive/10 px-6 py-4"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="ml-2 font-semibold text-destructive">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

{
  /* Stats */
}
<View className="mb-6 flex-row gap-3">
  <StatCard
    title="Listings"
    value={mockStats.listingsCount}
    icon="pricetag-outline"
    onPress={() => setActiveTab("listings")}
  />
  <StatCard
    title="Favourites"
    value={mockStats.favouritesCount}
    icon="heart-outline"
    onPress={() => setActiveTab("favourites")}
  />
</View>;

{
  /* Garage Preview */
}
<SectionHeader
  title="My Garage"
  action={() => router.push("/profile/garage")}
  actionText="View All"
/>;

{
  mockGarage.length > 0 ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {mockGarage.slice(0, 3).map((car) => (
        <View key={car.id} className="mr-3">
          <Image
            source={{ uri: car.image || "https://placehold.co/100" }}
            className="h-24 w-24 rounded-lg"
          />
          <Text
            className="mt-1 text-center text-xs text-foreground"
            numberOfLines={1}
          >
            {car.make} {car.model}
          </Text>
        </View>
      ))}
    </ScrollView>
  ) : (
    <TouchableOpacity
      onPress={() => router.push("/profile/garage/add")}
      className="items-center rounded-xl border border-border bg-card p-6"
    >
      <Ionicons name="add-circle-outline" size={32} color="#1DA1F2" />
      <Text className="mt-2 font-medium text-primary">Add Car</Text>
    </TouchableOpacity>
  );
}

// {/* Tabs */}
// <View className="mb-4 mt-6 flex-row rounded-lg bg-muted/50 p-1">
//   <TouchableOpacity
//     onPress={() => setActiveTab("listings")}
//     className={clsx(
//       "flex-1 items-center rounded-md py-2",
//       activeTab === "listings" && "bg-background shadow-sm",
//     )}
//   >
//     <Text
//       className={clsx(
//         "font-medium",
//         activeTab === "listings"
//           ? "text-foreground"
//           : "text-muted-foreground",
//       )}
//     >
//       My Listings
//     </Text>
//   </TouchableOpacity>

//   <TouchableOpacity
//     onPress={() => setActiveTab("favourites")}
//     className={clsx(
//       "flex-1 items-center rounded-md py-2",
//       activeTab === "favourites" && "bg-background shadow-sm",
//     )}
//   >
//     <Text
//       className={clsx(
//         "font-medium",
//         activeTab === "favourites"
//           ? "text-foreground"
//           : "text-muted-foreground",
//       )}
//     >
//       Favourites
//     </Text>
//   </TouchableOpacity>

//   <TouchableOpacity
//     onPress={() => setActiveTab("garage")}
//     className={clsx(
//       "flex-1 items-center rounded-md py-2",
//       activeTab === "garage" && "bg-background shadow-sm",
//     )}
//   >
//     <Text
//       className={clsx(
//         "font-medium",
//         activeTab === "garage"
//           ? "text-foreground"
//           : "text-muted-foreground",
//       )}
//     >
//       Garage
//     </Text>
//   </TouchableOpacity>
// </View>

// {/* Content */}
// {renderContent()}
