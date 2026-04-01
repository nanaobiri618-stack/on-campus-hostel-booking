"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  School, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  Calendar
} from "lucide-react";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/bookings")
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        }
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner */}
      <div className="bg-blue-600 h-48 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 pt-12 text-white relative z-10">
          <h1 className="text-3xl font-black tracking-tight uppercase">Student Console</h1>
          <p className="text-blue-100 font-medium">Manage your profile and track your hostel bookings.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                  {profile?.name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}
                </div>
                {profile?.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                    <ShieldCheck size={16} />
                  </div>
                )}
              </div>

              <h2 className="text-xl font-black text-slate-900 text-center uppercase tracking-tight mb-1">
                {profile?.name || "Student Name"}
              </h2>
              <p className="text-slate-400 text-xs font-bold text-center uppercase tracking-widest mb-6">
                {profile?.role === 'TENANT' ? 'Student Resident' : profile?.role}
              </p>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <ProfileItem icon={<Mail size={16} />} label="Email" value={profile?.email} />
                <ProfileItem icon={<Phone size={16} />} label="Phone" value={profile?.phone || "Not Set"} />
                <ProfileItem icon={<User size={16} />} label="Student ID" value={profile?.uniqueNumber || "Not Set"} />
                <ProfileItem icon={<School size={16} />} label="University" value={profile?.schoolName || "Not Set"} />
              </div>

              {!profile?.isVerified && (
                <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-black text-amber-700 uppercase mb-1">Verification Required</p>
                    <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                      Complete a booking to start the verification process with your hostel owner.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bookings & Maps */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                My Bookings
              </h3>
              <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase">
                {bookings.length} Hostels
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white p-16 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Clock size={40} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">No Bookings Found</h4>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium">You haven't reserved or paid for any hostels yet.</p>
                <Link href="/hostels" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-200 inline-block uppercase text-sm">
                  Find a Hostel
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Reserved Hostel</span>
                            <StatusBadge status={booking.status} />
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 uppercase group-hover:text-blue-600 transition-colors">
                            {booking.hostel?.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                            <MapPin size={14} /> {booking.hostel?.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                          <p className="text-2xl font-black text-slate-900">GH₵ {booking.amount}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Booking Details */}
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-6 rounded-3xl space-y-3">
                            <DetailRow label="Transaction ID" value={booking.verificationId || "Pending"} />
                            <DetailRow label="Telecom" value={booking.telecom?.toUpperCase() || "N/A"} />
                            <DetailRow label="Payment Phone" value={booking.paymentPhone || "N/A"} />
                            <DetailRow label="Date" value={new Date(booking.createdAt).toLocaleDateString()} />
                          </div>
                          
                          <div className="flex gap-4">
                            <Link 
                              href={`/hostels/${booking.hostelId}`}
                              className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-center font-bold text-xs uppercase hover:bg-slate-800 transition"
                            >
                              Hostel Details
                            </Link>
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${booking.hostel?.name} ${booking.hostel?.location}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-100 transition"
                            >
                              <ExternalLink size={18} />
                            </a>
                          </div>
                        </div>

                        {/* Map View */}
                        <div className="h-full min-h-[180px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative group">
                          <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight={0} 
                            marginWidth={0} 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(booking.hostel?.location || booking.hostel?.name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                          ></iframe>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1.5">
                            <MapPin size={12} className="text-red-500" />
                            <span className="text-[10px] font-black uppercase text-slate-700">Live View</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{label}</span>
      <span className="font-black text-slate-800">{value}</span>
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
    APPLIED: <Clock size={10} />,
    PAID: <AlertCircle size={10} />,
    VERIFIED: <CheckCircle2 size={10} />,
    CANCELLED: <AlertCircle size={10} />,
  };

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${styles[status as keyof typeof styles]}`}>
      {icons[status as keyof typeof icons]} {status}
    </div>
  );
}
