// app/search/actions.ts
"use server";

import { mockHostels } from "../../lib/data-source";

// Defining the interface locally to ensure it matches your filtering logic
export interface Hostel {
  id: string | number;
  name: string;
  campus: string;
  city: string;
  price: number;
  gender: "male" | "female" | "mixed";
}

export interface SearchQuery {
  campus?: string;
  min?: string | number;
  max?: string | number;
  gender?: string;
  date?: string;
}

export async function getHostels(q: SearchQuery): Promise<Hostel[]> {
  // Cast mockHostels to the Hostel array to resolve property errors
  let data = mockHostels as Hostel[];

  if (q.campus) {
    const c = q.campus.toLowerCase();
    data = data.filter(
      (h) =>
        h.campus.toLowerCase().includes(c) ||
        h.city.toLowerCase().includes(c)
    );
  }

  // Convert potential string values from URL to Numbers safely
  if (q.min) {
    const minVal = typeof q.min === 'string' ? Number(q.min) : q.min;
    if (!isNaN(minVal)) data = data.filter((h) => h.price >= minVal);
  }
  
  if (q.max) {
    const maxVal = typeof q.max === 'string' ? Number(q.max) : q.max;
    if (!isNaN(maxVal)) data = data.filter((h) => h.price <= maxVal);
  }

  if (q.gender && q.gender !== "") {
    // Ensuring gender comparison works even if types are slightly off
    data = data.filter(
      (h) => h.gender === q.gender || h.gender === "mixed"
    );
  }

  return data.sort((a, b) => a.price - b.price);
}