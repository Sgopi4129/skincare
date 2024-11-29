'use client'
import Link from "next/link";
import { useState } from "react";

export default function RetrieveUsernamePage() {
  const [identifier, setIdentifier] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:8000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email:identifier.includes("@") ? identifier:undefined,
            username:!identifier.includes("@") ? identifier : undefined
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP. Please try again.");
      }

      setIsOtpSent(true);
    } catch (err:any) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:8000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({identifier, otp }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify OTP. Please try again.");
      }

      const data = await response.json();
      setUsername(data.username);
    } catch (err: any) {
      setError(err.message ||"Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white text-black shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Retrieve Your Username
        </h1>

        {!username ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if(isOtpSent){
                handleVerifyOtp() 
              }
              else handleSendOtp();
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700"
              >
                Registered Email
              </label>
              <input
                type="identifier"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your registered email"
                required
                disabled={isOtpSent}
              />
            </div>

            {isOtpSent && (
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter the OTP"
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isOtpSent ? "Verify OTP" : "Send OTP"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Username Retrieved!
            </h2>
            <p className="text-gray-600 mt-2">
              Your username is:{" "}
              <span className="font-bold text-gray-800">{username}</span>
            </p>
            <button
              onClick={() => {
                setIdentifier("");
                setOtp("");
                setIsOtpSent(false);
                setUsername(null);
                setError(null);
              }}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Retrieve Again
            </button>
            <Link href="/login" className="p-20 m-10 mt-4 py-2 px-4 rounded-md bg-blue-500 text-white hover:text-orange-200">Go for login</Link>
          </div>
        )}
      </div>
    </div>
  );
};
