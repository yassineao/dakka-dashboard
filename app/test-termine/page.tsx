"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Termin = {
  id: number;
  title: string;
  location: string;
  booking_type: string;
  start_date: string;
  end_date: string;
};

export default function TestTerminePage() {
  const [termine, setTermine] = useState<Termin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTermine = async () => {
      try {
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
        const data = text ? JSON.parse(text) : [];

        console.log("Geladene Termine:", data);
        setTermine(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading termine", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadTermine();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Termine Testseite</h1>

      {loading && <p>Lade Termine...</p>}
      {error && <p>Fehler: {error}</p>}
      {!loading && !error && termine.length === 0 && <p>Keine Termine gefunden</p>}

      <ul>
        {termine.map((termin) => (
          <li key={termin.id} style={{ marginBottom: 20 }}>
            <strong>{termin.title}</strong>
            <br />
            Ort: {termin.location}
            <br />
            Typ: {termin.booking_type}
            <br />
            Start: {new Date(termin.start_date).toLocaleString()}
            <br />
            Ende: {new Date(termin.end_date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}