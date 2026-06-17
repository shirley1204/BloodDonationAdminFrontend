import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "./Utils/Constants";
import { addUser } from "./Utils/Redux/userSlice";

const Profile = () => {
  const user = useSelector((store) => store?.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
    }
  }, [user]);

  const saveProfile = async () => {
    setError("");

    try {
      const res = await axios.patch(
        BASE_URL + "profile/edit",
        { firstName, lastName, age, gender, about },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Edit Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-[#90191F] bg-white"
        />

        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-[#90191F] bg-white"
        />

        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-[#90191F] bg-white"
        />

        <input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Gender"
          className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-[#90191F] bg-white"
        />

        <input
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About"
          className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-[#90191F] bg-white md:col-span-2"
        />

      </div>

      {error && (
        <p className="text-red-500 mt-4">
          {error}
        </p>
      )}

      <button
        onClick={saveProfile}
        className="mt-6 bg-[#90191F] text-white px-6 py-2 rounded-lg hover:opacity-90"
      >
        Save Profile
      </button>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Profile saved successfully
        </div>
      )}

    </div>
  );
};

export default Profile;