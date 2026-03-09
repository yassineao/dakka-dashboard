import { sql } from "@/lib/db";

export async function GET() {
  try {
    const termine = await sql`
      SELECT * FROM termine
    `;

    return Response.json(termine);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch termine" },
      { status: 500 }
    );
  }
}