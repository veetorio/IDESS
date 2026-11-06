"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Projeto } from "@/types";

const eventSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do evento.").max(150),
  descricao: z.string().trim().min(1, "Informe a descrição."),
  dataInicio: z.string().min(1, "Informe a data de início."),
  dataFim: z.string().min(1, "Informe a data de término."),
  projetoId: z.string(),
  vagasTotais: z.number().int().min(1, "O evento precisa ter pelo menos 1 vaga."),
  aberto: z.boolean(),
}).refine((valores) => valores.dataFim >= valores.dataInicio, {
  message: "A data de término não pode ser anterior à data de início.",
  path: ["dataFim"],
});

type EventFormValues = z.infer<typeof eventSchema>;
const TIPOS_IMAGEM = ["image/jpeg", "image/png", "image/gif"];
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

export function EventForm() {
  const router = useRouter();
  const [imagens, setImagens] = useState<File[]>([]);
  const [chaveInputImagens, setChaveInputImagens] = useState(0);
  const [erroImagens, setErroImagens] = useState<string | null>(null);
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [erroProjetos, setErroProjetos] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/projetos", { cache: "no-store" })
      .then(async (resposta) => {
        if (!resposta.ok) throw new Error("Não foi possível carregar os projetos.");
        setProjetos(await resposta.json());
      })
      .catch((erro: unknown) => {
        setErroProjetos(erro instanceof Error ? erro.message : "Erro ao carregar projetos.");
      });
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
      projetoId: "",
      vagasTotais: 1,
      aberto: true,
    },
  });

  async function criarEvento(values: EventFormValues) {
    setErroServidor(null);
    setSucesso(null);
    setErroImagens(null);

    if (imagens.length > 10) {
      setErroImagens("Selecione no máximo 10 imagens.");
      return;
    }
    const arquivoInvalido = imagens.find(
      (imagem) =>
        !TIPOS_IMAGEM.includes(imagem.type) ||
        imagem.size > TAMANHO_MAXIMO_IMAGEM
    );
    if (arquivoInvalido) {
      setErroImagens(
        "Cada arquivo deve ser JPEG, PNG ou GIF e ter no máximo 5 MB."
      );
      return;
    }

    try {
      const formulario = new FormData();
      formulario.append(
        "evento",
        new Blob(
          [
            JSON.stringify({
              nome: values.nome,
              descricao: values.descricao,
              dataInicio: values.dataInicio,
              dataFim: values.dataFim,
              projetoId: values.projetoId || null,
              vagasTotais: values.vagasTotais,
              aberto: values.aberto,
            }),
          ],
          { type: "application/json" }
        )
      );
      imagens.forEach((imagem) => formulario.append("imagens", imagem));

      const resposta = await fetch("/api/eventos", {
        method: "POST",
        body: formulario,
      });
      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.message ?? "Não foi possível criar o evento.");
      }

      reset();
      setImagens([]);
      setChaveInputImagens((chave) => chave + 1);
      setSucesso("Evento criado com sucesso.");
      router.refresh();
    } catch (erro) {
      setErroServidor(
        erro instanceof Error
          ? erro.message
          : "Não foi possível criar o evento. Tente novamente."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(criarEvento)}
      className="space-y-5"
      aria-label="Formulário de criação de evento"
      noValidate
    >
      {erroServidor && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {erroServidor}
        </p>
      )}
      {sucesso && (
        <p
          className="rounded-lg border border-green/20 bg-green/10 px-4 py-3 text-sm font-medium text-green-dark"
          role="status"
        >
          {sucesso}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="nome">Nome do evento</Label>
        <Input
          id="nome"
          maxLength={150}
          placeholder="Ex.: Mutirão de revitalização"
          erro={errors.nome?.message}
          {...register("nome")}
        />
        {errors.nome && (
          <p className="text-sm text-red-600">{errors.nome.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dataInicio">Data de início</Label>
          <Input id="dataInicio" type="date" erro={errors.dataInicio?.message} {...register("dataInicio")} />
          {errors.dataInicio && <p className="text-sm text-red-600">{errors.dataInicio.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataFim">Data de término</Label>
          <Input id="dataFim" type="date" erro={errors.dataFim?.message} {...register("dataFim")} />
          {errors.dataFim && <p className="text-sm text-red-600">{errors.dataFim.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projetoId">Projeto associado (opcional)</Label>
        <select
          id="projetoId"
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
          {...register("projetoId")}
        >
          <option value="">Instituto (sem projeto associado)</option>
          {projetos.map((projeto) => (
            <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>
          ))}
        </select>
        {erroProjetos && <p className="text-sm text-red-600" role="alert">{erroProjetos}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <textarea
          id="descricao"
          rows={5}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
          placeholder="Conte os detalhes do evento"
          aria-invalid={Boolean(errors.descricao)}
          aria-describedby={errors.descricao ? "descricao-erro" : undefined}
          {...register("descricao")}
        />
        {errors.descricao && (
          <p id="descricao-erro" className="text-sm text-red-600">
            {errors.descricao.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imagens">Imagens do evento (opcional)</Label>
        <Input
          key={chaveInputImagens}
          id="imagens"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          aria-invalid={Boolean(erroImagens)}
          aria-describedby="imagens-ajuda"
          onChange={(event) => {
            setImagens(Array.from(event.target.files ?? []));
            setErroImagens(null);
          }}
        />
        <p id="imagens-ajuda" className="text-xs text-neutral-500">
          JPEG, PNG ou GIF; até 10 imagens, com no máximo 5 MB cada.
        </p>
        {imagens.length > 0 && (
          <p className="text-sm text-neutral-600">
            {imagens.length} arquivo(s) selecionado(s).
          </p>
        )}
        {erroImagens && (
          <p className="text-sm text-red-600" role="alert">
            {erroImagens}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="vagasTotais">Total de vagas</Label>
          <Input
            id="vagasTotais"
            type="number"
            min={1}
            step={1}
            erro={errors.vagasTotais?.message}
            {...register("vagasTotais", { valueAsNumber: true })}
          />
          {errors.vagasTotais && (
            <p className="text-sm text-red-600">
              {errors.vagasTotais.message}
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-3 self-end rounded-lg border border-neutral-200 p-3">
          <input
            type="checkbox"
            className="h-4 w-4 accent-green"
            {...register("aberto")}
          />
          <span>
            <span className="block text-sm font-medium text-neutral-900">
              Inscrições abertas
            </span>
            <span className="block text-xs text-neutral-500">
              Permitir inscrições imediatamente
            </span>
          </span>
        </label>
      </div>

      <Button type="submit" variant="success" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Plus className="h-4 w-4" aria-hidden="true" />
        )}
        {isSubmitting ? "Criando evento..." : "Criar evento"}
      </Button>
    </form>
  );
}
