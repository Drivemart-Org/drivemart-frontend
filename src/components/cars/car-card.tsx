"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Gauge, Heart, MapPin } from "lucide-react";

interface CarCardProps {
  id: string;
  price: string;
  title: string;
  year: string;
  km: string;
  loc: string;
  image: string;
  dealer?: { id: string; dealership_name: string } | string;
  premium?: boolean;
  tag?: string;
}

export default function CarCard({ id, price, title, year, km, loc, image, dealer, premium = false, tag }: CarCardProps) {

  const router = useRouter();

  const handleDealerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dealer && typeof dealer === 'object' && dealer.id) {
       router.push(`/dealers/${dealer.id}`);
    }
  };

  return (
    <Link href={id ? `/cars/${id}` : "/cars"} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col group relative block cursor-pointer">

      {/* Immersive Image Header */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden p-2">
        <div className="relative w-full h-full rounded-[18px] overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" unoptimized />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-1.5">
          {premium && (
            <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-md">
              Premium
            </span>
          )}
          {tag && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-md">
              {tag}
            </span>
          )}
        </div>
        <button className="absolute top-5 right-5 text-white/90 hover:text-rose-500 transition-colors drop-shadow-md bg-black/20 backdrop-blur-md p-1.5 rounded-full hover:bg-white">
          <Heart size={18} strokeWidth={2.5} />
        </button>

        {/* Immersive location over image */}
        <div className="absolute bottom-5 left-5 text-white font-semibold text-xs flex items-center gap-1 drop-shadow-md">
          <MapPin size={14} className="text-white/80" /> {loc}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">{price}</h3>
        </div>

        <p className="text-slate-700 text-[16px] font-bold mb-4">{title}</p>

        <div className="flex items-center gap-4 text-[13px] text-gray-500 font-semibold mb-6">
          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Calendar size={14} className="text-gray-400" /> {year}</span>
          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Gauge size={14} className="text-gray-400" /> {km}</span>
        </div>
      </div>

      {dealer && (
        <div 
          onClick={handleDealerClick}
          className="px-5 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between mt-auto hover:bg-slate-100 transition-colors z-10 relative cursor-pointer"
        >
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sold By</span>
          <div className="text-slate-800 font-black text-[12px] px-2 py-1 rounded shadow-sm tracking-tight border border-gray-200 bg-white">
            {typeof dealer === 'object' ? dealer.dealership_name : dealer}
          </div>
        </div>
      )}
    </Link>
  );
}
