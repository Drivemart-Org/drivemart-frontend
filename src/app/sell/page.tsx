"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Camera, ChevronRight, Loader2, X } from "lucide-react";
import { getToken } from "@/actions/auth";

export default function SellPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        city: "Mumbai",
        make: "",
        model: "",
        variant: "",
        year: new Date().getFullYear().toString(),
        mileage_km: "",
        fuel_type: "petrol",
        transmission: "automatic",
        asking_price: "",
        phone: "",
        title: "",
        description: "",
        photos: [] as string[]
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/sell");
        }
    }, [user, loading, router]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: any) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        setUploading(true);
        const token = await getToken();
        
        for (const file of files) {
            const formPayload = new FormData();
            formPayload.append("file", file as Blob);
            
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/v1/upload/`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formPayload
                });
                if (res.ok) {
                    const data = await res.json();
                    if(data.url) {
                        setFormData(prev => ({ ...prev, photos: [...prev.photos, data.url] }));
                    }
                }
            } catch (err) {
                console.error("Upload failed", err);
            }
        }
        setUploading(false);
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const submitListing = async () => {
        setSubmitting(true);
        const token = await getToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/v1/listings/`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    make: formData.make,
                    model: formData.model,
                    variant: formData.variant,
                    year: parseInt(formData.year) || 2024,
                    mileage_km: parseInt(formData.mileage_km) || 0,
                    fuel_type: formData.fuel_type,
                    transmission: formData.transmission,
                    asking_price: parseInt(formData.asking_price) || 0,
                    city: formData.city,
                    locality: null,
                    description: formData.description || formData.title,
                    photos: formData.photos
                })
            });
            
            if (res.ok) {
                const responseData = await res.json();
                router.push(`/pay/${responseData.id}`);
            } else {
                console.error(await res.json());
            }
        } catch (err) {
            console.error("Submission failed", err);
        }
        setSubmitting(false);
    };

    if (loading || !user) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-rose-600" size={32} /></div>;

    return (
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-[26px] font-black text-slate-900 tracking-tight mb-2">
                    {step === 1 ? "Tell us about your car" : "You're almost there!"}
                </h1>
                {step === 2 && (
                    <p className="text-gray-500 font-semibold text-sm max-w-sm mx-auto">
                        Include as much details and pictures as possible, and set the right price!
                    </p>
                )}
            </div>

            {/* Breadcrumbs */}
            <div className="flex justify-center items-center gap-2 text-[11px] font-bold text-gray-400 mb-8 w-full max-w-sm mx-auto uppercase tracking-wider">
                <span className="text-blue-500 cursor-pointer hover:underline">Motors</span>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-slate-800">Cars</span>
            </div>

            {/* Form Box */}
            <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden mb-8">
                
                {step === 1 ? (
                    <div className="p-5 sm:p-10 space-y-6">
                        
                        {/* Notice */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50 flex flex-col justify-center items-center text-center shadow-inner">
                            <p className="text-[13px] font-bold text-slate-800">Selling more than one car?</p>
                            <p className="text-[12px] text-gray-500 mt-1 font-semibold">Save with our business packages! <span className="text-blue-600 cursor-pointer hover:underline font-bold">Learn More</span></p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">City *</label>
                                <select name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]">
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Pune">Pune</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Make *</label>
                                    <input name="make" value={formData.make} onChange={handleInputChange} placeholder="e.g. BMW" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Model *</label>
                                    <input name="model" value={formData.model} onChange={handleInputChange} placeholder="e.g. X5" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Trim *</label>
                                <input name="variant" value={formData.variant} onChange={handleInputChange} placeholder="e.g. M Sport" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Year *</label>
                                    <select name="year" value={formData.year} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]">
                                        {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Kilometers *</label>
                                    <input type="number" name="mileage_km" value={formData.mileage_km} onChange={handleInputChange} placeholder="0" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition pr-12 shadow-sm text-[15px]" />
                                    <span className="absolute right-4 top-10 text-gray-400 font-black text-xs uppercase pt-0.5">km</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Fuel Type *</label>
                                    <select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]">
                                        <option value="petrol">Petrol</option>
                                        <option value="diesel">Diesel</option>
                                        <option value="electric">Electric</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Transmission *</label>
                                    <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]">
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 space-y-5">
                                <div className="relative">
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Price *</label>
                                    <input type="number" name="asking_price" value={formData.asking_price} onChange={handleInputChange} placeholder="0" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition pr-16 shadow-sm text-[15px]" />
                                    <span className="absolute right-4 top-10 text-gray-400 font-black text-xs uppercase pt-0.5">INR</span>
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded flex justify-between">
                                        Phone number *
                                    </label>
                                    <div className="flex shadow-sm rounded-lg">
                                        <div className="bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg px-4 py-3 text-slate-800 font-black text-sm pt-3.5">+91</div>
                                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className="w-full border border-gray-300 rounded-r-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition text-[15px]" />
                                    </div>
                                    <p className="text-rose-600 text-[10px] font-bold mt-1.5 ml-1">This field is required.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="p-5 sm:p-10 space-y-8">
                        {/* Summary Block */}
                        <div className="bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100 relative shadow-inner">
                            <button onClick={() => setStep(1)} className="absolute top-6 right-6 text-sm font-black text-rose-600 hover:text-rose-700 transition tracking-wide hover:underline cursor-pointer">Edit</button>
                            <h3 className="text-[15px] font-black text-slate-900 mb-6 tracking-tight">Listing Summary</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] md:grid-cols-[140px_1fr] gap-y-2 sm:gap-y-4 font-bold text-[13px]">
                                <span className="text-gray-500 font-semibold tracking-wide">Make & Model</span>
                                <span className="text-slate-800">{formData.make} {formData.model}</span>
                                <span className="text-gray-500 font-semibold tracking-wide">Trim</span>
                                <span className="text-slate-800">{formData.variant || "-"}</span>
                                <span className="text-gray-500 font-semibold tracking-wide">Year</span>
                                <span className="text-slate-800">{formData.year}</span>
                                <span className="text-gray-500 font-semibold tracking-wide">Kilometers</span>
                                <span className="text-slate-800">{parseInt(formData.mileage_km || "0").toLocaleString()} km</span>
                                <span className="text-gray-500 font-semibold tracking-wide">Price</span>
                                <span className="text-slate-800">₹ {parseInt(formData.asking_price || "0").toLocaleString()}</span>
                                <span className="text-gray-500 font-semibold tracking-wide">Phone number</span>
                                <span className="text-slate-800">+91 {formData.phone}</span>
                            </div>
                        </div>

                        {/* Picture Dropzone */}
                        <div>
                            <label className="mb-4 text-rose-600 font-black text-sm flex items-center justify-center py-6 px-4 bg-white hover:bg-rose-50 border-2 border-dashed border-rose-200 rounded-xl cursor-pointer transition select-none shadow-sm h-32">
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-3 text-rose-500"><Loader2 className="animate-spin flex-shrink-0" size={24} /> <span>Uploading Media...</span></div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2"><Camera size={24} className="mb-1" /> Add Pictures</div>
                                )}
                                <input type="file" multiple accept="image/*" className="hidden" disabled={uploading} onChange={handleFileUpload} />
                            </label>

                            {formData.photos.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4 bg-white p-2 rounded-lg border border-gray-100">
                                    {formData.photos.map((url, i) => (
                                        <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={url} alt="upload" className="w-full h-full object-cover" />
                                            <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-rose-600 shadow-sm border border-white/20">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Title *</label>
                                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Mint Condition Abarth 124" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition shadow-sm text-[15px]" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative bg-white px-1 w-fit -bottom-2.5 left-2 z-10 rounded">Describe your item *</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter a rich engaging description for buyers..." rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition resize-y shadow-sm text-[14px]"></textarea>
                            </div>
                        </div>

                    </div>
                )}

                {/* Footer Buttons */}
                <div className="px-6 sm:px-10 py-6 bg-white border-t border-gray-100 flex flex-col items-center">
                    {step === 1 ? (
                        <button 
                            disabled={!formData.make || !formData.model || !formData.asking_price}
                            onClick={() => setStep(2)}
                            className="w-full bg-[#E00000] text-white font-black text-[15px] py-4 rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(224,0,0,0.3)] tracking-wide"
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            disabled={submitting || uploading}
                            onClick={submitListing}
                            className="w-full bg-[#E00000] flex justify-center items-center text-white font-black text-[15px] py-4 rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(224,0,0,0.3)] tracking-wide"
                        >
                            {submitting ? <Loader2 className="animate-spin text-white" size={20} /> : "Post Ad"}
                        </button>
                    )}
                    <p className="text-[11px] text-gray-400 font-bold mt-5 tracking-wide">Questions? Call <span className="text-blue-500 hover:underline cursor-pointer">DriveMart Support</span></p>
                </div>

            </div>
        </div>
    );
}
