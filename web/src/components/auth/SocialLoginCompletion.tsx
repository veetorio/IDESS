"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialLoginCompletionProps {
  ticket: string;
  redirect: string;
  novoCadastro: boolean;
}

function destinoSeguro(destino: string) {
  return destino.startsWith("/") && !destino.startsWith("//") && !destino.startsWith("/\\")
    ? destino
    : "/";
}

export function SocialLoginCompletion({
  ticket,
  redirect,
  novoCadastro,
}: SocialLoginCompletionProps) {
  const iniciouTroca = useRef(false);
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const concluirLogin = useCallback(async () => {
    if (!ticket) {
      setErro("Não foi possível validar o retorno do provedor. Tente entrar novamente.");
      return;
    }

    setEnviando(true);
    setErro(null);
    try {
      const resposta = await fetch("/api/auth/social/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket,
          ...(novoCadastro ? { telefone } : {}),
        }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.message ?? "Não foi possível concluir o login social.");
      }

      window.location.replace(destinoSeguro(redirect));
    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível concluir o login social."
      );
      setEnviando(false);
    }
  }, [novoCadastro, redirect, telefone, ticket]);

  useEffect(() => {
    if (!novoCadastro && ticket && !iniciouTroca.current) {
      iniciouTroca.current = true;
      void concluirLogin();
    }
  }, [concluirLogin, novoCadastro, ticket]);

  useEffect(() => {
    if (!ticket) {
      setErro("Não foi possível validar o retorno do provedor. Tente entrar novamente.");
    }
  }, [ticket]);

  return (
    <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-primary">
        {novoCadastro ? "Finalize seu cadastro" : "Concluindo seu acesso"}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        {novoCadastro
          ? "Informe seu telefone para completar o cadastro no instituto."
          : "Estamos validando sua autenticação."}
      </p>

      {erro && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {erro}
        </p>
      )}

      {novoCadastro && (
        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void concluirLogin();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="telefone-social">Telefone</Label>
            <Input
              id="telefone-social"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              required
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={enviando || !ticket || !telefone.trim()}
          >
            {enviando ? "Concluindo..." : "Concluir cadastro"}
          </Button>
        </form>
      )}

      {!novoCadastro && enviando && (
        <p className="mt-6 text-sm text-neutral-600" role="status">
          Aguarde enquanto confirmamos sua conta…
        </p>
      )}

      {erro && (
        <Button
          type="button"
          variant="outline"
          className="mt-5 w-full"
          onClick={() => window.location.replace("/entrar")}
        >
          Voltar para entrar
        </Button>
      )}
    </section>
  );
}
