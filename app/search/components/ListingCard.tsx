// app/search/components/ListingCard.tsx
import Link from "next/link";
import { Hostel } from "../types";

export function ListingCard({ hostel }: { hostel: Hostel }) {
  return (
    <article className="overflow-hidden rounded-lg border transition hover:shadow-md">
      <div className="h-40 w-full bg-gray-100 overflow-hidden">
        <img 
          src={hostel.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"} 
          alt={hostel.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">{hostel.name}</h3>
        <p className="text-sm text-gray-600">
          Near {hostel.university?.name || "Campus"} • {hostel.location}
        </p>

        <p className="text-sm">
          <span className="font-semibold">GHS {hostel.price}</span> / semester
        </p>

        <div className="text-xs text-gray-500">
          {hostel.verified ? "✔ Verified" : "—"} •{" "}
          {hostel.gender === "mixed" ? "Mixed" : hostel.gender}
        </div>

        <Link
          href={`/hostels/${hostel.id}`}
          className="inline-block rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          View & Book
        </Link>
      </div>
    </article>
  );
}