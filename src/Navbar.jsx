import axios from "axios";
import React from "react";
import { FaHospital, FaTint, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./Utils/Constants";

const Navbar = () => {
  const user = useSelector((store) => store?.user);
  const navigate = useNavigate();

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  const initials = `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="bg-[#90191F] text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FaHospital className="text-3xl text-white" />
          <FaTint className="absolute -bottom-1 -right-1 text-red-300 text-sm" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-wide">
            Possa Hospital
          </span>
          <span className="text-xs text-white/80 tracking-wider uppercase">
            Blood Donation System
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/10 px-2 py-1 rounded-full border border-white/20">
            <div className="w-9 h-9 rounded-full bg-white text-[#90191F] font-bold flex items-center justify-center text-sm">
              {`${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()}
            </div>

            <span className="text-sm font-semibold text-white">
              {firstName} {lastName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-[#90191F] font-semibold rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
