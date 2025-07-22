"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        {token && <Link href="/cart">Cart</Link>}
        {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
      </div>
      <div className="flex gap-4 items-center">
        {token ? (
          <>
            <span className="text-sm">👤 {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
