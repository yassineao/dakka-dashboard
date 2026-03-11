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

  return (
    <div className="bg-white">
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar onSelect={setActiveComponent} />
          {renderComponent()}
      </div>
    </div>
  );
}