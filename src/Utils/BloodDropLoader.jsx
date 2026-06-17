import React from "react";

const BloodDropLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex items-end gap-3">
        <div className="w-4 h-4 bg-[#90191F] rounded-full animate-bounce" />

        <div
          className="w-4 h-4 bg-[#90191F] rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-4 h-4 bg-[#90191F] rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default BloodDropLoader;
