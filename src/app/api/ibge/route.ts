import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ibgeData } from "@/lib/ibge-data";

export async function GET() {
  try {
    // Try to read from database first
    const dbData = await db.ibgeData.findMany();

    if (dbData.length > 0) {
      // Convert database records to a structured object
      const data: Record<string, unknown> = {};
      for (const record of dbData) {
        data[record.key] = JSON.parse(record.value);
      }
      return NextResponse.json(data);
    }

    // Fallback: use inline data (works on Vercel serverless)
    return NextResponse.json(ibgeData);
  } catch (error) {
    console.error("IBGE data fetch error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados do IBGE" },
      { status: 500 }
    );
  }
}
