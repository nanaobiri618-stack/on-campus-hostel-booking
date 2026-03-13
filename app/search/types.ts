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

// app/search/types.ts

export type Hostel = {
  id: number;
  slug: string;       // Added this!
  name: string;
  location?: string;  // Made this optional with '?'
  price: number;
  images?: string | string[];
  description?: string;
  verified?: boolean;
  gender?: "female" | "male" | "mixed";
  university?: University;
  campus?: string; 
  city?: string;   
};