"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Home, LayoutDashboard, Users, CreditCard, Settings, LogOut } from "lucide-react";

export default function OwnerStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifying, setVerifying] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/owner/students');
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: number) => {
    setVerifying(id);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error);
      }
    } catch (err) {
      alert("Verification failed");
    } finally {
      setVerifying(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.uniqueNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Link href="/owner/students"><NavItem icon={<Users size={20} />} label="Students" active /></Link>
          <Link href="/owner/payments"><NavItem icon={<CreditCard size={20} />} label="Payments" /></Link>
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

      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Management</h1>
            <p className="text-slate-500 font-medium">Manage and verify students registered to your hostels.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border rounded-xl px-4 py-2 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Pending</span>
              <p className="text-xl font-black text-amber-500">{stats.pending}</p>
            </div>
            <div className="bg-white border rounded-xl px-4 py-2 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
              <p className="text-xl font-black text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between items-center">
            <h3 className="font-bold text-slate-800">Registration List</h3>
            <input 
              type="text" 
              placeholder="Search by name, ID or email..." 
              className="w-full sm:w-80 px-4 py-2 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium">Loading students...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium">No students found.</td></tr>
                ) : filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                          {s.name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{s.hostelName}</p>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Code: <span className="text-blue-600 font-black">{s.verificationId}</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Paid: GH₵ {s.amount} via {s.telecom?.toUpperCase()} ({s.paymentPhone})
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${s.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.status === 'PAID' && (
                        <button 
                          disabled={verifying === s.id}
                          onClick={() => handleVerify(s.id)}
                          className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {verifying === s.id ? 'Verifying...' : 'Verify Payment'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
