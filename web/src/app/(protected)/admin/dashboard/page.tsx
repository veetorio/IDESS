import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CalendarRange,
  HandHelping,
  Newspaper,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usuarioDoToken, tokenExpirado } from "@/lib/auth";
import {
  getDashboardAtividadeData,
  type CategoriaDashboard,
} from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Dashboard de atividades",
  description:
    "Acompanhe as atividades mensais e anuais de eventos, notícias, usuários cadastrados e ajudas.",
};

const CATEGORIA_META: Record<
  CategoriaDashboard,
  { label: string; color: string; icon: typeof CalendarRange }
> = {
  eventos: { label: "Eventos", color: "bg-violet-500", icon: CalendarRange },
  noticias: { label: "Notícias", color: "bg-sky-500", icon: Newspaper },
  usuarios_cadastrados: {
    label: "Usuários cadastrados",
    color: "bg-emerald-500",
    icon: Users,
  },
  ajudas: { label: "Ajudas", color: "bg-amber-500", icon: HandHelping },
};

function formatarCategoria(categoria: CategoriaDashboard) {
  return CATEGORIA_META[categoria].label;
}

function formatarCrescimento(valor: number) {
  return `${valor > 0 ? "+" : ""}${valor}%`;
}

export default async function DashboardAtividadesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const usuario = token ? usuarioDoToken(token) : null;

  if (!token || tokenExpirado(token)) {
    redirect("/entrar?redirect=/admin/dashboard");
  }

  if (usuario?.role !== "ADMIN") {
    redirect("/");
  }

  const dados = getDashboardAtividadeData();

  return (
    <div className="min-h-screen bg-base px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b border-primary/15 bg-white px-5 py-7 text-primary sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge variant="success">Administração</Badge>
              <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">
                Dashboard de atividades
              </h1>
              <p className="mt-3 max-w-2xl leading-6 text-neutral-700">
                Acompanhe o desempenho mensal e anual das principais atividades do
                instituto.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin/eventos">Eventos</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/projetos">Projetos</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dados.resumo.map((item) => {
            const meta = CATEGORIA_META[item.categoria];
            const Icon = meta.icon;

            return (
              <Card key={item.categoria} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-11 w-11 items-center justify-center ${meta.color} text-white`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm text-neutral-600">{item.nome}</p>
                        <p className="text-2xl font-bold text-neutral-900">
                          {item.total}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatarCrescimento(item.crescimento)}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Atividade mensal</CardTitle>
                  <p className="mt-1 text-sm text-neutral-600">
                    Total geral do ano: {dados.totalMensal}
                  </p>
                </div>
                <Badge variant="primary">{dados.ano}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dados.atividadesMensais.map((mes) => {
                  const totalMes =
                    mes.eventos +
                    mes.noticias +
                    mes.usuarios_cadastrados +
                    mes.ajudas;

                  return (
                    <div key={mes.mes} className="grid gap-3 md:grid-cols-[48px_minmax(0,1fr)] md:items-center">
                      <span className="text-sm font-medium text-neutral-600">
                        {mes.mes}
                      </span>

                      <div className="flex h-7 items-end gap-1.5 overflow-hidden rounded-full bg-neutral-100 p-1">
                        {(
                          [
                            { key: "eventos", value: mes.eventos },
                            { key: "noticias", value: mes.noticias },
                            {
                              key: "usuarios_cadastrados",
                              value: mes.usuarios_cadastrados,
                            },
                            { key: "ajudas", value: mes.ajudas },
                          ] as Array<{ key: CategoriaDashboard; value: number }>
                        ).map(({ key, value }) => {
                          const meta = CATEGORIA_META[key];
                          const percentual = totalMes === 0 ? 0 : (value / totalMes) * 100;

                          return (
                            <span
                              key={key}
                              title={`${formatarCategoria(key)}: ${value}`}
                              className={`${meta.color} rounded-full`}
                              style={{
                                width: `${Math.max(percentual, 8)}%`,
                                height: "100%",
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo anual por categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {dados.resumo.map((item) => {
                const meta = CATEGORIA_META[item.categoria];
                const valorMaximo = Math.max(...dados.resumo.map((categoria) => categoria.total));
                const largura = `${(item.total / valorMaximo) * 100}%`;

                return (
                  <div key={item.categoria} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${meta.color}`} />
                        <span className="text-sm font-medium text-neutral-700">
                          {meta.label}
                        </span>
                      </div>
                      <strong className="text-sm text-neutral-900">{item.total}</strong>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`${meta.color} h-full rounded-full`}
                        style={{ width: largura }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>Comparativo por categoria</CardTitle>
                  <p className="mt-1 text-sm text-neutral-600">
                    Evolução acumulada no período atual
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dados.resumo.map((item) => (
                <div key={item.categoria} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <div>
                    <p className="font-medium text-neutral-800">
                      {formatarCategoria(item.categoria)}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Crescimento de {formatarCrescimento(item.crescimento)}
                    </p>
                  </div>
                  <Badge variant="secondary">{item.total}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>Visão geral</CardTitle>
                  <p className="mt-1 text-sm text-neutral-600">
                    Ação principal em andamento no dashboard
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="text-sm text-neutral-700">Atividade total no período</p>
                <p className="mt-2 text-3xl font-bold text-primary">{dados.totalMensal}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 p-4">
                  <p className="text-sm text-neutral-600">Maior categoria</p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {dados.resumo.reduce((maior, item) =>
                      item.total > maior.total ? item : maior
                    ).nome}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4">
                  <p className="text-sm text-neutral-600">Mês destaque</p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {dados.atividadesMensais.reduce((maior, mes) => {
                      const totalAtual =
                        mes.eventos +
                        mes.noticias +
                        mes.usuarios_cadastrados +
                        mes.ajudas;
                      const totalMaior =
                        maior.eventos +
                        maior.noticias +
                        maior.usuarios_cadastrados +
                        maior.ajudas;
                      return totalAtual > totalMaior ? mes : maior;
                    }).mes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
