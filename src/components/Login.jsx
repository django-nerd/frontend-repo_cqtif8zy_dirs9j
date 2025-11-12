import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${backend}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, semester: role === "student" ? Number(semester) : null }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="max-w-md mx-auto bg-white/80 backdrop-blur rounded-xl shadow p-6 mt-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35 }}
    >
      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">Welcome to CSE Resource Hub</h2>
      <p className="text-sm text-gray-500 mb-4">Login to continue</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Full name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {role === "student" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Semester</label>
              <select value={semester} onChange={(e)=>setSemester(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none">
                {Array.from({length:8}).map((_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
              </select>
            </div>
          )}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="w-full rounded-md py-2 text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:opacity-95 transition">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </motion.div>
  );
}
