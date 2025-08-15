export interface ListingItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  makeId: number;
  modelId: number;
  category: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
}

// ~/types/api.ts

/**
 * Represents a category option fetched from the API.
 */
export interface Category {
  id: number;
  name: string;
  // Add other fields if your API returns them (e.g., description, slug)
}

/**
 * Represents a car make option fetched from the API.
 */
export interface Make {
  id: number;
  name: string;
  // Add other fields if your API returns them (e.g., logoUrl)
}

/**
 * Represents a car model option fetched from the API.
 * This is dependent on a selected Make.
 */
export interface Model {
  id: number;
  name: string;
  makeId: number; // Reference to the parent Make
  // Add other fields if your API returns them
}

/**
 * Represents a city option fetched from the API.
 */
export interface City {
  id: number;
  name: string;
  // Add other fields if your API returns them (e.g., state, country)
}

// You might also define types for API responses if needed
// export interface CategoryListResponse extends Array<Category> {}
// export interface MakeListResponse extends Array<Make> {}
// export interface ModelListResponse extends Array<Model> {}
// export interface CityListResponse extends Array<City> {}
