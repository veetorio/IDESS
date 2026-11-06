import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarData } from "@/lib/utils";
import { usuarioDoToken } from "@/lib/auth";
import { NewsletterCenter } from "@/components/newsletter/NewsletterCenter";
import type {
  Inscricao,
  Newsletter,
  NewsletterPreference,
} from "@/types";

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

async function buscarNewsletter(token: string): Promise<{
  newsletters: Newsletter[];
  preferencia: NewsletterPreference | null;
  erro: string | null;
}> {
  const [respostaNovidades, respostaPreferencia] = await Promise.all([
    fetch(`${API_URL}/newsletter`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null),
    fetch(`${API_URL}/newsletter/preferencia`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null),
  ]);
  let newsletters: Newsletter[] = [];
  let preferencia: NewsletterPreference | null = null;
  let erro: string | null = null;

  if (respostaNovidades?.ok) {
    newsletters = await respostaNovidades.json();
  } else {
    erro = "Não foi possível carregar as novidades.";
  }
  if (respostaPreferencia?.ok) {
    preferencia = await respostaPreferencia.json();
  }

  return {
    newsletters,
    preferencia,
    erro,
  };
}

export default async function PaginaMinhaConta() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  const usuario = usuarioDoToken(token);
  const [inscricoes, resultadoNewsletter] = await Promise.all([
    buscarInscricoes(token),
    usuario?.role === "COMMON"
      ? buscarNewsletter(token)
      : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-primary/15 bg-white px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto flex max-w-6xl items-center gap-5">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center bg-primary text-2xl font-semibold text-white"
            aria-hidden="true"
          >
            {usuario?.nome?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-dark">
              Minha conta
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-primary sm:text-4xl">
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
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <section aria-labelledby="inscricoes-titulo">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-neutral-300 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-dark">
                Sua participação
              </p>
              <h2
                id="inscricoes-titulo"
                className="mt-1 font-serif text-3xl font-semibold text-primary"
              >
                Minhas inscrições
              </h2>
            </div>
            <span className="text-sm font-medium text-neutral-700">
              {inscricoes.length}{" "}
              {inscricoes.length === 1 ? "inscrição" : "inscrições"}
            </span>
          </div>

          {inscricoes.length === 0 ? (
            <div className="border-l-4 border-green bg-white px-6 py-12 text-center">
              <Calendar
                className="mx-auto mb-4 h-12 w-12 text-neutral-300"
                aria-hidden="true"
              />
              <p className="font-medium text-neutral-700">
                Você ainda não se inscreveu em nenhum evento.
              </p>
              <p className="mt-1 text-sm text-neutral-600">
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
            <ul className="divide-y divide-neutral-300 border-y border-neutral-300">
              {inscricoes.map((inscricao) => {
                const { evento } = inscricao;
                return (
                  <li key={inscricao.id} className="bg-white">
                    <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
                      <div className="min-w-0 space-y-1.5">
                        <Badge
                          variant={evento.aberto ? "success" : "secondary"}
                        >
                          {evento.aberto ? "Aberto" : "Encerrado"}
                        </Badge>
                        <h3 className="truncate font-serif text-xl font-semibold text-primary">
                          {evento.nome}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                          <Calendar
                            className="h-3.5 w-3.5 text-green-dark"
                            aria-hidden="true"
                          />
                          <time dateTime={evento.criadoEm}>
                            {formatarData(evento.criadoEm)}
                          </time>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-green-dark">
                          <CheckCircle className="h-4 w-4" aria-hidden="true" />
                          Inscrito
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/eventos/${evento.id}`}>Ver evento</Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {resultadoNewsletter && (
          <div className="mt-14 border-t border-neutral-300 pt-10">
            <NewsletterCenter
              initialPreference={resultadoNewsletter.preferencia}
              newsletters={resultadoNewsletter.newsletters}
              erro={resultadoNewsletter.erro}
            />
          </div>
        )}
      </div>
    </div>
  );
}
