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
    images: [""]
  });

  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const addImageInput = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      // Add the uploaded url to the images array replacing the first empty string if any, else append
      const newImages = [...formData.images];
      const emptyIndex = newImages.findIndex(url => url === "");
      if (emptyIndex !== -1) {
        newImages[emptyIndex] = data.url;
      } else {
        newImages.push(data.url);
      }
      setFormData({ ...formData, images: newImages });
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to upload image. Please try again." });
    } finally {
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
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to list hostel." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
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

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-slate-400 ml-2 block">Hostel Gallery (Image URLs)</label>
            {formData.images.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={`Image URL #${index + 1}`} 
                  value={url}
                  onChange={(e) => updateImage(index, e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
            <button 
              type="button" 
              onClick={addImageInput}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              + Add More Images
            </button>
            
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-300 transition-colors">
              <input type="file" className="hidden" id="thumbnail-upload" accept="image/*" onChange={handleFileUpload} />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-2 text-slate-300" size={32} />
                <p className="text-sm font-bold text-slate-500">Upload Thumbnail</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
              </label>
            </div>
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