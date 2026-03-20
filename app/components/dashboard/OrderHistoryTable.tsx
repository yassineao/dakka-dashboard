"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
const token = getToken();


type BookingStatus = "AUSSTEHEND" | "BESTÄTIGT" | "STORNIERT";
type OccasionType =
  | "VERLOBUNG"
  | "HENNA"
  | "SONSTIGES"
  | "HOCHZEIT"
  | "GEBURTSTAG";

  
type TerminApi = {
  id: string;
  createdAt: string | null;
  startDate: string | null;
  endDate: string | null;
  updatedAt: string | null;
  status: string | null;
  exactLocation: string | null;
  hallOrLocation: string | null;
  phoneNumber: string | null;
  name: string | null;
  occasion: OccasionType | "";
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
  phone_number: string;
  name: string;
  occasion: OccasionType | "";
  package_name: string;
  booking_type: string;
  region: string;
  description: string;
  duration: string;
  isNew?: boolean;
  isCreating?: boolean;
};

const statusOptions: BookingStatus[] = [
  "AUSSTEHEND",
  "BESTÄTIGT",
  "STORNIERT",
];
const occasionOptions: OccasionType[] = [
  "VERLOBUNG",
  "HENNA",
  "SONSTIGES",
  "HOCHZEIT",
  "GEBURTSTAG",
];
function formatDateTime(value: string) {
  if (!value || value === "null") return "-";

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

function toDateTimeLocal(value: string) {
  if (!value || value === "null") return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDateTimeLocal(value: string) {
  if (!value) return "";
  return `${value}:00`;
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
      return "BESTÄTIGT";
    case "AUSSTEHEND":
      return "AUSSTEHEND";
    case "ABGESCHLOSSEN":
    case "STORNIERT":
      return "STORNIERT";
    default:
      return "AUSSTEHEND";
  }
}

function mapTerminToBookingRow(termin: TerminApi): BookingRow {
  return {
    id: termin.id,
    created_at: termin.createdAt ?? "null",
    startDate: termin.startDate ?? "null",
    endDate: termin.endDate ?? "null",
    updated_at: termin.updatedAt ?? "null",
    status: mapApiStatus(termin.status),
    exact_location: termin.exactLocation ?? "-",
    hall_or_location: termin.hallOrLocation ?? "-",
    phone_number: termin.phoneNumber ?? "-",
    name: termin.name ?? "-",
    occasion: termin.occasion ?? "-",
    package_name: termin.packageName ?? "-",
    booking_type: termin.bookingType ?? "-",
    region: termin.region ?? "-",
    description: termin.description ?? "-",
    duration: termin.duration ?? "-",
  };
}

function createEmptyBookingRow(): BookingRow {
  const now = new Date().toISOString();

  return {
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: now,
    startDate: "",
    endDate: "",
    updated_at: now,
    status: "AUSSTEHEND",
    exact_location: "",
    hall_or_location: "",
    phone_number: "",
    name: "",
    occasion: "SONSTIGES",
    package_name: "",
    booking_type: "",
    region: "",
    description: "",
    duration: "",
    isNew: true,
    isCreating: false,
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

  const loadTermine = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
      }

      const res = await fetch(`${API_BASE_URL}/api/termine`, {
        cache: "no-store",
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const text = await res.text();
      const data: TerminApi[] = text ? JSON.parse(text) : [];

      setRows((prev) => {
        const unsavedNewRows = prev.filter((row) => row.isNew);
        const loadedRows = Array.isArray(data) ? data.map(mapTerminToBookingRow) : [];
        return [...unsavedNewRows, ...loadedRows];
      });
    } catch (err) {
      console.error("Error loading termine", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setRows((prev) => prev.filter((row) => row.isNew));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTermine();
  }, [loadTermine]);

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
          row.phone_number,
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
        row.phone_number,
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

  function addNewRow() {
    setRows((prev) => [createEmptyBookingRow(), ...prev]);
  }

  function removeNewRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function updateField<K extends keyof BookingRow>(
    id: string,
    field: K,
    value: BookingRow[K]
  ) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
            ...row,
            [field]: value,
            updated_at: new Date().toISOString(),
          }
          : row
      )
    );
  }

  function setCreatingState(id: string, isCreating: boolean) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
            ...row,
            isCreating,
          }
          : row
      )
    );
  }

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
      }

      const foundRow = rows.find((r) => r.id === id);
      if (foundRow) {
        return [
          ...prev,
          { ...foundRow, status, updated_at: new Date().toISOString() },
        ];
      }

      return prev;
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

  async function handleCreateRow(row: BookingRow) {
    try {
      if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
      }

      if (!row.name.trim()) {
        alert("Bitte Name eingeben.");
        return;
      }

      if (!row.startDate) {
        alert("Bitte ein Startdatum eingeben.");
        return;
      }

      if (!row.endDate) {
        alert("Bitte ein Enddatum eingeben.");
        return;
      }

      const start = new Date(row.startDate);
      const end = new Date(row.endDate);

      if (Number.isNaN(start.getTime())) {
        alert("Startdatum ist ungültig.");
        return;
      }

      if (Number.isNaN(end.getTime())) {
        alert("Enddatum ist ungültig.");
        return;
      }

      if (end <= start) {
        alert("Enddatum muss nach dem Startdatum liegen.");
        return;
      }

      setCreatingState(row.id, true);

      const payload = {
        title: row.name,
        name: row.name,
        status: row.status,
        exactLocation: row.exact_location || null,
        hallOrLocation: row.hall_or_location || null,
        phoneNumber: row.phone_number || null,
        occasion: row.occasion || null,
        packageName: row.package_name || null,
        bookingType: row.booking_type || null,
        region: row.region || null,
        description: row.description || null,
        duration: row.duration || null,
        startDate: row.startDate || null,
        endDate: row.endDate || null,
      };

      

        const res = await fetch(`${API_BASE_URL}/api/termine`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Request failed: ${res.status}`);
      }

      alert("Neuer Termin erfolgreich gespeichert.");

      setRows((prev) => prev.filter((r) => r.id !== row.id));
      await loadTermine();
    } catch (error) {
      console.error("Erstellen fehlgeschlagen:", error);
      alert(
        error instanceof Error
          ? `Erstellen fehlgeschlagen: ${error.message}`
          : "Erstellen fehlgeschlagen."
      );
    } finally {
      setCreatingState(row.id, false);
    }
  }

  async function handleSave() {
    try {
      const rowsToSave = rowsUpdated.filter((row) => !row.isNew);

      if (rowsToSave.length === 0) {
        alert("Keine Änderungen zum Speichern.");
        return;
      }

      setSaving(true);

      if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
      }

      const payload = rowsToSave.map((row) => ({
        id: row.id,
        title: row.name,
        status: row.status,
        exactLocation: row.exact_location,
        hallOrLocation: row.hall_or_location,
        phoneNumber: row.phone_number,
        occasion: row.occasion,
        packageName: row.package_name,
        bookingType: row.booking_type,
        region: row.region,
        description: row.description,
        duration: row.duration,
      }));

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/termine/batch`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Request failed: ${res.status}`);
      }

      alert("Änderungen gespeichert.");
      setRowsUpdated([]);
      await loadTermine();
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
      <div className="mx-auto h-full w-full max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Lade Termine...</p>
        </div>
      </div>
    );
  }

  if (error && rows.filter((r) => !r.isNew).length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">
            Fehler beim Laden: {error}
          </p>
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

            <div className="flex w-full flex-col gap-2 lg:max-w-md lg:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={addNewRow}
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                + Neuer Eintrag
              </button>
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
          {error ? (
            <span className="ml-3 text-red-600">
              Hinweis: Daten konnten nicht vollständig neu geladen werden ({error})
            </span>
          ) : null}
        </div>

        <div className="block space-y-4 p-4 md:hidden">
          {paginatedRows.map((row) => (
            <div
              key={row.id}
              className={`rounded-2xl border p-4 shadow-sm ${row.isNew
                  ? "border-green-200 bg-green-50/40"
                  : "border-slate-200 bg-white"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {row.isNew ? (
                    <input
                      value={row.name}
                      onChange={(e) => updateField(row.id, "name", e.target.value)}
                      placeholder="Name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  ) : (
                    <>
                      <h2 className="truncate text-base font-semibold text-slate-900">
                        {row.name}
                      </h2>
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {row.id}
                      </p>
                    </>
                  )}
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
                {row.isNew ? (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </label>
                      <select
                        value={row.status}
                        onChange={(e) =>
                          updateField(row.id, "status", e.target.value as BookingStatus)
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

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Occasion
                      </label>
                      <select
                        value={row.occasion}
                        onChange={(e) =>
                          updateField(row.id, "occasion", e.target.value as OccasionType)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        {occasionOptions.map((occasion) => (
                          <option key={occasion} value={occasion}>
                            {occasion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Package
                      </label>
                      <input
                        value={row.package_name}
                        onChange={(e) =>
                          updateField(row.id, "package_name", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Booking Type
                      </label>
                      <input
                        value={row.booking_type}
                        onChange={(e) =>
                          updateField(row.id, "booking_type", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Region
                      </label>
                      <input
                        value={row.region}
                        onChange={(e) => updateField(row.id, "region", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Location
                      </label>
                      <input
                        value={row.hall_or_location}
                        onChange={(e) =>
                          updateField(row.id, "hall_or_location", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Telefonnummer
                      </label>
                      <input
                        value={row.phone_number}
                        onChange={(e) =>
                          updateField(row.id, "phone_number", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Exact Location
                      </label>
                      <input
                        value={row.exact_location}
                        onChange={(e) =>
                          updateField(row.id, "exact_location", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Start
                      </label>
                      <input
                        type="datetime-local"
                        value={toDateTimeLocal(row.startDate)}
                        onChange={(e) =>
                          updateField(row.id, "startDate", fromDateTimeLocal(e.target.value))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        End
                      </label>
                      <input
                        type="datetime-local"
                        value={toDateTimeLocal(row.endDate)}
                        onChange={(e) =>
                          updateField(row.id, "endDate", fromDateTimeLocal(e.target.value))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Duration
                      </label>
                      <input
                        value={row.duration}
                        onChange={(e) => updateField(row.id, "duration", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Description
                      </label>
                      <textarea
                        value={row.description}
                        onChange={(e) =>
                          updateField(row.id, "description", e.target.value)
                        }
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <InfoItem label="Occasion" value={row.occasion} />
                    <InfoItem label="Package" value={row.package_name} />
                    <InfoItem label="Booking Type" value={row.booking_type} />
                    <InfoItem label="Region" value={row.region} />
                    <InfoItem label="Location" value={row.hall_or_location} />
                    <InfoItem label="Telefonnummer" value={row.phone_number} />
                    <InfoItem label="Exact Location" value={row.exact_location} />
                    <InfoItem label="Start" value={formatDateTime(row.startDate)} />
                    <InfoItem label="End" value={formatDateTime(row.endDate)} />
                    <InfoItem label="Created" value={formatDateTime(row.created_at)} />
                    <InfoItem label="Updated" value={formatDateTime(row.updated_at)} />
                    <InfoItem label="Duration" value={row.duration} />
                    <InfoItem label="Description" value={row.description} />
                  </>
                )}
              </div>

              <div className="mt-4">
                {row.isNew ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCreateRow(row)}
                      disabled={row.isCreating}
                      className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {row.isCreating ? "Speichert..." : "Zur Datenbank hinzufügen"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNewRow(row.id)}
                      disabled={row.isCreating}
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Abbrechen
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
            <table className="w-full min-w-[1500px] text-sm ">
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
                  <th>Phone</th>
                  <th>Exact Location</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Aktion</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {paginatedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`align-top transition-colors hover:bg-slate-100 ${row.isNew ? "bg-green-50/40" : "odd:bg-white even:bg-slate-50"
                      }`}
                  >
                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.name}
                          onChange={(e) => updateField(row.id, "name", e.target.value)}
                          className="w-full min-w-[180px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Name"
                        />
                      ) : (
                        <div className="font-semibold text-slate-900">{row.name}</div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.phone_number}
                          onChange={(e) =>
                            updateField(row.id, "phone_number", e.target.value)
                          }
                          className="w-full min-w-[140px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Telefonnummer"
                        />
                      ) : (
                        row.phone_number
                      )}
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
                          row.isNew
                            ? updateField(row.id, "status", e.target.value as BookingStatus)
                            : updateStatus(row.id, e.target.value as BookingStatus)
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

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <select
                          value={row.occasion}
                          onChange={(e) =>
                            updateField(row.id, "occasion", e.target.value as OccasionType)
                          }
                          className="w-full min-w-[140px] rounded-lg border border-slate-200 bg-white px-3 py-2"
                        >
                          {occasionOptions.map((occasion) => (
                            <option key={occasion} value={occasion}>
                              {occasion}
                            </option>
                          ))}
                        </select>
                      ) : (
                        row.occasion
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.package_name}
                          onChange={(e) =>
                            updateField(row.id, "package_name", e.target.value)
                          }
                          className="w-full min-w-[140px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Package"
                        />
                      ) : (
                        row.package_name
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.booking_type}
                          onChange={(e) =>
                            updateField(row.id, "booking_type", e.target.value)
                          }
                          className="w-full min-w-[140px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Booking Type"
                        />
                      ) : (
                        row.booking_type
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.region}
                          onChange={(e) => updateField(row.id, "region", e.target.value)}
                          className="w-full min-w-[120px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Region"
                        />
                      ) : (
                        row.region
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.hall_or_location}
                          onChange={(e) =>
                            updateField(row.id, "hall_or_location", e.target.value)
                          }
                          className="w-full min-w-[160px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Location"
                        />
                      ) : (
                        row.hall_or_location
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.exact_location}
                          onChange={(e) =>
                            updateField(row.id, "exact_location", e.target.value)
                          }
                          className="w-full min-w-[180px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Exact Location"
                        />
                      ) : (
                        row.exact_location
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          type="datetime-local"
                          value={toDateTimeLocal(row.startDate)}
                          onChange={(e) =>
                            updateField(
                              row.id,
                              "startDate",
                              fromDateTimeLocal(e.target.value)
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2"
                        />
                      ) : (
                        formatDateTime(row.startDate)
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          type="datetime-local"
                          value={toDateTimeLocal(row.endDate)}
                          onChange={(e) =>
                            updateField(
                              row.id,
                              "endDate",
                              fromDateTimeLocal(e.target.value)
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2"
                        />
                      ) : (
                        formatDateTime(row.endDate)
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {row.isNew ? (
                        <input
                          value={row.duration}
                          onChange={(e) => updateField(row.id, "duration", e.target.value)}
                          className="w-full min-w-[100px] rounded-lg border border-slate-200 px-3 py-2"
                          placeholder="Duration"
                        />
                      ) : (
                        row.duration
                      )}
                    </td>

                    <td className="w-[260px] max-w-[400px] px-4 py-3 align-top">
                      {row.isNew ? (
                        <textarea
                          value={row.description}
                          onChange={(e) =>
                            updateField(row.id, "description", e.target.value)
                          }
                          className="h-24 w-full resize-none overflow-y-auto rounded-lg border border-slate-200 px-3 py-2 text-slate-700"
                          placeholder="Description"
                        />
                      ) : (
                        <div className="max-h-12 overflow-y-auto break-words pr-2 text-slate-700">
                          {row.description}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {row.isNew ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleCreateRow(row)}
                            disabled={row.isCreating}
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {row.isCreating ? "Speichert..." : "Hinzufügen"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeNewRow(row.id)}
                            disabled={row.isCreating}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Abbrechen
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}

                {paginatedRows.length === 0 && (
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