"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, ShieldCheck, Heart, ArrowRight, ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

const HOSTELS = [
  {
    id: 1,
    name: "University Gardens",
    location: "Legon, Accra",
    price: "GH₵ 4,500 / year",
    rating: 4.8,
    image: "/hostels/luxury_hostel.png",
    description: "Premium student accommodation with high-speed internet and backup generator.",
    verified: true,
  },
  {
    id: 2,
    name: "Classic Student Lodge",
    location: "KNUST, Kumasi",
    price: "GH₵ 3,200 / year",
    rating: 4.5,
    image: "/hostels/modern_room.png",
    description: "Spacious rooms with study desks and close proximity to the main gate.",
    verified: true,
  },
  {
    id: 3,
    name: "The Hub Residence",
    location: "Cape Coast University",
    price: "GH₵ 2,800 / semester",
    rating: 4.2,
    image: "/hostels/common_area.png",
    description: "Vibrant community area and 24/7 security for all students.",
    verified: false,
  },
];

export default function HostelsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session').then(res => res.json()).then(data => {
      if (data.user) setUser(data.user);
    });

    fetch('/api/hostels')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHostels(data);
        } else {
          console.error("Failed to fetch hostels:", data);
          setHostels([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setHostels([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredHostels = hostels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.university && h.university.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Verification Warning Banner */}
      {user && user.role === 'TENANT' && !user.isVerified && (
        <div className="bg-amber-500 text-white px-4 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 animate-slide-down sticky top-0 z-50 shadow-lg">
          <ShieldAlert size={18} />
          Verification Pending: You can browse hostels, but booking features are restricted until your hostel owner verifies your details.
        </div>
      )}

      {/* Header / Hero Section */}
      <section className="bg-blue-600 pt-32 pb-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Find Your Next Home</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 font-medium">
          Browse through verified hostels across the country's top universities.
        </p>
        
        <div className="max-w-xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or university..." 
            className="w-full h-14 pl-12 pr-4 rounded-2xl border-none shadow-xl text-slate-900 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Results Section */}
      <main className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">
            {searchTerm ? `Results for "${searchTerm}"` : 'Recommended Hostels'}
          </h2>
          <span className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-full border">
            {filteredHostels.length} Hostels found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
            ))
          ) : filteredHostels.map((hostel) => (
            <div key={hostel.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="relative h-64">
                <img 
                  src={(() => {
                    if (!hostel.images) return "/hostels/luxury_hostel.png";
                    if (hostel.images.includes('|DELIM|')) return hostel.images.split('|DELIM|')[0];
                    if (hostel.images.startsWith('data:')) return hostel.images; // Single Base64
                    if (hostel.images.includes(',')) return hostel.images.split(',')[0];
                    return hostel.images;
                  })()} 
                  alt={hostel.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/hostels/luxury_hostel.png";
                  }}
                />
                <button className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white transition">
                  <Heart size={20} className="hover:text-red-500 transition-colors" />
                </button>
                {hostel.verified && (
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-500/40">
                    <ShieldCheck size={14} /> Verified
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-blue-600 flex items-center gap-1">
                    <MapPin size={14} /> {hostel.location}
                  </p>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={14} fill="currentColor" /> 4.8
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                    hostel.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 
                    hostel.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' : 
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {hostel.gender === 'MALE' ? 'Male Only' : hostel.gender === 'FEMALE' ? 'Female Only' : 'Mixed Gender'}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">{hostel.name}</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed truncate">
                  {hostel.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <p className="text-lg font-black text-slate-900">GH₵ {hostel.price}</p>
                  <Link 
                    href={`/hostels/${hostel.id}`}
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:gap-2 transition-all"
                  >
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHostels.length === 0 && (
          <div className="text-center py-20">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No hostels found</h3>
            <p className="text-slate-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}