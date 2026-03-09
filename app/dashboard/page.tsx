"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/dashboard/dasboard";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/signin");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return <div>Loading...</div>;
  }

  return <DashboardLayout />;
}