"use client";
import React from 'react';
import { 
  X, 
  User, 
  MapPin, 
  FileText, 
  Phone, 
  Mail, 
  GraduationCap, 
  Home, 
  Hash,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const isOwner = user.role === 'OWNER';
  const isTenant = user.role === 'TENANT';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl shadow-slate-950/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Header */}
        <div className="relative h-40 bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-90"
            >
                <X size={20} />
            </button>

            <div className="absolute bottom-6 left-10 right-10 flex items-end justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-xl">
                        <div className="h-full w-full rounded-2xl bg-slate-900 flex items-center justify-center">
                            <User size={28} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-white text-2xl font-black tracking-tight">{user.name || 'Anonymous User'}</h2>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border ${
                                user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                user.role === 'OWNER' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
                                'bg-slate-500/20 text-slate-300 border-slate-500/30'
                            }`}>
                                {user.role}
                            </span>
                            {user.isVerified && (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 size={12} /> Verified
                              </span>
                            )}
                        </div>
                        <p className="text-slate-400 font-medium text-sm mt-1">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-10">
                {/* General Information */}
                <section>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div> Contact Details
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Phone className="text-slate-400" size={20} />
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Phone Number</label>
                                <p className="text-slate-900 font-bold">{user.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Mail className="text-slate-400" size={20} />
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Email Address</label>
                                <p className="text-slate-900 font-bold truncate max-w-[200px]">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Calendar className="text-slate-400" size={20} />
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Joined Date</label>
                                <p className="text-slate-900 font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tenant Specific Details */}
                {isTenant && (
                    <section>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div> Student Accommodation Details
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                <GraduationCap className="text-amber-500/50" size={20} />
                                <div>
                                    <label className="block text-[10px] font-black text-amber-500 uppercase tracking-tight mb-1">University</label>
                                    <p className="text-slate-900 font-bold">{user.schoolName || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                <Hash className="text-amber-500/50" size={20} />
                                <div>
                                    <label className="block text-[10px] font-black text-amber-500 uppercase tracking-tight mb-1">Student ID/Unique Number</label>
                                    <p className="text-slate-900 font-bold tracking-widest">{user.uniqueNumber || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Home className="text-slate-400" size={20} />
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Applied Hostel</label>
                                    <p className="text-slate-900 font-bold">{user.hostelName || 'No application yet'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <MapPin className="text-slate-400" size={20} />
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Room Preference</label>
                                    <p className="text-slate-900 font-bold">{user.roomNumber || 'Any available'}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Owner Specific Details */}
                {isOwner && (
                    <section>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div> Owner Professional Details
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                                <FileText className="text-indigo-500/50" size={20} />
                                <div>
                                    <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-tight mb-1">Ghana Card (ID)</label>
                                    <p className="text-slate-900 font-bold tracking-widest">{user.ghanaCard || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                                <Building2 className="text-indigo-500/50" size={20} />
                                <div>
                                    <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-tight mb-1">Business Name</label>
                                    <p className="text-slate-900 font-bold">{user.businessName || user.hostelName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <MapPin className="text-slate-400" size={20} />
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">GPS Address</label>
                                    <p className="text-slate-900 font-bold">{user.gpsAddress || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {user.verificationNotes && (
                            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-2">Verification Notes</label>
                                <p className="text-slate-700 text-sm whitespace-pre-wrap">{user.verificationNotes}</p>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
