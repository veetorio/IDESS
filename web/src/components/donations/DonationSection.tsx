"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const valoresSugeridos = [10, 20, 30, 50];
const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function DonationSection() {
  const [valorSelecionado, setValorSelecionado] = useState<number | null>(20);
  const [valorPersonalizado, setValorPersonalizado] = useState("");

  const valorDigitado = valorPersonalizado.trim().replace(",", ".");
  const valorConvertido = Number(valorDigitado);
  const valorValido =
    valorDigitado !== "" &&
    Number.isFinite(valorConvertido) &&
    valorConvertido > 0;
  const valorAtual = valorSelecionado ?? (valorValido ? valorConvertido : null);

  return (
    <section
      id="doacao"
      className="bg-primary px-5 py-16 text-white sm:px-8 sm:py-20"
      aria-labelledby="doacao-titulo"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-[1fr_0.9fr] md:items-center lg:gap-16">
        <div className="min-w-0">
          <div className="mb-5 flex items-center gap-3 text-green-light" aria-hidden="true">
            <HeartHandshake className="h-6 w-6" />
            <span className="h-px w-10 bg-green-light" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-green-light">
            Apoie nossas iniciativas
          </span>
          <h2
            id="doacao-titulo"
            className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-tight md:text-5xl"
          >
            Sua doação transforma vidas
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85">
            Contribua com o trabalho do Instituto. Cada valor ajuda a manter
            nossas iniciativas sociais e sustentáveis.
          </p>
        </div>

        <div className="min-w-0 border-l-4 border-green bg-white p-6 text-neutral-900 sm:p-8">
          <fieldset>
            <legend className="font-semibold text-primary">
              Escolha um valor
            </legend>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
              {valoresSugeridos.map((valor) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={valorSelecionado === valor}
                  onClick={() => {
                    setValorSelecionado(valor);
                    setValorPersonalizado("");
                  }}
                  className={`min-h-11 border px-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 ${
                    valorSelecionado === valor
                      ? "border-green-dark bg-green-dark text-white"
                      : "border-neutral-200 text-primary hover:border-green hover:bg-green/5"
                  }`}
                >
                  R$ {valor}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label
              htmlFor="valor-personalizado"
              className="text-sm font-medium text-neutral-700"
            >
              Ou informe outro valor
            </label>
            <div className="mt-2 flex items-center border border-neutral-300 focus-within:ring-2 focus-within:ring-blue">
              <span className="px-3 text-neutral-500" aria-hidden="true">
                R$
              </span>
              <input
                id="valor-personalizado"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="Outro valor"
                value={valorPersonalizado}
                onChange={(event) => {
                  setValorPersonalizado(event.target.value);
                  setValorSelecionado(null);
                }}
                aria-invalid={valorPersonalizado !== "" && !valorValido}
                aria-describedby={
                  valorPersonalizado !== "" && !valorValido
                    ? "valor-personalizado-erro doacao-status"
                    : "doacao-status"
                }
                className="h-11 min-w-0 flex-1 rounded-r-lg bg-transparent pr-3 text-neutral-900 outline-none"
              />
            </div>
            {valorPersonalizado !== "" && !valorValido && (
              <p
                id="valor-personalizado-erro"
                className="mt-2 text-sm text-red-700"
                role="status"
              >
                Informe um valor maior que zero.
              </p>
            )}
          </div>

          <p className="mt-5 font-serif text-3xl font-semibold text-primary" aria-live="polite">
            {valorAtual === null
              ? "Valor da doação"
              : formatadorMoeda.format(valorAtual)}
          </p>

          <Button
            type="button"
            variant="success"
            size="lg"
            disabled
            className="mt-4 w-full"
            aria-describedby="doacao-status"
          >
            Doação via Pix em breve
          </Button>
          <p
            id="doacao-status"
            className="mt-3 text-center text-sm text-neutral-600"
            role="status"
          >
            O pagamento Pix estará disponível após a configuração da integração
            com o Santander.
          </p>
        </div>
      </div>
    </section>
  );
}
