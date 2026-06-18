import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./DrawerLayout/Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "./Utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./Utils/Redux/userSlice";
import Sidebar from "./DrawerLayout/Sidebar";
import BloodDropLoader from "./Utils/BloodDropLoader";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store?.user);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUser = async () => {
    setAuthLoading(true);
    try {
      setAuthLoading(true);
      const res = await axios.get(BASE_URL + "profile", {
        withCredentials: true,
      });

      if (res?.data) {
        dispatch(addUser(res?.data?.data));
        const { role } = res?.data?.data;
      } else {
        navigate("/login");
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (authLoading || !userData) {
    return(
    <div className="h-screen flex flex-col bg-gray-100">
      <BloodDropLoader />
    </div>)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden gap-3 p-1 mb-0.5">
        {/* Sidebar */}
        <aside className="w-64 bg-[#90191F] rounded-xl text-white shadow-sm">
          <Sidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto rounded-xl bg-white p-6 shadow-sm">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Body;
