"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ----------------------
// Schema de validação
// ----------------------

const registerSchema = z
  .object({
    nome: z
      .string()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(100, "Nome muito longo"),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("Informe um e-mail válido"),
    telefone: z
      .string()
      .min(10, "Telefone inválido")
      .max(15, "Telefone inválido")
      .regex(/^[\d\s()\-+]+$/, "Telefone inválido"),
    senha: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .max(100, "Senha muito longa"),
    confirmarSenha: z.string().min(1, "Confirme sua senha"),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ----------------------
// Componente
// ----------------------

export function RegisterForm() {
  const { registrar } = useAuth();
  const router = useRouter();

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (dados: RegisterFormData) => {
    setErroServidor(null);
    try {
      await registrar({
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        senha: dados.senha,
      });
      setSucesso(true);
      setTimeout(() => router.push("/entrar"), 2000);
    } catch (err) {
      setErroServidor(
        err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente."
      );
    }
  };

  if (sucesso) {
    return (
      <div
        role="status"
        className="text-center py-8 space-y-3"
        aria-live="polite"
      >
        <CheckCircle2
          className="h-12 w-12 text-green mx-auto"
          aria-hidden="true"
        />
        <h3 className="font-semibold text-primary text-lg">Conta criada!</h3>
        <p className="text-sm text-neutral-600">
          Redirecionando para o login...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Formulário de cadastro"
    >
      {/* Erro do servidor */}
      {erroServidor && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {erroServidor}
        </div>
      )}

      {/* Nome */}
      <div className="space-y-1.5">
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          type="text"
          autoComplete="name"
          placeholder="Seu nome completo"
          erro={errors.nome?.message}
          {...register("nome")}
        />
        {errors.nome && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {errors.nome.message}
          </p>
        )}
      </div>

      {/* E-mail */}
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          erro={errors.email?.message}
          {...register("email")}
        />
        {errors.email && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Telefone */}
      <div className="space-y-1.5">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          type="tel"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          erro={errors.telefone?.message}
          {...register("telefone")}
        />
        {errors.telefone && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {errors.telefone.message}
          </p>
        )}
      </div>

      {/* Senha */}
      <div className="space-y-1.5">
        <Label htmlFor="senha">Senha</Label>
        <div className="relative">
          <Input
            id="senha"
            type={senhaVisivel ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            erro={errors.senha?.message}
            className="pr-10"
            {...register("senha")}
          />
          <button
            type="button"
            onClick={() => setSenhaVisivel((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
          >
            {senhaVisivel ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.senha && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {errors.senha.message}
          </p>
        )}
      </div>

      {/* Confirmar senha */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmarSenha">Confirmar senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          erro={errors.confirmarSenha?.message}
          {...register("confirmarSenha")}
        />
        {errors.confirmarSenha && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {errors.confirmarSenha.message}
          </p>
        )}
      </div>

      {/* Botão de submit */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>

      {/* Link para login */}
      <p className="text-center text-sm text-neutral-600">
        Já tem uma conta?{" "}
        <Link
          href="/entrar"
          className="text-primary font-medium hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
