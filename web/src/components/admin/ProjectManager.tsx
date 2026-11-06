"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Projeto } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const TIPOS_LOGO = ["image/jpeg", "image/png", "image/svg+xml"];
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/gif"];
const TAMANHO_MAXIMO = 5 * 1024 * 1024;
const ROTULOS_STATUS: Record<Projeto["status"], string> = {
  EM_ANDAMENTO: "Em andamento",
  AGENDADO: "Agendado",
  REALIZADO: "Realizado",
  SEM_EVENTOS: "Sem eventos associados",
};

interface ProjectManagerProps {
  projetos: Projeto[];
}

export function ProjectManager({ projetos: projetosIniciais }: ProjectManagerProps) {
  const router = useRouter();
  const logoInput = useRef<HTMLInputElement>(null);
  const fotosInput = useRef<HTMLInputElement>(null);
  const [projetos, setProjetos] = useState(projetosIniciais);
  const [editando, setEditando] = useState<Projeto | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function limparFormulario() {
    setEditando(null);
    setLogo(null);
    setFotos([]);
    if (logoInput.current) logoInput.current.value = "";
    if (fotosInput.current) fotosInput.current.value = "";
    setErro(null);
  }

  function editar(projeto: Projeto) {
    setEditando(projeto);
    setLogo(null);
    setFotos([]);
    setErro(null);
    setSucesso(null);
    if (logoInput.current) logoInput.current.value = "";
    if (fotosInput.current) fotosInput.current.value = "";
  }

  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setSucesso(null);

    const form = event.currentTarget;
    const dados = new FormData(form);
    const nome = String(dados.get("nome") ?? "").trim();
    const descricao = String(dados.get("descricao") ?? "").trim();
    const participantes = Number(dados.get("participantes"));

    if (!nome || !descricao || !Number.isInteger(participantes) || participantes < 0) {
      setErro("Preencha nome, descrição e uma quantidade válida de participantes.");
      return;
    }
    if (!editando && !logo) {
      setErro("Selecione a logo do projeto.");
      return;
    }
    if (!editando && fotos.length < 4) {
      setErro("Selecione pelo menos 4 fotos para o projeto.");
      return;
    }
    if (editando && fotos.length > 0 && fotos.length < 4) {
      setErro("Para substituir as fotos, selecione pelo menos 4 imagens.");
      return;
    }
    if (logo && (!TIPOS_LOGO.includes(logo.type) || logo.size > TAMANHO_MAXIMO)) {
      setErro("A logo deve ser PNG, JPEG ou SVG e ter no máximo 5 MB.");
      return;
    }
    if (fotos.some((foto) => !TIPOS_FOTO.includes(foto.type) || foto.size > TAMANHO_MAXIMO)) {
      setErro("As fotos devem ser PNG, JPEG ou GIF e ter no máximo 5 MB cada.");
      return;
    }

    const corpo = new FormData();
    corpo.append(
      "projeto",
      new Blob([JSON.stringify({ nome, descricao, participantes })], {
        type: "application/json",
      })
    );
    if (logo) corpo.append("logo", logo);
    fotos.forEach((foto) => corpo.append("fotos", foto));

    setEnviando(true);
    try {
      const resposta = await fetch(
        editando ? `/api/projetos/${editando.id}` : "/api/projetos",
        { method: editando ? "PUT" : "POST", body: corpo }
      );
      const respostaJson = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        throw new Error(respostaJson.message ?? "Não foi possível salvar o projeto.");
      }

      setProjetos((atuais) =>
        editando
          ? atuais.map((item) => item.id === respostaJson.id ? respostaJson as Projeto : item)
          : [respostaJson as Projeto, ...atuais]
      );
      limparFormulario();
      form.reset();
      setSucesso(editando ? "Projeto atualizado." : "Projeto criado.");
      router.refresh();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível salvar o projeto.");
    } finally {
      setEnviando(false);
    }
  }

  async function excluir(projeto: Projeto) {
    if (!window.confirm(`Excluir o projeto "${projeto.nome}"? Os eventos associados passarão a ser do Instituto.`)) {
      return;
    }
    setErro(null);
    try {
      const resposta = await fetch(`/api/projetos/${projeto.id}`, { method: "DELETE" });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        throw new Error(dados.message ?? "Não foi possível excluir o projeto.");
      }
      setProjetos((atuais) => atuais.filter((item) => item.id !== projeto.id));
      if (editando?.id === projeto.id) limparFormulario();
      setSucesso("Projeto excluído. Os eventos associados agora pertencem ao Instituto.");
      router.refresh();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível excluir o projeto.");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="h-fit border-t-2 border-primary bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-primary">
              {editando ? "Editar projeto" : "Criar projeto"}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Informe os dados e selecione ao menos 4 fotos.
            </p>
          </div>
          {editando && (
            <Button type="button" variant="ghost" size="icon" onClick={limparFormulario} aria-label="Cancelar edição">
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {erro && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
        {sucesso && <p role="status" className="mb-4 rounded-lg border border-green/20 bg-green/10 px-4 py-3 text-sm text-green-dark">{sucesso}</p>}

        <form key={editando?.id ?? "novo"} onSubmit={salvar} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do projeto</Label>
            <Input id="nome" name="nome" maxLength={150} required defaultValue={editando?.nome ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <textarea id="descricao" name="descricao" rows={5} required defaultValue={editando?.descricao ?? ""}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participantes">Quantidade de participantes</Label>
            <Input id="participantes" name="participantes" type="number" min={0} step={1} required defaultValue={editando?.participantes ?? 0} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo {editando ? "(opcional para manter a atual)" : ""}</Label>
            <Input ref={logoInput} id="logo" type="file" accept="image/png,image/jpeg,image/svg+xml"
              onChange={(event) => setLogo(event.target.files?.[0] ?? null)} />
            {editando && <p className="text-xs text-neutral-500">Logo atual: {editando.logo.split("/").pop()}</p>}
            <p className="text-xs text-neutral-500">PNG, JPEG ou SVG; até 5 MB.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fotos">Fotos do projeto</Label>
            <Input ref={fotosInput} id="fotos" type="file" accept="image/png,image/jpeg,image/gif" multiple
              onChange={(event) => setFotos(Array.from(event.target.files ?? []))} />
            <p className="text-xs text-neutral-500">
              {editando ? "Envie pelo menos 4 para substituir a galeria; vazio mantém as fotos atuais." : "Selecione pelo menos 4 fotos PNG, JPEG ou GIF."}
            </p>
            {fotos.length > 0 && <p className="text-sm text-neutral-600">{fotos.length} foto(s) selecionada(s).</p>}
            {editando && fotos.length === 0 && <p className="text-sm text-neutral-600">{editando.fotos.length} fotos atuais serão mantidas.</p>}
          </div>
          <Button type="submit" variant="success" disabled={enviando}>
            {enviando ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {enviando ? "Salvando..." : editando ? "Salvar alterações" : "Criar projeto"}
          </Button>
        </form>
      </section>

      <section aria-labelledby="projetos-cadastrados">
        <h2 id="projetos-cadastrados" className="mb-5 border-b border-neutral-300 pb-4 font-serif text-2xl font-semibold text-primary">
          Projetos cadastrados ({projetos.length})
        </h2>
        {projetos.length === 0 ? (
          <div className="border border-dashed border-neutral-300 bg-white px-6 py-12 text-center text-neutral-700">
            Nenhum projeto cadastrado ainda.
          </div>
        ) : (
          <ul className="space-y-3">
            {projetos.map((projeto) => (
              <li key={projeto.id} className="flex flex-col gap-4 border-b border-neutral-300 bg-white p-4 sm:flex-row sm:items-center">
                <Image src={`${API_URL}${projeto.logo}`} alt="" width={64} height={64} unoptimized className="h-16 w-16 border border-neutral-200 bg-white object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif text-lg font-semibold text-primary">{projeto.nome}</h3>
                  <p className="text-sm text-neutral-600">{projeto.participantes} participantes • {ROTULOS_STATUS[projeto.status]}</p>
                  <p className="text-xs text-neutral-500">{projeto.fotos.length} fotos</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => editar(projeto)}>
                    <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => void excluir(projeto)} aria-label={`Excluir ${projeto.nome}`}>
                    <Trash2 className="h-4 w-4 text-red-600" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
