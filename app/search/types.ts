// app/search/types.ts
export type SearchQuery = {
  campus?: string;
  min?: number;
  max?: number;
  gender?: "female" | "male" | "mixed" | "" | string;
  date?: string; // future use
};

export type University = {
  id: number;
  name: string;
  location?: string;
};

export type Hostel = {
  id: number;
  name: string;
  location: string;
  price: number;
  images?: string | string[];
  description?: string;
  verified?: boolean;
  gender?: "female" | "male" | "mixed";
  university?: University;
  campus?: string; // legacy support
  city?: string; // legacy support
};