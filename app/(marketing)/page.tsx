"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { MapPin, Star, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import { SearchBar } from "../search/components/SearchBar";
import Link from 'next/link';

export default function LandingPage() {
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hostels')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHostels(data.slice(0, 3)); // Show top 3 featured
        }
      })
      .catch(err => console.error("Error fetching featured hostels:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[600px] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1523240715630-9917c1d474c7?auto=format&fit=crop&q=80&w=2070" 
          alt="Students studying"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-20 text-center animate-fade-in">
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Find Your Perfect Hostel—<span className="text-blue-400">Fast & Stress‑Free</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200">
            Search verified hostels by campus, budget, and preferences. Book securely and get real‑time updates across Ghana.
          </p>

          <div className="mt-10 w-full max-w-4xl">
            <Suspense fallback={<div className="h-16 w-full animate-pulse bg-white/20 rounded-xl" />}>
              <SearchBar mode="landing" />
            </Suspense>
            <p className="mt-4 text-sm text-slate-300">
              Popular: KNUST, Legon, Kumasi, or Sunyani.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FEATURED HOSTELS SECTION */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Featured Hostels</h2>
            <p className="text-slate-500">Top-rated student housing verified by our team.</p>
          </div>
          <Link href="/hostels" className="text-blue-600 font-bold hover:underline">View all hostels</Link>
        </div>
        
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hostels.map((h: any) => (
              <HostelCard key={h.id} hostel={h} />
            ))}
            {hostels.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed text-slate-400 font-bold">
                No featured hostels available right now.
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="font-bold text-slate-900">Smart Filters</h3>
          <p className="mt-2 text-sm text-slate-500">Filter by price, gender, and proximity to campus.</p>
        </div>
        <div className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Star size={24} />
          </div>
          <h3 className="font-bold text-slate-900">Instant Updates</h3>
          <p className="mt-2 text-sm text-slate-500">Track availability as it changes—stay ahead of the rush.</p>
        </div>
        <div className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
          <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-slate-900">Owner Tools</h3>
          <p className="mt-2 text-sm text-slate-500">Owners can list properties and receive payouts easily.</p>
        </div>
      </section>

      {/* 4. APP DOWNLOAD CTA */}
      <section
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-white p-8 shadow-sm"
        aria-label="Get the app"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900">Get the App</h2>
          <p className="text-sm text-slate-500">
            Manage bookings and alerts on the go. iOS and Android supported.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="#" className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm hover:bg-slate-800 transition">
             App Store
          </a>
          <a href="#" className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700 transition">
            ▶ Google Play
          </a>
        </div>
      </section>

      {/* 5. OWNER CTA */}
      <section
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-blue-600 p-8 shadow-lg shadow-blue-100"
        aria-label="List your hostel"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Are you a Hostel Owner?</h2>
          <p className="text-blue-100 text-sm">Join the platform and reach thousands of students.</p>
        </div>
        <div>
          <a
            href="/owner/dashboard"
            className="rounded-lg bg-white px-6 py-2.5 text-blue-600 text-sm font-bold hover:bg-blue-50 transition"
          >
            List Your Hostel
          </a>
        </div>
      </section>
    </main>
  );
}

// SUB-COMPONENT: HostelCard
function HostelCard({ hostel }: any) {
  return (
    <div className="hostel-card group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        <img 
          src={hostel.images || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"} 
          alt={hostel.name}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 shadow-sm z-10">
          {hostel.university?.name || "Campus"}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
          {hostel.name}
        </h3>
        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
          <MapPin size={14} className="text-slate-400" /> {hostel.location}
        </p>
        
        <div className="mt-6 flex items-center justify-between border-t pt-4 border-slate-50">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Price per year</p>
            <p className="text-xl font-black text-slate-900">GH₵ {hostel.price}</p>
          </div>
          <Link href={`/hostels/${hostel.id}`} className="btn-primary !px-4 !py-2 !text-xs flex items-center gap-1">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}