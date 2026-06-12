import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

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

    // Fallback: read directly from JSON file
    const filePath = path.join(process.cwd(), "ibge_data.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContents);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("IBGE data fetch error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados do IBGE" },
      { status: 500 }
    );
  }
}
