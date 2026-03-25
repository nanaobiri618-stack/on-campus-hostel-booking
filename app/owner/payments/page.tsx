"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Home, LayoutDashboard, Users, CreditCard, Settings, LogOut, ArrowRight } from "lucide-react";

export default function OwnerPaymentsPage() {
  const [showDemo, setShowDemo] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/owner/payments');
        if (res.ok) {
          const data = await res.json();
          setPayments(data.payments || []);
        }
      } catch (err) {
        console.error("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="bg-slate-900 text-white w-64 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900">
            <Home size={22} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">HostelHub</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/owner/dashboard"><NavItem icon={<LayoutDashboard size={20} />} label="Console" /></Link>
          <Link href="/owner/students"><NavItem icon={<Users size={20} />} label="Students" /></Link>
          <Link href="/owner/payments"><NavItem icon={<CreditCard size={20} />} label="Payments" active /></Link>
          <Link href="/owner/settings"><NavItem icon={<Settings size={20} />} label="Settings" /></Link>
        </nav>
        <button 
          onClick={async () => {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="mt-auto flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white transition-colors font-bold"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Dashboard</h1>
            <p className="text-slate-500 font-medium">Track and simulate payments for your hostels.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setShowDemo('momo')} className="bg-[#ffcc00] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-amber-200">
               Demo MoMo
             </button>
             <button onClick={() => setShowDemo('paystack')} className="bg-[#09a5db] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-cyan-200">
               Demo Paystack
             </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Hostel</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">No payments found.</td>
                </tr>
              ) : payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-900">{p.student}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{p.hostel}</td>
                  <td className="px-6 py-5 font-black text-slate-900">GH₵ {p.amount}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${p.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-400">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Demo Overlays */}
        {showDemo && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-scale-in ${showDemo === 'momo' ? 'bg-[#ffcc00]' : 'bg-white'}`}>
               <button onClick={() => setShowDemo(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
                  <span className="text-2xl font-light">×</span>
               </button>
               {showDemo === 'momo' ? (
                 <div className="text-center py-4">
                    <div className="bg-white w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl">
                      <CreditCard className="text-[#ffcc00]" size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">MoMo Payment</h2>
                    <p className="text-sm font-bold text-slate-700 mb-8 lowercase opacity-70">enter your number to approve the prompt</p>
                    <input type="text" placeholder="054 XXX XXXX" className="w-full bg-white/50 border-none rounded-2xl p-4 text-center font-black text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-white/50 mb-4" />
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-transform">
                      Approve GH₵ 2,500
                    </button>
                 </div>
               ) : (
                 <div className="text-center py-4">
                    <img src="https://paystack.com/assets/img/login/paystack-logo.png" alt="Paystack" className="h-8 mx-auto mb-8" />
                    <div className="bg-slate-50 border p-6 rounded-3xl mb-8">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Jes is paying</p>
                       <p className="text-3xl font-black text-slate-900">GH₵ 2,500</p>
                    </div>
                    <div className="space-y-3 mb-8">
                       <button className="w-full flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-2xl hover:border-cyan-200 transition-all group">
                         <span className="font-bold text-slate-600 group-hover:text-cyan-600">Card</span>
                         <ArrowRight className="text-slate-300" size={18} />
                       </button>
                       <button className="w-full flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-2xl hover:border-cyan-200 transition-all group">
                         <span className="font-bold text-slate-600 group-hover:text-cyan-600">Mobile Money</span>
                         <ArrowRight className="text-slate-300" size={18} />
                       </button>
                    </div>
                    <button className="w-full py-4 text-cyan-600 font-black text-xs uppercase tracking-widest opacity-50">Cancel Payment</button>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      {icon} {label}
    </button>
  );
}
