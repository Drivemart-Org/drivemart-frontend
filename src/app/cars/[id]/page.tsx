"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Heart,
  Share2,
  Calendar,
  Gauge,
  Info,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ChevronDown
} from "lucide-react";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/v1/listings`;

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCar(data);
        }
      } catch (err) {
        console.error("Failed to fetch car detail", err);
      }
      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  const toggleFeature = (category: string) => {
    setExpandedFeatures(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const formatting = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Car Not Found</h1>
        <p className="text-slate-500 mb-6">The listing you're looking for might have been removed or sold.</p>
        <Link href="/cars" className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl">Back to Search</Link>
      </div>
    );
  }

  // Fallback to empty features if null
  const features = car.features || {
    "Driver Assistance & Safety": ["Anti-Lock Brakes (ABS)", "Airbags", "Rear View Camera"],
    "Comfort & Convenience": ["Air Conditioning", "Keyless Entry"]
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-[#f8f9fa] min-h-screen">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-6">
        <Link href="/cars" className="text-blue-600 hover:underline flex items-center gap-1">
          <ChevronRight className="rotate-180" size={16} /> Back To Search
        </Link>
        <span>•</span>
        <span className="text-gray-400">All India</span>
        <span><ChevronRight size={14} className="text-gray-400" /></span>
        <span className="text-gray-400">Motors</span>
        <span><ChevronRight size={14} className="text-gray-400" /></span>
        <span className="text-gray-400">{car.make}</span>
        <span><ChevronRight size={14} className="text-gray-400" /></span>
        <span className="text-slate-800">{car.model}</span>
      </nav>

      {/* Hero Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:h-[500px] mb-8 rounded-2xl overflow-hidden">
        {/* Main large image */}
        <div className="relative md:col-span-2 h-[300px] md:h-full bg-gray-200 group cursor-pointer overflow-hidden">
           {car.photos && car.photos.length > 0 ? (
             <Image src={car.photos[0]} fill alt={car.title || car.make} className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400"><Info /></div>
           )}
           <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded text-white text-xs font-bold tracking-widest uppercase">
             Inspection Passed
           </div>
        </div>
        {/* Sub images column */}
        <div className="hidden md:flex flex-col gap-3 h-full">
           <div className="relative flex-1 bg-gray-200 overflow-hidden cursor-pointer group rounded-tr-2xl">
              {car.photos && car.photos.length > 1 ? (
                <Image src={car.photos[1]} fill alt="Interior" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
              )}
           </div>
           <div className="relative flex-1 bg-gray-200 overflow-hidden cursor-pointer group rounded-br-2xl">
              {car.photos && car.photos.length > 2 ? (
                <>
                  <Image src={car.photos[2]} fill alt="Rear view" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                  {car.photos.length > 3 && (
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xl backdrop-blur-sm">
                       +{car.photos.length - 3}
                     </div>
                  )}
                </>
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
              )}
           </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: DETAILS */}
        <div className="flex-1 max-w-4xl space-y-8">
          
          {/* Header & Title Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-2">
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                 {formatting.format(car.asking_price)}
               </h1>
               <div className="flex gap-2">
                 <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold text-slate-700 transition"><Heart size={16} /> Favorite</button>
                 <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold text-slate-700 transition"><Share2 size={16} /> Share</button>
               </div>
             </div>
             
             <h2 className="text-lg font-bold text-slate-700 mb-4">{car.make} {car.model} {car.variant}</h2>
             
             <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-600 mb-6">
               <span className="flex items-center gap-1.5"><Calendar size={18} className="text-gray-400"/> {car.year}</span>
               <span className="flex items-center gap-1.5"><Gauge size={18} className="text-gray-400"/> {car.mileage_km.toLocaleString()} km</span>
               <span className="flex items-center gap-1.5"><MapPin size={18} className="text-gray-400"/> {car.city} Specs</span>
             </div>

             <div className="text-xs text-gray-400 font-medium">Posted on: {new Date(car.created_at).toLocaleDateString()}</div>
          </div>

          {/* Car Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-xl font-black text-slate-900 mb-6 border-b border-gray-100 pb-4">Car Overview</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Fuel Type</p>
                   <p className="text-[15px] text-slate-800 font-semibold">{car.fuel_type}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Transmission</p>
                   <p className="text-[15px] text-slate-800 font-semibold">{car.transmission}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Owner</p>
                   <p className="text-[15px] text-slate-800 font-semibold">{car.ownership_count}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Color</p>
                   <p className="text-[15px] text-slate-800 font-semibold">{car.color || 'N/A'}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Body Type</p>
                   <p className="text-[15px] text-slate-800 font-semibold">SUV</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Seating</p>
                   <p className="text-[15px] text-slate-800 font-semibold">5 Seater</p>
                </div>
             </div>
          </div>

          {/* Features Accordion */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-xl font-black text-slate-900 mb-6 pb-2">Features</h3>
             
             <div className="space-y-4">
                {Object.entries(features).map(([category, items]: [string, any]) => (
                  <div key={category} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <button 
                      onClick={() => toggleFeature(category)}
                      className="w-full flex justify-between items-center py-2 focus:outline-none group"
                    >
                      <span className="font-bold text-slate-800 group-hover:text-rose-600 transition">{category}</span>
                      <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                        <span className="bg-gray-50 px-2 py-0.5 rounded">{items.length}</span>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${expandedFeatures[category] ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {expandedFeatures[category] !== false && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mt-4 pl-2">
                        {items.map((item: string, idx: number) => (
                           <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                             <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                             {item}
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-slate-900 mb-4 border-b border-gray-100 pb-4">Description</h3>
            <div className="prose prose-slate max-w-none font-medium text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {car.description || "No detailed description provided by the seller."}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SELLER STICKY SIDEBAR */}
        <aside className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-28 space-y-6">
            
            {/* Dealer/Seller Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 p-6 border border-gray-100">
               {car.dealer ? (
                 <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                       {car.dealer.logo_url ? (
                         <Image src={car.dealer.logo_url} width={64} height={64} alt="Dealer" className="object-contain" />
                       ) : (
                         <span className="text-xl font-black text-slate-400">{car.dealer.dealership_name[0]}</span>
                       )}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                        {car.dealer.dealership_name} <CheckCircle2 size={16} className="text-blue-500" />
                      </h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Verified Dealer</p>
                      <Link href={`/dealers/${car.dealer.id}`} className="text-blue-600 text-sm font-bold mt-1 inline-block hover:underline">View All Cars</Link>
                    </div>
                 </div>
               ) : (
                 <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-xl font-bold text-white">I</span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">Individual Seller</h4>
                      <p className="text-xs font-semibold text-gray-500">Member since 2023</p>
                    </div>
                 </div>
               )}

               {/* CTA Buttons */}
               <div className="space-y-3">
                 <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2">
                   <Phone size={18} /> Show Phone Number
                 </button>
                 <button className="w-full bg-white border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                   <MessageCircle size={18} /> WhatsApp
                 </button>
                 <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-slate-800 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
                   <MessageCircle size={18} /> Chat With Seller
                 </button>
               </div>
            </div>

            {/* Trust Banner Widget mimicking Dubizzle ad block */}
            <div className="bg-gradient-to-br from-[#eff6ff] to-[#e0e7ff] rounded-2xl p-6 border border-blue-100 flex items-center gap-4 shadow-sm relative overflow-hidden group">
               <div className="relative z-10 w-2/3">
                 <h4 className="text-base font-black text-slate-900 mb-1">Become a verified user</h4>
                 <p className="text-[11px] font-semibold text-slate-600 leading-snug mb-3">Verified buyers gain instant trust from sellers & priority responses.</p>
                 <button className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg">Get Started</button>
               </div>
               <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition duration-500">
                  <ShieldCheck size={120} className="text-blue-600" />
               </div>
               {/* Small floating badge */}
               <div className="absolute top-6 right-6 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center z-20">
                  <span className="text-xl">🛡️</span>
               </div>
            </div>
            
          </div>
        </aside>

      </div>
    </div>
  );
}
