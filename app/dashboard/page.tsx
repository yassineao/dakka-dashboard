"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/dashboard/dasboard";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar/Calendar";

export default function DashboardPage() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  function hasToken() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return !!token;
  }

  function validateAuth() {
    if (!hasToken()) {
      setAuthorized(false);
      router.replace("/auth/signin");
      return;
    }

    setAuthorized(true);
  }

  function renderComponent() {
    switch (activeComponent) {
      case "dashboard":
        return <DashboardLayout />;
      // case "overview":
      //   return <Calendar />;
      default:
        return <DashboardLayout />;
    }
  }

  useEffect(() => {
    validateAuth();

    const onStorage = () => {
      validateAuth();
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        validateAuth();
      }
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  if (!authorized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <div className="flex overflow-hidden bg-white pt-0.25">
        <Sidebar onSelect={setActiveComponent} />
          {renderComponent()}
      </div>
    </div>
  );
}