import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    let seeded = {
      ibgeData: 0,
      users: 0,
      quizScores: 0,
    };

    // 1. Seed IBGE data from JSON file
    const filePath = path.join(process.cwd(), "ibge_data.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const ibgeData = JSON.parse(fileContents);

    for (const [key, value] of Object.entries(ibgeData)) {
      await db.ibgeData.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: {
          key,
          value: JSON.stringify(value),
        },
      });
      seeded.ibgeData++;
    }

    // 2. Seed demo users
    const demoUsers = [
      {
        name: "Maria Silva",
        email: "maria@brasil.com",
        password: "brasil123",
      },
      {
        name: "João Santos",
        email: "joao@brasil.com",
        password: "brasil123",
      },
      {
        name: "Ana Oliveira",
        email: "ana@brasil.com",
        password: "brasil123",
      },
    ];

    for (const userData of demoUsers) {
      const existingUser = await db.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const passwordHash = await hash(userData.password, 12);
        await db.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            passwordHash,
          },
        });
        seeded.users++;
      }
    }

    // 3. Seed demo quiz scores
    const users = await db.user.findMany();
    const categories = ["geral", "emprego", "renda", "educação", "regional"];
    const demoScores = [
      { userId: users[0]?.id, score: 8, total: 10, category: "geral" },
      { userId: users[1]?.id, score: 7, total: 10, category: "emprego" },
      { userId: users[2]?.id, score: 9, total: 10, category: "renda" },
      { userId: users[0]?.id, score: 6, total: 10, category: "educação" },
      { userId: users[1]?.id, score: 8, total: 10, category: "regional" },
      { userId: users[2]?.id, score: 7, total: 10, category: "geral" },
    ];

    for (const scoreData of demoScores) {
      if (scoreData.userId) {
        // Check if similar score already exists to avoid duplicates
        const existingScore = await db.quizScore.findFirst({
          where: {
            userId: scoreData.userId,
            score: scoreData.score,
            total: scoreData.total,
            category: scoreData.category,
          },
        });

        if (!existingScore) {
          await db.quizScore.create({
            data: {
              userId: scoreData.userId,
              score: scoreData.score,
              total: scoreData.total,
              category: scoreData.category,
            },
          });
          seeded.quizScores++;
        }
      }
    }

    return NextResponse.json({
      message: "Dados carregados com sucesso!",
      seeded,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados iniciais", details: String(error) },
      { status: 500 }
    );
  }
}
