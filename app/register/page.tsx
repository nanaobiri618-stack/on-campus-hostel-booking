"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, ShieldCheck, Star } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TENANT",
    uniqueNumber: "",
    schoolName: "",
    hostelName: "",
    location: "",
    roomNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allHostels, setAllHostels] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/hostels')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllHostels(data);
      })
      .catch(err => console.error("Error fetching hostels for discovery:", err));
  }, []);

  const filteredHostels = allHostels.filter(h => {
    const schoolName = formData.schoolName || "";
    const loc = formData.location || "";
    const schoolMatch = schoolName && h.university?.name.toLowerCase().includes(schoolName.toLowerCase());
    const locationMatch = loc && h.location.toLowerCase().includes(loc.toLowerCase());
    return schoolMatch || locationMatch;
  }).slice(0, 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Create Account</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="name@mail.com"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-white outline-none cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="TENANT">Student</option>
              <option value="OWNER">Hostel Owner / Admin</option>
            </select>
          </div>

          <div className="pt-4 border-t space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Info</p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {formData.role === 'OWNER' ? 'Owner / Unique ID' : 'School Unique Number'}
              </label>
              <input
                type="text"
                required
                placeholder="ID-123456"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, uniqueNumber: e.target.value })}
              />
            </div>

            {formData.role === 'TENANT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">University / School Name</label>
                  <input
                    type="text"
                    required
                    placeholder="KNUST"
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hostel Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room No.</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City / Area"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-md font-bold transition ${loading ? 'opacity-50' : 'hover:bg-blue-700 active:scale-[0.98]'}`}
          >
            {loading ? "Creating Account..." : "Complete Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
        </p>

        {formData.role === 'TENANT' && filteredHostels.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Hostels Near You</h3>
            <div className="space-y-4">
              {filteredHostels.map(h => (
                <div key={h.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                    <img src={h.images || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80"} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{h.name}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {h.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-blue-600">GH₵ {h.price}</span>
                      <Link href={`/hostels/${h.id}`} className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-0.5">
                        View <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/hostels" className="mt-4 text-xs font-bold text-blue-600 hover:underline flex justify-center">View all available hostels</Link>
          </div>
        )}
      </div>
    </main>
  );
}