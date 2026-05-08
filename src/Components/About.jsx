import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";

export default function About() {
  return (
    <>
      <Navbar />

      <div className="relative min-h-[80vh] overflow-hidden">
        <Doodles variant="hero" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block px-3 py-1 mb-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider uppercase border border-emerald-100">
            Our Story
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#111] tracking-tightish mb-6 leading-[1.05]">
            About{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              KIIT Events
            </span>
          </h1>

          <p className="text-gray-500 leading-relaxed text-base md:text-lg mb-6">
            <span className="text-[#111] font-semibold">KIIT Events</span> was
            born out of a hackathon. Ironically, it didn't even make it past the
            first round — but that didn't stop the idea from growing.
          </p>

          <p className="text-gray-500 leading-relaxed text-base md:text-lg mb-6">
            After the hackathon, I realized something important — our university
            genuinely lacked a single space where students could explore all the
            events happening around campus. A place where societies could manage
            their events easily, and students could stay updated without missing
            opportunities.
          </p>

          <p className="text-gray-500 leading-relaxed text-base md:text-lg mb-12">
            That's how{" "}
            <span className="text-[#111] font-semibold">KIIT Events</span>{" "}
            evolved from a simple hackathon idea into a real project — one made
            for our university community, by a student who believed in the idea
            even when it didn't get recognition.
          </p>

          <div className="bg-white border border-[#e5e5e5] rounded-2xl shadow-sm p-8 max-w-2xl mx-auto">
            <p className="text-emerald-600 font-semibold text-lg md:text-xl mb-2">
              Built with passion
            </p>
            <p className="text-gray-500 text-sm md:text-base">
              Made using React, TailwindCSS, Node.js & MongoDB — by a student
              who refused to quit after round one.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
