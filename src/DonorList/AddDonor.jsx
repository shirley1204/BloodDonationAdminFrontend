import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils/Constants";
import BloodDropLoader from "../Utils/BloodDropLoader";
import { useSelector } from "react-redux";

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

const inputClass =
  "w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#90191F] focus:border-[#90191F]";

const AddDonor = () => {
     const user = useSelector((store) => store?.user);
  const navigate = useNavigate();
    const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  const [saving, setSaving] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [searching, setSearching] = useState(false);
  const [donorFound, setDonorFound] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchLocked, setSearchLocked] = useState(false);
  const [noRecordFound, setNoRecordFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [donorId, setDonorId] = useState(null);
  const [source, setSource] = useState("new");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      gender: "",
      mobile: "",
      dob: "",
      address: "",
      bloodGrp: "",
      age: "",
      count: "",
      created_by: firstName + " " + lastName
    },
  });

  const dob = watch("dob");

  // Auto calculate age
  useEffect(() => {
    if (!dob) {
      setValue("age", "");
      return;
    }

    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    setValue("age", age);
  }, [dob, setValue]);

  // Search donor by mobile
  const handleSearch = async () => {
    setSearchError("");
    setNoRecordFound(false);

    if (searchMobile.length > 10 || searchMobile.length < 10) {
      setSearchError("Enter valid mobile number with 10 digits");
      return;
    }
    setIsLoading(true);
    try {
      setSearching(true);

      const res = await axios.get(`${BASE_URL}donor/mobile/${searchMobile}`, {
        withCredentials: true,
      });

      const donor = res.data.data;
      setDonorFound(true);
      setSource(res.data.source); //
      setDonorId(donor._id);
      setValue("name", donor.name);
      setValue("mobile", donor.mobile);
      setValue("gender", donor.gender);
      setValue("dob", donor.dob?.split("T")[0]);
      setValue("address", donor.address);
      setValue("bloodGrp", donor.bloodGrp);
      setValue("age", donor.age);
      setValue("count", donor.count);
      setSearchLocked(true);
    } catch (err) {
      setDonorFound(false);
      setNoRecordFound(true);
      setSearchLocked(true);
      setDonorId(null);
      setSource("new");

      reset({
        name: "",
        mobile: searchMobile,
        gender: "",
        dob: "",
        address: "",
        bloodGrp: "",
        age: "",
        count: "",
        created_by: firstName + " " + lastName
      });
    } finally {
      setSearching(false);
      setIsLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSaving(true);
      await axios.post(
        `${BASE_URL}donor/submit`,
        {
          ...data,
          source,
        },
        { withCredentials: true },
      );
      showToast("Donor added successfully", "success");
      handleCancel();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDonorId(null);
    setSource("new");

    setSearchMobile("");
    setSearchError("");
    setDonorFound(false);
    setNoRecordFound(false);
    setSearchLocked(false);

    reset({
      name: "",
      gender: "",
      mobile: "",
      dob: "",
      address: "",
      bloodGrp: "",
      age: "",
      count: "",
      created_by: firstName + " " + lastName
    });
  };

  const RequiredLabel = ({ text }) => (
    <label className="block mb-1 text-sm font-semibold text-gray-800">
      {text} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="p-6 pt-0">
      {isLoading && <BloodDropLoader />}
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-gray-900">Add New Donor</h1>

           </div>

      {/* Search Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Search Existing Donor
        </h2>

        <div className="flex flex-col sm:flex-row items-start gap-3">
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchMobile}
              placeholder="Enter Mobile Number"
              maxLength={10}
              disabled={searchLocked}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setSearchMobile(value);
                setSearchError("");
              }}
              className={inputClass}
            />

            {searchError && (
              <p className="text-red-500 text-sm mt-1">{searchError}</p>
            )}
          </div>

          {!searchLocked && (
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching || searchLocked}
              className="bg-[#90191F] text-white px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          )}
        </div>

        {donorFound && (
          <p className="text-green-600 text-sm mt-4">
            ✓ Donor found. Details loaded successfully.
          </p>
        )}
        {noRecordFound && (
          <p className="text-red-900 text-sm mt-4">No data found.</p>
        )}
      </div>

      {/* Form */}
      {searchLocked && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Name */}
              <div>
                <RequiredLabel text="Name" />

                <input
                  {...register("name", {
                    required: "Name is required",

                    maxLength: {
                      value: 100,
                      message: "Name cannot exceed 100 characters",
                    },

                    validate: (value) =>
                      /^[A-Za-z\s]+$/.test(value) || "Only letters are allowed",
                  })}
                  onInput={(e) => {
                    let value = e.target.value;

                    // remove numbers + special characters
                    value = value.replace(/[^A-Za-z\s]/g, "");

                    // limit to 100 chars
                    value = value.slice(0, 100);

                    e.target.value = value;
                  }}
                  className={inputClass}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">
                  Gender
                </label>

                <select
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              {/* DOB */}
              <div>
                <RequiredLabel text="Date of Birth" />

                <input
                  type="date"
                  {...register("dob")}
                  className={inputClass}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">
                  Age
                </label>

                <input
                  {...register("age")}
                  className="w-full border border-gray-300 bg-gray-200 text-gray-500 px-3 py-2.5 rounded-lg cursor-not-allowed opacity-90"
                  readOnly
                  disabled
                />
              </div>
              <div>
                <RequiredLabel text="Number Of Times Donated" />
                <input
                  type="number"
                  {...register("count", {
                    required: "This field is required",
                    validate: (value) =>
                      (value >= 0 && value <= 99) ||
                      "Please enter a value between 1 and 99",
                  })}
                  onInput={(e) => {
                    let value = e.target.value;

                    // remove non-numeric + limit to 2 digits
                    value = value.replace(/\D/g, "").slice(0, 2);

                    e.target.value = value;
                  }}
                  className={inputClass}
                />
                {errors.count && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.count.message}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <RequiredLabel text="Blood Group" />

                <select {...register("bloodGrp")} className={inputClass}>
                  <option value="">Select</option>

                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <RequiredLabel text="Address" />

                <input
                  {...register("address", {
                    required: "Address is required",
                  })}
                  className={inputClass}
                />

                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#90191F] text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
      {toast.show && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`alert shadow-lg ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDonor;
