"use client";

import { useState } from "react";
import { Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Newsletter, NewsletterPreference } from "@/types";

interface NewsletterCenterProps {
  initialPreference: NewsletterPreference | null;
  newsletters: Newsletter[];
  erro?: string | null;
}

export function NewsletterCenter({
  initialPreference,
  newsletters,
  erro = null,
}: NewsletterCenterProps) {
  const [recebeNewsletter, setRecebeNewsletter] = useState(
    initialPreference?.recebeNewsletter ?? false
  );
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erroPreferencia, setErroPreferencia] = useState<string | null>(null);

  async function atualizarPreferencia() {
    setSalvando(true);
    setMensagem(null);
    setErroPreferencia(null);
    try {
      const resposta = await fetch("/api/newsletter/preferencia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recebeNewsletter: !recebeNewsletter }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.message ?? "Não foi possível salvar sua preferência.");
      }

      setRecebeNewsletter(dados.recebeNewsletter);
      setMensagem(
        dados.recebeNewsletter
          ? "Você receberá as próximas novidades por e-mail."
          : "Você não receberá mais novidades por e-mail."
      );
    } catch (falha) {
      setErroPreferencia(
        falha instanceof Error
          ? falha.message
          : "Não foi possível salvar sua preferência."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section aria-labelledby="newsletter-titulo">
      <div className="mb-5 flex items-start gap-3 border-b border-neutral-300 pb-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-green/10 text-green-dark">
          <Bell className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="newsletter-titulo" className="font-serif text-2xl font-semibold text-primary">
            Novidades do Instituto
          </h2>
          <p className="text-sm text-neutral-600">
            Acompanhe comunicados e escolha se deseja recebê-los por e-mail.
          </p>
        </div>
      </div>

      {initialPreference ? (
        <div className="mb-6 border-l-4 border-green bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Mail
                className="mt-0.5 h-5 w-5 shrink-0 text-green-dark"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-neutral-800">
                  Receber novidades por e-mail
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Enviaremos para {initialPreference.email}. Você pode cancelar
                  quando quiser.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant={recebeNewsletter ? "outline" : "default"}
              onClick={atualizarPreferencia}
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : recebeNewsletter
                  ? "Cancelar recebimento"
                  : "Quero receber"}
            </Button>
          </div>
          {mensagem && (
            <p role="status" className="mt-3 text-sm text-green-dark">
              {mensagem}
            </p>
          )}
          {erroPreferencia && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {erroPreferencia}
            </p>
          )}
        </div>
      ) : (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          Não foi possível carregar sua preferência de e-mail.
        </p>
      )}

      {erro ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </p>
      ) : newsletters.length === 0 ? (
        <div className="border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-700">
          Ainda não há novidades publicadas.
        </div>
      ) : (
        <div className="space-y-4">
          {newsletters.map((newsletter) => (
            <article
              key={newsletter.id}
              className="border-b border-neutral-300 bg-white px-5 py-6 sm:px-6"
            >
              <time
                dateTime={newsletter.publicadoEm}
                className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-600"
              >
                {new Date(newsletter.publicadoEm).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "America/Sao_Paulo",
                })}
              </time>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-primary">
                {newsletter.titulo}
              </h3>
              <p className="mt-2 font-medium text-neutral-700">
                {newsletter.resumo}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                {newsletter.conteudo}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
