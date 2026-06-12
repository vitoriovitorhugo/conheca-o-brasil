"use client";

import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import {
  BarChart3,
  Trophy,
  Brain,
  Lightbulb,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  DollarSign,
  GraduationCap,
  MapPin,
  Clock,
  Target,
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Flag,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// =============================================
// TYPES
// =============================================
type Page = "auth" | "dashboard" | "quiz" | "ranking" | "curiosidades";
type AuthMode = "login" | "signup";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface IbgeData {
  t11_yearly: Record<string, YearlyIndicator>;
  t11_by_sex: Record<string, IndicatorDetail>;
  t11_by_race: Record<string, IndicatorDetail>;
  t11_by_age: Record<string, AgeIndicator>;
  t11_by_education: Record<string, EduIndicator>;
  t14_yearly_income: Record<string, YearlyIncome>;
  t14_income_by_sex: Record<string, number>;
  t14_income_by_race: Record<string, number>;
  t14_income_by_education: Record<string, number>;
  t17_atividade: Record<string, AtividadeDetail>;
  t137_tempo_desocupacao: Record<string, TempoDetail>;
  t141_horas: Record<string, HorasDetail>;
  t143_nenos: Record<string, NenosDetail>;
  t150_jovens_pobreza: Record<string, PobrezaDetail>;
  t151_grupos_ocupacao: Record<string, OcupacaoDetail>;
  city_income: string[][];
  national_income: string[][];
}

interface YearlyIndicator {
  pop_idade_trabalhar: number;
  pop_forca_trabalho: number;
  pop_ocupada: number;
  pop_ocupada_formal: number;
  pop_desocupada: number;
  taxa_participacao: number;
  nivel_ocupacao: number;
  taxa_formalizacao: number;
  taxa_desocupacao: number;
  taxa_subutilizacao: number;
}

interface IndicatorDetail {
  pop_idade_trabalhar: number;
  taxa_participacao: number;
  nivel_ocupacao: number;
  taxa_formalizacao: number;
  taxa_desocupacao: number;
  taxa_subutilizacao: number;
}

interface AgeIndicator {
  pop_idade_trabalhar: number;
  taxa_participacao: number;
  nivel_ocupacao: number;
  taxa_formalizacao: number;
  taxa_desocupacao: number;
}

interface EduIndicator {
  pop_idade_trabalhar: number;
  taxa_participacao: number;
  nivel_ocupacao: number;
  taxa_formalizacao: number;
  taxa_desocupacao: number;
}

interface YearlyIncome {
  rendimento_medio_princ: number;
  rendimento_medio_todos: number;
}

interface AtividadeDetail {
  total: number;
  sem_instrucao: number;
  fund_completo: number;
  medio_completo: number;
  superior_completo: number;
  idade_14_29: number;
  idade_30_49: number;
  idade_50_59: number;
  idade_60_mais: number;
}

interface TempoDetail {
  total_mil: number;
  ate_1_mes: number;
  "1_mes_1_ano": number;
  "1_2_anos": number;
  "2_anos_mais": number;
}

interface HorasDetail {
  total_mil: number;
  ate_39h: number;
  "40_44h": number;
  "45_48h": number;
  "49h_mais": number;
}

interface NenosDetail {
  total_mil: number;
  so_estuda_mil: number;
  estuda_ocupado_mil: number;
  so_ocupado_mil: number;
  nao_estuda_nao_ocupado_mil: number;
  so_estuda_pct: number;
  estuda_ocupado_pct: number;
  so_ocupado_pct: number;
  nao_estuda_nao_ocupado_pct: number;
}

interface PobrezaDetail {
  total_jovens: number;
  menos_215: number;
  menos_365: number;
  menos_685: number;
  ate_50_med_nac: number;
  ate_50_med_reg: number;
}

interface OcupacaoDetail {
  total: number;
  homens: number;
  mulheres: number;
  branca: number;
  preta: number;
  parda: number;
  preta_ou_parda: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
}

interface QuizResult {
  questionId: number;
  correct: boolean;
  correctAnswer: number;
  explanation: string;
}

interface RankingEntry {
  rank: number;
  userName: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
}

// =============================================
// CHART COLORS
// =============================================
const COLORS = ["#10b981", "#f59e0b", "#14b8a6", "#f97316", "#06b6d4", "#84cc16", "#ef4444", "#8b5cf6"];

const CHART_COLORS = {
  emerald: "#10b981",
  amber: "#f59e0b",
  teal: "#14b8a6",
  orange: "#f97316",
  rose: "#f43f5e",
  cyan: "#06b6d4",
  lime: "#84cc16",
  violet: "#8b5cf6",
};

// =============================================
// MAIN APP COMPONENT
// =============================================
export default function ConhecaBrasil() {
  const [page, setPage] = useState<Page>("auth");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<UserData | null>(null);
  const [ibgeData, setIbgeData] = useState<IbgeData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const doCheck = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data?.user?.id) {
          setUser({ id: data.user.id, name: data.user.name || data.user.email, email: data.user.email });
          setPage("dashboard");
        }
      } catch {
        // Not logged in
      }
      setLoading(false);
    };
    doCheck();
  }, []);

  // Fetch IBGE data when user logs in
  useEffect(() => {
    if (user && !ibgeData) {
      const doFetch = async () => {
        try {
          const res = await fetch("/api/ibge");
          const data = await res.json();
          setIbgeData(data);
        } catch (e) {
          console.error("Failed to fetch IBGE data:", e);
          toast.error("Erro ao carregar dados do IBGE");
        }
      };
      doFetch();
    }
  }, [user, ibgeData]);

  // Seed database on first load
  useEffect(() => {
    if (user) {
      fetch("/api/seed").catch(() => {});
    }
  }, [user]);

  const performLogin = async (email: string, password: string) => {
    // Step 1: Validate credentials via our custom API (bypasses CSRF issues)
    const loginRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok || !loginData.success) {
      return { success: false, error: loginData.error || "Email ou senha inválidos" };
    }

    // Step 2: Establish NextAuth session
    try {
      await signIn("credentials", { redirect: false, email, password });
    } catch {
      // signIn might fail in cross-origin preview environments,
      // but credentials are already validated — try session directly
    }

    // Step 3: Verify session exists, or use the validated user data
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.id) {
        setUser({ id: session.user.id, name: session.user.name || session.user.email, email: session.user.email });
        setPage("dashboard");
        toast.success("Bem-vindo(a) ao Conheça o Brasil!");
        return { success: true, error: null };
      }
    } catch {
      // Session fetch failed
    }

    // Fallback: use the validated user data from our custom API
    if (loginData.user?.id) {
      setUser({ id: loginData.user.id, name: loginData.user.name || loginData.user.email, email: loginData.user.email });
      setPage("dashboard");
      toast.success("Bem-vindo(a) ao Conheça o Brasil!");
      return { success: true, error: null };
    }

    return { success: false, error: "Erro ao criar sessão. Tente novamente." };
  };

  const handleAuth = async (email: string, password: string, name?: string) => {
    try {
      if (authMode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Erro ao criar conta");
          return;
        }
        // Auto-login after successful signup
        toast.success("Conta criada com sucesso!");
        const result = await performLogin(email, password);
        if (!result.success) {
          toast.error(result.error || "Conta criada, mas erro ao entrar. Tente fazer login manualmente.");
          setAuthMode("login");
        }
        return;
      }

      const result = await performLogin(email, password);
      if (!result.success) {
        toast.error(result.error || "Email ou senha inválidos");
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    setPage("auth");
    setIbgeData(null);
    toast.info("Você saiu da aplicação");
  };

  const navItems = [
    { id: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
    { id: "curiosidades" as Page, label: "Curiosidades", icon: Lightbulb },
    { id: "quiz" as Page, label: "Quiz", icon: Brain },
    { id: "ranking" as Page, label: "Ranking", icon: Trophy },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (page === "auth" || !user) {
    return <AuthPage mode={authMode} setMode={setAuthMode} onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🇧🇷</span>
              <h1 className="font-bold text-lg tracking-tight hidden sm:block">CONHEÇA O BRASIL</h1>
              <h1 className="font-bold text-lg tracking-tight sm:hidden">BRASIL</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:flex gap-1">
              <Star className="w-3 h-3" /> {user.name}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex w-56 border-r border-border flex-col p-3 gap-1 bg-card/50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                page === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed left-0 top-14 bottom-0 w-56 bg-card border-r border-border p-3 flex flex-col gap-1 z-50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    page === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {page === "dashboard" && ibgeData && <Dashboard data={ibgeData} />}
            {page === "curiosidades" && ibgeData && <Curiosidades data={ibgeData} />}
            {page === "quiz" && <Quiz user={user} onComplete={() => setPage("ranking")} />}
            {page === "ranking" && <RankingPage />}
            {!ibgeData && page === "dashboard" && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card/50 py-3 px-4 text-center text-xs text-muted-foreground">
        <p>CONHEÇA O BRASIL — Dados extraídos do IBGE (PNAD Contínua 2012-2024)</p>
      </footer>
    </div>
  );
}

// =============================================
// AUTH PAGE
// =============================================
function AuthPage({ mode, setMode, onAuth }: { mode: AuthMode; setMode: (m: AuthMode) => void; onAuth: (e: string, p: string, n?: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onAuth(email, password, mode === "signup" ? name : undefined);
    setSubmitting(false);
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setMode("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🇧🇷</div>
          <h1 className="text-3xl font-bold tracking-tight">CONHEÇA O BRASIL</h1>
          <p className="text-muted-foreground mt-2">Dashboard interativo com dados do IBGE</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Criar Conta
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {mode === "login" ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            {mode === "login" && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center mb-3">Contas de demonstração (clique para preencher):</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fillDemo("maria@brasil.com", "brasil123")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors text-left"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Maria Silva</p>
                      <p className="text-xs text-muted-foreground">maria@brasil.com</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo("joao@brasil.com", "brasil123")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors text-left"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">João Santos</p>
                      <p className="text-xs text-muted-foreground">joao@brasil.com</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo("ana@brasil.com", "brasil123")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors text-left"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">AO</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Ana Oliveira</p>
                      <p className="text-xs text-muted-foreground">ana@brasil.com</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Fonte: IBGE — Pesquisa Nacional por Amostra de Domicílios Contínua
        </p>
      </div>
    </div>
  );
}

// =============================================
// DASHBOARD
// =============================================
function Dashboard({ data }: { data: IbgeData }) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard title="Taxa de Desocupação" value="6,63%" change="-1.12" icon={<Briefcase className="w-4 h-4" />} color="emerald" />
        <KPICard title="População Ocupada" value="101,3M" change="+2,6M" icon={<Users className="w-4 h-4" />} color="teal" />
        <KPICard title="Rendimento Médio" value="R$ 3.108" change="+5,3%" icon={<DollarSign className="w-4 h-4" />} color="amber" />
        <KPICard title="Taxa de Formalização" value="59,4%" change="+0,15" icon={<GraduationCap className="w-4 h-4" />} color="orange" />
      </div>

      <Tabs defaultValue="mercado" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="mercado" className="text-xs sm:text-sm">Mercado de Trabalho</TabsTrigger>
          <TabsTrigger value="renda" className="text-xs sm:text-sm">Rendimento</TabsTrigger>
          <TabsTrigger value="educacao" className="text-xs sm:text-sm">Educação</TabsTrigger>
          <TabsTrigger value="jovens" className="text-xs sm:text-sm">Jovens</TabsTrigger>
          <TabsTrigger value="ocupacao" className="text-xs sm:text-sm">Ocupação</TabsTrigger>
          <TabsTrigger value="regioes" className="text-xs sm:text-sm">Regiões</TabsTrigger>
        </TabsList>

        <TabsContent value="mercado" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Taxa de Desocupação (2012-2024)" subtitle="Evolução anual em %">
              <DesocupacaoLineChart data={data} />
            </ChartCard>
            <ChartCard title="Indicadores por Sexo (2024)" subtitle="Comparação homens vs mulheres">
              <SexoRadarChart data={data} />
            </ChartCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="População na Força de Trabalho" subtitle="Evolução em milhões (2012-2024)">
              <ForcaTrabalhoAreaChart data={data} />
            </ChartCard>
            <ChartCard title="Indicadores por Cor/Raça (2024)" subtitle="Taxas em %">
              <RacaBarChart data={data} />
            </ChartCard>
          </div>
          <ChartCard title="Indicadores por Faixa Etária (2024)" subtitle="Taxas em %">
            <IdadeBarChart data={data} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="renda" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rendimento Médio Mensal (2012-2024)" subtitle="Em R$ do trabalho principal">
              <RendimentoLineChart data={data} />
            </ChartCard>
            <ChartCard title="Rendimento por Sexo (2024)" subtitle="R$ mensais">
              <RendimentoSexoChart data={data} />
            </ChartCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rendimento por Cor/Raça (2024)" subtitle="R$ mensais">
              <RendimentoRacaChart data={data} />
            </ChartCard>
            <ChartCard title="Rendimento por Escolaridade (2024)" subtitle="R$ mensais">
              <RendimentoEducacaoChart data={data} />
            </ChartCard>
          </div>
          <ChartCard title="Rendimento Médio por Capital" subtitle="PME - Pesquisa Mensal de Emprego">
            <RendimentoCapitalChart data={data} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="educacao" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Indicadores por Escolaridade (2024)" subtitle="Taxas em %">
              <EducacaoBarChart data={data} />
            </ChartCard>
            <ChartCard title="Nível de Instrução por Setor" subtitle="Distribuição % por atividade econômica">
              <InstrucaoSetorChart data={data} />
            </ChartCard>
          </div>
          <ChartCard title="Distribuição de Idade por Setor" subtitle="Proporção % de trabalhadores por faixa etária">
            <IdadeSetorChart data={data} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="jovens" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Situação dos Jovens (Nem-Nem)" subtitle="15 a 29 anos — Ocupação e estudo (%)">
              <NemosChart data={data} />
            </ChartCard>
            <ChartCard title="Jovens por Classes de Renda" subtitle="Pobreza por região (%)">
              <PobrezaJovensChart data={data} />
            </ChartCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Horas Trabalhadas pelos Jovens" subtitle="Distribuição % por jornada">
              <HorasJovensChart data={data} />
            </ChartCard>
            <ChartCard title="Tempo de Desocupação" subtitle="Distribuição % por duração">
              <TempoDesocupacaoChart data={data} />
            </ChartCard>
          </div>
          <ChartCard title="Nem-Nem por Região e Sexo" subtitle="Comparação detalhada">
            <NenosRegiaoChart data={data} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="ocupacao" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Grupos Ocupacionais por Sexo" subtitle="Em mil pessoas">
              <OcupacaoSexoChart data={data} />
            </ChartCard>
            <ChartCard title="Grupos Ocupacionais por Cor/Raça" subtitle="Distribuição %">
              <OcupacaoRacaChart data={data} />
            </ChartCard>
          </div>
          <ChartCard title="Distribuição Ocupacional" subtitle="Proporção de cada grupo (%)">
            <OcupacaoPieChart data={data} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="regioes" className="space-y-4">
          <ChartCard title="Comparação Regional dos Jovens" subtitle="Indicadores por região brasileira">
            <RegiaoComparacaoChart data={data} />
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =============================================
// KPI CARD
// =============================================
function KPICard({ title, value, change, icon, color }: { title: string; value: string; change: string; icon: React.ReactNode; color: string }) {
  const isPositive = change.startsWith("+") || change.startsWith("-");
  const isGood = change.startsWith("+") || (title.includes("Desocupação") && change.startsWith("-"));
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    orange: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  };
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.emerald}`}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isGood ? "text-emerald-600" : "text-rose-600"}`}>
          {isGood ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change} vs ano anterior
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================
// CHART CARD
// =============================================
function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

// =============================================
// CHART COMPONENTS
// =============================================

// 1. Desocupação Line Chart (2012-2024)
function DesocupacaoLineChart({ data }: { data: IbgeData }) {
  const chartData = Object.entries(data.t11_yearly).map(([year, val]) => ({
    year,
    desocupacao: val.taxa_desocupacao,
    subutilizacao: val.taxa_subutilizacao,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="desocupacao" name="Desocupação" stroke={CHART_COLORS.rose} strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="subutilizacao" name="Subutilização" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// 2. Sexo Radar Chart
function SexoRadarChart({ data }: { data: IbgeData }) {
  const homens = data.t11_by_sex["Homens"];
  const mulheres = data.t11_by_sex["Mulheres"];
  const chartData = [
    { metric: "Participação", homens: homens.taxa_participacao, mulheres: mulheres.taxa_participacao },
    { metric: "Ocupação", homens: homens.nivel_ocupacao, mulheres: mulheres.nivel_ocupacao },
    { metric: "Formalização", homens: homens.taxa_formalizacao, mulheres: mulheres.taxa_formalizacao },
    { metric: "Subutilização", homens: homens.taxa_subutilizacao, mulheres: mulheres.taxa_subutilizacao },
    { metric: "Desocupação", homens: homens.taxa_desocupacao, mulheres: mulheres.taxa_desocupacao },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" />
        <Radar name="Homens" dataKey="homens" stroke={CHART_COLORS.teal} fill={CHART_COLORS.teal} fillOpacity={0.2} />
        <Radar name="Mulheres" dataKey="mulheres" stroke={CHART_COLORS.rose} fill={CHART_COLORS.rose} fillOpacity={0.2} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// 3. Força de Trabalho Area Chart
function ForcaTrabalhoAreaChart({ data }: { data: IbgeData }) {
  const chartData = Object.entries(data.t11_yearly).map(([year, val]) => ({
    year,
    forca: Math.round(val.pop_forca_trabalho / 1000),
    ocupada: Math.round(val.pop_ocupada / 1000),
    formal: Math.round(val.pop_ocupada_formal / 1000),
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="M" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="forca" name="Força de trabalho" stroke={CHART_COLORS.emerald} fill={CHART_COLORS.emerald} fillOpacity={0.15} strokeWidth={2} />
        <Area type="monotone" dataKey="ocupada" name="Pop. ocupada" stroke={CHART_COLORS.teal} fill={CHART_COLORS.teal} fillOpacity={0.15} strokeWidth={2} />
        <Area type="monotone" dataKey="formal" name="Trabalho formal" stroke={CHART_COLORS.amber} fill={CHART_COLORS.amber} fillOpacity={0.15} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// 4. Raça Bar Chart
function RacaBarChart({ data }: { data: IbgeData }) {
  const chartData = Object.entries(data.t11_by_race).map(([race, val]) => ({
    race,
    Participação: val.taxa_participacao,
    Ocupação: val.nivel_ocupacao,
    Formalização: val.taxa_formalizacao,
    Desocupação: val.taxa_desocupacao,
    Subutilização: val.taxa_subutilizacao,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="race" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Participação" fill={CHART_COLORS.emerald} radius={[2, 2, 0, 0]} />
        <Bar dataKey="Formalização" fill={CHART_COLORS.amber} radius={[2, 2, 0, 0]} />
        <Bar dataKey="Desocupação" fill={CHART_COLORS.rose} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 5. Idade Bar Chart
function IdadeBarChart({ data }: { data: IbgeData }) {
  const chartData = Object.entries(data.t11_by_age).map(([age, val]) => ({
    age,
    Participação: val.taxa_participacao,
    Ocupação: val.nivel_ocupacao,
    Formalização: val.taxa_formalizacao,
    Desocupação: val.taxa_desocupacao,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <YAxis dataKey="age" type="category" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" width={90} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Participação" fill={CHART_COLORS.emerald} radius={[0, 2, 2, 0]} />
        <Bar dataKey="Formalização" fill={CHART_COLORS.amber} radius={[0, 2, 2, 0]} />
        <Bar dataKey="Desocupação" fill={CHART_COLORS.rose} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 6. Rendimento Line Chart
function RendimentoLineChart({ data }: { data: IbgeData }) {
  const chartData = Object.entries(data.t14_yearly_income).map(([year, val]) => ({
    year,
    principal: val.rendimento_medio_princ,
    todos: val.rendimento_medio_todos,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" prefix="R$ " />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="principal" name="Trabalho principal" stroke={CHART_COLORS.emerald} strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="todos" name="Todos trabalhos" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// 7. Rendimento por Sexo
function RendimentoSexoChart({ data }: { data: IbgeData }) {
  const chartData = Object.entries(data.t14_income_by_sex)
    .filter(([key]) => key !== "Total")
    .map(([sex, val]) => ({ sex, rendimento: val }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="sex" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
        <Bar dataKey="rendimento" name="Rendimento médio (R$)" radius={[8, 8, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={i === 0 ? CHART_COLORS.teal : CHART_COLORS.rose} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// 8. Rendimento por Raça
function RendimentoRacaChart({ data }: { data: IbgeData }) {
  const chartData = Object.entries(data.t14_income_by_race).map(([race, val]) => ({ race, rendimento: val }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="race" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
        <Bar dataKey="rendimento" name="Rendimento médio (R$)" radius={[8, 8, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// 9. Rendimento por Escolaridade
function RendimentoEducacaoChart({ data }: { data: IbgeData }) {
  const labels: Record<string, string> = {
    "Sem instrução ou fund. incompleto": "Sem inst./Fund. inc.",
    "Fund. completo ou médio incompleto": "Fund. comp./Médio inc.",
    "Ensino médio completo ou sup. incompleto": "Médio comp./Sup. inc.",
    "Ensino superior completo": "Sup. completo",
  };
  const chartData = Object.entries(data.t14_income_by_education).map(([edu, val]) => ({
    edu: labels[edu] || edu,
    rendimento: val,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="edu" tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" interval={0} angle={-15} />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
        <Bar dataKey="rendimento" name="Rendimento médio (R$)" radius={[8, 8, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// 10. Rendimento por Capital
function RendimentoCapitalChart({ data }: { data: IbgeData }) {
  const cityRow = data.city_income?.[1] || [];
  const valueRow = data.city_income?.[2] || [];
  if (cityRow.length < 2) return <p className="text-sm text-muted-foreground p-4">Dados não disponíveis</p>;
  const chartData = cityRow.slice(1, -1).map((city, i) => ({
    city: city.replace(/\s*\(.*\)/, ""),
    rendimento: parseFloat((valueRow[i + 1] || "0").replace(/\./g, "").replace(",", ".")),
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="city" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
        <Bar dataKey="rendimento" name="Rendimento médio (R$)" radius={[8, 8, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// 11. Educação Bar Chart
function EducacaoBarChart({ data }: { data: IbgeData }) {
  const labels: Record<string, string> = {
    "Sem instrução ou fund. incompleto": "Sem inst./Fund. inc.",
    "Fund. completo ou médio incompleto": "Fund. comp./Médio inc.",
    "Ensino médio completo ou sup. incompleto": "Médio comp./Sup. inc.",
    "Ensino superior completo": "Sup. completo",
  };
  const chartData = Object.entries(data.t11_by_education).map(([edu, val]) => ({
    edu: labels[edu] || edu,
    Participação: val.taxa_participacao,
    Ocupação: val.nivel_ocupacao,
    Formalização: val.taxa_formalizacao,
    Desocupação: val.taxa_desocupacao,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="edu" tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" angle={-15} interval={0} />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Participação" fill={CHART_COLORS.emerald} radius={[2, 2, 0, 0]} />
        <Bar dataKey="Formalização" fill={CHART_COLORS.amber} radius={[2, 2, 0, 0]} />
        <Bar dataKey="Desocupação" fill={CHART_COLORS.rose} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 12. Instrução por Setor (Stacked Bar)
function InstrucaoSetorChart({ data }: { data: IbgeData }) {
  const skipLabels = ["Total", "Grupos Ocupacionais no Trabalho Principal (1)"];
  const entries = Object.entries(data.t17_atividade).filter(([k]) => !skipLabels.includes(k));
  const chartData = entries.map(([setor, val]) => ({
    setor: setor.length > 20 ? setor.substring(0, 18) + "…" : setor,
    "Sem instrução": val.sem_instrucao,
    "Fund. completo": val.fund_completo,
    "Médio completo": val.medio_completo,
    "Superior completo": val.superior_completo,
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" unit="%" />
        <YAxis dataKey="setor" type="category" tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" width={120} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Sem instrução" stackId="a" fill={CHART_COLORS.rose} />
        <Bar dataKey="Fund. completo" stackId="a" fill={CHART_COLORS.amber} />
        <Bar dataKey="Médio completo" stackId="a" fill={CHART_COLORS.teal} />
        <Bar dataKey="Superior completo" stackId="a" fill={CHART_COLORS.emerald} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 13. Idade por Setor (Stacked Bar)
function IdadeSetorChart({ data }: { data: IbgeData }) {
  const skipLabels = ["Total", "Grupos Ocupacionais no Trabalho Principal (1)"];
  const entries = Object.entries(data.t17_atividade).filter(([k]) => !skipLabels.includes(k));
  const chartData = entries.map(([setor, val]) => ({
    setor: setor.length > 20 ? setor.substring(0, 18) + "…" : setor,
    "14-29 anos": val.idade_14_29,
    "30-49 anos": val.idade_30_49,
    "50-59 anos": val.idade_50_59,
    "60+ anos": val.idade_60_mais,
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" unit="%" />
        <YAxis dataKey="setor" type="category" tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" width={120} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="14-29 anos" stackId="a" fill={CHART_COLORS.cyan} />
        <Bar dataKey="30-49 anos" stackId="a" fill={CHART_COLORS.emerald} />
        <Bar dataKey="50-59 anos" stackId="a" fill={CHART_COLORS.amber} />
        <Bar dataKey="60+ anos" stackId="a" fill={CHART_COLORS.orange} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 14. NEM-NEM Chart
function NemosChart({ data }: { data: IbgeData }) {
  const regions = ["Brasil", "Norte", "Nordeste", "Sudeste", "Sul", "Centro-Oeste"];
  const chartData = regions
    .filter((r) => data.t143_nenos[r])
    .map((r) => ({
      region: r,
      "Só estuda": data.t143_nenos[r].so_estuda_pct,
      "Estuda e trabalha": data.t143_nenos[r].estuda_ocupado_pct,
      "Só trabalha": data.t143_nenos[r].so_ocupado_pct,
      "Nem-nem": data.t143_nenos[r].nao_estuda_nao_ocupado_pct,
    }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="region" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Só estuda" stackId="a" fill={CHART_COLORS.cyan} radius={[0, 0, 0, 0]} />
        <Bar dataKey="Estuda e trabalha" stackId="a" fill={CHART_COLORS.emerald} />
        <Bar dataKey="Só trabalha" stackId="a" fill={CHART_COLORS.amber} />
        <Bar dataKey="Nem-nem" stackId="a" fill={CHART_COLORS.rose} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 15. Pobreza Jovens Chart
function PobrezaJovensChart({ data }: { data: IbgeData }) {
  const regions = ["Brasil", "Norte", "Nordeste", "Sudeste", "Sul", "Centro-Oeste"];
  const chartData = regions
    .filter((r) => data.t150_jovens_pobreza[r])
    .map((r) => ({
      region: r,
      "Extrema (<US$2,15)": data.t150_jovens_pobreza[r].menos_215,
      "Moderada (<US$3,65)": data.t150_jovens_pobreza[r].menos_365,
      "Vulnerável (<US$6,85)": data.t150_jovens_pobreza[r].menos_685,
    }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="region" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Bar dataKey="Extrema (<US$2,15)" fill={CHART_COLORS.rose} radius={[2, 2, 0, 0]} />
        <Bar dataKey="Moderada (<US$3,65)" fill={CHART_COLORS.orange} radius={[2, 2, 0, 0]} />
        <Bar dataKey="Vulnerável (<US$6,85)" fill={CHART_COLORS.amber} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 16. Horas Jovens Chart
function HorasJovensChart({ data }: { data: IbgeData }) {
  const entries = Object.entries(data.t141_horas).filter(([k]) => ["Brasil", "Homem", "Mulher", "Branca", "Preta", "Parda"].includes(k));
  const chartData = entries.map(([label, val]) => ({
    label,
    "Até 39h": val.ate_39h,
    "40-44h": val["40_44h"],
    "45-48h": val["45_48h"],
    "49h+": val["49h_mais"],
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Até 39h" fill={CHART_COLORS.cyan} radius={[2, 2, 0, 0]} />
        <Bar dataKey="40-44h" fill={CHART_COLORS.emerald} radius={[2, 2, 0, 0]} />
        <Bar dataKey="45-48h" fill={CHART_COLORS.amber} radius={[2, 2, 0, 0]} />
        <Bar dataKey="49h+" fill={CHART_COLORS.rose} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 17. Tempo Desocupação
function TempoDesocupacaoChart({ data }: { data: IbgeData }) {
  const entries = Object.entries(data.t137_tempo_desocupacao).filter(([k]) => ["Brasil", "Homens", "Mulheres", "Branca", "Preta ou parda"].includes(k));
  const chartData = entries.map(([label, val]) => ({
    label,
    "Até 1 mês": val.ate_1_mes,
    "1 mês a 1 ano": val["1_mes_1_ano"],
    "1 a 2 anos": val["1_2_anos"],
    "2+ anos": val["2_anos_mais"],
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Até 1 mês" fill={CHART_COLORS.emerald} radius={[2, 2, 0, 0]} />
        <Bar dataKey="1 mês a 1 ano" fill={CHART_COLORS.amber} radius={[2, 2, 0, 0]} />
        <Bar dataKey="1 a 2 anos" fill={CHART_COLORS.orange} radius={[2, 2, 0, 0]} />
        <Bar dataKey="2+ anos" fill={CHART_COLORS.rose} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 18. Nem-Nem por Região detalhado
function NenosRegiaoChart({ data }: { data: IbgeData }) {
  const entries = Object.entries(data.t143_nenos).filter(([k]) => !["Brasil"].includes(k) && data.t143_nenos[k]?.nao_estuda_nao_ocupado_pct);
  const chartData = entries.map(([label, val]) => ({
    label,
    "Nem-nem": val.nao_estuda_nao_ocupado_pct,
    "Só estuda": val.so_estuda_pct,
    "Estuda e trabalha": val.estuda_ocupado_pct,
    "Só trabalha": val.so_ocupado_pct,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Só estuda" fill={CHART_COLORS.cyan} />
        <Bar dataKey="Estuda e trabalha" fill={CHART_COLORS.emerald} />
        <Bar dataKey="Só trabalha" fill={CHART_COLORS.amber} />
        <Bar dataKey="Nem-nem" fill={CHART_COLORS.rose} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 19. Ocupação por Sexo
function OcupacaoSexoChart({ data }: { data: IbgeData }) {
  const skipLabels = ["Brasil", "Grupos Ocupacionais no Trabalho Principal (1)"];
  const entries = Object.entries(data.t151_grupos_ocupacao).filter(([k]) => !skipLabels.includes(k));
  const chartData = entries.map(([ocup, val]) => ({
    ocup:ocup.length > 25 ? ocup.substring(0, 23) + "…" : ocup,
    Homens: Math.round(val.homens / 1000),
    Mulheres: Math.round(val.mulheres / 1000),
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" unit="M" />
        <YAxis dataKey="ocup" type="category" tick={{ fontSize: 8 }} stroke="var(--muted-foreground)" width={130} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Homens" fill={CHART_COLORS.teal} radius={[0, 2, 2, 0]} />
        <Bar dataKey="Mulheres" fill={CHART_COLORS.rose} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 20. Ocupação por Raça
function OcupacaoRacaChart({ data }: { data: IbgeData }) {
  const skipLabels = ["Brasil", "Grupos Ocupacionais no Trabalho Principal (1)"];
  const entries = Object.entries(data.t151_grupos_ocupacao).filter(([k]) => !skipLabels.includes(k));
  const chartData = entries.map(([ocup, val]) => {
    const total = val.total || 1;
    return {
      ocup: ocup.length > 25 ? ocup.substring(0, 23) + "…" : ocup,
      Branca: Math.round((val.branca / total) * 100),
      Preta: Math.round(((val.preta || 0) / total) * 100),
      Parda: Math.round(((val.parda || val.pretao || 0) / total) * 100),
    };
  });
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" unit="%" />
        <YAxis dataKey="ocup" type="category" tick={{ fontSize: 8 }} stroke="var(--muted-foreground)" width={130} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Branca" stackId="a" fill={CHART_COLORS.emerald} />
        <Bar dataKey="Preta" stackId="a" fill={CHART_COLORS.amber} />
        <Bar dataKey="Parda" stackId="a" fill={CHART_COLORS.orange} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 21. Ocupação Pie Chart
function OcupacaoPieChart({ data }: { data: IbgeData }) {
  const skipLabels = ["Brasil", "Grupos Ocupacionais no Trabalho Principal (1)"];
  const entries = Object.entries(data.t151_grupos_ocupacao).filter(([k]) => !skipLabels.includes(k));
  const chartData = entries.map(([ocup, val]) => ({
    name:ocup.length > 30 ?ocup.substring(0, 28) + "…" :ocup,
    value: Math.round(val.total / 1000),
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }} style={{ fontSize: 10 }}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 22. Região Comparação
function RegiaoComparacaoChart({ data }: { data: IbgeData }) {
  const regions = ["Norte", "Nordeste", "Sudeste", "Sul", "Centro-Oeste"];
  const chartData = regions
    .filter((r) => data.t150_jovens_pobreza[r] && data.t143_nenos[r])
    .map((r) => ({
      region: r,
      "Pobreza extrema": data.t150_jovens_pobreza[r].menos_215,
      "Nem-nem": data.t143_nenos[r].nao_estuda_nao_ocupado_pct,
      "Só estuda": data.t143_nenos[r].so_estuda_pct,
      "Estuda e trabalha": data.t143_nenos[r].estuda_ocupado_pct,
    }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="region" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
        <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" />
        <Radar name="Pobreza extrema" dataKey="Pobreza extrema" stroke={CHART_COLORS.rose} fill={CHART_COLORS.rose} fillOpacity={0.15} />
        <Radar name="Nem-nem" dataKey="Nem-nem" stroke={CHART_COLORS.orange} fill={CHART_COLORS.orange} fillOpacity={0.15} />
        <Radar name="Estuda e trabalha" dataKey="Estuda e trabalha" stroke={CHART_COLORS.emerald} fill={CHART_COLORS.emerald} fillOpacity={0.15} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// =============================================
// CURIOSIDADES
// =============================================
function Curiosidades({ data }: { data: IbgeData }) {
  const insights = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      title: "Menor desemprego da série histórica",
      text: `Em 2024, a taxa de desocupação brasileira atingiu 6,63%, a menor desde o início da série em 2012. Em 2021, no pico da pandemia, chegou a 14,01%.`,
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      title: "Gap salarial de gênero persiste",
      text: `Homens ganham em média R$ 2.244 contra R$ 1.963 das mulheres — uma diferença de R$ 281 por mês. A taxa de participação feminina (53,5%) é quase 20 pontos menor que a masculina (72,8%).`,
    },
    {
      icon: <Users className="w-5 h-5" />,
      color: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
      title: "Desigualdade racial no mercado",
      text: `A taxa de desocupação entre pretos e pardos (7,63%) é maior que entre brancos (5,33%). O rendimento médio de brancos (R$ 2.514) supera o de pardos (R$ 1.832) em 37%.`,
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      color: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
      title: "Educação muda tudo",
      text: `Com ensino superior completo, a taxa de desocupação cai para apenas 3,57%, contra 9,29% para quem tem apenas fundamental. O rendimento de quem tem diploma é 5x maior que sem instrução.`,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      color: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
      title: "Nordeste: epicentro da pobreza juvenil",
      text: `22,4% dos jovens nordestinos vivem em pobreza extrema (menos de US$ 2,15/dia), contra apenas 4,4% no Sul. O Nordeste também tem a maior taxa de jovens nem-nem (27,5%).`,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
      title: "Desemprego de longa duração",
      text: `24,2% dos desocupados estão há mais de 2 anos procurando emprego. Entre as mulheres, esse percentual sobe para 28,1%, mostrando maior dificuldade de reinserção.`,
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      title: "Pandemia devastadora",
      text: `Em 2020, a taxa de subutilização saltou para 28,3% e 13,6 milhões ficaram desocupados. A força de trabalho encolheu de 106M para 99M em um único ano — o maior recuo da série.`,
    },
    {
      icon: <Target className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      title: "Formalização estagnada",
      text: `Apesar da recuperação do emprego, a taxa de formalização permanece em 59,4%, praticamente a mesma de 2012 (58,9%). Mais de 40 milhões de brasileiros trabalham sem carteira ou proteção social.`,
    },
    {
      icon: <Users className="w-5 h-5" />,
      color: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
      title: "Jovens: o grupo mais vulnerável",
      text: `Jovens de 18 a 24 anos têm taxa de desocupação de 13,4% — o dobro da média nacional. Na faixa de 14 a 17 anos, chega a 26,5%. O subemprego afeta 53,5% dos adolescentes de 14-17 anos.`,
    },
    {
      icon: <Flag className="w-5 h-5" />,
      color: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
      title: "Rio lidera rendimento entre capitais",
      text: `O Rio de Janeiro tem o maior rendimento médio (R$ 2.435) entre as capitais pesquisadas, superando São Paulo (R$ 2.324). Recife (R$ 1.648) e Salvador (R$ 1.654) ficam abaixo da média.`,
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      title: "Mulheres nem-nem: o dobro dos homens",
      text: `26,2% das mulheres jovens de 15-29 anos não estudam nem trabalham, contra 13,5% dos homens. A principal causa é o trabalho doméstico e cuidados não remunerados.`,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      title: "Recuperação pós-pandemia surpreende",
      text: `Em apenas 3 anos (2021→2024), o Brasil reduziu a desocupação de 14% para 6,6% e criou mais de 13 milhões de postos de trabalho — a recuperação mais rápida da série.`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold tracking-tight">Curiosidades sobre o Brasil</h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Insights extraídos automaticamente dos dados do IBGE — PNAD Contínua (2012-2024)
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${insight.color}`}>
                  {insight.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =============================================
// QUIZ
// =============================================
function Quiz({ user, onComplete }: { user: UserData; onComplete: () => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{ score: number; total: number; results: QuizResult[] } | null>(null);

  useEffect(() => {
    const doFetch = async () => {
      try {
        const res = await fetch("/api/quiz");
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch {
        toast.error("Erro ao carregar quiz");
      }
      setLoading(false);
    };
    doFetch();
  }, []);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answerList = Object.entries(answers).map(([qId, ans]) => ({
        questionId: parseInt(qId),
        answer: ans,
      }));
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answerList }),
      });
      const data = await res.json();
      setResults(data);

      // Save score
      await fetch("/api/quiz/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: data.score, total: data.total, category: "geral", userId: user.id }),
      });
      toast.success(`Você acertou ${data.score} de ${data.total}!`);
    } catch {
      toast.error("Erro ao enviar respostas");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (results) {
    return (
      <QuizResults results={results} questions={questions} answers={answers} onRetry={() => { setResults(null); setAnswers({}); setCurrent(0); }} onRanking={onComplete} />
    );
  }

  const q = questions[current];
  if (!q) return <p className="text-center text-muted-foreground">Nenhuma pergunta disponível</p>;

  const progress = ((current + 1) / questions.length) * 100;
  const categoryIcons: Record<string, React.ReactNode> = {
    emprego: <Briefcase className="w-4 h-4" />,
    renda: <DollarSign className="w-4 h-4" />,
    educação: <GraduationCap className="w-4 h-4" />,
    regional: <MapPin className="w-4 h-4" />,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Quiz: Conheça o Brasil</h2>
        </div>
        <p className="text-muted-foreground text-sm">Teste seus conhecimentos sobre os dados do IBGE</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Pergunta {current + 1} de {questions.length}</span>
          <span>{Object.keys(answers).length} respondidas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs">
              {categoryIcons[q.category] || <Star className="w-3 h-3" />} {q.category}
            </Badge>
          </div>
          <CardTitle className="text-base leading-relaxed mt-2">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(q.id, i)}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                answers[q.id] === i
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border hover:border-primary/30 hover:bg-accent/50"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center border ${answers[q.id] === i ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>
        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent(current + 1)}>
            Próxima <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting || Object.keys(answers).length < questions.length}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Award className="w-4 h-4 mr-1" />}
            Finalizar Quiz
          </Button>
        )}
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-1 justify-center">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-7 h-7 rounded text-xs font-medium transition-all ${
              i === current
                ? "bg-primary text-primary-foreground"
                : answers[questions[i].id] !== undefined
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================
// QUIZ RESULTS
// =============================================
function QuizResults({ results, questions, answers, onRetry, onRanking }: { results: { score: number; total: number; results: QuizResult[] }; questions: QuizQuestion[]; answers: Record<number, number>; onRetry: () => void; onRanking: () => void }) {
  const pct = Math.round((results.score / results.total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : pct >= 40 ? "🤔" : "📚";
  const message = pct >= 80 ? "Excelente! Você realmente conhece o Brasil!" : pct >= 60 ? "Muito bom! Continue aprendendo!" : pct >= 40 ? "Bom começo! Explore mais os dados." : "Continue estudando os dados do IBGE!";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-lg text-center">
        <CardContent className="p-8">
          <div className="text-5xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold mb-2">Resultado do Quiz</h2>
          <p className="text-muted-foreground mb-4">{message}</p>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div>
              <div className="text-4xl font-bold text-primary">{results.score}</div>
              <div className="text-xs text-muted-foreground">Acertos</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <div className="text-4xl font-bold">{results.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <div className="text-4xl font-bold text-amber-500">{pct}%</div>
              <div className="text-xs text-muted-foreground">Aproveitamento</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={onRetry} variant="outline"><Target className="w-4 h-4 mr-1" /> Tentar novamente</Button>
            <Button onClick={onRanking}><Trophy className="w-4 h-4 mr-1" /> Ver Ranking</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Detalhes das respostas</h3>
        <ScrollArea className="max-h-96">
          <div className="space-y-2">
            {results.results.map((r, i) => {
              const q = questions.find((q) => q.id === r.questionId);
              if (!q) return null;
              return (
                <Card key={i} className={r.correct ? "border-emerald-200 dark:border-emerald-800" : "border-rose-200 dark:border-rose-800"}>
                  <CardContent className="p-3">
                    <div className="flex gap-2">
                      {r.correct ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{q.question}</p>
                        {!r.correct && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Sua resposta: {q.options[answers[r.questionId] ?? -1]} | Correta: {q.options[r.correctAnswer]}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 italic">{r.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// =============================================
// RANKING PAGE
// =============================================
function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doFetch = async () => {
      try {
        const res = await fetch("/api/quiz/score?category=geral&limit=20");
        const data = await res.json();
        setRanking(data.ranking || []);
      } catch {
        toast.error("Erro ao carregar ranking");
      }
      setLoading(false);
    };
    doFetch();
  }, []);

  const refreshRanking = async () => {
    try {
      const res = await fetch("/api/quiz/score?category=geral&limit=20");
      const data = await res.json();
      setRanking(data.ranking || []);
    } catch {
      toast.error("Erro ao carregar ranking");
    }
  };

  const getMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold tracking-tight">Ranking</h2>
        </div>
        <p className="text-muted-foreground text-sm">Os melhores pontuadores do Quiz Conheça o Brasil</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : ranking.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum resultado ainda. Seja o primeiro a completar o quiz!</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {ranking.map((entry) => (
                <div key={entry.rank} className={`flex items-center gap-3 p-4 ${entry.rank <= 3 ? "bg-amber-50/50 dark:bg-amber-950/20" : ""}`}>
                  <div className="w-8 text-center font-bold text-sm">
                    {getMedal(entry.rank) || <span className="text-muted-foreground">{entry.rank}</span>}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {entry.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.userName}</p>
                    <p className="text-xs text-muted-foreground">{entry.score} de {entry.total} acertos</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">{entry.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button variant="outline" className="w-full" onClick={refreshRanking}>
        <TrendingUp className="w-4 h-4 mr-1" /> Atualizar Ranking
      </Button>
    </div>
  );
}
