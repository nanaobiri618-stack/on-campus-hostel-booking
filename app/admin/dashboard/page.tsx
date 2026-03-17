"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { 
  Users, 
  Home, 
  CreditCard, 
  LayoutDashboard, 
  ShieldCheck, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  BarChart3,
  LogOut,
  Settings,
  ShieldAlert,
  Info
} from "lucide-react";
import VerificationModal from "./VerificationModal";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // users, hostels, bookings
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        if (session.user?.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        window.location.href = '/login';
      }
    };
    checkAuth();
  }, []);

  const fetchData = async (tab: string) => {
    if (isAdmin === false) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${tab}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const errorText = await res.text();
        console.error(`Failed to fetch admin data: ${res.status} ${res.statusText}`);
        console.error("Response Body:", errorText);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchData(activeTab);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase();
    if (activeTab === 'users') {
      return item.name?.toLowerCase().includes(search) || item.email?.toLowerCase().includes(search);
    }
    if (activeTab === 'hostels') {
      return item.name?.toLowerCase().includes(search) || item.location?.toLowerCase().includes(search);
    }
    if (activeTab === 'bookings') {
      return item.verificationId?.toLowerCase().includes(search) || item.student?.name?.toLowerCase().includes(search);
    }
    return true;
  });

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="relative">
             <div className="h-20 w-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <ShieldAlert size={28} className="text-blue-600 animate-pulse" />
             </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfdff]">
      {/* Admin Sidebar */}
      <aside className="bg-slate-950 text-white w-72 hidden lg:flex flex-col p-8 sticky top-0 h-screen shadow-2xl z-20">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group hover:rotate-6 transition-transform">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight block">Admin Hub</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Control</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users size={20} className={activeTab === 'users' ? 'text-white' : 'text-slate-500 group-hover:text-white'} /> 
            <span>Users</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('hostels')} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${activeTab === 'hostels' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Home size={20} className={activeTab === 'hostels' ? 'text-white' : 'text-slate-500 group-hover:text-white'} /> 
            <span>Hostels</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bookings')} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <CreditCard size={20} className={activeTab === 'bookings' ? 'text-white' : 'text-slate-500 group-hover:text-white'} /> 
            <span>Bookings</span>
          </button>
        </nav>

        <div className="pt-8 mt-auto border-t border-white/5">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm group"
            >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> 
                <span>Logout Session</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-12 py-10 flex items-center justify-between glass-header">
          <div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-none mb-2">
              Managing <span className="text-blue-600 capitalize">{activeTab}</span>
            </h2>
            <p className="text-sm text-slate-500 font-semibold flex items-center gap-2">
                <LayoutDashboard size={14} /> Total Control & System Oversight
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" size={18} />
              <input 
                type="text" 
                placeholder={`Quick search ${activeTab}...`} 
                className="w-80 h-14 pl-12 pr-6 rounded-2xl border-none bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all outline-none font-bold"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-black text-xs shadow-sm">
                SA
            </div>
          </div>
        </header>

        <div className="px-12 py-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-slate-950 font-black uppercase tracking-widest text-sm mb-1">Retrieving Records</p>
                <p className="text-slate-400 font-bold text-xs">Syncing with system database...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        {activeTab === 'users' && (
                        <>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Role & Auth</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Internal Status</th>
                        </>
                        )}
                        {activeTab === 'hostels' && (
                        <>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Name</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Ownership</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Financials</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Location</th>
                        </>
                        )}
                        {activeTab === 'bookings' && (
                        <>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Security ID</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Tenant Info</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Hostel Unit</th>
                            <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Status</th>
                        </>
                        )}
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operations</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 group transition-all">
                        {activeTab === 'users' && (
                            <>
                            <td className="px-8 py-6">
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-950 text-base">{item.name || 'Anonymous'}</span>
                                    <span className="text-slate-500 text-xs font-medium">{item.email}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.role === 'ADMIN' ? 'bg-red-50 text-red-600 border border-red-100' : item.role === 'OWNER' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                                {item.role}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                {item.isVerified ? (
                                <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-tight">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    Verified Account
                                </div>
                                ) : item.verificationStatus === 'PENDING' ? (
                                <button 
                                    onClick={() => { setSelectedUser(item); setShowVerifyModal(true); }}
                                    className="flex items-center gap-2 text-amber-500 hover:text-amber-600 text-xs font-black uppercase tracking-tight transition-colors group/audit"
                                >
                                    <div className="h-2 w-2 rounded-full bg-amber-400 group-hover/audit:bg-amber-600 transition-colors animate-pulse"></div>
                                    Pending Audit
                                </button>
                                ) : (
                                  <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-tight">
                                      <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                                      No Application
                                  </div>
                                )}
                            </td>
                            </>
                        )}
                        {activeTab === 'hostels' && (
                            <>
                            <td className="px-8 py-6 font-bold text-slate-950">{item.name}</td>
                            <td className="px-8 py-6 text-slate-500 text-sm font-semibold">{item.owner?.name || 'Unknown Provider'}</td>
                            <td className="px-8 py-6">
                                <span className="font-black text-blue-600 text-base">GH₵ {item.price?.toLocaleString()}</span>
                            </td>
                            <td className="px-8 py-6 text-slate-400 text-[10px] font-black uppercase tracking-wider">{item.location}</td>
                            </>
                        )}
                        {activeTab === 'bookings' && (
                            <>
                            <td className="px-8 py-6 font-mono text-[10px] font-black text-blue-600 tracking-[0.2em] bg-blue-50/50 rounded-lg">{item.verificationId}</td>
                            <td className="px-8 py-6 text-slate-950 text-sm font-bold">{item.student?.name}</td>
                            <td className="px-8 py-6 text-slate-500 text-sm font-semibold">{item.hostel?.name}</td>
                            <td className="px-8 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                {item.status}
                                </span>
                            </td>
                            </>
                        )}
                        <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                            <button title="Edit Record" className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} title="Purge Record" className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm">
                                <Trash2 size={18} />
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
              
              {filteredData.length === 0 && (
                <div className="py-32 text-center flex flex-col items-center justify-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Search className="text-slate-300" size={32} />
                    </div>
                  <p className="text-slate-950 font-black uppercase tracking-[0.2em] text-xs mb-2">Null Set Returned</p>
                  <p className="text-slate-400 font-bold text-xs">No records matching &quot;{searchTerm}&quot; in {activeTab}</p>
                </div>
              )}
              
              <div className="bg-slate-50/50 px-8 py-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredData.length} entries</span>
                  <div className="flex gap-2">
                      <button className="h-8 px-4 text-[10px] font-black bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">Previous</button>
                      <button className="h-8 px-4 text-[10px] font-black bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">Next</button>
                  </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showVerifyModal && selectedUser && (
        <VerificationModal 
          user={selectedUser} 
          onClose={() => { setShowVerifyModal(false); setSelectedUser(null); }}
          onSuccess={() => fetchData(activeTab)}
        />
      )}
    </div>
  );
}
