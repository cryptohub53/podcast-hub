"use client";

import { useState } from "react";
import axios from "axios";

interface Props {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/${mode}`;
      const payload = mode === "signup" ? { email, password, username } : { email, password };
      const res = await axios.post(url, payload, { withCredentials: true });
      console.log("User logged in:", res.data.user);
      // Optionally redirect or update global auth state
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/guest`,
        {},
        { withCredentials: true }
      );
      console.log("Guest logged in:", res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Sign Up"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleGuestLogin}
          className="text-sm text-gray-600 hover:underline"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
