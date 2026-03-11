"use client";

import { useMemo, useState } from "react";

type BookingType = "Meeting" | "Training" | "Workshop" | "Private";
type Anlass = "Hochzeit" | "Henna" | "Verlobung" | "Geburtstag" | "Sonstiges";
type RegionOrt = "NRW" | "HESSEN" | "ANDERER_ORT";

type CalendarEvent = {
  id: string;
  title: string; // name
  description?: string;
  location?: string;
  bookingType?: BookingType;
  start: Date;
  end: Date;
  color: "purple" | "sky" | "emerald";
  booked?: boolean;
  bookedBy?: string;
};

const WHATSAPP_NUMBER = "491776889333"; // <- your number (no +)

const COLOR_STYLES: Record<
  CalendarEvent["color"],
  { dot: string; hoverText: string; pillBg: string; pillText: string }
> = {
  purple: {
    dot: "bg-purple-600",
    hoverText: "hover:text-purple-600",
    pillBg: "bg-purple-50",
    pillText: "text-purple-600",
  },
  sky: {
    dot: "bg-sky-400",
    hoverText: "hover:text-sky-400",
    pillBg: "bg-sky-50",
    pillText: "text-sky-600",
  },
  emerald: {
    dot: "bg-emerald-600",
    hoverText: "hover:text-emerald-600",
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-600",
  },
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function formatEventRange(start: Date, end: Date) {
  const datePart = start.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  return `${datePart} - ${formatTime(start)} - ${formatTime(end)}`;
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function monthTitle(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
function buildMonthGrid(monthDate: Date) {
  const first = startOfMonth(monthDate);
  const last = endOfMonth(monthDate);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));
  const days: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
function isSameMonth(a: Date, monthDate: Date) {
  return (
    a.getFullYear() === monthDate.getFullYear() &&
    a.getMonth() === monthDate.getMonth()
  );
}
function sortByStart(a: CalendarEvent, b: CalendarEvent) {
  return a.start.getTime() - b.start.getTime();
}
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart;
}
function onDate(date: Date, hour: number, minute = 0) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0
  );
}
function isDayBooked(day: Date, events: CalendarEvent[]) {
  return events.some((e) => e.booked && sameDay(e.start, day));
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => [
    {
      id: "e1",
      title: "Meeting with friends",
      description: "Meet-Up for Travel Destination Discussion",
      location: "Room A",
      bookingType: "Meeting",
      start: new Date(2024, 0, 3, 10, 0),
      end: new Date(2024, 0, 3, 11, 0),
      color: "purple",
      booked: true,
      bookedBy: "John Doe",
    },
    {
      id: "e2",
      title: "Visiting online course",
      description: "Checks updates for design course",
      location: "Online",
      bookingType: "Training",
      start: new Date(2024, 0, 19, 5, 40),
      end: new Date(2024, 0, 19, 13, 0),
      color: "sky",
      booked: true,
      bookedBy: "Course System",
    },
    {
      id: "e3",
      title: "Development meet",
      description: "Discussion with developer for upcoming project",
      location: "Office",
      bookingType: "Workshop",
      start: new Date(2024, 0, 7, 10, 0),
      end: new Date(2024, 0, 7, 11, 0),
      color: "emerald",
      booked: true,
      bookedBy: "Team A",
    },
  ]);

  const [activeMonth, setActiveMonth] = useState<Date>(() =>
    startOfMonth(new Date(2024, 0, 1))
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2024, 0, 9));
  const [openMenuForId, setOpenMenuForId] = useState<string | null>(null);

  // time selection
  const [selectedHour, setSelectedHour] = useState<number>(10);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  // booking fields
  const [bookingName, setBookingName] = useState("");
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("Meeting");
  const [bookingDescription, setBookingDescription] = useState("");
  const [bookingDurationHours, setBookingDurationHours] = useState<number>(1);

  // ✅ Added: Ort/Anlass/Paket
  const [ortRegion, setOrtRegion] = useState<RegionOrt>("NRW");
  const [otherOrt, setOtherOrt] = useState("");
  const [anlass, setAnlass] = useState<Anlass>("Hochzeit");
  const [paket, setPaket] = useState("");

  const monthDays = useMemo(() => buildMonthGrid(activeMonth), [activeMonth]);

  const upcomingEvents = useMemo(() => {
    const from = new Date(selectedDate);
    from.setHours(0, 0, 0, 0);
    return events
      .filter((e) => e.end.getTime() >= from.getTime())
      .slice()
      .sort(sortByStart)
      .slice(0, 3);
  }, [events, selectedDate]);

  function toggleMenu(id: string) {
    setOpenMenuForId((curr) => (curr === id ? null : id));
  }
  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setOpenMenuForId(null);
  }
  function editEvent(id: string) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              title: e.title.includes("(Edited)")
                ? e.title
                : `${e.title} (Edited)`,
            }
          : e
      )
    );
    setOpenMenuForId(null);
  }

  function eventForDay(day: Date) {
    const dayEvents = events
      .filter((e) => sameDay(e.start, day))
      .slice()
      .sort(sortByStart);
    return dayEvents[0] ?? null;
  }

  function isHourBooked(hour: number) {
    const slotStart = onDate(selectedDate, hour, 0);
    const slotEnd = onDate(selectedDate, hour + 1, 0);

    return events.some((e) => {
      if (!sameDay(e.start, selectedDate)) return false;
      if (!e.booked) return false;
      return overlaps(slotStart, slotEnd, e.start, e.end);
    });
  }

  const bookingWindow = useMemo(() => {
    const start = onDate(selectedDate, selectedHour, 0);
    const end = onDate(selectedDate, selectedHour + bookingDurationHours, 0);
    return { start, end };
  }, [selectedDate, selectedHour, bookingDurationHours]);

  const isBookingWindowFree = useMemo(() => {
    return !events.some((e) => {
      if (!sameDay(e.start, selectedDate)) return false;
      if (!e.booked) return false;
      return overlaps(bookingWindow.start, bookingWindow.end, e.start, e.end);
    });
  }, [events, selectedDate, bookingWindow]);

  const blockingEvent = useMemo(() => {
    if (isBookingWindowFree) return null;
    const blockers = events
      .filter((e) => sameDay(e.start, selectedDate) && e.booked)
      .filter((e) =>
        overlaps(bookingWindow.start, bookingWindow.end, e.start, e.end)
      )
      .slice()
      .sort(sortByStart);
    return blockers[0] ?? null;
  }, [events, selectedDate, bookingWindow, isBookingWindowFree]);

  function resetBookingForm() {
    setBookingName("");
    setBookingLocation("");
    setBookingType("Meeting");
    setBookingDescription("");
    setBookingDurationHours(1);

    setOrtRegion("NRW");
    setOtherOrt("");
    setAnlass("Hochzeit");
    setPaket("");
  }

  function handleCreateBooking() {
    // internal booking (optional)
    if (!bookingName.trim()) return;
    if (!bookingLocation.trim()) return;
    if (!isBookingWindowFree) return;

    const newEvent: CalendarEvent = {
      id: `evt_${crypto.randomUUID()}`,
      title: bookingName.trim(),
      location: bookingLocation.trim(),
      bookingType,
      description: bookingDescription.trim() || undefined,
      start: bookingWindow.start,
      end: bookingWindow.end,
      color: "emerald",
      booked: true,
      bookedBy: "You",
    };

    setEvents((prev) => [...prev, newEvent].sort(sortByStart));
    // keep form or reset—your choice:
    // resetBookingForm();
  }

  const whatsappHref = useMemo(() => {
    const ortText =
      ortRegion === "ANDERER_ORT"
        ? `Anderer Ort: ${otherOrt }`
        : `Region: ${ortRegion === "HESSEN" ? "Hessen" : "NRW"}`;

    const text = `Hallo Dakka Nassim,

Ich möchte anfragen / buchen:

${ortText}
Datum: ${selectedDate.toLocaleDateString()}
Uhrzeit: ${pad2(selectedHour)}:00 – ${pad2(
      (selectedHour + bookingDurationHours) % 24
    )}:00
Dauer: ${bookingDurationHours} Stunde(n)

Name: ${bookingName || "-"}
Anlass: ${anlass}
Paket: ${paket || "-"}

Saal/Location: ${bookingLocation || "-"}
Beschreibung: ${bookingDescription || "-"}

Danke!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [
    ortRegion,
    otherOrt,
    selectedDate,
    selectedHour,
    bookingDurationHours,
    bookingName,
    anlass,
    paket,
    bookingLocation,
    bookingDescription,
  ]);



const instagramProfileUrl = "https://instagram.com/DEIN_USERNAME";

async function copyBookingText() {
  const ortText =
    ortRegion === "ANDERER_ORT"
      ? `Anderer Ort: ${otherOrt}`
      : `Region: ${ortRegion === "HESSEN" ? "Hessen" : "NRW"}`;

  const text = `Hallo Dakka Nassim,

Ich möchte anfragen / buchen:

${ortText}
Datum: ${selectedDate.toLocaleDateString()}
Uhrzeit: ${pad2(selectedHour)}:00 – ${pad2(
    (selectedHour + bookingDurationHours) % 24
  )}:00
Dauer: ${bookingDurationHours} Stunde(n)

Name: ${bookingName || "-"}
Anlass: ${anlass}
Paket: ${paket || "-"}

Saal/Location: ${bookingLocation || "-"}
Beschreibung: ${bookingDescription || "-"}

Danke!`;

  await navigator.clipboard.writeText(text);
}









  const canSendWhatsapp =
    bookingName.trim().length > 0 &&
    bookingLocation.trim().length > 0 &&
    (ortRegion !== "ANDERER_ORT" || otherOrt.trim().length > 0);

  return (
    <section className="relative bg-stone-50">
      <div className="bg-sky-400 w-full sm:w-40 h-40 rounded-full absolute top-1 opacity-20 max-sm:right-0 sm:left-56 z-0" />
      <div className="bg-emerald-500 w-full sm:w-40 h-24 absolute top-0 -left-0 opacity-20 z-0" />
      <div className="bg-purple-600 w-full sm:w-40 h-24 absolute top-40 -left-0 opacity-20 z-0" />

      <div className="w-full py-24 relative z-10 backdrop-blur-3xl">
        <div className="w-full max-w-7xl mx-auto px-2 lg:px-8">
          <div className="grid grid-cols-12 gap-8 max-w-4xl mx-auto xl:max-w-full">
            {/* Left */}
            <div className="col-span-12 xl:col-span-5">
              <h2 className="font-manrope text-3xl leading-tight text-gray-900 mb-1.5">
                Buchen
              </h2>
              <p className="text-lg font-normal text-gray-600 mb-6">
                Ausgewählte Zeit: {selectedDate.toLocaleDateString()} ·{" "}
                {pad2(selectedHour)}:00–{pad2((selectedHour + bookingDurationHours) % 24)}:00
              </p>

              {/* Hours grid */}
              <div className="p-6 rounded-xl bg-white mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    Uhrzeiten
                  </h3>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {hours.map((h) => {
                    const booked = isHourBooked(h);
                    const selected = h === selectedHour;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHour(h)}
                        className={[
                          "px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border",
                          selected ? "ring-2 ring-indigo-600 ring-inset" : "",
                          booked
                            ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-indigo-50",
                        ].join(" ")}
                      >
                        {pad2(h)}:00
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booking + WhatsApp form */}
              <div className="p-6 rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Anfrage / Buchung
                  </h3>
                  <span className="text-xs text-gray-600">
                    {selectedDate.toLocaleDateString()} · {pad2(selectedHour)}:00–
                    {pad2((selectedHour + bookingDurationHours) % 24)}:00
                  </span>
                </div>

                {/* Availability banner */}
                {isBookingWindowFree ? (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <div className="font-semibold">Slot ist frei.</div>
                    <div className="text-xs mt-1">
                      Du kannst diese Zeit anfragen.
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    <div className="font-semibold">Slot ist gebucht.</div>
                    {blockingEvent ? (
                      <div className="text-xs mt-1">
                        Blockiert durch:{" "}
                        <span className="font-medium">{blockingEvent.title}</span>{" "}
                        · {formatTime(blockingEvent.start)}–
                        {formatTime(blockingEvent.end)}
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Ort */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Ort
                    </label>
                    <select
                      value={ortRegion}
                      onChange={(e) => setOrtRegion(e.target.value as RegionOrt)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      <option value="NRW">NRW</option>
                      <option value="HESSEN">Hessen</option>
                      <option value="ANDERER_ORT">Anderer Ort</option>
                    </select>
                  </div>

                  {/* Genauer Ort */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Genauer Ort
                    </label>
                    <input
                      value={otherOrt}
                      onChange={(e) => setOtherOrt(e.target.value)}
                      disabled={ortRegion !== "ANDERER_ORT"}
                      placeholder={
                        ortRegion === "ANDERER_ORT" ? "z.B. Berlin, Hamburg..." : "—"
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-50"
                    />
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Name *
                    </label>
                    <input
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="z.B. Familie Ait Ali"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Saal/Location */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Saal/Location *
                    </label>
                    <input
                      value={bookingLocation}
                      onChange={(e) => setBookingLocation(e.target.value)}
                      placeholder="z.B. Amaria / Name vom Saal"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Anlass */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Anlass
                    </label>
                    <select
                      value={anlass}
                      onChange={(e) => setAnlass(e.target.value as Anlass)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      <option value="Hochzeit">Hochzeit</option>
                      <option value="Henna">Henna</option>
                      <option value="Verlobung">Verlobung</option>
                      <option value="Geburtstag">Geburtstag</option>
                      <option value="Sonstiges">Sonstiges</option>
                    </select>
                  </div>

                  {/* Paket */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Paket
                    </label>
                    <input
                      value={paket}
                      onChange={(e) => setPaket(e.target.value)}
                      placeholder="z.B. Paket 3 Royal"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Booking Type (keep) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Booking Type
                    </label>
                    <select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value as BookingType)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      <option value="Meeting">Meeting</option>
                      <option value="Training">Training</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  {/* Dauer */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Dauer
                    </label>
                    <select
                      value={bookingDurationHours}
                      onChange={(e) => setBookingDurationHours(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((h) => (
                        <option key={h} value={h}>
                          {h} Stunde{h > 1 ? "n" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Beschreibung
                    </label>
                    <textarea
                      value={bookingDescription}
                      onChange={(e) => setBookingDescription(e.target.value)}
                      placeholder="z.B. Brautabholung + Saalempfang, getrennte Bereiche, besondere Wünsche..."
                      rows={3}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleCreateBooking}
                    disabled={
                      !isBookingWindowFree ||
                      !bookingName.trim() ||
                      !bookingLocation.trim()
                    }
                    className={[
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                      !isBookingWindowFree ||
                      !bookingName.trim() ||
                      !bookingLocation.trim()
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700",
                    ].join(" ")}
                  >
                    Intern buchen
                  </button>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className={[
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all text-center",
                      canSendWhatsapp
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-200 text-gray-500 pointer-events-none",
                    ].join(" ")}
                  >
                    Per WhatsApp senden
                  </a>

                  <button
                    type="button"
                    onClick={resetBookingForm}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100"
                  >
                    Reset
                  </button>
                </div>

                {!canSendWhatsapp && (
                  <p className="mt-3 text-xs text-gray-500">
                    Bitte mindestens <strong>Name</strong>,{" "}
                    <strong>Saal/Location</strong> und bei{" "}
                    <strong>Anderer Ort</strong> den genauen Ort ausfüllen.
                  </p>
                )}
              </div>

              {/* Upcoming list */}
              <div className="mt-6">
                <p className="text-lg font-normal text-gray-600 mb-4">
                  Nächste Termine
                </p>
                <div className="flex gap-5 flex-col">
                  {upcomingEvents.length === 0 ? (
                    <div className="p-6 rounded-xl bg-white">
                      <p className="text-base font-medium text-gray-900">Frei</p>
                      <p className="text-base font-normal text-gray-600">
                        Keine Termine.
                      </p>
                    </div>
                  ) : (
                    upcomingEvents.map((ev) => {
                      const styles = COLOR_STYLES[ev.color];
                      return (
                        <div key={ev.id} className="p-6 rounded-xl bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                              <p className="text-base font-medium text-gray-900">
                                {formatEventRange(ev.start, ev.end)}
                              </p>
                              {ev.booked && (
                                <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">
                                  gebucht
                                </span>
                              )}
                            </div>

                            <div className="relative inline-flex">
                              <button
                                type="button"
                                onClick={() => toggleMenu(ev.id)}
                                className={`inline-flex justify-center py-2.5 px-1 items-center gap-2 text-sm text-black rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 ${styles.hoverText}`}
                                aria-haspopup="menu"
                                aria-expanded={openMenuForId === ev.id}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="4"
                                  viewBox="0 0 12 4"
                                  fill="none"
                                >
                                  <path
                                    d="M1.85624 2.00085H1.81458M6.0343 2.00085H5.99263M10.2124 2.00085H10.1707"
                                    stroke="currentcolor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </button>

                              {openMenuForId === ev.id && (
                                <div
                                  className="rounded-xl shadow-lg bg-white absolute top-full -left-10 w-max mt-2"
                                  role="menu"
                                >
                                  <ul className="py-2">
                                    <li>
                                      <button
                                        onClick={() => editEvent(ev.id)}
                                        className="w-full text-left block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                        role="menuitem"
                                      >
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        onClick={() => removeEvent(ev.id)}
                                        className="w-full text-left block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                        role="menuitem"
                                      >
                                        Remove
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          <h6 className="text-xl leading-8 font-semibold text-black mb-1">
                            {ev.title}
                          </h6>
                          <p className="text-base font-normal text-gray-600">
                            {ev.location ? (
                              <span className="block text-sm text-gray-500">
                                📍 {ev.location}
                              </span>
                            ) : null}
                            {ev.bookingType ? (
                              <span className="block text-sm text-gray-500">
                                🏷️ {ev.bookingType}
                              </span>
                            ) : null}
                            {ev.description ?? "—"}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right: Calendar */}
            <div className="col-span-12 xl:col-span-7 px-2.5 py-5 sm:p-8 bg-gradient-to-b from-white/25 to-white xl:bg-white rounded-2xl max-xl:row-start-1">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <h5 className="text-xl leading-8 font-semibold text-gray-900">
                    {monthTitle(activeMonth)}
                  </h5>
                  <div className="flex items-center">
                    <button
                      onClick={() => setActiveMonth((m) => addMonths(m, -1))}
                      className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
                      aria-label="Previous month"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
                          stroke="currentcolor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveMonth((m) => addMonths(m, 1))}
                      className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
                      aria-label="Next month"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M6.00236 3.99707L10.0025 7.99723L6 11.9998"
                          stroke="currentcolor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-indigo-200 rounded-xl">
                <div className="grid grid-cols-7 rounded-t-3xl border-b border-indigo-200">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                    <div
                      key={d}
                      className={[
                        "py-3.5 border-indigo-200 bg-indigo-50 flex items-center justify-center text-sm font-medium text-indigo-600",
                        i === 0 ? "rounded-tl-xl border-r" : "",
                        i > 0 && i < 6 ? "border-r" : "",
                        i === 6 ? "rounded-tr-xl" : "",
                      ].join(" ")}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 rounded-b-xl">
                  {monthDays.map((day) => {
                    const inMonth = isSameMonth(day, activeMonth);
                    const isSelected = sameDay(day, selectedDate);

                    const bookedDay = isDayBooked(day, events);
                    const ev = eventForDay(day);

                    const baseBg = inMonth ? "bg-white" : "bg-gray-50";
                    const textColor = inMonth ? "text-gray-900" : "text-gray-400";

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedHour(10);
                        }}
                        className={[
                          "text-left flex xl:aspect-square max-xl:min-h-[60px] p-3.5 border-b border-indigo-200 transition-all duration-300 cursor-pointer relative",
                          day.getDay() !== 6 ? "border-r border-indigo-200" : "",
                          isSelected ? "ring-2 ring-indigo-600 ring-inset" : "",
                          bookedDay ? "bg-red-50 hover:bg-red-100" : `${baseBg} hover:bg-indigo-50`,
                        ].join(" ")}
                      >
                        <span className={`text-xs font-semibold ${bookedDay ? "text-red-600" : textColor}`}>
                          {day.getDate()}
                        </span>

                        {bookedDay && (
                          <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">
                            Booked
                          </span>
                        )}

                        {ev && (
                          <div
                            className={[
                              "absolute top-9 bottom-1 left-3.5 p-1.5 xl:px-2.5 h-max rounded",
                              COLOR_STYLES[ev.color].pillBg,
                            ].join(" ")}
                          >
                            <p
                              className={[
                                "hidden xl:block text-xs font-medium mb-px whitespace-nowrap",
                                COLOR_STYLES[ev.color].pillText,
                              ].join(" ")}
                            >
                              {ev.title}
                            </p>
                            <span
                              className={[
                                "hidden xl:block text-xs font-normal whitespace-nowrap",
                                COLOR_STYLES[ev.color].pillText,
                              ].join(" ")}
                            >
                              {formatTime(ev.start)} - {formatTime(ev.end)}
                            </span>
                            <p className={["xl:hidden w-2 h-2 rounded-full", COLOR_STYLES[ev.color].dot].join(" ")} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Selected:</span>{" "}
                {selectedDate.toLocaleDateString()} ·{" "}
                <span className="font-medium text-gray-900">Hour:</span>{" "}
                {pad2(selectedHour)}:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}