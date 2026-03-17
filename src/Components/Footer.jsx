import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-16 border-t border-[#e5e5e0] bg-[#f5f5f2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-10 text-center">
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="w-6 h-6  rounded-md">
            <img src="/KIIT-Logo-500x500-1.png" alt="" />
          </div>
          <span className="text-sm font-semibold text-[#1a1a1a]">
            KIIT <span className="text-emerald-600">Events</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Discover and explore events happening across campus — all in one
          place.
        </p>

        {/* Links */}
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
          <button className="hover:text-[#111] transition">
            Privacy Policy
          </button>
          <button className="hover:text-[#111] transition">
            Terms of Service
          </button>
          <button className="hover:text-[#111] transition">Contact</button>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-[#e5e5e0] pt-4">
          {/* Copyright */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} KIIT Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
