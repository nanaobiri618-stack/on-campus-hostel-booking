"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        
        <Link href="/" className="text-xl font-black tracking-tight text-blue-600">
          On Campus <span className="text-slate-900">Ghana</span>
        </Link>

        <nav className="hidden gap-8 md:flex text-sm font-bold uppercase tracking-wider text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/search" className="hover:text-blue-600 transition">Browse Hostels</Link>
          {user?.role === 'OWNER' && (
            <Link href="/owner/dashboard" className="hover:text-blue-600 transition">My Listings</Link>
          )}
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-900 leading-none">{user.name || user.email}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="rounded-full border-2 border-red-100 px-5 py-2 text-sm font-bold text-red-500 hover:bg-red-50 hover:border-red-200 transition active:scale-95"
              >
                Log Out
              </button>
              {user.role === 'TENANT' && (
                <>
                  <Link href="/hostels" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-tight">Discover</Link>
                  <Link href="/student/bookings" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-tight">My Bookings</Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">
                Log In
              </Link>

              <Link 
                href="/register"
                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
