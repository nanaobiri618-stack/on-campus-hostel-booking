"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { 
  CheckCircle, 
  Bell, 
  Smartphone, 
  UserCheck, 
  Search, 
  ShieldCheck, 
  CreditCard,
  LayoutDashboard,
  Home,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  Menu,
  Plus,
  BarChart3
} from "lucide-react";
import VerificationForm from "./VerificationForm";

export default function OwnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [verifying, setVerifying] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<string>('NONE');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/owner/students');
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
        setStats(data.stats);
        setUserStatus(data.userStatus || 'NONE');
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: number) => {
    const roomNumber = window.prompt("Enter Room Number to assign to this student (e.g., Room 204):");
    if (roomNumber === null) return;

    const durationMonths = window.prompt("Enter Duration of Stay in Months (e.g., 12):", "12");
    if (durationMonths === null) return;

    setVerifying(id);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          roomNumber,
          durationMonths: parseInt(durationMonths) || 12
        }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to verify student.");
    } finally {
      setVerifying(null);
    }
  };

  const [filter, setFilter] = useState('ALL'); // ALL, VERIFIED, PENDING

  const filteredStudents = students.filter(s => {
    if (filter === 'VERIFIED') return s.status === 'VERIFIED';
    if (filter === 'PENDING') return s.status !== 'VERIFIED';
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ... sidebar unchanged ... */}
      <aside className="bg-slate-900 text-white w-64 hidden lg:flex flex-col transition-all p-8 shadow-2xl relative z-20">
        <div className="flex items-center gap-4 mb-12 px-2 group cursor-pointer">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
            <Home size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">HostelHub</span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Management</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <Link href="/owner/dashboard"><NavItem icon={<LayoutDashboard size={20} />} label="Console" active /></Link>
          <Link href="/owner/students"><NavItem icon={<Users size={20} />} label="Resident List" /></Link>
          <Link href="/owner/payments"><NavItem icon={<CreditCard size={20} />} label="Revenue" /></Link>
          <Link href="/owner/settings"><NavItem icon={<Settings size={20} />} label="Preferences" /></Link>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button 
            onClick={async () => {
              await fetch('/api/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="flex items-center gap-3 w-full px-4 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut size={20} className="text-red-400/60" /> 
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="glass-header px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider text-xs">Owner Administration</h2>
            {userStatus === 'VERIFIED' && (
              <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <CheckCircle size={12} /> Verified Owner
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/owner/students" className="relative p-2.5 bg-white border border-slate-200 rounded-full shadow-sm">
              <Bell size={20} className="text-slate-600" />
              {stats.pending > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </Link>
            <div className="h-10 w-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-black">OA</div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back!</h1>
              <p className="text-slate-500 font-medium">Manage your properties and real-time student verification.</p>
            </div>
            
            <Link 
              href="/owner/add-hostel" 
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200 active:scale-95"
            >
              <Plus size={20} /> Add New Hostel
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => setFilter('ALL')} className="cursor-pointer">
              <StatCard label="Total Students" value={stats.total} icon={<Users />} color="blue" active={filter === 'ALL'} />
            </div>
            <div onClick={() => setFilter('VERIFIED')} className="cursor-pointer">
              <StatCard label="Verified" value={stats.verified} icon={<UserCheck />} color="green" active={filter === 'VERIFIED'} />
            </div>
            <div onClick={() => setFilter('PENDING')} className="cursor-pointer">
              <StatCard label="Pending Approval" value={stats.pending} icon={<Clock />} color="amber" active={filter === 'PENDING'} />
            </div>
          </div>

          {userStatus !== 'VERIFIED' && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              {userStatus === 'NONE' || userStatus === 'REJECTED' ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="p-4 bg-amber-500/20 rounded-2xl">
                        <ShieldCheck className="w-10 h-10 text-amber-600" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl font-bold text-slate-900">Account Verification Required</h2>
                        <p className="text-slate-600 mt-1">To start verifying students and listing more hostels, please complete your owner verification application below.</p>
                      </div>
                    </div>
                  </div>
                  <VerificationForm onSuccess={fetchData} />
                </div>
              ) : (
                <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 flex items-center justify-between gap-6 overflow-hidden relative">
                   <div className="absolute -right-10 -bottom-10 opacity-10">
                     <ShieldCheck size={200} />
                   </div>
                   <div className="relative z-10">
                     <h2 className="text-2xl font-black">Verification Pending</h2>
                     <p className="text-blue-100 mt-2 font-medium max-w-md">Your application is currently being reviewed by our administrators. We'll notify you once it's approved.</p>
                   </div>
                   <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md relative z-10">
                     <Clock className="w-8 h-8 animate-pulse" />
                   </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 mt-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={24} />
              {filter === 'ALL' ? 'All Applications' : filter === 'VERIFIED' ? 'Verified Students' : 'Pending Applications'}
            </h2>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing database...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center shadow-sm">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries matching filter</p>
                <button onClick={() => setFilter('ALL')} className="mt-4 text-blue-600 font-black text-sm uppercase hover:underline">Reset Filters</button>
              </div>
            ) : filteredStudents.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-slate-200 group-hover:bg-blue-600 group-hover:-rotate-3 transition-all duration-500">
                    {item.name?.[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-xl leading-tight tracking-tight uppercase">{item.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Home size={12} className="text-blue-500" /> {item.hostelName || 'General Listing'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Smartphone size={12} className="text-slate-400" /> {item.phone || 'No Contact'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center w-full sm:w-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Room Allocation</p>
                    <p className="text-sm font-black text-slate-900 uppercase">{item.roomNumber || 'PENDING'}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 w-full sm:w-auto min-w-[140px]">
                    {item.status !== 'VERIFIED' ? (
                      <button 
                        disabled={verifying === item.id}
                        onClick={() => handleVerify(item.id)}
                        className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {verifying === item.id ? <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <ShieldCheck size={16} />}
                        {verifying === item.id ? "Processing..." : "Authorize Room"}
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100">
                        <CheckCircle size={16} /> Access Granted
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active = false }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, icon, color, active = false }: any) {
  const accent = color === 'blue' ? 'border-l-blue-600' : color === 'green' ? 'border-l-green-600' : 'border-l-amber-600';
  const iconBg = color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'green' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600';

  return (
    <div className={`bg-white p-6 border-l-4 rounded-2xl shadow-sm border ${accent} ${active ? 'scale-105 ring-2 ring-blue-100 shadow-md z-10' : 'hover:shadow-md'} transition-all flex items-center gap-5`}>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}