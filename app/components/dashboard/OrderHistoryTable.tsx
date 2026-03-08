"use client";

import { useMemo, useState } from "react";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type BookingRow = {
  id: string;
  created_at: string;
  start_date: string;
  end_date: string;
  updated_at: string;
  status: BookingStatus;
  exact_location: string;
  hall_or_location: string;
  name: string;
  occasion: string;
  package_name: string;
  booking_type: string;
  region: string;
  description: string;
  duration: string;
};

const initialRows: BookingRow[] = [
  {
    id: "7f4a2b6e-1d21-4d8d-92b1-1c8b0d401001",
    created_at: "2026-03-08T09:00:00",
    start_date: "2026-03-15T14:00:00",
    end_date: "2026-03-15T18:00:00",
    updated_at: "2026-03-08T10:00:00",
    status: "pending",
    exact_location: "Musterstraße 12, Berlin",
    hall_or_location: "Hall A",
    name: "Anna Schmidt",
    occasion: "Birthday",
    package_name: "Gold",
    booking_type: "Private",
    region: "Berlin",
    description: "Birthday event with decoration package.",
    duration: "4h",
  },
  {
    id: "0db4b8a2-3f4d-4ef9-8f7b-3b1d92321002",
    created_at: "2026-03-08T11:30:00",
    start_date: "2026-03-20T16:00:00",
    end_date: "2026-03-20T22:00:00",
    updated_at: "2026-03-08T12:15:00",
    status: "confirmed",
    exact_location: "Altmarkt 3, Dresden",
    hall_or_location: "Main Hall",
    name: "Max Müller",
    occasion: "Wedding",
    package_name: "Premium",
    booking_type: "Event",
    region: "Sachsen",
    description: "Wedding reception with full service.",
    duration: "6h",
  },
  {
    id: "1aa2c7f0-6409-4908-95c0-01003",
    created_at: "2026-03-09T08:20:00",
    start_date: "2026-03-25T10:00:00",
    end_date: "2026-03-25T13:00:00",
    updated_at: "2026-03-09T09:05:00",
    status: "completed",
    exact_location: "Rheinweg 8, Köln",
    hall_or_location: "Room 2",
    name: "Julia Weber",
    occasion: "Baby Shower",
    package_name: "Standard",
    booking_type: "Private",
    region: "NRW",
    description: "Morning event with brunch.",
    duration: "3h",
  },
  {
    id: "2bcd2-0f8e-4bdf-9d26-df1f9f111004",
    created_at: "2026-03-09T15:40:00",
    start_date: "2026-03-28T19:00:00",
    end_date: "2026-03-28T23:00:00",
    updated_at: "2026-03-09T16:00:00",
    status: "cancelled",
    exact_location: "Hafenstraße 1, Hamburg",
    hall_or_location: "Loft B",
    name: "Lukas Fischer",
    occasion: "Corporate",
    package_name: "Business",
    booking_type: "Company",
    region: "Hamburg",
    description: "Corporate networking event.",
    duration: "4h",
  },
   {
    id: "2bc6f4d2-0f8e-4bdff1f9f111004",
    created_at: "2026-03-09T15:40:00",
    start_date: "2026-03-28T19:00:00",
    end_date: "2026-03-28T23:00:00",
    updated_at: "2026-03-09T16:00:00",
    status: "cancelled",
    exact_location: "Hafenstraße 1, Hamburg",
    hall_or_location: "Loft B",
    name: "Lukas Fischer",
    occasion: "Corporate",
    package_name: "Business",
    booking_type: "Company",
    region: "Hamburg",
    description: "Corporate networking event.",
    duration: "4h",
  },
   {
    id: "2bc6f4d2-0f8ef9f111004",
    created_at: "2026-03-09T15:40:00",
    start_date: "2026-03-28T19:00:00",
    end_date: "2026-03-28T23:00:00",
    updated_at: "2026-03-09T16:00:00",
    status: "cancelled",
    exact_location: "Hafenstraße 1, Hamburg",
    hall_or_location: "Loft B",
    name: "Lukas Fischer",
    occasion: "Corporate",
    package_name: "Business",
    booking_type: "Company",
    region: "Hamburg",
    description: "Corporate networking event.",
    duration: "4h",
  },
   {
    id: "2bc6f4d2-0f8e-4bsdf1f9f111004",
    created_at: "2026-03-09T15:40:00",
    start_date: "2026-03-28T19:00:00",
    end_date: "2026-03-28T23:00:00",
    updated_at: "2026-03-09T16:00:00",
    status: "cancelled",
    exact_location: "Hafenstraße 1, Hamburg",
    hall_or_location: "Loft B",
    name: "Lukas Fischer",
    occasion: "Corporate",
    package_name: "Business",
    booking_type: "Company",
    region: "Hamburg",
    description: "Corporate networking event.",
    duration: "4h",
  },
];

const statusOptions: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

function formatDateTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClasses(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "confirmed":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "completed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "cancelled":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

function labelizeStatus(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function StatusFilterButton({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold",
          active
            ? "bg-white/20 text-white"
            : "bg-slate-100 text-slate-700",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 break-words text-sm text-slate-900">{value}</div>
    </div>
  );
}

export default function BookingsTable() {
  const [rows, setRows] = useState<BookingRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [saving, setSaving] = useState(false);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !q ||
        [
          row.id,
          row.name,
          row.status,
          row.exact_location,
          row.hall_or_location,
          row.occasion,
          row.package_name,
          row.booking_type,
          row.region,
          row.description,
          row.duration,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const counts = useMemo(() => {
    const q = search.trim().toLowerCase();

    const baseRows = rows.filter((row) => {
      if (!q) return true;

      return [
        row.id,
        row.name,
        row.status,
        row.exact_location,
        row.hall_or_location,
        row.occasion,
        row.package_name,
        row.booking_type,
        row.region,
        row.description,
        row.duration,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    return {
      all: baseRows.length,
      pending: baseRows.filter((r) => r.status === "pending").length,
      confirmed: baseRows.filter((r) => r.status === "confirmed").length,
      completed: baseRows.filter((r) => r.status === "completed").length,
      cancelled: baseRows.filter((r) => r.status === "cancelled").length,
    };
  }, [rows, search]);

  function updateStatus(id: string, status: BookingStatus) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              status,
              updated_at: new Date().toISOString(),
            }
          : row
      )
    );
  }

  async function handleSave() {
    try {
      setSaving(true);

      // Replace with your real API or Supabase save logic.
      // Example:
      // await fetch("/api/bookings/status", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(rows),
      // });

      await new Promise((resolve) => setTimeout(resolve, 700));
      alert("Änderungen gespeichert.");
    } catch (error) {
      console.error(error);
      alert("Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl  ">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                Bookings
              </h1>
              <p className="text-sm text-slate-500">
                Status verwalten und Buchungen ansehen
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            <StatusFilterButton
              label="All"
              count={counts.all}
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            />
            <StatusFilterButton
              label="Pending"
              count={counts.pending}
              active={statusFilter === "pending"}
              onClick={() => setStatusFilter("pending")}
            />
            <StatusFilterButton
              label="Confirmed"
              count={counts.confirmed}
              active={statusFilter === "confirmed"}
              onClick={() => setStatusFilter("confirmed")}
            />
            <StatusFilterButton
              label="Completed"
              count={counts.completed}
              active={statusFilter === "completed"}
              onClick={() => setStatusFilter("completed")}
            />
            <StatusFilterButton
              label="Cancelled"
              count={counts.cancelled}
              active={statusFilter === "cancelled"}
              onClick={() => setStatusFilter("cancelled")}
            />
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {filteredRows.length} Einträge
        </div>

        <div className="block space-y-4 p-4 md:hidden">
          {filteredRows.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-900">
                    {row.name}
                  </h2>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {row.id}
                  </p>
                </div>

                <span
                  className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses(
                    row.status
                  )}`}
                >
                  {labelizeStatus(row.status)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                <InfoItem label="Occasion" value={row.occasion} />
                <InfoItem label="Package" value={row.package_name} />
                <InfoItem label="Booking Type" value={row.booking_type} />
                <InfoItem label="Region" value={row.region} />
                <InfoItem label="Location" value={row.hall_or_location} />
                <InfoItem label="Exact Location" value={row.exact_location} />
                <InfoItem label="Start" value={formatDateTime(row.start_date)} />
                <InfoItem label="End" value={formatDateTime(row.end_date)} />
                <InfoItem label="Created" value={formatDateTime(row.created_at)} />
                <InfoItem label="Updated" value={formatDateTime(row.updated_at)} />
                <InfoItem label="Duration" value={row.duration} />
                <InfoItem label="Description" value={row.description} />
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status ändern
                </label>
                <select
                  value={row.status}
                  onChange={(e) =>
                    updateStatus(row.id, e.target.value as BookingStatus)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {labelizeStatus(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {filteredRows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Keine Einträge gefunden.
            </div>
          )}
        </div>

        <div className="hidden md:block">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-600">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>Name</th>
                  <th>Status</th>
                  <th>Occasion</th>
                  <th>Package</th>
                  <th>Booking Type</th>
                  <th>Region</th>
                  <th>Location</th>
                  <th>Exact Location</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  {/* <th>Created</th>
                  <th>Updated</th> */}
                  <th>Description</th>
                  <th>Status ändern</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="align-top transition-colors odd:bg-white even:bg-slate-50 hover:bg-slate-100"
                  >
                    <td className="px-4 py-3 text-slate-700">
                      <div className="font-semibold text-slate-900">{row.name}</div>
                    
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses(
                          row.status
                        )}`}
                      >
                        {labelizeStatus(row.status)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-700" >{row.occasion}</td>
                    <td className="px-4 py-3 text-slate-700">{row.package_name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.booking_type}</td>
                    <td className="px-4 py-3 text-slate-700">{row.region}</td>
                    <td className="px-4 py-3 text-slate-700">{row.hall_or_location}</td>
                    <td className="px-4 py-3 text-slate-700">{row.exact_location}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {formatDateTime(row.start_date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {formatDateTime(row.end_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.duration}</td>
                    {/* <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateTime(row.created_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateTime(row.updated_at)}
                    </td> */}
                    <td className="min-w-[260px] px-4 py-3">
                      <div className="max-w-[260px] whitespace-normal text-slate-700">
                        {row.description}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      <select
                        value={row.status}
                        onChange={(e) =>
                          updateStatus(row.id, e.target.value as BookingStatus)
                        }
                        className="min-w-[150px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {labelizeStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={15}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      Keine Einträge gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Speichert..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}