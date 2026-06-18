import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({}) => {
  const user = useSelector((store) => store?.user);
  const [collapsed, setCollapsed] = useState(false);
  const showText = !collapsed;
  const role = user?.role || "user";
 
  const linkClass = (isActive, collapsed) =>
  `flex items-center rounded-lg transition ${
    isActive
      ? "bg-white text-[#90191F] font-semibold"
      : "text-white hover:bg-[#7a1419]"
  } ${
    collapsed
      ? "justify-center px-0 py-3"
      : "gap-3 px-4 py-3"
  }`;

    useEffect(() => {
  const handleResize = () => {
    setCollapsed(window.innerWidth < 1024); // lg breakpoint
  };

  handleResize(); // run on mount
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
  <div
    className={`h-full transition-all duration-300
    ${collapsed ? "w-16" : "w-64"}`}
  >
      {/* DASHBOARD */}
      {role === "admin" && (
        <NavLink to="/"  className={({ isActive }) => linkClass(isActive, collapsed)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
          {showText && "Dashboard"}
        </NavLink>
      )}

      {/* DONORS */}
     {role === "admin" &&  <NavLink to="/donors"  className={({ isActive }) => linkClass(isActive, collapsed)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* heart + cross (blood donation symbol) */}
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          <path d="M12 9v6" />
          <path d="M9 12h6" />
        </svg>
        {showText && "Donors"}
      </NavLink>}
      <NavLink to="/donor/add"  className={({ isActive }) => linkClass(isActive, collapsed)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* User */}
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />

          {/* Plus */}
          <path d="M19 8v6" />
          <path d="M16 11h6" />
        </svg>
      {showText && "Add Donor"}
      </NavLink>
     {role === "admin" &&  <NavLink to="/users"  className={({ isActive }) => linkClass(isActive, collapsed)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
       {showText && "Users"}
      </NavLink>}

      {/* PROFILE */}
      {/* <NavLink to="/profile" className={linkClass}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Profile
      </NavLink> */}
    </div>
  );
};

export default Sidebar;
