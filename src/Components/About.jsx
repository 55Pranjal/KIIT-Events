import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function About() {
  return (
    <>
      <div className="min-h-screen text-gray-200">
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-6">
            About KIIT Events
          </h1>

          <p className="text-gray-300 leading-relaxed text-lg mb-6">
            <span className="text-green-400 font-semibold">KIIT Events</span>{" "}
            was born out of a hackathon. Ironically, it didn’t even make it past
            the first round — but that didn’t stop the idea from growing.
          </p>

          <p className="text-gray-300 leading-relaxed text-lg mb-6">
            After the hackathon, I realized something important — our university
            genuinely lacked a single space where students could explore all the
            events happening around campus. A place where societies could manage
            their events easily, and students could stay updated without missing
            opportunities.
          </p>

          <p className="text-gray-300 leading-relaxed text-lg mb-8">
            That’s how{" "}
            <span className="text-green-400 font-semibold">KIIT Events</span>{" "}
            evolved from a simple hackathon idea into a real project — one made
            for our university community, by a student who believed in the idea
            even when it didn’t get recognition.
          </p>

          <div className="mt-10">
            <p className="text-green-400 font-semibold text-xl mb-3">
              Built with passion 💚
            </p>
            <p className="text-gray-400 text-sm">
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
