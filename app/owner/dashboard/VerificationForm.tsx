'use client';

import { useState } from 'react';
import { Camera, CreditCard, Home, MapPin, CheckCircle2, AlertCircle, Loader2, Search } from 'lucide-react';

interface VerificationFormProps {
  onSuccess: () => void;
}

export default function VerificationForm({ onSuccess }: VerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    ghanaCard: '',
    gpsAddress: '',
    hostelName: '',
    location: '',
    verifiedPrices: '',
    roomSize: '',
    utilities: '',
    ownerPhoto: '',
    idCardPhoto: '',
    facilitiesPhoto: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFileUpload = async (file: File, fieldName: string) => {
    setLoading(true);
    setError(null);
    try {
      // Check file size (limit to 2MB for Base64 storage)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image too large. Please upload an image smaller than 2MB.');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, [fieldName]: base64String }));
        setLoading(false);
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Failed to process image. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check for missing fields
    const missingFields = Object.entries(formData).filter(([_, value]) => !value.trim());
    if (missingFields.length > 0) {
      setError('Please fill in all fields before submitting.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm focus:bg-white";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tight";

  return (
    <div className="max-w-2xl mx-auto">
      {submitted ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xl shadow-slate-200/50 animate-in zoom-in duration-500">
          <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Application Sent!</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            Your verification details have been received. Our administrators will review your application shortly.
          </p>
          <div className="mt-10 flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Loader2 className="w-4 h-4 animate-spin" />
            Syncing Dashboard...
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 overflow-hidden relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mb-8 pt-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verification Application</h2>
            <p className="text-slate-500 font-medium">Step {step} of 4: {step === 1 ? 'Personal Details' : step === 2 ? 'Hostel Details' : step === 3 ? 'Facilities & Photos' : 'Review & Confirm'}</p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-2xl">
            {step === 1 && <CreditCard className="w-6 h-6 text-blue-400" />}
            {step === 2 && <Home className="w-6 h-6 text-blue-400" />}
            {step === 3 && <Camera className="w-6 h-6 text-blue-400" />}
            {step === 4 && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className={labelClasses}>Ghana Card Number</label>
                <input 
                  type="text" name="ghanaCard" value={formData.ghanaCard} onChange={handleChange}
                  placeholder="GHA-123456789-0" className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Personal GPS Address</label>
                <input 
                  type="text" name="gpsAddress" value={formData.gpsAddress} onChange={handleChange}
                  placeholder="GA-123-4567" className={inputClasses}
                />
              </div>
              <div className="pt-4">
                <button type="button" onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20">
                  Next: Hostel Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className={labelClasses}>Hostel Official Name</label>
                <input 
                  type="text" name="hostelName" value={formData.hostelName} onChange={handleChange}
                  placeholder="Premium Student Residency" className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Physical Location</label>
                <input 
                  type="text" name="location" value={formData.location} onChange={handleChange}
                  placeholder="Near Main Campus Gate" className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Room Prices (e.g., 2000 - 5000 GHS)</label>
                <input 
                  type="text" name="verifiedPrices" value={formData.verifiedPrices} onChange={handleChange}
                  placeholder="GHS 3,500 per semester" className={inputClasses}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  disabled={loading} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 border border-slate-200"
                >
                  Back
                </button>
                <button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20">
                  Next: Photos
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Room Size & Type</label>
                  <input type="text" name="roomSize" value={formData.roomSize} onChange={handleChange} placeholder="Standard 4-in-1" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Utilities Included</label>
                  <input type="text" name="utilities" value={formData.utilities} onChange={handleChange} placeholder="Light, Water, WiFi" className={inputClasses} />
                </div>
              </div>

              <p className="text-xs text-blue-600 font-black ml-1 mt-6 uppercase tracking-widest">Upload Required Photos</p>
              
              <div className="space-y-4">
                {[
                  { id: 'ownerPhoto', label: 'Owner Portrait / Selfie', icon: <Camera size={16} /> },
                  { id: 'idCardPhoto', label: 'Ghana Card (Front)', icon: <CreditCard size={16} /> },
                  { id: 'facilitiesPhoto', label: 'Facilities Photo', icon: <MapPin size={16} /> }
                ].map((input) => (
                  <div key={input.id} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{input.label}</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, input.id);
                        }}
                        className="hidden"
                        id={input.id}
                      />
                      <label 
                        htmlFor={input.id}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                          formData[input.id as keyof typeof formData] 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData[input.id as keyof typeof formData] ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                            {input.icon}
                          </div>
                          <span className="text-xs font-bold">
                            {formData[input.id as keyof typeof formData] ? 'Photo Selected' : `Choose ${input.label}`}
                          </span>
                        </div>
                        {formData[input.id as keyof typeof formData] && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase">Ready</span>
                          </div>
                        )}
                        {!formData[input.id as keyof typeof formData] && loading && (
                          <Loader2 size={16} className="animate-spin text-blue-500" />
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  disabled={loading} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 border border-slate-200"
                >
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    const missingFields = Object.entries(formData).filter(([_, value]) => !value.trim());
                    if (missingFields.length > 0) {
                      setError('Please fill in all fields before previewing.');
                    } else {
                      nextStep();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Preview Application
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghana Card</p>
                    <p className="font-bold text-slate-900">{formData.ghanaCard}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GPS Address</p>
                    <p className="font-bold text-slate-900">{formData.gpsAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hostel Name</p>
                    <p className="font-bold text-slate-900">{formData.hostelName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="font-bold text-slate-900">{formData.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Range</p>
                    <p className="font-bold text-slate-900">{formData.verifiedPrices}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Size</p>
                    <p className="font-bold text-slate-900">{formData.roomSize}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilities</p>
                    <p className="font-bold text-slate-900">{formData.utilities}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Uploaded Documents</p>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.ownerPhoto && (
                      <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={formData.ownerPhoto} alt="Owner" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {formData.idCardPhoto && (
                      <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={formData.idCardPhoto} alt="ID" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {formData.facilitiesPhoto && (
                      <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={formData.facilitiesPhoto} alt="Facilities" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  disabled={loading} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 border border-slate-200"
                >
                  Back to Edit
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm & Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      )}
    </div>
  );
}
