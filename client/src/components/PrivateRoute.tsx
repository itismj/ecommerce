"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN";
};

export default function PrivateRoute({ children, requiredRole }: Props) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.push("/login");
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push("/unauthorized");
      }
    }
  }, [token, user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
