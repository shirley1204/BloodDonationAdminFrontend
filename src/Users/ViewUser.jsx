import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate, useParams } from "react-router-dom";
import BloodDropLoader from "../Utils/BloodDropLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [err, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    role: "",
  });

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}users/${id}`, {
        withCredentials: true,
      });

      setUser(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    setError("");
    if (!validatePassword()) return;

    try {
      setResetLoading(true);
      await axios.patch(
        `${BASE_URL}users/reset-password/${id}`,
        { password: newPassword },
        { withCredentials: true },
      );
      setNewPassword("");
      setShowModal(false);
      setToast({
        show: true,
        message: "Password updated successfully",
        type: "success",
      });
    } catch (err) {
      console.log(err);
      setToast({
        show: true,
        message: "Failed to reset password",
        type: "error",
      });
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 cursor-not-allowed";

  const labelClass = "text-sm font-medium text-black";

  if (loading) return <BloodDropLoader />;

  return (
    <div className="flex justify-center pt-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-black">View User</h2>

          <p className="text-sm text-gray-500 mt-1">User details</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input value={user.firstName} disabled className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Last Name</label>
            <input value={user.lastName} disabled className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>User Id</label>
            <input value={user.emailId} disabled className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Password</label>

            <div className="flex gap-2">
              <input
                type="password"
                value="********"
                disabled
                className={inputClass}
              />

              <button
                onClick={() => setShowModal(true)}
                className="bg-[#90191F] text-white px-4 rounded-lg text-sm"
              >
                Reset Password
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>User Role</label>
            <input value={user.role} disabled className={inputClass} />
          </div>

          <button
            onClick={() => navigate("/users")}
            className="w-full py-2.5 rounded-lg bg-[#90191F] text-white hover:bg-[#6f1217]"
          >
            Back
          </button>
        </div>
      </div>
      {/* Modal UI*/}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Reset Password
            </h2>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg pr-16 text-black focus:outline-none focus:ring-2 focus:ring-[#90191F]/30"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90191F]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-xs text-red-600 mb-4">{err}</p>

            <div className="flex justify-end gap-2 text-black">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewPassword("");
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="px-4 py-2 bg-[#90191F] text-white rounded-lg"
              >
                {resetLoading ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/*Toast UI*/}
      {toast.show && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"}`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
