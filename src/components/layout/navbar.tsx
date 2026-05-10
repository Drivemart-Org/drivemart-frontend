"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Search, Heart, User, PlusCircle, LayoutGrid, ChevronDown, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading: loadingUser, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
  };
  
  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white font-extrabold text-2xl h-10 w-10 flex items-center justify-center rounded-xl shadow-lg group-hover:shadow-rose-500/30 transition-shadow">
            DM
          </div>
          <div className="flex flex-col hidden lg:flex">
            <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">
              DriveMart
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5">India&apos;s Marketplace</span>
          </div>
        </Link>

        {/* Global Search Center (Desktop) */}
        <div className="hidden md:flex flex-grow max-w-2xl">
          <div className="w-full flex items-center bg-gray-100/80 rounded-full h-12 px-2 border border-transparent focus-within:bg-white focus-within:border-slate-300 focus-within:shadow-md transition-all">
            <div className="pl-3 pr-2 text-gray-500"><Search size={18} /></div>
            <input 
              type="text" 
              placeholder="Search for cars, models, or dealers..." 
              className="flex-grow bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder-gray-500"
            />
            <button className="bg-slate-900 text-white px-5 h-8 rounded-full text-xs font-bold hover:bg-slate-800 transition-colors ml-2">
              Search
            </button>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link href="/cars" className="hidden lg:flex flex-col items-center gap-1 text-gray-500 hover:text-slate-900 transition-colors px-3">
            <LayoutGrid size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Browse</span>
          </Link>

          <Link href="/dashboard" className="hidden sm:flex flex-col items-center gap-1 text-gray-500 hover:text-rose-600 transition-colors px-3">
            <Heart size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Saved</span>
          </Link>

          <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>

          {loadingUser ? (
            <div className="w-10 h-10 animate-pulse bg-gray-200 rounded-xl hidden sm:block"></div>
          ) : !user ? (
            <Link href="/login" className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-sm bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-colors border border-gray-200">
              <User size={18} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-sm bg-gray-50 hover:bg-gray-100 px-2 sm:px-4 py-2.5 rounded-xl transition-colors border border-gray-200"
              >
                <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shrink-0 capitalize">{user.name[0]}</div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-14 w-60 bg-white shadow-2xl rounded-2xl border border-gray-100 py-2 z-50 flex flex-col animate-in slide-in-from-top-2">
                   <div className="px-4 py-3 border-b border-gray-50 mb-1">
                     <p className="text-[13px] text-gray-500 font-semibold">Signed in as</p>
                     <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                   </div>
                   <Link href="/dashboard" className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-gray-50 transition w-full text-left">My Profile</Link>
                   <Link href="/dashboard" className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-gray-50 transition w-full text-left">My Ads</Link>
                   <Link href="/dashboard" className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-gray-50 transition w-full text-left flex justify-between items-center">
                     Get Verified <CheckCircle2 size={16} className="text-blue-500" />
                   </Link>
                   <Link href="/dashboard" className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-gray-50 transition w-full text-left">Saved Cars</Link>
                   <Link href="/dashboard" className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-gray-50 transition w-full text-left">Chats</Link>
                   <div className="my-1 border-t border-gray-50"></div>
                   <Link href="/dashboard" className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-gray-50 transition w-full text-left">Account Settings</Link>
                   <button onClick={handleSignOut} className="px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-gray-50 transition w-full text-left flex items-center gap-2">
                      <LogOut size={16}/> Sign out
                   </button>
                </div>
              )}
            </div>
          )}

          <Link href="/sell" className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)]">
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Sell Car</span>
            <span className="sm:hidden">Sell</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
