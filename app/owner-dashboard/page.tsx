"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function OwnerDashboard() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder for fetching data later
  useEffect(() => {
    // We will connect this to an API soon
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Hostel Manager</h2>
        <nav className="space-y-4">
          <Link href="/owner-dashboard" className="block p-2 bg-blue-600 rounded">Dashboard</Link>
          <Link href="/owner-dashboard/my-hostels" className="block p-2 hover:bg-slate-800 rounded">My Hostels</Link>
          <Link href="/owner-dashboard/bookings" className="block p-2 hover:bg-slate-800 rounded">Bookings</Link>
          <Link href="/login" className="block p-2 text-red-400 hover:bg-slate-800 rounded mt-10">Logout</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Owner Dashboard</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            + Add New Hostel
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Total Hostels</p>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Active Students</p>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
        </div>

        {/* Hostels List Table */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Your Registered Hostels</h3>
          </div>
          <div className="p-6">
            {hostels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">You haven't added any hostels yet.</p>
                <p className="text-sm text-slate-400 mt-1">Click the "Add New Hostel" button to get started.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm border-b">
                    <th className="pb-3 font-medium">Hostel Name</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Rooms</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Data rows will go here */}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}