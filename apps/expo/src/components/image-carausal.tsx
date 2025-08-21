import type { ViewToken } from "react-native";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useThemeColors } from "~/styles/colors";

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

export default function ImageCarousel({
  images = [],
  height = 250,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [parentWidth, setParentWidth] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const modalFlatListRef = useRef<FlatList>(null);

  const colors = useThemeColors();
  const dotColor = colors.primary;
  const inactiveDotColor = colors.secondary;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0]?.index ?? 0);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const openModal = (index: number) => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleDotPress = (index: number) => {
    setActiveIndex(index);
    scrollToIndex(index);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable
      onPress={() => openModal(index)}
      style={{ width: parentWidth }} // ✅ each item matches parent width
    >
      <Image
        source={{ uri: item }}
        className="w-full rounded-lg"
        style={{ height }}
        resizeMode="cover"
      />
    </Pressable>
  );

  const renderModalItem = ({ item }: { item: string }) => (
    <ScrollView
      maximumZoomScale={3}
      minimumZoomScale={1}
      centerContent
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable onPress={closeModal}>
        <Image
          source={{ uri: item }}
          style={{ width: screenWidth, height: screenHeight }}
          resizeMode="contain"
        />
      </Pressable>
    </ScrollView>
  );

  if (images.length === 0) return null;

  return (
    <GestureHandlerRootView
      className="gap-2"
      onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}
    >
      {/* Carousel */}
      {parentWidth > 0 && (
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(_, idx) => idx.toString()}
          getItemLayout={(_, index) => ({
            length: parentWidth,
            offset: parentWidth * index,
            index,
          })}
        />
      )}

      {/* Dots */}
      {images.length > 1 && (
        <View className="mt-2 flex-row justify-center">
          {images.map((_, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleDotPress(idx)}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor:
                  idx === activeIndex ? dotColor : inactiveDotColor,
              }}
            />
          ))}
        </View>
      )}

      {/* Fullscreen Modal */}
      <Modal
        visible={isModalVisible}
        transparent={false}
        onRequestClose={closeModal}
        backdropColor={colors.secondary}
      >
        <FlatList
          ref={modalFlatListRef}
          data={images}
          renderItem={renderModalItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={activeIndex}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          keyExtractor={(_, idx) => idx.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / screenWidth,
            );
            setActiveIndex(index);
          }}
        />
      </Modal>
    </GestureHandlerRootView>
  );
}
