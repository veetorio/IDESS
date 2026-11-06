"use client";

import { useState } from "react";
import { LoaderCircle, Mail, Send } from "lucide-react";
import type {
  Newsletter,
  NewsletterPublicationResponse,
} from "@/types";

interface NewsletterManagerProps {
  initialNewsletters: Newsletter[];
  erroInicial?: string | null;
}

export function NewsletterManager({
  initialNewsletters,
  erroInicial = null,
}: NewsletterManagerProps) {
  const [newsletters, setNewsletters] = useState(initialNewsletters);
  const [erro, setErro] = useState(erroInicial);
  const [resultado, setResultado] = useState<string | null>(null);
  const [publicando, setPublicando] = useState(false);

  async function publicar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setResultado(null);
    setPublicando(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const corpo = {
      titulo: String(formData.get("titulo") ?? "").trim(),
      resumo: String(formData.get("resumo") ?? "").trim(),
      conteudo: String(formData.get("conteudo") ?? "").trim(),
    };

    try {
      const resposta = await fetch("/api/newsletter/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const dados: NewsletterPublicationResponse & { message?: string } =
        await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.message ?? "Não foi possível publicar a novidade.");
      }

      setNewsletters((atuais) => [dados.newsletter, ...atuais]);
      form.reset();
      setResultado(
        dados.envioConfigurado
          ? `Publicado. E-mails enviados: ${dados.emailsEnviados}; falhas: ${dados.emailsFalhos}.`
          : "Publicado e disponível para usuários cadastrados. Configure o SMTP para habilitar o envio por e-mail."
      );
    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível publicar a novidade."
      );
    } finally {
      setPublicando(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="h-fit border-t-2 border-primary bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-green/10 text-green-dark">
            <Send className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-primary">
              Publicar novidade
            </h2>
            <p className="text-sm text-neutral-600">
              A edição ficará disponível aos usuários cadastrados.
            </p>
          </div>
        </div>

        {erro && (
          <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}
        {resultado && (
          <p role="status" className="mb-4 rounded-lg border border-green/20 bg-green/10 p-3 text-sm text-green-dark">
            {resultado}
          </p>
        )}

        <form onSubmit={publicar} className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium text-neutral-700">
            Título
            <input
              name="titulo"
              required
              maxLength={150}
              className="h-11 w-full rounded-md border border-neutral-300 px-3 font-normal focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-neutral-700">
            Resumo
            <textarea
              name="resumo"
              required
              maxLength={300}
              rows={2}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 font-normal focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-neutral-700">
            Conteúdo
            <textarea
              name="conteudo"
              required
              maxLength={20000}
              rows={7}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 font-normal focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </label>
          <button
            type="submit"
            disabled={publicando}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-green-dark px-5 font-semibold text-white transition-colors hover:bg-[#0b5b28] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {publicando ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            {publicando ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </section>

      <section aria-labelledby="newsletters-publicadas">
        <div className="mb-5">
          <h2 id="newsletters-publicadas" className="font-serif text-2xl font-semibold text-primary">
            Novidades publicadas
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            {newsletters.length} {newsletters.length === 1 ? "edição" : "edições"}
          </p>
        </div>
        {newsletters.length === 0 ? (
          <div className="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-700">
            <Mail className="mx-auto mb-3 h-8 w-8 text-neutral-400" aria-hidden="true" />
            Nenhuma novidade publicada.
          </div>
        ) : (
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <article
                key={newsletter.id}
                className="border-b border-neutral-300 bg-white px-5 py-5"
              >
                <time
                  dateTime={newsletter.publicadoEm}
                  className="text-xs font-medium text-neutral-600"
                >
                  {new Date(newsletter.publicadoEm).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "America/Sao_Paulo",
                  })}
                </time>
                <h3 className="mt-2 font-serif text-xl font-semibold text-primary">
                  {newsletter.titulo}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">{newsletter.resumo}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
