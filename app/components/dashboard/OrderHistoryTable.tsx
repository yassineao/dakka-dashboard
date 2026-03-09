"use client";

import { stat } from "fs";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type BookingStatus = "AUSSTEHEND" | "BESTÄTIGT" | "STORNIERT";

type TerminApi = {
  id: string;
  createdAt: string | null;
  startDate: string | null;
  endDate: string | null;
  updatedAt: string | null;
  status: string | null;
  exactLocation: string | null;
  hallOrLocation: string | null;
  name: string | null;
  occasion: string | null;
  packageName: string | null;
  bookingType: string | null;
  region: string | null;
  description: string | null;
  duration: string | null;
};

type BookingRow = {
  id: string;
  created_at: string;
  startDate: string;
  endDate: string;
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

const statusOptions: BookingStatus[] = [
  "AUSSTEHEND",
  "BESTÄTIGT",
  "STORNIERT",
];

function formatDateTime(value: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

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
    case "AUSSTEHEND":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "BESTÄTIGT":
      return "bg-blue-50 text-blue-700 ring-blue-200";
  
    case "STORNIERT":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

function labelizeStatus(status: BookingStatus) {
  switch (status) {
    case "AUSSTEHEND":
      return "AUSSTEHEND";
    case "BESTÄTIGT":
      return "BESTÄTIGT";
   
    case "STORNIERT":
      return "STORNIERT";
    default:
      return status;
  }
}

function mapApiStatus(status: string | null): BookingStatus {
  switch (status?.trim().toUpperCase()) {
    case "BESTÄTIGT":
    case "BESTÄTIGT":
      return "BESTÄTIGT";
    case "AUSSTEHEND":
    case "AUSSTEHEND":
      return "AUSSTEHEND";
    case "ABGESCHLOSSEN":
  
    case "STORNIERT":
    case "STORNIERT":
      return "STORNIERT";
    default:
      return "AUSSTEHEND";
  }
}

function mapTerminToBookingRow(termin: TerminApi): BookingRow {
  const now = new Date().toISOString();

  return {
    id: termin.id,
    created_at: termin.createdAt ?? "null",
    startDate: termin.startDate ?? "null",
    endDate: termin.endDate ?? "null",
    updated_at: termin.updatedAt ?? "null",
    status: mapApiStatus(termin.status),
    exact_location: termin.exactLocation ?? "-",
    hall_or_location: termin.hallOrLocation ?? "-",
    name: termin.name ?? "-",
    occasion: termin.occasion ?? "-",
    package_name: termin.packageName ?? "-",
    booking_type: termin.bookingType ?? "-",
    region: termin.region ?? "-",
    description: termin.description ?? "-",
    duration: termin.duration ?? "-",
  };
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
      <div className="mt-1 break-words text-sm text-slate-900">{value || "-"}</div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Zurück
      </button>

      <div className="text-sm text-slate-600">
        Seite {currentPage} von {totalPages}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Weiter
      </button>
    </div>
  );
}

export default function BookingsTable() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [rowsUpdated, setRowsUpdated] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const loadTermine = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_BASE_URL) {
          throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
        }

        const res = await fetch(`${API_BASE_URL}/api/termine`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const text = await res.text();
        const data: TerminApi[] = text ? JSON.parse(text) : [];
        console.log("Raw API response:", data);
        setRows(Array.isArray(data) ? data.map(mapTerminToBookingRow) : []);
        console.log("Geladene Termine:", data);
      } catch (err) {
        console.error("Error loading termine", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    loadTermine();
  }, []);

  useEffect(() => {
    const updateRowsPerPage = () => {
      setRowsPerPage(window.innerWidth < 768 ? 5 : 5);
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);

    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

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
      AUSSTEHEND: baseRows.filter((r) => r.status === "AUSSTEHEND").length,
      BESTÄTIGT: baseRows.filter((r) => r.status === "BESTÄTIGT").length,
      STORNIERT: baseRows.filter((r) => r.status === "STORNIERT").length,
    };
  }, [rows, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, currentPage, rowsPerPage]);

  function updateStatus(id: string, status: BookingStatus) {
    
    
     setRowsUpdated((prev) => {
      const exists = prev.some((row) => row.id === id);
      if (exists) {
        
        return prev.map((row) =>
          row.id === id
            ? {
                ...row,
                status,
                updated_at: new Date().toISOString(),
              }
            : row
        );
        
      } else {
        
        const foundRow = rows.find((r) => r.id === id);
        if (foundRow) {
          console.log("Hinzufügen zur Aktualisierungsliste:", { ...foundRow, status },"prev:", prev);
          return [...prev, { ...foundRow, status, updated_at: new Date().toISOString() }];
        }
        
        return prev;
     
      }
    });
    
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
    console.log("Zu speichernde Zeilen:", rowsUpdated);
    setSaving(true);

    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
    }

    const payload = rowsUpdated.map((row) => ({
      id: row.id,
      title: row.name,
      status: row.status,
      exactLocation: row.exact_location,
      hallOrLocation: row.hall_or_location,
      occasion: row.occasion,
      packageName: row.package_name,
      bookingType: row.booking_type,
      region: row.region,
      description: row.description,
      duration: row.duration,
    }));

    const res = await fetch(`${API_BASE_URL}/api/termine/batch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Request failed: ${res.status}`);
    }
    console.log("Erfolgreich gespeichert.", "Serverantwort:", await res.text(),);
    console.log("payload:", payload);
    alert("Änderungen gespeichert.");
    window.location.reload();
  } catch (error) {
    console.error("Speichern fehlgeschlagen:", error);
    alert(
      error instanceof Error
        ? `Speichern fehlgeschlagen: ${error.message}`
        : "Speichern fehlgeschlagen."
    );
  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl ">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Lade Termine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="hidden md:block">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-600">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>Name</th>
                  <th>Status</th>
                  <th>Status ändern</th>
                  <th>Occasion</th>
                  <th>Package</th>
                  <th>Booking Type</th>
                  <th>Region</th>
                  <th>Location</th>
                  <th>Exact Location</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                
                  <tr
                    className="align-top transition-colors odd:bg-white even:bg-slate-50 hover:bg-slate-100"
                  >
                    <div className="mx-auto w-full max-w-7xl">
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                        <p className="text-sm font-medium text-red-700">
                          Fehler beim Laden: {error}
                        </p>
                      </div>
                    </div>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
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

            <div className="w-full lg:max-w-sm text-slate-900">
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
              label="AUSSTEHEND"
              count={counts.AUSSTEHEND}
              active={statusFilter === "AUSSTEHEND"}
              onClick={() => setStatusFilter("AUSSTEHEND")}
            />
            <StatusFilterButton
              label="BESTÄTIGT"
              count={counts.BESTÄTIGT}
              active={statusFilter === "BESTÄTIGT"}
              onClick={() => setStatusFilter("BESTÄTIGT")}
            />
           
            <StatusFilterButton
              label="STORNIERT"
              count={counts.STORNIERT}
              active={statusFilter === "STORNIERT"}
              onClick={() => setStatusFilter("STORNIERT")}
            />
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {filteredRows.length} Einträge
        </div>

        <div className="block space-y-4 p-4 md:hidden">
          {paginatedRows.map((row) => (
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
                <InfoItem label="Start" value={formatDateTime(row.startDate)} />
                <InfoItem label="End" value={formatDateTime(row.endDate)} />
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

          {paginatedRows.length === 0 && (
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
                  <th>Status ändern</th>
                  <th>Occasion</th>
                  <th>Package</th>
                  <th>Booking Type</th>
                  <th>Region</th>
                  <th>Location</th>
                  <th>Exact Location</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {paginatedRows.map((row) => (
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

                    <td className="px-4 py-3 text-slate-700">{row.occasion}</td>
                    <td className="px-4 py-3 text-slate-700">{row.package_name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.booking_type}</td>
                    <td className="px-4 py-3 text-slate-700">{row.region}</td>
                    <td className="px-4 py-3 text-slate-700">{row.hall_or_location}</td>
                    <td className="px-4 py-3 text-slate-700">{row.exact_location}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatDateTime(row.startDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatDateTime(row.endDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.duration}</td>
                    <td className="min-w-[260px] px-4 py-3">
                      <div className="max-w-[260px] whitespace-normal text-slate-700">
                        {row.description}
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={13}
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

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