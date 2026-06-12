import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

// POST - Save a quiz score
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { score, total, category, userId: bodyUserId } = body;

    // Try session first, fall back to userId from request body
    const session = await getCurrentSession();
    const userId = session?.user?.id || bodyUserId;

    if (!userId) {
      return NextResponse.json(
        { error: "É necessário estar logado para salvar o resultado" },
        { status: 401 }
      );
    }

    // Verify the user exists
    const userExists = await db.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    if (typeof score !== "number" || typeof total !== "number") {
      return NextResponse.json(
        { error: "Score e total são obrigatórios e devem ser números" },
        { status: 400 }
      );
    }

    if (score < 0 || total <= 0 || score > total) {
      return NextResponse.json(
        { error: "Valores de score inválidos" },
        { status: 400 }
      );
    }

    const quizScore = await db.quizScore.create({
      data: {
        userId,
        score,
        total,
        category: category || "geral",
      },
    });

    return NextResponse.json(
      {
        id: quizScore.id,
        score: quizScore.score,
        total: quizScore.total,
        category: quizScore.category,
        message: "Resultado salvo com sucesso!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save quiz score error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar resultado" },
      { status: 500 }
    );
  }
}

// GET - Get ranking (top scores with user info)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "geral";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Get top scores with user info
    const topScores = await db.quizScore.findMany({
      where: { category },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: Math.min(limit, 50),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Calculate percentage and add rank
    const ranking = topScores.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      userName: entry.user.name || "Anônimo",
      userImage: entry.user.image,
      score: entry.score,
      total: entry.total,
      percentage: Math.round((entry.score / entry.total) * 100),
      category: entry.category,
      createdAt: entry.createdAt,
    }));

    return NextResponse.json({
      category,
      ranking,
    });
  } catch (error) {
    console.error("Get ranking error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar ranking" },
      { status: 500 }
    );
  }
}
