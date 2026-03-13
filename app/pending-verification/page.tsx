"use client";

import React from 'react';
import Link from 'next/link';
import { Clock, ShieldAlert, LogOut, MessageSquare } from 'lucide-react';

export default function PendingVerificationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
        <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
          <Clock size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2">Verification Pending</h1>
        <p className="text-slate-500 font-medium mb-8">
          Thanks for signing up! Your account is currently under review by the hostel administration. 
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
                Once an administrator verifies your details, you will automatically gain access to all hostels and booking features.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={async () => {
              try {
                const res = await fetch('/api/auth/session');
                const data = await res.json();
                if (data.user && data.user.isVerified) {
                  window.location.href = '/hostels';
                } else {
                  alert("Your account is still pending verification.");
                }
              } catch (err) {
                alert("Failed to check status. Please try again.");
              }
            }}
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
          <MessageSquare size={14} /> Need help? Contact support at support@hostelhub.com
        </p>
      </div>
    </main>
  );
}
