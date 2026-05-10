"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldCheck, CheckCircle } from "lucide-react";
import { getToken } from "@/actions/auth";

export default function PaymentPage({ params }: { params: { id: string } }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [listing, setListing] = useState<any>(null);
    const [loadingListing, setLoadingListing] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/pay/" + params.id);
        }
    }, [user, loading, router, params.id]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/listings/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setListing(data);
                } else {
                    console.error("Listing not found");
                }
            } catch (err) {
                console.error("Error fetching listing", err);
            }
            setLoadingListing(false);
        };
        if (user) {
            fetchListing();
        }
    }, [params.id, user]);

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setProcessing(true);
        const token = await getToken();
        
        try {
            // 1. Create order on backend
            const orderRes = await fetch("http://localhost:8000/api/v1/payments/create-order", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ listing_id: params.id })
            });
            
            if (!orderRes.ok) {
                throw new Error("Failed to create order");
            }
            
            const orderData = await orderRes.json();

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyId", // Needs to be configured in .env.local
                amount: orderData.amount,
                currency: orderData.currency,
                name: "DriveMart",
                description: `Listing Fee for ${listing.make} ${listing.model}`,
                image: "https://example.com/your_logo",
                order_id: orderData.razorpay_order_id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch("http://localhost:8000/api/v1/payments/verify", {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` 
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            listing_id: params.id
                        })
                    });
                    
                    if (verifyRes.ok) {
                        setSuccess(true);
                        setTimeout(() => {
                            router.push("/dashboard");
                        }, 2000);
                    } else {
                        alert("Payment verification failed. Please contact support.");
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#E00000"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any){
                alert(response.error.description);
                setProcessing(false);
            });
            rzp.open();
            
        } catch (error) {
            console.error("Payment initialization failed", error);
            setProcessing(false);
        }
    };

    if (loading || loadingListing) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-rose-600" size={32} /></div>;
    
    if (!listing) return <div className="p-20 text-center text-gray-500 font-semibold">Listing not found</div>;

    if (success) {
        return (
            <div className="max-w-[500px] mx-auto px-4 py-20 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-500 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 font-semibold text-center mb-8">Your listing has been submitted and is currently under review by our admin team.</p>
                <div className="flex items-center gap-2 text-rose-600 font-bold animate-pulse">
                    <Loader2 className="animate-spin" size={16} /> Redirecting to Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-500">
            <h1 className="text-[26px] font-black text-slate-900 tracking-tight mb-8">Complete your Payment</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column - Listing Summary */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-48 aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            {listing.photos && listing.photos.length > 0 ? (
                                <img src={listing.photos[0]} alt="Car" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">No Image</div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{listing.year}</span>
                            <h2 className="text-xl font-black text-slate-900 mb-2">{listing.make} {listing.model} {listing.variant}</h2>
                            <p className="text-gray-500 text-sm font-semibold mb-4">{listing.city}</p>
                            <div className="inline-block bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-100">
                                Asking: ₹{listing.asking_price.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Payment Summary */}
                <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 p-6 sm:p-8 sticky top-24">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center text-[15px] text-gray-600 font-semibold">
                            <span>Standard Listing Fee</span>
                            <span>₹99.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[15px] text-gray-600 font-semibold">
                            <span>Taxes</span>
                            <span>₹0.00</span>
                        </div>
                        <div className="h-px bg-gray-100 w-full my-2"></div>
                        <div className="flex justify-between items-center text-[18px] text-slate-900 font-black">
                            <span>Total</span>
                            <span>₹99.00</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-3 mb-8">
                        <ShieldCheck className="text-green-500 flex-shrink-0" size={24} />
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                            Your payment is secured by Razorpay 128-bit encryption. Safe and reliable transactions.
                        </p>
                    </div>

                    <button 
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full bg-[#E00000] flex justify-center items-center text-white font-black text-[15px] py-4 rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(224,0,0,0.3)] tracking-wide"
                    >
                        {processing ? <Loader2 className="animate-spin text-white" size={20} /> : "Proceed to Pay ₹99.00"}
                    </button>
                </div>
            </div>
        </div>
    );
}
