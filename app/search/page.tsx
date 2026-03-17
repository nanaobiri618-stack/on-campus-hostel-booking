"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { SearchX, Database, MapPin } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { mockHostels } from "../../lib/data-source"; 
import type { SearchQuery, Hostel } from "./types";

// --- SEARCH ALGORITHM LOGIC ---
export async function getFilteredHostels(q: SearchQuery, rawData: Hostel[]): Promise<Hostel[]> {
  let data = [...rawData];

  if (q.campus) {
    const c = q.campus.toLowerCase();
    data = data.filter(
      (h) =>
        h.name.toLowerCase().includes(c) ||
        (h.university && h.university.name.toLowerCase().includes(c)) ||
        (h.location && h.location.toLowerCase().includes(c))
    );
  }

  if (q.min) {
    const minVal = Number(q.min);
    if (!isNaN(minVal)) data = data.filter((h) => Number(h.price) >= minVal);
  }

  if (q.gender && q.gender !== "") {
    data = data.filter(
      (h) => h.gender === q.gender || h.gender === "mixed"
    );
  }

  return data.sort((a, b) => Number(a.price) - Number(b.price));
}

export default function SearchResultsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- FETCH FROM DATABASE LOGIC ---
  async function fetchHostels() {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/hostels');
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Database connection failed");
      }
      const data = await response.json();
      
      // If database is empty, we fall back to mockHostels for testing, 
      // otherwise we use the real database data.
      const sourceData = (Array.isArray(data) && data.length > 0) ? data : (mockHostels as any[] as Hostel[]);
      setHostels(sourceData);
    } catch (err) {
      console.error("Database error:", err);
      setError(true);
      // Fallback to mock data so the site doesn't "break" during dev
      setHostels(mockHostels as any[] as Hostel[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchHostels();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 animate-fade-in">
      {/* HEADER & SEARCHBAR */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Search Results</h1>
            <p className="text-slate-500 font-medium">
              {loading ? "Accessing database..." : `Found ${hostels.length} hostels available`}
            </p>
          </div>
          {error && (
            <div className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-lg border border-amber-100 font-bold">
              ⚠️ Database Offline: Showing Cached Data
            </div>
          )}
        </div>
        
        <Suspense fallback={<div className="h-20 animate-pulse bg-slate-200 rounded-2xl" />}>
          <div className="glass-header p-4 rounded-2xl shadow-sm border border-white/20">
            <SearchBar mode="results" />
          </div>
        </Suspense>
      </div>

      {/* RESULTS LOGIC */}
      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : hostels.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((h) => (
            <HostelCard key={h.id} hostel={h} />
          ))}
        </div>
      ) : (
        /* NO FOUND IN DATABASE STATE */
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center animate-slide-up">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <SearchX size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No Found in Database</h2>
          <p className="text-slate-500 max-w-xs mt-2 font-medium">
            We couldn't find any hostels matching your criteria in our records.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="/" className="btn-primary px-8 py-3 text-sm">
              Clear All Filters
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-blue-600 transition"
            >
              <Database size={16} /> Refresh Connection
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// --- SUB-COMPONENT: HOSTEL CARD ---
function HostelCard({ hostel: h }: { hostel: Hostel }) {
  const images = typeof h.images === 'string' 
    ? h.images.split(',').map(s => s.trim()).filter(Boolean) 
    : (Array.isArray(h.images) ? h.images : []);
  
  const displayImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"];
  
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="hostel-card animate-slide-up group bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
         <div className="absolute inset-0 flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
           {displayImages.map((img, idx) => (
             <img 
               key={idx}
               src={img} 
               alt={`${h.name} - image ${idx + 1}`} 
               className="w-full h-full object-cover flex-shrink-0"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";
               }}
             />
           ))}
         </div>

         {displayImages.length > 1 && (
           <>
             <button 
               onClick={prevSlide}
               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 z-20"
             >
               ‹
             </button>
             <button 
               onClick={nextSlide}
               className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 z-20"
             >
               ›
             </button>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {displayImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`} 
                  />
                ))}
             </div>
           </>
         )}

         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 shadow-sm z-10">
            {h.university?.name || "Campus"}
         </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {h.name}
          </h3>
          <div className="text-right">
            <p className="text-blue-600 font-black text-xl leading-none">GHS {h.price}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-tighter font-black mt-1">Per Semester</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-bold">
           <span className="capitalize px-2 py-1 bg-slate-100 rounded-md">{h.gender || "Mixed"}</span>
           <span>•</span>
           <span className="flex items-center gap-1"><MapPin size={12}/> {h.location}</span>
        </div>
        
        <Link 
          href={`/hostels/${h.id}`} 
          className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-100"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}