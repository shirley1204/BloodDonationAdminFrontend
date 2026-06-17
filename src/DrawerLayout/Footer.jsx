import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#90191F] text-white mt-auto">

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">

        <p className="text-sm text-white/80">
          © {new Date().getFullYear()} Possa Hospital — Blood Donation System
        </p>

        <p className="text-sm font-medium tracking-wide">
          Saving Lives ❤️ One Donation at a Time
        </p>

        <div className="flex items-center gap-4 text-sm">

          <span className="hover:text-gray-200 cursor-pointer transition">
            Developed by Shirley Butti
          </span>

        </div>

      </div>
    </footer>
  );
};

export default Footer;