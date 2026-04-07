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
      {/* Top Banner with Mesh Gradient and Animation */}
      <div className="bg-blue-600 h-64 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 animate-gradient-xy"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-6 pt-16 text-white relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Live Resident System</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Student <span className="text-blue-200">Terminal</span>
          </h1>
          <p className="text-blue-100/80 font-medium mt-2 max-w-md">Securely manage your hostel residency and profile.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white p-8 relative overflow-hidden group">
              {/* Subtle background element */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative w-28 h-28 mx-auto mb-8">
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-800 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {profile?.name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}
                </div>
                {profile?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-xl animate-bounce-subtle">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tighter mb-1">
                {profile?.name || "Student Name"}
              </h2>
              <div className="flex justify-center mb-8">
                <p className="text-blue-600 text-[10px] font-black py-1 px-3 bg-blue-50 rounded-full uppercase tracking-widest">
                  {profile?.role === 'TENANT' ? 'Verified Resident' : profile?.role}
                </p>
              </div>

              <div className="space-y-5 pt-8 border-t border-slate-100 relative z-10">
                <ProfileItem icon={<Mail size={16} />} label="Email Address" value={profile?.email} />
                <ProfileItem icon={<Phone size={16} />} label="Contact Number" value={profile?.phone || "Not Set"} />
                <ProfileItem icon={<User size={16} />} label="Registration ID" value={profile?.uniqueNumber || "Not Set"} />
                <ProfileItem icon={<School size={16} />} label="Institution" value={profile?.schoolName || "Not Set"} />
              </div>

              {!profile?.isVerified && (
                <div className="mt-10 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50 rounded-[2rem] flex items-start gap-4">
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-800 uppercase mb-1">Action Required</p>
                    <p className="text-[10px] text-amber-700/80 font-semibold leading-relaxed">
                      Your identity is not yet verified. Please ensure your booking status is "VERIFIED" to unlock all console features.
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
                            <DetailRow label="Room Number" value={profile?.roomNumber || "Assigning..."} />
                            <DetailRow label="Stay Duration" value={`${profile?.durationMonths || "N/A"} Months`} />
                            <DetailRow label="Expires On" value={profile?.expiresAt ? new Date(profile.expiresAt).toLocaleDateString() : "N/A"} />
                            <DetailRow label="Transaction ID" value={booking.verificationId || "Pending"} />
                            <DetailRow label="Telecom" value={booking.telecom?.toUpperCase() || "N/A"} />
                            <DetailRow label="Date Paid" value={new Date(booking.createdAt).toLocaleDateString()} />
                          </div>
                          
                          {profile?.expiresAt && new Date() > new Date(profile.expiresAt) && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-pulse">
                              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                              <div>
                                <p className="text-xs font-black text-red-700 uppercase mb-1">Stay Expired</p>
                                <p className="text-[10px] text-red-600 font-medium leading-relaxed">
                                  Your stay duration has ended. Please contact the owner for renewal or make a new booking to avoid being logged out.
                                </p>
                              </div>
                            </div>
                          )}

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
