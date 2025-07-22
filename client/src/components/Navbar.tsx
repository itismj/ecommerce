"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  if (token) {
    navLinks.push({ href: "/cart", label: "Cart" });
  }
  if (user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Mini Store 🛍️
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`
                    ${
                      isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                    }
                    hover:text-blue-600 transition-colors duration-200
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                Hello, {user.username}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
