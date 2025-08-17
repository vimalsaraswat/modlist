import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import FilterModal from "~/components/listings/home/filter-modal";
import HeaderSection from "~/components/listings/home/header-section";
import ListingsSection from "~/components/listings/home/listings-section";
import { trpc } from "~/utils/api";

const LIMIT = 20;

const HomeScreen = () => {
  const [searchText, setSearchText] = useState("");

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>([]); // Multi-select
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery(
    trpc.listing.categoryList.queryOptions(),
  );
  const { data: makes = [] } = useQuery(trpc.listing.makeList.queryOptions());
  const { data: cities = [] } = useQuery(trpc.listing.cityList.queryOptions());

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.listing.list.infiniteQueryOptions(
      {
        limit: LIMIT,
        keyword: searchText.length > 0 ? searchText : undefined,

        categoryId:
          selectedCategoryIds.length > 0 ? selectedCategoryIds[0] : undefined,
        makeId: selectedMakeId ?? undefined,
        modelId: selectedModelId ?? undefined,
        cityId: selectedCityIds.length > 0 ? selectedCityIds[0] : undefined,

        priceMin: minPrice ? Number(minPrice) : undefined,
        priceMax: maxPrice ? Number(maxPrice) : undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
    ),
  );

  const listings = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefetching(true);
    await refetch();
    await queryClient.invalidateQueries(trpc.listing.byId.queryFilter());
    setIsRefetching(false);
  }, [refetch, queryClient]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const clearFilters = useCallback(() => {
    setSearchText("");
    setSelectedCategoryIds([]);
    setSelectedMakeId(null);
    setSelectedModelId(null);
    setSelectedCityIds([]);
    setMinPrice("");
    setMaxPrice("");
  }, []);

  const applyFilters = useCallback(
    (newFilters: {
      categoryIds: number[];
      makeId: number | null;
      modelId: number | null;
      cityIds: number[];
      minPrice: string;
      maxPrice: string;
    }) => {
      setSelectedCategoryIds(newFilters.categoryIds);
      setSelectedMakeId(newFilters.makeId);
      setSelectedModelId(newFilters.modelId);
      setSelectedCityIds(newFilters.cityIds);
      setMinPrice(newFilters.minPrice);
      setMaxPrice(newFilters.maxPrice);
      setShowFilterModal(false);
    },
    [],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      void refetch();
    }, 500);

    return () => clearTimeout(handler);
  }, [
    searchText,
    minPrice,
    maxPrice,
    selectedCategoryIds,
    selectedMakeId,
    selectedModelId,
    selectedCityIds,
    refetch,
  ]);

  return (
    <SafeAreaView className="flex-1 bg-background pb-10">
      <HeaderSection
        searchText={searchText}
        onSearchChange={setSearchText}
        onFilterPress={() => setShowFilterModal(true)}
        selectedCategories={selectedCategoryIds}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onClearFilters={clearFilters}
        categories={categories}
        onRemoveCategory={(id) =>
          setSelectedCategoryIds((prev) => prev.filter((catId) => catId !== id))
        }
        onRemovePriceFilter={() => {
          setMinPrice("");
          setMaxPrice("");
        }}
      />

      <ListingsSection
        listings={listings}
        isLoading={isPending && !isRefetching}
        isError={!!error}
        isEmpty={listings.length === 0 && !isPending}
        isRefetching={isRefetching}
        isFetchingNextPage={isFetchingNextPage}
        onRefresh={handleRefresh}
        onLoadMore={loadMore}
        onRetry={handleRefresh}
      />

      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <FilterModal
          categories={categories}
          makes={makes}
          cities={cities}
          selectedCategoryIds={selectedCategoryIds}
          selectedMakeId={selectedMakeId}
          selectedModelId={selectedModelId}
          selectedCityIds={selectedCityIds}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onClose={() => setShowFilterModal(false)}
          onApply={applyFilters}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
