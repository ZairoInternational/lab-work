"use client";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
    const [password,setPassword]=useState("");
    const [err,setErr]=useState("");
    const router=useRouter();

    const onLogin= async () =>{
        setErr("");
        try{
            await axios.post("/api/admin/login",{password});
            router.push("/admin");
        }catch(error:any){
            setErr(error.response.data.error || "Something went wrong");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        />
        <button onClick={onLogin} className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        {err && <p className="text-red-600 mt-3">{err}</p>}
      </div>
    </div>
    )

}