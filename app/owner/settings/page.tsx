"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Home, LayoutDashboard, Users, CreditCard, Settings, LogOut, ShieldCheck } from "lucide-react";

export default function OwnerSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: ""
  });

  useEffect(() => {
    fetch('/api/auth/session').then(res => res.json()).then(data => {
      if (data.user) {
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          businessName: data.user.businessName || ""
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch('/api/owner/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

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
          <Link href="/owner/payments"><NavItem icon={<CreditCard size={20} />} label="Payments" /></Link>
          <Link href="/owner/settings"><NavItem icon={<Settings size={20} />} label="Settings" active /></Link>
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
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium mb-10">Manage your personal information and hostel business profile.</p>

        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold shadow-sm animate-slide-down ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <Users size={16} /> Personal Profile
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="text-xs font-bold text-slate-500 ml-1 mb-2 block">Full Name</label>
                       <input 
                         type="text" 
                         value={formData.name} 
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100" 
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 ml-1 mb-2 block">Email Address</label>
                       <input 
                         type="email" 
                         value={formData.email} 
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100" 
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 ml-1 mb-2 block">Phone Number</label>
                       <input 
                         type="tel" 
                         value={formData.phone} 
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         placeholder="e.g. 054 123 4567"
                         className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100" 
                       />
                    </div>
                 </div>
              </section>

              <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <Home size={16} /> Business Details
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-xs font-bold text-slate-500 ml-1 mb-2 block">Hostel Business Name</label>
                       <input 
                         type="text" 
                         value={formData.businessName} 
                         onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                         placeholder="e.g. Landmark Properties" 
                         className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100" 
                       />
                    </div>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {saving ? "Saving Changes..." : "Save All Changes"}
                    </button>
                 </div>
              </section>
           </div>
           
           <div className="space-y-8">
              <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                       <ShieldCheck size={28} />
                    </div>
                    <div>
                       <p className="text-xs font-bold opacity-70 uppercase">Account Status</p>
                       <h4 className="text-xl font-black">Verified Owner</h4>
                    </div>
                 </div>
                 <p className="text-sm font-medium opacity-80 leading-relaxed">Your account is fully verified. You can list hostels and manage student registrations without restrictions.</p>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                 <h4 className="font-black mb-4">Need Help?</h4>
                 <p className="text-sm opacity-60 mb-6">Contact our support team for assistance with your account or property listings.</p>
                 <button className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-sm transition-colors">
                   Contact Support
                 </button>
              </div>
           </div>
        </div>
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
