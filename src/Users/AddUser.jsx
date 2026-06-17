import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";
import BloodDropLoader from "../Utils/BloodDropLoader";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};

    if (
      !form.firstName.trim() ||
      form.firstName.length < 2 ||
      form.firstName.length > 50
    ) {
      err.firstName = "First name must be 2–50 characters";
    }

    if (
      !form.lastName.trim() ||
      form.lastName.length < 2 ||
      form.lastName.length > 50
    ) {
      err.lastName = "Last name must be 2–50 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.emailId)) {
      err.emailId = "Enter valid email";
    }

    if (!form.password || form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}singUp`, form, {
        withCredentials: true,
      });

      navigate("/users");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#90191F] focus:ring-2 focus:ring-[#90191F]/20 transition";

  const labelClass = "text-sm font-medium text-black";

   return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50">
          {loading && <BloodDropLoader />}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Create User</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add a new system user account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="emailId"
              placeholder="Enter email address"
              value={form.emailId}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.emailId && (
              <p className="text-xs text-red-500 mt-1">{errors.emailId}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="w-1/2 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 rounded-lg bg-[#90191F] text-white hover:bg-[#6f1217] transition"
            >
              {loading ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
