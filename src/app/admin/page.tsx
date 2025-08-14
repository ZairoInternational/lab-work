"use client";
import axios from "axios";

export default function Dashboard() {
  const logout = async () => { await axios.post("/api/admin/logout"); location.href = "/admin/login"; };
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <button onClick={logout} className="px-3 py-2 bg-gray-200 rounded">Logout</button>
    </div>
  );
}