"use client";
import { useEffect, useState } from "react";
import { isAuthenticated, removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);
const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 function handleLogout() {
    removeToken();
    router.replace("/auth/signin");
  }
  return (
    <nav
      className={`fixed z-30 w-full transition-all duration-300 
      ${scrolled ? "backdrop-blur-md bg-black/30 shadow-sm" : "bg-transparent"}`}
    >
      <div className="container mx-auto">
        <div className="flex w-full items-center py-4 text-slate-700">

          {/* Logo */}
          <div className="mr-10">
          
          </div>

          {/* Menu */}
          {/* <div className="mx-auto hidden lg:flex">
            <ul className="flex items-center space-x-6">
              <li>
                <button className="h-10 px-4 text-sm font-medium hover:text-gray-200 transition">
                  Platform
                </button>
              </li>
              <li>
                <button className="h-10 px-4 text-sm font-medium hover:text-gray-200 transition">
                  Use cases
                </button>
              </li>
              <li>
                <button className="h-10 px-4 text-sm font-medium hover:text-gray-200 transition">
                  Developers
                </button>
              </li>
              <li>
                <button className="h-10 px-4 text-sm font-medium hover:text-gray-200 transition">
                  Resources
                </button>
              </li>
            </ul>
          </div> */}

          {/* Right buttons */}
          <div className="hidden lg:flex items-center gap-4 ml-auto ">
            <button className="h-10 px-4 text-slate-700 font-medium text-slate-200 rounded-md border border-transparent hover:bg-black/20 transition " onClick={handleLogout}>
              Log out
            </button>

            {/* <button className="h-10 px-4 text-slate-700 font-medium rounded-md border border-transparent text-slate-700 hover:bg-black/20 transition">
              Start now
            </button> */}
          </div>

          {/* Mobile menu */}
          <div className="flex lg:hidden ml-auto">
            <button className="h-10 w-10 rounded-md border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}