import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, Calendar, Gauge, Settings, Heart, MapPin, Sparkles, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full pb-20">

      {/* 1. HERO SECTION (Unique Modern Floating Layout) */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mt-6">
        <div className="relative w-full h-[550px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-end">
          {/* Background Image Wrapper */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
              alt="Dubai Hero Skyline"
              fill
              className="object-cover object-center scale-100 animate-[pulse_20s_ease-in-out_infinite] opacity-90"
              priority
              unoptimized
            />
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 w-full px-8 pb-16 lg:pb-20 lg:px-16 flex flex-col items-start max-w-4xl">
            <span className="bg-rose-600/20 text-rose-300 border border-rose-500/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2 backdrop-blur-md">
              <Sparkles size={14} /> Premium Marketplace
            </span>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-balance">
              Find the perfect car.<br />
              <span className="text-gray-300 font-light">Without the perfect hassle.</span>
            </h1>

            {/* Glassmorphic Search Widget */}
            <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl p-2 sm:p-2.5 shadow-2xl border border-white/20 mt-4">

              <div className="flex items-center gap-2 mb-2 px-3 pt-2">
                <button className="text-white font-bold text-sm bg-white/20 px-4 py-1.5 rounded-full">Buy Used</button>
                {/* <button className="text-white/60 font-semibold text-sm hover:text-white px-4 py-1.5 rounded-full transition-colors">Buy New</button> */}
                <div className="ml-auto flex items-center gap-1 text-white/50 text-xs font-medium">
                  <MapPin size={12} /> All India
                </div>
              </div>

              <div className="flex items-center bg-white rounded-xl h-14 sm:h-16 pl-5 pr-2 shadow-inner group">
                <Search className="text-gray-400 group-focus-within:text-rose-500 transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="BMW, Mercedes, SUV, under 10L..."
                  className="flex-grow h-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-slate-800 text-[17px] placeholder-gray-400 font-medium"
                />
                <button className="bg-slate-900 hover:bg-black text-white h-11 sm:h-12 px-8 rounded-lg font-bold text-[15px] transition-colors shadow-sm hidden sm:block">
                  Search Cars
                </button>
                <button className="bg-slate-900 text-white h-11 w-11 rounded-lg flex items-center justify-center sm:hidden">
                  <Search size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* 2. VALUE PROPS ROW (Distinct from Dubizzle) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Dealers</h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">Connect with hundreds of platinum partners to find your ideal car, thoroughly vetted for trust.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Sell Lightning Fast</h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">List your car in 3 easy steps. Get offers from serious buyers instantly with our boosted ads.</p>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">Need cash for your car?</h3>
              <p className="text-gray-400 leading-relaxed text-[15px] mb-8">Get a free valuation in 2 minutes.</p>
              <Link href="/sell" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm inline-flex items-center gap-2 text-sm">
                Evaluate Now <ChevronRight size={16} />
              </Link>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-600/20 blur-3xl rounded-full"></div>
          </div>
        </section>

        {/* 3. BRAND CHIPS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore by Brand</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <BrandPill name="Maruti Suzuki" count="5k+" />
            <BrandPill name="Hyundai" count="3.2k+" />
            <BrandPill name="Tata" count="2.8k+" />
            <BrandPill name="Mahindra" count="2.1k+" />
            <BrandPill name="Toyota" count="1.8k+" />
            <BrandPill name="Honda" count="1.4k+" />
            <BrandPill name="Kia" count="945" />
            <BrandPill name="BMW" count="432" active />
            <BrandPill name="Mercedes-Benz" count="842" />
          </div>
        </section>

        {/* 4. PREMIUM LISTINGS GRID */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Handpicked Deliveries</h2>
              <p className="text-gray-500 font-medium mt-1">Showing exactly what you dream of driving.</p>
            </div>
            <Link href="/cars" className="hidden sm:flex items-center gap-1 text-rose-600 font-bold hover:text-rose-700 transition-colors">
              View Collection <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <CarCard
              price="₹ 14,50,000"
              title="Hyundai Creta SX Opt"
              year="2022" km="23k km" loc="Mumbai"
              image="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop"
              dealer="Auto Prime"
              tag="Great Value"
            />
            <CarCard
              price="₹ 22,90,000"
              title="Tata Harrier XZA Plus"
              year="2021" km="45k km" loc="Bangalore"
              image="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop"
              dealer="Royal Motors"
            />
            <CarCard
              price="₹ 44,20,000"
              title="Mercedes-Benz E-Class"
              year="2023" km="12k km" loc="Delhi"
              image="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop"
              dealer="Velocity Cars"
              premium
            />
            <CarCard
              price="₹ 18,50,000"
              title="Mahindra XUV700 AX7"
              year="2022" km="32k km" loc="Pune"
              image="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=600&auto=format&fit=crop"
              dealer="Drive Link"
            />
          </div>

          <div className="mt-16 flex justify-center sm:hidden">
            <Link href="/cars" className="bg-slate-900 border text-white px-8 py-3.5 rounded-xl font-bold w-full text-center">
              Explore Collection
            </Link>
          </div>

        </section>

      </div>
    </div>
  );
}

function BrandPill({ name, count, active = false }: { name: string, count: string, active?: boolean }) {
  return (
    <Link href={`/cars?brand=${encodeURIComponent(name)}`} className={`rounded-xl px-5 py-3 text-sm font-bold flex flex-col items-center gap-1 transition-all shadow-sm border
      ${active ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-105' : 'bg-white border-gray-200 text-slate-700 hover:border-gray-300 hover:shadow-md'}`}>
      <span>{name}</span>
      <span className={active ? 'text-gray-400 text-xs font-semibold' : 'text-gray-400 text-xs font-medium'}>{count}</span>
    </Link>
  );
}

function CarCard({ price, title, year, km, loc, image, dealer, premium = false, tag }: any) {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col group relative">

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
        <div className="px-5 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between mt-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sold By</span>
          <div className="text-slate-800 font-black text-[12px] px-2 py-1 rounded shadow-sm tracking-tight border border-gray-200 bg-white">
            {dealer}
          </div>
        </div>
      )}
    </div>
  );
}
