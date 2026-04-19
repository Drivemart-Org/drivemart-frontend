"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import CarCard from "@/components/cars/car-card";
import { CheckCircle2, MapPin, Search, Star, Phone } from "lucide-react";

const API_URL = "http://localhost:8000/api/v1/dealers";

export default function DealerProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDealer() {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch dealer", err);
      }
      setLoading(false);
    }
    fetchDealer();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!data || !data.dealer) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center bg-[#f8f9fa]">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Dealer Not Found</h1>
        <p className="text-slate-500">This dealer profile does not exist or has been removed.</p>
      </div>
    );
  }

  const { dealer, listings } = data;

  const formatting = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-140px)]">
      
      {/* Premium Dealer Header */}
      <div className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-rose-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
           {/* Logo Badge */}
           <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center shrink-0 border-4 border-slate-900 relative">
              {dealer.logo_url ? (
                <Image src={dealer.logo_url} width={120} height={120} alt={dealer.dealership_name} className="object-contain" />
              ) : (
                <span className="text-5xl font-black text-slate-400">{dealer.dealership_name[0]}</span>
              )}
              <div className="absolute -bottom-3 -right-3 bg-blue-500 text-white rounded-full p-1.5 shadow-lg border-2 border-slate-900">
                 <CheckCircle2 size={24} />
              </div>
           </div>

           {/* Dealer Details */}
           <div className="flex-1 text-center md:text-left">
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex flex-col md:flex-row items-center gap-3">
               {dealer.dealership_name}
               <span className="bg-white/10 text-rose-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border border-white/10 whitespace-nowrap">
                 Platinum Partner
               </span>
             </h1>
             
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300 font-semibold mb-6">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-rose-500" /> {dealer.city || 'United Arab Emirates'}</span>
                <span className="flex items-center gap-1.5 text-yellow-400"><Star size={16} fill="currentColor" /> 4.9 (120+ Reviews)</span>
             </div>
             
             <p className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed hidden md:block">
               {dealer.description || "The leading marketplace destination for premium used vehicles. We pride ourselves on transparent histories, rigorous checking, and uncompromised customer service."}
             </p>
           </div>
           
           {/* Contact Action */}
           <div className="w-full md:w-auto shrink-0 space-y-3">
              <button className="w-full md:w-[240px] bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition flex items-center justify-center gap-2">
                 <Phone size={18} /> Contact Dealership
              </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Inventory <span className="text-gray-400 font-semibold text-lg ml-2">({listings.length})</span></h2>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No active listings</h3>
            <p className="text-gray-500 max-w-sm">This dealer doesn't have any vehicles available for sale right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((car: any) => (
              <CarCard
                key={car.id}
                id={car.id}
                price={formatting.format(car.asking_price)}
                title={`${car.make} ${car.model} ${car.variant || ""}`.trim()}
                year={car.year}
                km={`${(car.mileage_km / 1000).toFixed(1)}k km`}
                loc={car.city}
                image={car.photos && car.photos.length > 0 ? car.photos[0] : "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=600&auto=format&fit=crop"}
                premium={car.asking_price > 5000000}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
