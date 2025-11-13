import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-12  border-t border-green-800/30 text-green-300 py-6 px-6 sm:px-10 md:px-20 text-center">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm tracking-wide">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-green-400">KIIT Events</span>. All
          rights reserved.
        </p>
        <p className="text-xs text-green-200/70 mt-1">
          Built by a fellow KIITIAN (Pranjal Agarwal). Contact:
          <a
            href="mailto:567pranjalagarwal@gmail.com"
            className="hover:text-green-300 transition-colors ml-1 underline"
          >
            567pranjalagarwal@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
