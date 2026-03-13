"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, CreditCard, Users, Calendar } from "lucide-react";

type Props = { mode?: "landing" | "results" };

export function SearchBar({ mode = "landing" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters to keep search persistent
  const [query, setQuery] = useState({
    campus: searchParams.get("campus") ?? "",
    min: searchParams.get("min") ?? "",
    max: searchParams.get("max") ?? "",
    gender: searchParams.get("gender") ?? "",
    date: searchParams.get("date") ?? "",
  });

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (query.campus) params.append("campus", query.campus);
    if (query.min) params.append("min", query.min);
    if (query.max) params.append("max", query.max);
    if (query.gender) params.append("gender", query.gender);
    if (query.date) params.append("date", query.date);

    router.push(`/search?${params.toString()}`);
  };

  // Wrapper styling based on mode
  const wrapperClass = mode === "landing" 
    ? "max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-2 border-none" 
    : "w-full bg-white rounded-xl shadow-sm border border-slate-200 p-2";

  return (
    <form 
      onSubmit={handleSearch} 
      className={`flex flex-col lg:flex-row items-center gap-2 ${wrapperClass}`}
      aria-label="Find hostels"
    >
      {/* CAMPUS INPUT */}
      <div className="flex-[1.5] flex items-center gap-3 px-4 py-3 border-r border-slate-100 w-full">
        <MapPin className="text-blue-600" size={20} />
        <input 
          type="text" 
          placeholder="Campus or City (e.g. KNUST)" 
          className="w-full outline-none font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium"
          value={query.campus}
          onChange={(e) => setQuery({...query, campus: e.target.value})}
        />
      </div>

      {/* PRICE RANGE (MIN/MAX) */}
      <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-slate-100 w-full">
        <CreditCard className="text-slate-400" size={20} />
        <div className="flex items-center gap-1 w-full">
          <input 
            type="number" 
            placeholder="Min" 
            className="w-full outline-none font-bold text-slate-700 text-sm"
            value={query.min}
            onChange={(e) => setQuery({...query, min: e.target.value})}
          />
          <span className="text-slate-300">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            className="w-full outline-none font-bold text-slate-700 text-sm"
            value={query.max}
            onChange={(e) => setQuery({...query, max: e.target.value})}
          />
        </div>
      </div>

      {/* GENDER SELECT */}
      <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-slate-100 w-full">
        <Users className="text-slate-400" size={20} />
        <select 
          className="w-full outline-none font-bold text-slate-700 bg-transparent cursor-pointer"
          value={query.gender}
          onChange={(e) => setQuery({...query, gender: e.target.value})}
        >
          <option value="">Any Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      {/* DATE INPUT */}
      <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-slate-100 w-full lg:min-w-[180px]">
        <Calendar className="text-slate-400" size={20} />
        <input 
          type="date" 
          className="w-full outline-none font-bold text-slate-700 text-sm cursor-pointer"
          value={query.date}
          onChange={(e) => setQuery({...query, date: e.target.value})}
        />
      </div>

      {/* SEARCH BUTTON */}
      <button 
        type="submit" 
        className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap shadow-lg shadow-blue-100"
      >
        <Search size={20} /> Search Now
      </button>
    </form>
  );
}