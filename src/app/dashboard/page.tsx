"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, BarChart3, MoreVertical, Calendar } from "lucide-react";
import { getToken } from "@/actions/auth";
import Image from "next/image";

const DashboardAdCard = ({ ad }: any) => {
   return (
       <div className="flex bg-white rounded-[16px] border border-gray-200 overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition duration-300">
           <div className="p-5 flex items-center justify-center border-r border-gray-50 bg-gray-50/30">
               <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer" />
           </div>
           <div className="w-56 h-[140px] relative bg-gray-100 shrink-0 border-r border-gray-100 p-2">
               <div className="w-full h-full relative rounded-xl overflow-hidden shadow-inner bg-slate-200">
                   {ad.photos && ad.photos.length > 0 ? (
                       <Image src={ad.photos[0]} fill alt={`${ad.make} ${ad.model}`} className="object-cover" unoptimized/>
                   ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 border border-dashed border-gray-300">
                           <Image src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=200&auto=format&fit=crop" fill className="opacity-20 object-cover" alt="placeholder" unoptimized/>
                           <span className="relative z-10 text-xs font-bold text-slate-500 bg-white/80 px-2 py-1 rounded shadow-sm backdrop-blur-sm">No Image</span>
                       </div>
                   )}
               </div>
           </div>
           <div className="p-5 flex flex-col justify-between flex-grow">
               <div>
                   <div className="flex justify-between items-start">
                       <div>
                           <span className="inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-md mb-2 shadow-sm border border-gray-200/50">
                               {ad.status.replace("_", " ")}
                           </span>
                           <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{ad.make} {ad.model} {ad.variant}</h3>
                       </div>
                       <button className="text-gray-400 hover:text-slate-800 p-1 bg-gray-50 rounded shadow-sm border border-gray-100 transition hover:bg-gray-100">
                           <MoreVertical size={16} />
                       </button>
                   </div>
                   
                   <div className="text-sm font-semibold text-gray-500 flex items-center gap-2 mt-1">
                       <span className="text-slate-900 font-bold">₹ {ad.asking_price.toLocaleString()}</span>
                       <span>•</span>
                       <span>Last Updated: {new Date(ad.created_at).toLocaleDateString()}</span>
                   </div>
               </div>
               <div className="flex items-center justify-between mt-4">
                   <span className="text-[12px] text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                       <Calendar size={14}/> Ad expires in 30 days
                   </span>
                   {ad.status === "draft" || ad.status === "under_review" ? (
                       <Link href={`/sell?id=${ad.id}`} className="text-sm font-bold text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 shadow-sm transition">
                           {ad.status === "draft" ? "Continue Posting Ad" : "Preview Application"}
                       </Link>
                   ) : (
                       <Link href={`/cars/${ad.id}`} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 shadow-sm transition">
                           View Live Ad
                       </Link>
                   )}
               </div>
           </div>
       </div>
   )
}

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loadingAds, setLoadingAds] = useState(true);
    const [activeTab, setActiveTab] = useState("All Ads");

    const tabs = ["All Ads", "Live", "Drafts", "Payment Pending", "Under Review", "Rejected", "Expired"];

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchAds() {
            const token = await getToken();
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/v1/listings/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAds(data.items);
                }
            } catch (err) {
                console.error(err);
            }
            setLoadingAds(false);
        }
        if (user) {
            fetchAds();
        }
    }, [user]);

    if (loading || !user) return (
        <div className="w-full flex items-center justify-center p-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
    );

    const filteredAds = activeTab === "All Ads" 
        ? ads 
        : ads.filter(ad => {
            const statusMatch = ad.status.toLowerCase() === activeTab.replace(" ", "_").toLowerCase();
            const liveMatch = activeTab === "Live" && ad.status === "active";
            return statusMatch || liveMatch;
        });

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">My Ads</h1>
                <Link href="/sell" className="bg-rose-600 hover:bg-rose-700 transition text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_4px_14px_rgba(225,29,72,0.3)]">
                    Place Your Ad
                </Link>
            </div>

            {/* TABS */}
            <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-3 mb-8 no-scrollbar">
                {tabs.map(tab => {
                    const count = tab === "All Ads" ? ads.length : ads.filter(a => {
                       if (tab === "Live") return a.status === "active";
                       return a.status.toLowerCase() === tab.replace(" ", "_").toLowerCase();
                    }).length;
                    
                    return (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeTab === tab ? "bg-slate-900 text-white shadow-md" : "bg-white text-gray-500 hover:bg-gray-100 hover:text-slate-800 border border-transparent hover:border-gray-200"}`}
                        >
                            {tab}
                            <span className={`px-1.5 py-0.5 rounded text-[10px] bg-white/20 ${activeTab === tab ? "text-white" : "text-gray-400 bg-gray-100"}`}>{count}</span>
                        </button>
                    )
                })}
            </div>

            {/* UTILITY BLOCKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-blue-50/50 border border-blue-100/50 rounded-[20px] p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/20"></div>
                            <BadgeCheck size={24} className="relative z-10" />
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-black text-[16px]">Become a verified user</h4>
                            <p className="text-gray-500 font-semibold text-[13px] mt-0.5">Get more visibility • Enhance your credibility</p>
                        </div>
                    </div>
                    <button className="bg-white border border-gray-200 shadow-sm px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-gray-50 hover:text-slate-900 transition shrink-0 w-full sm:w-auto">
                        Get Started
                    </button>
                </div>
                
                <div className="bg-gradient-to-r from-slate-50 to-rose-50/30 border border-gray-100 rounded-[20px] p-6 flex items-center justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h4 className="text-slate-900 font-black text-[16px]">Get detailed insights for your ads</h4>
                           <span className="bg-rose-600 text-white text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded shadow-sm">New</span>
                        </div>
                        <p className="text-gray-500 font-semibold text-[13px]">See how many people are interested in your ad</p>
                    </div>
                    <div className="bg-white text-slate-800 w-14 h-14 rounded-full flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                        <BarChart3 size={24} className="text-rose-500" />
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-1 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{filteredAds.length} ads selected</span>
                    </div>
                </div>
                
                {loadingAds ? (
                    <div className="flex items-center justify-center p-20 text-gray-400 font-semibold gap-3">
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600"></div> Fetching inventory...
                    </div>
                ) : filteredAds.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-[24px] p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                           <Calendar size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No {activeTab.toLowerCase()} ads found</h3>
                        <p className="text-gray-500 text-[15px] font-medium max-w-sm mb-8">You don't have any ads matching this category. Ready to sell your vehicle?</p>
                        <Link href="/sell" className="bg-slate-900 shadow-md text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition">Place an Ad</Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {filteredAds.map((ad: any) => (
                            <DashboardAdCard key={ad.id} ad={ad} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
