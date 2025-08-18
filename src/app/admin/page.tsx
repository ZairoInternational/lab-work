"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function Admin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/login", formData);
      if (res.data.success) {
        // Store token in localStorage
        localStorage.setItem("admin_token", res.data.token);
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg space-y-4 w-80">
        <h2 className="text-xl font-bold">Admin Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full border p-2"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full border p-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2">
          Login
        </button>
      </form>
    </div>
  );
}

export default Admin;
