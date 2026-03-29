import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      
      {/* Top Section - Quick SEO Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6 text-lg">Used Cars in India</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-[13px] text-blue-600">
          <Link href="#" className="hover:underline">Used Cars in Mumbai</Link>
          <Link href="#" className="hover:underline">Used Cars in Delhi</Link>
          <Link href="#" className="hover:underline">Used Cars in Bangalore</Link>
          <Link href="#" className="hover:underline">Used Cars in Pune</Link>
          <Link href="#" className="hover:underline">Used Cars in Hyderabad</Link>
          <Link href="#" className="hover:underline">Used Cars in Chennai</Link>
          <Link href="#" className="hover:underline">Used Cars in Ahmedabad</Link>
          <Link href="#" className="hover:underline">Used Cars in Kolkata</Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-[13px]">
          
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Company</h4>
            <ul className="space-y-3 text-blue-600">
              <li><Link href="#" className="hover:underline">About Us</Link></li>
              <li><Link href="#" className="hover:underline">Advertising</Link></li>
              <li><Link href="#" className="hover:underline">Careers</Link></li>
              <li><Link href="#" className="hover:underline">Legal Hub</Link></li>
              <li><Link href="#" className="hover:underline">Cars Blog</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">India</h4>
            <ul className="space-y-3 text-blue-600">
              <li><Link href="#" className="hover:underline">Mumbai</Link></li>
              <li><Link href="#" className="hover:underline">Delhi NCR</Link></li>
              <li><Link href="#" className="hover:underline">Bangalore</Link></li>
              <li><Link href="#" className="hover:underline">Pune</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Top Brands</h4>
            <ul className="space-y-3 text-blue-600">
              <li><Link href="#" className="hover:underline">Maruti Suzuki</Link></li>
              <li><Link href="#" className="hover:underline">Hyundai</Link></li>
              <li><Link href="#" className="hover:underline">Tata</Link></li>
              <li><Link href="#" className="hover:underline">Mahindra</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Get Social</h4>
            <ul className="space-y-3 text-blue-600">
              <li><Link href="#" className="hover:underline flex items-center gap-2">Facebook</Link></li>
              <li><Link href="#" className="hover:underline flex items-center gap-2">X (Twitter)</Link></li>
              <li><Link href="#" className="hover:underline flex items-center gap-2">Youtube</Link></li>
              <li><Link href="#" className="hover:underline flex items-center gap-2">Instagram</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Support</h4>
            <ul className="space-y-3 text-blue-600">
              <li><Link href="#" className="hover:underline">Help</Link></li>
              <li><Link href="#" className="hover:underline">Contact Us</Link></li>
              <li><Link href="#" className="hover:underline">Call Us</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Languages</h4>
            <ul className="space-y-3 text-blue-600 font-arabic">
              <li><Link href="#" className="hover:underline">हिंदी (Hindi)</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-2">
             <div className="bg-red-600 text-white font-extrabold text-xl px-2 py-0.5 rounded-sm tracking-tight">DM</div>
             <span className="font-black text-2xl tracking-tighter text-gray-900 leading-none">DriveMart<span className="text-red-600"> group</span></span>
          </div>

          <p className="text-gray-500 text-xs font-medium">
            © DriveMart.com 2026, All Rights Reserved.
          </p>

          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-[10px] text-center leading-tight shadow-md border-2 border-yellow-500 transform rotate-12">
            Verifed<br/>Trust<br/>Badge
          </div>

        </div>
      </div>

    </footer>
  );
}
