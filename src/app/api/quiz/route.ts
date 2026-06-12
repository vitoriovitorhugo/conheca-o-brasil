import { NextResponse } from "next/server";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Qual era a taxa de desocupação no Brasil em 2024, segundo o IBGE?",
    options: ["6,63%", "7,75%", "9,58%", "11,63%"],
    correctAnswer: 0,
    category: "emprego",
    explanation:
      "Em 2024, a taxa de desocupação no Brasil foi de 6,63%, a menor da série histórica recente.",
  },
  {
    id: 2,
    question:
      "Em que ano o Brasil registrou a maior taxa de desocupação da série histórica (2012-2024)?",
    options: ["2016", "2017", "2020", "2021"],
    correctAnswer: 3,
    category: "emprego",
    explanation:
      "Em 2021, a taxa de desocupação atingiu 14,01%, a mais alta da série, reflexo dos impactos da pandemia.",
  },
  {
    id: 3,
    question:
      "Qual é a taxa de participação na força de trabalho das mulheres em comparação com os homens?",
    options: [
      "Mulheres: 53,46% | Homens: 72,80%",
      "Mulheres: 62,78% | Homens: 62,78%",
      "Mulheres: 72,80% | Homens: 53,46%",
      "Mulheres: 60,46% | Homens: 63,25%",
    ],
    correctAnswer: 0,
    category: "emprego",
    explanation:
      "A taxa de participação das mulheres é de 53,46%, enquanto a dos homens é de 72,80%, uma diferença de quase 20 pontos percentuais.",
  },
  {
    id: 4,
    question:
      "Qual grupo racial possui a maior taxa de formalização no trabalho?",
    options: ["Preta", "Parda", "Branca", "Preta ou parda"],
    correctAnswer: 2,
    category: "emprego",
    explanation:
      "A população branca tem a maior taxa de formalização (65,97%), contra 56,44% para pretos e 53,79% para pardos.",
  },
  {
    id: 5,
    question:
      "Qual faixa etária tem a maior taxa de desocupação no Brasil?",
    options: [
      "14 a 17 anos",
      "18 a 24 anos",
      "25 a 29 anos",
      "60 anos ou mais",
    ],
    correctAnswer: 1,
    category: "emprego",
    explanation:
      "A faixa de 18 a 24 anos tem a maior taxa de desocupação (13,44%), seguida por 14 a 17 anos.",
  },
  {
    id: 6,
    question:
      "Qual era o rendimento médio mensal real no Brasil em 2024 (em reais)?",
    options: [
      "R$ 1.848,64",
      "R$ 2.124,74",
      "R$ 2.514,24",
      "R$ 3.732,00",
    ],
    correctAnswer: 1,
    category: "renda",
    explanation:
      "O rendimento médio mensal principal em 2024 foi de R$ 2.124,74, o maior da série histórica.",
  },
  {
    id: 7,
    question:
      "Qual é a diferença de rendimento médio entre homens e mulheres no Brasil?",
    options: [
      "Homens ganham cerca de R$ 100 a mais",
      "Homens ganham cerca de R$ 280 a mais",
      "Mulheres ganham mais que homens",
      "Não há diferença significativa",
    ],
    correctAnswer: 1,
    category: "renda",
    explanation:
      "O rendimento médio dos homens é R$ 2.244,33 e das mulheres R$ 1.963,42, uma diferença de aproximadamente R$ 281.",
  },
  {
    id: 8,
    question:
      "Qual grupo racial tem o maior rendimento médio mensal no Brasil?",
    options: ["Preta", "Parda", "Branca", "Todos recebem o mesmo"],
    correctAnswer: 2,
    category: "renda",
    explanation:
      "A população branca tem rendimento médio de R$ 2.514,24, contra R$ 1.930,82 (preta) e R$ 1.831,80 (parda).",
  },
  {
    id: 9,
    question:
      "Qual região do Brasil tem a maior porcentagem de jovens em situação de pobreza extrema (até R$ 215/mês)?",
    options: ["Sudeste", "Sul", "Nordeste", "Centro-Oeste"],
    correctAnswer: 2,
    category: "regional",
    explanation:
      "O Nordeste tem 22,43% dos jovens em pobreza extrema, a maior taxa entre as regiões.",
  },
  {
    id: 10,
    question:
      "Qual região tem a maior proporção de jovens que nem estudam nem estão ocupados (nem-nem)?",
    options: ["Sudeste", "Sul", "Nordeste", "Centro-Oeste"],
    correctAnswer: 2,
    category: "regional",
    explanation:
      "O Nordeste tem 27,55% de jovens nem-nem, seguido pelo Norte com 24,35%.",
  },
  {
    id: 11,
    question:
      "Qual nível de educação tem a menor taxa de desocupação no Brasil?",
    options: [
      "Sem instrução ou fund. incompleto",
      "Fund. completo ou médio incompleto",
      "Ensino médio completo ou sup. incompleto",
      "Ensino superior completo",
    ],
    correctAnswer: 3,
    category: "educação",
    explanation:
      "Com ensino superior completo, a taxa de desocupação é de apenas 3,57%, a menor entre todos os níveis de escolaridade.",
  },
  {
    id: 12,
    question:
      "Qual setor da economia tem a maior proporção de trabalhadores com ensino superior completo?",
    options: [
      "Indústria",
      "Comércio e reparação",
      "Adm. pública, educação, saúde e serv. sociais",
      "Construção",
    ],
    correctAnswer: 2,
    category: "educação",
    explanation:
      "O setor de Administração pública, educação, saúde e serviços sociais tem 64,14% de trabalhadores com ensino superior completo.",
  },
  {
    id: 13,
    question:
      "Qual é o principal grupo ocupacional com mais mulheres que homens no Brasil?",
    options: [
      "Diretores e gerentes",
      "Profissionais das ciências e intelectuais",
      "Trabalhadores qualificados da agropecuária",
      "Operadores de instalações e máquinas",
    ],
    correctAnswer: 1,
    category: "emprego",
    explanation:
      "Entre Profissionais das ciências e intelectuais, há 7.636 mil mulheres contra 5.198 mil homens.",
  },
  {
    id: 14,
    question:
      "Em qual ano o rendimento médio real atingiu seu menor valor na série histórica (2012-2024)?",
    options: ["2015", "2018", "2019", "2021"],
    correctAnswer: 3,
    category: "renda",
    explanation:
      "Em 2021, o rendimento médio principal caiu para R$ 1.848,64, o menor valor da série.",
  },
  {
    id: 15,
    question:
      "Qual porcentagem dos trabalhadores brasileiros trabalha 40-44 horas por semana?",
    options: [
      "Aproximadamente 30%",
      "Aproximadamente 40%",
      "Aproximadamente 53%",
      "Aproximadamente 65%",
    ],
    correctAnswer: 2,
    category: "emprego",
    explanation:
      "52,58% dos trabalhadores brasileiros trabalham de 40 a 44 horas por semana, a jornada mais comum.",
  },
  {
    id: 16,
    question:
      "Qual região brasileira tem a maior proporção de jovens que apenas estudam?",
    options: ["Sudeste", "Norte", "Nordeste", "Sul"],
    correctAnswer: 1,
    category: "regional",
    explanation:
      "A região Norte tem 26,55% de jovens que apenas estudam, a maior proporção entre as regiões.",
  },
  {
    id: 17,
    question:
      "Qual é o rendimento médio mensal mais alto entre as capitais pesquisadas pelo IBGE?",
    options: [
      "São Paulo (SP)",
      "Rio de Janeiro (RJ)",
      "Porto Alegre (RS)",
      "Belo Horizonte (MG)",
    ],
    correctAnswer: 1,
    category: "renda",
    explanation:
      "O Rio de Janeiro tem o maior rendimento médio (R$ 2.434,90), seguido por São Paulo (R$ 2.324,10).",
  },
  {
    id: 18,
    question:
      "Qual setor econômico tem a maior proporção de trabalhadores sem instrução ou com fundamental incompleto?",
    options: [
      "Agropecuária",
      "Construção",
      "Serviços domésticos",
      "Comércio e reparação",
    ],
    correctAnswer: 0,
    category: "educação",
    explanation:
      "A Agropecuária tem 47,74% de trabalhadores sem instrução ou com fundamental incompleto.",
  },
  {
    id: 19,
    question:
      "Qual é a taxa de subutilização da força de trabalho das mulheres em comparação com os homens?",
    options: [
      "Mulheres: 12,80% | Homens: 20,38%",
      "Mulheres: 20,38% | Homens: 12,80%",
      "Mulheres: 16,22% | Homens: 16,22%",
      "Mulheres: 28,54% | Homens: 18,01%",
    ],
    correctAnswer: 1,
    category: "emprego",
    explanation:
      "A taxa de subutilização das mulheres (20,38%) é significativamente maior que a dos homens (12,80%).",
  },
  {
    id: 20,
    question:
      "Qual porcentagem dos desocupados no Brasil está há mais de 1 ano procurando emprego?",
    options: [
      "Aproximadamente 24%",
      "Aproximadamente 36%",
      "Aproximadamente 11%",
      "Aproximadamente 39%",
    ],
    correctAnswer: 0,
    category: "emprego",
    explanation:
      "35,66% dos desocupados estão há mais de 1 ano procurando emprego (11,41% de 1 a 2 anos + 24,25% há mais de 2 anos).",
  },
];

export async function GET() {
  try {
    // Shuffle questions for variety but keep consistent structure
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);

    // Return questions without correct answers for the client
    const questionsForClient = shuffled.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      category: q.category,
    }));

    return NextResponse.json({
      questions: questionsForClient,
      total: questionsForClient.length,
    });
  } catch (error) {
    console.error("Quiz questions fetch error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar perguntas do quiz" },
      { status: 500 }
    );
  }
}

// POST endpoint to verify answers
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers } = body as { answers: { questionId: number; answer: number }[] };

    let score = 0;
    const results = answers.map((answer) => {
      const question = quizQuestions.find((q) => q.id === answer.questionId);
      if (!question) return null;

      const isCorrect = answer.answer === question.correctAnswer;
      if (isCorrect) score++;

      return {
        questionId: question.id,
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    }).filter(Boolean);

    return NextResponse.json({
      score,
      total: answers.length,
      results,
    });
  } catch (error) {
    console.error("Quiz answer verification error:", error);
    return NextResponse.json(
      { error: "Erro ao verificar respostas" },
      { status: 500 }
    );
  }
}
