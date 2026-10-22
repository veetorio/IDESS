import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatarData } from "@/lib/utils";
import { usuarioDoToken } from "@/lib/auth";
import type { Inscricao } from "@/types";

export const metadata: Metadata = {
  title: "Minha Conta",
  description: "Veja seu perfil e suas inscrições em eventos.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function buscarInscricoes(token: string): Promise<Inscricao[]> {
  const res = await fetch(`${API_URL}/inscricoes`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function PaginaMinhaConta() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  const usuario = usuarioDoToken(token);
  const inscricoes = await buscarInscricoes(token);

  return (
    <div className="min-h-screen bg-base">
      {/* Banner do perfil */}
      <div className="bg-primary px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-green flex items-center justify-center text-white text-2xl font-bold shrink-0"
              aria-hidden="true"
            >
              {usuario?.nome?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="text-sm text-white/70">Bem-vindo(a),</p>
              <h1 className="text-2xl font-bold text-white">
                {usuario?.nome ?? "Usuário"}
              </h1>
              {usuario?.role && (
                <Badge
                  variant={usuario.role === "ADMIN" ? "primary" : "success"}
                  className="mt-1 text-xs"
                >
                  {usuario.role === "ADMIN" ? "Administrador" : "Participante"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Minhas inscrições */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">
            Minhas inscrições
          </h2>
          <span className="text-sm text-neutral-500">
            {inscricoes.length}{" "}
            {inscricoes.length === 1 ? "inscrição" : "inscrições"}
          </span>
        </div>

        {inscricoes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
            <Calendar
              className="h-12 w-12 text-neutral-300 mx-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-neutral-600 font-medium">
              Você ainda não se inscreveu em nenhum evento.
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              Explore os eventos disponíveis e participe!
            </p>
            <Button variant="default" className="mt-6" asChild>
              <Link href="/eventos">
                Ver eventos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {inscricoes.map((inscricao) => {
              const { evento } = inscricao;
              return (
                <Card
                  key={inscricao.id}
                  className="border-neutral-200 hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={evento.aberto ? "success" : "secondary"}
                          >
                            {evento.aberto ? "Aberto" : "Encerrado"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-primary truncate">
                          {evento.nome}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <Calendar
                            className="h-3.5 w-3.5 text-green"
                            aria-hidden="true"
                          />
                          <time dateTime={evento.criadoEm}>
                            {formatarData(evento.criadoEm)}
                          </time>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Indicador de inscrição confirmada */}
                        <div className="flex items-center gap-1.5 text-sm text-green font-medium">
                          <CheckCircle
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          Inscrito
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/eventos/${evento.id}`}>
                            Ver evento
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
