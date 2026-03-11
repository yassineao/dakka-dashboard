"use client";

import { useState } from "react";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Sidebar( { onSelect }: { onSelect: (value: string) => void }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    removeToken();
    router.replace("/auth/signin");
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 z-30 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <h1 className="text-lg font-semibold text-gray-900">Dakka Dashboard</h1>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
          aria-label="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r border-gray-200 bg-white pt-3 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        aria-label="Sidebar"
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-3 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="px-3">
            <div className="mb-6 px-2">
              <a href="#" className="block text-xl font-medium tracking-tighter text-gray-900">
                <img src="/Logo.png" className="max-w-10" alt="Logo" />
                Dakka Dashboard
              </a>
            </div>

          <nav className="space-y-1 pt-8 lg:pt-16">
  <button
    type="button"
    className="group flex w-full items-center rounded-lg bg-gray-100 p-2 text-base font-normal text-gray-900"
    onClick={() => {
      setIsOpen(false);
      onSelect("dashboard");
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
      />
    </svg>
    <span className="ml-3">Dashboard</span>
  </button>

  <button
    type="button"
    className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-700 hover:bg-gray-100"
    onClick={() => {
      setIsOpen(false);
      onSelect("overview");
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <span className="ml-3">Overview</span>
  </button>

  <button
    type="button"
    className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-700 hover:bg-gray-100"
    onClick={() => {
      setIsOpen(false);
      onSelect("chat");
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
    <span className="ml-3">Chat</span>
  </button>

  <button
    type="button"
    className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-700 hover:bg-gray-100"
    onClick={() => {
      setIsOpen(false);
      onSelect("settings");
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
    <span className="ml-3">Settings</span>
  </button>

  <button
    type="button"
    className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-700 hover:bg-gray-100"
    onClick={() => {
      setIsOpen(false);
      onSelect("reports");
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <span className="ml-3">Reports</span>
  </button>

  <button
    type="button"
    className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-700 hover:bg-gray-100"
    onClick={() => {
      setIsOpen(false);
      onSelect("tasks");
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
    <span className="ml-3">Tasks</span>
  </button>
</nav>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mx-5 mb-5 flex items-center justify-end gap-3 rounded-lg p-2 hover:bg-gray-100"
        >
          <h1 className="font-medium text-black">Logout</h1>

          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            <svg
              className="absolute -left-1 h-12 w-12"
              fill="black"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      </aside>

      {/* Main content spacing on mobile and desktop */}
      <div className="h-14 lg:hidden" />
    </>
  );
}