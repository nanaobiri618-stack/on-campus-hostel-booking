"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Star, ShieldCheck, CreditCard, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HostelDetailsPage() {
  const { id } = useParams();
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment States
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentPhone, setPaymentPhone] = useState("");
  const [telecom, setTelecom] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [showPaystack, setShowPaystack] = useState(false);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await fetch(`/api/hostels`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const found = data.find((h: any) => h.id.toString() === id?.toString());
          if (found) {
            setHostel(found);
          }
        }
      } catch (err) {
        console.error("Error fetching hostel details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHostel();
  }, [id]);

  const handleStartPayment = () => {
    setPaymentStep(2); // Go to phone input
  };

  const handleProceedToPaystack = () => {
    if (!paymentPhone || !telecom) return;
    setPaymentStep(3); // Contacting Paystack...
    setTimeout(() => {
      setShowPaystack(true);
    }, 1500);
  };

  const finalizePayment = async () => {
    setShowPaystack(false);
    setPaymentStep(4); // Generating Receipt...

    const vid = "HH" + Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostelId: id,
          amount: hostel.price + 150,
          paymentPhone,
          telecom,
          verificationId: vid
        })
      });

      if (!res.ok) throw new Error("Failed to save booking");

      setVerificationId(vid);
      setPaymentStep(5); // Success!
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Payment processed but failed to save booking. Please contact support with code: " + vid);
      setPaymentStep(2); // Go back
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h1 className="text-2xl font-black text-slate-900 mb-4">Hostel Not Found</h1>
        <p className="text-slate-500 mb-8">The hostel you are looking for does not exist in our database.</p>
        <Link href="/hostels" className="btn-primary px-8 py-3">Back to Hostels</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-30 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/hostels" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-black text-slate-900 uppercase tracking-tight truncate">
            {hostel.name}
          </h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img 
                src={hostel.images || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80"} 
                alt={hostel.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl shadow-blue-500/40">
                <ShieldCheck size={14} /> Verified Property
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-bold text-blue-600 flex items-center gap-1 mb-1">
                    <MapPin size={14} /> {hostel.university?.name || hostel.location}
                  </p>
                  <h2 className="text-3xl font-black text-slate-900">{hostel.name}</h2>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-lg justify-end">
                    <Star size={18} fill="currentColor" /> 4.8
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Premium Choice</p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg mb-8 font-medium">
                {hostel.description || "Experience top-tier student living in this residence."}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t">
                <Feature icon={<ShieldCheck className="text-blue-600" size={18} />} label="Security" value="24/7" />
                <Feature icon={<Star className="text-blue-600" size={18} />} label="WiFi" value="Free" />
                <Feature icon={<MapPin className="text-blue-600" size={18} />} label="Distance" value="500m" />
                <Feature icon={<CreditCard className="text-blue-600" size={18} />} label="Rooms" value="Available" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-28 shadow-blue-900/20">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Total Yearly Price</p>
              <div className="flex items-baseline gap-2 mb-8">
                <h3 className="text-4xl font-black text-white">GH₵ {hostel.price}</h3>
                <span className="text-sm opacity-50">/year</span>
              </div>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="opacity-50">Booking Fee</span>
                  <span className="font-bold">GH₵ 50</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="opacity-50">Service Tax</span>
                  <span className="font-bold">GH₵ 100</span>
                </div>
              </div>

              <button 
                onClick={() => setShowPayment(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/30 active:scale-95 text-lg"
              >
                Book This Hostel
              </button>

              <p className="text-[10px] text-center mt-6 opacity-40 font-bold uppercase tracking-tighter">Powered by Paystack Demo</p>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Overlay */}
      {showPayment && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl relative animate-scale-in">
            <button 
              onClick={() => { setShowPayment(false); setPaymentStep(1); }}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
            >
              ×
            </button>

            {paymentStep === 1 && (
              <div className="text-center py-4">
                <div className="bg-blue-50 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 text-blue-600">
                  <CreditCard size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Finalize Booking</h2>
                <div className="bg-slate-50 p-6 rounded-2xl my-8 border border-slate-100 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-slate-900">GH₵ {hostel.price + 150}</p>
                </div>
                <button 
                  onClick={handleStartPayment}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all text-lg"
                >
                  Confirm & Pay
                </button>
              </div>
            )}

            {paymentStep === 2 && (
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Mobile Money</h2>
                  <p className="text-sm text-slate-500 font-medium">Enter your number to initiate the demo payment.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 ml-2">MoMo Number</label>
                    <input 
                      type="tel" 
                      placeholder="024 000 0000" 
                      className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 ml-2">Telecom Provider</label>
                    <select 
                      className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                      value={telecom}
                      onChange={(e) => setTelecom(e.target.value)}
                    >
                      <option value="">Select Telecom</option>
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="vodafone">Telecel (Vodafone)</option>
                      <option value="at">AT Money</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToPaystack}
                  disabled={!paymentPhone || !telecom}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-lg disabled:opacity-50"
                >
                  Pay GH₵ {hostel.price + 150}
                </button>
              </div>
            )}

            {paymentStep === 3 && (
              <div className="text-center py-20">
                <Loader2 className="animate-spin text-blue-600 mx-auto mb-6" size={60} />
                <h2 className="text-xl font-black text-slate-900">Connecting to Paystack...</h2>
              </div>
            )}

            {paymentStep === 4 && (
              <div className="text-center py-20">
                <Loader2 className="animate-spin text-green-600 mx-auto mb-6" size={60} />
                <h2 className="text-xl font-black text-slate-900">Success! Generating Receipt...</h2>
              </div>
            )}

            {paymentStep === 5 && (
              <div className="text-center py-4">
                <div className="bg-green-100 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 text-green-600">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
                <div className="bg-slate-900 text-white p-8 rounded-3xl my-8 relative overflow-hidden group">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 text-center">Your Verification ID</p>
                  <p className="text-4xl font-mono font-black tracking-[0.2em] text-center">{verificationId}</p>
                </div>
                <Link href="/hostels" className="w-full inline-block bg-slate-100 text-slate-900 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all text-lg">
                  Back to Discover
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paystack Simulation Modal */}
      {showPaystack && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden scale-in-center">
            <div className="bg-[#011b33] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-[10px] font-black text-white">P</div>
                <span className="font-bold text-sm tracking-tight">paystack</span>
              </div>
              <span className="text-[10px] font-black opacity-70 underline tracking-widest">DEMO MODE</span>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">Paying To</p>
                <p className="text-lg font-black text-slate-900 truncate">{hostel.name}</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Provider</span>
                  <span className="font-bold text-xs uppercase text-slate-600">{telecom}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Phone Number</span>
                  <span className="font-mono font-bold text-slate-900">{paymentPhone}</span>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Amount</span>
                  <span className="text-2xl font-black text-slate-900">GH₵ {hostel.price + 150}.00</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={finalizePayment}
                  className="w-full bg-[#3bb75e] hover:bg-[#34a353] text-white py-4 rounded-lg font-black text-sm transition-all shadow-md active:scale-[0.98]"
                >
                  Pay with Virtual Money
                </button>
                <button 
                  onClick={() => { setShowPaystack(false); setPaymentStep(2); }}
                  className="w-full text-slate-400 font-bold text-xs py-2 hover:text-slate-600 transition-colors"
                >
                  Cancel Transaction
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100 opacity-40">
                <ShieldCheck size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secured by Paystack</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ icon, label, value }: any) {
  return (
    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs font-black text-slate-900">{value}</p>
    </div>
  );
}
