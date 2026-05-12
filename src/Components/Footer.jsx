import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ flush = false }) => {
  return (
    <footer
      className={`w-full ${
        flush ? "" : "mt-16"
      } border-t border-[#e5e5e0] bg-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-20 py-10 text-center">
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="w-6 h-6  rounded-md">
            <img src="/KIIT-Logo-500x500-1.png" alt="" />
          </div>
          <span className="font-display text-sm font-bold text-[#1a1a1a] tracking-tightish">
            KIIT <span className="text-emerald-600">Events</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Discover and explore events happening across campus — all in one
          place.
        </p>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link to="/EventsPage" className="hover:text-emerald-600 transition">
            Events
          </Link>
          <Link
            to="/AnnouncementsList"
            className="hover:text-emerald-600 transition"
          >
            Announcements
          </Link>
          <Link to="/Contact" className="hover:text-emerald-600 transition">
            Contact
          </Link>
        </nav>

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
