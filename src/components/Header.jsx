import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500" />
          <div>
            <h1 className="text-lg font-semibold text-gray-800">CSE Resource Hub</h1>
            <p className="text-xs text-gray-500">Share and access semester-wise resources</p>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">{user.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role}{user.semester ? ` • Sem ${user.semester}` : ""}</div>
            </div>
            <button onClick={onLogout} className="text-sm px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50">Logout</button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
