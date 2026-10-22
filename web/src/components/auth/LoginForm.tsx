"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ----------------------
// Schema de validação
// ----------------------

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido"),
  senha: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ----------------------
// Componente
// ----------------------

interface LoginFormProps {
  redirect?: string;
}

export function LoginForm({ redirect = "/" }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Prop tem prioridade; fallback para searchParam
  const destino = redirect !== "/" ? redirect : (searchParams.get("redirect") ?? "/");

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (dados: LoginFormData) => {
    setErroServidor(null);
    try {
      await login({ email: dados.email, senha: dados.senha });
      router.push(destino);
    } catch (err) {
      setErroServidor(
        err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Formulário de login"
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

      {/* Senha */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="senha">Senha</Label>
          <button
            type="button"
            className="text-xs text-blue hover:underline"
            tabIndex={-1}
          >
            Esqueci minha senha
          </button>
        </div>
        <div className="relative">
          <Input
            id="senha"
            type={senhaVisivel ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
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
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      {/* Link para cadastro */}
      <p className="text-center text-sm text-neutral-600">
        Não tem uma conta?{" "}
        <Link
          href="/cadastrar"
          className="text-primary font-medium hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
