import React from "react";
import { motion } from "framer-motion";

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow"
            initial={{ scale: 0.9, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          />
          <div>
            <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">CSE Resource Hub</h1>
            <p className="text-xs text-gray-500">Share and access semester-wise resources</p>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">{user.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role}{user.semester ? ` • Sem ${user.semester}` : ""}</div>
            </div>
            <button onClick={onLogout} className="text-sm px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 transition">Logout</button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
