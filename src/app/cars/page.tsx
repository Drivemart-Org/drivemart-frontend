"use client";

import React, { useState, useEffect } from "react";
import CarCard from "@/components/cars/car-card";
import { Filter, Search, ChevronDown, Check } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:8000/api/v1/listings/search";

export default function CarsPageWrapper() {
  return (
    <React.Suspense fallback={<div className="w-full h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div></div>}>
      <CarsPage />
    </React.Suspense>
  );
}

function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [brand, setBrand] = useState(searchParams.get("make") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "date_desc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const sortOptions = [
    { label: "Newest to Oldest", value: "date_desc" },
    { label: "Oldest to Newest", value: "date_asc" },
    { label: "Price Highest to Lowest", value: "price_desc" },
    { label: "Price Lowest to Highest", value: "price_asc" },
    { label: "Kilometers Highest to Lowest", value: "km_desc" },
    { label: "Kilometers Lowest to Highest", value: "km_asc" },
    { label: "Year Highest to Lowest", value: "year_desc" },
    { label: "Year Lowest to Highest", value: "year_asc" },
  ];

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("q", keyword);
      if (brand) params.append("make", brand);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (sort) params.append("sort", sort);

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCars(data.items);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch cars", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCars();
      
      // Update URL to match state
      const params = new URLSearchParams();
      if (keyword) params.append("q", keyword);
      if (brand) params.append("make", brand);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (sort) params.append("sort", sort);
      router.replace(`/cars?${params.toString()}`, { scroll: false });
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, brand, minPrice, maxPrice, sort]);

  const formatting = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-black text-slate-900">Used Cars</h1>
        <button 
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="bg-white border border-gray-200 text-slate-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm"
        >
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* LEFT SIDEBAR - FILTERS */}
      <aside className={`w-full md:w-[320px] shrink-0 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 ${showFiltersMobile ? 'block' : 'hidden md:block'} self-start md:sticky md:top-28`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900">Filters</h2>
          <button 
            onClick={() => { setKeyword(""); setBrand(""); setMinPrice(""); setMaxPrice(""); }}
            className="text-sm font-bold text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        {/* Keyword Search */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Keyword</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. AMG, Sunroof" 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium"
            />
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Make (Brand)</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {["Mercedes-Benz", "BMW", "Audi", "Toyota", "Hyundai", "Tata", "Mahindra", "Kia", "Honda", "Maruti Suzuki"].map(b => (
              <label key={b} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${brand === b ? 'bg-rose-600 border-rose-600' : 'border-gray-300 group-hover:border-rose-400'}`}>
                   {brand === b && <Check size={14} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={brand === b}
                  onChange={() => setBrand(brand === b ? "" : b)} 
                />
                <span className={`text-sm font-medium ${brand === b ? 'text-slate-900' : 'text-gray-600'}`}>{b}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Price Range (INR)</label>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium"
            />
            <span className="text-gray-400 font-medium">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium"
            />
          </div>
        </div>
        
        {/* Placeholder for Year, Mileage etc to show premium completeness */}
        <div className="mb-2 border-t border-gray-100 pt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3 text-opacity-50">More Filters (Coming Soon)</label>
        </div>

      </aside>

      {/* RIGHT CONTENT - GRID LISTINGS */}
      <div className="flex-1 w-full flex flex-col">
        <div className="hidden md:flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {brand ? `Used ${brand} Cars in India` : "Used Cars for sale in India"}
            </h1>
            <p className="text-gray-500 font-medium mt-1">Showing {total} results matching your criteria</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-slate-700 hover:bg-gray-50"
            >
              Sort: {sortOptions.find(o => o.value === sort)?.label || "Newest to Oldest"} <ChevronDown size={16} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50">
                {sortOptions.map(option => (
                  <button 
                    key={option.value}
                    onClick={() => { setSort(option.value); setIsSortOpen(false); }}
                    className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${sort === option.value ? 'text-rose-600 font-bold bg-rose-50/50' : 'text-slate-600 font-semibold'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="w-full bg-white border border-gray-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No cars found</h3>
            <p className="text-gray-500 max-w-sm">We couldn't find any listings matching your current filters. Try removing some filters to see more results.</p>
            <button 
              onClick={() => { setKeyword(""); setBrand(""); setMinPrice(""); setMaxPrice(""); }}
              className="mt-8 bg-rose-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-rose-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                price={formatting.format(car.asking_price)}
                title={`${car.make} ${car.model} ${car.variant || ""}`.trim()}
                year={car.year}
                km={`${(car.mileage_km / 1000).toFixed(1)}k km`}
                loc={car.city}
                image={car.photos && car.photos.length > 0 ? car.photos[0] : "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=600&auto=format&fit=crop"}
                dealer={car.seller_id ? "Verified Seller" : undefined}
                premium={car.asking_price > 5000000}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
