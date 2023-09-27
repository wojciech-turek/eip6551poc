import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";

type User = {
  email: string;
  password: string;
  walletAddress: string | null;
};

const Account = () => {
  const [userName, setUserName] = useState<string>("");
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();

  const getUserData = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:5002/account/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userName,
        }),
      });
      if (!response.ok) throw new Error("User not found");
      const user = await response.json();
      setUserData(user);
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleConnectWallet = async () => {
    if (!isConnected) {
      await connectAsync({ connector: connectors[0] });
    }
    try {
      const response = await fetch(
        "http://localhost:5002/account/updateWalletAddress",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userName,
            walletAddress: address,
          }),
        }
      );
      if (!response.ok) throw new Error("Error updating wallet");

      const user = await response.json();
      setUserData(user);
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mt-16 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4">
          <div className="w-48">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="button"
            onClick={getUserData}
            className="rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get user data
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-6 ml-4">
          {userData && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-900">
                Email: {userData.email}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                Pasword: {userData.password}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                Wallet Address: {userData.walletAddress || "Not set"}
              </div>
              {!userData.walletAddress && (
                <button
                  type="button"
                  onClick={handleConnectWallet}
                  className="rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Connect Wallet to your account
                </button>
              )}
            </div>
          )}
          {error && (
            <div className="text-sm font-semibold text-red-900">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
