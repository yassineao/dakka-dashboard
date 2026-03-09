"use client";

import { useState } from "react";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
      }

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Request failed: ${res.status}`);
      }

      if (!data?.token) {
        throw new Error("No token returned from server");
      }

      setToken(data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-h-screen bg-neutral-200 dark:bg-neutral-700 overflow-hidden" style={{
  background: "linear-gradient(to right, #000000, #6b5b1e, #D4AF37)",
}}>
      <div className="container mx-auto h-full p-6 md:p-10">
        <div className="flex min-h-screen items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full max-w-6xl">
            <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="lg:flex lg:flex-wrap">
                {/* Left column */}
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
                    {/* Logo */}
                    <div className="text-center">
                      <img
                        className="mx-auto w-17"
                        src="/Logo.png"
                        alt="logo"
                      />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                        Dakka Booking Platform Dashboard
                      </h4>
                    </div>

                    <form onSubmit={handleLogin}>
                      <p className="mb-4">Please login to your account</p>

                      {/* Email input */}
                      <div className="relative mb-6">
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="peer block w-full rounded border border-neutral-300 bg-transparent px-3 py-3 text-sm leading-6 text-neutral-900 outline-none transition-all duration-200 placeholder:opacity-0 focus:border-pink-500 focus:placeholder:opacity-100 dark:border-neutral-600 dark:text-white dark:focus:border-pink-400"
                          required
                        />
                        <label
                          htmlFor="email"
                          className="pointer-events-none absolute left-3 top-3 origin-[0] bg-white px-1 text-sm text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-90 peer-focus:text-pink-500 dark:bg-neutral-800 dark:text-neutral-400 dark:peer-focus:text-pink-400"
                        >
                          Email
                        </label>
                      </div>

                      {/* Password input */}
                      <div className="relative mb-6">
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="peer block w-full rounded border border-neutral-300 bg-transparent px-3 py-3 text-sm leading-6 text-neutral-900 outline-none transition-all duration-200 placeholder:opacity-0 focus:border-pink-500 focus:placeholder:opacity-100 dark:border-neutral-600 dark:text-white dark:focus:border-pink-400"
                          required
                        />
                        <label
                          htmlFor="password"
                          className="pointer-events-none absolute left-3 top-3 origin-[0] bg-white px-1 text-sm text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-90 peer-focus:text-pink-500 dark:bg-neutral-800 dark:text-neutral-400 dark:peer-focus:text-pink-400"
                        >
                          Password
                        </label>
                      </div>

                      {/* Submit */}
                      <div className="mb-12 pb-1 pt-1 text-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="mb-3 inline-block w-full rounded px-6 pb-2.5 pt-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:opacity-90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                          style={{
                            background:
                              "linear-gradient(to right, #000000, #5d6b1e, #D4AF37)",
                          }}
                        >
                          {loading ? "Logging in..." : "Log in"}
                        </button>

                       
                      </div>

                      {/* Register */}
                      
                    </form>
                  </div>
                </div>

                {/* Right column */}
                <div
                  className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-bl-none lg:rounded-r-lg"
                  style={{
                    background:
                      "linear-gradient(c)",
                  }}
                >
                  <div className="px-6 py-10 text-white md:mx-6 md:p-12">
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}