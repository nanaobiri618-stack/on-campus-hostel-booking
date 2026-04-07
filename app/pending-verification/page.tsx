"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ShieldAlert, LogOut, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function PendingVerificationPage() {
  const [user, setUser] = useState<any>(null);
  const [statusChecked, setStatusChecked] = useState(false);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setStatusChecked(true);
      }
    } catch (err) {
      console.error("Failed to check status");
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (statusChecked && user?.isVerified) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center animate-scale-in">
          <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 size={40} />
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 mb-2">Verified!</h1>
          <p className="text-slate-500 font-medium mb-8">
            Your booking has been approved by the hostel owner. Welcome home!
          </p>

          <div className="bg-slate-900 text-white p-8 rounded-3xl mb-8 relative overflow-hidden group">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Your Assigned Room</p>
            <p className="text-4xl font-mono font-black tracking-tight">{user.roomNumber || "Processing..."}</p>
          </div>

          <Link 
            href="/hostels"
            className="w-full inline-block bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Start Discovering
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
        <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
          <Clock size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2">Verification Pending</h1>
        <p className="text-slate-500 font-medium mb-8">
          Your booking is currently under review by the hostel owner. 
          This process usually takes less than 24 hours.
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-left">
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border shadow-sm flex-shrink-0 text-blue-600">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">What happens next?</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Once the owner verifies your payment and details, they will assign you a room number which will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={checkStatus}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Check Status Again
          </button>
          
          <button 
            onClick={async () => {
              await fetch('/api/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 text-slate-500 font-bold py-3 hover:text-slate-900 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <p className="mt-8 text-slate-400 text-xs font-medium flex items-center justify-center gap-1">
          <MessageSquare size={14} /> Need help? Contact support at nanaobiri618@gmail.com
        </p>
      </div>
    </main>
  );
}

// Done
