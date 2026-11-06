import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NewsletterManager } from "@/components/admin/NewsletterManager";
import { Badge } from "@/components/ui/badge";
import { tokenExpirado, usuarioDoToken } from "@/lib/auth";
import type { Newsletter } from "@/types";

export const metadata: Metadata = {
  title: "Administração do newsletter",
  description: "Publique novidades para os usuários do Instituto.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default async function AdministrarNewsletterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const usuario = token ? usuarioDoToken(token) : null;

  if (!token || tokenExpirado(token)) {
    redirect("/entrar?redirect=/admin/newsletter");
  }
  if (usuario?.role !== "ADMIN") redirect("/");

  let newsletters: Newsletter[] = [];
  let erro: string | null = null;
  try {
    const resposta = await fetch(`${API_URL}/newsletter/admin`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!resposta.ok) {
      throw new Error("Não foi possível carregar as novidades publicadas.");
    }
    newsletters = await resposta.json();
  } catch (falha) {
    erro =
      falha instanceof Error
        ? falha.message
        : "Não foi possível carregar as novidades publicadas.";
  }

  return (
    <div className="min-h-screen bg-base">
      <section className="border-b border-primary/15 bg-white px-5 py-10 text-primary sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Badge variant="success">Administração</Badge>
          <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">
            Newsletter do Instituto
          </h1>
          <p className="mt-3 max-w-2xl leading-6 text-neutral-700">
            Publique novidades para os usuários cadastrados e envie por e-mail
            para quem optou por receber.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <NewsletterManager
          initialNewsletters={newsletters}
          erroInicial={erro}
        />
      </div>
    </div>
  );
}
