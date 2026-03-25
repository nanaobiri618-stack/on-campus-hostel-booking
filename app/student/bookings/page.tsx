"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, CreditCard, Clock, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/hostels" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-black text-slate-900 uppercase">My Bookings</h1>
          </div>
          <Link href="/hostels" className="text-sm font-bold text-blue-600 hover:underline">
            Find More Hostels
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 py-10 flex-1">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <CreditCard size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No Bookings Yet</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">You haven't applied for or booked any hostels yet.</p>
            <Link href="/hostels" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-200">
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Hostel</p>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                        {booking.hostel?.name}
                      </h3>
                      <p className="text-sm text-slate-400 font-bold">{booking.hostel?.location}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Verification ID</span>
                      <span className="font-mono font-black text-slate-900">{booking.verificationId || 'PENDING'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Amount Paid</span>
                      <span className="font-black text-slate-900">GH₵ {booking.amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Payment Method</span>
                      <span className="font-bold text-slate-700">{booking.telecom?.toUpperCase() || 'N/A'} ({booking.paymentPhone || 'N/A'})</span>
                    </div>
                  </div>

                  {booking.status === 'APPLIED' ? (
                    <Link 
                      href={`/hostels/${booking.hostelId}`}
                      className="w-full inline-block bg-blue-600 text-white py-4 rounded-xl text-center font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                      Complete Payment
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs justify-center pt-2">
                      <CheckCircle2 size={16} /> 
                      {booking.status === 'PAID' ? 'Awaiting Owner Verification' : 'Verified & Confirmed'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        &copy; 2026 HostelHub Official Student Console
      </footer>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    APPLIED: "bg-blue-100 text-blue-600",
    PAID: "bg-amber-100 text-amber-600",
    VERIFIED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
  };

  const icons = {
    APPLIED: <Clock size={14} />,
    PAID: <AlertCircle size={14} />,
    VERIFIED: <CheckCircle2 size={14} />,
    CANCELLED: <AlertCircle size={14} />,
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${styles[status as keyof typeof styles]}`}>
      {icons[status as keyof typeof icons]} {status}
    </div>
  );
}
