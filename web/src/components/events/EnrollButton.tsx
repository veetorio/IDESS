"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { eventoDisponivel } from "@/lib/utils";

type Estado = "idle" | "loading" | "inscrito" | "erro";

interface EnrollButtonProps {
  eventoId: string;
  aberto: boolean;
  vagasOcupadas: number;
  vagasTotais: number;
  jaInscrito?: boolean;
}

export function EnrollButton({
  eventoId,
  aberto,
  vagasOcupadas,
  vagasTotais,
  jaInscrito = false,
}: EnrollButtonProps) {
  const { usuario } = useAuth();
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>(jaInscrito ? "inscrito" : "idle");
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const disponivel = eventoDisponivel(aberto, vagasOcupadas, vagasTotais);

  // Usuário não autenticado
  if (!usuario) {
    return (
      <Button
        variant="success"
        size="lg"
        className="w-full sm:w-auto"
        onClick={() => router.push(`/entrar?redirect=/eventos/${eventoId}`)}
      >
        Entre para se inscrever
      </Button>
    );
  }

  // Já inscrito
  if (estado === "inscrito") {
    return (
      <div
        role="status"
        className="flex items-center gap-2 text-green font-semibold"
        aria-live="polite"
      >
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        Você está inscrito neste evento
      </div>
    );
  }

  // Evento indisponível
  if (!disponivel) {
    return (
      <Button variant="default" size="lg" disabled className="w-full sm:w-auto">
        {!aberto ? "Inscrições encerradas" : "Vagas esgotadas"}
      </Button>
    );
  }

  const inscrever = async () => {
    setEstado("loading");
    setMensagemErro(null);

    try {
      const resposta = await fetch("/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventoId }),
      });

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(
          (erro as { message?: string }).message ?? "Erro ao realizar inscrição"
        );
      }

      setEstado("inscrito");
      router.refresh();
    } catch (err) {
      setEstado("erro");
      setMensagemErro(
        err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      );
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="success"
        size="lg"
        className="w-full sm:w-auto"
        onClick={inscrever}
        disabled={estado === "loading"}
        aria-busy={estado === "loading"}
      >
        {estado === "loading" && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {estado === "loading" ? "Inscrevendo..." : "Inscrever-se no evento"}
      </Button>

      {estado === "erro" && mensagemErro && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600"
          aria-live="assertive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {mensagemErro}
        </div>
      )}
    </div>
  );
}
