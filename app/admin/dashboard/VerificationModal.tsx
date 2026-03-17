"use client";
import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ClipboardCheck,
  Building2,
  Info
} from 'lucide-react';

interface VerificationModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerificationModal({ user, onClose, onSuccess }: VerificationModalProps) {
  const [notes, setNotes] = useState(user.verificationNotes || "");
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState({
    identity: false,
    location: false,
    legal: false,
    pricing: false
  });

  const allChecked = Object.values(checks).every(Boolean);

  const handleVerify = async (status: 'VERIFIED' | 'REJECTED') => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          notes,
          status
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error processing verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-slate-950/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Header */}
        <div className="relative h-48 bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            
            <button 
                onClick={onClose}
                className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-90"
            >
                <X size={20} />
            </button>

            <div className="absolute bottom-8 left-12 right-12 flex items-end justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-2xl">
                        <div className="h-full w-full rounded-2xl bg-slate-900 flex items-center justify-center">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-white text-3xl font-black tracking-tight">{user.name || 'Account Verification'}</h2>
                            <span className="px-3 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Pending Audit</span>
                        </div>
                        <p className="text-slate-400 font-bold text-sm flex items-center gap-2 italic">
                           <FileText size={14} /> Global ID: ADM-USR-00{user.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
            {/* Left Column: Details */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div className="space-y-12">
                    {/* Identity Section */}
                    <section>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div> Identity & Contact
                        </h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-2">Owner Full Name</label>
                                <p className="text-slate-950 font-bold">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-2">Phone Number</label>
                                <p className="text-slate-950 font-bold">{user.phone || 'N/A'}</p>
                            </div>
                            <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Ghana Card (National ID)</label>
                                    <p className="text-slate-950 font-black tracking-widest">{user.ghanaCard || 'GHA-723456789-0'}</p>
                                </div>
                                <ShieldCheck className="text-blue-600 opacity-20" size={24} />
                            </div>
                        </div>
                    </section>

                    {/* Infrastructure Section */}
                    <section>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div> Physical Property
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 flex-shrink-0">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Hostel Name</label>
                                    <p className="text-slate-950 font-bold">{user.hostelName || 'Hostel Operations'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">GPS Address / Physical Location</label>
                                    <p className="text-slate-950 font-bold">{user.gpsAddress || 'GA-123-4567'}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{user.location || 'Accra, Ghana'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Owner Submissions Section */}
                    {(user.verification) && (
                      <section>
                          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                               <div className="h-1.5 w-1.5 rounded-full bg-emerald-600"></div> Owner Submissions
                          </h3>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                              {user.verification.ownerPhoto && (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase">Selfie / Portrait</label>
                                  <a href={user.verification.ownerPhoto} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 block hover:opacity-80 transition-opacity">
                                    <img src={user.verification.ownerPhoto} alt="Owner" className="w-full h-full object-cover" />
                                  </a>
                                </div>
                              )}
                              {user.verification.idCardPhoto && (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase">Ghana Card Photo</label>
                                  <a href={user.verification.idCardPhoto} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 block hover:opacity-80 transition-opacity">
                                    <img src={user.verification.idCardPhoto} alt="ID Card" className="w-full h-full object-cover" />
                                  </a>
                                </div>
                              )}
                              {user.verification.facilitiesPhoto && (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase">Facilities Photo</label>
                                  <a href={user.verification.facilitiesPhoto} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 block hover:opacity-80 transition-opacity">
                                    <img src={user.verification.facilitiesPhoto} alt="Facilities" className="w-full h-full object-cover" />
                                  </a>
                                </div>
                              )}
                          </div>
                      </section>
                    )}

                    {/* Infrastructure & Compliance Section */}
                    <section>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div> Compliance & Verification
                        </h3>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                             <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Amenities & Utilities</label>
                                    <p className="text-slate-900 text-sm font-bold">{user.verification?.utilities || 'Standard Utilities'}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">Room Dimensions</label>
                                    <p className="text-slate-900 text-sm font-bold">{user.verification?.roomSize || 'Standard Sizing'}</p>
                                </div>
                             </div>
                             
                             <div className="p-4 bg-white/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-slate-400" size={18} />
                                    <p className="text-slate-700 text-xs font-bold">Verified Room Prices</p>
                                </div>
                                <span className="text-sm font-black text-blue-600">{user.verification?.verifiedPrices || 'GHS 1,200 - 4,500'}</span>
                             </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Right Column: Audit Panel */}
            <div className="w-[380px] bg-slate-50/50 border-l border-slate-100 p-12 flex flex-col">
                <div className="flex-1 space-y-8">
                    <div>
                        <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-4">Audit Checklist</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'identity', label: 'Identity & Ghana Card Verified' },
                                { id: 'location', label: 'Physical GPS Address Confirmed' },
                                { id: 'legal', label: 'Legal Documentation Validated' },
                                { id: 'pricing', label: 'Room Pricing Compliance' },
                            ].map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => setChecks(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof checks] }))}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${checks[item.id as keyof typeof checks] ? 'bg-blue-600/5 border-blue-600/20 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                >
                                    <span className="text-xs font-bold">{item.label}</span>
                                    {checks[item.id as keyof typeof checks] ? <CheckCircle2 size={18} /> : <div className="h-4.5 w-4.5 rounded-full border-2 border-slate-100"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-4">Audit Response</h3>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add system notes or verification results..."
                            className="w-full h-32 p-4 rounded-2xl border-none bg-white text-slate-900 placeholder:text-slate-300 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 transition-all outline-none resize-none shadow-sm"
                        />
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 space-y-4">
                    {!allChecked && (
                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100 animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle size={18} className="flex-shrink-0" />
                            <p className="text-[10px] font-bold leading-tight uppercase tracking-tight">Complete all checklist items to authorize this account.</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            disabled={loading}
                            onClick={() => handleVerify('REJECTED')}
                            className="h-14 rounded-2xl border border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Decline
                        </button>
                        <button 
                            disabled={!allChecked || loading}
                            onClick={() => handleVerify('VERIFIED')}
                            className={`h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl ${allChecked ? 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Authorize <ClipboardCheck size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
