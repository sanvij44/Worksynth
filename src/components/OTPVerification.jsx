import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function OTPVerification({ email, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email"
    });

    setLoading(false);

    if (error) {
      alert("Invalid OTP");
    } else {
      alert("Login Successful");
      onSuccess();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Verify OTP
        </h2>

        <p className="text-gray-400 mb-6">
          Enter the OTP sent to your email
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded-lg text-black text-center text-xl tracking-widest"
        />

        <button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 p-3 rounded-lg font-semibold"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
