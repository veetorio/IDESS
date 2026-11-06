import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Projeto } from "@/types";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Conheça os projetos do Instituto e acompanhe suas iniciativas.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const STATUS: Record<Projeto["status"], string> = {
  EM_ANDAMENTO: "Em andamento",
  AGENDADO: "Agendado",
  REALIZADO: "Realizado",
  SEM_EVENTOS: "Sem eventos associados",
};

async function buscarProjetos(): Promise<Projeto[]> {
  const resposta = await fetch(`${API_URL}/projetos`, { cache: "no-store" });
  if (!resposta.ok) throw new Error("Não foi possível carregar os projetos.");
  return resposta.json();
}

export default async function ProjetosPage() {
  let projetos: Projeto[] = [];
  let erro: string | null = null;
  try {
    projetos = await buscarProjetos();
  } catch (falha) {
    erro = falha instanceof Error ? falha.message : "Erro ao carregar os projetos.";
  }

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-primary/10 bg-white px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-green-dark">Nossas iniciativas</span>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">Projetos</h1>
          <p className="mt-4 max-w-2xl leading-7 text-neutral-700">Conheça as iniciativas que promovem desenvolvimento e transformação social.</p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {erro ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{erro}</p>
        ) : projetos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-600">Nenhum projeto publicado no momento.</p>
        ) : (
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {projetos.map((projeto) => (
              <li key={projeto.id} className="min-w-0">
                <Link href={`/projetos/${projeto.id}`} className="group block h-full focus-visible:outline-none">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-white p-5">
                    <Image
                      src={`${API_URL}${projeto.fotos[0] ?? projeto.logo}`}
                      alt={projeto.fotos[0] ? projeto.nome : `Logo ${projeto.nome}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={projeto.fotos[0] ? "object-cover" : "object-contain p-6"}
                    />
                  </div>
                  <div className="border-b border-neutral-300 py-5 transition-colors group-hover:border-green">
                    <Badge variant={projeto.status === "EM_ANDAMENTO" ? "success" : "secondary"}>{STATUS[projeto.status]}</Badge>
                    <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-primary group-hover:underline">{projeto.nome}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-700">{projeto.descricao}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-neutral-600">
                      <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-green" aria-hidden="true" />{projeto.participantes} participantes</span>
                      <span className="inline-flex items-center gap-1 font-medium text-primary">Detalhes <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
