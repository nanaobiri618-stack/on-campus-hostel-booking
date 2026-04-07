"use client";
import React, { useState, useEffect } from "react";
import { Upload, Home, MapPin, BadgeCheck, DollarSign } from "lucide-react";

const GHANA_UNIVERSITIES = [
  { id: "ug", name: "University of Ghana (Legon)" },
  { id: "knust", name: "KNUST (Kumasi)" },
  { id: "ucc", name: "University of Cape Coast (UCC)" },
  { id: "uds", name: "University for Development Studies (UDS)" },
  { id: "uew", name: "University of Education, Winneba (UEW)" },
  { id: "upsa", name: "UPSA (Accra)" },
  { id: "gimpa", name: "GIMPA (Accra)" },
  { id: "uhas", name: "University of Health and Allied Sciences (UHAS)" },
  { id: "uenr", name: "University of Energy and Natural Resources (UENR)" },
  { id: "umat", name: "University of Mines and Technology (UMaT)" },
  { id: "atu", name: "Accra Technical University" },
  { id: "kttu", name: "Kumasi Technical University" },
  { id: "ktu", name: "Koforidua Technical University" },
  { id: "htu", name: "Ho Technical University" },
  { id: "cctu", name: "Cape Coast Technical University" },
  { id: "ttu", name: "Tamale Technical University" },
  { id: "sttu", name: "Sunyani Technical University" },
  { id: "wtu", name: "Wa Technical University" },
  { id: "btu", name: "Bolgatanga Technical University" },
  { id: "tatu", name: "Takoradi Technical University" },
  { id: "ashesi", name: "Ashesi University" },
  { id: "academic_city", name: "Academic City University College" },
  { id: "central", name: "Central University" },
  { id: "valley_view", name: "Valley View University" },
  { id: "lancaster", name: "Lancaster University Ghana" },
  { id: "wisconsin", name: "Wisconsin International University" },
  { id: "methodist", name: "Methodist University" },
  { id: "presbyterian", name: "Presbyterian University" },
  { id: "pentecost", name: "Pentecost University" },
  { id: "all_nations", name: "All Nations University" }
].sort((a, b) => a.name.localeCompare(b.name));

export default function AddHostelPage() {
  const [formData, setFormData] = useState({
    name: "",
    universityId: "",
    location: "",
    price: "",
    rooms: "",
    description: "",
    gender: "MIXED",
    images: [] as string[]
  });

  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const newImages = [...formData.images];
      
      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          throw new Error(`Image ${file.name} is too large (>2MB).`);
        }

        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newImages.push(base64String);
      }

      setFormData({ ...formData, images: newImages });
      setLoading(false);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to process images." });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUniversities(data);
        } else {
          // Fallback to static list if API is empty or fails
          console.warn("API returned no universities, using fallback list.");
          setUniversities(GHANA_UNIVERSITIES);
        }
      })
      .catch(err => {
        console.error("Error fetching universities, using fallback list:", err);
        setUniversities(GHANA_UNIVERSITIES);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side payload size check
    const payloadSize = new Blob([JSON.stringify(formData)]).size;
    if (payloadSize > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ 
        type: "error", 
        text: "Total data size is too large (approx. " + (payloadSize / (1024 * 1024)).toFixed(1) + "MB). Please remove some images or use smaller files." 
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Hostel listed successfully! Redirecting..." });
        setTimeout(() => {
          window.location.href = "/owner/dashboard";
        }, 2000);
      } else {
        // Handle non-JSON responses (like 413 Payload Too Large)
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setMessage({ type: "error", text: data.error || "Failed to list hostel." });
        } else {
          setMessage({ type: "error", text: `Server error (${res.status}): The data might be too large for the server.` });
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      setMessage({ type: "error", text: "Connection error. This can happen if the images are too large for your internet connection or the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="auth-card !max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-slate-900">List Your Hostel</h1>
          <p className="text-slate-500">Provide accurate details for student verification.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-2">Hostel Name</label>
              <input type="text" placeholder="e.g. Evandy Hostel" required 
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-2">University Affiliation</label>
              <select onChange={(e) => setFormData({...formData, universityId: e.target.value})} required>
                <option value="">Select a University</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 ml-2">Location Address</label>
            <input type="text" placeholder="e.g. Ayeduase Gate, Kumasi" required 
              onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 ml-2">Hostel Description</label>
            <textarea 
              placeholder="Describe your hostel features, distance from campus, etc." 
              required 
              rows={3}
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 transition-colors bg-white mt-1"
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-2">Price (GH₵ / Year)</label>
              <input type="number" placeholder="3500" required 
                onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-2">Rooms Available</label>
              <input type="number" placeholder="12" required 
                onChange={(e) => setFormData({...formData, rooms: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 ml-2">Hostel Category</label>
            <select 
              required 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 transition-colors bg-white mt-1"
            >
              <option value="MIXED">Mixed (Male & Female)</option>
              <option value="MALE">Male Only</option>
              <option value="FEMALE">Female Only</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-slate-400 ml-2 block">Hostel Gallery (Click image to remove)</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group aspect-video rounded-xl overflow-hidden bg-slate-100 border cursor-pointer" onClick={() => removeImage(index)}>
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Delete</span>
                  </div>
                </div>
              ))}
              
              <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 hover:border-blue-300 transition-colors bg-white">
                <input type="file" className="hidden" id="gallery-upload" accept="image/*" multiple onChange={handleFileUpload} />
                <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="text-slate-300 mb-1" size={24} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Add Images</p>
                </label>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium">Tip: You can select multiple images at once. Images are stored in base64 format.</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg disabled:opacity-50">
            {loading ? "Processing..." : (
              <><Upload className="mr-2" size={20} /> List Hostel Now</>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}