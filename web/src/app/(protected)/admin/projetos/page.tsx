import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { Button } from "@/components/ui/button";
import { tokenExpirado, usuarioDoToken } from "@/lib/auth";
import type { Projeto } from "@/types";

export const metadata: Metadata = {
  title: "Administração de projetos",
  description: "Cadastre e atualize os projetos do Instituto.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default async function AdministrarProjetosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const usuario = token ? usuarioDoToken(token) : null;
  if (!token || tokenExpirado(token)) redirect("/entrar?redirect=/admin/projetos");
  if (usuario?.role !== "ADMIN") redirect("/");

  let projetos: Projeto[] = [];
  let erro: string | null = null;
  try {
    const resposta = await fetch(`${API_URL}/projetos`, { cache: "no-store" });
    if (!resposta.ok) throw new Error("Não foi possível carregar os projetos.");
    projetos = await resposta.json();
  } catch (falha) {
    erro = falha instanceof Error ? falha.message : "Erro ao carregar projetos.";
  }

  return (
    <div className="min-h-screen bg-base">
      <section className="border-b border-primary/15 bg-white px-5 py-10 text-primary sm:px-8 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex bg-green-dark px-3 py-1 text-xs font-semibold uppercase text-white">Administração</span>
            <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">Projetos do Instituto</h1>
            <p className="mt-3 max-w-2xl leading-6 text-neutral-700">Cadastre projetos, fotos, participantes e eventos associados.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild><Link href="/admin/eventos">Administrar eventos</Link></Button>
            <Button variant="ghost" asChild><Link href="/projetos">Ver página pública</Link></Button>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {erro ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{erro}</p>
        ) : (
          <ProjectManager projetos={projetos} />
        )}
      </div>
    </div>
  );
}
