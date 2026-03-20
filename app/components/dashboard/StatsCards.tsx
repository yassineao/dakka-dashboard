"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type TerminStatus = "AUSSTEHEND" | "BESTATIGT" | "BESTAETIGT" | "STORNIERT" | string;
type TerminApi = {
  id: string;
  status: TerminStatus | null;
  startDate?: string | null;
};

function normalizeStatus(status: string | null | undefined) {
  if (!status) return "";
  return status
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isToday(dateLike: string | null | undefined) {
  if (!dateLike) return false;
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function StatsCards() {
  const [termine, setTermine] = useState<TerminApi[]>([]);

  useEffect(() => {
    const loadTermine = async () => {
      try {
        if (!API_BASE_URL) return;

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/termine`, {
          cache: "no-store",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        if (!res.ok) return;

        const text = await res.text();
        const data: TerminApi[] = text ? JSON.parse(text) : [];
        setTermine(Array.isArray(data) ? data : []);
      } catch {
        setTermine([]);
      }
    };

    loadTermine();
  }, []);

  const stats = useMemo(() => {
    const pendingCount = termine.filter(
      (t) => normalizeStatus(t.status) === "AUSSTEHEND"
    ).length;

    const cancelledCount = termine.filter(
      (t) => normalizeStatus(t.status) === "STORNIERT"
    ).length;

    const todayCount = termine.filter((t) => isToday(t.startDate)).length;

    return [
      {
        title: "Termine Heute",
        value: String(todayCount),
        subtitle: "Heute",
        color: "text-emerald-700",
        badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        cardClass: "border-emerald-100",
      },
      {
        title: "Neue Ausstehende Termine",
        value: String(pendingCount),
        subtitle:
          pendingCount > 0 ? "Zur Bestatigung" : "Alles bearbeitet",
        color: pendingCount > 0 ? "text-amber-700" : "text-slate-600",
        badgeClass:
          pendingCount > 0
            ? "bg-amber-50 text-amber-700 ring-amber-200"
            : "bg-slate-100 text-slate-600 ring-slate-200",
        cardClass: pendingCount > 0 ? "border-amber-200" : "border-slate-200",
      },
      {
        title: "Stornierte Termine",
        value: String(cancelledCount),
        subtitle: "Gesamt",
        color: "text-rose-700",
        badgeClass: "bg-rose-50 text-rose-700 ring-rose-200",
        cardClass: "border-rose-100",
      },
    ];
  }, [termine]);

  return (
    <div className="mt-3 grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`rounded-xl border ${stat.cardClass} bg-white px-4 py-3 shadow-sm`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {stat.title}
              </div>
              <span className="mt-1 block text-2xl font-bold leading-none text-slate-900">
                {stat.value}
              </span>
              <p className="mt-1 text-xs text-slate-500">{stat.subtitle}</p>
            </div>
            <div
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${stat.badgeClass} ${stat.color}`}
            >
              Live
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}